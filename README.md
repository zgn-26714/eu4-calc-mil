# EU4 陆战双向兵员伤害计算器

现在这个项目有两个界面版本：

- `Win32 / C++` 版本：原生桌面窗口
- `前端静态页面` 版本：界面更好看，推荐优先使用

## 推荐入口

直接打开：

[ui/index.html](E:/ai_project/calc_mil/ui/index.html)

这个前端版本不需要启动后端服务，浏览器直接打开就能用。

## 前端版特点

- 左右双栏分别填写进攻方和防守方
- 攻守双方可以选择不同兵种组
- 自动根据：
  - 兵种组
  - 兵种类型
  - 军事科技
  - 具体兵种
  
  读取对应兵种点数
- 同时计算：
  - 进攻方兵员损失
  - 防守方兵员损失
- 页面样式比 Win32 原生控件更适合继续打磨

## 数据来源

兵种表来自：

`E:\ai_project\docx_for_ai\eu4_unit_pips_complete.md`

前端运行时使用的转换数据文件是：

[ui/unit-data.js](E:/ai_project/calc_mil/ui/unit-data.js)

## 其他文件

前端界面文件：

- [ui/index.html](E:/ai_project/calc_mil/ui/index.html)
- [ui/styles.css](E:/ai_project/calc_mil/ui/styles.css)
- [ui/app.js](E:/ai_project/calc_mil/ui/app.js)

旧的 C++ 版本代码仍然保留在：

[main.cpp](E:/ai_project/calc_mil/main.cpp)
