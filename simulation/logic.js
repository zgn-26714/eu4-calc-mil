(function(M) {
  var calcEngine = M['shared/calc-engine'];
  var validateNumber = calcEngine.validateNumber;

  var battleSim = M['shared/battle-sim'];
  var simulateBattleWithMorale = battleSim.simulateBattleWithMorale;

  var stateModule = M['shared/state'];
  var readSide = stateModule.readSide;

  var singleLogic = M['single/logic'];
  var resolveAttackerPenalty = singleLogic.resolveAttackerPenalty;

  function parseDiceArray(text, fieldName) {
    if (!text || !text.trim()) return null;
    var parts = text.trim().split(/\s*,\s*/);
    var arr = [];
    for (var i = 0; i < parts.length; i++) {
      var v = parseInt(parts[i], 10);
      if (isNaN(v) || v < 0 || v > 9) {
        throw new Error(fieldName + " 中第" + (i + 1) + "个值 '" + parts[i] + "' 不是有效的 0-9 骰子。");
      }
      arr.push(v);
    }
    return arr;
  }

  function readSimulationBattleOptions(dom, rounds, forOpenEnded) {
    var terrainPenalty = parseFloat(dom.simTerrainPenalty.value) || 0;
    if (terrainPenalty < 0) throw new Error("进攻地形惩罚不能为负数。");
    var riverCrossing = parseInt(dom.simRiverCrossing.value, 10) || 0;
    if (riverCrossing !== 0 && riverCrossing !== 1) throw new Error("跨河惩罚只允许为 0 或 1。");

    var diceConfig = {};
    if (dom.simDiceMode.value === "manual") {
      var fireArrAtt = parseDiceArray(dom.simDiceFireAtt.value, "攻方火力骰子序列");
      var fireArrDef = parseDiceArray(dom.simDiceFireDef.value, "守方火力骰子序列");
      var shockArrAtt = parseDiceArray(dom.simDiceShockAtt.value, "攻方冲击骰子序列");
      var shockArrDef = parseDiceArray(dom.simDiceShockDef.value, "守方冲击骰子序列");
      if (fireArrAtt !== null) diceConfig.fireAtt = fireArrAtt;
      if (fireArrDef !== null) diceConfig.fireDef = fireArrDef;
      if (shockArrAtt !== null) diceConfig.shockAtt = shockArrAtt;
      if (shockArrDef !== null) diceConfig.shockDef = shockArrDef;
    } else if (dom.simDiceMode.value === "fixed") {
      var fixedVal = parseInt(dom.simDiceFixedValue.value, 10);
      if (isNaN(fixedVal) || fixedVal < 0 || fixedVal > 9) {
        throw new Error("固定骰子值应在 0 到 9 之间。");
      }
      if (forOpenEnded) {
        diceConfig.mode = "fixed";
        diceConfig.value = fixedVal;
      } else {
        diceConfig.fire = Array(rounds).fill(fixedVal);
        diceConfig.shock = Array(rounds).fill(fixedVal);
      }
    } else if (forOpenEnded) {
      diceConfig.mode = "random";
    }

    return {
      terrainPenalty: terrainPenalty,
      riverCrossing: riverCrossing,
      diceConfig: diceConfig,
      diceMode: dom.simDiceMode.value
    };
  }

  function calculateSimulation(dom) {
    var rounds = parseInt(dom.simRounds.value, 10);
    if (isNaN(rounds) || rounds < 1 || rounds > 20) {
      throw new Error("轮次数应在 1 到 20 之间。");
    }
    var attacker = readSide("attacker");
    var defender = readSide("defender");
    var battleOptions = readSimulationBattleOptions(dom, rounds, false);
    var attackerPenaltyInfo = resolveAttackerPenalty(attacker, defender, battleOptions.terrainPenalty, battleOptions.riverCrossing);

    for (var si = 0; si < 2; si++) {
      var side = si === 0 ? attacker : defender;
      if (!Number.isInteger(side.techLevel) || side.techLevel < 0 || side.techLevel > 32) {
        throw new Error("双方军事科技都应为 0 到 32 的整数。");
      }
    }

    var result = simulateBattleWithMorale(
      attacker,
      defender,
      rounds,
      battleOptions.diceConfig,
      0,
      attackerPenaltyInfo.totalPenalty,
      false
    );

    return { result: result, attacker: attacker, defender: defender, battleOptions: battleOptions, attackerPenaltyInfo: attackerPenaltyInfo };
  }

  M['simulation/logic'] = {
    parseDiceArray: parseDiceArray,
    readSimulationBattleOptions: readSimulationBattleOptions,
    calculateSimulation: calculateSimulation
  };
})(window._M = window._M || {});
