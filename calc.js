// =============================================================================
// calc.js -- EU4 陆战伤害计算核心模块
// 纯计算逻辑，不依赖 DOM，仅依赖 UNIT_DATA (由 unit-data.js 提供)。
// =============================================================================

// 数据来源：EU4 英文 wiki — Template:Cumulative mil tech（当前版本，1.31+ 更新）
// https://eu4.paradoxwikis.com/Template:Cumulative_mil_tech
const TECH_STATS = [
  // Lv  infantryFire cavalryFire artilleryFire infantryShock cavalryShock artilleryShock militaryTactics
  { infantryFire: 0.25, cavalryFire: 0.0, artilleryFire: 0.0, infantryShock: 0.20, cavalryShock: 0.8, artilleryShock: 0.00, militaryTactics: 0.50 },
  { infantryFire: 0.35, cavalryFire: 0.0, artilleryFire: 0.0, infantryShock: 0.30, cavalryShock: 0.8, artilleryShock: 0.00, militaryTactics: 0.50 },
  { infantryFire: 0.35, cavalryFire: 0.0, artilleryFire: 0.0, infantryShock: 0.50, cavalryShock: 1.0, artilleryShock: 0.00, militaryTactics: 0.50 },
  { infantryFire: 0.35, cavalryFire: 0.0, artilleryFire: 0.0, infantryShock: 0.50, cavalryShock: 1.0, artilleryShock: 0.00, militaryTactics: 0.50 },
  { infantryFire: 0.35, cavalryFire: 0.0, artilleryFire: 0.0, infantryShock: 0.50, cavalryShock: 1.0, artilleryShock: 0.00, militaryTactics: 0.75 },
  { infantryFire: 0.35, cavalryFire: 0.0, artilleryFire: 0.0, infantryShock: 0.65, cavalryShock: 1.2, artilleryShock: 0.00, militaryTactics: 0.75 },
  { infantryFire: 0.55, cavalryFire: 0.0, artilleryFire: 0.0, infantryShock: 0.95, cavalryShock: 1.2, artilleryShock: 0.00, militaryTactics: 1.00 },
  { infantryFire: 0.55, cavalryFire: 0.0, artilleryFire: 1.0, infantryShock: 0.95, cavalryShock: 1.2, artilleryShock: 0.05, militaryTactics: 1.25 },
  { infantryFire: 0.80, cavalryFire: 0.0, artilleryFire: 1.0, infantryShock: 0.95, cavalryShock: 2.0, artilleryShock: 0.05, militaryTactics: 1.25 },
  { infantryFire: 0.80, cavalryFire: 0.0, artilleryFire: 1.0, infantryShock: 0.95, cavalryShock: 2.0, artilleryShock: 0.05, militaryTactics: 1.50 },
  { infantryFire: 0.80, cavalryFire: 0.0, artilleryFire: 1.0, infantryShock: 0.95, cavalryShock: 2.0, artilleryShock: 0.05, militaryTactics: 1.50 },
  { infantryFire: 0.80, cavalryFire: 0.5, artilleryFire: 1.0, infantryShock: 1.15, cavalryShock: 2.0, artilleryShock: 0.05, militaryTactics: 1.50 },
  { infantryFire: 0.80, cavalryFire: 0.5, artilleryFire: 1.0, infantryShock: 1.15, cavalryShock: 2.0, artilleryShock: 0.05, militaryTactics: 1.75 },
  { infantryFire: 0.80, cavalryFire: 0.5, artilleryFire: 1.4, infantryShock: 1.15, cavalryShock: 2.0, artilleryShock: 0.15, militaryTactics: 1.75 },
  { infantryFire: 1.10, cavalryFire: 0.5, artilleryFire: 1.4, infantryShock: 1.15, cavalryShock: 2.0, artilleryShock: 0.15, militaryTactics: 1.75 },
  { infantryFire: 1.10, cavalryFire: 0.5, artilleryFire: 1.4, infantryShock: 1.15, cavalryShock: 2.0, artilleryShock: 0.15, militaryTactics: 2.00 },
  { infantryFire: 1.10, cavalryFire: 0.5, artilleryFire: 2.4, infantryShock: 1.15, cavalryShock: 2.0, artilleryShock: 0.25, militaryTactics: 2.00 },
  { infantryFire: 1.10, cavalryFire: 0.5, artilleryFire: 2.4, infantryShock: 1.15, cavalryShock: 3.0, artilleryShock: 0.25, militaryTactics: 2.00 },
  { infantryFire: 1.10, cavalryFire: 0.5, artilleryFire: 2.4, infantryShock: 1.15, cavalryShock: 3.0, artilleryShock: 0.25, militaryTactics: 2.00 },
  { infantryFire: 1.10, cavalryFire: 0.5, artilleryFire: 2.4, infantryShock: 1.15, cavalryShock: 3.0, artilleryShock: 0.25, militaryTactics: 2.25 },
  { infantryFire: 1.60, cavalryFire: 0.5, artilleryFire: 2.4, infantryShock: 1.15, cavalryShock: 3.0, artilleryShock: 0.25, militaryTactics: 2.25 },
  { infantryFire: 1.60, cavalryFire: 0.5, artilleryFire: 2.4, infantryShock: 1.65, cavalryShock: 3.0, artilleryShock: 0.25, militaryTactics: 2.50 },
  { infantryFire: 1.60, cavalryFire: 1.0, artilleryFire: 4.4, infantryShock: 1.65, cavalryShock: 3.0, artilleryShock: 0.35, militaryTactics: 2.50 },
  { infantryFire: 1.60, cavalryFire: 1.0, artilleryFire: 4.4, infantryShock: 1.65, cavalryShock: 4.0, artilleryShock: 0.35, militaryTactics: 2.75 },
  { infantryFire: 1.60, cavalryFire: 1.0, artilleryFire: 4.4, infantryShock: 1.65, cavalryShock: 4.0, artilleryShock: 0.35, militaryTactics: 3.00 },
  { infantryFire: 1.60, cavalryFire: 1.0, artilleryFire: 6.4, infantryShock: 1.65, cavalryShock: 4.0, artilleryShock: 0.45, militaryTactics: 3.00 },
  { infantryFire: 1.60, cavalryFire: 1.0, artilleryFire: 6.4, infantryShock: 1.65, cavalryShock: 4.0, artilleryShock: 0.45, militaryTactics: 3.00 },
  { infantryFire: 2.10, cavalryFire: 1.0, artilleryFire: 6.4, infantryShock: 1.65, cavalryShock: 4.0, artilleryShock: 0.45, militaryTactics: 3.00 },
  { infantryFire: 2.10, cavalryFire: 1.0, artilleryFire: 6.4, infantryShock: 2.15, cavalryShock: 4.0, artilleryShock: 0.45, militaryTactics: 3.00 },
  { infantryFire: 2.10, cavalryFire: 1.0, artilleryFire: 6.4, infantryShock: 2.15, cavalryShock: 4.0, artilleryShock: 0.45, militaryTactics: 3.00 },
  { infantryFire: 2.10, cavalryFire: 1.0, artilleryFire: 6.4, infantryShock: 2.15, cavalryShock: 4.0, artilleryShock: 0.45, militaryTactics: 3.25 },
  { infantryFire: 3.10, cavalryFire: 1.0, artilleryFire: 6.4, infantryShock: 2.15, cavalryShock: 5.0, artilleryShock: 0.45, militaryTactics: 3.25 },
  { infantryFire: 3.10, cavalryFire: 1.0, artilleryFire: 8.4, infantryShock: 2.15, cavalryShock: 5.0, artilleryShock: 0.55, militaryTactics: 3.25 }
];

/**
 * 将百分比数值转换为乘数，例如 +10% 性能变为 1.10。
 */
function percentMultiplier(value) {
  return 1 + value / 100;
}

/**
 * 根据军事科技等级返回基础军事战术值。
 */
function baseTactics(techLevel) {
  return TECH_STATS[techLevel].militaryTactics;
}

/**
 * 根据军事科技等级返回基础士气值。
 * 数据来源：EU4 英文 wiki《Land warfare》中的 “Researching military technology” 条目。
 */
function baseMorale(techLevel) {
  if (techLevel >= 30) return 6.0;
  if (techLevel >= 26) return 5.0;
  if (techLevel >= 15) return 4.0;
  if (techLevel >= 4) return 3.0;
  if (techLevel >= 3) return 2.5;
  return 2.0;
}

/**
 * 根据军事科技等级、兵种类型和阶段返回科技修正系数。
 */
function techModifier(techLevel, unitType, phase) {
  const stats = TECH_STATS[techLevel];
  if (phase === "fire") {
    if (unitType === "Infantry") return stats.infantryFire;
    if (unitType === "Cavalry") return stats.cavalryFire;
    return stats.artilleryFire;
  }
  if (unitType === "Infantry") return stats.infantryShock;
  if (unitType === "Cavalry") return stats.cavalryShock;
  return stats.artilleryShock;
}

/**
 * 在 UNIT_DATA 中查找指定兵种条目。
 */
function lookupUnit(group, unitType, unitName) {
  return UNIT_DATA.find(item => {
    const groupMatch = unitType === "Artillery" ? item.group === "Shared" : item.group === group;
    return groupMatch && item.unitType === unitType && item.unitName === unitName;
  });
}

/**
 * 验证一个数值是否为有限数字，否则抛出错误。
 */
function validateNumber(name, value) {
  if (!Number.isFinite(value)) {
    throw new Error(`${name} 不是有效数字。`);
  }
}

/**
 * 计算基础伤亡值。与兵员伤害、士气损失共用。
 * @param {number} dice - 骰子点数
 * @param {number} leaderDiff - 将领差额
 * @param {number} attackerPips - 攻击方点数
 * @param {number} defenderPips - 防守方点数
 * @param {number} terrainPenalty - 地形惩罚
 * @returns {number}
 */
function computeBaseCasualties(dice, leaderDiff, attackerPips, defenderPips, terrainPenalty) {
  return Math.max(15, 15 + 5 * (dice + leaderDiff + attackerPips - defenderPips - terrainPenalty));
}

/**
 * 计算基础乘数（不含造成伤害修正、承受伤害修正和后排炮兵减半）。
 * 可作为兵员伤害和士气损失的基础乘数。
 * @param {number} strength - 参战兵力
 * @param {number} tech - 科技修正
 * @param {number} tactics - 防守方军事战术
 * @param {number} combatAbility - 作战能力
 * @param {number} discipline - 训练度
 * @param {number} battleDayBonus - 战斗天数加成（%），默认 0
 * @returns {number}
 */
function computeMultipliers(strength, tech, tactics, combatAbility, discipline, battleDayBonus) {
  return (strength / 1000) *
    (tech / tactics) *
    percentMultiplier(combatAbility) *
    percentMultiplier(discipline) *
    percentMultiplier(battleDayBonus || 0);
}

/**
 * 根据职业度返回线性的阶段伤害修正。
 * 满职业度 100 时：
 *   - 火力阶段 +10% land fire damage
 *   - 冲击阶段 +10% shock damage
 *
 * @param {number} professionalism - 职业度 (0-100)
 * @returns {number} 阶段伤害修正（百分比）
 */
function professionalismPhaseDamageBonus(professionalism) {
  var clamped = Math.max(0, Math.min(100, professionalism || 0));
  return clamped * 0.1;
}

/**
 * 计算单方向（攻击方 → 防守方）的兵员伤害。
 *
 * @param {Object} attacker - 攻击方配置
 * @param {Object} defender - 防守方配置
 * @param {string} phase - 阶段 "fire" 或 "shock"
 * @param {number} dice - 骰子点数 (0-9)
 * @param {number} leaderDiff - 将领差额
 * @param {number} terrainPenalty - 地形惩罚
 * @param {boolean} backrowArtillery - 是否启用后排炮兵半伤
 * @param {number} [battleDay] - 战斗天数
 * @returns {Object} { attackerPips, defenderPips, baseCasualties, tech, tactics, damage }
 */
function computeOneWay(attacker, defender, phase, dice, leaderDiff, terrainPenalty, backrowArtillery, battleDay = 0) {
  const attackerUnit = lookupUnit(attacker.group, attacker.unitType, attacker.unitName);
  const defenderUnit = lookupUnit(defender.group, defender.unitType, defender.unitName);

  const attackerPips = phase === "fire" ? attackerUnit.fireOff : attackerUnit.shockOff;
  const defenderPips = phase === "fire" ? defenderUnit.fireDef : defenderUnit.shockDef;
  const baseCasualties = computeBaseCasualties(dice, leaderDiff, attackerPips, defenderPips, terrainPenalty);
  var phaseDamage = 0;
  if (phase === "fire") {
    if (attacker.unitType === "Infantry") phaseDamage = attacker.fireDamageInfantry || attacker.fireDamage || 0;
    else if (attacker.unitType === "Cavalry") phaseDamage = attacker.fireDamageCavalry || attacker.fireDamage || 0;
    else if (attacker.unitType === "Artillery") phaseDamage = attacker.fireDamageArtillery || attacker.fireDamage || 0;
  } else {
    if (attacker.unitType === "Infantry") phaseDamage = attacker.shockDamageInfantry || attacker.shockDamage || 0;
    else if (attacker.unitType === "Cavalry") phaseDamage = attacker.shockDamageCavalry || attacker.shockDamage || 0;
    else if (attacker.unitType === "Artillery") phaseDamage = attacker.shockDamageArtillery || attacker.shockDamage || 0;
  }
  const professionalismBonus = professionalismPhaseDamageBonus(attacker.professionalism);
  const tech = (techModifier(attacker.techLevel, attacker.unitType, phase) + phaseDamage) * percentMultiplier(professionalismBonus);
  const tactics = (baseTactics(defender.techLevel) + defender.extraMilitaryTactics) * percentMultiplier(defender.discipline);

  var damageDonePhase = phase === "fire" ? (attacker.damageDoneFire || attacker.damageDone || 0) : (attacker.damageDoneShock || attacker.damageDone || 0);
  var damageTakenPhase = phase === "fire" ? (defender.damageTakenFire || defender.damageTaken || 0) : (defender.damageTakenShock || defender.damageTaken || 0);
  var combatAbility = attacker.combatAbility || 0;
  if (attacker.unitType === "Infantry") combatAbility = attacker.combatAbilityInfantry || combatAbility;
  else if (attacker.unitType === "Cavalry") combatAbility = attacker.combatAbilityCavalry || combatAbility;
  else if (attacker.unitType === "Artillery") combatAbility = attacker.combatAbilityArtillery || combatAbility;
  let multiplier = computeMultipliers(attacker.strength, tech, tactics, combatAbility, attacker.discipline, battleDay)
    * percentMultiplier(damageDonePhase)
    * percentMultiplier(damageTakenPhase);

  if (backrowArtillery && attacker.unitType === "Artillery") {
    multiplier *= 0.5;
  }

  return {
    attackerPips,
    defenderPips,
    baseCasualties,
    tech,
    tactics,
    professionalismBonus,
    damage: baseCasualties * multiplier
  };
}

// =============================================================================
// 多轮战斗模拟
// =============================================================================

/**
 * 生成 0-9 随机骰子。
 */
function randomDice() {
  return Math.floor(Math.random() * 10);
}

/**
 * 模拟多轮 EU4 陆战。
 *
 * @param {Object}  attacker         - 攻击方配置
 * @param {Object}  defender         - 防守方配置
 * @param {number}  rounds           - 模拟轮数
 * @param {Object}  diceConfig       - 骰子配置
 *   diceConfig.fireAtt:  number[]|null - 攻方每轮火力骰子，null 则随机
 *   diceConfig.fireDef:  number[]|null - 守方每轮火力骰子，null 则随机
 *   diceConfig.shockAtt: number[]|null - 攻方每轮冲击骰子，null 则随机
 *   diceConfig.shockDef: number[]|null - 守方每轮冲击骰子，null 则随机
 *   diceConfig.fire/shock: number[]|null - 兼容旧格式，双方共用
 * @param {number}  leaderDiff       - 将领差额
 * @param {number}  terrainPenalty   - 地形惩罚
 * @param {boolean} backrowArtillery - 后排炮兵半伤
 * @param {string}  [phaseOnly]      - 'fire' 仅火力 / 'shock' 仅冲击 / null 交替
 * @returns {Object} 模拟结果
 */
function simulateBattle(attacker, defender, rounds, diceConfig, leaderDiff, terrainPenalty, backrowArtillery, phaseOnly) {
  diceConfig = diceConfig || {};
  phaseOnly = phaseOnly || null;

  let attStr = attacker.strength;
  let defStr = defender.strength;
  const initialAttacker = attacker.strength;
  const initialDefender = defender.strength;

  var battleDay = 1;
  var roundResults = [];
  var annihilated = null; // 'attacker' | 'defender' | null

  // Every day we pass a mutable snapshot into computeOneWay
  function makeState(base, str) {
    var s = {};
    var keys = Object.keys(base);
    for (var i = 0; i < keys.length; i++) { s[keys[i]] = base[keys[i]]; }
    s.strength = str;
    return s;
  }

  function phaseLeaderDiff(phase) {
    if ((attacker.leaderFire !== undefined || defender.leaderFire !== undefined) && phase === "fire") {
      return Math.max(0, (attacker.leaderFire || 0) - (defender.leaderFire || 0));
    }
    if ((attacker.leaderShock !== undefined || defender.leaderShock !== undefined) && phase === "shock") {
      return Math.max(0, (attacker.leaderShock || 0) - (defender.leaderShock || 0));
    }
    return Math.max(0, leaderDiff);
  }

  for (var r = 0; r < rounds && !annihilated; r++) {
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
      attFd = randomDice(); defFd = randomDice();
    }
    if (phaseOnly === 'fire') {
      attSd = null; defSd = null;
    } else if (isFixed) {
      attSd = diceConfig.value; defSd = diceConfig.value;
    } else if (shockDiceArrAtt && shockDiceArrAtt[r] !== undefined) {
      attSd = shockDiceArrAtt[r];
      defSd = (shockDiceArrDef && shockDiceArrDef[r] !== undefined) ? shockDiceArrDef[r] : attSd;
    } else {
      attSd = randomDice(); defSd = randomDice();
    }

    var roundResult = {
      round: r + 1,
      fire: null,
      shock: null
    };

    // ---- 火力阶段 (3 天) ----
    if (attFd !== null) {
      var fireDays = [];
      var fireAttLoss = 0;
      var fireDefLoss = 0;

      for (var d = 0; d < 3 && !annihilated; d++) {
        var attState = makeState(attacker, attStr);
        var defState = makeState(defender, defStr);
        var fireLeaderDiff = phaseLeaderDiff('fire');
        var defenderFireLeaderDiff = Math.max(0, -leaderDiff);
        if (attacker.leaderFire !== undefined || defender.leaderFire !== undefined) {
          defenderFireLeaderDiff = Math.max(0, (defender.leaderFire || 0) - (attacker.leaderFire || 0));
        }

        var a2d = computeOneWay(attState, defState, 'fire', attFd, fireLeaderDiff, terrainPenalty, backrowArtillery, battleDay);
        var d2a = computeOneWay(defState, attState, 'fire', defFd, defenderFireLeaderDiff, 0, backrowArtillery, battleDay);

        var aLoss = Math.min(attStr, d2a.damage);
        var dLoss = Math.min(defStr, a2d.damage);

        attStr -= aLoss;
        defStr -= dLoss;
        fireAttLoss += aLoss;
        fireDefLoss += dLoss;

        fireDays.push({
          day: battleDay,
          attackerDamage: a2d.damage,
          defenderDamage: d2a.damage,
          attackerLoss: aLoss,
          defenderLoss: dLoss,
          attackerRemaining: attStr,
          defenderRemaining: defStr
        });

        battleDay++;

        if (attStr <= 0) { annihilated = 'attacker'; break; }
        if (defStr <= 0) { annihilated = 'defender'; break; }
      }

      roundResult.fire = {
        dice: attFd,
        attackerDice: attFd,
        defenderDice: defFd,
        attackerLoss: fireAttLoss,
        defenderLoss: fireDefLoss,
        days: fireDays
      };
    }

    // ---- 冲击阶段 (3 天) ----
    if (attSd !== null && !annihilated) {
      var shockDays = [];
      var shockAttLoss = 0;
      var shockDefLoss = 0;

      for (d = 0; d < 3 && !annihilated; d++) {
        var attState = makeState(attacker, attStr);
        var defState = makeState(defender, defStr);
        var shockLeaderDiff = phaseLeaderDiff('shock');
        var defenderShockLeaderDiff = Math.max(0, -leaderDiff);
        if (attacker.leaderShock !== undefined || defender.leaderShock !== undefined) {
          defenderShockLeaderDiff = Math.max(0, (defender.leaderShock || 0) - (attacker.leaderShock || 0));
        }

        var a2d = computeOneWay(attState, defState, 'shock', attSd, shockLeaderDiff, terrainPenalty, backrowArtillery, battleDay);
        var d2a = computeOneWay(defState, attState, 'shock', defSd, defenderShockLeaderDiff, 0, backrowArtillery, battleDay);

        var aLoss = Math.min(attStr, d2a.damage);
        var dLoss = Math.min(defStr, a2d.damage);

        attStr -= aLoss;
        defStr -= dLoss;
        shockAttLoss += aLoss;
        shockDefLoss += dLoss;

        shockDays.push({
          day: battleDay,
          attackerDamage: a2d.damage,
          defenderDamage: d2a.damage,
          attackerLoss: aLoss,
          defenderLoss: dLoss,
          attackerRemaining: attStr,
          defenderRemaining: defStr
        });

        battleDay++;

        if (attStr <= 0) { annihilated = 'attacker'; break; }
        if (defStr <= 0) { annihilated = 'defender'; break; }
      }

      roundResult.shock = {
        dice: attSd,
        attackerDice: attSd,
        defenderDice: defSd,
        attackerLoss: shockAttLoss,
        defenderLoss: shockDefLoss,
        days: shockDays
      };
    }

    roundResults.push(roundResult);
  }

  var totalAttackerLoss = initialAttacker - attStr;
  var totalDefenderLoss = initialDefender - defStr;

  var winner = null;
  if (annihilated === 'attacker') {
    winner = 'defender';
  } else if (annihilated === 'defender') {
    winner = 'attacker';
  } else if (totalDefenderLoss > totalAttackerLoss) {
    winner = 'attacker';
  } else if (totalAttackerLoss > totalDefenderLoss) {
    winner = 'defender';
  } else {
    winner = 'draw';
  }

  return {
    rounds: roundResults,
    initialAttacker: initialAttacker,
    initialDefender: initialDefender,
    finalAttacker: Math.max(0, attStr),
    finalDefender: Math.max(0, defStr),
    totalAttackerLoss: totalAttackerLoss,
    totalDefenderLoss: totalDefenderLoss,
    totalDays: battleDay - 1,
    winner: winner,
    annihilated: annihilated
  };
}
