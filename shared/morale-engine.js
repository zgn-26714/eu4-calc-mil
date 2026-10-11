(function(M) {
  var calcEngine = M['shared/calc-engine'];
  var percentMultiplier = calcEngine.percentMultiplier;
  var defenseMultiplier = calcEngine.defenseMultiplier;
  var baseTactics = calcEngine.baseTactics;
  var baseMorale = calcEngine.baseMorale;
  var techModifier = calcEngine.techModifier;
  var lookupUnit = calcEngine.lookupUnit;
  var computeBaseCasualties = calcEngine.computeBaseCasualties;
  var toFixedPoint = calcEngine.toFixedPoint;
  var fixedMultiply = calcEngine.fixedMultiply;
  var fixedDivide = calcEngine.fixedDivide;

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
    return toFixedPoint(moraleBase * mult) / 1000;
  }

  function computeMoraleDamage(attacker, defender, phase, dice, leaderDiff, terrainPenalty, backrowArtillery, battleDay) {
    if (battleDay === undefined) battleDay = 1;
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
    var tacticsFixed = fixedMultiply(
      toFixedPoint(baseTactics(defender.techLevel) + (defender.extraMilitaryTactics || 0)),
      toFixedPoint(percentMultiplier(defender.discipline || 0))
    );

    var combatAbility = attacker.combatAbility || 0;
    if (attacker.unitType === "Infantry") combatAbility = attacker.combatAbilityInfantry || combatAbility;
    else if (attacker.unitType === "Cavalry") combatAbility = attacker.combatAbilityCavalry || combatAbility;
    else if (attacker.unitType === "Artillery") combatAbility = attacker.combatAbilityArtillery || combatAbility;
    var enemyMaxMorale = attacker.maxMorale != null ? attacker.maxMorale : computeMaxMorale(
      attacker.techLevel || 0, attacker.moraleBonus || 0, attacker.armyTradition || 0,
      attacker.prestige || 0, attacker.powerProjection || 0
    );
    var defenderRegiments = defender.regimentCount != null
      ? defender.regimentCount
      : Math.max(1, Math.round(defender.strength / 1000));
    // Local eu4.exe RVA 0x226a63 onward: first divide maximum morale by 2.7,
    // then multiply the independent morale-pip base and the remaining factors.
    // Every step discards the fixed-point remainder; do not reduce this to /540.
    var baseFixed = Math.trunc(Math.max(25, Math.min(550, baseCas * 5)));
    var moraleFixed = fixedDivide(toFixedPoint(enemyMaxMorale), 2700);
    var rawCombat = enemyMaxMorale / 2.7;
    var steps = [{ name: '最大士气除以2.7', value: moraleFixed, rawValue: rawCombat }];
    function multiplyStep(name, factor) {
      var beforeTruncation = moraleFixed / 1000 * factor;
      moraleFixed = fixedMultiply(moraleFixed, toFixedPoint(factor));
      rawCombat *= factor;
      steps.push({ name: name, value: moraleFixed, rawValue: beforeTruncation });
    }
    multiplyStep('乘士气点数内部基础值', baseFixed / 1000);
    multiplyStep('乘日初兵力比例', attacker.strength / 1000);
    multiplyStep('乘训练度', percentMultiplier(attacker.discipline || 0));
    var divisionRaw = moraleFixed / tacticsFixed;
    moraleFixed = fixedDivide(moraleFixed, tacticsFixed);
    rawCombat /= tacticsFixed / 1000;
    steps.push({ name: '除守方战术', value: moraleFixed, rawValue: divisionRaw });
    // RVA 0x226b77 calls the unit combat-ability getter; the added r12d
    // comes from leader getter 0x868680, NOT army professionalism.
    // Professionalism's fire/shock damage bonuses belong to troop damage.
    multiplyStep('乘作战能力', percentMultiplier(combatAbility));
    multiplyStep('乘科技阶段系数', tech);
    multiplyStep('乘战斗天数加成', 1 + battleDay / 100);
    multiplyStep('乘承受士气伤害修正', defenseMultiplier(defender.moraleDamageTaken || 0));
    multiplyStep('乘造成士气伤害修正', percentMultiplier(attacker.moraleDamageDone || 0));
    if (backrowArtillery && attacker.unitType === "Artillery") {
      multiplyStep('乘炮兵士气系数', 0.4);
    }
    // Passive damage is computed per regiment, truncated BEFORE summing, and
    // added once outside the combat/day multipliers (local RVA 0x22775b).
    var passiveFixed = fixedMultiply(toFixedPoint(enemyMaxMorale), 10) * defenderRegiments;
    var rawPassive = enemyMaxMorale * 0.01 * defenderRegiments;
    var rawMoraleDamage = rawCombat + rawPassive;
    var actualMoraleDamage = (moraleFixed + passiveFixed) / 1000;

    return {
      baseCasualties: baseFixed / 5,
      battleDay: battleDay,
      fixedPointSteps: steps,
      combatMoraleDamage: moraleFixed / 1000,
      passiveMoraleDamage: passiveFixed / 1000,
      rawCombatMoraleDamage: rawCombat,
      rawPassiveMoraleDamage: rawPassive,
      rawMoraleDamage: rawMoraleDamage,
      moraleDamage: actualMoraleDamage
    };
  }

  function subtractMorale(currentMorale, moraleDamage) {
    return Math.max(0, toFixedPoint(currentMorale) - toFixedPoint(moraleDamage)) / 1000;
  }

  function computeMoraleBreak(currentMorale, maxMorale, moraleDamage, regimentCount) {
    var newMorale = subtractMorale(currentMorale, moraleDamage);
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
    computeMoraleDamage: computeMoraleDamage,
    subtractMorale: subtractMorale,
    computeMoraleBreak: computeMoraleBreak,
    randomDiceMorale: randomDiceMorale
  };
})(window._M = window._M || {});
