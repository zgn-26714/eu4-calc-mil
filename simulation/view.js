(function(M) {
  var formatRemainingMorale = M['shared/ui-helpers'].formatRemainingMorale;
  function renderMoraleValues(value, strength, regimentCount) {
    var actual = (Math.max(0, M['shared/calc-engine'].toFixedPoint(value)) / 1000).toFixed(3);
    var displayed = regimentCount === 1
      ? formatRemainingMorale(value, strength, regimentCount) : '暂不支持多团';
    return '<span class="morale-values">' +
      '<span class="morale-display">游戏显示：' + displayed + '</span>' +
      '<span class="morale-actual">内部实际：' + actual + '</span></span>';
  }
  function renderSimResults(dom, result, attacker, defender) {
    // Summary cards
    var winnerClass = result.winner === "attacker" ? "win" : (result.winner === "defender" ? "lose" : "draw");
    var attClass = result.winner === "attacker" ? "win" : (result.winner === "defender" ? "lose" : "draw");
    var defClass = result.winner === "defender" ? "win" : (result.winner === "attacker" ? "lose" : "draw");

    var winnerLabel = result.winner === "attacker" ? "进攻方" : (result.winner === "defender" ? "防守方" : "平局");
    if (result.winReason) {
      winnerLabel += "（" + result.winReason + "）";
    }
    var attBreakLabel = result.attackerMoraleBreakDay === null ? "未溃败" : ("第" + result.attackerMoraleBreakDay + "天");
    var defBreakLabel = result.defenderMoraleBreakDay === null ? "未溃败" : ("第" + result.defenderMoraleBreakDay + "天");

    var attMoralePct = result.initialAttackerMorale > 0 ? (result.finalAttackerMorale / result.initialAttackerMorale * 100).toFixed(0) : 0;
    var defMoralePct = result.initialDefenderMorale > 0 ? (result.finalDefenderMorale / result.initialDefenderMorale * 100).toFixed(0) : 0;

    dom.simSummary.innerHTML =
      '<div class="sim-summary-item">' +
        '<span class="label">获胜方</span>' +
        '<span class="value ' + winnerClass + '">' + winnerLabel + '</span>' +
      '</div>' +
      '<div class="sim-summary-item">' +
        '<span class="label">总天数</span>' +
        '<span class="value">' + result.totalDays + '</span>' +
      '</div>' +
      '<div class="sim-summary-item">' +
        '<span class="label">攻方初始兵力</span>' +
        '<span class="value">' + result.initialAttackerStrength + '</span>' +
      '</div>' +
      '<div class="sim-summary-item">' +
        '<span class="label">攻方剩余兵力</span>' +
        '<span class="value ' + attClass + '">' + result.finalAttackerStrength.toFixed(2) + '</span>' +
      '</div>' +
      '<div class="sim-summary-item">' +
        '<span class="label">攻方初始士气</span>' +
        '<span class="value">' + result.initialAttackerMorale.toFixed(2) + '</span>' +
      '</div>' +
      '<div class="sim-summary-item">' +
        '<span class="label">攻方剩余士气</span>' +
        '<span class="value ' + attClass + '">' + renderMoraleValues(result.finalAttackerMorale, result.finalAttackerStrength, result.attRegiments) + '（' + attMoralePct + '%）</span>' +
      '</div>' +
      '<div class="sim-summary-item">' +
        '<span class="label">攻方溃败日</span>' +
        '<span class="value ' + attClass + '">' + attBreakLabel + '</span>' +
      '</div>' +
      '<div class="sim-summary-item">' +
        '<span class="label">守方初始兵力</span>' +
        '<span class="value">' + result.initialDefenderStrength + '</span>' +
      '</div>' +
      '<div class="sim-summary-item">' +
        '<span class="label">守方剩余兵力</span>' +
        '<span class="value ' + defClass + '">' + result.finalDefenderStrength.toFixed(2) + '</span>' +
      '</div>' +
      '<div class="sim-summary-item">' +
        '<span class="label">守方初始士气</span>' +
        '<span class="value">' + result.initialDefenderMorale.toFixed(2) + '</span>' +
      '</div>' +
      '<div class="sim-summary-item">' +
        '<span class="label">守方剩余士气</span>' +
        '<span class="value ' + defClass + '">' + renderMoraleValues(result.finalDefenderMorale, result.finalDefenderStrength, result.defRegiments) + '（' + defMoralePct + '%）</span>' +
      '</div>' +
      '<div class="sim-summary-item">' +
        '<span class="label">守方溃败日</span>' +
        '<span class="value ' + defClass + '">' + defBreakLabel + '</span>' +
      '</div>';

    // Table rows
    var rows = "";
    var attStrRemaining = result.initialAttackerStrength;
    var defStrRemaining = result.initialDefenderStrength;
    var attMorRemaining = result.initialAttackerMorale;
    var defMorRemaining = result.initialDefenderMorale;

    for (var r = 0; r < result.rounds.length; r++) {
      var rr = result.rounds[r];
      var fireDice = rr.fire ? (rr.fire.attackerDice + "/" + rr.fire.defenderDice) : "-";
      var shockDice = rr.shock ? (rr.shock.attackerDice + "/" + rr.shock.defenderDice) : "-";

      // Strength losses
      var fireAttStrLoss = rr.fire ? rr.fire.attackerStrengthLoss : 0;
      var fireDefStrLoss = rr.fire ? rr.fire.defenderStrengthLoss : 0;
      var shockAttStrLoss = rr.shock ? rr.shock.attackerStrengthLoss : 0;
      var shockDefStrLoss = rr.shock ? rr.shock.defenderStrengthLoss : 0;
      var roundAttStrLoss = fireAttStrLoss + shockAttStrLoss;
      var roundDefStrLoss = fireDefStrLoss + shockDefStrLoss;

      // Morale losses
      var fireAttMorLoss = rr.fire ? rr.fire.attackerMoraleLoss : 0;
      var fireDefMorLoss = rr.fire ? rr.fire.defenderMoraleLoss : 0;
      var shockAttMorLoss = rr.shock ? rr.shock.attackerMoraleLoss : 0;
      var shockDefMorLoss = rr.shock ? rr.shock.defenderMoraleLoss : 0;
      var roundAttMorLoss = fireAttMorLoss + shockAttMorLoss;
      var roundDefMorLoss = fireDefMorLoss + shockDefMorLoss;

      // Broken regiments (from last day of the round)
      var lastDay = null;
      if (rr.shock && rr.shock.days && rr.shock.days.length > 0) {
        lastDay = rr.shock.days[rr.shock.days.length - 1];
      } else if (rr.fire && rr.fire.days && rr.fire.days.length > 0) {
        lastDay = rr.fire.days[rr.fire.days.length - 1];
      }
      var attBroken = lastDay ? lastDay.attackerBrokenRegiments : 0;
      var defBroken = lastDay ? lastDay.defenderBrokenRegiments : 0;

      attStrRemaining -= roundAttStrLoss;
      defStrRemaining -= roundDefStrLoss;
      attMorRemaining = lastDay ? lastDay.attackerCurrentMorale : attMorRemaining - roundAttMorLoss;
      defMorRemaining = lastDay ? lastDay.defenderCurrentMorale : defMorRemaining - roundDefMorLoss;

      rows +=
        '<tr>' +
          '<td>' + rr.round + '</td>' +
          '<td>' + fireDice + '</td>' +
          '<td>' + shockDice + '</td>' +
          '<td>' + fireAttStrLoss.toFixed(2) + '</td>' +
          '<td>' + fireDefStrLoss.toFixed(2) + '</td>' +
          '<td>' + shockAttStrLoss.toFixed(2) + '</td>' +
          '<td>' + shockDefStrLoss.toFixed(2) + '</td>' +
          '<td>' + roundAttStrLoss.toFixed(2) + '</td>' +
          '<td>' + roundDefStrLoss.toFixed(2) + '</td>' +
          '<td>' + roundAttMorLoss.toFixed(2) + '</td>' +
          '<td>' + roundDefMorLoss.toFixed(2) + '</td>' +
          '<td>' + Math.max(0, attStrRemaining).toFixed(2) + '</td>' +
          '<td>' + Math.max(0, defStrRemaining).toFixed(2) + '</td>' +
          '<td>' + renderMoraleValues(attMorRemaining, attStrRemaining, result.attRegiments) + '</td>' +
          '<td>' + renderMoraleValues(defMorRemaining, defStrRemaining, result.defRegiments) + '</td>' +
          '<td>' + attBroken + '/' + result.attRegiments + '</td>' +
          '<td>' + defBroken + '/' + result.defRegiments + '</td>' +
        '</tr>';
    }

    // Total row
    rows +=
      '<tr class="total-row">' +
        '<td>总计</td>' +
        '<td>-</td>' +
        '<td>-</td>' +
        '<td>' + result.rounds.reduce(function(s, rr) { return s + (rr.fire ? rr.fire.attackerStrengthLoss : 0); }, 0).toFixed(2) + '</td>' +
        '<td>' + result.rounds.reduce(function(s, rr) { return s + (rr.fire ? rr.fire.defenderStrengthLoss : 0); }, 0).toFixed(2) + '</td>' +
        '<td>' + result.rounds.reduce(function(s, rr) { return s + (rr.shock ? rr.shock.attackerStrengthLoss : 0); }, 0).toFixed(2) + '</td>' +
        '<td>' + result.rounds.reduce(function(s, rr) { return s + (rr.shock ? rr.shock.defenderStrengthLoss : 0); }, 0).toFixed(2) + '</td>' +
        '<td>' + result.totalAttackerStrengthLoss.toFixed(2) + '</td>' +
        '<td>' + result.totalDefenderStrengthLoss.toFixed(2) + '</td>' +
        '<td>' + result.totalAttackerMoraleLoss.toFixed(2) + '</td>' +
        '<td>' + result.totalDefenderMoraleLoss.toFixed(2) + '</td>' +
        '<td>' + result.finalAttackerStrength.toFixed(2) + '</td>' +
        '<td>' + result.finalDefenderStrength.toFixed(2) + '</td>' +
        '<td>' + renderMoraleValues(result.finalAttackerMorale, result.finalAttackerStrength, result.attRegiments) + '</td>' +
        '<td>' + renderMoraleValues(result.finalDefenderMorale, result.finalDefenderStrength, result.defRegiments) + '</td>' +
        '<td>-</td>' +
        '<td>-</td>' +
      '</tr>';

    dom.simTbody.innerHTML = rows;

    renderDailyLog(dom, result);
  }


  function renderDailyLog(dom, result) {
    var tbody = document.querySelector("#daily-log-tbody");
    var rows = "";
    var phaseLabel = { fire: "火力", shock: "冲击" };

    for (var r = 0; r < result.rounds.length; r++) {
      var rr = result.rounds[r];
      if (rr.fire) {
        for (var di = 0; di < rr.fire.days.length; di++) {
          var day = rr.fire.days[di];
          rows +=
            '<tr>' +
              '<td>' + day.day + '</td>' +
              '<td>' + phaseLabel.fire + '</td>' +
              '<td>' + rr.fire.attackerDice + '/' + rr.fire.defenderDice + '</td>' +
              '<td>' + day.attackerStrengthDmg.toFixed(2) + '</td>' +
              '<td>' + day.defenderStrengthDmg.toFixed(2) + '</td>' +
              '<td>' + day.attackerStrengthLoss.toFixed(2) + '</td>' +
              '<td>' + day.defenderStrengthLoss.toFixed(2) + '</td>' +
              '<td>' + Math.max(0, day.attackerStrengthRemaining).toFixed(2) + '</td>' +
              '<td>' + Math.max(0, day.defenderStrengthRemaining).toFixed(2) + '</td>' +
              '<td>' + day.attackerMoraleLoss + '</td>' +
              '<td>' + day.defenderMoraleLoss + '</td>' +
              '<td>' + renderMoraleValues(day.attackerCurrentMorale, day.attackerStrengthRemaining, result.attRegiments) + '</td>' +
              '<td>' + renderMoraleValues(day.defenderCurrentMorale, day.defenderStrengthRemaining, result.defRegiments) + '</td>' +
              '<td>' + day.attackerBrokenRegiments + '/' + result.attRegiments + '</td>' +
              '<td>' + day.defenderBrokenRegiments + '/' + result.defRegiments + '</td>' +
            '</tr>';
        }
      }
      if (rr.shock) {
        for (di = 0; di < rr.shock.days.length; di++) {
          var day2 = rr.shock.days[di];
          rows +=
            '<tr>' +
              '<td>' + day2.day + '</td>' +
              '<td>' + phaseLabel.shock + '</td>' +
              '<td>' + rr.shock.attackerDice + '/' + rr.shock.defenderDice + '</td>' +
              '<td>' + day2.attackerStrengthDmg.toFixed(2) + '</td>' +
              '<td>' + day2.defenderStrengthDmg.toFixed(2) + '</td>' +
              '<td>' + day2.attackerStrengthLoss.toFixed(2) + '</td>' +
              '<td>' + day2.defenderStrengthLoss.toFixed(2) + '</td>' +
              '<td>' + Math.max(0, day2.attackerStrengthRemaining).toFixed(2) + '</td>' +
              '<td>' + Math.max(0, day2.defenderStrengthRemaining).toFixed(2) + '</td>' +
              '<td>' + day2.attackerMoraleLoss + '</td>' +
              '<td>' + day2.defenderMoraleLoss + '</td>' +
              '<td>' + renderMoraleValues(day2.attackerCurrentMorale, day2.attackerStrengthRemaining, result.attRegiments) + '</td>' +
              '<td>' + renderMoraleValues(day2.defenderCurrentMorale, day2.defenderStrengthRemaining, result.defRegiments) + '</td>' +
              '<td>' + day2.attackerBrokenRegiments + '/' + result.attRegiments + '</td>' +
              '<td>' + day2.defenderBrokenRegiments + '/' + result.defRegiments + '</td>' +
            '</tr>';
        }
      }
    }

    tbody.innerHTML = rows;
  }


  function renderSimDetailText(dom, result, battleOptions, attackerPenaltyInfo, attacker, defender) {
    // Build detailed breakdown
    var lines = [];
    lines.push("=== 多轮模拟结果（含士气） ===");
    lines.push("总天数：" + result.totalDays + "  轮数：" + result.rounds.length);
    lines.push("说明：当前模型按每个兵种初始 1000 兵且固定前排计算。");
    lines.push("兵员伤害：各乘除步骤按千分位截断，兵损换算后乘每天 +1% 的战斗天数加成。");
    lines.push("士气伤害：先将最大士气除以2.7，再按独立士气点数逐步计算；各步骤按千分位截断，交战伤害乘每天 +1% 的加成。");
    if (attackerPenaltyInfo.ignoredByManeuver) {
      lines.push("跨河惩罚=" + battleOptions.riverCrossing + "，但攻方机动高于守方，因此本次模拟未计入跨河惩罚。");
    } else {
      lines.push("进攻地形惩罚=" + battleOptions.terrainPenalty + "  跨河惩罚=" + attackerPenaltyInfo.riverPenaltyApplied + "  总惩罚=" + attackerPenaltyInfo.totalPenalty);
    }
    lines.push("");
    lines.push("--- 兵员 ---");
    lines.push("进攻方初始兵力：" + result.initialAttackerStrength + "  →  剩余：" + result.finalAttackerStrength.toFixed(2) + "  （损失 " + result.totalAttackerStrengthLoss.toFixed(2) + "）");
    lines.push("防守方初始兵力：" + result.initialDefenderStrength + "  →  剩余：" + result.finalDefenderStrength.toFixed(2) + "  （损失 " + result.totalDefenderStrengthLoss.toFixed(2) + "）");
    lines.push("");
    lines.push("--- 士气 ---");
    lines.push("进攻方：陆军传统=" + (attacker.armyTradition || 0) + "  威望=" + (attacker.prestige || 0) + "  力量投射=" + (attacker.powerProjection || 0) + "  职业度=" + (attacker.professionalism || 0));
    lines.push("防守方：陆军传统=" + (defender.armyTradition || 0) + "  威望=" + (defender.prestige || 0) + "  力量投射=" + (defender.powerProjection || 0) + "  职业度=" + (defender.professionalism || 0));
    lines.push("职业度衍生伤害加成（已并入造成伤害修正）：进攻方 +" + ((attacker.damageBonus || 0).toFixed(1)) + "%  防守方 +" + ((defender.damageBonus || 0).toFixed(1)) + "%");
    lines.push("进攻方团数：" + result.attRegiments + "  每团最大士气：" + result.attMaxMoralePerRegiment.toFixed(2) + "  初始总士气：" + result.initialAttackerMorale.toFixed(2) + "  →  剩余：" + formatRemainingMorale(result.finalAttackerMorale, result.finalAttackerStrength, result.attRegiments) + "  （损失 " + result.totalAttackerMoraleLoss.toFixed(2) + "）");
    lines.push("防守方团数：" + result.defRegiments + "  每团最大士气：" + result.defMaxMoralePerRegiment.toFixed(2) + "  初始总士气：" + result.initialDefenderMorale.toFixed(2) + "  →  剩余：" + formatRemainingMorale(result.finalDefenderMorale, result.finalDefenderStrength, result.defRegiments) + "  （损失 " + result.totalDefenderMoraleLoss.toFixed(2) + "）");
    if (result.attackerMoraleBreakDay !== null) {
      lines.push("进攻方士气溃败日：第" + result.attackerMoraleBreakDay + "天");
    }
    if (result.defenderMoraleBreakDay !== null) {
      lines.push("防守方士气溃败日：第" + result.defenderMoraleBreakDay + "天");
    }

    var winnerText = result.winner === "attacker" ? "进攻方" : (result.winner === "defender" ? "防守方" : "平局");
    if (result.winReason) {
      winnerText += "（" + result.winReason + "）";
    }
    lines.push("");
    lines.push("获胜方：" + winnerText);

    lines.push("");
    lines.push("--- 每日明细 ---");
    lines.push("士气损失与剩余士气按千分位定点数计算，截断余数丢弃；单团剩余士气按游戏战斗提示框的两次兵力加权汇总后截断显示2位，汇总值不参与递推。未截断对照值仅供查看，不参与递推。");
    for (var r = 0; r < result.rounds.length; r++) {
      var rr = result.rounds[r];
      lines.push("第" + rr.round + "轮：");
      if (rr.fire) {
        lines.push("  火力阶段（攻方骰子=" + rr.fire.attackerDice + " 守方骰子=" + rr.fire.defenderDice + "）：攻方兵损=" + rr.fire.attackerStrengthLoss.toFixed(2) + " 守方兵损=" + rr.fire.defenderStrengthLoss.toFixed(2) + " 攻方士气损=" + rr.fire.attackerMoraleLoss.toFixed(2) + " 守方士气损=" + rr.fire.defenderMoraleLoss.toFixed(2));
        for (var di = 0; di < rr.fire.days.length; di++) {
          var day = rr.fire.days[di];
          lines.push("    第" + day.day + "天  攻方兵伤=" + day.attackerStrengthDmg.toFixed(2) + " 守方兵伤=" + day.defenderStrengthDmg.toFixed(2) + "  攻方剩=" + day.attackerStrengthRemaining.toFixed(2) + " 守方剩=" + day.defenderStrengthRemaining.toFixed(2) + "  攻方士气=" + formatRemainingMorale(day.attackerCurrentMorale, day.attackerStrengthRemaining, result.attRegiments) + " 守方士气=" + formatRemainingMorale(day.defenderCurrentMorale, day.defenderStrengthRemaining, result.defRegiments) + "  攻溃败=" + day.attackerBrokenRegiments + " 守溃败=" + day.defenderBrokenRegiments);
          lines.push("      剩余士气内部原值：攻方=" + day.attackerCurrentMorale + "  守方=" + day.defenderCurrentMorale);
          lines.push("      攻方士气损失：未截断=" + day.defenderRawMoraleDmg + "  实际扣除=" + day.attackerMoraleLoss + "；守方士气损失：未截断=" + day.attackerRawMoraleDmg + "  实际扣除=" + day.defenderMoraleLoss);
        }
      }
      if (rr.shock) {
        lines.push("  冲击阶段（攻方骰子=" + rr.shock.attackerDice + " 守方骰子=" + rr.shock.defenderDice + "）：攻方兵损=" + rr.shock.attackerStrengthLoss.toFixed(2) + " 守方兵损=" + rr.shock.defenderStrengthLoss.toFixed(2) + " 攻方士气损=" + rr.shock.attackerMoraleLoss.toFixed(2) + " 守方士气损=" + rr.shock.defenderMoraleLoss.toFixed(2));
        for (di = 0; di < rr.shock.days.length; di++) {
          var day2 = rr.shock.days[di];
          lines.push("    第" + day2.day + "天  攻方兵伤=" + day2.attackerStrengthDmg.toFixed(2) + " 守方兵伤=" + day2.defenderStrengthDmg.toFixed(2) + "  攻方剩=" + day2.attackerStrengthRemaining.toFixed(2) + " 守方剩=" + day2.defenderStrengthRemaining.toFixed(2) + "  攻方士气=" + formatRemainingMorale(day2.attackerCurrentMorale, day2.attackerStrengthRemaining, result.attRegiments) + " 守方士气=" + formatRemainingMorale(day2.defenderCurrentMorale, day2.defenderStrengthRemaining, result.defRegiments) + "  攻溃败=" + day2.attackerBrokenRegiments + " 守溃败=" + day2.defenderBrokenRegiments);
          lines.push("      剩余士气内部原值：攻方=" + day2.attackerCurrentMorale + "  守方=" + day2.defenderCurrentMorale);
          lines.push("      攻方士气损失：未截断=" + day2.defenderRawMoraleDmg + "  实际扣除=" + day2.attackerMoraleLoss + "；守方士气损失：未截断=" + day2.attackerRawMoraleDmg + "  实际扣除=" + day2.defenderMoraleLoss);
        }
      }
    }

    dom.detailsOutput.textContent = lines.join("\n");
  }

  M['simulation/view'] = {
    renderSimResults: renderSimResults,
    renderDailyLog: renderDailyLog,
    renderSimDetailText: renderSimDetailText
  };
})(window._M = window._M || {});
