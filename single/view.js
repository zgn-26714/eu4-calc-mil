(function(M) {
  var uiHelpers = M['shared/ui-helpers'];
  var translateGroup = uiHelpers.translateGroup;
  var translateUnit = uiHelpers.translateUnit;

  function renderSingleResults(dom, result) {
    var attackerToDefender = result.attackerToDefender;
    var defenderToAttacker = result.defenderToAttacker;
    var attToDefMorale = result.attToDefMorale;
    var defToAttMorale = result.defToAttMorale;
    var attBaseMorale = result.attBaseMorale;
    var defBaseMorale = result.defBaseMorale;
    var attFinalMorale = result.attFinalMorale;
    var defFinalMorale = result.defFinalMorale;
    var attacker = result.attacker;
    var defender = result.defender;
    var phase = result.phase;
    var attackerDice = result.attackerDice;
    var defenderDice = result.defenderDice;
    var attackerLeaderDiff = result.attackerLeaderDiff;
    var defenderLeaderDiff = result.defenderLeaderDiff;
    var attackerPenalty = result.attackerPenalty;
    var attackerPenaltyInfo = result.attackerPenaltyInfo;
    var riverCrossing = result.riverCrossing;
    var terrainPenalty = result.terrainPenalty;

    dom.attackerLossEl.textContent = defenderToAttacker.damage.toFixed(2);
    dom.defenderLossEl.textContent = attackerToDefender.damage.toFixed(2);
    dom.attackerMoraleLossEl.textContent = defToAttMorale.moraleDamage.toFixed(2);
    dom.defenderMoraleLossEl.textContent = attToDefMorale.moraleDamage.toFixed(2);

    dom.detailsOutput.textContent = [
      "阶段：" + (phase === "fire" ? "火力" : "冲击"),
      "进攻方骰子：" + attackerDice + "  防守方骰子：" + defenderDice,
      "进攻方兵员损失：" + defenderToAttacker.damage.toFixed(2),
      "防守方兵员损失：" + attackerToDefender.damage.toFixed(2),
      "进攻方士气损失：" + defToAttMorale.moraleDamage.toFixed(2),
      "防守方士气损失：" + attToDefMorale.moraleDamage.toFixed(2),
      "",
      "--- 士气参数 ---",
      "进攻方科技基础士气=" + attBaseMorale.toFixed(1) + "  额外士气加成=" + attacker.moraleBonus.toFixed(1) + "%  陆军传统=" + attacker.armyTradition + "  威望=" + attacker.prestige + "  最终最大士气=" + attFinalMorale.toFixed(2),
      "防守方科技基础士气=" + defBaseMorale.toFixed(1) + "  额外士气加成=" + defender.moraleBonus.toFixed(1) + "%  陆军传统=" + defender.armyTradition + "  威望=" + defender.prestige + "  最终最大士气=" + defFinalMorale.toFixed(2),
      "",
      "--- 兵员伤害明细 ---",
      "进攻方 -> 防守方",
      "兵种组：" + translateGroup(attacker.group) + "；兵种：" + translateUnit(attacker.unitName),
      "基础伤亡 = max(15, 15 + 5 x (" + attackerDice.toFixed(2) + " + " + attackerLeaderDiff.toFixed(2) + " + " + attackerToDefender.attackerPips.toFixed(2) + " - " + attackerToDefender.defenderPips.toFixed(2) + " - " + attackerPenalty.toFixed(2) + ")) = " + attackerToDefender.baseCasualties.toFixed(2),
      attackerPenaltyInfo.ignoredByManeuver
        ? ("跨河惩罚=" + riverCrossing.toFixed(2) + "，但攻方机动高于守方，因此本次按 0 计算；总惩罚=" + attackerPenalty.toFixed(2))
        : ("进攻地形惩罚=" + terrainPenalty.toFixed(2) + "，跨河惩罚=" + attackerPenaltyInfo.riverPenaltyApplied.toFixed(2) + "；总惩罚=" + attackerPenalty.toFixed(2)),
      "科技修正 = " + attackerToDefender.tech.toFixed(2) + "，守方战术 = " + attackerToDefender.tactics.toFixed(2),
      "",
      "防守方 -> 进攻方",
      "兵种组：" + translateGroup(defender.group) + "；兵种：" + translateUnit(defender.unitName),
      "基础伤亡 = max(15, 15 + 5 x (" + defenderDice.toFixed(2) + " + " + defenderLeaderDiff.toFixed(2) + " + " + defenderToAttacker.attackerPips.toFixed(2) + " - " + defenderToAttacker.defenderPips.toFixed(2) + " - 0.00)) = " + defenderToAttacker.baseCasualties.toFixed(2),
      "科技修正 = " + defenderToAttacker.tech.toFixed(2) + "，守方战术 = " + defenderToAttacker.tactics.toFixed(2),
      "",
      "--- 士气损失明细 ---",
      "最大士气 = 科技基础士气 x (1 + 额外士气加成 + 陆军传统加成 + 威望加成)",
      "士气损失 = 基础伤亡 x 基础乘数 x (1+士气损失修正) x (1+士气承受伤害修正) x (己方最大士气/540)",
      "进攻方 -> 防守方：基础伤亡=" + attackerToDefender.baseCasualties.toFixed(2) + "  己方士气=" + attFinalMorale.toFixed(2) + "  -> 士气损失=" + attToDefMorale.moraleDamage.toFixed(2),
      "防守方 -> 进攻方：基础伤亡=" + defenderToAttacker.baseCasualties.toFixed(2) + "  己方士气=" + defFinalMorale.toFixed(2) + "  -> 士气损失=" + defToAttMorale.moraleDamage.toFixed(2),
      "防守方被动士气损耗/天：" + attToDefMorale.passiveMoraleLoss.toFixed(4) + "（职业度 100 时减半）",
      "进攻方被动士气损耗/天：" + defToAttMorale.passiveMoraleLoss.toFixed(4) + "（职业度 100 时减半）"
    ].join("\n");
  }

  M['single/view'] = { renderSingleResults: renderSingleResults };
})(window._M = window._M || {});
