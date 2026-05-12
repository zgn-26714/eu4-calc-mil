(function(M) {
  var constantsModule = M['data/constants'];
  var CROSS_TECH_COLORS = constantsModule.CROSS_TECH_COLORS;

  var uiHelpers = M['shared/ui-helpers'];
  var translateGroup = uiHelpers.translateGroup;
  var translateUnit = uiHelpers.translateUnit;
  var stripParenthetical = uiHelpers.stripParenthetical;
  var cloneDataShallow = uiHelpers.cloneDataShallow;

  var rankingLogic = M['ranking/logic'];
  var listTournamentCandidates = rankingLogic.listTournamentCandidates;
  var runUnitTournament = rankingLogic.runUnitTournament;
  var cloneCombatantFromTemplate = rankingLogic.cloneCombatantFromTemplate;

  function buildCrossTechTemplateKey(template, battleOptions) {
    return JSON.stringify({
      template: template,
      battleOptions: battleOptions
    });
  }

  function runCrossTechRanking(template, battleOptions, onProgress, onComplete, state) {
    var templateKey = buildCrossTechTemplateKey(template, battleOptions);
    if (state.crossTechData && state.latestCrossTechTemplateKey === templateKey) {
      if (onComplete) onComplete(state.crossTechData);
      return;
    }

    var workingTemplate = cloneDataShallow(template);
    var results = [];
    var maxCols = 0;

    function processNext(index) {
      try {
        if (index >= 33) {
          state.crossTechData = { results: results, maxCols: maxCols, templateKey: templateKey };
          state.latestCrossTechTemplateKey = templateKey;
          if (onComplete) onComplete(state.crossTechData);
          return;
        }

        workingTemplate.techLevel = index;
        var candidates = listTournamentCandidates(index);
        if (candidates.length >= 2) {
          var result = runUnitTournament(workingTemplate, battleOptions);
          results.push({ techLevel: index, rankings: result.rankings });
          if (result.rankings.length > maxCols) maxCols = result.rankings.length;
        }
        if (onProgress) onProgress(index + 1, candidates.length);
      } catch (e) {
        // skip tech levels that fail
        if (onProgress) onProgress(index + 1, 0);
      }

      if (index % 4 === 3) {
        setTimeout(function() { processNext(index + 1); }, 0);
      } else {
        processNext(index + 1);
      }
    }

    processNext(0);
  }

  function buildGroupPeakSeries(results, primaryUnitType, includeArtillery, recomputeFilteredRanks) {
    var groupRanks = {};
    var groupOrder = [];
    includeArtillery = includeArtillery !== false;
    recomputeFilteredRanks = !!recomputeFilteredRanks;

    for (var i = 0; i < results.length; i++) {
      var row = results[i];
      var techRanks = {};
      var techUnitNames = {};
      var filteredEntries = [];

      for (var j = 0; j < row.rankings.length; j++) {
        var entry = row.rankings[j];
        var candidate = entry.candidate;
        if (candidate.unitType !== primaryUnitType && !(includeArtillery && candidate.unitType === "Artillery")) continue;
        filteredEntries.push(entry);
      }

      if (recomputeFilteredRanks) {
        var seenGroups = {};
        var deduped = [];
        for (j = 0; j < filteredEntries.length; j++) {
          entry = filteredEntries[j];
          candidate = entry.candidate;
          var groupKey = candidate.unitType === "Artillery" ? "Shared" : candidate.group;
          if (seenGroups[groupKey]) continue;
          seenGroups[groupKey] = true;
          deduped.push(entry);
        }
        for (j = 0; j < deduped.length; j++) {
          entry = deduped[j];
          candidate = entry.candidate;
          var gk2 = candidate.unitType === "Artillery" ? "Shared" : candidate.group;
          techRanks[gk2] = j + 1;
          techUnitNames[gk2] = stripParenthetical(translateUnit(candidate.unitName));
        }
      } else {
        var seenAll = {};
        var dedupedAll = [];
        for (j = 0; j < row.rankings.length; j++) {
          entry = row.rankings[j];
          candidate = entry.candidate;
          var allKey = candidate.unitType === "Artillery" ? "Artillery|Shared" : candidate.unitType + "|" + candidate.group;
          if (seenAll[allKey]) continue;
          seenAll[allKey] = true;
          dedupedAll.push(entry);
        }
        for (j = 0; j < dedupedAll.length; j++) {
          entry = dedupedAll[j];
          candidate = entry.candidate;
          if (candidate.unitType !== primaryUnitType && !(includeArtillery && candidate.unitType === "Artillery")) continue;
          var gk3 = candidate.unitType === "Artillery" ? "Shared" : candidate.group;
          techRanks[gk3] = j + 1;
          techUnitNames[gk3] = stripParenthetical(translateUnit(candidate.unitName));
        }
      }

      var keys = Object.keys(techRanks);
      for (var k = 0; k < keys.length; k++) {
        var gk = keys[k];
        if (!groupRanks[gk]) {
          groupRanks[gk] = [];
          groupOrder.push(gk);
        }
        groupRanks[gk].push({ techLevel: row.techLevel, rank: techRanks[gk], unitName: techUnitNames[gk] });
      }
    }

    groupOrder.sort(function(left, right) {
      if (left === "Shared") return 1;
      if (right === "Shared") return -1;
      return translateGroup(left).localeCompare(translateGroup(right));
    });

    return {
      groups: groupOrder.map(function(groupKey, index) {
        return {
          key: groupKey,
          label: groupKey === "Shared" ? "通用炮兵" : translateGroup(groupKey),
          color: CROSS_TECH_COLORS[index % CROSS_TECH_COLORS.length],
          points: groupRanks[groupKey]
        };
      })
    };
  }


  function buildCrossTechGroupTableRows(results) {
    var tableRows = [];
    var maxCols = 0;

    for (var i = 0; i < results.length; i++) {
      var rankingRow = results[i];
      var seenEntries = {};
      var rankedGroups = [];

      for (var j = 0; j < rankingRow.rankings.length; j++) {
        var entry = rankingRow.rankings[j];
        var candidate = entry.candidate;
        var entryKey;
        if (candidate.unitType === "Artillery") {
          entryKey = "Artillery|Shared";
        } else {
          entryKey = candidate.unitType + "|" + candidate.group;
        }
        if (seenEntries[entryKey]) continue;
        seenEntries[entryKey] = true;
        rankedGroups.push({
          label: candidate.unitType === "Artillery" ? "炮兵" : stripParenthetical(translateGroup(candidate.group)),
          sublabel: stripParenthetical(translateUnit(candidate.unitName)),
          unitType: candidate.unitType,
          groupKey: candidate.unitType === "Artillery" ? "Shared" : candidate.group
        });
      }

      if (rankedGroups.length > maxCols) maxCols = rankedGroups.length;
      tableRows.push({
        techLevel: rankingRow.techLevel,
        entries: rankedGroups
      });
    }

    return {
      rows: tableRows,
      maxCols: maxCols
    };
  }

  function buildCrossTechUnitTableRows(results) {
    var tableRows = [];
    var maxCols = 0;

    for (var i = 0; i < results.length; i++) {
      var rankingRow = results[i];
      var rankedUnits = [];

      for (var j = 0; j < rankingRow.rankings.length; j++) {
        var entry = rankingRow.rankings[j];
        var candidate = entry.candidate;
        rankedUnits.push({
          label: stripParenthetical(translateUnit(candidate.unitName)),
          sublabel: candidate.unitType === "Artillery" ? "炮兵" : stripParenthetical(translateGroup(candidate.group)),
          unitType: candidate.unitType,
          groupKey: candidate.unitType === "Artillery" ? "Shared" : candidate.group
        });
      }

      if (rankedUnits.length > maxCols) maxCols = rankedUnits.length;
      tableRows.push({
        techLevel: rankingRow.techLevel,
        entries: rankedUnits
      });
    }

    return {
      rows: tableRows,
      maxCols: maxCols
    };
  }

  function buildCrossTechTableRows(results, crossTechTableMode) {
    return crossTechTableMode === "unit" ? buildCrossTechUnitTableRows(results) : buildCrossTechGroupTableRows(results);
  }

  M['ranking/cross-tech-logic'] = {
    runCrossTechRanking: runCrossTechRanking,
    buildGroupPeakSeries: buildGroupPeakSeries,
    buildCrossTechGroupTableRows: buildCrossTechGroupTableRows,
    buildCrossTechUnitTableRows: buildCrossTechUnitTableRows,
    buildCrossTechTableRows: buildCrossTechTableRows
  };
})(window._M = window._M || {});
