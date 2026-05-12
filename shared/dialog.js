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
        dom.crossTechConfirmDialog.style.display === "none") {
      document.body.style.overflow = "auto";
    }
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

  function removeUnitNameLabels(shell) {
    var existing = shell.querySelectorAll(".cross-tech-unit-name-label");
    for (var i = 0; i < existing.length; i++) {
      existing[i].parentNode.removeChild(existing[i]);
    }
  }

  function showUnitNameLabels(shell, groupKey) {
    removeUnitNameLabels(shell);
    var svg = shell.querySelector(".cross-tech-chart-svg");
    if (!svg) return;
    var points = svg.querySelectorAll('circle[data-chart-group-key="' + groupKey + '"]');
    if (!points.length) return;

    var svgRect = svg.getBoundingClientRect();
    var shellRect = shell.getBoundingClientRect();
    var viewBox = svg.getAttribute("viewBox").split(" ");
    var vbWidth = parseFloat(viewBox[2]);
    var vbHeight = parseFloat(viewBox[3]);
    var scaleX = svgRect.width / vbWidth;
    var scaleY = svgRect.height / vbHeight;
    var svgOffsetLeft = svgRect.left - shellRect.left;
    var svgOffsetTop = svgRect.top - shellRect.top;

    var pathEl = svg.querySelector('path[data-chart-group-key="' + groupKey + '"]');
    var lineColor = pathEl ? pathEl.getAttribute("stroke") : "#888";

    function complementaryColor(hex) {
      hex = hex.replace("#", "");
      var r = parseInt(hex.substring(0, 2), 16);
      var g = parseInt(hex.substring(2, 4), 16);
      var b = parseInt(hex.substring(4, 6), 16);
      var cr = 255 - r, cg = 255 - g, cb = 255 - b;
      var lum = 0.299 * cr + 0.587 * cg + 0.114 * cb;
      if (lum > 160) {
        var factor = 0.55;
        cr = Math.round(cr * factor);
        cg = Math.round(cg * factor);
        cb = Math.round(cb * factor);
      }
      return "#" + ((1 << 24) + (cr << 16) + (cg << 8) + cb).toString(16).slice(1);
    }

    var labelColor = complementaryColor(lineColor);

    var titleText = (document.getElementById("chart-lightbox-title") || {}).textContent || "";
    var isPureChart = titleText.indexOf("纯") !== -1;
    var highRankThreshold = isPureChart ? 10 : 21;
    var lowRankThreshold = isPureChart ? 3 : 5;

    for (var i = 0; i < points.length; i++) {
      var circle = points[i];
      var unitName = circle.getAttribute("data-unit-name");
      if (!unitName) continue;

      var cx = parseFloat(circle.getAttribute("cx"));
      var cy = parseFloat(circle.getAttribute("cy"));
      var rank = parseInt(circle.getAttribute("data-rank"), 10) || 0;

      var labelEl = document.createElement("span");
      labelEl.className = "cross-tech-unit-name-label";
      labelEl.textContent = unitName;
      labelEl.style.color = labelColor;

      shell.appendChild(labelEl);

      var pixelX = svgOffsetLeft + cx * scaleX;
      var pixelY = svgOffsetTop + cy * scaleY;
      var labelH = labelEl.offsetHeight;
      var labelW = labelEl.offsetWidth;

      var posLeft, posTop;
      if (rank > highRankThreshold) {
        posLeft = pixelX - labelW / 2;
        posTop = pixelY - labelH - 6;
      } else if (rank <= lowRankThreshold) {
        posLeft = pixelX - labelW / 2;
        posTop = pixelY + 8;
      } else {
        posLeft = pixelX + 6;
        posTop = pixelY - labelH / 2;
      }

      if (posLeft + labelW > shellRect.width - 4) {
        posLeft = shellRect.width - labelW - 4;
      }
      if (posLeft < 4) {
        posLeft = 4;
      }
      if (posTop < 4) {
        posTop = 4;
      }
      if (posTop + labelH > shellRect.height - 4) {
        posTop = shellRect.height - labelH - 4;
      }

      labelEl.style.left = posLeft + "px";
      labelEl.style.top = posTop + "px";
    }
  }

  function showModeConflictToast() {
    var existing = document.querySelector(".chart-mode-conflict-toast");
    if (existing) existing.parentNode.removeChild(existing);
    var toast = document.createElement("div");
    toast.className = "chart-mode-conflict-toast";
    toast.textContent = "无法同时启用多条高亮与显示兵种名称";
    dom.chartLightboxBody.appendChild(toast);
    setTimeout(function() {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 2000);
  }

  function enhanceChartLightboxLegend() {
    var shell = dom.chartLightboxBody.querySelector(".cross-tech-chart-shell");
    if (!shell) return;
    var legendItems = shell.querySelectorAll(".cross-tech-chart-legend-item");
    if (!legendItems.length) return;

    var activeGroups = [];
    var showNamesBtn = null;
    var namesVisible = false;

    function updateShowNamesButton() {
      if (activeGroups.length === 1) {
        if (!showNamesBtn) {
          showNamesBtn = document.createElement("div");
          showNamesBtn.className = "cross-tech-show-names-btn";
          showNamesBtn.setAttribute("role", "button");
          showNamesBtn.setAttribute("tabindex", "0");
          showNamesBtn.setAttribute("aria-label", "显示具体兵种名称");
          showNamesBtn.textContent = "显示具体兵种名称";
          showNamesBtn.addEventListener("click", function() {
            if (activeGroups.length > 1) {
              showModeConflictToast();
              return;
            }
            namesVisible = !namesVisible;
            showNamesBtn.classList.toggle("is-active", namesVisible);
            if (namesVisible && activeGroups.length === 1) {
              showUnitNameLabels(shell, activeGroups[0]);
            } else {
              removeUnitNameLabels(shell);
            }
          });
          showNamesBtn.addEventListener("keydown", function(event) {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              showNamesBtn.click();
            }
          });
          dom.chartLightboxBody.appendChild(showNamesBtn);
          showNamesBtn.classList.add("flash-hint");
          setTimeout(function() {
            if (showNamesBtn) showNamesBtn.classList.remove("flash-hint");
          }, 1600);
        }
        showNamesBtn.style.display = "";
        if (namesVisible) {
          showUnitNameLabels(shell, activeGroups[0]);
        }
      } else {
        if (showNamesBtn) showNamesBtn.style.display = "none";
        if (namesVisible) {
          namesVisible = false;
          if (showNamesBtn) showNamesBtn.classList.remove("is-active");
          removeUnitNameLabels(shell);
        }
      }
    }

    for (var i = 0; i < legendItems.length; i++) {
      var item = legendItems[i];
      item.setAttribute("role", "button");
      item.setAttribute("tabindex", "0");
      item.setAttribute("aria-pressed", "false");
      item.setAttribute("aria-label", "高亮显示" + item.textContent.trim());
      item.addEventListener("click", function() {
        var groupKey = this.getAttribute("data-chart-group-key");
        var idx = activeGroups.indexOf(groupKey);
        if (idx !== -1) {
          activeGroups.splice(idx, 1);
        } else {
          activeGroups.push(groupKey);
        }
        applyChartLegendHighlight(shell, activeGroups);
        updateShowNamesButton();
      });
      item.addEventListener("keydown", function(event) {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          this.click();
        }
      });
    }

    applyChartLegendHighlight(shell, []);
    updateShowNamesButton();
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
