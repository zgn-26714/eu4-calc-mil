# EU4 陆战计算器 — 兵员伤害 / 士气 / 排名模拟

纯前端静态页面，浏览器直接打开 `index.html` 即可使用，无需后端或构建工具。

## 概述

这是一个仿照欧陆风云 4（Europa Universalis IV）陆战机制的战斗模拟器，提供三个逐步深入的计算模式：

1. **单日伤害计算** — 给定一个战斗阶段（火力/冲击），计算一天内双方兵员和士气损失
2. **多回合推演** — 连续模拟多个战斗回合，输出每日日志与胜负判定
3. **兵种排名** — 在当前科技等级下进行循环赛，对所有可用兵种排序；支持遍历科技排行、兵种成长折线图、多线高亮对比等

> 完整功能介绍请参阅 [FEATURES.md](FEATURES.md)

## 伤害公式

伤害计算分两步：基础伤亡 → 乘数放大。

```
基础伤亡 = max(15, 15 + 5 × (骰子 + 将领差 + 攻方进攻点数 - 守方防御点数 - 地形惩罚))
最终伤害 = 基础伤亡 × 乘数
```

乘数包含：兵力比、科技修正/守方战术、作战能力、训练度、战斗天数、伤害修正等因子。士气伤害额外考虑士气 pip 和攻方最大士气。

> 完整公式推导与机制细节请参阅 [陆战机制.md](陆战机制.md)

## 项目架构

```
├── index.html              # 入口页面，加载所有模块
├── main.js                 # 应用初始化、UI 事件绑定
├── README.md
├── data/
│   ├── constants.js        # 阶段类型、兵种组、颜色
│   ├── tech-stats.js       # 33 级科技修正（tech 0-32）
│   ├── translations.js     # 兵种组中文名映射
│   └── units.js            # 约 380 个兵种数据
├── shared/
│   ├── calc-engine.js      # 核心伤害公式
│   ├── morale-engine.js    # 士气计算公式
│   ├── battle-sim.js       # 多回合推演引擎
│   ├── dialog.js           # 模态对话框
│   ├── state.js            # UI 状态与表单 Schema
│   └── ui-helpers.js       # 格式化工具
├── single/
│   ├── logic.js            # 单日伤害计算逻辑
│   └── view.js             # 单日结果渲染
├── simulation/
│   ├── logic.js            # 多回合推演编排
│   └── view.js             # 推演结果表格渲染
├── ranking/
│   ├── logic.js            # 循环赛算法
│   ├── view.js             # 排名表格渲染
│   ├── charts-view.js      # SVG 折线图生成
│   ├── cross-tech-logic.js # 跨科技排名计算
│   └── cross-tech-view.js  # 跨科技图表渲染
└── styles/
    ├── base.css, layout.css, components.css
    ├── single.css, simulation.css, ranking.css
```

### 模块设计

采用 **IIFE 模块模式**，所有模块挂载到全局 `window._M` 命名空间：

```javascript
(function(M) {
  // module code
  M['module/name'] = { exportedFunctions };
})(window._M = window._M || {});
```

数据层 → 共享计算引擎 → 各功能模块 → main.js 编排与事件绑定。

## 数据来源

- 兵种表来自 EU4 游戏内数据，包含 **约 380 个兵种**，覆盖所有兵种组（Western、Eastern、Ottoman、Indian、Chinese、Muslim 等）
- 科技修正覆盖 **科技等级 0-32**
- 每个兵种包含：火力攻/防、冲击攻/防、士气攻/防点数

## 已知局限

1. 模型假设每个团 1000 人，固定在前排作战
2. 未处理炮兵在后排伤害减半的机制
3. 未处理炮兵在前排受双倍伤害的机制
4. siege 将领点数当前锁定为 0，无实际效果
5. 未模拟侧翼攻击、增援等高级战场机制

## 使用方法

直接双击 `index.html` 用浏览器打开即可，无需任何服务器或构建步骤。推荐使用 Chrome / Firefox / Edge 最新版本。

### 操作流程

1. 在左右两侧分别填写进攻方和防守方的配置
2. 选择计算模式（单日 / 推演 / 排名）
3. 点击对应的计算按钮
4. 查看结果
