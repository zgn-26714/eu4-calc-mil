(function(M) {
  var stateModule = M['shared/state'];
  var readSide = stateModule.readSide;

  var crossTechLogic = M['ranking/cross-tech-logic'];
  var runCrossTechRanking = crossTechLogic.runCrossTechRanking;
  var buildGroupPeakSeries = crossTechLogic.buildGroupPeakSeries;
  var buildCrossTechTableRows = crossTechLogic.buildCrossTechTableRows;

  var chartsView = M['ranking/charts-view'];
  var renderCrossTechLineChart = chartsView.renderCrossTechLineChart;
  var bindChartPreview = chartsView.bindChartPreview;

  function crossTechCellClassForUnitType(unitType) {
    if (unitType === "Infantry") return "cross-tech-cell-infantry";
    if (unitType === "Cavalry") return "cross-tech-cell-cavalry";
    return "cross-tech-cell-artillery";
  }

  function buildCrossTechCellHtml(item) {
    var sublabel = item.sublabel ? '<div class="cross-tech-cell-sub">' + item.sublabel + '</div>' : '';
    return '<div class="cross-tech-cell-main">' + item.label + '</div>' + sublabel;
  }

  function renderCrossTechTable(results, dom, state) {
    var tableData = buildCrossTechTableRows(results, state.crossTechTableMode);
    var headerHtml = '<tr><th>科技</th>';
    for (var c = 1; c <= tableData.maxCols; c++) {
      headerHtml += '<th>#' + c + '</th>';
    }
    headerHtml += '</tr>';
    dom.crossTechThead.innerHTML = headerHtml;

    var bodyHtml = "";
    for (var i = 0; i < tableData.rows.length; i++) {
      var row = tableData.rows[i];
      bodyHtml += '<tr><td>' + row.techLevel + '</td>';
      for (var c2 = 0; c2 < tableData.maxCols; c2++) {
        if (c2 < row.entries.length) {
          var item = row.entries[c2];
          bodyHtml += '<td class="text-left ' + crossTechCellClassForUnitType(item.unitType) + '">' + buildCrossTechCellHtml(item) + '</td>';
        } else {
          bodyHtml += '<td class="text-left" style="color:var(--muted);">-</td>';
        }
      }
      bodyHtml += '</tr>';
    }
    dom.crossTechTbody.innerHTML = bodyHtml;
    dom.downloadCrossTechBtn.disabled = false;
    updateCrossTechTableModeButton(dom, state);
  }

  function renderCrossTechSummary(results, dom) {
    if (!results.length) {
      dom.crossTechTechRange.textContent = "";
      dom.showCrossTechTemplateBtn.disabled = true;
      return;
    }
    dom.crossTechTechRange.textContent = "科技 " + results[0].techLevel + " – " + results[results.length - 1].techLevel;
    dom.showCrossTechTemplateBtn.disabled = false;
  }

  function renderCrossTechCharts(results, dom) {
    renderCrossTechLineChart(dom.crossTechInfantryChart, buildGroupPeakSeries(results, "Infantry", true, false), "步兵");
    renderCrossTechLineChart(dom.crossTechCavalryChart, buildGroupPeakSeries(results, "Cavalry", true, false), "骑兵");
    renderCrossTechLineChart(dom.crossTechInfantryOnlyChart, buildGroupPeakSeries(results, "Infantry", false, true), "纯步兵");
    renderCrossTechLineChart(dom.crossTechCavalryOnlyChart, buildGroupPeakSeries(results, "Cavalry", false, true), "纯骑兵");
    bindChartPreview(dom.crossTechInfantryChart, "步兵组最佳排名");
    bindChartPreview(dom.crossTechCavalryChart, "骑兵组最佳排名");
    bindChartPreview(dom.crossTechInfantryOnlyChart, "纯步兵最佳排名");
    bindChartPreview(dom.crossTechCavalryOnlyChart, "纯骑兵最佳排名");
  }

  function renderCrossTechResults(results, maxCols, dom, state) {
    renderCrossTechSummary(results, dom);
    renderCrossTechCharts(results, dom);
    renderCrossTechTable(results, dom, state);
    dom.downloadCrossTechBtn.disabled = false;
    dom.toggleCrossTechChartsBtn.disabled = false;
    dom.showCrossTechTemplateBtn.disabled = false;
    dom.updateCrossTechView();
  }


  function renderCrossTechResultsWithProgress(results, maxCols, runToken, dom, state, callbacks) {
    callbacks.updateCrossTechProgress(84, "正在渲染摘要…");
    setTimeout(function() {
      if (runToken !== state.crossTechRunToken) return;
      renderCrossTechSummary(results, dom);

      callbacks.updateCrossTechProgress(88, "正在渲染综合成长图…");
      setTimeout(function() {
        if (runToken !== state.crossTechRunToken) return;
        renderCrossTechLineChart(dom.crossTechInfantryChart, buildGroupPeakSeries(results, "Infantry", true, false), "步兵");
        renderCrossTechLineChart(dom.crossTechCavalryChart, buildGroupPeakSeries(results, "Cavalry", true, false), "骑兵");
        bindChartPreview(dom.crossTechInfantryChart, "步兵组最佳排名");
        bindChartPreview(dom.crossTechCavalryChart, "骑兵组最佳排名");

        callbacks.updateCrossTechProgress(93, "正在渲染纯兵种成长图…");
        setTimeout(function() {
          if (runToken !== state.crossTechRunToken) return;
          renderCrossTechLineChart(dom.crossTechInfantryOnlyChart, buildGroupPeakSeries(results, "Infantry", false, true), "纯步兵");
          renderCrossTechLineChart(dom.crossTechCavalryOnlyChart, buildGroupPeakSeries(results, "Cavalry", false, true), "纯骑兵");
          bindChartPreview(dom.crossTechInfantryOnlyChart, "纯步兵最佳排名");
          bindChartPreview(dom.crossTechCavalryOnlyChart, "纯骑兵最佳排名");

          callbacks.updateCrossTechProgress(97, "正在渲染排行表格…");
          setTimeout(function() {
            if (runToken !== state.crossTechRunToken) return;
            renderCrossTechTable(results, dom, state);
            dom.downloadCrossTechBtn.disabled = false;
            dom.toggleCrossTechChartsBtn.disabled = false;
            callbacks.updateCrossTechView();

            callbacks.updateCrossTechProgress(100, "正在完成跳转…");
            setTimeout(function() {
              if (runToken !== state.crossTechRunToken) return;
              callbacks.switchToResultMode("cross-tech");
              dom.crossTechSection.style.display = "";
              callbacks.updateCrossTechView();
              callbacks.closeCrossTechConfirmDialog();
            }, 120);
          }, 0);
        }, 0);
      }, 0);
    }, 0);
  }


  function downloadCrossTechCSV(state) {
    if (!state.crossTechData) return;
    var tableData = buildCrossTechTableRows(state.crossTechData.results, state.crossTechTableMode);
    var lines = [];
    lines.push("科技等级," + Array(tableData.maxCols).fill(0).map(function(_, i) {
      return state.crossTechTableMode === "unit" ? ("第" + (i + 1) + "名兵种") : ("第" + (i + 1) + "名兵种组");
    }).join(","));
    for (var i = 0; i < tableData.rows.length; i++) {
      var tableRow = tableData.rows[i];
      var row = [tableRow.techLevel];
      for (var c = 0; c < tableData.maxCols; c++) {
        row.push(c < tableRow.entries.length ? (tableRow.entries[c].label + (tableRow.entries[c].sublabel ? " | " + tableRow.entries[c].sublabel : "")) : "");
      }
      lines.push(row.join(","));
    }
    var csv = lines.join("\n");
    var stamp = new Date().toISOString().replace(/[:.]/g, "-");
    var link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" }));
    link.download = "calc_mil_cross_tech_" + stamp + ".csv";
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(function() { URL.revokeObjectURL(link.href); }, 0);
  }

  function updateCrossTechTableModeButton(dom, state) {
    dom.toggleCrossTechTableModeBtn.disabled = !state.crossTechData;
    dom.toggleCrossTechTableModeBtn.textContent = state.crossTechTableMode === "unit" ? "⇄ 转换成兵种组显示" : "⇄ 转换成兵种显示";
  }

  function calculateCrossTechRanking(dom, state, callbacks) {
    state.crossTechRunToken = (state.crossTechRunToken || 0) + 1;
    var runToken = state.crossTechRunToken;
    var totalTechCount = 33;
    var template = readSide("template");
    var battleOptions = {
      terrainPenalty: 0,
      phaseOnly: null,
      diceConfig: { mode: "fixed", value: 5 },
      diceMode: "fixed"
    };

    dom.crossTechRankingBtn.disabled = true;
    callbacks.updateCrossTechProgress(4, "正在准备遍历科技排行…");

    runCrossTechRanking(
      template,
      battleOptions,
      function(processedCount, candidateCount) {
        if (runToken !== state.crossTechRunToken) return;
        var ratio = Math.max(0, Math.min(1, processedCount / totalTechCount));
        var progressValue = ratio * 80;
        callbacks.updateCrossTechProgress(progressValue, "正在计算科技 " + (processedCount - 1) + "/32（候选兵种 " + candidateCount + " 个）…");
      },
      function(data) {
        if (runToken !== state.crossTechRunToken) return;
        dom.crossTechRankingBtn.disabled = false;
        renderCrossTechResultsWithProgress(data.results, data.maxCols, runToken, dom, state, callbacks);
      },
      state
    );
  }

  M['ranking/cross-tech-view'] = {
    crossTechCellClassForUnitType: crossTechCellClassForUnitType,
    buildCrossTechCellHtml: buildCrossTechCellHtml,
    renderCrossTechTable: renderCrossTechTable,
    renderCrossTechSummary: renderCrossTechSummary,
    renderCrossTechCharts: renderCrossTechCharts,
    renderCrossTechResults: renderCrossTechResults,
    renderCrossTechResultsWithProgress: renderCrossTechResultsWithProgress,
    downloadCrossTechCSV: downloadCrossTechCSV,
    updateCrossTechTableModeButton: updateCrossTechTableModeButton,
    calculateCrossTechRanking: calculateCrossTechRanking
  };
})(window._M = window._M || {});
