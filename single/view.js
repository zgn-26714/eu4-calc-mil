(function(M) {
  var uiHelpers = M['shared/ui-helpers'];
  var translateGroup = uiHelpers.translateGroup;
  var translateUnit = uiHelpers.translateUnit;

  function strengthSteps(result) {
    return result.fixedPointSteps.map(function(step) {
      return step.name + ' = ' + (step.value / 1000).toFixed(3);
    }).join('\n') + '\n换算人数 = ' + result.damage + ' 人';
  }

  function moraleSteps(result) {
    return result.fixedPointSteps.map(function(step) {
      return step.name + '：截断前=' + step.rawValue + '，截断后=' + (step.value / 1000).toFixed(3);
    }).join('\n');
  }

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
    var attackerDamageDone = phase === "fire"
      ? (attacker.damageDoneFire || attacker.damageDone || 0)
      : (attacker.damageDoneShock || attacker.damageDone || 0);
    var defenderDamageDone = phase === "fire"
      ? (defender.damageDoneFire || defender.damageDone || 0)
      : (defender.damageDoneShock || defender.damageDone || 0);

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
      "进攻方科技基础士气=" + attBaseMorale.toFixed(1) + "  额外士气加成=" + attacker.moraleBonus.toFixed(1) + "%  陆军传统=" + attacker.armyTradition + "  威望=" + attacker.prestige + "  力量投射=" + (attacker.powerProjection || 0) + "  最终最大士气=" + attFinalMorale.toFixed(2),
      "防守方科技基础士气=" + defBaseMorale.toFixed(1) + "  额外士气加成=" + defender.moraleBonus.toFixed(1) + "%  陆军传统=" + defender.armyTradition + "  威望=" + defender.prestige + "  力量投射=" + (defender.powerProjection || 0) + "  最终最大士气=" + defFinalMorale.toFixed(2),
      "",
      "--- 兵员伤害明细 ---",
      "各乘除步骤截断至千分位；兵损换算后再乘每天 +1% 的时长加成。单次计算按第 1 天。",
      "进攻方 -> 防守方",
      "兵种组：" + translateGroup(attacker.group) + "；兵种：" + translateUnit(attacker.unitName),
      "等效基础伤亡 = " + attackerToDefender.baseCasualties.toFixed(2) + "（内部基础值与最后的 0.2 换算不能提前合并）",
      attackerPenaltyInfo.ignoredByManeuver
        ? ("跨河惩罚=" + riverCrossing.toFixed(2) + "，但攻方机动高于守方，因此本次按 0 计算；总惩罚=" + attackerPenalty.toFixed(2))
        : ("进攻地形惩罚=" + terrainPenalty.toFixed(2) + "，跨河惩罚=" + attackerPenaltyInfo.riverPenaltyApplied.toFixed(2) + "；总惩罚=" + attackerPenalty.toFixed(2)),
      "科技修正 = " + attackerToDefender.tech.toFixed(2) + "，守方战术 = " + attackerToDefender.tactics.toFixed(2) + "；攻击方有效造成伤害修正 = " + attackerToDefender.effectiveDamageDone.toFixed(1) + "%（原始 " + attackerDamageDone.toFixed(1) + "% + 伤害加成 " + attackerToDefender.damageBonus.toFixed(1) + "%）",
      strengthSteps(attackerToDefender),
      "",
      "防守方 -> 进攻方",
      "兵种组：" + translateGroup(defender.group) + "；兵种：" + translateUnit(defender.unitName),
      "等效基础伤亡 = " + defenderToAttacker.baseCasualties.toFixed(2) + "（内部基础值与最后的 0.2 换算不能提前合并）",
      "科技修正 = " + defenderToAttacker.tech.toFixed(2) + "，守方战术 = " + defenderToAttacker.tactics.toFixed(2) + "；防守方有效造成伤害修正 = " + defenderToAttacker.effectiveDamageDone.toFixed(1) + "%（原始 " + defenderDamageDone.toFixed(1) + "% + 伤害加成 " + defenderToAttacker.damageBonus.toFixed(1) + "%）",
      strengthSteps(defenderToAttacker),
      "",
      "--- 士气损失明细 ---",
      "最大士气 = 科技基础士气 x (1 + 额外士气加成 + 陆军传统加成 + 威望加成 + 力量投射加成)",
      "士气损失 = 逐步截断至千分位的交战伤害 + 每团截断至千分位后相加的被动损耗；截断余数不参与后续计算。",
      "被动损耗 = 敌方平均最大士气 x 1%，每团每天一次；不乘兵力或天数加成。",
      "进攻方 -> 防守方：士气等效基础伤亡=" + attToDefMorale.baseCasualties.toFixed(2) + "  己方士气=" + attFinalMorale.toFixed(3) + "  交战伤害=" + attToDefMorale.combatMoraleDamage + "  被动损耗=" + attToDefMorale.passiveMoraleDamage + "  不截断的对照值=" + attToDefMorale.rawMoraleDamage + "  -> 实际扣除=" + attToDefMorale.moraleDamage,
      moraleSteps(attToDefMorale),
      "防守方 -> 进攻方：士气等效基础伤亡=" + defToAttMorale.baseCasualties.toFixed(2) + "  己方士气=" + defFinalMorale.toFixed(3) + "  交战伤害=" + defToAttMorale.combatMoraleDamage + "  被动损耗=" + defToAttMorale.passiveMoraleDamage + "  不截断的对照值=" + defToAttMorale.rawMoraleDamage + "  -> 实际扣除=" + defToAttMorale.moraleDamage,
      moraleSteps(defToAttMorale)
    ].join("\n");
  }

  M['single/view'] = { renderSingleResults: renderSingleResults };
})(window._M = window._M || {});
