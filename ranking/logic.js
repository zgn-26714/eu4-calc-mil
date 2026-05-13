(function(M) {
  // =============================================================================
  // ranking/logic.js -- 全兵种两两配对与排行
  // 纯计算逻辑，不依赖 DOM。
  // =============================================================================

  var unitsModule = M['data/units'];
  var UNIT_DATA = unitsModule.UNIT_DATA;

  var constantsModule = M['data/constants'];
  var TOURNAMENT_UNIT_TYPES = constantsModule.TOURNAMENT_UNIT_TYPES;

  var calcEngine = M['shared/calc-engine'];
  var computeOneWay = calcEngine.computeOneWay;
  var validateNumber = calcEngine.validateNumber;

  var moraleEngine = M['shared/morale-engine'];
  var computeMaxMorale = moraleEngine.computeMaxMorale;
  var computeMoraleDamage = moraleEngine.computeMoraleDamage;
  var randomDiceMorale = moraleEngine.randomDiceMorale;

  function tournamentGroups() {
    var groups = [];
    var seen = {};
    for (var i = 0; i < UNIT_DATA.length; i++) {
      var group = UNIT_DATA[i].group;
      if (group === "Shared" || seen[group]) continue;
      seen[group] = true;
      groups.push(group);
    }
    return groups;
  }

  function tournamentUnitsForTech(group, unitType, techLevel) {
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

  function listTournamentCandidates(techLevel) {
    var candidates = [];
    var groups = tournamentGroups();

    for (var gi = 0; gi < groups.length; gi++) {
      var group = groups[gi];
      for (var ti = 0; ti < TOURNAMENT_UNIT_TYPES.length; ti++) {
        var unitType = TOURNAMENT_UNIT_TYPES[ti];
        if (unitType === "Artillery") continue;
        var units = tournamentUnitsForTech(group, unitType, techLevel);
        for (var ui = 0; ui < units.length; ui++) {
          var unit = units[ui];
          candidates.push({
            key: unitType + "|" + group + "|" + unit.unitName,
            group: group,
            unitType: unitType,
            unitName: unit.unitName,
            techLevel: unit.techLevel
          });
        }
      }
    }

    var artilleryUnits = tournamentUnitsForTech("Shared", "Artillery", techLevel);
    for (var ai = 0; ai < artilleryUnits.length; ai++) {
      var artillery = artilleryUnits[ai];
      candidates.push({
        key: "Artillery|Shared|" + artillery.unitName,
        group: "Shared",
        unitType: "Artillery",
        unitName: artillery.unitName,
        techLevel: artillery.techLevel
      });
    }

    return candidates;
  }

  function cloneCombatantFromTemplate(template, candidate) {
    var combatant = {};
    var keys = Object.keys(template);
    for (var i = 0; i < keys.length; i++) {
      combatant[keys[i]] = template[keys[i]];
    }
    combatant.group = candidate.group;
    combatant.unitType = candidate.unitType;
    combatant.unitName = candidate.unitName;
    return combatant;
  }

  function tournamentDiceForRound(diceConfig, phase, roundIndex) {
    if (!diceConfig || diceConfig.mode === "random") {
      return { attacker: randomDiceMorale(), defender: randomDiceMorale() };
    }

    if (diceConfig.mode === "fixed") {
      return { attacker: diceConfig.value, defender: diceConfig.value };
    }

    var arrAtt = phase === "fire" ? (diceConfig.fireAtt || diceConfig.fire) : (diceConfig.shockAtt || diceConfig.shock);
    var arrDef = phase === "fire" ? (diceConfig.fireDef || diceConfig.fire) : (diceConfig.shockDef || diceConfig.shock);
    var attVal = (arrAtt && arrAtt.length) ? arrAtt[roundIndex % arrAtt.length] : randomDiceMorale();
    var defVal = (arrDef && arrDef.length) ? arrDef[roundIndex % arrDef.length] : randomDiceMorale();
    return { attacker: attVal, defender: defVal };
  }

  function summarizeTournamentWinner(attackerBreakDay, defenderBreakDay) {
    if (attackerBreakDay !== null && defenderBreakDay !== null) {
      if (attackerBreakDay < defenderBreakDay) {
        return { winner: "defender", winReason: "攻方第" + attackerBreakDay + "天士气归零" };
      }
      if (defenderBreakDay < attackerBreakDay) {
        return { winner: "attacker", winReason: "守方第" + defenderBreakDay + "天士气归零" };
      }
      return { winner: "draw", winReason: "双方第" + attackerBreakDay + "天同归零" };
    }
    if (attackerBreakDay !== null) {
      return { winner: "defender", winReason: "攻方第" + attackerBreakDay + "天士气归零" };
    }
    if (defenderBreakDay !== null) {
      return { winner: "attacker", winReason: "守方第" + defenderBreakDay + "天士气归零" };
    }
    return { winner: "draw", winReason: "达到最大轮次仍未分胜负" };
  }


  function simulateBattleToMoraleBreak(attacker, defender, options) {
    options = options || {};

    var diceConfig = options.diceConfig || { mode: "random" };
    var leaderDiff = options.leaderDiff || 0;
    var terrainPenalty = options.terrainPenalty || 0;
    var backrowArtillery = !!options.backrowArtillery;
    var phaseOnly = options.phaseOnly || null;
    var maxRounds = options.maxRounds || 200;

    var attMaxMoralePerReg = computeMaxMorale(
      attacker.techLevel || 0, attacker.moraleBonus || 0, attacker.armyTradition || 0, attacker.prestige || 0, attacker.powerProjection || 0
    );
    var defMaxMoralePerReg = computeMaxMorale(
      defender.techLevel || 0, defender.moraleBonus || 0, defender.armyTradition || 0, defender.prestige || 0, defender.powerProjection || 0
    );

    var attBase = {};
    var defBase = {};
    var attackerKeys = Object.keys(attacker);
    var defenderKeys = Object.keys(defender);
    for (var i = 0; i < attackerKeys.length; i++) { attBase[attackerKeys[i]] = attacker[attackerKeys[i]]; }
    for (i = 0; i < defenderKeys.length; i++) { defBase[defenderKeys[i]] = defender[defenderKeys[i]]; }
    attBase.maxMorale = attMaxMoralePerReg;
    defBase.maxMorale = defMaxMoralePerReg;

    var attRegiments = Math.max(1, Math.round(attacker.strength / 1000));
    var defRegiments = Math.max(1, Math.round(defender.strength / 1000));
    var initialAttackerStrength = attacker.strength;
    var initialDefenderStrength = defender.strength;
    var initialAttackerMorale = attMaxMoralePerReg * attRegiments;
    var initialDefenderMorale = defMaxMoralePerReg * defRegiments;

    var attStrength = initialAttackerStrength;
    var defStrength = initialDefenderStrength;
    var attMorale = initialAttackerMorale;
    var defMorale = initialDefenderMorale;
    var attackerMoraleBreakDay = null;
    var defenderMoraleBreakDay = null;
    var attackerBreakCause = null;
    var defenderBreakCause = null;
    var battleDay = 1;
    var endedBy = "max_rounds";

    function makeState(base, strength) {
      var state = {};
      var keys = Object.keys(base);
      for (var index = 0; index < keys.length; index++) {
        state[keys[index]] = base[keys[index]];
      }
      state.strength = strength;
      return state;
    }

    function registerBreaks(day) {
      if (attackerMoraleBreakDay === null && attMorale <= 0) {
        attackerMoraleBreakDay = day;
        attackerBreakCause = attackerBreakCause || "morale";
      }
      if (defenderMoraleBreakDay === null && defMorale <= 0) {
        defenderMoraleBreakDay = day;
        defenderBreakCause = defenderBreakCause || "morale";
      }
    }


    function battleFinished() {
      return endedBy === "stalled" || attackerMoraleBreakDay !== null || defenderMoraleBreakDay !== null;
    }

    function phaseLeaderDiff(phase) {
      if ((attacker.leaderFire !== undefined || defender.leaderFire !== undefined) && phase === "fire") {
        return Math.max(0, (attacker.leaderFire || 0) - (defender.leaderFire || 0));
      }
      if ((attacker.leaderShock !== undefined || defender.leaderShock !== undefined) && phase === "shock") {
        return Math.max(0, (attacker.leaderShock || 0) - (defender.leaderShock || 0));
      }
      return Math.max(0, leaderDiff);
    }

    function executePhase(phase, dicePair, attackLeaderDiff, attackTerrainPenalty) {
      var phaseAttStrengthLoss = 0;
      var phaseDefStrengthLoss = 0;
      var phaseAttMoraleLoss = 0;
      var phaseDefMoraleLoss = 0;

      for (var dayIndex = 0; dayIndex < 3 && !battleFinished(); dayIndex++) {
        var attState = makeState(attBase, attStrength);
        var defState = makeState(defBase, defStrength);

        var a2d = computeOneWay(attState, defState, phase, dicePair.attacker, attackLeaderDiff, attackTerrainPenalty, backrowArtillery, battleDay);
        var d2a = computeOneWay(defState, attState, phase, dicePair.defender, -attackLeaderDiff, 0, backrowArtillery, battleDay);
        var a2dMorale = computeMoraleDamage(attState, defState, phase, dicePair.attacker, attackLeaderDiff, attackTerrainPenalty, backrowArtillery, battleDay);
        var d2aMorale = computeMoraleDamage(defState, attState, phase, dicePair.defender, -attackLeaderDiff, 0, backrowArtillery, battleDay);

        var attackerStrengthLoss = Math.min(attStrength, d2a.damage);
        var defenderStrengthLoss = Math.min(defStrength, a2d.damage);
        var attackerMoraleLoss = Math.min(attMorale, d2aMorale.moraleDamage);
        var defenderMoraleLoss = Math.min(defMorale, a2dMorale.moraleDamage);

        attStrength -= attackerStrengthLoss;
        defStrength -= defenderStrengthLoss;
        attMorale -= attackerMoraleLoss;
        defMorale -= defenderMoraleLoss;

        phaseAttStrengthLoss += attackerStrengthLoss;
        phaseDefStrengthLoss += defenderStrengthLoss;
        phaseAttMoraleLoss += attackerMoraleLoss;
        phaseDefMoraleLoss += defenderMoraleLoss;

        var currentDay = battleDay;
        registerBreaks(currentDay);
        if (attStrength <= 0 && defStrength <= 0) {
          endedBy = "stalled";
          break;
        }
        battleDay++;
      }

      return {
        attackerStrengthLoss: phaseAttStrengthLoss,
        defenderStrengthLoss: phaseDefStrengthLoss,
        attackerMoraleLoss: phaseAttMoraleLoss,
        defenderMoraleLoss: phaseDefMoraleLoss
      };
    }


    for (var round = 0; round < maxRounds && !battleFinished(); round++) {
      if (phaseOnly !== "shock") {
        executePhase("fire", tournamentDiceForRound(diceConfig, "fire", round), phaseLeaderDiff("fire"), terrainPenalty);
      }
      if (phaseOnly !== "fire" && !battleFinished()) {
        executePhase("shock", tournamentDiceForRound(diceConfig, "shock", round), phaseLeaderDiff("shock"), terrainPenalty);
      }
    }

    if (attackerMoraleBreakDay !== null || defenderMoraleBreakDay !== null) {
      endedBy = "morale_break";
    }

    var winnerSummary = summarizeTournamentWinner(attackerMoraleBreakDay, defenderMoraleBreakDay);
    var winReason = winnerSummary.winReason;
    if (endedBy === "stalled" && attackerMoraleBreakDay === null && defenderMoraleBreakDay === null) {
      winReason = "双方兵力同时耗尽，未出现士气归零";
    }

    return {
      winner: winnerSummary.winner,
      winReason: winReason,
      endedBy: endedBy,
      totalDays: battleDay - 1,
      initialAttackerStrength: initialAttackerStrength,
      initialDefenderStrength: initialDefenderStrength,
      finalAttackerStrength: Math.max(0, attStrength),
      finalDefenderStrength: Math.max(0, defStrength),
      totalAttackerStrengthLoss: initialAttackerStrength - attStrength,
      totalDefenderStrengthLoss: initialDefenderStrength - defStrength,
      initialAttackerMorale: initialAttackerMorale,
      initialDefenderMorale: initialDefenderMorale,
      finalAttackerMorale: Math.max(0, attMorale),
      finalDefenderMorale: Math.max(0, defMorale),
      totalAttackerMoraleLoss: initialAttackerMorale - attMorale,
      totalDefenderMoraleLoss: initialDefenderMorale - defMorale,
      attackerMoraleBreakDay: attackerMoraleBreakDay,
      defenderMoraleBreakDay: defenderMoraleBreakDay,
      attackerBreakCause: attackerBreakCause,
      defenderBreakCause: defenderBreakCause
    };
  }


  function createTournamentEntry(candidate) {
    return {
      candidate: candidate,
      points: 0,
      matches: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      totalStrengthInflicted: 0,
      totalStrengthTaken: 0,
      totalMoraleInflicted: 0,
      totalMoraleTaken: 0,
      totalDays: 0
    };
  }

  function applyTournamentMatch(entryMap, attackerCandidate, defenderCandidate, result) {
    var attackerEntry = entryMap[attackerCandidate.key];
    var defenderEntry = entryMap[defenderCandidate.key];

    attackerEntry.matches += 1;
    defenderEntry.matches += 1;
    attackerEntry.totalStrengthInflicted += result.totalDefenderStrengthLoss;
    attackerEntry.totalStrengthTaken += result.totalAttackerStrengthLoss;
    attackerEntry.totalMoraleInflicted += result.totalDefenderMoraleLoss;
    attackerEntry.totalMoraleTaken += result.totalAttackerMoraleLoss;
    attackerEntry.totalDays += result.totalDays;

    defenderEntry.totalStrengthInflicted += result.totalAttackerStrengthLoss;
    defenderEntry.totalStrengthTaken += result.totalDefenderStrengthLoss;
    defenderEntry.totalMoraleInflicted += result.totalAttackerMoraleLoss;
    defenderEntry.totalMoraleTaken += result.totalDefenderMoraleLoss;
    defenderEntry.totalDays += result.totalDays;

    if (result.winner === "attacker") {
      attackerEntry.points += 3;
      attackerEntry.wins += 1;
      defenderEntry.losses += 1;
    } else if (result.winner === "defender") {
      defenderEntry.points += 3;
      defenderEntry.wins += 1;
      attackerEntry.losses += 1;
    } else {
      attackerEntry.points += 1;
      defenderEntry.points += 1;
      attackerEntry.draws += 1;
      defenderEntry.draws += 1;
    }
  }

  function compareTournamentEntries(left, right) {
    var leftNetMorale = left.totalMoraleInflicted - left.totalMoraleTaken;
    var rightNetMorale = right.totalMoraleInflicted - right.totalMoraleTaken;
    var leftNetStrength = left.totalStrengthInflicted - left.totalStrengthTaken;
    var rightNetStrength = right.totalStrengthInflicted - right.totalStrengthTaken;

    return right.points - left.points ||
      right.wins - left.wins ||
      left.losses - right.losses ||
      rightNetMorale - leftNetMorale ||
      rightNetStrength - leftNetStrength ||
      left.candidate.unitType.localeCompare(right.candidate.unitType) ||
      left.candidate.group.localeCompare(right.candidate.group) ||
      left.candidate.unitName.localeCompare(right.candidate.unitName);
  }


  function runUnitTournament(baseTemplate, options) {
    options = options || {};
    validateNumber("军事科技", baseTemplate.techLevel);
    validateNumber("参战兵力", baseTemplate.strength);

    if (!Number.isInteger(baseTemplate.techLevel) || baseTemplate.techLevel < 0 || baseTemplate.techLevel > 32) {
      throw new Error("排行基准军事科技应为 0 到 32 的整数。");
    }
    if (!(baseTemplate.strength > 0)) {
      throw new Error("排行基准参战兵力必须大于 0。");
    }

    var candidates = listTournamentCandidates(baseTemplate.techLevel);
    if (candidates.length < 2) {
      throw new Error("当前科技下可参与排行的兵种不足 2 个。");
    }

    var entryMap = {};
    for (var i = 0; i < candidates.length; i++) {
      entryMap[candidates[i].key] = createTournamentEntry(candidates[i]);
    }

    var matchLogs = [];
    var totalPairs = 0;
    var matchId = 1;

    for (var left = 0; left < candidates.length; left++) {
      for (var right = left + 1; right < candidates.length; right++) {
        totalPairs += 1;
        var attackerCandidate = candidates[left];
        var defenderCandidate = candidates[right];

        var leftAsAttacker = simulateBattleToMoraleBreak(
          cloneCombatantFromTemplate(baseTemplate, attackerCandidate),
          cloneCombatantFromTemplate(baseTemplate, defenderCandidate),
          options
        );
        applyTournamentMatch(entryMap, attackerCandidate, defenderCandidate, leftAsAttacker);
        matchLogs.push({
          id: matchId++,
          pairId: totalPairs,
          leg: 1,
          attacker: attackerCandidate,
          defender: defenderCandidate,
          result: leftAsAttacker
        });

        var rightAsAttacker = simulateBattleToMoraleBreak(
          cloneCombatantFromTemplate(baseTemplate, defenderCandidate),
          cloneCombatantFromTemplate(baseTemplate, attackerCandidate),
          options
        );
        applyTournamentMatch(entryMap, defenderCandidate, attackerCandidate, rightAsAttacker);
        matchLogs.push({
          id: matchId++,
          pairId: totalPairs,
          leg: 2,
          attacker: defenderCandidate,
          defender: attackerCandidate,
          result: rightAsAttacker
        });
      }
    }

    var rankings = [];
    var entryKeys = Object.keys(entryMap);
    for (i = 0; i < entryKeys.length; i++) {
      rankings.push(entryMap[entryKeys[i]]);
    }
    rankings.sort(compareTournamentEntries);

    return {
      candidates: candidates,
      rankings: rankings,
      matchLogs: matchLogs,
      totalPairs: totalPairs,
      totalMatches: matchLogs.length
    };
  }

  M['ranking/logic'] = {
    tournamentGroups: tournamentGroups,
    tournamentUnitsForTech: tournamentUnitsForTech,
    listTournamentCandidates: listTournamentCandidates,
    cloneCombatantFromTemplate: cloneCombatantFromTemplate,
    tournamentDiceForRound: tournamentDiceForRound,
    summarizeTournamentWinner: summarizeTournamentWinner,
    simulateBattleToMoraleBreak: simulateBattleToMoraleBreak,
    createTournamentEntry: createTournamentEntry,
    applyTournamentMatch: applyTournamentMatch,
    compareTournamentEntries: compareTournamentEntries,
    runUnitTournament: runUnitTournament
  };
})(window._M = window._M || {});
