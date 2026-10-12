// Run with Node and Playwright installed, or the Codex bundled dependency runtime.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { execFileSync } = require('node:child_process');
let playwright;
try { playwright = require('playwright'); } catch {
  playwright = require(process.env.PLAYWRIGHT_MODULE || path.join(process.env.USERPROFILE, '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'));
}
const root = path.resolve(__dirname, '..');
const output = process.env.EU4_SCREENSHOTS;
const errors = [];
let browser;
const config = {
  'attacker-strength':850, 'defender-strength':950, 'attacker-techLevel':12, 'defender-techLevel':10,
  'attacker-leaderFire':3, 'defender-leaderShock':2, 'attacker-discipline':10, 'defender-damageTaken':5,
  'attacker-moraleBonus':20, 'defender-armyTradition':40, 'template-discipline':5
};
async function load(baseline = false) {
  const page = await browser.newPage({viewport:{width:1440,height:1100}});
  page.on('pageerror', e => errors.push(e.message));
  page.on('dialog', dialog => dialog.dismiss());
  await page.addInitScript(() => { window.__randomCalls = 0; Math.random = () => { window.__randomCalls++; return .421; }; });
  if (baseline) await page.route('**/shared/state.js', route => route.fulfill({body:execFileSync('git', ['show','HEAD:shared/state.js'], {cwd:root,encoding:'utf8'}),contentType:'text/javascript'}));
  for (const [file, module, method, capture] of [
    ['shared/battle-sim.js','shared/battle-sim','simulateBattleWithMorale','__simulationResult'],
    ['single/logic.js','single/logic','calculateSingle','__singleResult'],
    ['ranking/logic.js','ranking/logic','runUnitTournament','__rankingResult']
  ]) {
    await page.route('**/' + file, route => route.fulfill({contentType:'text/javascript', body:fs.readFileSync(path.join(root,file),'utf8') +
      `\n(function(){var original=window._M[${JSON.stringify(module)}][${JSON.stringify(method)}];window._M[${JSON.stringify(module)}][${JSON.stringify(method)}]=function(){window.__combatCalls=(window.__combatCalls||0)+1;var result=original.apply(this,arguments);window[${JSON.stringify(capture)}]=result;return result;};})();`}));
  }
  await page.goto(pathToFileURL(path.join(root,'index.html')).href);
  await page.locator('#welcome-dialog-close').click();
  return page;
}
async function setValues(page, values) {
  await page.evaluate(values => {
    for (const [id, value] of Object.entries(values)) {
      const node = document.getElementById(id); node.value = value;
      node.dispatchEvent(new Event('input', {bubbles:true})); node.dispatchEvent(new Event('change', {bubbles:true}));
    }
  }, values);
}
async function calculate(page, mode) {
  if (await page.locator('#error-dialog').getAttribute('aria-hidden')==='false') await page.locator('#error-dialog-close').click();
  await page.locator('#mode-' + mode).check(); await page.locator('#calculate').click();
  await page.waitForFunction(() => document.body.classList.contains('result-view'));
}
async function back(page) { await page.locator('#back-button').click(); }
async function screenshot(page, name) {
  if (output) {
    await page.waitForFunction(() => {
      const plot=document.getElementById('battle-trend'), svg=plot.querySelector('svg');
      return !plot.getClientRects().length || (svg && svg.viewBox.baseVal.width===Math.max(250,Math.min(900,plot.clientWidth)));
    });
    fs.mkdirSync(output, {recursive:true}); await page.screenshot({path:path.join(output,name+'.png'),fullPage:true});
  }
}
async function overflow(page, width) {
  await page.setViewportSize({width,height:1000});
  const state = await page.evaluate(() => ({width:innerWidth,scroll:document.documentElement.scrollWidth,
    controls:[...document.querySelectorAll('button,select,input,summary')].filter(e => e.getBoundingClientRect().width && !e.closest('.sim-table-wrap, #ranking-score-chart, .chart-lightbox-body')).filter(e => {const r=e.getBoundingClientRect();return r.left < -1 || r.right > innerWidth + 1;}).map(e=>e.id || e.textContent.trim())}));
  assert.ok(state.scroll <= width, JSON.stringify(state)); assert.deepEqual(state.controls, [],JSON.stringify(state));
}
async function assertFrame(page, index) {
  await page.locator('#replay-progress').evaluate((node,index) => { node.value=index;node.dispatchEvent(new Event('input',{bubbles:true})); },index);
  const checked = await page.evaluate(index => {
    const r=window.__simulationResult, frame=window._M['simulation/report'].buildTimeline(r)[index];
    const sides=['attacker','defender'];
    return sides.map(side=>{
      const prefix=side==='attacker'?'Attacker':'Defender';
      const card=document.querySelector('#replay-armies .'+side);
      const numbers=[...card.querySelectorAll('.army-stat strong')].map(n=>n.textContent);
      const meters=[...card.querySelectorAll('[role=meter]')].map(n=>Number(n.getAttribute('aria-valuenow')));
      const s=frame[side+'Strength'],m=frame[side+'Morale'];
      const expected=[s.toFixed(2),m.toFixed(3)];
      const ratio=(v,initial)=>initial>0?Number(Math.min(100,Math.max(0,v/initial*100)).toFixed(3)):0;
      const actual=(Math.max(0,window._M['shared/calc-engine'].toFixedPoint(m))/1000).toFixed(3);
      const reg=side==='attacker'?r.attRegiments:r.defRegiments;
      const displayed=reg===1?window._M['shared/ui-helpers'].formatRemainingMorale(m,s,reg):'暂不支持多团';
      const caption=card.querySelector('.morale-caption').textContent;
      const row=index?document.querySelectorAll('#daily-log-tbody tr')[index-1]:null;
      return {numbers,expected,meters,expectedMeters:[ratio(s,r['initial'+prefix+'Strength']),ratio(m,r['initial'+prefix+'Morale'])],captionOK:caption.includes(displayed)&&caption.includes(actual),
        rowOK:!row||(row.cells[side==='attacker'?7:8].textContent===s.toFixed(2)&&row.cells[side==='attacker'?11:12].textContent.includes(actual)),
        dayOK:document.getElementById('replay-day').textContent.includes(index?'第 '+frame.day+' 天':'交战前'),
        pathPoints:document.querySelector('.trend-played[data-side='+side+']').getAttribute('d').split(' ').length};
    });
  },index);
  for(const item of checked){assert.deepEqual(item.numbers,item.expected);assert.deepEqual(item.meters,item.expectedMeters);assert.ok(item.captionOK&&item.rowOK&&item.dayOK);assert.equal(item.pathPoints,index+1);}
}
(async()=>{
  execFileSync('git',['diff','--exit-code','HEAD','--','shared/calc-engine.js','shared/morale-engine.js','shared/battle-sim.js','single/logic.js','simulation/logic.js','ranking/logic.js','ranking/cross-tech-logic.js','data/units.js','data/tech-stats.js'],{cwd:root});
  const chrome = process.env.CHROME_PATH || (process.platform==='win32'?'C:/Program Files/Google/Chrome/Application/chrome.exe':undefined);
  browser=await playwright.chromium.launch({headless:true,...(chrome?{executablePath:chrome}:{})});
  const page=await load(), original=await load(true);
  assert.equal(await page.locator('#attacker-fields .parameter-section').count(),4);
  const allControls=await page.evaluate(()=>Object.entries(window._M['shared/state'].sideSchemas).every(([side,list])=>list.every(s=>document.querySelectorAll('#'+side+'-'+s.key).length===1)));
  assert.ok(allControls);
  const summary=page.locator('#attacker-fields .parameter-section summary').first();
  await summary.focus();await page.keyboard.press('Enter');await page.locator('#attacker-discipline').fill('15');await summary.click();
  assert.match(await summary.textContent(),/1 项已修改/);
  const inputs=await page.evaluate(()=>window._M['shared/state'].readSide('attacker'));
  for(const mode of ['sim','ranking','single'])await page.locator('#mode-'+mode).check();
  assert.deepEqual(await page.evaluate(()=>window._M['shared/state'].readSide('attacker')),inputs);
  assert.equal(await page.locator('#attacker-fields .parameter-section').first().getAttribute('open'),null);
  await setValues(page,config);await setValues(original,config);
  for(const mode of ['single','sim','ranking']){
    await calculate(page,mode);await calculate(original,mode);
    const key={single:'__singleResult',sim:'__simulationResult',ranking:'__rankingResult'}[mode];
    assert.deepEqual(await page.evaluate(key=>window[key],key),await original.evaluate(key=>window[key],key));
    for(const width of [1440,900,390,320])await overflow(page,width);
    await page.setViewportSize({width:1440,height:1100});
    await screenshot(page,'report-'+mode);
    if(mode==='single')assert.match(await page.locator('#single-summary').textContent(),/第 1 天/);
    if(mode==='sim'){
      await page.setViewportSize({width:390,height:1000});await screenshot(page,'report-sim-mobile');
      await page.locator('#daily-log summary').click();
      await page.locator('#daily-log .sim-table-wrap').focus();await page.keyboard.press('ArrowRight');
      await page.waitForFunction(()=>document.querySelector('#daily-log .sim-table-wrap').scrollLeft>0);
      await page.locator('#daily-log summary').click();await page.setViewportSize({width:1440,height:1100});
      const length=await page.evaluate(()=>window._M['simulation/report'].buildTimeline(window.__simulationResult).length);
      assert.equal(length-1,await page.locator('#daily-log-tbody tr').count());
      for(let i=0;i<length;i++)await assertFrame(page,i);
      await page.locator('#trend-morale').click();await assertFrame(page,Math.min(4,length-1));
      assert.equal(await page.locator('#trend-morale').getAttribute('aria-pressed'),'true');
      const readout=await page.locator('#trend-readout').textContent();
      const svg=await page.locator('#battle-trend svg').boundingBox();await page.mouse.move(svg.x+svg.width*.45,svg.y+svg.height*.5);
      assert.notEqual(await page.locator('#trend-readout').textContent(),readout);
      const hover=await page.locator('#trend-readout').textContent();await page.mouse.click(svg.x+svg.width*.45,svg.y+svg.height*.5);
      assert.equal(await page.locator('#trend-readout').textContent(),hover);
      await page.locator('#battle-trend').focus();await page.keyboard.press('Home');assert.equal(await page.locator('#replay-progress').inputValue(),'0');
      await page.keyboard.press('ArrowRight');assert.equal(await page.locator('#replay-progress').inputValue(),'1');
      await page.keyboard.press('End');assert.equal(await page.locator('#replay-progress').inputValue(),String(length-1));
      const calls=await page.evaluate(()=>({combat:window.__combatCalls,random:window.__randomCalls,result:JSON.stringify(window.__simulationResult)}));
      await page.clock.install();await page.clock.pauseAt(new Date());
      await page.locator('#replay-restart').click();assert.equal(await page.locator('#replay-progress').inputValue(),'0');
      await page.clock.runFor(701);assert.equal(await page.locator('#replay-progress').inputValue(),'1');
      await page.locator('#replay-play').click();await page.clock.runFor(2000);assert.equal(await page.locator('#replay-progress').inputValue(),'1');
      await page.locator('#replay-speed').selectOption('4');await page.locator('#replay-play').click();await page.clock.runFor(176);assert.equal(await page.locator('#replay-progress').inputValue(),'2');
      await page.clock.runFor(175*length);assert.equal(await page.locator('#replay-status').textContent(),'播放结束');assert.equal(await page.locator('#replay-play').getAttribute('aria-pressed'),'false');
      assert.deepEqual(await page.evaluate(()=>({combat:window.__combatCalls,random:window.__randomCalls,result:JSON.stringify(window.__simulationResult)})),calls);
      for(const speed of ['0.5','2']) {
        await assertFrame(page,0);await page.locator('#replay-speed').selectOption(speed);await page.locator('#replay-play').click();
        const delay=700/Number(speed);await page.clock.runFor(delay-1);assert.equal(await page.locator('#replay-progress').inputValue(),'0');
        await page.clock.runFor(2);assert.equal(await page.locator('#replay-progress').inputValue(),'1');await page.locator('#replay-play').click();
      }
      await assertFrame(page,length-1);
      await page.locator('#replay-play').click();assert.equal(await page.locator('#replay-progress').inputValue(),'0');
      await back(page);await page.clock.runFor(1000);assert.equal(await page.locator('#replay-progress').inputValue(),'0');
      await calculate(page,'sim');assert.equal(await page.locator('#replay-speed').inputValue(),'1');assert.equal(await page.locator('#trend-strength').getAttribute('aria-pressed'),'true');
      assert.equal(await page.locator('#replay-progress').inputValue(),String(length-1));assert.equal(await page.locator('#replay-play').getAttribute('aria-pressed'),'false');
    }
    if(mode==='ranking'){
      await page.setViewportSize({width:390,height:1000});await screenshot(page,'report-ranking-mobile');await page.setViewportSize({width:1440,height:1100});
      assert.equal(await page.locator('.podium-card').count(),3);
      const last=await page.locator('.ranking-score-row').count()-1;
      await page.locator('#ranking-unit-select').selectOption(String(last));
      assert.equal(await page.locator('.ranking-score-row[aria-pressed=true]').getAttribute('data-rank'),String(last));
      assert.match(await page.locator('#ranking-selection').textContent(),new RegExp('第 '+(last+1)+' 名'));
      assert.equal(await page.locator('#ranking-tbody tr.ranking-selected').count(),1);
      const promise=page.waitForEvent('download');await page.locator('#download-ranking-log').click();const download=await promise;assert.equal(await download.failure(),null);
    }
    await back(page); await back(original);
    console.log(mode+': original result equality, 4 viewport widths and interactions passed');
  }
  // Additional dice modes, partial rounds, early finish and the maximum duration.
  for(const [name,values] of [
    ['one-round',{'sim-rounds':1}],
    ['manual',{'sim-rounds':5,'sim-dice-mode':'manual','sim-dice-fire-att':'1,9,3,6,4','sim-dice-fire-def':'8,2,4,5,1','sim-dice-shock-att':'5,2,7,0,6','sim-dice-shock-def':'9,0,2,1,4'}],
    ['random',{'sim-dice-mode':'random'}],
    ['maximum-duration',{'sim-rounds':20,'sim-dice-mode':'fixed','sim-dice-fixed-value':0,'attacker-extraMilitaryTactics':100,'defender-extraMilitaryTactics':100}],
    ['early-defeat',{'sim-rounds':20,'attacker-extraMilitaryTactics':0,'defender-extraMilitaryTactics':0,'attacker-discipline':200,'attacker-fireDamage':20}],
    ['multi-regiment',{'attacker-strength':2000,'defender-strength':2000}]
  ]){
    await setValues(page,values);await setValues(original,values);await calculate(page,'sim');await calculate(original,'sim');
    assert.deepEqual(await page.evaluate(()=>window.__simulationResult),await original.evaluate(()=>window.__simulationResult));
    const length=await page.evaluate(()=>window._M['simulation/report'].buildTimeline(window.__simulationResult).length);
    for(let i=0;i<length;i++)await assertFrame(page,i);
    if(name==='maximum-duration') {
      assert.ok(length > 60 && length <= 121);
      const result=await page.evaluate(()=>window.__simulationResult);
      if(result.totalDays<120)assert.ok(result.winReason); // Passive morale can end a 20-round run early.
    }
    if(name==='multi-regiment')assert.match(await page.locator('#replay-armies .morale-caption').first().textContent(),/暂不支持多团/);
    if(name==='random'){
      const count=await page.evaluate(()=>window.__randomCalls);await page.locator('#replay-restart').click();await page.clock.runFor(700*length);assert.equal(await page.evaluate(()=>window.__randomCalls),count);
    }
    await back(page);await back(original);console.log(name+': every day matches engine and daily log');
  }
  await page.clock.resume();
  await calculate(page,'ranking');
  await page.locator('#cross-tech-ranking-btn').click();await page.keyboard.press('Tab');assert.equal(await page.locator('#cross-tech-confirm-cancel').evaluate(e=>e===document.activeElement),true);
  await page.keyboard.press('Tab');assert.equal(await page.locator('#cross-tech-confirm-start').evaluate(e=>e===document.activeElement),true);
  await page.keyboard.press('Escape');assert.equal(await page.locator('#cross-tech-ranking-btn').evaluate(e=>e===document.activeElement),true);
  await page.locator('#cross-tech-ranking-btn').click();await page.locator('#cross-tech-confirm-start').click();
  await page.waitForFunction(()=>document.getElementById('cross-tech-section').style.display!== 'none' && document.getElementById('cross-tech-confirm-dialog').style.display==='none',{},{timeout:60000});
  const eligible=await page.evaluate(()=>Array.from({length:33},(_,tech)=>tech).filter(tech=>window._M['ranking/logic'].listTournamentCandidates(tech).length>=2));
  assert.deepEqual(await page.locator('#cross-tech-tbody tr td:first-child').allTextContents(),eligible.map(String));
  for(const width of [1440,900,390,320])await overflow(page,width);
  await page.setViewportSize({width:1440,height:1100});await page.locator('#toggle-cross-tech-charts').click();
  assert.equal(await page.locator('#cross-tech-charts-panel svg').count(),4);
  await screenshot(page,'report-cross-tech');
  await page.locator('#cross-tech-infantry-chart .cross-tech-chart-shell').focus();await page.keyboard.press('Enter');
  assert.equal(await page.locator('#chart-lightbox').getAttribute('aria-hidden'),'false');
  const legend=page.locator('#chart-lightbox .cross-tech-chart-legend-item').first();await legend.focus();await page.keyboard.press('Enter');
  assert.equal(await legend.getAttribute('aria-pressed'),'true');
  await page.locator('.cross-tech-show-names-btn').click();assert.ok(await page.locator('.cross-tech-unit-name-label').count()>0);
  await page.keyboard.press('Escape');assert.equal(await page.locator('#chart-lightbox').getAttribute('aria-hidden'),'true');
  await page.locator('#show-cross-tech-template').click();await overflow(page,390);await page.keyboard.press('Escape');
  await page.locator('#toggle-cross-tech-table-mode').click();
  await page.locator('#cross-tech-filter-type-btn').focus();await page.keyboard.press('ArrowDown');
  assert.equal(await page.locator('#cross-tech-filter-type-btn').getAttribute('aria-expanded'),'true');
  await page.keyboard.press('Space');assert.ok(await page.locator('.cross-tech-cell-dim').count()>0);await page.keyboard.press('Escape');
  assert.equal(await page.locator('#cross-tech-filter-type-btn').evaluate(e=>e===document.activeElement),true);
  await page.locator('#cross-tech-clear-filter').click();assert.equal(await page.locator('.cross-tech-cell-dim').count(),0);
  await page.locator('#cross-tech-filter-type-btn').click();await page.locator('#cross-tech-filter-type-menu input').first().check();
  assert.ok(await page.locator('.cross-tech-cell-dim').count()>0);await page.keyboard.press('Escape');await page.locator('#cross-tech-clear-filter').click();
  for(const width of [390,320]){await overflow(page,width);await page.locator('#cross-tech-filter-group-btn').click();await overflow(page,width);await page.keyboard.press('Escape');}
  await page.setViewportSize({width:390,height:1000});await screenshot(page,'report-cross-tech-mobile');
  const csvPromise=page.waitForEvent('download');await page.locator('#download-cross-tech').click();assert.equal(await (await csvPromise).failure(),null);
  await page.emulateMedia({reducedMotion:'reduce'});
  assert.equal(await page.locator('.cross-tech-chart-line').first().evaluate(e=>getComputedStyle(e).transitionDuration),'0s');
  await back(page);await page.locator('#mode-sim').check();await page.locator('#sim-rounds').fill('0');await page.locator('#calculate').click();
  assert.equal(await page.locator('#error-dialog').getAttribute('aria-hidden'),'false');await page.keyboard.press('Tab');assert.equal(await page.locator('#error-dialog-close').evaluate(e=>e===document.activeElement),true);await page.keyboard.press('Escape');
  assert.equal(await page.locator('#calculate').evaluate(e=>e===document.activeElement),true);
  await page.locator('#attacker-techLevel').fill('3');await page.locator('#attacker-unitType').selectOption('Artillery');
  assert.equal(await page.locator('#attacker-unitType').inputValue(),'Infantry');
  assert.match(await page.locator('#error-dialog-message').textContent(),/7军科/);
  assert.equal(await page.locator('#error-dialog-title').textContent(),'使用提示');await page.keyboard.press('Escape');
  await page.locator('#attacker-leaderSiege').click({force:true});assert.match(await page.locator('#error-dialog-message').textContent(),/围城/);await page.keyboard.press('Escape');
  assert.deepEqual(errors,[]);console.log('cross-tech all eligible levels, charts, highlighting, name labels, modal focus, CSV, error dialog and reduced motion passed');
  await browser.close();
})().catch(async error=>{console.error(error);if(browser)await browser.close();process.exit(1);});
