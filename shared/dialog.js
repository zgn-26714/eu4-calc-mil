(function(M) {
  var dom = {};

  function initDialogDom(elements) {
    dom = elements;
  }

  function openChartLightbox(title, contentHtml) {
    dom.chartLightboxTitle.textContent = title;
    dom.chartLightboxBody.innerHTML = contentHtml;
    enhanceChartLightboxLegend();
    dom.chartLightbox.style.display = "";
    dom.chartLightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeChartLightbox() {
    dom.chartLightbox.style.display = "none";
    dom.chartLightbox.setAttribute("aria-hidden", "true");
    dom.chartLightboxBody.innerHTML = "";
    document.body.style.overflow = "";
  }

  function openErrorDialog(message) {
    dom.errorDialogMessage.textContent = message || "请检查输入内容。";
    dom.errorDialog.style.display = "";
    dom.errorDialog.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeErrorDialog() {
    dom.errorDialog.style.display = "none";
    dom.errorDialog.setAttribute("aria-hidden", "true");
    dom.errorDialogMessage.textContent = "";
    if (dom.chartLightbox.style.display === "none" &&
        dom.crossTechTemplateDialog.style.display === "none" &&
        dom.crossTechConfirmDialog.style.display === "none") {
      document.body.style.overflow = "auto";
    }
  }

  function applyChartLegendHighlight(shell, activeGroupKey) {
    var lines = shell.querySelectorAll("[data-chart-group-key]");
    var legendItems = shell.querySelectorAll(".cross-tech-chart-legend-item");
    var hasActive = !!activeGroupKey;

    for (var i = 0; i < lines.length; i++) {
      var line = lines[i];
      var isMatch = line.getAttribute("data-chart-group-key") === activeGroupKey;
      line.classList.toggle("is-dimmed", hasActive && !isMatch);
      line.classList.toggle("is-highlighted", hasActive && isMatch);
    }

    for (i = 0; i < legendItems.length; i++) {
      var item = legendItems[i];
      var itemMatch = item.getAttribute("data-chart-group-key") === activeGroupKey;
      item.classList.toggle("is-dimmed", hasActive && !itemMatch);
      item.classList.toggle("is-active", hasActive && itemMatch);
      item.setAttribute("aria-pressed", hasActive && itemMatch ? "true" : "false");
    }
  }

  function enhanceChartLightboxLegend() {
    var shell = dom.chartLightboxBody.querySelector(".cross-tech-chart-shell");
    if (!shell) return;
    var legendItems = shell.querySelectorAll(".cross-tech-chart-legend-item");
    if (!legendItems.length) return;

    for (var i = 0; i < legendItems.length; i++) {
      var item = legendItems[i];
      item.setAttribute("role", "button");
      item.setAttribute("tabindex", "0");
      item.setAttribute("aria-pressed", "false");
      item.setAttribute("aria-label", "高亮显示" + item.textContent.trim());
      item.addEventListener("click", function() {
        var groupKey = this.getAttribute("data-chart-group-key");
        var current = shell.getAttribute("data-active-group-key") || "";
        var next = current === groupKey ? "" : groupKey;
        shell.setAttribute("data-active-group-key", next);
        applyChartLegendHighlight(shell, next);
      });
      item.addEventListener("keydown", function(event) {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          this.click();
        }
      });
    }

    applyChartLegendHighlight(shell, "");
  }

  M['shared/dialog'] = {
    initDialogDom: initDialogDom,
    openChartLightbox: openChartLightbox,
    closeChartLightbox: closeChartLightbox,
    openErrorDialog: openErrorDialog,
    closeErrorDialog: closeErrorDialog,
    applyChartLegendHighlight: applyChartLegendHighlight,
    enhanceChartLightboxLegend: enhanceChartLightboxLegend
  };
})(window._M = window._M || {});
