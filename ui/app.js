import { UNIT_DATA } from "./unit-data.js";

const GROUP_TRANSLATIONS = {
  "Western": "西欧",
  "Eastern": "东欧",
  "Anatolian (Ottoman)": "安纳托利亚（奥斯曼）",
  "Muslim": "穆斯林",
  "Indian": "印度",
  "Chinese": "中华",
  "Nomadic": "游牧",
  "African Groups (Central / East / West African)": "非洲组（中非/东非/西非）",
  "Aboriginal": "原住民",
  "High American (Fantasy / Inca)": "高美洲（幻想/印加）",
  "Native American Groups": "美洲原住民组",
  "Polynesian": "波利尼西亚",
  "Shared": "通用"
};

const UNIT_TRANSLATIONS = {
  "Houfnice": "胡夫尼采火炮",
  "Large Cast Bronze Mortar": "大型铸铜迫击炮",
  "Culverin": "长炮",
  "Pedrero": "佩德雷罗炮",
  "Large Cast Iron Cannon": "大型铸铁炮",
  "Small Cast Iron Cannon": "小型铸铁炮",
  "Chambered Demi Cannon": "后装半加农炮",
  "Demi-Culverin": "半长炮",
  "Leather Cannon": "皮制火炮",
  "Chambered Cannon": "后装加农炮",
  "Swivel Cannon": "回旋炮",
  "Howitzer": "榴弹炮",
  "Coehorn Mortar": "库霍恩迫击炮",
  "Horse Artillery": "骑马炮兵",
  "Royal Mortar": "皇家迫击炮",
  "Licorne": "独角兽炮",
  "Flying Battery": "机动炮兵连",
  "Grand Battery": "大炮兵连",
  "Halberd Infantry": "戟兵",
  "Latin Medieval Infantry": "拉丁中世纪步兵",
  "Galloglaigh Infantry": "盖洛格拉斯步兵",
  "Longbow": "长弓兵",
  "Men at Arms": "披甲兵",
  "Condotta Infantry": "孔多塔步兵",
  "Landsknecht Infantry": "兰茨克内希特步兵",
  "Free Shooter Infantry": "自由射手步兵",
  "Tercio Infantry": "大方阵步兵",
  "Maurician Infantry": "毛里茨步兵",
  "Caroline Infantry": "卡洛林步兵",
  "Line Infantry": "线列步兵",
  "Redcoat Infantry": "红衣步兵",
  "Blue Coat Infantry": "蓝衣步兵",
  "White Coat Infantry": "白衣步兵"
};

const PHASES = [
  { value: "fire", label: "火力" },
  { value: "shock", label: "冲击" }
];

const UNIT_TYPES = [
  { value: "Infantry", label: "步兵" },
  { value: "Cavalry", label: "骑兵" },
  { value: "Artillery", label: "炮兵" }
];

const TECH_STATS = [
  { infantryFire: 0.25, cavalryFire: 0.0, artilleryFire: 0.0, infantryShock: 0.2, cavalryShock: 0.8, artilleryShock: 0.0, militaryTactics: 0.5 },
  { infantryFire: 0.35, cavalryFire: 0.0, artilleryFire: 0.0, infantryShock: 0.3, cavalryShock: 0.8, artilleryShock: 0.0, militaryTactics: 0.5 },
  { infantryFire: 0.35, cavalryFire: 0.0, artilleryFire: 0.0, infantryShock: 0.5, cavalryShock: 1.0, artilleryShock: 0.0, militaryTactics: 0.5 },
  { infantryFire: 0.35, cavalryFire: 0.0, artilleryFire: 0.0, infantryShock: 0.5, cavalryShock: 1.0, artilleryShock: 0.0, militaryTactics: 0.5 },
  { infantryFire: 0.35, cavalryFire: 0.0, artilleryFire: 0.0, infantryShock: 0.5, cavalryShock: 1.0, artilleryShock: 0.0, militaryTactics: 0.75 },
  { infantryFire: 0.35, cavalryFire: 0.0, artilleryFire: 0.0, infantryShock: 0.65, cavalryShock: 1.2, artilleryShock: 0.0, militaryTactics: 0.75 },
  { infantryFire: 0.55, cavalryFire: 0.0, artilleryFire: 0.0, infantryShock: 0.95, cavalryShock: 1.2, artilleryShock: 0.0, militaryTactics: 1.0 },
  { infantryFire: 0.55, cavalryFire: 0.0, artilleryFire: 1.0, infantryShock: 0.95, cavalryShock: 1.2, artilleryShock: 0.05, militaryTactics: 1.25 },
  { infantryFire: 0.8, cavalryFire: 0.0, artilleryFire: 1.0, infantryShock: 0.95, cavalryShock: 2.0, artilleryShock: 0.05, militaryTactics: 1.25 },
  { infantryFire: 0.8, cavalryFire: 0.0, artilleryFire: 1.0, infantryShock: 0.95, cavalryShock: 2.0, artilleryShock: 0.05, militaryTactics: 1.5 },
  { infantryFire: 0.8, cavalryFire: 0.0, artilleryFire: 1.0, infantryShock: 0.95, cavalryShock: 2.0, artilleryShock: 0.05, militaryTactics: 1.5 },
  { infantryFire: 0.8, cavalryFire: 0.5, artilleryFire: 1.0, infantryShock: 1.15, cavalryShock: 2.0, artilleryShock: 0.05, militaryTactics: 1.5 },
  { infantryFire: 0.8, cavalryFire: 0.5, artilleryFire: 1.0, infantryShock: 1.15, cavalryShock: 2.0, artilleryShock: 0.05, militaryTactics: 1.75 },
  { infantryFire: 0.8, cavalryFire: 0.5, artilleryFire: 1.4, infantryShock: 1.15, cavalryShock: 2.0, artilleryShock: 0.15, militaryTactics: 1.75 },
  { infantryFire: 1.1, cavalryFire: 0.5, artilleryFire: 1.4, infantryShock: 1.15, cavalryShock: 2.0, artilleryShock: 0.15, militaryTactics: 1.75 },
  { infantryFire: 1.1, cavalryFire: 0.5, artilleryFire: 1.4, infantryShock: 1.15, cavalryShock: 2.0, artilleryShock: 0.15, militaryTactics: 2.0 },
  { infantryFire: 1.1, cavalryFire: 0.5, artilleryFire: 2.4, infantryShock: 1.15, cavalryShock: 2.0, artilleryShock: 0.25, militaryTactics: 2.0 },
  { infantryFire: 1.1, cavalryFire: 0.5, artilleryFire: 2.4, infantryShock: 1.15, cavalryShock: 3.0, artilleryShock: 0.25, militaryTactics: 2.0 },
  { infantryFire: 1.1, cavalryFire: 0.5, artilleryFire: 2.4, infantryShock: 1.15, cavalryShock: 3.0, artilleryShock: 0.25, militaryTactics: 2.0 },
  { infantryFire: 1.1, cavalryFire: 0.5, artilleryFire: 2.4, infantryShock: 1.15, cavalryShock: 3.0, artilleryShock: 0.25, militaryTactics: 2.25 },
  { infantryFire: 1.6, cavalryFire: 0.5, artilleryFire: 2.4, infantryShock: 1.15, cavalryShock: 3.0, artilleryShock: 0.25, militaryTactics: 2.25 },
  { infantryFire: 1.6, cavalryFire: 0.5, artilleryFire: 2.4, infantryShock: 1.65, cavalryShock: 3.0, artilleryShock: 0.25, militaryTactics: 2.5 },
  { infantryFire: 1.6, cavalryFire: 1.0, artilleryFire: 4.4, infantryShock: 1.65, cavalryShock: 3.0, artilleryShock: 0.35, militaryTactics: 2.5 },
  { infantryFire: 1.6, cavalryFire: 1.0, artilleryFire: 4.4, infantryShock: 1.65, cavalryShock: 4.0, artilleryShock: 0.35, militaryTactics: 2.75 },
  { infantryFire: 1.6, cavalryFire: 1.0, artilleryFire: 4.4, infantryShock: 1.65, cavalryShock: 4.0, artilleryShock: 0.35, militaryTactics: 3.0 },
  { infantryFire: 1.6, cavalryFire: 1.0, artilleryFire: 6.4, infantryShock: 1.65, cavalryShock: 4.0, artilleryShock: 0.45, militaryTactics: 3.0 },
  { infantryFire: 1.6, cavalryFire: 1.0, artilleryFire: 6.4, infantryShock: 1.65, cavalryShock: 4.0, artilleryShock: 0.45, militaryTactics: 3.0 },
  { infantryFire: 2.1, cavalryFire: 1.0, artilleryFire: 6.4, infantryShock: 1.65, cavalryShock: 4.0, artilleryShock: 0.45, militaryTactics: 3.0 },
  { infantryFire: 2.1, cavalryFire: 1.0, artilleryFire: 6.4, infantryShock: 2.15, cavalryShock: 4.0, artilleryShock: 0.45, militaryTactics: 3.0 },
  { infantryFire: 2.1, cavalryFire: 1.0, artilleryFire: 6.4, infantryShock: 2.15, cavalryShock: 4.0, artilleryShock: 0.45, militaryTactics: 3.0 },
  { infantryFire: 2.1, cavalryFire: 1.0, artilleryFire: 6.4, infantryShock: 2.15, cavalryShock: 4.0, artilleryShock: 0.45, militaryTactics: 3.25 },
  { infantryFire: 3.1, cavalryFire: 1.0, artilleryFire: 6.4, infantryShock: 2.15, cavalryShock: 5.0, artilleryShock: 0.45, militaryTactics: 3.25 },
  { infantryFire: 3.1, cavalryFire: 1.0, artilleryFire: 8.4, infantryShock: 2.15, cavalryShock: 5.0, artilleryShock: 0.55, militaryTactics: 3.5 }
];

const sideSchemas = {
  attacker: [
    { key: "group", label: "兵种组", type: "select" },
    { key: "unitType", label: "兵种类型", type: "select" },
    { key: "unit", label: "具体兵种", type: "select", wide: true },
    { key: "techLevel", label: "军事科技", type: "number", value: 3, min: 0, max: 32, step: 1 },
    { key: "strength", label: "参战兵力", type: "number", value: 1000, step: 100 },
    { key: "combatAbility", label: "作战能力", type: "number", value: 0, step: 1 },
    { key: "discipline", label: "训练度/纪律", type: "number", value: 0, step: 1 },
    { key: "extraMilitaryTactics", label: "额外军事战术", type: "number", value: 0, step: 0.1 },
    { key: "damageDone", label: "造成伤害修正", type: "number", value: 0, step: 1 },
    { key: "damageTaken", label: "承受伤害修正", type: "number", value: 0, step: 1 }
  ],
  defender: [
    { key: "group", label: "兵种组", type: "select" },
    { key: "unitType", label: "兵种类型", type: "select" },
    { key: "unit", label: "具体兵种", type: "select", wide: true },
    { key: "techLevel", label: "军事科技", type: "number", value: 3, min: 0, max: 32, step: 1 },
    { key: "strength", label: "参战兵力", type: "number", value: 1000, step: 100 },
    { key: "combatAbility", label: "作战能力", type: "number", value: 0, step: 1 },
    { key: "discipline", label: "训练度/纪律", type: "number", value: 0, step: 1 },
    { key: "extraMilitaryTactics", label: "额外军事战术", type: "number", value: 0, step: 0.1 },
    { key: "damageDone", label: "造成伤害修正", type: "number", value: 0, step: 1 },
    { key: "damageTaken", label: "承受伤害修正", type: "number", value: 0, step: 1 }
  ]
};

const sideState = {
  attacker: {},
  defender: {}
};

const phaseSelect = document.querySelector("#phase");
const calculateButton = document.querySelector("#calculate");
const detailsOutput = document.querySelector("#details-output");
const attackerLossEl = document.querySelector("#attacker-loss");
const defenderLossEl = document.querySelector("#defender-loss");

const groupKeys = [...new Set(UNIT_DATA.filter(item => item.group !== "Shared").map(item => item.group))];

function translateGroup(name) {
  return GROUP_TRANSLATIONS[name] || name;
}

function translateUnit(name) {
  return UNIT_TRANSLATIONS[name] || name;
}

function fillOptions(select, options, selectedValue) {
  select.innerHTML = "";
  for (const option of options) {
    const node = document.createElement("option");
    node.value = option.value;
    node.textContent = option.label;
    if (option.value === selectedValue) node.selected = true;
    select.append(node);
  }
  if (!select.value && options.length) {
    select.value = options[0].value;
  }
}

function createField(side, schema, mount) {
  const wrapper = document.createElement("label");
  wrapper.className = "field";
  if (schema.wide) wrapper.style.gridColumn = "1 / -1";
  const label = document.createElement("span");
  label.textContent = schema.label;
  wrapper.append(label);

  let control;
  if (schema.type === "select") {
    control = document.createElement("select");
  } else {
    control = document.createElement("input");
    control.type = "number";
    control.value = String(schema.value ?? 0);
    if (schema.step !== undefined) control.step = String(schema.step);
    if (schema.min !== undefined) control.min = String(schema.min);
    if (schema.max !== undefined) control.max = String(schema.max);
  }

  control.id = `${side}-${schema.key}`;
  control.dataset.side = side;
  control.dataset.key = schema.key;
  wrapper.append(control);
  mount.append(wrapper);
  sideState[side][schema.key] = control;
}

function buildPanel(side) {
  const mount = document.querySelector(`#${side}-fields`);
  sideSchemas[side].forEach(schema => createField(side, schema, mount));
}

function techModifier(techLevel, unitType, phase) {
  const stats = TECH_STATS[techLevel];
  if (phase === "fire") {
    if (unitType === "Infantry") return stats.infantryFire;
    if (unitType === "Cavalry") return stats.cavalryFire;
    return stats.artilleryFire;
  }
  if (unitType === "Infantry") return stats.infantryShock;
  if (unitType === "Cavalry") return stats.cavalryShock;
  return stats.artilleryShock;
}

function baseTactics(techLevel) {
  return TECH_STATS[techLevel].militaryTactics;
}

function selectableUnits(group, unitType, techLevel) {
  let activeTech = -1;
  const matches = [];
  for (const item of UNIT_DATA) {
    const groupMatch = unitType === "Artillery" ? item.group === "Shared" : item.group === group;
    if (!groupMatch || item.unitType !== unitType || item.techLevel > techLevel) continue;
    if (item.techLevel > activeTech) {
      activeTech = item.techLevel;
      matches.length = 0;
    }
    if (item.techLevel === activeTech) {
      matches.push(item);
    }
  }
  return matches;
}

function syncUnitOptions(side) {
  const controls = sideState[side];
  const group = controls.group.value;
  const unitType = controls.unitType.value;
  const techLevel = Math.max(0, Math.min(32, Number(controls.techLevel.value || 0)));
  const units = selectableUnits(group, unitType, techLevel);
  fillOptions(
    controls.unit,
    units.map(item => ({ value: item.unitName, label: translateUnit(item.unitName) })),
    controls.unit.value
  );
}

function initOptions() {
  fillOptions(phaseSelect, PHASES.map(item => ({ value: item.value, label: item.label })), "fire");

  for (const side of ["attacker", "defender"]) {
    fillOptions(
      sideState[side].group,
      groupKeys.map(group => ({ value: group, label: translateGroup(group) })),
      "Western"
    );
    fillOptions(
      sideState[side].unitType,
      UNIT_TYPES.map(type => ({ value: type.value, label: type.label })),
      "Infantry"
    );
    syncUnitOptions(side);
  }
}

function readSide(side) {
  const controls = sideState[side];
  return {
    group: controls.group.value,
    unitType: controls.unitType.value,
    unitName: controls.unit.value,
    techLevel: Number(controls.techLevel.value),
    strength: Number(controls.strength.value),
    combatAbility: Number(controls.combatAbility.value),
    discipline: Number(controls.discipline.value),
    extraMilitaryTactics: Number(controls.extraMilitaryTactics.value),
    damageDone: Number(controls.damageDone.value),
    damageTaken: Number(controls.damageTaken.value)
  };
}

function percentMultiplier(value) {
  return 1 + value / 100;
}

function lookupUnit(group, unitType, unitName) {
  return UNIT_DATA.find(item => {
    const groupMatch = unitType === "Artillery" ? item.group === "Shared" : item.group === group;
    return groupMatch && item.unitType === unitType && item.unitName === unitName;
  });
}

function computeOneWay(attacker, defender, phase, dice, leaderDiff, terrainPenalty, backrowArtillery) {
  const attackerUnit = lookupUnit(attacker.group, attacker.unitType, attacker.unitName);
  const defenderUnit = lookupUnit(defender.group, defender.unitType, defender.unitName);

  const attackerPips = phase === "fire" ? attackerUnit.fireOff : attackerUnit.shockOff;
  const defenderPips = phase === "fire" ? defenderUnit.fireDef : defenderUnit.shockDef;
  const baseCasualties = Math.max(15, 15 + 5 * (dice + leaderDiff + attackerPips - defenderPips - terrainPenalty));
  const tech = techModifier(attacker.techLevel, attacker.unitType, phase);
  const tactics = (baseTactics(defender.techLevel) + defender.extraMilitaryTactics) * percentMultiplier(defender.discipline);

  let multiplier =
    (attacker.strength / 1000) *
    (tech / tactics) *
    percentMultiplier(attacker.combatAbility) *
    percentMultiplier(attacker.discipline) *
    percentMultiplier(attacker.damageDone) *
    percentMultiplier(defender.damageTaken);

  if (backrowArtillery && attacker.unitType === "Artillery") {
    multiplier *= 0.5;
  }

  return {
    attackerPips,
    defenderPips,
    baseCasualties,
    tech,
    tactics,
    damage: baseCasualties * multiplier
  };
}

function validateNumber(name, value) {
  if (!Number.isFinite(value)) {
    throw new Error(`${name} 不是有效数字。`);
  }
}

function calculate() {
  const dice = Number(document.querySelector("#dice").value);
  const leaderDiff = Number(document.querySelector("#leader-diff").value);
  const terrainPenalty = Number(document.querySelector("#terrain-penalty").value);
  const phase = phaseSelect.value;
  const backrowArtillery = document.querySelector("#backrow-artillery").checked;

  [ ["骰子", dice], ["将领差额", leaderDiff], ["进攻地形惩罚", terrainPenalty] ].forEach(([name, value]) => validateNumber(name, value));
  if (dice < 0 || dice > 9) throw new Error("骰子应在 0 到 9 之间。");
  if (terrainPenalty < 0) throw new Error("进攻地形惩罚不能为负数。");

  const attacker = readSide("attacker");
  const defender = readSide("defender");

  for (const side of [attacker, defender]) {
    if (!Number.isInteger(side.techLevel) || side.techLevel < 0 || side.techLevel > 32) {
      throw new Error("双方军事科技都应为 0 到 32 的整数。");
    }
  }

  const attackerToDefender = computeOneWay(attacker, defender, phase, dice, leaderDiff, terrainPenalty, backrowArtillery);
  const defenderToAttacker = computeOneWay(defender, attacker, phase, dice, -leaderDiff, 0, backrowArtillery);

  attackerLossEl.textContent = defenderToAttacker.damage.toFixed(2);
  defenderLossEl.textContent = attackerToDefender.damage.toFixed(2);

  detailsOutput.textContent = [
    `阶段：${phase === "fire" ? "火力" : "冲击"}`,
    `进攻方兵员损失：${defenderToAttacker.damage.toFixed(2)}`,
    `防守方兵员损失：${attackerToDefender.damage.toFixed(2)}`,
    ``,
    `进攻方 -> 防守方`,
    `兵种组：${translateGroup(attacker.group)}；兵种：${translateUnit(attacker.unitName)}`,
    `基础伤亡 = max(15, 15 + 5 x (${dice.toFixed(2)} + ${leaderDiff.toFixed(2)} + ${attackerToDefender.attackerPips.toFixed(2)} - ${attackerToDefender.defenderPips.toFixed(2)} - ${terrainPenalty.toFixed(2)})) = ${attackerToDefender.baseCasualties.toFixed(2)}`,
    `科技修正 = ${attackerToDefender.tech.toFixed(2)}，守方战术 = ${attackerToDefender.tactics.toFixed(2)}`,
    ``,
    `防守方 -> 进攻方`,
    `兵种组：${translateGroup(defender.group)}；兵种：${translateUnit(defender.unitName)}`,
    `基础伤亡 = max(15, 15 + 5 x (${dice.toFixed(2)} + ${(-leaderDiff).toFixed(2)} + ${defenderToAttacker.attackerPips.toFixed(2)} - ${defenderToAttacker.defenderPips.toFixed(2)} - 0.00)) = ${defenderToAttacker.baseCasualties.toFixed(2)}`,
    `科技修正 = ${defenderToAttacker.tech.toFixed(2)}，守方战术 = ${defenderToAttacker.tactics.toFixed(2)}`
  ].join("\n");
}

function bindEvents() {
  ["attacker", "defender"].forEach(side => {
    sideState[side].group.addEventListener("change", () => syncUnitOptions(side));
    sideState[side].unitType.addEventListener("change", () => syncUnitOptions(side));
    sideState[side].techLevel.addEventListener("change", () => syncUnitOptions(side));
  });

  calculateButton.addEventListener("click", () => {
    try {
      calculate();
    } catch (error) {
      detailsOutput.textContent = error.message;
      attackerLossEl.textContent = "0.00";
      defenderLossEl.textContent = "0.00";
    }
  });
}

buildPanel("attacker");
buildPanel("defender");
initOptions();
bindEvents();
calculate();
