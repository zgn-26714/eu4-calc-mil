(function(M) {
  var units = M['data/units'];
  var UNIT_DATA = units.UNIT_DATA;
  var constants = M['data/constants'];
  var PHASES = constants.PHASES;
  var UNIT_TYPES = constants.UNIT_TYPES;
  var uiHelpers = M['shared/ui-helpers'];
  var translateGroup = uiHelpers.translateGroup;
  var translateUnit = uiHelpers.translateUnit;
  var fillOptions = uiHelpers.fillOptions;
  var lockNumericControl = uiHelpers.lockNumericControl;

  var sideSchemas = {
    attacker: [
      { key: "leaderFire", label: "火力", type: "number", value: 0, min: 0, max: 6, step: 1 },
      { key: "leaderShock", label: "冲击", type: "number", value: 0, min: 0, max: 6, step: 1 },
      { key: "leaderManeuver", label: "机动", type: "number", value: 0, min: 0, max: 6, step: 1 },
      { key: "leaderSiege", label: "围城", type: "number", value: 0, min: 0, max: 0, step: 1, lockedReason: "围城在当前战斗计算中没有作用，已固定为 0。" },
      { key: "group", label: "兵种组", type: "select" },
      { key: "unitType", label: "兵种类型", type: "select" },
      { key: "techLevel", label: "军事科技", type: "number", value: 3, min: 0, max: 32, step: 1 },
      { key: "strength", label: "参战人数", type: "number", value: 1000, step: 100 },
      { key: "combatAbility", label: "作战能力（%）", type: "number", value: 0, step: 1 },
      { key: "discipline", label: "训练度（%）", type: "number", value: 0, step: 1 },
      { key: "extraMilitaryTactics", label: "额外军事战术（+x）", type: "number", value: 0, step: 0.1 },
      { key: "fireDamage", label: "火力伤害修正（+x）", type: "number", value: 0, step: 1 },
      { key: "shockDamage", label: "冲击伤害修正（+x）", type: "number", value: 0, step: 1 },
      { key: "damageDone", label: "造成伤害修正（%）", type: "number", value: 0, step: 1 },
      { key: "damageTaken", label: "承受伤害修正（%）", type: "number", value: 0, step: 1 },
      { key: "moraleBonus", label: "额外士气加成（%）", type: "number", value: 0, step: 1 },
      { key: "armyTradition", label: "陆军传统（0-100）", type: "number", value: 0, min: 0, max: 100, step: 1 },
      { key: "prestige", label: "威望（-100~100）", type: "number", value: 0, min: -100, max: 100, step: 1 },
      { key: "moraleDamageDone", label: "士气打击（%）", type: "number", value: 0, step: 1 },
      { key: "moraleDamageTaken", label: "士气防御（%）", type: "number", value: 0, step: 1 },
      { key: "professionalism", label: "职业度（0-100）", type: "number", value: 0, min: 0, max: 100, step: 1 }
    ],
    defender: [
      { key: "leaderFire", label: "火力", type: "number", value: 0, min: 0, max: 6, step: 1 },
      { key: "leaderShock", label: "冲击", type: "number", value: 0, min: 0, max: 6, step: 1 },
      { key: "leaderManeuver", label: "机动", type: "number", value: 0, min: 0, max: 6, step: 1 },
      { key: "leaderSiege", label: "围城", type: "number", value: 0, min: 0, max: 0, step: 1, lockedReason: "围城在当前战斗计算中没有作用，已固定为 0。" },
      { key: "group", label: "兵种组", type: "select" },
      { key: "unitType", label: "兵种类型", type: "select" },
      { key: "techLevel", label: "军事科技", type: "number", value: 3, min: 0, max: 32, step: 1 },
      { key: "strength", label: "参战人数", type: "number", value: 1000, step: 100 },
      { key: "combatAbility", label: "作战能力（%）", type: "number", value: 0, step: 1 },
      { key: "discipline", label: "训练度（%）", type: "number", value: 0, step: 1 },
      { key: "extraMilitaryTactics", label: "额外军事战术（+x）", type: "number", value: 0, step: 0.1 },
      { key: "fireDamage", label: "火力伤害修正（+x）", type: "number", value: 0, step: 1 },
      { key: "shockDamage", label: "冲击伤害修正（+x）", type: "number", value: 0, step: 1 },
      { key: "damageDone", label: "造成伤害修正（%）", type: "number", value: 0, step: 1 },
      { key: "damageTaken", label: "承受伤害修正（%）", type: "number", value: 0, step: 1 },
      { key: "moraleBonus", label: "额外士气加成（%）", type: "number", value: 0, step: 1 },
      { key: "armyTradition", label: "陆军传统（0-100）", type: "number", value: 0, min: 0, max: 100, step: 1 },
      { key: "prestige", label: "威望（-100~100）", type: "number", value: 0, min: -100, max: 100, step: 1 },
      { key: "moraleDamageDone", label: "士气打击（%）", type: "number", value: 0, step: 1 },
      { key: "moraleDamageTaken", label: "士气防御（%）", type: "number", value: 0, step: 1 },
      { key: "professionalism", label: "职业度（0-100）", type: "number", value: 0, min: 0, max: 100, step: 1 }
    ]
  };
/* __PLACEHOLDER_STATE_CONTINUE__ */

  sideSchemas.template = [
    { key: "strength", label: "参战人数", type: "number", value: 1000, step: 100 },
    { key: "techLevel", label: "军事科技", type: "number", value: 3, min: 0, max: 32, step: 1 },
    { key: "discipline", label: "训练度（%）", type: "number", value: 0, step: 1 },
    { key: "extraMilitaryTactics", label: "额外军事战术（+x）", type: "number", value: 0, step: 0.1 },
    { key: "combatAbilityInfantry", label: "步兵作战能力（%）", type: "number", value: 0, step: 1 },
    { key: "combatAbilityCavalry", label: "骑兵作战能力（%）", type: "number", value: 0, step: 1 },
    { key: "combatAbilityArtillery", label: "炮兵作战能力（%）", type: "number", value: 0, step: 1 },
    { key: "fireDamageInfantry", label: "步兵火力修正（+x）", type: "number", value: 0, step: 1 },
    { key: "fireDamageCavalry", label: "骑兵火力修正（+x）", type: "number", value: 0, step: 1 },
    { key: "fireDamageArtillery", label: "炮兵火力修正（+x）", type: "number", value: 0, step: 1 },
    { key: "shockDamageInfantry", label: "步兵冲击修正（+x）", type: "number", value: 0, step: 1 },
    { key: "shockDamageCavalry", label: "骑兵冲击修正（+x）", type: "number", value: 0, step: 1 },
    { key: "shockDamageArtillery", label: "炮兵冲击修正（+x）", type: "number", value: 0, step: 1 },
    { key: "damageDoneFire", label: "火力伤害（%）", type: "number", value: 0, step: 1 },
    { key: "damageDoneShock", label: "冲击伤害（%）", type: "number", value: 0, step: 1 },
    { key: "damageTakenFire", label: "火力防御（%）", type: "number", value: 0, step: 1 },
    { key: "damageTakenShock", label: "冲击防御（%）", type: "number", value: 0, step: 1 },
    { key: "moraleBonus", label: "额外士气加成（%）", type: "number", value: 0, step: 1 },
    { key: "moraleDamageDone", label: "士气打击（%）", type: "number", value: 0, step: 1 },
    { key: "moraleDamageTaken", label: "士气防御（%）", type: "number", value: 0, step: 1 },
    { key: "armyTradition", label: "陆军传统（0-100）", type: "number", value: 0, min: 0, max: 100, step: 1 },
    { key: "prestige", label: "威望（-100~100）", type: "number", value: 0, min: -100, max: 100, step: 1 },
    { key: "professionalism", label: "职业度（0-100）", type: "number", value: 0, min: 0, max: 100, step: 1 }
  ];

  var templateLayout = [
    { title: "基础属性", fields: ["strength", "techLevel", "discipline", "extraMilitaryTactics"] },
    { title: "作战能力", fields: ["combatAbilityInfantry", "combatAbilityCavalry", "combatAbilityArtillery"] },
    { title: "火力修正", fields: ["fireDamageInfantry", "fireDamageCavalry", "fireDamageArtillery"] },
    { title: "冲击修正", fields: ["shockDamageInfantry", "shockDamageCavalry", "shockDamageArtillery"] },
    { title: "伤害修正", fields: ["damageDoneFire", "damageDoneShock", "damageTakenFire", "damageTakenShock"] },
    { title: "士气修正", fields: ["moraleBonus", "moraleDamageDone", "moraleDamageTaken"] },
    { title: "额外修正", fields: ["armyTradition", "prestige", "professionalism"] }
  ];

  var sideState = {
    attacker: {},
    defender: {},
    template: {}
  };

  var groupKeysSet = {};
  for (var gi = 0; gi < UNIT_DATA.length; gi++) {
    if (UNIT_DATA[gi].group !== "Shared") groupKeysSet[UNIT_DATA[gi].group] = true;
  }
  var groupKeys = Object.keys(groupKeysSet);
/* __PLACEHOLDER_STATE_FUNCS__ */

  function selectableUnits(group, unitType, techLevel) {
    var activeTech = -1;
    var matches = [];
    for (var i = 0; i < UNIT_DATA.length; i++) {
      var item = UNIT_DATA[i];
      var groupMatch = unitType === "Artillery" ? item.group === "Shared" : item.group === group;
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

  function enforceArtilleryTechRequirement(side, shouldAlert) {
    var controls = sideState[side];
    if (!controls || !controls.unitType) return false;
    if (controls.unitType.value !== "Artillery") {
      controls.unitType.dataset.lastValidValue = controls.unitType.value;
      return false;
    }
    var techLevel = controls.techLevel ? Math.max(0, Math.min(32, Number(controls.techLevel.value || 0))) : 0;
    if (techLevel >= 7) return false;
    var fallbackType = controls.unitType.dataset.lastValidValue;
    if (!fallbackType || fallbackType === "Artillery") fallbackType = "Infantry";
    controls.unitType.value = fallbackType;
    if (shouldAlert) window.alert("7军科前不存在炮兵。");
    return true;
  }

  function refreshUnitButtons(side) {
    var container = document.getElementById(side + "-unit-buttons");
    if (!container) return;
    var controls = sideState[side];
    var group = controls.group ? controls.group.value : "";
    var unitType = controls.unitType ? controls.unitType.value : "";
    var techLevel = controls.techLevel ? Math.max(0, Math.min(32, Number(controls.techLevel.value || 0))) : 0;
    var unitsList = selectableUnits(group, unitType, techLevel);
    var currentUnit = (controls.unit && controls.unit.value) || "";
    container.innerHTML = "";
    if (unitsList.length === 0) { container.style.display = "none"; return; }
    container.style.display = "";
    var selectedIndex = -1;
    for (var i = 0; i < unitsList.length; i++) {
      (function(unit) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "unit-btn" + (unit.unitName === currentUnit ? " selected" : "");
        btn.textContent = translateUnit(unit.unitName);
        btn.addEventListener("click", function() {
          var allBtns = container.querySelectorAll(".unit-btn");
          for (var j = 0; j < allBtns.length; j++) allBtns[j].classList.remove("selected");
          btn.classList.add("selected");
          if (!controls.unit) {
            var hidden = document.createElement("input");
            hidden.type = "hidden";
            hidden.id = side + "-unit";
            hidden.dataset.side = side;
            hidden.dataset.key = "unit";
            document.getElementById(side + "-fields").appendChild(hidden);
            controls.unit = hidden;
          }
          controls.unit.value = unit.unitName;
        });
        container.appendChild(btn);
        if (unit.unitName === currentUnit) selectedIndex = i;
      })(unitsList[i]);
    }
    if (selectedIndex < 0 && unitsList.length > 0) {
      container.querySelector(".unit-btn").click();
    }
  }

  function syncSideUnitButtons(side, shouldAlert) {
    enforceArtilleryTechRequirement(side, shouldAlert);
    refreshUnitButtons(side);
  }
/* __PLACEHOLDER_STATE_BUILD__ */

  function createField(side, schema, mount) {
    var wrapper = document.createElement("label");
    wrapper.className = side === "template" ? "template-field" : "battle-field";
    var label = document.createElement("span");
    label.textContent = schema.label;
    wrapper.append(label);

    var control;
    if (schema.type === "select") {
      control = document.createElement("select");
    } else {
      control = document.createElement("input");
      control.type = "number";
      control.value = String(schema.value != null ? schema.value : 0);
      if (schema.step !== undefined) control.step = String(schema.step);
      if (schema.min !== undefined) control.min = String(schema.min);
      if (schema.max !== undefined) control.max = String(schema.max);
    }

    control.id = side + "-" + schema.key;
    control.dataset.side = side;
    control.dataset.key = schema.key;
    if (schema.lockedReason) {
      lockNumericControl(control, schema.lockedReason);
    }
    wrapper.append(control);
    mount.append(wrapper);
    sideState[side][schema.key] = control;
  }
/* __PLACEHOLDER_STATE_BUILDPANEL__ */

  function buildPanel(side) {
    var mount = document.querySelector("#" + side + "-fields");
    if (side === "template") {
      var schemaMap = {};
      sideSchemas.template.forEach(function(s) { schemaMap[s.key] = s; });
      templateLayout.forEach(function(group) {
        var section = document.createElement("div");
        section.className = "template-section";
        var header = document.createElement("div");
        header.className = "template-section-header";
        header.textContent = group.title;
        section.append(header);
        var row = document.createElement("div");
        row.className = "template-parameter-grid";
        group.fields.forEach(function(key) {
          var schema = schemaMap[key];
          if (!schema) return;
          var wrapper = document.createElement("label");
          wrapper.className = "battle-field template-battle-field";
          var label = document.createElement("span");
          label.textContent = schema.label;
          wrapper.append(label);
          var control = document.createElement("input");
          control.type = "number";
          control.value = String(schema.value != null ? schema.value : 0);
          if (schema.step !== undefined) control.step = String(schema.step);
          if (schema.min !== undefined) control.min = String(schema.min);
          if (schema.max !== undefined) control.max = String(schema.max);
          control.id = side + "-" + schema.key;
          control.dataset.side = side;
          control.dataset.key = schema.key;
          wrapper.append(control);
          row.append(wrapper);
          sideState[side][schema.key] = control;
        });
        section.append(row);
        mount.append(section);
      });
    } else {
      var leaderKeys = ["leaderFire", "leaderShock", "leaderManeuver", "leaderSiege"];
      var selectorKeys = ["group", "unitType", "techLevel"];
      var sideHead = document.querySelector("#" + side + "-card .side-head");
      var selectorStrip = document.createElement("div");
      selectorStrip.className = "battle-selector-strip";
      var selectorRow = document.createElement("div");
      selectorRow.className = "battle-field-grid battle-field-grid-selectors";
      sideSchemas[side].forEach(function(schema) {
        if (selectorKeys.indexOf(schema.key) >= 0) {
          createField(side, schema, selectorRow);
        }
      });
      selectorStrip.append(selectorRow);
/* __PLACEHOLDER_STATE_BUILDPANEL2__ */

      var unitRow = document.createElement("div");
      unitRow.className = "battle-unit-row battle-unit-row-head";
      unitRow.id = side + "-unit-buttons";
      if (sideHead) sideHead.append(unitRow);
      mount.append(selectorStrip);

      var leaderSection = document.createElement("div");
      leaderSection.className = "battle-leader-section";
      var leaderTitle = document.createElement("div");
      leaderTitle.className = "battle-leader-title";
      leaderTitle.textContent = "将领";
      leaderSection.append(leaderTitle);
      var leaderRow = document.createElement("div");
      leaderRow.className = "battle-field-grid battle-field-grid-leaders";
      sideSchemas[side].forEach(function(schema) {
        if (leaderKeys.indexOf(schema.key) >= 0) {
          createField(side, schema, leaderRow);
        }
      });
      leaderSection.append(leaderRow);
      mount.append(leaderSection);

      var restRow = document.createElement("div");
      restRow.className = "battle-field-grid battle-field-grid-stats";
      sideSchemas[side].forEach(function(schema) {
        if (selectorKeys.indexOf(schema.key) < 0 && leaderKeys.indexOf(schema.key) < 0) {
          createField(side, schema, restRow);
        }
      });
      mount.append(restRow);

      function refresh(event) {
        syncSideUnitButtons(side, !!event);
      }
      selectorKeys.forEach(function(key) {
        var ctrl = sideState[side][key];
        if (ctrl) ctrl.addEventListener("change", refresh);
      });
      syncSideUnitButtons(side, false);
    }
  }
/* __PLACEHOLDER_STATE_INITOPTIONS__ */

  function initOptions() {
    var phaseSelect = document.querySelector("#phase");
    fillOptions(phaseSelect, PHASES.map(function(item) { return { value: item.value, label: item.label }; }), "fire");

    for (var si = 0; si < 2; si++) {
      var side = si === 0 ? "attacker" : "defender";
      fillOptions(
        sideState[side].group,
        groupKeys.map(function(group) { return { value: group, label: translateGroup(group) }; }),
        "Western"
      );
      fillOptions(
        sideState[side].unitType,
        UNIT_TYPES.map(function(type) { return { value: type.value, label: type.label }; }),
        "Infantry"
      );
      syncSideUnitButtons(side, false);
    }
  }

  function readSide(side) {
    var controls = sideState[side];
    var data = {};
    if (controls.leaderFire) data.leaderFire = Number(controls.leaderFire.value);
    if (controls.leaderShock) data.leaderShock = Number(controls.leaderShock.value);
    if (controls.leaderManeuver) data.leaderManeuver = Number(controls.leaderManeuver.value);
    if (controls.leaderSiege) data.leaderSiege = Number(controls.leaderSiege.value);
    if (controls.group) data.group = controls.group.value;
    if (controls.unitType) data.unitType = controls.unitType.value;
    if (controls.unit) data.unitName = controls.unit.value;
    if (controls.techLevel) data.techLevel = Number(controls.techLevel.value);
    if (controls.strength) data.strength = Number(controls.strength.value);
    if (controls.combatAbility) data.combatAbility = Number(controls.combatAbility.value);
    if (controls.discipline) data.discipline = Number(controls.discipline.value);
    if (controls.extraMilitaryTactics) data.extraMilitaryTactics = Number(controls.extraMilitaryTactics.value);
    if (controls.fireDamage) data.fireDamage = Number(controls.fireDamage.value);
    if (controls.shockDamage) data.shockDamage = Number(controls.shockDamage.value);
    if (controls.combatAbilityInfantry) data.combatAbilityInfantry = Number(controls.combatAbilityInfantry.value);
    if (controls.combatAbilityCavalry) data.combatAbilityCavalry = Number(controls.combatAbilityCavalry.value);
    if (controls.combatAbilityArtillery) data.combatAbilityArtillery = Number(controls.combatAbilityArtillery.value);
    if (controls.fireDamageInfantry) data.fireDamageInfantry = Number(controls.fireDamageInfantry.value);
    if (controls.fireDamageCavalry) data.fireDamageCavalry = Number(controls.fireDamageCavalry.value);
    if (controls.fireDamageArtillery) data.fireDamageArtillery = Number(controls.fireDamageArtillery.value);
    if (controls.shockDamageInfantry) data.shockDamageInfantry = Number(controls.shockDamageInfantry.value);
    if (controls.shockDamageCavalry) data.shockDamageCavalry = Number(controls.shockDamageCavalry.value);
    if (controls.shockDamageArtillery) data.shockDamageArtillery = Number(controls.shockDamageArtillery.value);
    if (controls.damageDoneFire) data.damageDoneFire = Number(controls.damageDoneFire.value);
    if (controls.damageDoneShock) data.damageDoneShock = Number(controls.damageDoneShock.value);
    if (controls.damageDone) data.damageDone = Number(controls.damageDone.value);
    if (controls.damageTakenFire) data.damageTakenFire = Number(controls.damageTakenFire.value);
    if (controls.damageTakenShock) data.damageTakenShock = Number(controls.damageTakenShock.value);
    if (controls.damageTaken) data.damageTaken = Number(controls.damageTaken.value);
    if (controls.moraleBonus) data.moraleBonus = Number(controls.moraleBonus.value);
    if (controls.armyTradition) data.armyTradition = Number(controls.armyTradition.value);
    if (controls.prestige) data.prestige = Number(controls.prestige.value);
    if (controls.moraleDamageDone) data.moraleDamageDone = Number(controls.moraleDamageDone.value);
    if (controls.moraleDamageTaken) data.moraleDamageTaken = Number(controls.moraleDamageTaken.value);
    if (controls.professionalism) data.professionalism = Number(controls.professionalism.value);
    return data;
  }

  M['shared/state'] = {
    sideSchemas: sideSchemas,
    templateLayout: templateLayout,
    sideState: sideState,
    groupKeys: groupKeys,
    selectableUnits: selectableUnits,
    refreshUnitButtons: refreshUnitButtons,
    syncSideUnitButtons: syncSideUnitButtons,
    buildPanel: buildPanel,
    initOptions: initOptions,
    readSide: readSide
  };
})(window._M = window._M || {});