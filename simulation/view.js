(function(M) {
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
        '<span class="value ' + attClass + '">' + result.finalAttackerMorale.toFixed(2) + '（' + attMoralePct + '%）</span>' +
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
        '<span class="value ' + defClass + '">' + result.finalDefenderMorale.toFixed(2) + '（' + defMoralePct + '%）</span>' +
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
      attMorRemaining -= roundAttMorLoss;
      defMorRemaining -= roundDefMorLoss;

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
          '<td>' + Math.max(0, attMorRemaining).toFixed(2) + '</td>' +
          '<td>' + Math.max(0, defMorRemaining).toFixed(2) + '</td>' +
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
        '<td>' + result.finalAttackerMorale.toFixed(2) + '</td>' +
        '<td>' + result.finalDefenderMorale.toFixed(2) + '</td>' +
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
              '<td>' + day.attackerMoraleLoss.toFixed(2) + '</td>' +
              '<td>' + day.defenderMoraleLoss.toFixed(2) + '</td>' +
              '<td>' + day.attackerPassiveMoraleLoss.toFixed(2) + '</td>' +
              '<td>' + day.defenderPassiveMoraleLoss.toFixed(2) + '</td>' +
              '<td>' + Math.max(0, day.attackerCurrentMorale).toFixed(2) + '</td>' +
              '<td>' + Math.max(0, day.defenderCurrentMorale).toFixed(2) + '</td>' +
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
              '<td>' + day2.attackerMoraleLoss.toFixed(2) + '</td>' +
              '<td>' + day2.defenderMoraleLoss.toFixed(2) + '</td>' +
              '<td>' + day2.attackerPassiveMoraleLoss.toFixed(2) + '</td>' +
              '<td>' + day2.defenderPassiveMoraleLoss.toFixed(2) + '</td>' +
              '<td>' + Math.max(0, day2.attackerCurrentMorale).toFixed(2) + '</td>' +
              '<td>' + Math.max(0, day2.defenderCurrentMorale).toFixed(2) + '</td>' +
              '<td>' + day2.attackerBrokenRegiments + '/' + result.attRegiments + '</td>' +
              '<td>' + day2.defenderBrokenRegiments + '/' + result.defRegiments + '</td>' +
            '</tr>';
        }
      }
    }

    tbody.innerHTML = rows;
  }


  function renderSimDetailText(dom, result, battleOptions, attackerPenaltyInfo) {
    // Build detailed breakdown
    var lines = [];
    lines.push("=== 多轮模拟结果（含士气） ===");
    lines.push("总天数：" + result.totalDays + "  轮数：" + result.rounds.length);
    lines.push("说明：当前模型按每个兵种初始 1000 兵且固定前排计算。");
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
    lines.push("进攻方团数：" + result.attRegiments + "  每团最大士气：" + result.attMaxMoralePerRegiment.toFixed(2) + "  初始总士气：" + result.initialAttackerMorale.toFixed(2) + "  →  剩余：" + result.finalAttackerMorale.toFixed(2) + "  （损失 " + result.totalAttackerMoraleLoss.toFixed(2) + "）");
    lines.push("防守方团数：" + result.defRegiments + "  每团最大士气：" + result.defMaxMoralePerRegiment.toFixed(2) + "  初始总士气：" + result.initialDefenderMorale.toFixed(2) + "  →  剩余：" + result.finalDefenderMorale.toFixed(2) + "  （损失 " + result.totalDefenderMoraleLoss.toFixed(2) + "）");
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
    for (var r = 0; r < result.rounds.length; r++) {
      var rr = result.rounds[r];
      lines.push("第" + rr.round + "轮：");
      if (rr.fire) {
        lines.push("  火力阶段（攻方骰子=" + rr.fire.attackerDice + " 守方骰子=" + rr.fire.defenderDice + "）：攻方兵损=" + rr.fire.attackerStrengthLoss.toFixed(2) + " 守方兵损=" + rr.fire.defenderStrengthLoss.toFixed(2) + " 攻方士气损=" + rr.fire.attackerMoraleLoss.toFixed(2) + " 守方士气损=" + rr.fire.defenderMoraleLoss.toFixed(2));
        for (var di = 0; di < rr.fire.days.length; di++) {
          var day = rr.fire.days[di];
          lines.push("    第" + day.day + "天  攻方兵伤=" + day.attackerStrengthDmg.toFixed(2) + " 守方兵伤=" + day.defenderStrengthDmg.toFixed(2) + "  攻方剩=" + day.attackerStrengthRemaining.toFixed(2) + " 守方剩=" + day.defenderStrengthRemaining.toFixed(2) + "  攻方士气(主动=" + day.attackerMoraleLoss.toFixed(2) + "+被动=" + day.attackerPassiveMoraleLoss.toFixed(2) + ")=" + day.attackerCurrentMorale.toFixed(2) + " 守方士气(主动=" + day.defenderMoraleLoss.toFixed(2) + "+被动=" + day.defenderPassiveMoraleLoss.toFixed(2) + ")=" + day.defenderCurrentMorale.toFixed(2) + "  攻溃败=" + day.attackerBrokenRegiments + " 守溃败=" + day.defenderBrokenRegiments);
        }
      }
      if (rr.shock) {
        lines.push("  冲击阶段（攻方骰子=" + rr.shock.attackerDice + " 守方骰子=" + rr.shock.defenderDice + "）：攻方兵损=" + rr.shock.attackerStrengthLoss.toFixed(2) + " 守方兵损=" + rr.shock.defenderStrengthLoss.toFixed(2) + " 攻方士气损=" + rr.shock.attackerMoraleLoss.toFixed(2) + " 守方士气损=" + rr.shock.defenderMoraleLoss.toFixed(2));
        for (di = 0; di < rr.shock.days.length; di++) {
          var day2 = rr.shock.days[di];
          lines.push("    第" + day2.day + "天  攻方兵伤=" + day2.attackerStrengthDmg.toFixed(2) + " 守方兵伤=" + day2.defenderStrengthDmg.toFixed(2) + "  攻方剩=" + day2.attackerStrengthRemaining.toFixed(2) + " 守方剩=" + day2.defenderStrengthRemaining.toFixed(2) + "  攻方士气=" + day2.attackerCurrentMorale.toFixed(2) + " 守方士气=" + day2.defenderCurrentMorale.toFixed(2) + "  攻方后备士气损耗/天=" + day2.attackerPassiveMoraleLoss.toFixed(4) + " 守方后备士气损耗/天=" + day2.defenderPassiveMoraleLoss.toFixed(4) + "  攻溃败=" + day2.attackerBrokenRegiments + " 守溃败=" + day2.defenderBrokenRegiments);
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
