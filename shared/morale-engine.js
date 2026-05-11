(function(M) {
  var calcEngine = M['shared/calc-engine'];
  var percentMultiplier = calcEngine.percentMultiplier;
  var baseTactics = calcEngine.baseTactics;
  var baseMorale = calcEngine.baseMorale;
  var techModifier = calcEngine.techModifier;
  var lookupUnit = calcEngine.lookupUnit;
  var computeBaseCasualties = calcEngine.computeBaseCasualties;
  var computeMultipliers = calcEngine.computeMultipliers;

  function computeMaxMorale(techLevel, extraMorale, armyTradition, prestige, powerProjection, advisorBonus, goldenAge, otherModifiers) {
    var moraleBase = baseMorale(techLevel || 0);
    var mult = 1.0;
    mult += (extraMorale || 0) / 100;
    mult += (armyTradition || 0) * 0.0025;
    mult += (prestige || 0) * 0.001;
    mult += (powerProjection || 0) * 0.001;
    if (advisorBonus) mult += 0.10;
    if (goldenAge) mult += 0.10;
    mult += (otherModifiers || 0) / 100;
    return moraleBase * mult;
  }

  function computePassiveMoraleLoss(enemyAvgMorale, professionalism) {
    var reduction = (professionalism || 0) >= 100 ? 0.5 : 0.0;
    return 0.01 * enemyAvgMorale * (1 - reduction);
  }

  function computeMoraleDamage(attacker, defender, phase, dice, leaderDiff, terrainPenalty, backrowArtillery, battleDay, defProfessionalism) {
    var attackerUnit = lookupUnit(attacker.group, attacker.unitType, attacker.unitName);
    var defenderUnit = lookupUnit(defender.group, defender.unitType, defender.unitName);

    var attackerPips = (attackerUnit.moraleOff || 0) + (phase === "fire" ? attackerUnit.fireOff : attackerUnit.shockOff);
    var defenderPips = (defenderUnit.moraleDef || 0) + (phase === "fire" ? defenderUnit.fireDef : defenderUnit.shockDef);

    var baseCas = computeBaseCasualties(dice, leaderDiff, attackerPips, defenderPips, terrainPenalty);

    var phaseDamage = 0;
    if (phase === "fire") {
      if (attacker.unitType === "Infantry") phaseDamage = (attacker.fireDamageInfantry || attacker.fireDamage || 0);
      else if (attacker.unitType === "Cavalry") phaseDamage = (attacker.fireDamageCavalry || attacker.fireDamage || 0);
      else if (attacker.unitType === "Artillery") phaseDamage = (attacker.fireDamageArtillery || attacker.fireDamage || 0);
    } else {
      if (attacker.unitType === "Infantry") phaseDamage = (attacker.shockDamageInfantry || attacker.shockDamage || 0);
      else if (attacker.unitType === "Cavalry") phaseDamage = (attacker.shockDamageCavalry || attacker.shockDamage || 0);
      else if (attacker.unitType === "Artillery") phaseDamage = (attacker.shockDamageArtillery || attacker.shockDamage || 0);
    }
    var tech = techModifier(attacker.techLevel, attacker.unitType, phase) + phaseDamage;
    var tactics = (baseTactics(defender.techLevel) + (defender.extraMilitaryTactics || 0)) *
      percentMultiplier(defender.discipline || 0);

    var combatAbility = attacker.combatAbility || 0;
    if (attacker.unitType === "Infantry") combatAbility = attacker.combatAbilityInfantry || combatAbility;
    else if (attacker.unitType === "Cavalry") combatAbility = attacker.combatAbilityCavalry || combatAbility;
    else if (attacker.unitType === "Artillery") combatAbility = attacker.combatAbilityArtillery || combatAbility;
    var baseMult = computeMultipliers(
      attacker.strength, tech, tactics,
      combatAbility,
      attacker.discipline || 0,
      battleDay || 0
    );

    var moraleDmg = baseCas * baseMult *
      percentMultiplier(attacker.moraleDamageDone || 0) *
      percentMultiplier(defender.moraleDamageTaken || 0) *
      ((attacker.maxMorale || 3.0) / 540);

    if (backrowArtillery && attacker.unitType === "Artillery") {
      moraleDmg *= 0.4;
    }

    var passiveLoss = computePassiveMoraleLoss(attacker.maxMorale || 3.0, defProfessionalism || 0);

    return {
      moraleDamage: moraleDmg,
      passiveMoraleLoss: passiveLoss
    };
  }

  function computeMoraleBreak(currentMorale, maxMorale, moraleDamage, regimentCount) {
    var newMorale = Math.max(0, currentMorale - moraleDamage);
    var moraleLoss = maxMorale - newMorale;
    var broken = Math.min(Math.floor(moraleLoss / maxMorale * regimentCount), regimentCount || 0);
    var moralePercent = maxMorale > 0 ? (newMorale / maxMorale * 100) : 0;

    return {
      regimentsBroken: broken,
      remainingMorale: newMorale,
      moralePercent: moralePercent
    };
  }

  function randomDiceMorale() {
    return Math.floor(Math.random() * 10);
  }

  M['shared/morale-engine'] = {
    baseMorale: baseMorale,
    computeMaxMorale: computeMaxMorale,
    computePassiveMoraleLoss: computePassiveMoraleLoss,
    computeMoraleDamage: computeMoraleDamage,
    computeMoraleBreak: computeMoraleBreak,
    randomDiceMorale: randomDiceMorale
  };
})(window._M = window._M || {});
