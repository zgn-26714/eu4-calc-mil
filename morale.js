// =============================================================================
// morale.js -- EU4 陆战士气损失计算模块
// 纯计算逻辑，不依赖 DOM。
// 依赖 calc.js（computeBaseCasualties, computeMultipliers, techModifier,
//              baseTactics, percentMultiplier, lookupUnit）
// 和 unit-data.js（UNIT_DATA）。
// =============================================================================

/**
 * 计算最终最大士气值（科技基础士气乘以所有百分比加成后的值）。
 *
 * @param {number}  techLevel       - 军事科技等级，用于查表得到基础士气
 * @param {number}  extraMorale     - 额外士气百分比加成（%，如理念/事件等）
 * @param {number}  armyTradition   - 陆军传统 (0-100)，每点 +0.25%
 * @param {number}  prestige        - 威望 (-100 到 100)，正值每点 +0.1%，负值每点 -0.1%
 * @param {number}  powerProjection - 强权投影 (0-100)，每点 +0.1%
 * @param {boolean} advisorBonus    - 是否有士气顾问 (+10%)
 * @param {boolean} goldenAge       - 是否处于黄金时代 (+10%)
 * @param {number}  otherModifiers  - 其他修正（%，如理念/政策/宗教等），默认 0
 * @returns {number} 最终最大士气值
 */
function computeMaxMorale(techLevel, extraMorale, armyTradition, prestige, powerProjection, advisorBonus, goldenAge, otherModifiers) {
  var moraleBase = baseMorale(techLevel || 0);
  var mult = 1.0;
  mult += (extraMorale || 0) / 100;              // 额外士气百分比加成
  mult += (armyTradition || 0) * 0.0025;        // 陆军传统：100 点 = +25%
  mult += (prestige || 0) * 0.001;              // 威望：+100 = +10%，-100 = -10%
  mult += (powerProjection || 0) * 0.001;       // 强权投影：100 点 = +10%
  if (advisorBonus) mult += 0.10;               // 士气顾问：+10%
  if (goldenAge) mult += 0.10;                  // 黄金时代：+10%
  mult += (otherModifiers || 0) / 100;          // 其他百分比修正
  return moraleBase * mult;
}

/**
 * 计算被动士气损耗（所有参战团每天承受）。
 * 公式：1% × 敌方平均最大士气
 * 职业度 >= 100 时减免 50%（仅后备部队，当前模型所有团都视为已部署，统一用 1%）。
 *
 * @param {number} enemyAvgMorale   - 敌方平均最大士气
 * @param {number} professionalism  - 己方职业度 (0-100)
 * @returns {number} 每日被动士气损耗（绝对士气值）
 */
function computePassiveMoraleLoss(enemyAvgMorale, professionalism) {
  var reduction = (professionalism || 0) >= 100 ? 0.5 : 0.0;
  return 0.01 * enemyAvgMorale * (1 - reduction);
}

/**
 * 计算单方向士气损失（攻击方对防守方造成的士气损失）。
 * 士气损失与兵员伤害采用相同的基础伤亡和基础乘数（但使用不同的点数：
 * 士气损失使用阶段进攻/防御点数 + 士气进攻/防御点数之和）。
 * 区别在于多了 (己方最大士气 / 540) 因子，以及后排炮兵士气损失为 40% 而非 50%。
 *
 * @param {Object}  attacker         - 攻击方配置（需包含 morale 相关字段）
 * @param {Object}  defender         - 防守方配置（需包含 morale 相关字段）
 * @param {string}  phase            - 阶段 "fire" 或 "shock"
 * @param {number}  dice             - 骰子点数 (0-9)
 * @param {number}  leaderDiff       - 将领差额
 * @param {number}  terrainPenalty   - 地形惩罚（仅对攻击方侧）
 * @param {boolean} backrowArtillery - 后排炮兵标记
 * @param {number}  battleDay        - 当前战斗天数（影响乘数）
 * @param {number}  [defProfessionalism] - 防守方职业度（用于被动士气损耗），默认 0
 * @returns {Object} { moraleDamage, passiveMoraleLoss }
 *   moraleDamage      - 直接士气损失
 *   passiveMoraleLoss - 防守方后备部队该日被动损耗（仅后备部队承受）
 */
function computeMoraleDamage(attacker, defender, phase, dice, leaderDiff, terrainPenalty, backrowArtillery, battleDay, defProfessionalism) {
  var attackerUnit = lookupUnit(attacker.group, attacker.unitType, attacker.unitName);
  var defenderUnit = lookupUnit(defender.group, defender.unitType, defender.unitName);

  var attackerPips = (attackerUnit.moraleOff || 0) + (phase === "fire" ? attackerUnit.fireOff : attackerUnit.shockOff);
  var defenderPips = (defenderUnit.moraleDef || 0) + (phase === "fire" ? defenderUnit.fireDef : defenderUnit.shockDef);

  var baseCas = computeBaseCasualties(dice, leaderDiff, attackerPips, defenderPips, terrainPenalty);

  var phaseDamage = 0;
  if (phase === "fire") {
    if (attacker.unitType === "Infantry") phaseDamage = (attacker.fireDamageInfantry || attacker.fireDamage || 0);
    else if (attacker.unitType === "Cavalry") phaseDamage = (attacker.fireDamageCavalry || attacker.fireDamage || 0);
    else if (attacker.unitType === "Artillery") phaseDamage = (attacker.fireDamageArtillery || attacker.fireDamage || 0);
  } else {
    if (attacker.unitType === "Infantry") phaseDamage = (attacker.shockDamageInfantry || attacker.shockDamage || 0);
    else if (attacker.unitType === "Cavalry") phaseDamage = (attacker.shockDamageCavalry || attacker.shockDamage || 0);
    else if (attacker.unitType === "Artillery") phaseDamage = (attacker.shockDamageArtillery || attacker.shockDamage || 0);
  }
  var professionalismBonus = professionalismPhaseDamageBonus(attacker.professionalism || 0);
  var tech = (techModifier(attacker.techLevel, attacker.unitType, phase) + phaseDamage) * percentMultiplier(professionalismBonus);
  var tactics = (baseTactics(defender.techLevel) + (defender.extraMilitaryTactics || 0)) *
    percentMultiplier(defender.discipline || 0);

  // 基础乘数：与兵员伤害共用
  var combatAbility = attacker.combatAbility || 0;
  if (attacker.unitType === "Infantry") combatAbility = attacker.combatAbilityInfantry || combatAbility;
  else if (attacker.unitType === "Cavalry") combatAbility = attacker.combatAbilityCavalry || combatAbility;
  else if (attacker.unitType === "Artillery") combatAbility = attacker.combatAbilityArtillery || combatAbility;
  var baseMult = computeMultipliers(
    attacker.strength, tech, tactics,
    combatAbility,
    attacker.discipline || 0,
    battleDay || 0
  );

  // 士气损失 = 基础伤亡 × 基础乘数 × 士气损失修正 × 士气承受伤害修正 × (己方最大士气 / 540)
  var moraleDmg = baseCas * baseMult *
    percentMultiplier(attacker.moraleDamageDone || 0) *
    percentMultiplier(defender.moraleDamageTaken || 0) *
    ((attacker.maxMorale || 3.0) / 540);

  // 后排炮兵士气损失减免：40%
  if (backrowArtillery && attacker.unitType === "Artillery") {
    moraleDmg *= 0.4;
  }

  // 被动士气损耗（仅防守方后备部队承受）
  var passiveLoss = computePassiveMoraleLoss(attacker.maxMorale || 3.0, defProfessionalism || 0);

  return {
    moraleDamage: moraleDmg,
    passiveMoraleLoss: passiveLoss
  };
}

/**
 * 估算士气归零的团数。
 * 当团当前士气因伤害降至 0 时，该团溃败/撤退。
 *
 * @param {number} currentMorale - 团当前士气值
 * @param {number} maxMorale     - 团最大士气值
 * @param {number} moraleDamage  - 本次士气损失
 * @param {number} regimentCount - 总团数
 * @returns {Object} { regimentsBroken, remainingMorale, moralePercent }
 */
function computeMoraleBreak(currentMorale, maxMorale, moraleDamage, regimentCount) {
  var newMorale = Math.max(0, currentMorale - moraleDamage);
  var moraleLoss = maxMorale - newMorale;
  var broken = Math.min(Math.floor(moraleLoss / maxMorale * regimentCount), regimentCount || 0);
  var moralePercent = maxMorale > 0 ? (newMorale / maxMorale * 100) : 0;

  return {
    regimentsBroken: broken,
    remainingMorale: newMorale,
    moralePercent: moralePercent
  };
}

// =============================================================================
// 多轮战斗模拟（含士气计算）
// =============================================================================

/**
 * 生成 0-9 随机骰子。
 */
function randomDiceMorale() {
  return Math.floor(Math.random() * 10);
}

/**
 * 模拟多轮 EU4 陆战，包含兵员伤害和士气损失。
 *
 * 在每天计算兵员伤害的同时计算士气损失，士气计算特点：
 *   - 使用 moraleOff + fireOff / moraleDef + fireDef（而非纯 fire/shock pips）
 *   - 有 (maxMorale / 540) 因子
 *   - 后排炮兵士气损失为 40%（vs 兵员伤害的 50%）
 *   - 有被动士气损耗（当前仅计算并展示，不计入总士气）
 *   - 士气降到 0 的团会溃败/撤退
 *
 * @param {Object}  attacker         - 攻击方配置（需含士气字段）
 * @param {Object}  defender         - 防守方配置（需含士气字段）
 * @param {number}  rounds           - 模拟轮数
 * @param {Object}  diceConfig       - 骰子配置 { fire: number[]|null, shock: number[]|null }
 * @param {number}  leaderDiff       - 将领差额
 * @param {number}  terrainPenalty   - 地形惩罚
 * @param {boolean} backrowArtillery - 后排炮兵半伤
 * @param {string}  [phaseOnly]      - 'fire' / 'shock' / null=交替
 * @returns {Object} 模拟结果（含兵力和士气数据）
 */
function simulateBattleWithMorale(attacker, defender, rounds, diceConfig, leaderDiff, terrainPenalty, backrowArtillery, phaseOnly) {
  diceConfig = diceConfig || {};
  phaseOnly = phaseOnly || null;

  // ---- 计算双方最大士气 ----
  var attMaxMoralePerReg = computeMaxMorale(
    attacker.techLevel || 0, attacker.moraleBonus || 0, attacker.armyTradition || 0, attacker.prestige || 0
  );
  var defMaxMoralePerReg = computeMaxMorale(
    defender.techLevel || 0, defender.moraleBonus || 0, defender.armyTradition || 0, defender.prestige || 0
  );

  // 用计算后的最大士气替换原始士气字段，供士气损失计算使用
  var attBase = {};
  var defBase = {};
  var aKeys = Object.keys(attacker);
  var dKeys = Object.keys(defender);
  for (var ki = 0; ki < aKeys.length; ki++) { attBase[aKeys[ki]] = attacker[aKeys[ki]]; }
  for (ki = 0; ki < dKeys.length; ki++) { defBase[dKeys[ki]] = defender[dKeys[ki]]; }
  attBase.maxMorale = attMaxMoralePerReg;
  defBase.maxMorale = defMaxMoralePerReg;

  // 团数估算：1 团 ≈ 1000 兵力
  var attRegiments = Math.max(1, Math.round(attacker.strength / 1000));
  var defRegiments = Math.max(1, Math.round(defender.strength / 1000));

  var attTotalMaxMorale = attMaxMoralePerReg * attRegiments;
  var defTotalMaxMorale = defMaxMoralePerReg * defRegiments;

  var attStrength = attacker.strength;
  var defStrength = defender.strength;
  var initialAttStrength = attacker.strength;
  var initialDefStrength = defender.strength;

  var attCurrentMorale = attTotalMaxMorale;
  var defCurrentMorale = defTotalMaxMorale;
  var initialAttMorale = attTotalMaxMorale;
  var initialDefMorale = defTotalMaxMorale;

  var attProfessionalism = attacker.professionalism || 0;
  var defProfessionalism = defender.professionalism || 0;

  var battleDay = 1;

  function phaseLeaderDiff(phase) {
    if ((attacker.leaderFire !== undefined || defender.leaderFire !== undefined) && phase === "fire") {
      return Math.max(0, (attacker.leaderFire || 0) - (defender.leaderFire || 0));
    }
    if ((attacker.leaderShock !== undefined || defender.leaderShock !== undefined) && phase === "shock") {
      return Math.max(0, (attacker.leaderShock || 0) - (defender.leaderShock || 0));
    }
    return Math.max(0, leaderDiff);
  }
  var roundResults = [];
  var annihilated = null;   // 'attacker' | 'defender' | null
  var moraleBroken = null;  // 'attacker' | 'defender' | null
  var attackerMoraleBreakDay = null;
  var defenderMoraleBreakDay = null;

  function makeState(base, str) {
    var s = {};
    var keys = Object.keys(base);
    for (var i = 0; i < keys.length; i++) { s[keys[i]] = base[keys[i]]; }
    s.strength = str;
    return s;
  }

  function updateMoraleBreakDays(day) {
    if (attackerMoraleBreakDay === null && attCurrentMorale <= 0) {
      attackerMoraleBreakDay = day;
    }
    if (defenderMoraleBreakDay === null && defCurrentMorale <= 0) {
      defenderMoraleBreakDay = day;
    }
    if (!moraleBroken) {
      if (attackerMoraleBreakDay !== null && defenderMoraleBreakDay !== null) {
        moraleBroken = 'both';
      } else if (attackerMoraleBreakDay !== null) {
        moraleBroken = 'attacker';
      } else if (defenderMoraleBreakDay !== null) {
        moraleBroken = 'defender';
      }
    }
  }

  for (var r = 0; r < rounds && !annihilated && !moraleBroken; r++) {
    var fireDiceArrAtt = diceConfig.fireAtt || diceConfig.fire;
    var fireDiceArrDef = diceConfig.fireDef || diceConfig.fire;
    var shockDiceArrAtt = diceConfig.shockAtt || diceConfig.shock;
    var shockDiceArrDef = diceConfig.shockDef || diceConfig.shock;
    var isFixed = diceConfig.mode === 'fixed';
    var attFd, defFd, attSd, defSd;
    if (phaseOnly === 'shock') {
      attFd = null; defFd = null;
    } else if (isFixed) {
      attFd = diceConfig.value; defFd = diceConfig.value;
    } else if (fireDiceArrAtt && fireDiceArrAtt[r] !== undefined) {
      attFd = fireDiceArrAtt[r];
      defFd = (fireDiceArrDef && fireDiceArrDef[r] !== undefined) ? fireDiceArrDef[r] : attFd;
    } else {
      attFd = randomDiceMorale(); defFd = randomDiceMorale();
    }
    if (phaseOnly === 'fire') {
      attSd = null; defSd = null;
    } else if (isFixed) {
      attSd = diceConfig.value; defSd = diceConfig.value;
    } else if (shockDiceArrAtt && shockDiceArrAtt[r] !== undefined) {
      attSd = shockDiceArrAtt[r];
      defSd = (shockDiceArrDef && shockDiceArrDef[r] !== undefined) ? shockDiceArrDef[r] : attSd;
    } else {
      attSd = randomDiceMorale(); defSd = randomDiceMorale();
    }

    var roundResult = {
      round: r + 1,
      fire: null,
      shock: null
    };

    // ---- 火力阶段 (3 天) ----
    if (attFd !== null) {
      var fireDays = [];
      var fireAttStrLoss = 0, fireDefStrLoss = 0;
      var fireAttMorLoss = 0, fireDefMorLoss = 0;

      for (var d = 0; d < 3 && !annihilated && !moraleBroken; d++) {
        var attState = makeState(attBase, attStrength);
        var defState = makeState(defBase, defStrength);
        var fireLeaderDiff = phaseLeaderDiff('fire');
        var defenderFireLeaderDiff = Math.max(0, -leaderDiff);
        if (attacker.leaderFire !== undefined || defender.leaderFire !== undefined) {
          defenderFireLeaderDiff = Math.max(0, (defender.leaderFire || 0) - (attacker.leaderFire || 0));
        }

        // ---- 兵员伤害 ----
        var a2d = computeOneWay(attState, defState, 'fire', attFd, fireLeaderDiff, terrainPenalty, backrowArtillery, battleDay);
        var d2a = computeOneWay(defState, attState, 'fire', defFd, defenderFireLeaderDiff, 0, backrowArtillery, battleDay);

        var aStrLoss = Math.min(attStrength, d2a.damage);
        var dStrLoss = Math.min(defStrength, a2d.damage);

        // ---- 士气损失 ----
        var a2dMorale = computeMoraleDamage(attState, defState, 'fire', attFd, fireLeaderDiff, terrainPenalty, backrowArtillery, battleDay, defProfessionalism);
        var d2aMorale = computeMoraleDamage(defState, attState, 'fire', defFd, defenderFireLeaderDiff, 0, backrowArtillery, battleDay, attProfessionalism);

        var aMorLoss = Math.min(attCurrentMorale, d2aMorale.moraleDamage);
        var dMorLoss = Math.min(defCurrentMorale, a2dMorale.moraleDamage);

        // ---- 应用损伤 ----
        attStrength -= aStrLoss;
        defStrength -= dStrLoss;
        attCurrentMorale -= aMorLoss;
        defCurrentMorale -= dMorLoss;

        // ---- 被动士气损耗（所有参战团每天 1% 敌方平均最大士气）----
        var attPassiveLoss = d2aMorale.passiveMoraleLoss;
        var defPassiveLoss = a2dMorale.passiveMoraleLoss;
        attCurrentMorale = Math.max(0, attCurrentMorale - attPassiveLoss);
        defCurrentMorale = Math.max(0, defCurrentMorale - defPassiveLoss);

        fireAttStrLoss += aStrLoss;
        fireDefStrLoss += dStrLoss;
        fireAttMorLoss += aMorLoss + attPassiveLoss;
        fireDefMorLoss += dMorLoss + defPassiveLoss;

        // 溃败团数
        var attBroken = Math.min(Math.floor(Math.max(0, initialAttMorale - attCurrentMorale) / attMaxMoralePerReg), attRegiments);
        var defBroken = Math.min(Math.floor(Math.max(0, initialDefMorale - defCurrentMorale) / defMaxMoralePerReg), defRegiments);

        fireDays.push({
          day: battleDay,
          attackerStrengthDmg: a2d.damage,
          defenderStrengthDmg: d2a.damage,
          attackerStrengthLoss: aStrLoss,
          defenderStrengthLoss: dStrLoss,
          attackerStrengthRemaining: attStrength,
          defenderStrengthRemaining: defStrength,
          attackerMoraleDmg: a2dMorale.moraleDamage,
          defenderMoraleDmg: d2aMorale.moraleDamage,
          attackerMoraleLoss: aMorLoss,
          defenderMoraleLoss: dMorLoss,
          attackerCurrentMorale: attCurrentMorale,
          defenderCurrentMorale: defCurrentMorale,
          attackerBrokenRegiments: attBroken,
          defenderBrokenRegiments: defBroken,
          attackerPassiveMoraleLoss: attPassiveLoss,
          defenderPassiveMoraleLoss: defPassiveLoss
        });

        var currentDay = battleDay;
        battleDay++;

        if (attStrength <= 0) { annihilated = 'attacker'; break; }
        if (defStrength <= 0) { annihilated = 'defender'; break; }
        updateMoraleBreakDays(currentDay);
        if (moraleBroken) { break; }
      }

      roundResult.fire = {
        dice: attFd,
        attackerDice: attFd,
        defenderDice: defFd,
        attackerStrengthLoss: fireAttStrLoss,
        defenderStrengthLoss: fireDefStrLoss,
        attackerMoraleLoss: fireAttMorLoss,
        defenderMoraleLoss: fireDefMorLoss,
        days: fireDays
      };
    }

    // ---- 冲击阶段 (3 天) ----
    if (attSd !== null && !annihilated && !moraleBroken) {
      var shockDays = [];
      var shockAttStrLoss = 0, shockDefStrLoss = 0;
      var shockAttMorLoss = 0, shockDefMorLoss = 0;

      for (d = 0; d < 3 && !annihilated && !moraleBroken; d++) {
        var attState = makeState(attBase, attStrength);
        var defState = makeState(defBase, defStrength);
        var shockLeaderDiff = phaseLeaderDiff('shock');
        var defenderShockLeaderDiff = Math.max(0, -leaderDiff);
        if (attacker.leaderShock !== undefined || defender.leaderShock !== undefined) {
          defenderShockLeaderDiff = Math.max(0, (defender.leaderShock || 0) - (attacker.leaderShock || 0));
        }

        // ---- 兵员伤害 ----
        var a2d = computeOneWay(attState, defState, 'shock', attSd, shockLeaderDiff, terrainPenalty, backrowArtillery, battleDay);
        var d2a = computeOneWay(defState, attState, 'shock', defSd, defenderShockLeaderDiff, 0, backrowArtillery, battleDay);

        var aStrLoss = Math.min(attStrength, d2a.damage);
        var dStrLoss = Math.min(defStrength, a2d.damage);

        // ---- 士气损失 ----
        var a2dMorale = computeMoraleDamage(attState, defState, 'shock', attSd, shockLeaderDiff, terrainPenalty, backrowArtillery, battleDay, defProfessionalism);
        var d2aMorale = computeMoraleDamage(defState, attState, 'shock', defSd, defenderShockLeaderDiff, 0, backrowArtillery, battleDay, attProfessionalism);

        var aMorLoss = Math.min(attCurrentMorale, d2aMorale.moraleDamage);
        var dMorLoss = Math.min(defCurrentMorale, a2dMorale.moraleDamage);

        // ---- 应用损伤 ----
        attStrength -= aStrLoss;
        defStrength -= dStrLoss;
        attCurrentMorale -= aMorLoss;
        defCurrentMorale -= dMorLoss;

        // ---- 被动士气损耗（所有参战团每天 1% 敌方平均最大士气）----
        var attPassiveLoss = d2aMorale.passiveMoraleLoss;
        var defPassiveLoss = a2dMorale.passiveMoraleLoss;
        attCurrentMorale = Math.max(0, attCurrentMorale - attPassiveLoss);
        defCurrentMorale = Math.max(0, defCurrentMorale - defPassiveLoss);

        shockAttStrLoss += aStrLoss;
        shockDefStrLoss += dStrLoss;
        shockAttMorLoss += aMorLoss + attPassiveLoss;
        shockDefMorLoss += dMorLoss + defPassiveLoss;

        var attBroken = Math.min(Math.floor(Math.max(0, initialAttMorale - attCurrentMorale) / attMaxMoralePerReg), attRegiments);
        var defBroken = Math.min(Math.floor(Math.max(0, initialDefMorale - defCurrentMorale) / defMaxMoralePerReg), defRegiments);

        shockDays.push({
          day: battleDay,
          attackerStrengthDmg: a2d.damage,
          defenderStrengthDmg: d2a.damage,
          attackerStrengthLoss: aStrLoss,
          defenderStrengthLoss: dStrLoss,
          attackerStrengthRemaining: attStrength,
          defenderStrengthRemaining: defStrength,
          attackerMoraleDmg: a2dMorale.moraleDamage,
          defenderMoraleDmg: d2aMorale.moraleDamage,
          attackerMoraleLoss: aMorLoss,
          defenderMoraleLoss: dMorLoss,
          attackerCurrentMorale: attCurrentMorale,
          defenderCurrentMorale: defCurrentMorale,
          attackerBrokenRegiments: attBroken,
          defenderBrokenRegiments: defBroken,
          attackerPassiveMoraleLoss: attPassiveLoss,
          defenderPassiveMoraleLoss: defPassiveLoss
        });

        var currentDay = battleDay;
        battleDay++;

        if (attStrength <= 0) { annihilated = 'attacker'; break; }
        if (defStrength <= 0) { annihilated = 'defender'; break; }
        updateMoraleBreakDays(currentDay);
        if (moraleBroken) { break; }
      }

      roundResult.shock = {
        dice: attSd,
        attackerDice: attSd,
        defenderDice: defSd,
        attackerStrengthLoss: shockAttStrLoss,
        defenderStrengthLoss: shockDefStrLoss,
        attackerMoraleLoss: shockAttMorLoss,
        defenderMoraleLoss: shockDefMorLoss,
        days: shockDays
      };
    }

    roundResults.push(roundResult);
  }

  // ---- 汇总 ----
  var totalAttStrLoss = initialAttStrength - attStrength;
  var totalDefStrLoss = initialDefStrength - defStrength;
  var totalAttMorLoss = initialAttMorale - attCurrentMorale;
  var totalDefMorLoss = initialDefMorale - defCurrentMorale;

  var winner = null;
  if (annihilated === 'attacker' || moraleBroken === 'attacker') {
    winner = 'defender';
  } else if (annihilated === 'defender' || moraleBroken === 'defender') {
    winner = 'attacker';
  } else if (moraleBroken === 'both') {
    winner = 'draw';
  } else if (totalDefStrLoss > totalAttStrLoss) {
    winner = 'attacker';
  } else if (totalAttStrLoss > totalDefStrLoss) {
    winner = 'defender';
  } else {
    winner = 'draw';
  }

  var winReason = '';
  if (annihilated) {
    winReason = (annihilated === 'attacker' ? '攻方' : '守方') + '被全歼';
  } else if (moraleBroken === 'both') {
    winReason = '双方同日士气崩溃';
  } else if (moraleBroken) {
    winReason = (moraleBroken === 'attacker' ? '攻方' : '守方') + '士气崩溃';
  }

  return {
    rounds: roundResults,
    initialAttackerStrength: initialAttStrength,
    initialDefenderStrength: initialDefStrength,
    finalAttackerStrength: Math.max(0, attStrength),
    finalDefenderStrength: Math.max(0, defStrength),
    totalAttackerStrengthLoss: totalAttStrLoss,
    totalDefenderStrengthLoss: totalDefStrLoss,
    initialAttackerMorale: initialAttMorale,
    initialDefenderMorale: initialDefMorale,
    finalAttackerMorale: Math.max(0, attCurrentMorale),
    finalDefenderMorale: Math.max(0, defCurrentMorale),
    totalAttackerMoraleLoss: totalAttMorLoss,
    totalDefenderMoraleLoss: totalDefMorLoss,
    attMaxMoralePerRegiment: attMaxMoralePerReg,
    defMaxMoralePerRegiment: defMaxMoralePerReg,
    attRegiments: attRegiments,
    defRegiments: defRegiments,
    totalDays: battleDay - 1,
    winner: winner,
    winReason: winReason,
    annihilated: annihilated,
    moraleBroken: moraleBroken,
    attackerMoraleBreakDay: attackerMoraleBreakDay,
    defenderMoraleBreakDay: defenderMoraleBreakDay
  };
}
