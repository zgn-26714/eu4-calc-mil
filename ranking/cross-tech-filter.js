(function(M) {
  var translations = M['data/translations'];
  var GROUP_TRANSLATIONS = translations.GROUP_TRANSLATIONS;

  var UNIT_TYPE_OPTIONS = [
    { value: "Infantry", label: "步兵" },
    { value: "Cavalry", label: "骑兵" },
    { value: "Artillery", label: "炮兵" }
  ];

  var GROUP_OPTIONS = Object.keys(GROUP_TRANSLATIONS).filter(function(k) {
    return k !== "Shared";
  }).map(function(k) {
    return { value: k, label: GROUP_TRANSLATIONS[k] };
  });

  var filterState = {
    selectedTypes: [],
    selectedGroups: []
  };

  function buildMenu(menuEl, options, selectedArr, onChange) {
    menuEl.innerHTML = "";
    for (var i = 0; i < options.length; i++) {
      var opt = options[i];
      var label = document.createElement("label");
      label.className = "cross-tech-filter-option";
      var cb = document.createElement("input");
      cb.type = "checkbox";
      cb.value = opt.value;
      cb.addEventListener("change", (function(val) {
        return function() {
          var idx = selectedArr.indexOf(val);
          if (this.checked && idx === -1) selectedArr.push(val);
          else if (!this.checked && idx !== -1) selectedArr.splice(idx, 1);
          onChange();
        };
      })(opt.value));
      var span = document.createElement("span");
      span.textContent = opt.label;
      label.appendChild(cb);
      label.appendChild(span);
      menuEl.appendChild(label);
    }
  }

  function applyFilter(dom) {
    var tbody = dom.crossTechTbody;
    if (!tbody) return;
    var rows = tbody.querySelectorAll("tr");
    var hasTypeFilter = filterState.selectedTypes.length > 0;
    var hasGroupFilter = filterState.selectedGroups.length > 0;
    var hasFilter = hasTypeFilter || hasGroupFilter;

    var clearBtn = document.getElementById("cross-tech-clear-filter");
    if (clearBtn) {
      clearBtn.style.display = hasFilter ? "" : "none";
    }

    for (var i = 0; i < rows.length; i++) {
      var cells = rows[i].querySelectorAll("td");
      for (var j = 1; j < cells.length; j++) {
        var cell = cells[j];
        var cellType = "";
        var cellGroup = "";
        if (cell.classList.contains("cross-tech-cell-infantry")) cellType = "Infantry";
        else if (cell.classList.contains("cross-tech-cell-cavalry")) cellType = "Cavalry";
        else if (cell.classList.contains("cross-tech-cell-artillery")) cellType = "Artillery";

        cellGroup = cell.getAttribute("data-group-key") || "";

        var typeMatch = !hasTypeFilter || filterState.selectedTypes.indexOf(cellType) !== -1;
        var groupMatch = !hasGroupFilter || cellType === "Artillery" || filterState.selectedGroups.indexOf(cellGroup) !== -1;
        var match = typeMatch && groupMatch;

        if (!hasFilter) {
          cell.classList.remove("cross-tech-cell-highlight", "cross-tech-cell-dim");
        } else {
          cell.classList.toggle("cross-tech-cell-highlight", match);
          cell.classList.toggle("cross-tech-cell-dim", !match);
        }
      }
      rows[i].style.display = "";
    }
  }

  function initCrossTechFilter(dom) {
    var typeBtn = document.getElementById("cross-tech-filter-type-btn");
    var typeMenu = document.getElementById("cross-tech-filter-type-menu");
    var groupBtn = document.getElementById("cross-tech-filter-group-btn");
    var groupMenu = document.getElementById("cross-tech-filter-group-menu");
    var clearBtn = document.getElementById("cross-tech-clear-filter");

    buildMenu(typeMenu, UNIT_TYPE_OPTIONS, filterState.selectedTypes, function() {
      applyFilter(dom);
    });
    buildMenu(groupMenu, GROUP_OPTIONS, filterState.selectedGroups, function() {
      applyFilter(dom);
    });

    typeBtn.addEventListener("click", function(e) {
      e.stopPropagation();
      groupMenu.style.display = "none";
      typeMenu.style.display = typeMenu.style.display === "none" ? "" : "none";
    });
    groupBtn.addEventListener("click", function(e) {
      e.stopPropagation();
      typeMenu.style.display = "none";
      groupMenu.style.display = groupMenu.style.display === "none" ? "" : "none";
    });

    document.addEventListener("click", function() {
      typeMenu.style.display = "none";
      groupMenu.style.display = "none";
    });
    typeMenu.addEventListener("click", function(e) { e.stopPropagation(); });
    groupMenu.addEventListener("click", function(e) { e.stopPropagation(); });

    if (clearBtn) {
      clearBtn.addEventListener("click", function() {
        filterState.selectedTypes = [];
        filterState.selectedGroups = [];
        var cbs = typeMenu.querySelectorAll("input[type='checkbox']");
        for (var i = 0; i < cbs.length; i++) cbs[i].checked = false;
        cbs = groupMenu.querySelectorAll("input[type='checkbox']");
        for (var i = 0; i < cbs.length; i++) cbs[i].checked = false;
        applyFilter(dom);
      });
    }
  }

  M['ranking/cross-tech-filter'] = {
    initCrossTechFilter: initCrossTechFilter,
    applyFilter: applyFilter,
    filterState: filterState
  };
})(window._M = window._M || {});