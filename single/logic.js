(function(M) {
  var calcEngine = M['shared/calc-engine'];
  var computeOneWay = calcEngine.computeOneWay;
  var validateNumber = calcEngine.validateNumber;

  var moraleEngine = M['shared/morale-engine'];
  var baseMorale = moraleEngine.baseMorale;
  var computeMaxMorale = moraleEngine.computeMaxMorale;
  var computeMoraleDamage = moraleEngine.computeMoraleDamage;

  var stateModule = M['shared/state'];
  var readSide = stateModule.readSide;

  var uiHelpers = M['shared/ui-helpers'];
  var translateGroup = uiHelpers.translateGroup;
  var translateUnit = uiHelpers.translateUnit;

  function leaderPhaseDiff(attacker, defender, phase, fallbackDiff) {
    if (phase === "fire") {
      if (attacker.leaderFire !== undefined || defender.leaderFire !== undefined) {
        return Math.max(0, (attacker.leaderFire || 0) - (defender.leaderFire || 0));
      }
      return Math.max(0, fallbackDiff || 0);
    }
    if (attacker.leaderShock !== undefined || defender.leaderShock !== undefined) {
      return Math.max(0, (attacker.leaderShock || 0) - (defender.leaderShock || 0));
    }
    return Math.max(0, fallbackDiff || 0);
  }

  function resolveAttackerPenalty(attacker, defender, terrainPenalty, riverCrossing) {
    var attackerManeuver = attacker && attacker.leaderManeuver !== undefined ? Number(attacker.leaderManeuver || 0) : 0;
    var defenderManeuver = defender && defender.leaderManeuver !== undefined ? Number(defender.leaderManeuver || 0) : 0;
    var ignoreRiverCrossing = riverCrossing > 0 && attackerManeuver > defenderManeuver;
    return {
      totalPenalty: terrainPenalty + (ignoreRiverCrossing ? 0 : riverCrossing),
      riverPenaltyApplied: ignoreRiverCrossing ? 0 : riverCrossing,
      ignoredByManeuver: ignoreRiverCrossing
    };
  }

  function calculateSingle(dom) {
    var attackerDice = Number(dom.singleAttackerDice.value);
    var defenderDice = Number(dom.singleDefenderDice.value);
    var terrainPenalty = Number(document.querySelector("#terrain-penalty").value);
    var riverCrossing = Number(dom.singleRiverCrossing.value || 0);
    var phase = dom.phaseSelect.value;

    [["进攻方骰子", attackerDice], ["防守方骰子", defenderDice], ["进攻地形惩罚", terrainPenalty], ["跨河惩罚", riverCrossing]].forEach(function(pair) { validateNumber(pair[0], pair[1]); });
    if (!Number.isInteger(attackerDice) || attackerDice < 0 || attackerDice > 9) {
      throw new Error("进攻方骰子应为 0 到 9 的整数。");
    }
    if (!Number.isInteger(defenderDice) || defenderDice < 0 || defenderDice > 9) {
      throw new Error("防守方骰子应为 0 到 9 的整数。");
    }
    if (terrainPenalty < 0) throw new Error("进攻地形惩罚不能为负数。");
    if (riverCrossing !== 0 && riverCrossing !== 1) throw new Error("跨河惩罚只允许为 0 或 1。");

    var attacker = readSide("attacker");
    var defender = readSide("defender");
    var attackerLeaderDiff = leaderPhaseDiff(attacker, defender, phase);
    var defenderLeaderDiff = leaderPhaseDiff(defender, attacker, phase);
    var attackerPenaltyInfo = resolveAttackerPenalty(attacker, defender, terrainPenalty, riverCrossing);
    var attackerPenalty = attackerPenaltyInfo.totalPenalty;

    var sides = [attacker, defender];
    for (var si = 0; si < sides.length; si++) {
      var side = sides[si];
      if (!Number.isInteger(side.techLevel) || side.techLevel < 0 || side.techLevel > 32) {
        throw new Error("双方军事科技都应为 0 到 32 的整数。");
      }
    }

    var attackerToDefender = computeOneWay(attacker, defender, phase, attackerDice, attackerLeaderDiff, attackerPenalty, false);
    var defenderToAttacker = computeOneWay(defender, attacker, phase, defenderDice, defenderLeaderDiff, 0, false);

    var attBaseMorale = baseMorale(attacker.techLevel);
    var defBaseMorale = baseMorale(defender.techLevel);
    var attFinalMorale = computeMaxMorale(attacker.techLevel, attacker.moraleBonus, attacker.armyTradition, attacker.prestige, attacker.powerProjection);
    var defFinalMorale = computeMaxMorale(defender.techLevel, defender.moraleBonus, defender.armyTradition, defender.prestige, defender.powerProjection);

    var attToDefMorale = computeMoraleDamage(
      Object.assign({}, attacker, { maxMorale: attFinalMorale }),
      Object.assign({}, defender, { maxMorale: defFinalMorale }),
      phase, attackerDice, attackerLeaderDiff, attackerPenalty, false, 0
    );
    var defToAttMorale = computeMoraleDamage(
      Object.assign({}, defender, { maxMorale: defFinalMorale }),
      Object.assign({}, attacker, { maxMorale: attFinalMorale }),
      phase, defenderDice, defenderLeaderDiff, 0, false, 0
    );

    return {
      attackerToDefender: attackerToDefender,
      defenderToAttacker: defenderToAttacker,
      attToDefMorale: attToDefMorale,
      defToAttMorale: defToAttMorale,
      attBaseMorale: attBaseMorale,
      defBaseMorale: defBaseMorale,
      attFinalMorale: attFinalMorale,
      defFinalMorale: defFinalMorale,
      attacker: attacker,
      defender: defender,
      phase: phase,
      attackerDice: attackerDice,
      defenderDice: defenderDice,
      attackerLeaderDiff: attackerLeaderDiff,
      defenderLeaderDiff: defenderLeaderDiff,
      attackerPenalty: attackerPenalty,
      attackerPenaltyInfo: attackerPenaltyInfo,
      riverCrossing: riverCrossing,
      terrainPenalty: terrainPenalty
    };
  }

  M['single/logic'] = {
    leaderPhaseDiff: leaderPhaseDiff,
    resolveAttackerPenalty: resolveAttackerPenalty,
    calculateSingle: calculateSingle
  };
})(window._M = window._M || {});
