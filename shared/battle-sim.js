(function(M) {
  var calcEngine = M['shared/calc-engine'];
  var computeOneWay = calcEngine.computeOneWay;
  var randomDice = calcEngine.randomDice;
  var moraleEngine = M['shared/morale-engine'];
  var computeMaxMorale = moraleEngine.computeMaxMorale;
  var computeMoraleDamage = moraleEngine.computeMoraleDamage;
  var randomDiceMorale = moraleEngine.randomDiceMorale;

  function simulateBattle(attacker, defender, rounds, diceConfig, leaderDiff, terrainPenalty, backrowArtillery, phaseOnly) {
    diceConfig = diceConfig || {};
    phaseOnly = phaseOnly || null;

    var attStr = attacker.strength;
    var defStr = defender.strength;
    var initialAttacker = attacker.strength;
    var initialDefender = defender.strength;

    var battleDay = 1;
    var roundResults = [];
    var annihilated = null;

    function makeState(base, str) {
      var s = {};
      var keys = Object.keys(base);
      for (var i = 0; i < keys.length; i++) { s[keys[i]] = base[keys[i]]; }
      s.strength = str;
      return s;
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

    for (var r = 0; r < rounds && !annihilated; r++) {
      var fireDiceArrAtt = diceConfig.fireAtt || diceConfig.fire;
      var fireDiceArrDef = diceConfig.fireDef || diceConfig.fire;
      var shockDiceArrAtt = diceConfig.shockAtt || diceConfig.shock;
      var shockDiceArrDef = diceConfig.shockDef || diceConfig.shock;
      var isFixed = diceConfig.mode === 'fixed';
      var attFd, defFd, attSd, defSd;
      if (phaseOnly === 'shock') {
        attFd = null; defFd = null;
      } else if (isFixed) {
        attFd = diceConfig.value; defFd = diceConfig.value;
      } else if (fireDiceArrAtt && fireDiceArrAtt[r] !== undefined) {
        attFd = fireDiceArrAtt[r];
        defFd = (fireDiceArrDef && fireDiceArrDef[r] !== undefined) ? fireDiceArrDef[r] : attFd;
      } else {
        attFd = randomDice(); defFd = randomDice();
      }
      if (phaseOnly === 'fire') {
        attSd = null; defSd = null;
      } else if (isFixed) {
        attSd = diceConfig.value; defSd = diceConfig.value;
      } else if (shockDiceArrAtt && shockDiceArrAtt[r] !== undefined) {
        attSd = shockDiceArrAtt[r];
        defSd = (shockDiceArrDef && shockDiceArrDef[r] !== undefined) ? shockDiceArrDef[r] : attSd;
      } else {
        attSd = randomDice(); defSd = randomDice();
      }

      var roundResult = {
        round: r + 1,
        fire: null,
        shock: null
      };

      // ---- 火力阶段 (3 天) ----
      if (attFd !== null) {
        var fireDays = [];
        var fireAttLoss = 0;
        var fireDefLoss = 0;

        for (var d = 0; d < 3 && !annihilated; d++) {
          var attState = makeState(attacker, attStr);
          var defState = makeState(defender, defStr);
          var fireLeaderDiff = phaseLeaderDiff('fire');
          var defenderFireLeaderDiff = Math.max(0, -leaderDiff);
          if (attacker.leaderFire !== undefined || defender.leaderFire !== undefined) {
            defenderFireLeaderDiff = Math.max(0, (defender.leaderFire || 0) - (attacker.leaderFire || 0));
          }

          var a2d = computeOneWay(attState, defState, 'fire', attFd, fireLeaderDiff, terrainPenalty, backrowArtillery, battleDay);
          var d2a = computeOneWay(defState, attState, 'fire', defFd, defenderFireLeaderDiff, 0, backrowArtillery, battleDay);

          var aLoss = Math.min(attStr, d2a.damage);
          var dLoss = Math.min(defStr, a2d.damage);

          attStr -= aLoss;
          defStr -= dLoss;
          fireAttLoss += aLoss;
          fireDefLoss += dLoss;

          fireDays.push({
            day: battleDay,
            attackerDamage: a2d.damage,
            defenderDamage: d2a.damage,
            attackerLoss: aLoss,
            defenderLoss: dLoss,
            attackerRemaining: attStr,
            defenderRemaining: defStr
          });

          battleDay++;

          if (attStr <= 0) { annihilated = 'attacker'; break; }
          if (defStr <= 0) { annihilated = 'defender'; break; }
        }

        roundResult.fire = {
          dice: attFd,
          attackerDice: attFd,
          defenderDice: defFd,
          attackerLoss: fireAttLoss,
          defenderLoss: fireDefLoss,
          days: fireDays
        };
      }
/* __PLACEHOLDER_BATTLESIM_SHOCK__ */

      // ---- 冲击阶段 (3 天) ----
      if (attSd !== null && !annihilated) {
        var shockDays = [];
        var shockAttLoss = 0;
        var shockDefLoss = 0;

        for (d = 0; d < 3 && !annihilated; d++) {
          var attState = makeState(attacker, attStr);
          var defState = makeState(defender, defStr);
          var shockLeaderDiff = phaseLeaderDiff('shock');
          var defenderShockLeaderDiff = Math.max(0, -leaderDiff);
          if (attacker.leaderShock !== undefined || defender.leaderShock !== undefined) {
            defenderShockLeaderDiff = Math.max(0, (defender.leaderShock || 0) - (attacker.leaderShock || 0));
          }

          var a2d = computeOneWay(attState, defState, 'shock', attSd, shockLeaderDiff, terrainPenalty, backrowArtillery, battleDay);
          var d2a = computeOneWay(defState, attState, 'shock', defSd, defenderShockLeaderDiff, 0, backrowArtillery, battleDay);

          var aLoss = Math.min(attStr, d2a.damage);
          var dLoss = Math.min(defStr, a2d.damage);

          attStr -= aLoss;
          defStr -= dLoss;
          shockAttLoss += aLoss;
          shockDefLoss += dLoss;

          shockDays.push({
            day: battleDay,
            attackerDamage: a2d.damage,
            defenderDamage: d2a.damage,
            attackerLoss: aLoss,
            defenderLoss: dLoss,
            attackerRemaining: attStr,
            defenderRemaining: defStr
          });

          battleDay++;

          if (attStr <= 0) { annihilated = 'attacker'; break; }
          if (defStr <= 0) { annihilated = 'defender'; break; }
        }

        roundResult.shock = {
          dice: attSd,
          attackerDice: attSd,
          defenderDice: defSd,
          attackerLoss: shockAttLoss,
          defenderLoss: shockDefLoss,
          days: shockDays
        };
      }

      roundResults.push(roundResult);
    }

    var totalAttackerLoss = initialAttacker - attStr;
    var totalDefenderLoss = initialDefender - defStr;

    var winner = null;
    if (annihilated === 'attacker') {
      winner = 'defender';
    } else if (annihilated === 'defender') {
      winner = 'attacker';
    } else if (totalDefenderLoss > totalAttackerLoss) {
      winner = 'attacker';
    } else if (totalAttackerLoss > totalDefenderLoss) {
      winner = 'defender';
    } else {
      winner = 'draw';
    }

    return {
      rounds: roundResults,
      initialAttacker: initialAttacker,
      initialDefender: initialDefender,
      finalAttacker: Math.max(0, attStr),
      finalDefender: Math.max(0, defStr),
      totalAttackerLoss: totalAttackerLoss,
      totalDefenderLoss: totalDefenderLoss,
      totalDays: battleDay - 1,
      winner: winner,
      annihilated: annihilated
    };
  }
/* __PLACEHOLDER_BATTLESIM_MORALE__ */

  function simulateBattleWithMorale(attacker, defender, rounds, diceConfig, leaderDiff, terrainPenalty, backrowArtillery, phaseOnly) {
    diceConfig = diceConfig || {};
    phaseOnly = phaseOnly || null;

    var attMaxMoralePerReg = computeMaxMorale(
      attacker.techLevel || 0, attacker.moraleBonus || 0, attacker.armyTradition || 0, attacker.prestige || 0, attacker.powerProjection || 0
    );
    var defMaxMoralePerReg = computeMaxMorale(
      defender.techLevel || 0, defender.moraleBonus || 0, defender.armyTradition || 0, defender.prestige || 0, defender.powerProjection || 0
    );

    var attBase = {};
    var defBase = {};
    var aKeys = Object.keys(attacker);
    var dKeys = Object.keys(defender);
    for (var ki = 0; ki < aKeys.length; ki++) { attBase[aKeys[ki]] = attacker[aKeys[ki]]; }
    for (ki = 0; ki < dKeys.length; ki++) { defBase[dKeys[ki]] = defender[dKeys[ki]]; }
    attBase.maxMorale = attMaxMoralePerReg;
    defBase.maxMorale = defMaxMoralePerReg;

    var attRegiments = Math.max(1, Math.round(attacker.strength / 1000));
    var defRegiments = Math.max(1, Math.round(defender.strength / 1000));

    var attTotalMaxMorale = attMaxMoralePerReg * attRegiments;
    var defTotalMaxMorale = defMaxMoralePerReg * defRegiments;

    var attStrength = attacker.strength;
    var defStrength = defender.strength;
    var initialAttStrength = attacker.strength;
    var initialDefStrength = defender.strength;

    var attCurrentMorale = attTotalMaxMorale;
    var defCurrentMorale = defTotalMaxMorale;
    var initialAttMorale = attTotalMaxMorale;
    var initialDefMorale = defTotalMaxMorale;

    var battleDay = 1;

    function phaseLeaderDiff(phase) {
      if ((attacker.leaderFire !== undefined || defender.leaderFire !== undefined) && phase === "fire") {
        return Math.max(0, (attacker.leaderFire || 0) - (defender.leaderFire || 0));
      }
      if ((attacker.leaderShock !== undefined || defender.leaderShock !== undefined) && phase === "shock") {
        return Math.max(0, (attacker.leaderShock || 0) - (defender.leaderShock || 0));
      }
      return Math.max(0, leaderDiff);
    }
    var roundResults = [];
    var annihilated = null;
    var moraleBroken = null;
    var attackerMoraleBreakDay = null;
    var defenderMoraleBreakDay = null;
/* __PLACEHOLDER_BATTLESIM_MORALE2__ */

    function makeState(base, str) {
      var s = {};
      var keys = Object.keys(base);
      for (var i = 0; i < keys.length; i++) { s[keys[i]] = base[keys[i]]; }
      s.strength = str;
      return s;
    }

    function updateMoraleBreakDays(day) {
      if (attackerMoraleBreakDay === null && attCurrentMorale <= 0) {
        attackerMoraleBreakDay = day;
      }
      if (defenderMoraleBreakDay === null && defCurrentMorale <= 0) {
        defenderMoraleBreakDay = day;
      }
      if (!moraleBroken) {
        if (attackerMoraleBreakDay !== null && defenderMoraleBreakDay !== null) {
          moraleBroken = 'both';
        } else if (attackerMoraleBreakDay !== null) {
          moraleBroken = 'attacker';
        } else if (defenderMoraleBreakDay !== null) {
          moraleBroken = 'defender';
        }
      }
    }

    for (var r = 0; r < rounds && !annihilated && !moraleBroken; r++) {
      var fireDiceArrAtt = diceConfig.fireAtt || diceConfig.fire;
      var fireDiceArrDef = diceConfig.fireDef || diceConfig.fire;
      var shockDiceArrAtt = diceConfig.shockAtt || diceConfig.shock;
      var shockDiceArrDef = diceConfig.shockDef || diceConfig.shock;
      var isFixed = diceConfig.mode === 'fixed';
      var attFd, defFd, attSd, defSd;
      if (phaseOnly === 'shock') {
        attFd = null; defFd = null;
      } else if (isFixed) {
        attFd = diceConfig.value; defFd = diceConfig.value;
      } else if (fireDiceArrAtt && fireDiceArrAtt[r] !== undefined) {
        attFd = fireDiceArrAtt[r];
        defFd = (fireDiceArrDef && fireDiceArrDef[r] !== undefined) ? fireDiceArrDef[r] : attFd;
      } else {
        attFd = randomDiceMorale(); defFd = randomDiceMorale();
      }
      if (phaseOnly === 'fire') {
        attSd = null; defSd = null;
      } else if (isFixed) {
        attSd = diceConfig.value; defSd = diceConfig.value;
      } else if (shockDiceArrAtt && shockDiceArrAtt[r] !== undefined) {
        attSd = shockDiceArrAtt[r];
        defSd = (shockDiceArrDef && shockDiceArrDef[r] !== undefined) ? shockDiceArrDef[r] : attSd;
      } else {
        attSd = randomDiceMorale(); defSd = randomDiceMorale();
      }

      var roundResult = {
        round: r + 1,
        fire: null,
        shock: null
      };
/* __PLACEHOLDER_BATTLESIM_MORALE_FIRE__ */

      // ---- 火力阶段 (3 天) ----
      if (attFd !== null) {
        var fireDays = [];
        var fireAttStrLoss = 0, fireDefStrLoss = 0;
        var fireAttMorLoss = 0, fireDefMorLoss = 0;

        for (var d = 0; d < 3 && !annihilated && !moraleBroken; d++) {
          var attState = makeState(attBase, attStrength);
          var defState = makeState(defBase, defStrength);
          var fireLeaderDiff = phaseLeaderDiff('fire');
          var defenderFireLeaderDiff = Math.max(0, -leaderDiff);
          if (attacker.leaderFire !== undefined || defender.leaderFire !== undefined) {
            defenderFireLeaderDiff = Math.max(0, (defender.leaderFire || 0) - (attacker.leaderFire || 0));
          }

          var a2d = computeOneWay(attState, defState, 'fire', attFd, fireLeaderDiff, terrainPenalty, backrowArtillery, battleDay);
          var d2a = computeOneWay(defState, attState, 'fire', defFd, defenderFireLeaderDiff, 0, backrowArtillery, battleDay);

          var aStrLoss = Math.min(attStrength, d2a.damage);
          var dStrLoss = Math.min(defStrength, a2d.damage);

          var a2dMorale = computeMoraleDamage(attState, defState, 'fire', attFd, fireLeaderDiff, terrainPenalty, backrowArtillery, battleDay);
          var d2aMorale = computeMoraleDamage(defState, attState, 'fire', defFd, defenderFireLeaderDiff, 0, backrowArtillery, battleDay);

          var aMorLoss = Math.min(attCurrentMorale, d2aMorale.moraleDamage);
          var dMorLoss = Math.min(defCurrentMorale, a2dMorale.moraleDamage);

          attStrength -= aStrLoss;
          defStrength -= dStrLoss;
          attCurrentMorale -= aMorLoss;
          defCurrentMorale -= dMorLoss;

          fireAttStrLoss += aStrLoss;
          fireDefStrLoss += dStrLoss;
          fireAttMorLoss += aMorLoss;
          fireDefMorLoss += dMorLoss;

          var attBroken = Math.min(Math.floor(Math.max(0, initialAttMorale - attCurrentMorale) / attMaxMoralePerReg), attRegiments);
          var defBroken = Math.min(Math.floor(Math.max(0, initialDefMorale - defCurrentMorale) / defMaxMoralePerReg), defRegiments);

          fireDays.push({
            day: battleDay,
            attackerStrengthDmg: a2d.damage,
            defenderStrengthDmg: d2a.damage,
            attackerStrengthLoss: aStrLoss,
            defenderStrengthLoss: dStrLoss,
            attackerStrengthRemaining: attStrength,
            defenderStrengthRemaining: defStrength,
            attackerMoraleDmg: a2dMorale.moraleDamage,
            defenderMoraleDmg: d2aMorale.moraleDamage,
            attackerMoraleLoss: aMorLoss,
            defenderMoraleLoss: dMorLoss,
            attackerCurrentMorale: attCurrentMorale,
            defenderCurrentMorale: defCurrentMorale,
            attackerBrokenRegiments: attBroken,
            defenderBrokenRegiments: defBroken
          });
/* __PLACEHOLDER_BATTLESIM_MORALE_FIRE2__ */

          var currentDay = battleDay;
          battleDay++;

          if (attStrength <= 0) { annihilated = 'attacker'; break; }
          if (defStrength <= 0) { annihilated = 'defender'; break; }
          updateMoraleBreakDays(currentDay);
          if (moraleBroken) { break; }
        }

        roundResult.fire = {
          dice: attFd,
          attackerDice: attFd,
          defenderDice: defFd,
          attackerStrengthLoss: fireAttStrLoss,
          defenderStrengthLoss: fireDefStrLoss,
          attackerMoraleLoss: fireAttMorLoss,
          defenderMoraleLoss: fireDefMorLoss,
          days: fireDays
        };
      }

      // ---- 冲击阶段 (3 天) ----
      if (attSd !== null && !annihilated && !moraleBroken) {
        var shockDays = [];
        var shockAttStrLoss = 0, shockDefStrLoss = 0;
        var shockAttMorLoss = 0, shockDefMorLoss = 0;

        for (d = 0; d < 3 && !annihilated && !moraleBroken; d++) {
          var attState = makeState(attBase, attStrength);
          var defState = makeState(defBase, defStrength);
          var shockLeaderDiff = phaseLeaderDiff('shock');
          var defenderShockLeaderDiff = Math.max(0, -leaderDiff);
          if (attacker.leaderShock !== undefined || defender.leaderShock !== undefined) {
            defenderShockLeaderDiff = Math.max(0, (defender.leaderShock || 0) - (attacker.leaderShock || 0));
          }

          var a2d = computeOneWay(attState, defState, 'shock', attSd, shockLeaderDiff, terrainPenalty, backrowArtillery, battleDay);
          var d2a = computeOneWay(defState, attState, 'shock', defSd, defenderShockLeaderDiff, 0, backrowArtillery, battleDay);

          var aStrLoss = Math.min(attStrength, d2a.damage);
          var dStrLoss = Math.min(defStrength, a2d.damage);

          var a2dMorale = computeMoraleDamage(attState, defState, 'shock', attSd, shockLeaderDiff, terrainPenalty, backrowArtillery, battleDay);
          var d2aMorale = computeMoraleDamage(defState, attState, 'shock', defSd, defenderShockLeaderDiff, 0, backrowArtillery, battleDay);

          var aMorLoss = Math.min(attCurrentMorale, d2aMorale.moraleDamage);
          var dMorLoss = Math.min(defCurrentMorale, a2dMorale.moraleDamage);

          attStrength -= aStrLoss;
          defStrength -= dStrLoss;
          attCurrentMorale -= aMorLoss;
          defCurrentMorale -= dMorLoss;
/* __PLACEHOLDER_BATTLESIM_MORALE_SHOCK2__ */

          shockAttStrLoss += aStrLoss;
          shockDefStrLoss += dStrLoss;
          shockAttMorLoss += aMorLoss;
          shockDefMorLoss += dMorLoss;

          var attBroken = Math.min(Math.floor(Math.max(0, initialAttMorale - attCurrentMorale) / attMaxMoralePerReg), attRegiments);
          var defBroken = Math.min(Math.floor(Math.max(0, initialDefMorale - defCurrentMorale) / defMaxMoralePerReg), defRegiments);

          shockDays.push({
            day: battleDay,
            attackerStrengthDmg: a2d.damage,
            defenderStrengthDmg: d2a.damage,
            attackerStrengthLoss: aStrLoss,
            defenderStrengthLoss: dStrLoss,
            attackerStrengthRemaining: attStrength,
            defenderStrengthRemaining: defStrength,
            attackerMoraleDmg: a2dMorale.moraleDamage,
            defenderMoraleDmg: d2aMorale.moraleDamage,
            attackerMoraleLoss: aMorLoss,
            defenderMoraleLoss: dMorLoss,
            attackerCurrentMorale: attCurrentMorale,
            defenderCurrentMorale: defCurrentMorale,
            attackerBrokenRegiments: attBroken,
            defenderBrokenRegiments: defBroken
          });

          var currentDay = battleDay;
          battleDay++;

          if (attStrength <= 0) { annihilated = 'attacker'; break; }
          if (defStrength <= 0) { annihilated = 'defender'; break; }
          updateMoraleBreakDays(currentDay);
          if (moraleBroken) { break; }
        }

        roundResult.shock = {
          dice: attSd,
          attackerDice: attSd,
          defenderDice: defSd,
          attackerStrengthLoss: shockAttStrLoss,
          defenderStrengthLoss: shockDefStrLoss,
          attackerMoraleLoss: shockAttMorLoss,
          defenderMoraleLoss: shockDefMorLoss,
          days: shockDays
        };
      }

      roundResults.push(roundResult);
    }
/* __PLACEHOLDER_BATTLESIM_SUMMARY__ */

    var totalAttStrLoss = initialAttStrength - attStrength;
    var totalDefStrLoss = initialDefStrength - defStrength;
    var totalAttMorLoss = initialAttMorale - attCurrentMorale;
    var totalDefMorLoss = initialDefMorale - defCurrentMorale;

    var winner = null;
    if (annihilated === 'attacker' || moraleBroken === 'attacker') {
      winner = 'defender';
    } else if (annihilated === 'defender' || moraleBroken === 'defender') {
      winner = 'attacker';
    } else if (moraleBroken === 'both') {
      winner = 'draw';
    } else if (totalDefStrLoss > totalAttStrLoss) {
      winner = 'attacker';
    } else if (totalAttStrLoss > totalDefStrLoss) {
      winner = 'defender';
    } else {
      winner = 'draw';
    }

    var winReason = '';
    if (annihilated) {
      winReason = (annihilated === 'attacker' ? '攻方' : '守方') + '被全歼';
    } else if (moraleBroken === 'both') {
      winReason = '双方同日士气崩溃';
    } else if (moraleBroken) {
      winReason = (moraleBroken === 'attacker' ? '攻方' : '守方') + '士气崩溃';
    }

    return {
      rounds: roundResults,
      initialAttackerStrength: initialAttStrength,
      initialDefenderStrength: initialDefStrength,
      finalAttackerStrength: Math.max(0, attStrength),
      finalDefenderStrength: Math.max(0, defStrength),
      totalAttackerStrengthLoss: totalAttStrLoss,
      totalDefenderStrengthLoss: totalDefStrLoss,
      initialAttackerMorale: initialAttMorale,
      initialDefenderMorale: initialDefMorale,
      finalAttackerMorale: Math.max(0, attCurrentMorale),
      finalDefenderMorale: Math.max(0, defCurrentMorale),
      totalAttackerMoraleLoss: totalAttMorLoss,
      totalDefenderMoraleLoss: totalDefMorLoss,
      attMaxMoralePerRegiment: attMaxMoralePerReg,
      defMaxMoralePerRegiment: defMaxMoralePerReg,
      attRegiments: attRegiments,
      defRegiments: defRegiments,
      totalDays: battleDay - 1,
      winner: winner,
      winReason: winReason,
      annihilated: annihilated,
      moraleBroken: moraleBroken,
      attackerMoraleBreakDay: attackerMoraleBreakDay,
      defenderMoraleBreakDay: defenderMoraleBreakDay
    };
  }

  M['shared/battle-sim'] = {
    simulateBattle: simulateBattle,
    simulateBattleWithMorale: simulateBattleWithMorale
  };
})(window._M = window._M || {});
