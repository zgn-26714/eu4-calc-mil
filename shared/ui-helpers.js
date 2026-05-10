(function(M) {
  var translations = M['data/translations'];
  var GROUP_TRANSLATIONS = translations.GROUP_TRANSLATIONS;
  var UNIT_TRANSLATIONS = translations.UNIT_TRANSLATIONS;
  var UNIT_TYPE_TRANSLATIONS = translations.UNIT_TYPE_TRANSLATIONS;
  var constants = M['data/constants'];
  var PHASES = constants.PHASES;
  var UNIT_TYPES = constants.UNIT_TYPES;

  function translateGroup(name) {
    return GROUP_TRANSLATIONS[name] || name;
  }

  function translateUnit(name) {
    return UNIT_TRANSLATIONS[name] || name;
  }

  function translateUnitType(name) {
    return UNIT_TYPE_TRANSLATIONS[name] || name;
  }

  function translateTableGroup(name) {
    return name === "Shared" ? "炮兵" : translateGroup(name);
  }

  function stripParenthetical(text) {
    return String(text || "")
      .replace(/（[^）]*）/g, "")
      .replace(/\([^)]*\)/g, "")
      .trim();
  }

  function cloneDataShallow(source) {
    var copy = {};
    var keys = Object.keys(source);
    for (var i = 0; i < keys.length; i++) {
      copy[keys[i]] = source[keys[i]];
    }
    return copy;
  }

  function fillOptions(select, options, selectedValue) {
    select.innerHTML = "";
    for (var i = 0; i < options.length; i++) {
      var option = options[i];
      var node = document.createElement("option");
      node.value = option.value;
      node.textContent = option.label;
      if (option.value === selectedValue) node.selected = true;
      select.append(node);
    }
    if (!select.value && options.length) {
      select.value = options[0].value;
    }
  }

  function formatTemplateValue(value, schema) {
    if (!Number.isFinite(value)) return "-";
    if (schema && (
      schema.key === "discipline" ||
      schema.key === "combatAbility" ||
      schema.key === "combatAbilityInfantry" ||
      schema.key === "combatAbilityCavalry" ||
      schema.key === "combatAbilityArtillery" ||
      schema.key === "damageDoneFire" ||
      schema.key === "damageDoneShock" ||
      schema.key === "damageTakenFire" ||
      schema.key === "damageTakenShock" ||
      schema.key === "moraleBonus" ||
      schema.key === "moraleDamageDone" ||
      schema.key === "moraleDamageTaken"
    )) {
      return value + "%";
    }
    if (schema && schema.step && String(schema.step).indexOf(".") >= 0) {
      return value.toFixed(2).replace(/\.?0+$/, "");
    }
    return String(value);
  }

  function maybeWarnStrengthLimit(control) {
    if (!control) return;
    var value = Number(control.value);
    if (!Number.isFinite(value) || value <= 1000) {
      control.dataset.warnedStrengthValue = "";
      return;
    }
    if (control.dataset.warnedStrengthValue === control.value) return;
    control.dataset.warnedStrengthValue = control.value;
    window.alert("当前模型只按 1000 兵且固定前排计算；当初始兵力超过 1000 时，计算结果目前是不正确的。");
  }

  function lockNumericControl(control, reason) {
    control.value = "0";
    control.readOnly = true;
    control.classList.add("locked-control");
    control.setAttribute("aria-disabled", "true");
    control.title = reason;

    var lastNoticeAt = 0;
    function showNotice() {
      var now = Date.now();
      if (now - lastNoticeAt < 800) return;
      lastNoticeAt = now;
      window.alert(reason);
    }

    control.addEventListener("pointerdown", function(event) {
      event.preventDefault();
      showNotice();
    });
    control.addEventListener("keydown", function(event) {
      if (event.key === "Tab") return;
      event.preventDefault();
      showNotice();
    });
    control.addEventListener("wheel", function(event) {
      event.preventDefault();
      showNotice();
    });
    control.addEventListener("input", function() {
      control.value = "0";
      showNotice();
    });
    control.addEventListener("change", function() {
      control.value = "0";
    });
  }

  M['shared/ui-helpers'] = {
    translateGroup: translateGroup,
    translateUnit: translateUnit,
    translateUnitType: translateUnitType,
    translateTableGroup: translateTableGroup,
    stripParenthetical: stripParenthetical,
    cloneDataShallow: cloneDataShallow,
    fillOptions: fillOptions,
    formatTemplateValue: formatTemplateValue,
    maybeWarnStrengthLimit: maybeWarnStrengthLimit,
    lockNumericControl: lockNumericControl
  };
})(window._M = window._M || {});