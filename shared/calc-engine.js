(function(M) {
  var techStats = M['data/tech-stats'];
  var TECH_STATS = techStats.TECH_STATS;
  var units = M['data/units'];
  var UNIT_DATA = units.UNIT_DATA;

  function percentMultiplier(value) {
    return 1 + value / 100;
  }

  function defenseMultiplier(value) {
    return Math.max(0, 1 - value / 100);
  }

  function clamp(value, min, max) {
    value = Number(value || 0);
    return Math.max(min, Math.min(max, value));
  }

  function professionalismDamageBonus(professionalism) {
    return clamp(professionalism, 0, 100) * 0.1;
  }

  function baseTactics(techLevel) {
    return TECH_STATS[techLevel].militaryTactics;
  }

  function baseMorale(techLevel) {
    if (techLevel >= 30) return 6.0;
    if (techLevel >= 26) return 5.0;
    if (techLevel >= 15) return 4.0;
    if (techLevel >= 4) return 3.0;
    if (techLevel >= 3) return 2.5;
    return 2.0;
  }

  function techModifier(techLevel, unitType, phase) {
    var stats = TECH_STATS[techLevel];
    if (phase === "fire") {
      if (unitType === "Infantry") return stats.infantryFire;
      if (unitType === "Cavalry") return stats.cavalryFire;
      return stats.artilleryFire;
    }
    if (unitType === "Infantry") return stats.infantryShock;
    if (unitType === "Cavalry") return stats.cavalryShock;
    return stats.artilleryShock;
  }

  function lookupUnit(group, unitType, unitName) {
    return UNIT_DATA.find(function(item) {
      var groupMatch = unitType === "Artillery" ? item.group === "Shared" : item.group === group;
      return groupMatch && item.unitType === unitType && item.unitName === unitName;
    });
  }

  function validateNumber(name, value) {
    if (!Number.isFinite(value)) {
      throw new Error(name + ' 不是有效数字。');
    }
  }

  function computeBaseCasualties(dice, leaderDiff, attackerPips, defenderPips, terrainPenalty) {
    return 15 + 5 * (dice + leaderDiff + attackerPips - defenderPips - terrainPenalty);
  }

  function computeMultipliers(strength, tech, tactics, combatAbility, discipline, battleDayBonus) {
    // Floating-point comparison helper retained for compatibility. Combat engines
    // use separate fixed-point steps instead of this merged multiplier.
    return (strength / 1000) *
      (tech / tactics) *
      percentMultiplier(combatAbility) *
      percentMultiplier(discipline);
  }

  // EU4's combat arithmetic uses signed integers with scale 1000. Keep each
  // multiply/divide separate: cancelling equal discipline changes casualties.
  function toFixedPoint(value) {
    var scaled = Number(value) * 1000;
    return Math.trunc(scaled + Math.sign(scaled) * 1e-7);
  }

  function fixedMultiply(left, right) {
    return Math.trunc(left * right / 1000);
  }

  function fixedDivide(left, right) {
    if (right <= 0) throw new Error('军事战术必须大于 0');
    return Math.trunc(left * 1000 / right);
  }

  function computeOneWay(attacker, defender, phase, dice, leaderDiff, terrainPenalty, backrowArtillery, battleDay) {
    if (battleDay === undefined) battleDay = 1;
    var attackerUnit = lookupUnit(attacker.group, attacker.unitType, attacker.unitName);
    var defenderUnit = lookupUnit(defender.group, defender.unitType, defender.unitName);

    var attackerPips = phase === "fire" ? attackerUnit.fireOff : attackerUnit.shockOff;
    var defenderPips = phase === "fire" ? defenderUnit.fireDef : defenderUnit.shockDef;
    var baseCasualties = computeBaseCasualties(dice, leaderDiff, attackerPips, defenderPips, terrainPenalty);
    var phaseDamage = 0;
    if (phase === "fire") {
      if (attacker.unitType === "Infantry") phaseDamage = attacker.fireDamageInfantry || attacker.fireDamage || 0;
      else if (attacker.unitType === "Cavalry") phaseDamage = attacker.fireDamageCavalry || attacker.fireDamage || 0;
      else if (attacker.unitType === "Artillery") phaseDamage = attacker.fireDamageArtillery || attacker.fireDamage || 0;
    } else {
      if (attacker.unitType === "Infantry") phaseDamage = attacker.shockDamageInfantry || attacker.shockDamage || 0;
      else if (attacker.unitType === "Cavalry") phaseDamage = attacker.shockDamageCavalry || attacker.shockDamage || 0;
      else if (attacker.unitType === "Artillery") phaseDamage = attacker.shockDamageArtillery || attacker.shockDamage || 0;
    }
    var tech = techModifier(attacker.techLevel, attacker.unitType, phase) + phaseDamage;
    var tacticsFixed = fixedMultiply(
      toFixedPoint(baseTactics(defender.techLevel) + (defender.extraMilitaryTactics || 0)),
      toFixedPoint(percentMultiplier(defender.discipline || 0))
    );
    var tactics = tacticsFixed / 1000;

    var damageDonePhase = phase === "fire" ? (attacker.damageDoneFire || attacker.damageDone || 0) : (attacker.damageDoneShock || attacker.damageDone || 0);
    var professionalDamageBonus = attacker.damageBonus != null
      ? attacker.damageBonus
      : professionalismDamageBonus(attacker.professionalism);
    var damageTakenPhase = phase === "fire" ? (defender.damageTakenFire || defender.damageTaken || 0) : (defender.damageTakenShock || defender.damageTaken || 0);
    var combatAbility = attacker.combatAbility || 0;
    if (attacker.unitType === "Infantry") combatAbility = attacker.combatAbilityInfantry || combatAbility;
    else if (attacker.unitType === "Cavalry") combatAbility = attacker.combatAbilityCavalry || combatAbility;
    else if (attacker.unitType === "Artillery") combatAbility = attacker.combatAbilityArtillery || combatAbility;
    // Local eu4.exe (Steam build 15918133), combat routine RVA 0x225860:
    // base = (25 + 25 * clamp(roll + pips + 2, 0, 21)) / 1000;
    // the 0.2 conversion is AFTER the other damage multipliers, BEFORE duration.
    var baseFixed = Math.trunc(clamp(baseCasualties * 5, 25, 550));
    var steps = [{ name: '内部基础值', value: baseFixed }];
    function multiplyStep(name, factor) {
      damageFixed = fixedMultiply(damageFixed, toFixedPoint(factor));
      steps.push({ name: name, value: damageFixed });
    }
    var damageFixed = baseFixed;
    multiplyStep('乘日初兵力比例', attacker.strength / 1000);
    multiplyStep('乘训练度', percentMultiplier(attacker.discipline || 0));
    damageFixed = fixedDivide(damageFixed, tacticsFixed);
    steps.push({ name: '除守方战术', value: damageFixed });
    multiplyStep('乘科技阶段系数', tech);
    multiplyStep('乘作战能力', percentMultiplier(combatAbility));
    multiplyStep('乘承受伤害修正', Math.max(0.05, defenseMultiplier(damageTakenPhase)));
    multiplyStep('乘造成伤害修正', percentMultiplier(damageDonePhase + professionalDamageBonus));
    if (backrowArtillery && attacker.unitType === "Artillery") {
      multiplyStep('乘后排炮兵系数', 0.5);
    }
    multiplyStep('乘兵损换算系数', 0.2);
    var damageBeforeDuration = damageFixed;
    multiplyStep('乘战斗天数加成', 1 + battleDay / 100);

    return {
      attackerPips: attackerPips,
      defenderPips: defenderPips,
      baseCasualties: baseFixed / 5,
      tech: tech,
      tactics: tactics,
      damageBonus: professionalDamageBonus,
      professionalismDamageBonus: professionalDamageBonus,
      effectiveDamageDone: damageDonePhase + professionalDamageBonus,
      battleDay: battleDay,
      damageBeforeDuration: damageBeforeDuration,
      fixedPointSteps: steps,
      damage: damageFixed
    };
  }

  function randomDice() {
    return Math.floor(Math.random() * 10);
  }

  M['shared/calc-engine'] = {
    percentMultiplier: percentMultiplier,
    defenseMultiplier: defenseMultiplier,
    professionalismDamageBonus: professionalismDamageBonus,
    baseTactics: baseTactics,
    baseMorale: baseMorale,
    techModifier: techModifier,
    lookupUnit: lookupUnit,
    validateNumber: validateNumber,
    computeBaseCasualties: computeBaseCasualties,
    computeMultipliers: computeMultipliers,
    toFixedPoint: toFixedPoint,
    fixedMultiply: fixedMultiply,
    fixedDivide: fixedDivide,
    computeOneWay: computeOneWay,
    randomDice: randomDice
  };
})(window._M = window._M || {});
