(function(M) {
var stateModule = M['shared/state'];
var sideState = stateModule.sideState;
var buildPanel = stateModule.buildPanel;
var initOptions = stateModule.initOptions;
var readSide = stateModule.readSide;
var sideSchemas = stateModule.sideSchemas;
var templateLayout = stateModule.templateLayout;

var uiHelpers = M['shared/ui-helpers'];
var maybeWarnStrengthLimit = uiHelpers.maybeWarnStrengthLimit;
var formatTemplateValue = uiHelpers.formatTemplateValue;

var dialogModule = M['shared/dialog'];
var initDialogDom = dialogModule.initDialogDom;
var openErrorDialog = dialogModule.openErrorDialog;
var closeErrorDialog = dialogModule.closeErrorDialog;
var closeChartLightbox = dialogModule.closeChartLightbox;

var calculateSingle = M['single/logic'].calculateSingle;
var renderSingleResults = M['single/view'].renderSingleResults;
var calculateSimulation = M['simulation/logic'].calculateSimulation;
var simView = M['simulation/view'];
var renderSimResults = simView.renderSimResults;
var renderSimDetailText = simView.renderSimDetailText;

var runUnitTournament = M['ranking/logic'].runUnitTournament;
var rankingView = M['ranking/view'];
var buildRankingLogText = rankingView.buildRankingLogText;
var renderRankingResults = rankingView.renderRankingResults;
var renderRankingLogPreview = rankingView.renderRankingLogPreview;
var downloadRankingLog = rankingView.downloadRankingLog;

var crossTechView = M['ranking/cross-tech-view'];
var calculateCrossTechRanking = crossTechView.calculateCrossTechRanking;
var renderCrossTechTable = crossTechView.renderCrossTechTable;
var downloadCrossTechCSV = crossTechView.downloadCrossTechCSV;

var crossTechFilter = M['ranking/cross-tech-filter'];
var initCrossTechFilter = crossTechFilter.initCrossTechFilter;

// ---- DOM refs ----
var phaseSelect = document.querySelector("#phase");
var calculateButton = document.querySelector("#calculate");
var backButton = document.querySelector("#back-button");
var detailsOutput = document.querySelector("#details-output");
var attackerLossEl = document.querySelector("#attacker-loss");
var defenderLossEl = document.querySelector("#defender-loss");
var attackerMoraleLossEl = document.querySelector("#attacker-morale-loss");
var defenderMoraleLossEl = document.querySelector("#defender-morale-loss");

var modeSingleRadio = document.querySelector("#mode-single");
var modeSimRadio = document.querySelector("#mode-sim");
var modeRankingRadio = document.querySelector("#mode-ranking");

var singleStrip = document.querySelector("#single-strip");
var phaseBox = document.querySelector(".phase-box");
var simStrip = document.querySelector("#sim-strip");
var simDiceStrip = document.querySelector("#sim-dice-strip");
var simDiceFixedField = document.querySelector("#sim-dice-fixed-field");
var simDiceFixedValue = document.querySelector("#sim-dice-fixed-value");
var simDiceMode = document.querySelector("#sim-dice-mode");
var simRounds = document.querySelector("#sim-rounds");
var simTerrainPenalty = document.querySelector("#sim-terrain-penalty");
var simRiverCrossing = document.querySelector("#sim-river-crossing");
var singleRiverCrossing = document.querySelector("#river-crossing");
var singleAttackerDice = document.querySelector("#attacker-dice");
var singleDefenderDice = document.querySelector("#defender-dice");
var simDiceFireAtt = document.querySelector("#sim-dice-fire-att");
var simDiceFireDef = document.querySelector("#sim-dice-fire-def");
var simDiceShockAtt = document.querySelector("#sim-dice-shock-att");
var simDiceShockDef = document.querySelector("#sim-dice-shock-def");
var simResults = document.querySelector("#sim-results");
var simSummary = document.querySelector("#sim-summary");
var simTbody = document.querySelector("#sim-tbody");
var downloadRankingLogButton = document.querySelector("#download-ranking-log");
var templateCard = document.querySelector("#template-card");
var battleGrid = document.querySelector(".battle-grid");
var resultsGrid = document.querySelector(".results-grid");
var detailsSection = document.querySelector("#details-section");
var rankingResults = document.querySelector("#ranking-results");
var rankingSummary = document.querySelector("#ranking-summary");
var rankingTbody = document.querySelector("#ranking-tbody");
var rankingLogSection = document.querySelector("#ranking-log-section");
var rankingLogOutput = document.querySelector("#ranking-log-output");
var crossTechSection = document.querySelector("#cross-tech-section");
var crossTechThead = document.querySelector("#cross-tech-thead");
var crossTechTbody = document.querySelector("#cross-tech-tbody");
var crossTechTechRange = document.querySelector("#cross-tech-tech-range");
var showCrossTechTemplateBtn = document.querySelector("#show-cross-tech-template");
var crossTechChartsPanel = document.querySelector("#cross-tech-charts-panel");
var toggleCrossTechChartsBtn = document.querySelector("#toggle-cross-tech-charts");
var toggleCrossTechTableModeBtn = document.querySelector("#toggle-cross-tech-table-mode");
var crossTechRankingBtn = document.querySelector("#cross-tech-ranking-btn");
var downloadCrossTechBtn = document.querySelector("#download-cross-tech");
var crossTechInfantryChart = document.querySelector("#cross-tech-infantry-chart");
var crossTechCavalryChart = document.querySelector("#cross-tech-cavalry-chart");
var crossTechInfantryOnlyChart = document.querySelector("#cross-tech-infantry-only-chart");
var crossTechCavalryOnlyChart = document.querySelector("#cross-tech-cavalry-only-chart");
var chartLightbox = document.querySelector("#chart-lightbox");
var chartLightboxBackdrop = document.querySelector("#chart-lightbox-backdrop");
var chartLightboxClose = document.querySelector("#chart-lightbox-close");
var chartLightboxTitle = document.querySelector("#chart-lightbox-title");
var chartLightboxBody = document.querySelector("#chart-lightbox-body");

var crossTechTemplateCard = document.querySelector("#cross-tech-template-card");
var crossTechTemplateGrid = document.querySelector("#cross-tech-template-grid");
var crossTechConfirmDialog = document.querySelector("#cross-tech-confirm-dialog");
var crossTechConfirmBackdrop = document.querySelector("#cross-tech-confirm-backdrop");
var crossTechConfirmText = document.querySelector("#cross-tech-confirm-text");
var crossTechConfirmStart = document.querySelector("#cross-tech-confirm-start");
var crossTechConfirmCancel = document.querySelector("#cross-tech-confirm-cancel");
var crossTechConfirmProgress = document.querySelector("#cross-tech-confirm-progress");
var crossTechConfirmProgressFill = document.querySelector("#cross-tech-confirm-progress-fill");
var crossTechConfirmProgressLabel = document.querySelector("#cross-tech-confirm-progress-label");
var crossTechConfirmProgressPercent = document.querySelector("#cross-tech-confirm-progress-percent");
var errorDialog = document.querySelector("#error-dialog");
var errorDialogBackdrop = document.querySelector("#error-dialog-backdrop");
var errorDialogClose = document.querySelector("#error-dialog-close");
var errorDialogMessage = document.querySelector("#error-dialog-message");

// ---- App state ----
var uiView = "settings";
var resultMode = null;
var crossTechData = null;
var latestCrossTechTemplateKey = "";
var crossTechTableMode = "group";
var crossTechChartsExpanded = false;
var crossTechConfirmTimer = null;
var crossTechConfirmCountdown = null;
var crossTechRunToken = 0;
var latestRankingLogText = "";

// ---- DOM object passed to mode modules ----
var dom = {
  phaseSelect: phaseSelect, calculateButton: calculateButton, backButton: backButton, detailsOutput: detailsOutput,
  attackerLossEl: attackerLossEl, defenderLossEl: defenderLossEl, attackerMoraleLossEl: attackerMoraleLossEl, defenderMoraleLossEl: defenderMoraleLossEl,
  singleAttackerDice: singleAttackerDice, singleDefenderDice: singleDefenderDice, singleRiverCrossing: singleRiverCrossing,
  simRounds: simRounds, simDiceMode: simDiceMode, simDiceFixedValue: simDiceFixedValue, simTerrainPenalty: simTerrainPenalty, simRiverCrossing: simRiverCrossing,
  simDiceFireAtt: simDiceFireAtt, simDiceFireDef: simDiceFireDef, simDiceShockAtt: simDiceShockAtt, simDiceShockDef: simDiceShockDef,
  simSummary: simSummary, simTbody: simTbody,
  rankingSummary: rankingSummary, rankingTbody: rankingTbody, rankingLogSection: rankingLogSection, rankingLogOutput: rankingLogOutput, downloadRankingLogButton: downloadRankingLogButton,
  crossTechSection: crossTechSection, crossTechThead: crossTechThead, crossTechTbody: crossTechTbody, crossTechTechRange: crossTechTechRange,
  showCrossTechTemplateBtn: showCrossTechTemplateBtn, crossTechChartsPanel: crossTechChartsPanel, toggleCrossTechChartsBtn: toggleCrossTechChartsBtn,
  toggleCrossTechTableModeBtn: toggleCrossTechTableModeBtn, crossTechRankingBtn: crossTechRankingBtn, downloadCrossTechBtn: downloadCrossTechBtn,
  crossTechInfantryChart: crossTechInfantryChart, crossTechCavalryChart: crossTechCavalryChart,
  crossTechInfantryOnlyChart: crossTechInfantryOnlyChart, crossTechCavalryOnlyChart: crossTechCavalryOnlyChart,
  crossTechConfirmText: crossTechConfirmText, crossTechConfirmProgress: crossTechConfirmProgress, crossTechConfirmStart: crossTechConfirmStart,
  crossTechConfirmCancel: crossTechConfirmCancel, crossTechConfirmProgressFill: crossTechConfirmProgressFill,
  crossTechConfirmProgressLabel: crossTechConfirmProgressLabel, crossTechConfirmProgressPercent: crossTechConfirmProgressPercent
};

var state = {
  get latestRankingLogText() { return latestRankingLogText; },
  set latestRankingLogText(v) { latestRankingLogText = v; },
  get crossTechData() { return crossTechData; },
  set crossTechData(v) { crossTechData = v; },
  get crossTechTableMode() { return crossTechTableMode; },
  set crossTechTableMode(v) { crossTechTableMode = v; },
  get crossTechChartsExpanded() { return crossTechChartsExpanded; },
  set crossTechChartsExpanded(v) { crossTechChartsExpanded = v; },
  get latestCrossTechTemplateKey() { return latestCrossTechTemplateKey; },
  set latestCrossTechTemplateKey(v) { latestCrossTechTemplateKey = v; },
  get crossTechRunToken() { return crossTechRunToken; },
  set crossTechRunToken(v) { crossTechRunToken = v; }
};

initDialogDom({
  chartLightbox: chartLightbox, chartLightboxTitle: chartLightboxTitle, chartLightboxBody: chartLightboxBody,
  errorDialog: errorDialog, errorDialogMessage: errorDialogMessage,
  crossTechConfirmDialog: crossTechConfirmDialog
});

initCrossTechFilter(dom);

function getCalcMode() {
  if (modeRankingRadio.checked) return "ranking";
  if (modeSimRadio.checked) return "simulation";
  return "single";
}

function updateModeUI() {
  var mode = getCalcMode();
  var isSingle = mode === "single";
  var isSim = mode === "simulation";
  var isRanking = mode === "ranking";

  calculateButton.textContent = isRanking ? "开始排行" : "计算双方损失";

  if (uiView === "settings") {
    singleStrip.style.display = isSingle ? "" : "none";
    simStrip.style.display = isSim ? "" : "none";
    templateCard.style.display = isRanking ? "" : "none";
    phaseBox.style.display = isSingle ? "" : "none";
    battleGrid.style.display = isRanking ? "none" : "";
    resultsGrid.style.display = "none";
    simResults.style.display = "none";
    rankingResults.style.display = "none";
    rankingLogSection.style.display = "none";
    crossTechSection.style.display = "none";
    detailsSection.style.display = "none";
    backButton.style.display = "none";
    document.body.className = "settings-view";
  } else {
    singleStrip.style.display = "none";
    simStrip.style.display = "none";
    simDiceStrip.style.display = "none";
    simDiceFixedField.style.display = "none";
    templateCard.style.display = "none";
    phaseBox.style.display = "none";
    battleGrid.style.display = "none";
    resultsGrid.style.display = resultMode === "single" || resultMode === "simulation" ? "" : "none";
    simResults.style.display = resultMode === "simulation" ? "" : "none";
    rankingResults.style.display = resultMode === "ranking" ? "" : "none";
    rankingLogSection.style.display = resultMode === "ranking" ? "" : "none";
    crossTechSection.style.display = resultMode === "cross-tech" ? "" : "none";
    if (resultMode === "cross-tech" && crossTechData) {
      updateCrossTechView();
    }
    detailsSection.style.display = resultMode === "single" || resultMode === "simulation" ? "" : "none";
    backButton.style.display = "";
    document.body.className = "result-view";
  }

  updateSimDiceVisibility();
}

function updateSimDiceVisibility() {
  if (!modeSimRadio.checked) {
    simDiceStrip.style.display = "none";
    simDiceFixedField.style.display = "none";
    return;
  }
  simDiceStrip.style.display = simDiceMode.value === "manual" ? "" : "none";
  simDiceFixedField.style.display = simDiceMode.value === "fixed" ? "" : "none";
}

function updateCrossTechView() {
  crossTechChartsPanel.style.display = crossTechChartsExpanded ? "" : "none";
  toggleCrossTechChartsBtn.textContent = crossTechChartsExpanded ? "收起兵种组成长图" : "展开兵种组成长图";
}

function clearCrossTechConfirmTimers() {
  if (crossTechConfirmTimer) {
    clearTimeout(crossTechConfirmTimer);
    crossTechConfirmTimer = null;
  }
  if (crossTechConfirmCountdown) {
    clearInterval(crossTechConfirmCountdown);
    crossTechConfirmCountdown = null;
  }
}

function closeCrossTechConfirmDialog() {
  clearCrossTechConfirmTimers();
  crossTechConfirmDialog.style.display = "none";
  crossTechConfirmDialog.setAttribute("aria-hidden", "true");
  crossTechConfirmProgress.style.display = "none";
  crossTechConfirmStart.disabled = false;
  crossTechConfirmCancel.disabled = false;
  crossTechConfirmProgressFill.style.width = "0%";
  crossTechConfirmProgressLabel.textContent = "正在准备…";
  crossTechConfirmProgressPercent.textContent = "0%";
}

function closeCrossTechTemplateCard() {
  crossTechTemplateCard.style.display = "none";
  crossTechTemplateGrid.innerHTML = "";
  document.removeEventListener("click", closeCrossTechTemplateCardOnOutside);
}

var closeCrossTechTemplateCardOnOutside = function(e) {
  if (!crossTechTemplateCard.contains(e.target) && e.target.id !== "show-cross-tech-template") {
    closeCrossTechTemplateCard();
  }
};

function renderCrossTechTemplateDialog() {
  var template = readSide("template");
  var schemaMap = {};
  for (var i = 0; i < sideSchemas.template.length; i++) {
    schemaMap[sideSchemas.template[i].key] = sideSchemas.template[i];
  }
  var html = "";
  for (var g = 0; g < templateLayout.length; g++) {
    var group = templateLayout[g];
    html += '<div class="cross-tech-template-section">';
    html += '<div class="cross-tech-template-section-title">' + group.title + "</div>";
    html += '<div class="cross-tech-template-cards">';
    for (var k = 0; k < group.fields.length; k++) {
      var key = group.fields[k];
      var schema = schemaMap[key];
      if (!schema) continue;
      html += '<div class="cross-tech-template-item"><span class="cross-tech-template-label">' + schema.label + '</span><span class="cross-tech-template-sep">：</span><span class="cross-tech-template-value">' + formatTemplateValue(template[schema.key], schema) + "</span></div>";
    }
    html += "</div></div>";
  }
  crossTechTemplateGrid.innerHTML = html;
}

function openCrossTechTemplateCard() {
  var isVisible = crossTechTemplateCard.style.display !== "none";
  if (isVisible) {
    closeCrossTechTemplateCard();
    return;
  }
  renderCrossTechTemplateDialog();
  crossTechTemplateCard.style.display = "";
  setTimeout(function() {
    document.addEventListener("click", closeCrossTechTemplateCardOnOutside);
  }, 0);
}

function updateCrossTechProgress(value, labelText) {
  var progressValue = Math.max(0, Math.min(100, value));
  crossTechConfirmProgressFill.style.width = progressValue + "%";
  crossTechConfirmProgressPercent.textContent = Math.round(progressValue) + "%";
  if (labelText) crossTechConfirmProgressLabel.textContent = labelText;
}

function resetCrossTechResults() {
  crossTechData = null;
  latestCrossTechTemplateKey = "";
  crossTechTableMode = "group";
  crossTechChartsExpanded = false;
  crossTechSection.style.display = "none";
  crossTechTechRange.textContent = "";
  crossTechThead.innerHTML = "";
  crossTechTbody.innerHTML = "";
  crossTechInfantryChart.innerHTML = "";
  crossTechCavalryChart.innerHTML = "";
  crossTechInfantryOnlyChart.innerHTML = "";
  crossTechCavalryOnlyChart.innerHTML = "";
  downloadCrossTechBtn.disabled = true;
  toggleCrossTechChartsBtn.disabled = true;
  toggleCrossTechChartsBtn.textContent = "展开兵种组成长图";
  toggleCrossTechTableModeBtn.disabled = true;
  toggleCrossTechTableModeBtn.textContent = "⇄ 转换成兵种显示";
  showCrossTechTemplateBtn.disabled = true;
  crossTechChartsPanel.style.display = "none";
  closeChartLightbox();
  closeCrossTechTemplateCard();
}

function startCrossTechRankingFlow() {
  try {
    closeErrorDialog();
    clearCrossTechConfirmTimers();
    crossTechConfirmText.textContent = "正在遍历科技排行，请稍候。";
    crossTechConfirmProgress.style.display = "";
    crossTechConfirmStart.disabled = true;
    crossTechConfirmCancel.disabled = true;
    updateCrossTechProgress(2, "正在启动计算…");
    window.requestAnimationFrame(function() {
      window.requestAnimationFrame(function() {
        setTimeout(function() {
          try {
            calculateCrossTechRanking(dom, state, {
              updateCrossTechProgress: updateCrossTechProgress,
              closeCrossTechConfirmDialog: closeCrossTechConfirmDialog,
              updateModeUI: updateModeUI,
              updateCrossTechView: updateCrossTechView,
              switchToResultMode: function(mode) {
                uiView = "results";
                resultMode = mode;
                updateModeUI();
              }
            });
          } catch (error) {
            closeCrossTechConfirmDialog();
            openErrorDialog(error.message);
          }
        }, 24);
      });
    });
  } catch (error) {
    closeCrossTechConfirmDialog();
    openErrorDialog(error.message);
  }
}

function openCrossTechConfirmDialog() {
  clearCrossTechConfirmTimers();
  var remainingSeconds = 3;
  crossTechConfirmText.textContent = "这个计算可能需要一些时间。" + remainingSeconds + " 秒后将自动开始，你也可以立即开始或取消。";
  crossTechConfirmDialog.style.display = "";
  crossTechConfirmDialog.setAttribute("aria-hidden", "false");
  crossTechConfirmProgress.style.display = "none";
  crossTechConfirmStart.disabled = false;
  crossTechConfirmCancel.disabled = false;
  crossTechConfirmCountdown = setInterval(function() {
    remainingSeconds -= 1;
    if (remainingSeconds <= 0) {
      clearCrossTechConfirmTimers();
      startCrossTechRankingFlow();
      return;
    }
    crossTechConfirmText.textContent = "这个计算可能需要一些时间。" + remainingSeconds + " 秒后将自动开始，你也可以立即开始或取消。";
  }, 1000);
  crossTechConfirmTimer = setTimeout(function() {
    clearCrossTechConfirmTimers();
    startCrossTechRankingFlow();
  }, 3000);
}

function calculate() {
  var mode = getCalcMode();
  if (mode === "ranking") {
    resetCrossTechResults();
    var template = readSide("template");
    var battleOptions = {
      terrainPenalty: 0,
      phaseOnly: null,
      diceConfig: { mode: "fixed", value: 5 },
      diceMode: "fixed"
    };
    var result = runUnitTournament(template, battleOptions);
    renderRankingResults(result, battleOptions, dom);
    latestRankingLogText = buildRankingLogText(result, template, battleOptions);
    renderRankingLogPreview(latestRankingLogText, dom);
    downloadRankingLogButton.disabled = false;
    uiView = "results";
    resultMode = "ranking";
    updateModeUI();
  } else if (mode === "simulation") {
    var simResult = calculateSimulation(dom);
    renderSimResults(dom, simResult.result, simResult.attacker, simResult.defender);
    attackerLossEl.textContent = simResult.result.totalAttackerStrengthLoss.toFixed(2);
    defenderLossEl.textContent = simResult.result.totalDefenderStrengthLoss.toFixed(2);
    attackerMoraleLossEl.textContent = simResult.result.totalAttackerMoraleLoss.toFixed(2);
    defenderMoraleLossEl.textContent = simResult.result.totalDefenderMoraleLoss.toFixed(2);
    renderSimDetailText(dom, simResult.result, simResult.battleOptions, simResult.attackerPenaltyInfo);
    uiView = "results";
    resultMode = "simulation";
    updateModeUI();
  } else {
    var singleResult = calculateSingle(dom);
    renderSingleResults(dom, singleResult);
    uiView = "results";
    resultMode = "single";
    updateModeUI();
  }
}

function bindEvents() {
  ["attacker", "defender"].forEach(function(side) {
    sideState[side].strength.addEventListener("change", function() {
      maybeWarnStrengthLimit(sideState[side].strength);
    });
  });
  Object.keys(sideState.template).forEach(function(key) {
    sideState.template[key].addEventListener("change", resetCrossTechResults);
    if (sideState.template[key].tagName === "INPUT") {
      sideState.template[key].addEventListener("input", resetCrossTechResults);
    }
  });
  sideState.template.strength.addEventListener("change", function() {
    maybeWarnStrengthLimit(sideState.template.strength);
  });
  calculateButton.addEventListener("click", function() {
    try {
      closeErrorDialog();
      calculate();
    } catch (error) {
      openErrorDialog(error.message);
      uiView = "settings";
      resultMode = null;
      updateModeUI();
      attackerLossEl.textContent = "0.00";
      defenderLossEl.textContent = "0.00";
      attackerMoraleLossEl.textContent = "0.00";
      defenderMoraleLossEl.textContent = "0.00";
      latestRankingLogText = "";
      downloadRankingLogButton.disabled = true;
    }
  });
  downloadRankingLogButton.addEventListener("click", function() {
    downloadRankingLog(state);
  });
  crossTechRankingBtn.addEventListener("click", openCrossTechConfirmDialog);
  showCrossTechTemplateBtn.addEventListener("click", function(e) {
    e.stopPropagation();
    if (!crossTechData) return;
    openCrossTechTemplateCard();
  });
  toggleCrossTechTableModeBtn.addEventListener("click", function() {
    if (!crossTechData) return;
    crossTechTableMode = crossTechTableMode === "unit" ? "group" : "unit";
    renderCrossTechTable(crossTechData.results, dom, state);
  });
  downloadCrossTechBtn.addEventListener("click", function() {
    downloadCrossTechCSV(state);
  });
  toggleCrossTechChartsBtn.addEventListener("click", function() {
    crossTechChartsExpanded = !crossTechChartsExpanded;
    updateCrossTechView();
    if (crossTechChartsExpanded) {
      window.requestAnimationFrame(function() {
        window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" });
      });
    }
  });
  crossTechConfirmStart.addEventListener("click", startCrossTechRankingFlow);
  crossTechConfirmCancel.addEventListener("click", closeCrossTechConfirmDialog);
  crossTechConfirmBackdrop.addEventListener("click", closeCrossTechConfirmDialog);
  errorDialogBackdrop.addEventListener("click", closeErrorDialog);
  errorDialogClose.addEventListener("click", closeErrorDialog);
  chartLightboxBackdrop.addEventListener("click", closeChartLightbox);
  chartLightboxClose.addEventListener("click", closeChartLightbox);
  document.addEventListener("keydown", function(event) {
    if (event.key === "Escape" && errorDialog.style.display !== "none") {
      closeErrorDialog();
      return;
    }
    if (event.key === "Escape" && chartLightbox.style.display !== "none") {
      closeChartLightbox();
      return;
    }
    if (event.key === "Escape" && crossTechTemplateCard.style.display !== "none") {
      closeCrossTechTemplateCard();
      return;
    }
    if (event.key === "Escape" && crossTechConfirmDialog.style.display !== "none") {
      closeCrossTechConfirmDialog();
    }
  });
  backButton.addEventListener("click", function() {
    closeErrorDialog();
    closeChartLightbox();
    closeCrossTechTemplateCard();
    closeCrossTechConfirmDialog();
    crossTechRunToken += 1;
    uiView = "settings";
    resultMode = null;
    updateModeUI();
  });
  modeSingleRadio.addEventListener("change", updateModeUI);
  modeSimRadio.addEventListener("change", updateModeUI);
  modeRankingRadio.addEventListener("change", updateModeUI);
  simDiceMode.addEventListener("change", updateSimDiceVisibility);
}

// ---- Init ----
buildPanel("attacker");
buildPanel("defender");
buildPanel("template");
initOptions();
bindEvents();
document.body.className = "settings-view";
updateModeUI();
requestAnimationFrame(function() {
  requestAnimationFrame(function() {
    var welcomeDialog = document.querySelector("#welcome-dialog");
    var welcomeBackdrop = document.querySelector("#welcome-dialog-backdrop");
    var welcomeClose = document.querySelector("#welcome-dialog-close");
    function closeWelcome() {
      welcomeDialog.style.display = "none";
      welcomeDialog.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      document.removeEventListener("keydown", welcomeEsc);
    }
    function welcomeEsc(e) { if (e.key === "Escape") closeWelcome(); }
    welcomeDialog.style.display = "";
    welcomeDialog.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    welcomeClose.addEventListener("click", closeWelcome);
    welcomeBackdrop.addEventListener("click", closeWelcome);
    document.addEventListener("keydown", welcomeEsc);
  });
});

})(window._M = window._M || {});
