(function(M) {
  var techStats = M['data/tech-stats'];
  var TECH_STATS = techStats.TECH_STATS;
  var units = M['data/units'];
  var UNIT_DATA = units.UNIT_DATA;

  function percentMultiplier(value) {
    return 1 + value / 100;
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
    return Math.max(15, 15 + 5 * (dice + leaderDiff + attackerPips - defenderPips - terrainPenalty));
  }

  function computeMultipliers(strength, tech, tactics, combatAbility, discipline, battleDayBonus) {
    return (strength / 1000) *
      (tech / tactics) *
      percentMultiplier(combatAbility) *
      percentMultiplier(discipline) *
      percentMultiplier(battleDayBonus || 0);
  }

  function computeOneWay(attacker, defender, phase, dice, leaderDiff, terrainPenalty, backrowArtillery, battleDay) {
    if (battleDay === undefined) battleDay = 0;
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
    var tactics = (baseTactics(defender.techLevel) + defender.extraMilitaryTactics) * percentMultiplier(defender.discipline);

    var damageDonePhase = phase === "fire" ? (attacker.damageDoneFire || attacker.damageDone || 0) : (attacker.damageDoneShock || attacker.damageDone || 0);
    var professionalDamageBonus = attacker.damageBonus != null
      ? attacker.damageBonus
      : professionalismDamageBonus(attacker.professionalism);
    var damageTakenPhase = phase === "fire" ? (defender.damageTakenFire || defender.damageTaken || 0) : (defender.damageTakenShock || defender.damageTaken || 0);
    var combatAbility = attacker.combatAbility || 0;
    if (attacker.unitType === "Infantry") combatAbility = attacker.combatAbilityInfantry || combatAbility;
    else if (attacker.unitType === "Cavalry") combatAbility = attacker.combatAbilityCavalry || combatAbility;
    else if (attacker.unitType === "Artillery") combatAbility = attacker.combatAbilityArtillery || combatAbility;
    var multiplier = computeMultipliers(attacker.strength, tech, tactics, combatAbility, attacker.discipline, battleDay)
      * percentMultiplier(damageDonePhase + professionalDamageBonus)
      * percentMultiplier(damageTakenPhase);

    if (backrowArtillery && attacker.unitType === "Artillery") {
      multiplier *= 0.5;
    }

    return {
      attackerPips: attackerPips,
      defenderPips: defenderPips,
      baseCasualties: baseCasualties,
      tech: tech,
      tactics: tactics,
      damageBonus: professionalDamageBonus,
      professionalismDamageBonus: professionalDamageBonus,
      effectiveDamageDone: damageDonePhase + professionalDamageBonus,
      damage: baseCasualties * multiplier
    };
  }

  function randomDice() {
    return Math.floor(Math.random() * 10);
  }

  M['shared/calc-engine'] = {
    percentMultiplier: percentMultiplier,
    professionalismDamageBonus: professionalismDamageBonus,
    baseTactics: baseTactics,
    baseMorale: baseMorale,
    techModifier: techModifier,
    lookupUnit: lookupUnit,
    validateNumber: validateNumber,
    computeBaseCasualties: computeBaseCasualties,
    computeMultipliers: computeMultipliers,
    computeOneWay: computeOneWay,
    randomDice: randomDice
  };
})(window._M = window._M || {});
