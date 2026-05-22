(function(M) {
  var uiHelpers = M['shared/ui-helpers'];
  var translateGroup = uiHelpers.translateGroup;
  var translateUnit = uiHelpers.translateUnit;
  var translateUnitType = uiHelpers.translateUnitType;

  var rankingLogic = M['ranking/logic'];
  var runUnitTournament = rankingLogic.runUnitTournament;

  var stateModule = M['shared/state'];
  var readSide = stateModule.readSide;

  function formatTournamentCandidate(candidate) {
    return translateGroup(candidate.group) + " / " + translateUnitType(candidate.unitType) + " / " + translateUnit(candidate.unitName);
  }

  function formatDiceModeLabel(battleOptions) {
    if (battleOptions.diceMode === "fixed") {
      return "固定骰子 " + battleOptions.diceConfig.value;
    }
    if (battleOptions.diceMode === "manual") {
      return "手动序列循环";
    }
    return "全部随机";
  }

  function buildRankingLogText(result, template, battleOptions) {
    var lines = [];
    lines.push("=== 全兵种排行日志 ===");
    lines.push("模板来源：当前模板");
    lines.push(
      "科技=" + template.techLevel +
      "  兵力=" + template.strength +
      "  训练度=" + template.discipline +
      "%  额外战术=" + template.extraMilitaryTactics.toFixed(2)
    );
    lines.push(
      "步兵作战=" + template.combatAbilityInfantry +
      "%  骑兵作战=" + template.combatAbilityCavalry +
      "%  炮兵作战=" + template.combatAbilityArtillery + "%"
    );
    lines.push(
      "步兵火力=" + template.fireDamageInfantry +
      "  骑兵火力=" + template.fireDamageCavalry +
      "  炮兵火力=" + template.fireDamageArtillery +
      "  步/骑/炮冲击=" + template.shockDamageInfantry + "/" + template.shockDamageCavalry + "/" + template.shockDamageArtillery
    );
    lines.push(
      "造成火力伤害=" + template.damageDoneFire +
      "%  造成冲击伤害=" + template.damageDoneShock +
      "%  火力防御=" + template.damageTakenFire +
      "%  冲击防御=" + template.damageTakenShock +
      "%  额外士气=" + template.moraleBonus +
      "%  陆军传统=" + template.armyTradition +
      "  威望=" + template.prestige +
      "  力量投射=" + template.powerProjection +
      "  职业度伤害加成（并入造成伤害修正）=+" + (template.damageBonus || 0).toFixed(1) + "%" +
      "  造成士气伤害=" + template.moraleDamageDone +
      "%  士气防御=" + template.moraleDamageTaken +
      "%  职业度=" + template.professionalism
    );
    lines.push(
      "阶段模式=" + (battleOptions.phaseOnly === null ? "火力+冲击交替" : (battleOptions.phaseOnly === "fire" ? "仅火力" : "仅冲击")) +
      "  骰子模式=" + formatDiceModeLabel(battleOptions) +
      "  进攻地形惩罚=" + battleOptions.terrainPenalty
    );
    lines.push("候选兵种数：" + result.candidates.length + "  配对组合数：" + result.totalPairs + "  实际对战场次：" + result.totalMatches);
    lines.push("");
    lines.push("--- 排行 ---");
    for (var i = 0; i < result.rankings.length; i++) {
      var entry = result.rankings[i];
      lines.push(
        (i + 1) + ". " + formatTournamentCandidate(entry.candidate) +
        "  积分=" + entry.points +
        "  胜/平/负=" + entry.wins + "/" + entry.draws + "/" + entry.losses +
        "  兵损(造/承)=" + entry.totalStrengthInflicted.toFixed(2) + "/" + entry.totalStrengthTaken.toFixed(2) +
        "  士气(造/承)=" + entry.totalMoraleInflicted.toFixed(2) + "/" + entry.totalMoraleTaken.toFixed(2)
      );
    }
    lines.push("");
    lines.push("--- 配对日志 ---");
    for (i = 0; i < result.matchLogs.length; i++) {
      var log = result.matchLogs[i];
      var matchResult = log.result;
      var winnerLabel = matchResult.winner === "attacker" ? formatTournamentCandidate(log.attacker) :
        (matchResult.winner === "defender" ? formatTournamentCandidate(log.defender) : "平局");
      lines.push(
        "[" + log.id + "] 配对#" + log.pairId + " 第" + log.leg + "场  " +
        formatTournamentCandidate(log.attacker) + " 攻  vs  " +
        formatTournamentCandidate(log.defender) + " 守"
      );
      lines.push(
        "    结果：" + winnerLabel + "  " + matchResult.winReason +
        "  结束方式=" + matchResult.endedBy +
        "  总天数=" + matchResult.totalDays
      );
      lines.push(
        "    攻方兵损=" + matchResult.totalAttackerStrengthLoss.toFixed(2) +
        "  守方兵损=" + matchResult.totalDefenderStrengthLoss.toFixed(2) +
        "  攻方士气损=" + matchResult.totalAttackerMoraleLoss.toFixed(2) +
        "  守方士气损=" + matchResult.totalDefenderMoraleLoss.toFixed(2)
      );
      lines.push(
        "    攻方剩余兵力/士气=" + matchResult.finalAttackerStrength.toFixed(2) + "/" + matchResult.finalAttackerMorale.toFixed(2) +
        "  守方剩余兵力/士气=" + matchResult.finalDefenderStrength.toFixed(2) + "/" + matchResult.finalDefenderMorale.toFixed(2)
      );
    }
    return lines.join("\n");
  }


  function renderRankingResults(result, battleOptions, dom) {
    var topEntry = result.rankings[0];
    dom.rankingSummary.innerHTML =
      '<div class="sim-summary-item">' +
        '<span class="label">模板来源</span>' +
        '<span class="value">当前模板</span>' +
      '</div>' +
      '<div class="sim-summary-item">' +
        '<span class="label">候选兵种数</span>' +
        '<span class="value">' + result.candidates.length + '</span>' +
      '</div>' +
      '<div class="sim-summary-item">' +
        '<span class="label">配对组合数</span>' +
        '<span class="value">' + result.totalPairs + '</span>' +
      '</div>' +
      '<div class="sim-summary-item">' +
        '<span class="label">总对战场次</span>' +
        '<span class="value">' + result.totalMatches + '</span>' +
      '</div>' +
      '<div class="sim-summary-item">' +
        '<span class="label">阶段模式</span>' +
        '<span class="value">' + (battleOptions.phaseOnly === null ? "火力+冲击交替" : (battleOptions.phaseOnly === "fire" ? "仅火力" : "仅冲击")) + '</span>' +
      '</div>' +
      '<div class="sim-summary-item">' +
        '<span class="label">骰子模式</span>' +
        '<span class="value">' + formatDiceModeLabel(battleOptions) + '</span>' +
      '</div>' +
      '<div class="sim-summary-item">' +
        '<span class="label">排名第一</span>' +
        '<span class="value win">' + formatTournamentCandidate(topEntry.candidate) + '</span>' +
      '</div>';

    var rows = "";
    for (var i = 0; i < result.rankings.length; i++) {
      var entry = result.rankings[i];
      rows +=
        '<tr>' +
          '<td>' + (i + 1) + '</td>' +
          '<td class="text-left">' + translateUnitType(entry.candidate.unitType) + '</td>' +
          '<td class="text-left">' + translateGroup(entry.candidate.group) + '</td>' +
          '<td class="text-left">' + translateUnit(entry.candidate.unitName) + '</td>' +
          '<td>' + entry.points + '</td>' +
          '<td>' + entry.wins + '</td>' +
          '<td>' + entry.draws + '</td>' +
          '<td>' + entry.losses + '</td>' +
          '<td>' + entry.totalStrengthInflicted.toFixed(2) + '</td>' +
          '<td>' + entry.totalStrengthTaken.toFixed(2) + '</td>' +
          '<td>' + entry.totalMoraleInflicted.toFixed(2) + '</td>' +
          '<td>' + entry.totalMoraleTaken.toFixed(2) + '</td>' +
        '</tr>';
    }
    dom.rankingTbody.innerHTML = rows;
  }

  function renderRankingLogPreview(logText, dom) {
    var lines = logText.split("\n");
    var previewLimit = 120;
    if (lines.length <= previewLimit) {
      dom.rankingLogOutput.textContent = logText;
    } else {
      dom.rankingLogOutput.textContent = lines.slice(0, previewLimit).join("\n") + "\n\n... 已截断，其余 " + (lines.length - previewLimit) + " 行请下载完整日志查看。";
    }
    dom.rankingLogSection.style.display = "";
  }

  function downloadRankingLog(state) {
    if (!state.latestRankingLogText) return;
    var stamp = new Date().toISOString().replace(/[:.]/g, "-");
    var link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([state.latestRankingLogText], { type: "text/plain;charset=utf-8" }));
    link.download = "calc_mil_ranking_log_" + stamp + ".txt";
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(function() {
      URL.revokeObjectURL(link.href);
    }, 0);
  }

  function calculateRanking(dom, state) {
    var template = readSide("template");
    if (!Number.isInteger(template.techLevel) || template.techLevel < 0 || template.techLevel > 32) {
      throw new Error("排行基准军事科技应为 0 到 32 的整数。");
    }

    var battleOptions = {
      terrainPenalty: 0,
      phaseOnly: null,
      diceConfig: { mode: "fixed", value: 5 },
      diceMode: "fixed"
    };

    var result = runUnitTournament(template, battleOptions);
    renderRankingResults(result, battleOptions, dom);

    state.latestRankingLogText = buildRankingLogText(result, template, battleOptions);
    renderRankingLogPreview(state.latestRankingLogText, dom);
    dom.downloadRankingLogButton.disabled = false;
  }

  M['ranking/view'] = {
    formatTournamentCandidate: formatTournamentCandidate,
    formatDiceModeLabel: formatDiceModeLabel,
    buildRankingLogText: buildRankingLogText,
    renderRankingResults: renderRankingResults,
    renderRankingLogPreview: renderRankingLogPreview,
    downloadRankingLog: downloadRankingLog,
    calculateRanking: calculateRanking
  };
})(window._M = window._M || {});
