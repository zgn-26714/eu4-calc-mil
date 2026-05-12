(function(M) {
  var dialogModule = M['shared/dialog'];
  var openChartLightbox = dialogModule.openChartLightbox;

  function bindChartPreview(container, titleText) {
    var shell = container.querySelector(".cross-tech-chart-shell");
    if (!shell) return;
    shell.classList.add("clickable");
    shell.setAttribute("tabindex", "0");
    shell.setAttribute("role", "button");
    shell.setAttribute("aria-label", titleText + "，点击放大查看");

    function openPreview() {
      openChartLightbox(titleText, shell.outerHTML.replace(" clickable", ""));
    }

    shell.addEventListener("click", openPreview);
    shell.addEventListener("keydown", function(event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openPreview();
      }
    });
  }

  function applyChartLegendHighlight(shell, activeGroupKeys) {
    if (typeof activeGroupKeys === "string") {
      activeGroupKeys = activeGroupKeys ? [activeGroupKeys] : [];
    }
    var lines = shell.querySelectorAll("[data-chart-group-key]");
    var legendItems = shell.querySelectorAll(".cross-tech-chart-legend-item");
    var hasActive = activeGroupKeys.length > 0;

    for (var i = 0; i < lines.length; i++) {
      var line = lines[i];
      var isMatch = activeGroupKeys.indexOf(line.getAttribute("data-chart-group-key")) !== -1;
      line.classList.toggle("is-dimmed", hasActive && !isMatch);
      line.classList.toggle("is-highlighted", hasActive && isMatch);
    }

    for (i = 0; i < legendItems.length; i++) {
      var item = legendItems[i];
      var itemMatch = activeGroupKeys.indexOf(item.getAttribute("data-chart-group-key")) !== -1;
      item.classList.toggle("is-dimmed", hasActive && !itemMatch);
      item.classList.toggle("is-active", hasActive && itemMatch);
      item.setAttribute("aria-pressed", itemMatch ? "true" : "false");
    }
  }


  function renderCrossTechLineChart(container, seriesData, titleText) {
    if (!seriesData.groups.length) {
      container.innerHTML = '<div class="cross-tech-chart-shell"><div class="cross-tech-chart-empty">没有可绘制的数据</div></div>';
      return;
    }

    var width = 920;
    var height = 420;
    var paddingLeft = 54;
    var paddingRight = 18;
    var paddingTop = 18;
    var paddingBottom = 42;
    var plotWidth = width - paddingLeft - paddingRight;
    var plotHeight = height - paddingTop - paddingBottom;
    var maxRank = 0;
    var techLevels = [];
    var styles = getComputedStyle(document.documentElement);
    var chartBg = styles.getPropertyValue("--chart-bg").trim() || "#fbfdff";
    var chartGrid = styles.getPropertyValue("--chart-grid").trim() || "#d8e0ed";
    var chartAxis = styles.getPropertyValue("--chart-axis").trim() || "#94a3b8";
    var textColor = styles.getPropertyValue("--muted").trim() || "#627089";
    var i;

    for (i = 0; i < seriesData.groups.length; i++) {
      for (var j = 0; j < seriesData.groups[i].points.length; j++) {
        var point = seriesData.groups[i].points[j];
        if (point.rank > maxRank) maxRank = point.rank;
        if (techLevels.indexOf(point.techLevel) === -1) techLevels.push(point.techLevel);
      }
    }

    techLevels.sort(function(a, b) { return a - b; });
    maxRank = Math.max(maxRank, 1);

    function xForTech(techLevel) {
      if (techLevels.length <= 1) return paddingLeft + plotWidth / 2;
      return paddingLeft + (techLevel - techLevels[0]) / (techLevels[techLevels.length - 1] - techLevels[0]) * plotWidth;
    }

    function yForRank(rank) {
      if (maxRank <= 1) return paddingTop + plotHeight / 2;
      return paddingTop + (rank - 1) / (maxRank - 1) * plotHeight;
    }

    var svg = '';
    svg += '<svg class="cross-tech-chart-svg" viewBox="0 0 ' + width + ' ' + height + '" role="img" aria-label="' + titleText + '兵种组最佳排名折线图">';
    svg += '<rect x="0" y="0" width="' + width + '" height="' + height + '" fill="' + chartBg + '"></rect>';


    var yTicks = [];
    var desiredTicks = 8;
    var tickStep = Math.max(1, Math.ceil(maxRank / desiredTicks));
    for (i = 1; i <= maxRank; i += tickStep) {
      yTicks.push(i);
    }
    if (yTicks[yTicks.length - 1] !== maxRank) yTicks.push(maxRank);

    for (i = 0; i < yTicks.length; i++) {
      var rankValue = yTicks[i];
      var y = yForRank(rankValue);
      svg += '<line x1="' + paddingLeft + '" y1="' + y + '" x2="' + (paddingLeft + plotWidth) + '" y2="' + y + '" stroke="' + chartGrid + '" stroke-width="1"></line>';
      svg += '<text x="' + (paddingLeft - 10) + '" y="' + (y + 4) + '" fill="' + textColor + '" font-size="12" text-anchor="end">' + rankValue + '</text>';
    }

    for (i = 0; i < techLevels.length; i++) {
      var tech = techLevels[i];
      var x = xForTech(tech);
      svg += '<line x1="' + x + '" y1="' + paddingTop + '" x2="' + x + '" y2="' + (paddingTop + plotHeight) + '" stroke="' + chartGrid + '" stroke-width="1"></line>';
      if (i === 0 || i === techLevels.length - 1 || tech % 4 === 0) {
        svg += '<text x="' + x + '" y="' + (paddingTop + plotHeight + 22) + '" fill="' + textColor + '" font-size="12" text-anchor="middle">' + tech + '</text>';
      }
    }

    svg += '<line x1="' + paddingLeft + '" y1="' + paddingTop + '" x2="' + paddingLeft + '" y2="' + (paddingTop + plotHeight) + '" stroke="' + chartAxis + '" stroke-width="1.2"></line>';
    svg += '<line x1="' + paddingLeft + '" y1="' + (paddingTop + plotHeight) + '" x2="' + (paddingLeft + plotWidth) + '" y2="' + (paddingTop + plotHeight) + '" stroke="' + chartAxis + '" stroke-width="1.2"></line>';
    svg += '<text x="' + (paddingLeft + plotWidth / 2) + '" y="' + (height - 8) + '" fill="' + textColor + '" font-size="12" text-anchor="middle">军事科技</text>';
    svg += '<text x="18" y="' + (paddingTop + plotHeight / 2) + '" fill="' + textColor + '" font-size="12" text-anchor="middle" transform="rotate(-90 18 ' + (paddingTop + plotHeight / 2) + ')">最佳排名（越低越强）</text>';

    for (i = 0; i < seriesData.groups.length; i++) {
      var group = seriesData.groups[i];
      var path = [];
      for (var p = 0; p < group.points.length; p++) {
        var pt = group.points[p];
        path.push((p === 0 ? "M" : "L") + xForTech(pt.techLevel).toFixed(2) + " " + yForRank(pt.rank).toFixed(2));
      }
      svg += '<path class="cross-tech-chart-line" data-chart-group-key="' + group.key + '" d="' + path.join(" ") + '" fill="none" stroke="' + group.color + '" stroke-width="' + (group.key === "Shared" ? "3" : "2.2") + '" stroke-linecap="round" stroke-linejoin="round"></path>';
      for (p = 0; p < group.points.length; p++) {
        pt = group.points[p];
        svg += '<circle class="cross-tech-chart-point" data-chart-group-key="' + group.key + '" data-unit-name="' + (pt.unitName || '') + '" data-tech-level="' + pt.techLevel + '" data-rank="' + pt.rank + '" cx="' + xForTech(pt.techLevel).toFixed(2) + '" cy="' + yForRank(pt.rank).toFixed(2) + '" r="' + (group.key === "Shared" ? "3.4" : "2.6") + '" fill="' + group.color + '"><title>' + group.label + ' | 科技 ' + pt.techLevel + ' | 第 ' + pt.rank + ' 名' + (pt.unitName ? ' | ' + pt.unitName : '') + '</title></circle>';
      }
    }

    svg += '</svg>';

    var legend = '<div class="cross-tech-chart-legend">';
    for (i = 0; i < seriesData.groups.length; i++) {
      group = seriesData.groups[i];
      legend += '<span class="cross-tech-chart-legend-item" data-chart-group-key="' + group.key + '"><span class="cross-tech-chart-legend-swatch" style="background:' + group.color + ';"></span>' + group.label + '</span>';
    }
    legend += '</div>';

    container.innerHTML = '<div class="cross-tech-chart-shell">' + svg + legend + '</div>';
  }

  M['ranking/charts-view'] = {
    bindChartPreview: bindChartPreview,
    applyChartLegendHighlight: applyChartLegendHighlight,
    renderCrossTechLineChart: renderCrossTechLineChart
  };
})(window._M = window._M || {});
