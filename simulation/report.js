(function(M) {
  var helpers = M['shared/ui-helpers'];
  var replay = { frames: [], index: 0, metric: 'strength', timer: null, result: null };
  var chart = { width: 900, height: 300, left: 68, right: 22, top: 24, bottom: 46 };
  function el(id) { return document.getElementById(id); }
  function escape(text) { return String(text).replace(/[&<>"']/g, function(c) { return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }
  function actual(value) { return (Math.max(0, M['shared/calc-engine'].toFixedPoint(value)) / 1000).toFixed(3); }
  function percent(value, initial) { return initial > 0 ? Math.max(0, Math.min(100, value / initial * 100)) : 0; }
  function bar(label, value, initial, digits) {
    var pct = percent(value, initial);
    return '<div class="army-stat"><span>' + label + '</span><strong>' + Math.max(0, value).toFixed(digits) +
      '</strong><span class="stat-initial"> / ' + initial.toFixed(digits) + '</span></div>' +
      '<div class="army-meter" role="meter" aria-label="' + label + '比例" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + pct.toFixed(3) + '"><span style="width:' + pct + '%"></span></div>';
  }
  function armyCard(side, frame, result, combatant, overview) {
    var attack = side === 'attacker';
    var name = attack ? '进攻方' : '防守方';
    var strength = frame[side + 'Strength'];
    var morale = frame[side + 'Morale'];
    var initialStrength = attack ? result.initialAttackerStrength : result.initialDefenderStrength;
    var initialMorale = attack ? result.initialAttackerMorale : result.initialDefenderMorale;
    var regiments = attack ? result.attRegiments : result.defRegiments;
    var displayed = regiments === 1 ? helpers.formatRemainingMorale(morale, strength, regiments) : '暂不支持多团';
    var caption = combatant ? helpers.translateUnit(combatant.unitName) + ' · 军科 ' + combatant.techLevel : '';
    var losses = overview ? '<p class="report-hint">累计兵损 ' + (initialStrength - strength).toFixed(2) + ' · 累计士气损失 ' + (initialMorale - morale).toFixed(2) + '</p>' : '';
    return '<article class="army-report ' + side + '"><div class="army-report-head"><h4>' + name + '</h4><span>' + escape(caption) + '</span></div>' +
      bar('剩余兵力', strength, initialStrength, 2) + bar('士气（内部实际）', morale, initialMorale, 3) +
      '<p class="morale-caption">游戏显示：<strong>' + displayed + '</strong> · 内部实际：<strong>' + actual(morale) + '</strong></p>' + losses + '</article>';
  }
  // Copy the already computed day records. No combat or random functions run here.
  function buildTimeline(result) {
    var frames = [{ day: 0, phase: null, round: 0, attackerStrength: result.initialAttackerStrength,
      defenderStrength: result.initialDefenderStrength, attackerMorale: result.initialAttackerMorale,
      defenderMorale: result.initialDefenderMorale }];
    result.rounds.forEach(function(round) {
      ['fire', 'shock'].forEach(function(phase) {
        if (!round[phase]) return;
        round[phase].days.forEach(function(day) {
          frames.push({ day: day.day, phase: phase, round: round.round,
            attackerDice: round[phase].attackerDice, defenderDice: round[phase].defenderDice,
            attackerStrength: Math.max(0, day.attackerStrengthRemaining), defenderStrength: Math.max(0, day.defenderStrengthRemaining),
            attackerMorale: Math.max(0, day.attackerCurrentMorale), defenderMorale: Math.max(0, day.defenderCurrentMorale) });
        });
      });
    });
    return frames;
  }
  function renderOverview(dom, result, attacker, defender) {
    var final = {attackerStrength:result.finalAttackerStrength, defenderStrength:result.finalDefenderStrength,
      attackerMorale:result.finalAttackerMorale, defenderMorale:result.finalDefenderMorale};
    var name = result.winner === 'attacker' ? '进攻方' : '防守方';
    var verdict = result.winner === 'draw' ? '双方战平' : name + (result.winReason ? '获胜' : '占优');
    var reason = result.winReason || '已完成设定轮次，按原模型累计兵损比较判定';
    dom.simSummary.innerHTML = '<div class="battle-verdict ' + (result.winner || 'draw') + '"><div><span class="report-kicker">战斗结论</span><h3>' + verdict + '</h3><p>' + escape(reason) + '</p></div><div class="battle-duration"><strong>' + result.totalDays + '</strong><span>天 · ' + result.rounds.length + ' 轮</span></div></div><div class="army-report-grid">' +
      armyCard('attacker', final, result, attacker, true) + armyCard('defender', final, result, defender, true) + '</div>';
    ['attacker', 'defender'].forEach(function(side) {
      var day = side === 'attacker' ? result.attackerMoraleBreakDay : result.defenderMoraleBreakDay;
      var note = document.createElement('p'); note.className = 'report-hint';
      note.textContent = (side === 'attacker' ? '进攻方' : '防守方') + '士气溃败：' + (day === null ? '未溃败' : '第 ' + day + ' 天');
      dom.simSummary.querySelector('.army-report.' + side).append(note);
    });
    loadReplay(result, attacker, defender);
  }
  function dayLabel(frame) { return frame.day === 0 ? '交战前' : '第 ' + frame.day + ' 天 · 第 ' + frame.round + ' 轮 · ' + (frame.phase === 'fire' ? '火力' : '冲击') + '阶段'; }
  function pause(status) {
    clearTimeout(replay.timer); replay.timer = null;
    el('replay-play').textContent = '播放'; el('replay-play').setAttribute('aria-pressed', 'false');
    el('replay-status').textContent = status || '已暂停';
  }
  function schedule() {
    replay.timer = setTimeout(function() {
      replay.timer = null;
      if (replay.index >= replay.frames.length - 1) { pause('播放结束'); return; }
      replay.index++; updateFrame();
      if (replay.index === replay.frames.length - 1) pause('播放结束'); else schedule();
    }, 700 / Number(el('replay-speed').value));
  }
  function play() {
    if (replay.frames.length <= 1) return;
    if (replay.index >= replay.frames.length - 1) { replay.index = 0; updateFrame(); }
    el('replay-play').textContent = '暂停'; el('replay-play').setAttribute('aria-pressed', 'true');
    el('replay-status').textContent = '正在播放'; schedule();
  }
  function seek(index) {
    pause(); replay.index = Math.max(0, Math.min(replay.frames.length - 1, Math.round(index))); updateFrame();
  }
  function updateFrame() {
    var frame = replay.frames[replay.index]; if (!frame) return;
    el('replay-day').textContent = dayLabel(frame) + (frame.day ? ' · 骰子 ' + frame.attackerDice + ' / ' + frame.defenderDice : '');
    el('replay-position').textContent = frame.day + ' / ' + replay.result.totalDays + ' 天';
    el('replay-progress').value = replay.index;
    el('replay-progress').setAttribute('aria-valuetext', dayLabel(frame));
    el('replay-armies').innerHTML = armyCard('attacker', frame, replay.result, replay.attacker, false) + armyCard('defender', frame, replay.result, replay.defender, false);
    document.querySelectorAll('#daily-log-tbody tr').forEach(function(row) { row.classList.toggle('replay-current-row', Number(row.cells[0].textContent) === frame.day); });
    drawChart(); showReadout(replay.index);
  }
  function showReadout(index) {
    var frame = replay.frames[index]; if (!frame) return;
    var morale = replay.metric === 'morale';
    el('trend-readout').textContent = dayLabel(frame) + ' ｜ ' + (morale ? '士气（内部实际）' : '剩余兵力') + '：进攻方 ' +
      (morale ? actual(frame.attackerMorale) : frame.attackerStrength.toFixed(2)) + ' · 防守方 ' + (morale ? actual(frame.defenderMorale) : frame.defenderStrength.toFixed(2));
    var cursor = el('battle-trend').querySelector('.trend-hover');
    if (cursor) { var x = xFor(index); cursor.setAttribute('x1', x); cursor.setAttribute('x2', x); }
  }
  function xFor(index) { return chart.left + index / Math.max(1, replay.frames.length - 1) * (chart.width - chart.left - chart.right); }
  function drawChart() {
    var frames = replay.frames; if (!frames.length) return;
    chart.width = Math.max(250, Math.min(900, el('battle-trend').clientWidth || 900));
    chart.height = chart.width < 500 ? 260 : 300;
    chart.left = chart.width < 500 ? 52 : 68;
    var right = chart.width - chart.right, baseline = chart.height - chart.bottom;
    var metric = replay.metric === 'morale' ? 'Morale' : 'Strength';
    var max = Math.max(1, frames[0]['attacker' + metric], frames[0]['defender' + metric]);
    var styles = getComputedStyle(document.documentElement);
    var grid = styles.getPropertyValue('--chart-grid').trim(), text = styles.getPropertyValue('--muted').trim();
    function y(value) { return chart.top + (1 - value / max) * (baseline - chart.top); }
    var svg = '<svg viewBox="0 0 ' + chart.width + ' ' + chart.height + '" aria-label="' + (metric === 'Morale' ? '内部实际士气' : '剩余兵力') + '每日趋势" role="img">';
    for (var i = 0; i <= 4; i++) {
      var value = max * i / 4, py = y(value);
      svg += '<line x1="' + chart.left + '" x2="' + right + '" y1="' + py + '" y2="' + py + '" stroke="' + grid + '"/><text x="' + (chart.left - 10) + '" y="' + (py + 4) + '" text-anchor="end" fill="' + text + '" font-size="13">' + value.toFixed(metric === 'Morale' ? 2 : 0) + '</text>';
    }
    var tickStep = Math.max(1, Math.ceil((frames.length - 1) / (chart.width < 500 ? 3 : 6)));
    frames.forEach(function(frame, index) {
      if (index % tickStep === 0 || index === frames.length - 1) svg += '<text x="' + xFor(index) + '" y="' + (baseline + 24) + '" text-anchor="middle" fill="' + text + '" font-size="13">' + frame.day + '</text>';
    });
    svg += '<text x="' + (chart.width / 2) + '" y="' + (chart.height - 2) + '" text-anchor="middle" fill="' + text + '" font-size="12">战斗日</text>';
    ['attacker', 'defender'].forEach(function(side) {
      var color = styles.getPropertyValue(side === 'attacker' ? '--attack' : '--defend').trim();
      function path(list) { return list.map(function(f, i) { return (i ? 'L' : 'M') + xFor(i).toFixed(2) + ',' + y(f[side + metric]).toFixed(2); }).join(' '); }
      var dash = side === 'defender' ? ' stroke-dasharray="7 4"' : '';
      svg += '<path data-side="' + side + '" d="' + path(frames) + '" fill="none" stroke="' + color + '" stroke-width="2.5" opacity=".25"' + dash + '/>';
      svg += '<path class="trend-played" data-side="' + side + '" d="' + path(frames.slice(0, replay.index + 1)) + '" fill="none" stroke="' + color + '" stroke-width="3"' + dash + '/>';
      svg += '<circle cx="' + xFor(replay.index) + '" cy="' + y(frames[replay.index][side + metric]) + '" r="5" fill="' + color + '"/>';
    });
    svg += '<line class="trend-hover" x1="' + xFor(replay.index) + '" x2="' + xFor(replay.index) + '" y1="20" y2="' + baseline + '" stroke="' + text + '" stroke-dasharray="3 4"/></svg>';
    el('battle-trend').innerHTML = svg;
  }
  function pointerIndex(event) {
    var rect = el('battle-trend').querySelector('svg').getBoundingClientRect();
    var svgX = (event.clientX - rect.left) / rect.width * chart.width;
    return Math.max(0, Math.min(replay.frames.length - 1, Math.round((svgX - chart.left) / (chart.width - chart.left - chart.right) * (replay.frames.length - 1))));
  }
  function loadReplay(result, attacker, defender) {
    pause(); replay.result = result; replay.frames = buildTimeline(result); replay.index = replay.frames.length - 1;
    replay.metric = 'strength'; replay.attacker = attacker; replay.defender = defender;
    el('replay-speed').value = '1'; el('replay-progress').max = replay.frames.length - 1;
    el('replay-play').disabled = replay.frames.length <= 1; el('replay-restart').disabled = replay.frames.length <= 1;
    setMetric('strength');
  }
  function setMetric(metric) {
    replay.metric = metric;
    el('trend-strength').setAttribute('aria-pressed', String(metric === 'strength'));
    el('trend-morale').setAttribute('aria-pressed', String(metric === 'morale'));
    updateFrame();
  }
  function initReplay() {
    el('replay-play').addEventListener('click', function() { if (replay.timer !== null) pause(); else play(); });
    el('replay-restart').addEventListener('click', function() { seek(0); play(); });
    el('replay-speed').addEventListener('change', function() { if (replay.timer !== null) { clearTimeout(replay.timer); schedule(); } });
    el('replay-progress').addEventListener('input', function() { seek(Number(this.value)); });
    el('trend-strength').addEventListener('click', function() { setMetric('strength'); });
    el('trend-morale').addEventListener('click', function() { setMetric('morale'); });
    el('battle-trend').addEventListener('pointermove', function(event) { if (replay.frames.length) showReadout(pointerIndex(event)); });
    el('battle-trend').addEventListener('pointerleave', function() { showReadout(replay.index); });
    el('battle-trend').addEventListener('click', function(event) { if (replay.frames.length) seek(pointerIndex(event)); });
    el('battle-trend').addEventListener('keydown', function(event) {
      var target = {ArrowLeft:replay.index - 1, ArrowRight:replay.index + 1, Home:0, End:replay.frames.length - 1}[event.key];
      if (target !== undefined) { event.preventDefault(); seek(target); }
    });
    document.addEventListener('visibilitychange', function() { if (document.hidden) pause(); });
    new ResizeObserver(function() {
      if (replay.frames.length && el('battle-trend').clientWidth) { drawChart(); showReadout(replay.index); }
    }).observe(el('battle-trend'));
  }
  M['simulation/report'] = { renderOverview:renderOverview, buildTimeline:buildTimeline, initReplay:initReplay, pause:pause };
})(window._M = window._M || {});
