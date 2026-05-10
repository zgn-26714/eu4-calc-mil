const GROUP_TRANSLATIONS = {
  "Western": "西欧",
  "Eastern": "东欧",
  "Anatolian (Ottoman)": "安纳托利亚（奥斯曼）",
  "Muslim": "穆斯林",
  "Indian": "印度",
  "Chinese": "中华",
  "Nomadic": "游牧",
  "African Groups (Central / East / West African)": "非洲组（中非/东非/西非）",
  "Aboriginal": "原住民",
  "High American (Fantasy / Inca)": "高美洲（幻想/印加）",
  "Native American Groups": "美洲原住民组",
  "Polynesian": "波利尼西亚",
  "Shared": "通用"
};

const UNIT_TRANSLATIONS = {
  // === 炮兵（通用） ===
  "Houfnice": "胡夫尼采火炮",
  "Large Cast Bronze Mortar": "大型铸铜迫击炮",
  "Culverin": "长炮",
  "Pedrero": "佩德雷罗炮",
  "Large Cast Iron Cannon": "大型铸铁炮",
  "Small Cast Iron Cannon": "小型铸铁炮",
  "Chambered Demi Cannon": "后装半加农炮",
  "Demi-Culverin": "半长炮",
  "Leather Cannon": "皮制火炮",
  "Chambered Cannon": "后装加农炮",
  "Swivel Cannon": "回旋炮",
  "Howitzer": "榴弹炮",
  "Coehorn Mortar": "库霍恩迫击炮",
  "Horse Artillery": "骑马炮兵",
  "Royal Mortar": "皇家迫击炮",
  "Licorne": "独角兽炮",
  "Flying Battery": "机动炮兵连",
  "Grand Battery": "大炮兵连",

  // === 西欧步兵 ===
  "Halberd Infantry": "戟兵",
  "Latin Medieval Infantry": "拉丁中世纪步兵",
  "Galloglaigh Infantry": "盖洛格拉斯步兵",
  "Longbow": "长弓兵",
  "Men at Arms": "披甲兵",
  "Condotta Infantry": "孔多塔步兵",
  "Landsknecht Infantry": "兰茨克内希特步兵",
  "Reformed Galloglaigh Infantry": "改良盖洛格拉斯步兵",
  "Free Shooter Infantry": "自由射手步兵",
  "Tercio Infantry": "大方阵步兵",
  "Charge Infantry": "冲锋步兵",
  "Maurician Infantry": "毛里茨步兵",
  "Gustavian Infantry": "古斯塔夫步兵",
  "Highlanders Infantry": "高地步兵",
  "Reformed Tercio": "改良大方阵步兵",
  "Caroline Infantry": "卡洛林步兵",
  "Grenzer Infantry": "边防步兵",
  "Line Infantry": "线列步兵",
  "Redcoat Infantry": "红衣步兵",
  "Blue Coat Infantry": "蓝衣步兵",
  "White Coat Infantry": "白衣步兵",
  "Frederickian Infantry": "腓特烈步兵",
  "Impulse Infantry": "突击步兵",
  "Square Infantry": "方阵步兵",
  "Drill Infantry": "操练步兵",
  "Jager Infantry": "猎兵",
  "Mixed Order Infantry": "混合序列步兵",
  "Napoleonic Square": "拿破仑方阵",

  // === 西欧骑兵 ===
  "Chevaunchee": "劫掠骑兵",
  "Latin Knights": "拉丁骑士",
  "Schwarze Reiter": "黑衣骑兵",
  "Latin Caracole Cavalry": "拉丁半旋骑兵",
  "Gallop Cavalry": "疾驰骑兵",
  "Arme Blanche Cavalry": "白刃骑兵",
  "Latin Dragoons": "拉丁龙骑兵",
  "Latin Hussars": "拉丁骠骑兵",
  "Carabiniers": "卡宾枪骑兵",
  "Reformed Latin Hussars": "改良拉丁骠骑兵",
  "Uhlan Cavalry": "乌兰骑兵",
  "Latin Chasseur": "拉丁猎骑兵",
  "Latin Cuirassiers": "拉丁胸甲骑兵",
  "Latin Lancers": "拉丁枪骑兵",

  // === 东欧步兵 ===
  "Bardiche Infantry": "长柄斧步兵",
  "Eastern Medieval Infantry": "东欧中世纪步兵",
  "Eastern Militia": "东欧民兵",
  "Pike Infantry": "长矛步兵",
  "Defensive Eastern Musketeers": "东欧防御火枪兵",
  "Offensive Eastern Musketeers": "东欧进攻火枪兵",
  "Eastern Tercio": "东欧大方阵步兵",
  "Soldaty Infantry": "索尔达提步兵",
  "Saxon Infantry": "萨克森步兵",
  "Petrine Infantry": "彼得步兵",
  "Green Coat Infantry": "绿衣步兵",
  "Mass Infantry": "大规模步兵",

  // === 东欧骑兵 ===
  "Druzhina Cavalry": "德鲁日纳骑兵",
  "Eastern Knights": "东欧骑士",
  "Stratioti Cavalry": "斯特拉迪奥蒂骑兵",
  "Eastern Hussar": "东欧骠骑兵",
  "Eastern Caracole": "东欧半旋骑兵",
  "Reformed Eastern Hussars": "改良东欧骠骑兵",
  "Southern Cossacks": "南方哥萨克",
  "Cossack Cavalry": "哥萨克骑兵",
  "Winged Hussars": "翼骑兵",
  "Lancers": "枪骑兵",
  "Reformed Cossack Cavalry": "改良哥萨克骑兵",
  "Advanced Cossack Cavalry": "精锐哥萨克骑兵",
  "Eastern Cuirassiers": "东欧胸甲骑兵",

  // === 安纳托利亚（奥斯曼）步兵 ===
  "Yaya Infantry": "雅雅步兵",
  "Azab Infantry": "阿扎布步兵",
  "Janissary Infantry": "耶尼切里步兵",
  "Sekban Infantry": "塞克班步兵",
  "Reformed Janissary Infantry": "改良耶尼切里步兵",
  "Nizami Cedid Infantry": "新制步兵",
  "Eastern Carabinier": "东方卡宾枪手",
  "Eastern New Model Infantry": "新式东方步兵",

  // === 安纳托利亚（奥斯曼）骑兵 ===
  "Musellem Cavalry": "穆瑟雷骑兵",
  "Timariot Cavalry": "蒂玛尔贵族骑兵",
  "Spahi Cavalry": "西帕希骑兵",
  "Reformed Spahi Cavalry": "改良西帕希骑兵",
  "Toprakli Hit and Run Cavalry": "托普拉克利游骑兵",
  "Eastern Skirmisher": "东方前哨骑兵",
  "Eastern Uhlan": "东方长枪骑兵",
  "Reformed Lancer": "改良枪骑兵",
  "Toprakli Dragoons": "托普拉克利龙骑兵",

  // === 穆斯林步兵 ===
  "Muslim Archer": "穆斯林弓箭手",
  "Muslim Foot Soldier": "穆斯林步兵",
  "Muslim Duel Infantry": "穆斯林决斗步兵",
  "Shamshir Infantry": "弯刀步兵",
  "Muslim Musketeer": "穆斯林滑膛枪兵",
  "Afsharid Reformed Infantry": "阿夫沙尔改良步兵",
  "Reformed Muslim Musketeers": "改良穆斯林滑膛枪兵",
  "Muslim Mass Infantry": "穆斯林大规模步兵",
  "Muslim Rifle Infantry": "穆斯林线膛枪步兵",

  // === 穆斯林骑兵 ===
  "Muslim Cavalry": "穆斯林骑兵",
  "Muslim Cavalry Archers": "穆斯林骑射手",
  "Charge Cavalry": "冲锋骑兵",
  "Shaybanid Cavalry": "昔班尼骑兵",
  "Qizilbash Cavalry": "红头骑兵",
  "Muslim Musketeer Cavalry": "穆斯林火枪骑兵",
  "Afsharid Reformed Cavalry": "阿夫沙尔改良骑兵",
  "Musket Charge Cavalry": "火枪冲锋骑兵",
  "Ali Bey Reformed Cavalry": "阿里贝伊改良骑兵",
  "Muslim Dragoon": "穆斯林龙骑兵",
  "Durrani Cavalry": "杜兰尼骑兵",
  "Durrani Swivel Cavalry": "杜兰尼回旋骑兵",

  // === 印度步兵 ===
  "Indian Foot Soldier": "印度步兵",
  "Indian Arquebusier": "印度火绳枪兵",
  "Poligar Infantry": "波利加尔步兵",
  "Toofangchis": "图方奇火枪兵",
  "Akbarid Musketeers": "阿克巴火枪兵",
  "South Indian Infantry": "南印度步兵",
  "Deccani Musket Infantry": "德干火枪步兵",
  "North Indian Musket Infantry": "北印度火枪步兵",
  "Telingas": "特林加步兵",
  "North Indian Sepoy": "北印度西帕依",
  "Indian Drill Infantry": "印度操练步兵",

  // === 印度骑兵 ===
  "Elephant Archers": "战象弓箭手",
  "Indian Cavalry": "印度骑兵",
  "Indian Cavalry Archers": "印度骑射手",
  "Mansabdar Cavalry": "曼萨卜达尔骑兵",
  "Dai-Phat Cavalry": "戴帕特骑兵",
  "Maratha Raiders": "马拉塔突袭骑兵",
  "Deccani Light Cavalry": "德干轻骑兵",
  "Mysorean Light Cavalry": "迈索尔轻骑兵",
  "Sowars": "索瓦尔骑兵",

  // === 中华步兵 ===
  "Asian Longbow": "亚洲长弓兵",
  "Asian Longspear Infantry": "亚洲长矛步兵",
  "East Asian Spearmen": "东亚矛兵",
  "Defensive Asian Foot Soldier": "亚洲防御步兵",
  "Offensive Asian Foot Soldier": "亚洲进攻步兵",
  "Asian Arquebusier": "亚洲火绳枪兵",
  "Banner Infantry": "八旗步兵",
  "Asian Mass Infantry": "亚洲大规模步兵",
  "Asian Musketeer": "亚洲滑膛枪兵",
  "Reformed Asian Musketeer": "改良亚洲滑膛枪兵",

  // === 中华骑兵 ===
  "Archer Cavalry": "弓骑兵",
  "East Asian Archer Cavalry": "东亚弓骑兵",
  "Asian Steppe Cavalry": "亚洲草原骑兵",
  "Samurai Cavalry": "武士骑兵",
  "Reformed Asian Steppe Cavalry": "改良亚洲草原骑兵",
  "Asian Charge Cavalry": "亚洲冲锋骑兵",
  "Banner Cavalry": "八旗骑兵",
  "Asian Dragoons": "亚洲龙骑兵",
  "Green Standard Cavalry": "绿营骑兵",
  "Reformed Asian Cavalry": "改良亚洲骑兵",

  // === 游牧步兵 ===
  "Eastern Archers": "东方弓兵",
  "Steppe Raiders": "草原突袭兵",
  "Steppe Footmen": "草原徒步士兵",
  "Steppe Musketeers": "草原滑膛枪兵",
  "Steppe Infantry": "草原步兵",
  "Steppe Rifles": "草原来复枪兵",
  "Reformed Steppe Rifles": "改良草原来复枪兵",

  // === 游牧骑兵 ===
  "Eastern Steppe Cavalry": "东方草原骑兵",
  "Eastern Swarm Cavalry": "东方密袭骑兵",
  "Steppe Riders": "草原骑手",
  "Steppe Lancers": "草原枪骑兵",
  "Mounted Steppe Raiders": "草原骑乘突袭兵",
  "Steppe Cavalry": "草原骑兵",
  "Steppe Uhlans": "草原乌兰骑兵",

  // === 非洲步兵 ===
  "African Clubmen": "非洲棍棒兵",
  "African Spearmen": "非洲矛兵",
  "Central African Warrior": "中非战士",
  "North African Warrior": "北非战士",
  "South African Warrior": "南非战士",
  "West African Warrior": "西非战士",
  "African Forest Warriors": "非洲丛林战士",
  "African Hill Warriors": "非洲山地战士",
  "African Mountain Warriors": "非洲高山战士",
  "African Plains Warriors": "非洲平原战士",
  "Central African Musketeers": "中非滑膛枪兵",
  "East African Musketeers": "东非滑膛枪兵",
  "North African Musketeers": "北非滑膛枪兵",
  "South African Musketeers": "南非滑膛枪兵",
  "Central African Guerrillas": "中非游击步兵",
  "East African Guerrillas": "东非游击步兵",
  "North African Guerrillas": "北非游击步兵",
  "Westernized Central African Inf.": "西式中非步兵",
  "Westernized East African Inf.": "西式东非步兵",
  "Westernized North African Inf.": "西式北非步兵",
  "Westernized South African Inf.": "西式南非步兵",
  "African Western Franchise Infantry": "西非特许步兵",

  // === 非洲骑兵 ===
  "Abyssinian Light Cavalry": "阿比西尼亚轻骑兵",
  "Mandekalu Cavalry": "曼德卡鲁骑兵",
  "Somali Light Cavalry": "索马里轻骑兵",
  "Tuareg Cavalry": "图阿雷格骑兵",
  "Abyssinian Barded Cavalry": "阿比西尼亚披甲骑兵",
  "Mossi Horsemen": "莫西骑手",
  "African Hussar": "非洲骠骑兵",
  "African Swarm Cavalry": "非洲集群骑兵",
  "African Dragoon": "非洲龙骑兵",
  "African Cuirassier": "非洲胸甲骑兵",

  // === 原住民步兵 ===
  "Aboriginal Spearman": "原住民矛兵",
  "Boomerang Hunter": "回旋镖猎手",
  "Aboriginal Ambusher": "原住民伏击兵",
  "Reformed Boomerang Warrior": "改良回旋镖战士",
  "Ritual Warrior": "仪式战士",
  "Outback Warriors": "内陆战士",
  "Ambush Arquebusier": "伏击火绳枪兵",
  "Offensive Arquebusier": "进攻火绳枪兵",
  "Frontier Riflemen": "边疆来复枪兵",
  "Black War Infantry": "黑色战争步兵",

  // === 原住民骑兵 ===
  "Aboriginal Horsemen": "原住民骑手",
  "Aboriginal Cavalry": "原住民骑兵",
  "Aboriginal Hussar": "原住民骠骑兵",
  "Aboriginal Swarm Cavalry": "原住民集群骑兵",
  "Aboriginal Dragoon": "原住民龙骑兵",

  // === 高美洲步兵 ===
  "Xantican Warrior": "克桑蒂坎战士",
  "Reformed Xantican Warrior": "改良克桑蒂坎战士",
  "Xiuhtecuhtli Soldier": "修特库特利士兵",
  "Xiuhtecuhtlian Infantry": "修特库特利步兵",
  "Xoloti": "索洛蒂战士",
  "Foreign Influenced Infantry": "外来影响步兵",
  "Reformed Influenced Infantry": "改良外来影响步兵",
  "Reformed Xoloti": "改良索洛蒂战士",

  // === 高美洲骑兵 ===
  "American Horsemen": "美洲骑手",
  "Xiuhtecuhtli Cavalry": "修特库特利骑兵",
  "American Hussars": "美洲骠骑兵",
  "American Swarm Cavalry": "美洲集群骑兵",
  "American Dragoon": "美洲龙骑兵",

  // === 美洲原住民步兵 ===
  "Mesoamerican Spearmen": "中美洲矛兵",
  "American Forest Warriors": "美洲丛林战士",
  "American Hill Warriors": "美洲山地战士",
  "American Plains Warriors": "美洲平原战士",
  "Reformed American Forest Warriors": "改良美洲丛林战士",
  "Reformed American Hill Warriors": "改良美洲山地战士",
  "Reformed American Plains Warriors": "改良美洲平原战士",
  "American Forest Musketeers": "美洲森林滑膛枪兵",
  "American Hill Musketeers": "美洲山地滑膛枪兵",
  "Offensive American Musketeers": "美洲攻击滑膛枪兵",
  "American Guerrilla Warfare": "美洲游击步兵",
  "Central American Guerrillas": "中美洲游击步兵",
  "Westernized American Hill Infantry": "西式美洲山地步兵",
  "Westernized American Plains Infantry": "西式美洲平原步兵",
  "Westernized Central American infantry": "西式中美步兵",
  "Clubmen": "棍棒兵",
  "Native American Archer": "美洲原住民弓箭手",
  "Algonkin Tomahawk Warriors": "阿尔冈昆战斧战士",
  "Ambush Infantry": "伏击步兵",
  "Native American Mountain Warriors": "美洲原住民高山战士",
  "Creek Arquebusier": "克里克火绳枪兵",
  "Native American Arquebusier": "美洲原住民火绳枪兵",
  "Rifle Scout Infantry": "线膛枪侦察步兵",
  "North American Guerrillas": "北美游击步兵",
  "American Westernized Infantry": "西式美洲步兵",
  "American Mountain Warriors": "美洲高山战士",
  "South American Spearmen": "南美矛兵",
  "Incan Axemen": "印加斧兵",
  "Incan Slingshots": "印加投石兵",
  "Reformed Mountain Warriors": "改良高山战士",
  "South American Forest Warriors": "南美丛林战士",
  "Defensive American Musketeers": "美洲防御滑膛枪兵",
  "South American Arquebusier": "南美火绳枪兵",
  "Reformed American Musketeers": "改良美洲滑膛枪兵",
  "Incan Guerrilla": "印加游击步兵",
  "South American Guerrilla": "南美游击步兵",
  "Westernized Incan Infantry": "西式印加步兵",
  "Westernized South American Infantry": "西式南美步兵",
  "Reformed Westernized Incan Infantry": "改良西式印加步兵",

  // === 美洲原住民骑兵 ===
  "North American Horsemen": "北美骑手",
  "North American Cavalry": "北美骑兵",
  "North American Hussar": "北美骠骑兵",
  "North American Swarm Cavalry": "北美集群骑兵",
  "North American Dragoon": "北美龙骑兵",

  // === 波利尼西亚步兵 ===
  "Polynesian Spearmen": "波利尼西亚矛兵",
  "Polynesian Reformed Spearmen": "波利尼西亚改良矛兵",
  "Polynesian Island Warriors": "波利尼西亚岛屿战士",
  "Polynesian Arquebusiers": "波利尼西亚火绳枪兵",
  "Polynesian Riflemen": "波利尼西亚来复枪兵",
  "Polynesian Guerrillas": "波利尼西亚游击步兵",

  // === 波利尼西亚骑兵 ===
  "Polynesian Horsemen": "波利尼西亚骑手",
  "Polynesian Cavalry": "波利尼西亚骑兵",
  "Polynesian Hussars": "波利尼西亚骠骑兵",
  "Polynesian Swarm Cavalry": "波利尼西亚集群骑兵",
  "Polynesian Dragoons": "波利尼西亚龙骑兵"
};

const UNIT_TYPE_TRANSLATIONS = {
  "Infantry": "步兵",
  "Cavalry": "骑兵",
  "Artillery": "炮兵"
};

const PHASES = [
  { value: "fire", label: "火力" },
  { value: "shock", label: "冲击" }
];

const UNIT_TYPES = [
  { value: "Infantry", label: "步兵" },
  { value: "Cavalry", label: "骑兵" },
  { value: "Artillery", label: "炮兵" }
];

const sideSchemas = {
  attacker: [
    { key: "group", label: "兵种组", type: "select" },
    { key: "unitType", label: "兵种类型", type: "select" },
    { key: "unit", label: "具体兵种", type: "select", wide: true },
    { key: "techLevel", label: "军事科技", type: "number", value: 3, min: 0, max: 32, step: 1 },
    { key: "strength", label: "参战兵力（默认 1000，固定前排）", type: "number", value: 1000, step: 100 },
    { key: "combatAbility", label: "作战能力", type: "number", value: 0, step: 1 },
    { key: "discipline", label: "训练度", type: "number", value: 0, step: 1 },
    { key: "extraMilitaryTactics", label: "额外军事战术", type: "number", value: 0, step: 0.1 },
    { key: "fireDamage", label: "火力伤害修正", type: "number", value: 0, step: 1 },
    { key: "shockDamage", label: "冲击伤害修正", type: "number", value: 0, step: 1 },
    { key: "damageDone", label: "造成伤害修正", type: "number", value: 0, step: 1 },
    { key: "damageTaken", label: "承受伤害修正", type: "number", value: 0, step: 1 },
    { key: "moraleBonus", label: "额外士气加成(%)", type: "number", value: 0, step: 1 },
    { key: "armyTradition", label: "陆军传统", type: "number", value: 0, min: 0, max: 100, step: 1 },
    { key: "prestige", label: "威望", type: "number", value: 0, min: -100, max: 100, step: 1 },
    { key: "moraleDamageDone", label: "造成士气伤害修正", type: "number", value: 0, step: 1 },
    { key: "moraleDamageTaken", label: "承受士气伤害修正", type: "number", value: 0, step: 1 },
    { key: "professionalism", label: "职业度", type: "number", value: 0, min: 0, max: 100, step: 1 }
  ],
  defender: [
    { key: "group", label: "兵种组", type: "select" },
    { key: "unitType", label: "兵种类型", type: "select" },
    { key: "unit", label: "具体兵种", type: "select", wide: true },
    { key: "techLevel", label: "军事科技", type: "number", value: 3, min: 0, max: 32, step: 1 },
    { key: "strength", label: "参战兵力（默认 1000，固定前排）", type: "number", value: 1000, step: 100 },
    { key: "combatAbility", label: "作战能力", type: "number", value: 0, step: 1 },
    { key: "discipline", label: "训练度", type: "number", value: 0, step: 1 },
    { key: "extraMilitaryTactics", label: "额外军事战术", type: "number", value: 0, step: 0.1 },
    { key: "fireDamage", label: "火力伤害修正", type: "number", value: 0, step: 1 },
    { key: "shockDamage", label: "冲击伤害修正", type: "number", value: 0, step: 1 },
    { key: "damageDone", label: "造成伤害修正", type: "number", value: 0, step: 1 },
    { key: "damageTaken", label: "承受伤害修正", type: "number", value: 0, step: 1 },
    { key: "moraleBonus", label: "额外士气加成(%)", type: "number", value: 0, step: 1 },
    { key: "armyTradition", label: "陆军传统", type: "number", value: 0, min: 0, max: 100, step: 1 },
    { key: "prestige", label: "威望", type: "number", value: 0, min: -100, max: 100, step: 1 },
    { key: "moraleDamageDone", label: "造成士气伤害修正", type: "number", value: 0, step: 1 },
    { key: "moraleDamageTaken", label: "承受士气伤害修正", type: "number", value: 0, step: 1 },
    { key: "professionalism", label: "职业度", type: "number", value: 0, min: 0, max: 100, step: 1 }
  ]
};
sideSchemas.template = [
  { key: "techLevel", label: "军事科技", type: "number", value: 3, min: 0, max: 32, step: 1 },
  { key: "strength", label: "参战兵力（默认 1000，固定前排）", type: "number", value: 1000, step: 100 },
  { key: "combatAbility", label: "作战能力", type: "number", value: 0, step: 1 },
  { key: "discipline", label: "训练度", type: "number", value: 0, step: 1 },
  { key: "extraMilitaryTactics", label: "额外军事战术", type: "number", value: 0, step: 0.1 },
  { key: "fireDamageInfantry", label: "步兵火力修正", type: "number", value: 0, step: 1 },
  { key: "fireDamageCavalry", label: "骑兵火力修正", type: "number", value: 0, step: 1 },
  { key: "fireDamageArtillery", label: "炮兵火力修正", type: "number", value: 0, step: 1 },
  { key: "shockDamageInfantry", label: "步兵冲击修正", type: "number", value: 0, step: 1 },
  { key: "shockDamageCavalry", label: "骑兵冲击修正", type: "number", value: 0, step: 1 },
  { key: "shockDamageArtillery", label: "炮兵冲击修正", type: "number", value: 0, step: 1 },
  { key: "damageDoneFire", label: "造成火力伤害修正", type: "number", value: 0, step: 1 },
  { key: "damageDoneShock", label: "造成冲击伤害修正", type: "number", value: 0, step: 1 },
  { key: "damageTakenFire", label: "承受火力伤害修正", type: "number", value: 0, step: 1 },
  { key: "damageTakenShock", label: "承受冲击伤害修正", type: "number", value: 0, step: 1 },
  { key: "moraleBonus", label: "额外士气加成(%)", type: "number", value: 0, step: 1 },
  { key: "armyTradition", label: "陆军传统", type: "number", value: 0, min: 0, max: 100, step: 1 },
  { key: "prestige", label: "威望", type: "number", value: 0, min: -100, max: 100, step: 1 },
  { key: "moraleDamageDone", label: "造成士气伤害修正", type: "number", value: 0, step: 1 },
  { key: "moraleDamageTaken", label: "承受士气伤害修正", type: "number", value: 0, step: 1 },
  { key: "professionalism", label: "职业度", type: "number", value: 0, min: 0, max: 100, step: 1 }
];

const sideState = {
  attacker: {},
  defender: {},
  template: {}
};

// ---- DOM refs ----
const phaseSelect = document.querySelector("#phase");
const calculateButton = document.querySelector("#calculate");
const backButton = document.querySelector("#back-button");
const detailsOutput = document.querySelector("#details-output");
const errorBanner = document.querySelector("#error-banner");
const attackerLossEl = document.querySelector("#attacker-loss");
const defenderLossEl = document.querySelector("#defender-loss");
const attackerMoraleLossEl = document.querySelector("#attacker-morale-loss");
const defenderMoraleLossEl = document.querySelector("#defender-morale-loss");

// Mode toggle
const modeSingleRadio = document.querySelector("#mode-single");
const modeSimRadio = document.querySelector("#mode-sim");
const modeRankingRadio = document.querySelector("#mode-ranking");

// Single-mode strips
const singleStrip = document.querySelector("#single-strip");
const phaseBox = document.querySelector(".phase-box");

// Simulation-mode strips
const simStrip = document.querySelector("#sim-strip");
const simDiceStrip = document.querySelector("#sim-dice-strip");
const simDiceFixedStrip = document.querySelector("#sim-dice-fixed-strip");
const simDiceFixedValue = document.querySelector("#sim-dice-fixed-value");
const simDiceMode = document.querySelector("#sim-dice-mode");
const simRounds = document.querySelector("#sim-rounds");
const simLeaderDiff = document.querySelector("#sim-leader-diff");
const simTerrainPenalty = document.querySelector("#sim-terrain-penalty");
const simPhaseMode = document.querySelector("#sim-phase-mode");
const simDiceFire = document.querySelector("#sim-dice-fire");
const simDiceShock = document.querySelector("#sim-dice-shock");
const simResults = document.querySelector("#sim-results");
const simSummary = document.querySelector("#sim-summary");
const simTbody = document.querySelector("#sim-tbody");
const downloadRankingLogButton = document.querySelector("#download-ranking-log");
const templateCard = document.querySelector("#template-card");
const battleGrid = document.querySelector(".battle-grid");
const resultsGrid = document.querySelector(".results-grid");
const detailsSection = document.querySelector("#details-section");
const rankingResults = document.querySelector("#ranking-results");
const rankingSummary = document.querySelector("#ranking-summary");
const rankingTbody = document.querySelector("#ranking-tbody");
const rankingLogSection = document.querySelector("#ranking-log-section");
const rankingLogOutput = document.querySelector("#ranking-log-output");
const crossTechSection = document.querySelector("#cross-tech-section");
const crossTechThead = document.querySelector("#cross-tech-thead");
const crossTechTbody = document.querySelector("#cross-tech-tbody");
const crossTechTechRange = document.querySelector("#cross-tech-tech-range");
const showCrossTechTemplateBtn = document.querySelector("#show-cross-tech-template");
const crossTechChartsPanel = document.querySelector("#cross-tech-charts-panel");
const toggleCrossTechChartsBtn = document.querySelector("#toggle-cross-tech-charts");
const toggleCrossTechTableModeBtn = document.querySelector("#toggle-cross-tech-table-mode");
const crossTechRankingBtn = document.querySelector("#cross-tech-ranking-btn");
const downloadCrossTechBtn = document.querySelector("#download-cross-tech");
const crossTechInfantryChart = document.querySelector("#cross-tech-infantry-chart");
const crossTechCavalryChart = document.querySelector("#cross-tech-cavalry-chart");
const crossTechInfantryOnlyChart = document.querySelector("#cross-tech-infantry-only-chart");
const crossTechCavalryOnlyChart = document.querySelector("#cross-tech-cavalry-only-chart");
const chartLightbox = document.querySelector("#chart-lightbox");
const chartLightboxBackdrop = document.querySelector("#chart-lightbox-backdrop");
const chartLightboxClose = document.querySelector("#chart-lightbox-close");
const chartLightboxTitle = document.querySelector("#chart-lightbox-title");
const chartLightboxBody = document.querySelector("#chart-lightbox-body");
const crossTechTemplateDialog = document.querySelector("#cross-tech-template-dialog");
const crossTechTemplateBackdrop = document.querySelector("#cross-tech-template-backdrop");
const crossTechTemplateClose = document.querySelector("#cross-tech-template-close");
const crossTechTemplateGrid = document.querySelector("#cross-tech-template-grid");
const crossTechConfirmDialog = document.querySelector("#cross-tech-confirm-dialog");
const crossTechConfirmBackdrop = document.querySelector("#cross-tech-confirm-backdrop");
const crossTechConfirmText = document.querySelector("#cross-tech-confirm-text");
const crossTechConfirmStart = document.querySelector("#cross-tech-confirm-start");
const crossTechConfirmCancel = document.querySelector("#cross-tech-confirm-cancel");
const crossTechConfirmProgress = document.querySelector("#cross-tech-confirm-progress");
const crossTechConfirmProgressFill = document.querySelector("#cross-tech-confirm-progress-fill");
const crossTechConfirmProgressLabel = document.querySelector("#cross-tech-confirm-progress-label");
const crossTechConfirmProgressPercent = document.querySelector("#cross-tech-confirm-progress-percent");

const groupKeys = [...new Set(UNIT_DATA.filter(item => item.group !== "Shared").map(item => item.group))];
var latestRankingLogText = "";
var uiView = "settings";
var resultMode = null;
var crossTechData = null;
var latestCrossTechTemplateKey = "";
var crossTechTableMode = "group";
var crossTechChartsExpanded = false;
var crossTechConfirmTimer = null;
var crossTechConfirmCountdown = null;
var crossTechRunToken = 0;

const CROSS_TECH_COLORS = [
  "#0072B2",
  "#D55E00",
  "#009E73",
  "#CC79A7",
  "#E69F00",
  "#56B4E9",
  "#882255",
  "#117733",
  "#332288",
  "#AA4499",
  "#44AA99",
  "#999933",
  "#661100"
];

function translateGroup(name) {
  return GROUP_TRANSLATIONS[name] || name;
}

function translateUnit(name) {
  return UNIT_TRANSLATIONS[name] || name;
}

function translateUnitType(name) {
  return UNIT_TYPE_TRANSLATIONS[name] || name;
}

function translateTableGroup(name) {
  return name === "Shared" ? "炮兵" : translateGroup(name);
}

function stripParenthetical(text) {
  return String(text || "")
    .replace(/（[^）]*）/g, "")
    .replace(/\([^)]*\)/g, "")
    .trim();
}

function cloneDataShallow(source) {
  var copy = {};
  var keys = Object.keys(source);
  for (var i = 0; i < keys.length; i++) {
    copy[keys[i]] = source[keys[i]];
  }
  return copy;
}

function buildCrossTechTemplateKey(template, battleOptions) {
  return JSON.stringify({
    template: template,
    battleOptions: battleOptions
  });
}

function resetCrossTechResults() {
  crossTechData = null;
  latestCrossTechTemplateKey = "";
  crossTechTableMode = "group";
  crossTechChartsExpanded = false;
  crossTechSection.style.display = "none";
  crossTechTechRange.textContent = "";
  crossTechThead.innerHTML = "";
  crossTechTbody.innerHTML = "";
  crossTechInfantryChart.innerHTML = "";
  crossTechCavalryChart.innerHTML = "";
  crossTechInfantryOnlyChart.innerHTML = "";
  crossTechCavalryOnlyChart.innerHTML = "";
  downloadCrossTechBtn.disabled = true;
  toggleCrossTechChartsBtn.disabled = true;
  toggleCrossTechChartsBtn.textContent = "展开兵种组成长图";
  toggleCrossTechTableModeBtn.disabled = true;
  toggleCrossTechTableModeBtn.textContent = "⇄ 转换成兵种显示";
  showCrossTechTemplateBtn.disabled = true;
  crossTechChartsPanel.style.display = "none";
  closeChartLightbox();
  closeCrossTechTemplateDialog();
}

function maybeWarnStrengthLimit(control) {
  if (!control) return;
  var value = Number(control.value);
  if (!Number.isFinite(value) || value <= 1000) {
    control.dataset.warnedStrengthValue = "";
    return;
  }
  if (control.dataset.warnedStrengthValue === control.value) return;
  control.dataset.warnedStrengthValue = control.value;
  window.alert("当前模型只按 1000 兵且固定前排计算；当初始兵力超过 1000 时，计算结果目前是不正确的。");
}

function openChartLightbox(title, contentHtml) {
  chartLightboxTitle.textContent = title;
  chartLightboxBody.innerHTML = contentHtml;
  chartLightbox.style.display = "";
  chartLightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeChartLightbox() {
  chartLightbox.style.display = "none";
  chartLightbox.setAttribute("aria-hidden", "true");
  chartLightboxBody.innerHTML = "";
  document.body.style.overflow = "";
}

function formatTemplateValue(value, schema) {
  if (!Number.isFinite(value)) return "-";
  if (schema && (
    schema.key === "discipline" ||
    schema.key === "combatAbility" ||
    schema.key === "damageDoneFire" ||
    schema.key === "damageDoneShock" ||
    schema.key === "damageTakenFire" ||
    schema.key === "damageTakenShock" ||
    schema.key === "moraleBonus" ||
    schema.key === "moraleDamageDone" ||
    schema.key === "moraleDamageTaken"
  )) {
    return value + "%";
  }
  if (schema && schema.step && String(schema.step).indexOf(".") >= 0) {
    return value.toFixed(2).replace(/\.?0+$/, "");
  }
  return String(value);
}

function renderCrossTechTemplateDialog() {
  var template = readSide("template");
  var html = "";
  for (var i = 0; i < sideSchemas.template.length; i++) {
    var schema = sideSchemas.template[i];
    html +=
      '<div class="cross-tech-template-item">' +
        '<div class="cross-tech-template-label">' + schema.label + '</div>' +
        '<div class="cross-tech-template-value">' + formatTemplateValue(template[schema.key], schema) + '</div>' +
      '</div>';
  }
  crossTechTemplateGrid.innerHTML = html;
}

function openCrossTechTemplateDialog() {
  renderCrossTechTemplateDialog();
  crossTechTemplateDialog.style.display = "";
  crossTechTemplateDialog.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeCrossTechTemplateDialog() {
  crossTechTemplateDialog.style.display = "none";
  crossTechTemplateDialog.setAttribute("aria-hidden", "true");
  crossTechTemplateGrid.innerHTML = "";
  document.body.style.overflow = "";
}

function updateCrossTechView() {
  crossTechChartsPanel.style.display = crossTechChartsExpanded ? "" : "none";
  toggleCrossTechChartsBtn.textContent = crossTechChartsExpanded ? "收起兵种组成长图" : "展开兵种组成长图";
}

function clearCrossTechConfirmTimers() {
  if (crossTechConfirmTimer) {
    clearTimeout(crossTechConfirmTimer);
    crossTechConfirmTimer = null;
  }
  if (crossTechConfirmCountdown) {
    clearInterval(crossTechConfirmCountdown);
    crossTechConfirmCountdown = null;
  }
}

function closeCrossTechConfirmDialog() {
  clearCrossTechConfirmTimers();
  crossTechConfirmDialog.style.display = "none";
  crossTechConfirmDialog.setAttribute("aria-hidden", "true");
  crossTechConfirmProgress.style.display = "none";
  crossTechConfirmStart.disabled = false;
  crossTechConfirmCancel.disabled = false;
  crossTechConfirmProgressFill.style.width = "0%";
  crossTechConfirmProgressLabel.textContent = "正在准备…";
  crossTechConfirmProgressPercent.textContent = "0%";
}

function startCrossTechRankingFlow() {
  try {
    errorBanner.style.display = "none";
    errorBanner.textContent = "";
    clearCrossTechConfirmTimers();
    crossTechConfirmText.textContent = "正在遍历科技排行，请稍候。";
    crossTechConfirmProgress.style.display = "";
    crossTechConfirmStart.disabled = true;
    crossTechConfirmCancel.disabled = true;
    updateCrossTechProgress(2, "正在启动计算…");
    window.requestAnimationFrame(function() {
      window.requestAnimationFrame(function() {
        setTimeout(function() {
          try {
            calculateCrossTechRanking();
          } catch (error) {
            closeCrossTechConfirmDialog();
            errorBanner.textContent = error.message;
            errorBanner.style.display = "";
          }
        }, 24);
      });
    });
  } catch (error) {
    closeCrossTechConfirmDialog();
    errorBanner.textContent = error.message;
    errorBanner.style.display = "";
  }
}

function updateCrossTechProgress(value, labelText) {
  var progressValue = Math.max(0, Math.min(100, value));
  crossTechConfirmProgressFill.style.width = progressValue + "%";
  crossTechConfirmProgressPercent.textContent = Math.round(progressValue) + "%";
  if (labelText) {
    crossTechConfirmProgressLabel.textContent = labelText;
  }
}

function openCrossTechConfirmDialog() {
  clearCrossTechConfirmTimers();
  var remainingSeconds = 3;
  crossTechConfirmText.textContent = "这个计算可能需要一些时间。" + remainingSeconds + " 秒后将自动开始，你也可以立即开始或取消。";
  crossTechConfirmDialog.style.display = "";
  crossTechConfirmDialog.setAttribute("aria-hidden", "false");
  crossTechConfirmProgress.style.display = "none";
  crossTechConfirmStart.disabled = false;
  crossTechConfirmCancel.disabled = false;

  crossTechConfirmCountdown = setInterval(function() {
    remainingSeconds -= 1;
    if (remainingSeconds <= 0) {
      clearCrossTechConfirmTimers();
      startCrossTechRankingFlow();
      return;
    }
    crossTechConfirmText.textContent = "这个计算可能需要一些时间。" + remainingSeconds + " 秒后将自动开始，你也可以立即开始或取消。";
  }, 1000);

  crossTechConfirmTimer = setTimeout(function() {
    clearCrossTechConfirmTimers();
    startCrossTechRankingFlow();
  }, 3000);
}

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

function fillOptions(select, options, selectedValue) {
  select.innerHTML = "";
  for (const option of options) {
    const node = document.createElement("option");
    node.value = option.value;
    node.textContent = option.label;
    if (option.value === selectedValue) node.selected = true;
    select.append(node);
  }
  if (!select.value && options.length) {
    select.value = options[0].value;
  }
}

function createField(side, schema, mount) {
  const wrapper = document.createElement("label");
  wrapper.className = "field";
  if (schema.wide) wrapper.style.gridColumn = "1 / -1";
  const label = document.createElement("span");
  label.textContent = schema.label;
  wrapper.append(label);

  let control;
  if (schema.type === "select") {
    control = document.createElement("select");
  } else {
    control = document.createElement("input");
    control.type = "number";
    control.value = String(schema.value ?? 0);
    if (schema.step !== undefined) control.step = String(schema.step);
    if (schema.min !== undefined) control.min = String(schema.min);
    if (schema.max !== undefined) control.max = String(schema.max);
  }

  control.id = `${side}-${schema.key}`;
  control.dataset.side = side;
  control.dataset.key = schema.key;
  wrapper.append(control);
  mount.append(wrapper);
  sideState[side][schema.key] = control;
}

function buildPanel(side) {
  const mount = document.querySelector(`#${side}-fields`);
  sideSchemas[side].forEach(schema => createField(side, schema, mount));
}

function selectableUnits(group, unitType, techLevel) {
  let activeTech = -1;
  const matches = [];
  for (const item of UNIT_DATA) {
    const groupMatch = unitType === "Artillery" ? item.group === "Shared" : item.group === group;
    if (!groupMatch || item.unitType !== unitType || item.techLevel > techLevel) continue;
    if (item.techLevel > activeTech) {
      activeTech = item.techLevel;
      matches.length = 0;
    }
    if (item.techLevel === activeTech) {
      matches.push(item);
    }
  }
  return matches;
}

function syncUnitOptions(side) {
  const controls = sideState[side];
  const group = controls.group.value;
  const unitType = controls.unitType.value;
  const techLevel = Math.max(0, Math.min(32, Number(controls.techLevel.value || 0)));
  const units = selectableUnits(group, unitType, techLevel);
  fillOptions(
    controls.unit,
    units.map(item => ({ value: item.unitName, label: translateUnit(item.unitName) })),
    controls.unit.value
  );
}

function initOptions() {
  fillOptions(phaseSelect, PHASES.map(item => ({ value: item.value, label: item.label })), "fire");

  for (const side of ["attacker", "defender"]) {
    fillOptions(
      sideState[side].group,
      groupKeys.map(group => ({ value: group, label: translateGroup(group) })),
      "Western"
    );
    fillOptions(
      sideState[side].unitType,
      UNIT_TYPES.map(type => ({ value: type.value, label: type.label })),
      "Infantry"
    );
    syncUnitOptions(side);
  }
}

function readSide(side) {
  const controls = sideState[side];
  const data = {};
  if (controls.group) data.group = controls.group.value;
  if (controls.unitType) data.unitType = controls.unitType.value;
  if (controls.unit) data.unitName = controls.unit.value;
  if (controls.techLevel) data.techLevel = Number(controls.techLevel.value);
  if (controls.strength) data.strength = Number(controls.strength.value);
  if (controls.combatAbility) data.combatAbility = Number(controls.combatAbility.value);
  if (controls.discipline) data.discipline = Number(controls.discipline.value);
  if (controls.extraMilitaryTactics) data.extraMilitaryTactics = Number(controls.extraMilitaryTactics.value);
  if (controls.fireDamage) data.fireDamage = Number(controls.fireDamage.value);
  if (controls.shockDamage) data.shockDamage = Number(controls.shockDamage.value);
  if (controls.fireDamageInfantry) data.fireDamageInfantry = Number(controls.fireDamageInfantry.value);
  if (controls.fireDamageCavalry) data.fireDamageCavalry = Number(controls.fireDamageCavalry.value);
  if (controls.fireDamageArtillery) data.fireDamageArtillery = Number(controls.fireDamageArtillery.value);
  if (controls.shockDamageInfantry) data.shockDamageInfantry = Number(controls.shockDamageInfantry.value);
  if (controls.shockDamageCavalry) data.shockDamageCavalry = Number(controls.shockDamageCavalry.value);
  if (controls.shockDamageArtillery) data.shockDamageArtillery = Number(controls.shockDamageArtillery.value);
  if (controls.damageDoneFire) data.damageDoneFire = Number(controls.damageDoneFire.value);
  if (controls.damageDoneShock) data.damageDoneShock = Number(controls.damageDoneShock.value);
  if (controls.damageDone) data.damageDone = Number(controls.damageDone.value);
  if (controls.damageTakenFire) data.damageTakenFire = Number(controls.damageTakenFire.value);
  if (controls.damageTakenShock) data.damageTakenShock = Number(controls.damageTakenShock.value);
  if (controls.damageTaken) data.damageTaken = Number(controls.damageTaken.value);
  if (controls.moraleBonus) data.moraleBonus = Number(controls.moraleBonus.value);
  if (controls.armyTradition) data.armyTradition = Number(controls.armyTradition.value);
  if (controls.prestige) data.prestige = Number(controls.prestige.value);
  if (controls.moraleDamageDone) data.moraleDamageDone = Number(controls.moraleDamageDone.value);
  if (controls.moraleDamageTaken) data.moraleDamageTaken = Number(controls.moraleDamageTaken.value);
  if (controls.professionalism) data.professionalism = Number(controls.professionalism.value);
  return data;
}

// ---- Mode toggle ----
function getCalcMode() {
  if (modeRankingRadio.checked) return "ranking";
  if (modeSimRadio.checked) return "simulation";
  return "single";
}

function updateModeUI() {
  var mode = getCalcMode();
  var isSingle = mode === "single";
  var isSim = mode === "simulation";
  var isRanking = mode === "ranking";

  calculateButton.textContent = isRanking ? "开始排行" : "计算双方损失";

  if (uiView === "settings") {
    singleStrip.style.display = isSingle ? "" : "none";
    simStrip.style.display = isSim ? "" : "none";
    templateCard.style.display = isRanking ? "" : "none";
    phaseBox.style.display = isSingle ? "" : "none";
    battleGrid.style.display = isRanking ? "none" : "";
    resultsGrid.style.display = "none";
    simResults.style.display = "none";
    rankingResults.style.display = "none";
    rankingLogSection.style.display = "none";
    crossTechSection.style.display = "none";
    detailsSection.style.display = "none";
    backButton.style.display = "none";
    document.body.className = "settings-view";
  } else {
    singleStrip.style.display = "none";
    simStrip.style.display = "none";
    simDiceStrip.style.display = "none";
    simDiceFixedStrip.style.display = "none";
    templateCard.style.display = "none";
    phaseBox.style.display = "none";
    battleGrid.style.display = "none";
    resultsGrid.style.display = resultMode === "single" || resultMode === "simulation" ? "" : "none";
    simResults.style.display = resultMode === "simulation" ? "" : "none";
    rankingResults.style.display = resultMode === "ranking" ? "" : "none";
    rankingLogSection.style.display = resultMode === "ranking" ? "" : "none";
    crossTechSection.style.display = resultMode === "cross-tech" ? "" : "none";
    if (resultMode === "cross-tech" && crossTechData) {
      updateCrossTechView();
    }
    detailsSection.style.display = resultMode === "single" || resultMode === "simulation" ? "" : "none";
    backButton.style.display = "";
    document.body.className = "result-view";
  }

  updateSimDiceVisibility();
}

function updateSimDiceVisibility() {
  if (!modeSimRadio.checked) {
    simDiceStrip.style.display = "none";
    simDiceFixedStrip.style.display = "none";
    return;
  }
  simDiceStrip.style.display = simDiceMode.value === "manual" ? "" : "none";
  simDiceFixedStrip.style.display = simDiceMode.value === "fixed" ? "" : "none";
}

// ---- Single-phase calculation ----
function calculateSingle() {
  const dice = Number(document.querySelector("#dice").value);
  const leaderDiff = Number(document.querySelector("#leader-diff").value);
  const terrainPenalty = Number(document.querySelector("#terrain-penalty").value);
  const phase = phaseSelect.value;

  [ ["骰子", dice], ["将领差额", leaderDiff], ["进攻地形惩罚", terrainPenalty] ].forEach(([name, value]) => validateNumber(name, value));
  if (dice < 0 || dice > 9) throw new Error("骰子应在 0 到 9 之间。");
  if (terrainPenalty < 0) throw new Error("进攻地形惩罚不能为负数。");

  const attacker = readSide("attacker");
  const defender = readSide("defender");

  for (const side of [attacker, defender]) {
    if (!Number.isInteger(side.techLevel) || side.techLevel < 0 || side.techLevel > 32) {
      throw new Error("双方军事科技都应为 0 到 32 的整数。");
    }
  }

  const attackerToDefender = computeOneWay(attacker, defender, phase, dice, leaderDiff, terrainPenalty, false);
  const defenderToAttacker = computeOneWay(defender, attacker, phase, dice, -leaderDiff, 0, false);

  attackerLossEl.textContent = defenderToAttacker.damage.toFixed(2);
  defenderLossEl.textContent = attackerToDefender.damage.toFixed(2);

  // ---- 士气损失计算 ----
  const attBaseMorale = baseMorale(attacker.techLevel);
  const defBaseMorale = baseMorale(defender.techLevel);
  const attFinalMorale = computeMaxMorale(attacker.techLevel, attacker.moraleBonus, attacker.armyTradition, attacker.prestige);
  const defFinalMorale = computeMaxMorale(defender.techLevel, defender.moraleBonus, defender.armyTradition, defender.prestige);

  const attToDefMorale = computeMoraleDamage(
    Object.assign({}, attacker, { maxMorale: attFinalMorale }),
    Object.assign({}, defender, { maxMorale: defFinalMorale }),
    phase, dice, leaderDiff, terrainPenalty, false, 0, defender.professionalism || 0
  );
  const defToAttMorale = computeMoraleDamage(
    Object.assign({}, defender, { maxMorale: defFinalMorale }),
    Object.assign({}, attacker, { maxMorale: attFinalMorale }),
    phase, dice, -leaderDiff, 0, false, 0, attacker.professionalism || 0
  );

  attackerMoraleLossEl.textContent = defToAttMorale.moraleDamage.toFixed(2);
  defenderMoraleLossEl.textContent = attToDefMorale.moraleDamage.toFixed(2);

  detailsOutput.textContent = [
    "阶段：" + (phase === "fire" ? "火力" : "冲击"),
    "进攻方兵员损失：" + defenderToAttacker.damage.toFixed(2),
    "防守方兵员损失：" + attackerToDefender.damage.toFixed(2),
    "进攻方士气损失：" + defToAttMorale.moraleDamage.toFixed(2),
    "防守方士气损失：" + attToDefMorale.moraleDamage.toFixed(2),
    "",
    "--- 士气参数 ---",
    "进攻方科技基础士气=" + attBaseMorale.toFixed(1) + "  额外士气加成=" + attacker.moraleBonus.toFixed(1) + "%  陆军传统=" + attacker.armyTradition + "  威望=" + attacker.prestige + "  最终最大士气=" + attFinalMorale.toFixed(2),
    "防守方科技基础士气=" + defBaseMorale.toFixed(1) + "  额外士气加成=" + defender.moraleBonus.toFixed(1) + "%  陆军传统=" + defender.armyTradition + "  威望=" + defender.prestige + "  最终最大士气=" + defFinalMorale.toFixed(2),
    "",
    "--- 兵员伤害明细 ---",
    "进攻方 -> 防守方",
    "兵种组：" + translateGroup(attacker.group) + "；兵种：" + translateUnit(attacker.unitName),
    "基础伤亡 = max(15, 15 + 5 x (" + dice.toFixed(2) + " + " + leaderDiff.toFixed(2) + " + " + attackerToDefender.attackerPips.toFixed(2) + " - " + attackerToDefender.defenderPips.toFixed(2) + " - " + terrainPenalty.toFixed(2) + ")) = " + attackerToDefender.baseCasualties.toFixed(2),
    "科技修正 = " + attackerToDefender.tech.toFixed(2) + "（含职业度阶段伤害 +" + attackerToDefender.professionalismBonus.toFixed(2) + "%），守方战术 = " + attackerToDefender.tactics.toFixed(2),
    "",
    "防守方 -> 进攻方",
    "兵种组：" + translateGroup(defender.group) + "；兵种：" + translateUnit(defender.unitName),
    "基础伤亡 = max(15, 15 + 5 x (" + dice.toFixed(2) + " + " + (-leaderDiff).toFixed(2) + " + " + defenderToAttacker.attackerPips.toFixed(2) + " - " + defenderToAttacker.defenderPips.toFixed(2) + " - 0.00)) = " + defenderToAttacker.baseCasualties.toFixed(2),
    "科技修正 = " + defenderToAttacker.tech.toFixed(2) + "（含职业度阶段伤害 +" + defenderToAttacker.professionalismBonus.toFixed(2) + "%），守方战术 = " + defenderToAttacker.tactics.toFixed(2),
    "",
    "--- 士气损失明细 ---",
    "最大士气 = 科技基础士气 x (1 + 额外士气加成 + 陆军传统加成 + 威望加成)",
    "士气损失 = 基础伤亡 x 基础乘数 x (1+士气损失修正) x (1+士气承受伤害修正) x (己方最大士气/540)",
    "进攻方 -> 防守方：基础伤亡=" + attackerToDefender.baseCasualties.toFixed(2) + "  己方士气=" + attFinalMorale.toFixed(2) + "  -> 士气损失=" + attToDefMorale.moraleDamage.toFixed(2),
    "防守方 -> 进攻方：基础伤亡=" + defenderToAttacker.baseCasualties.toFixed(2) + "  己方士气=" + defFinalMorale.toFixed(2) + "  -> 士气损失=" + defToAttMorale.moraleDamage.toFixed(2),
    "防守方被动士气损耗/天：" + attToDefMorale.passiveMoraleLoss.toFixed(4) + "（职业度 100 时减半）",
    "进攻方被动士气损耗/天：" + defToAttMorale.passiveMoraleLoss.toFixed(4) + "（职业度 100 时减半）"
  ].join("\n");
}

// ---- Simulation ----
function parseDiceArray(text, fieldName) {
  if (!text || !text.trim()) return null;
  var parts = text.trim().split(/\s*,\s*/);
  var arr = [];
  for (var i = 0; i < parts.length; i++) {
    var v = parseInt(parts[i], 10);
    if (isNaN(v) || v < 0 || v > 9) {
      throw new Error(fieldName + " 中第" + (i + 1) + "个值 '" + parts[i] + "' 不是有效的 0-9 骰子。");
    }
    arr.push(v);
  }
  return arr;
}

function readSimulationBattleOptions(rounds, forOpenEnded) {
  var leaderDiff = parseFloat(simLeaderDiff.value) || 0;
  var terrainPenalty = parseFloat(simTerrainPenalty.value) || 0;
  if (terrainPenalty < 0) throw new Error("进攻地形惩罚不能为负数。");

  var phaseModeRaw = simPhaseMode.value;
  var phaseOnly = (phaseModeRaw === "alternate") ? null : phaseModeRaw;

  var diceConfig = {};
  if (simDiceMode.value === "manual") {
    var fireArr = parseDiceArray(simDiceFire.value, "火力骰子序列");
    var shockArr = parseDiceArray(simDiceShock.value, "冲击骰子序列");
    if (fireArr !== null) diceConfig.fire = fireArr;
    if (shockArr !== null) diceConfig.shock = shockArr;
  } else if (simDiceMode.value === "fixed") {
    var fixedVal = parseInt(simDiceFixedValue.value, 10);
    if (isNaN(fixedVal) || fixedVal < 0 || fixedVal > 9) {
      throw new Error("固定骰子值应在 0 到 9 之间。");
    }
    if (forOpenEnded) {
      diceConfig.mode = "fixed";
      diceConfig.value = fixedVal;
    } else {
      diceConfig.fire = Array(rounds).fill(fixedVal);
      diceConfig.shock = Array(rounds).fill(fixedVal);
    }
  } else if (forOpenEnded) {
    diceConfig.mode = "random";
  }

  return {
    leaderDiff: leaderDiff,
    terrainPenalty: terrainPenalty,
    phaseOnly: phaseOnly,
    diceConfig: diceConfig,
    diceMode: simDiceMode.value
  };
}

function calculateSimulation() {
  var rounds = parseInt(simRounds.value, 10);
  if (isNaN(rounds) || rounds < 1 || rounds > 20) {
    throw new Error("轮次数应在 1 到 20 之间。");
  }
  var battleOptions = readSimulationBattleOptions(rounds, false);

  var attacker = readSide("attacker");
  var defender = readSide("defender");

  for (var si = 0; si < 2; si++) {
    var side = si === 0 ? attacker : defender;
    if (!Number.isInteger(side.techLevel) || side.techLevel < 0 || side.techLevel > 32) {
      throw new Error("双方军事科技都应为 0 到 32 的整数。");
    }
  }

  var result = simulateBattleWithMorale(
    attacker,
    defender,
    rounds,
    battleOptions.diceConfig,
    battleOptions.leaderDiff,
    battleOptions.terrainPenalty,
    false,
    battleOptions.phaseOnly
  );

  renderSimResults(result, attacker, defender, battleOptions.phaseOnly);

  // Also show single-phase style result cards for total losses
  attackerLossEl.textContent = result.totalAttackerStrengthLoss.toFixed(2);
  defenderLossEl.textContent = result.totalDefenderStrengthLoss.toFixed(2);
  attackerMoraleLossEl.textContent = result.totalAttackerMoraleLoss.toFixed(2);
  defenderMoraleLossEl.textContent = result.totalDefenderMoraleLoss.toFixed(2);
  uiView = "results";
  resultMode = "simulation";
  updateModeUI();

  // Build detailed breakdown
  var lines = [];
  lines.push("=== 多轮模拟结果（含士气） ===");
  lines.push("总天数：" + result.totalDays + "  轮数：" + result.rounds.length);
  lines.push("说明：当前模型按每个兵种初始 1000 兵且固定前排计算。");
  lines.push("");
  lines.push("--- 兵员 ---");
  lines.push("进攻方初始兵力：" + result.initialAttackerStrength + "  →  剩余：" + result.finalAttackerStrength.toFixed(2) + "  （损失 " + result.totalAttackerStrengthLoss.toFixed(2) + "）");
  lines.push("防守方初始兵力：" + result.initialDefenderStrength + "  →  剩余：" + result.finalDefenderStrength.toFixed(2) + "  （损失 " + result.totalDefenderStrengthLoss.toFixed(2) + "）");
  lines.push("");
  lines.push("--- 士气 ---");
  lines.push("进攻方团数：" + result.attRegiments + "  每团最大士气：" + result.attMaxMoralePerRegiment.toFixed(2) + "  初始总士气：" + result.initialAttackerMorale.toFixed(2) + "  →  剩余：" + result.finalAttackerMorale.toFixed(2) + "  （损失 " + result.totalAttackerMoraleLoss.toFixed(2) + "）");
  lines.push("防守方团数：" + result.defRegiments + "  每团最大士气：" + result.defMaxMoralePerRegiment.toFixed(2) + "  初始总士气：" + result.initialDefenderMorale.toFixed(2) + "  →  剩余：" + result.finalDefenderMorale.toFixed(2) + "  （损失 " + result.totalDefenderMoraleLoss.toFixed(2) + "）");
  if (result.attackerMoraleBreakDay !== null) {
    lines.push("进攻方士气溃败日：第" + result.attackerMoraleBreakDay + "天");
  }
  if (result.defenderMoraleBreakDay !== null) {
    lines.push("防守方士气溃败日：第" + result.defenderMoraleBreakDay + "天");
  }

  var winnerText = result.winner === "attacker" ? "进攻方" : (result.winner === "defender" ? "防守方" : "平局");
  if (result.winReason) {
    winnerText += "（" + result.winReason + "）";
  }
  lines.push("");
  lines.push("获胜方：" + winnerText);

  lines.push("");
  lines.push("--- 每日明细 ---");
  for (var r = 0; r < result.rounds.length; r++) {
    var rr = result.rounds[r];
    lines.push("第" + rr.round + "轮：");
    if (rr.fire) {
      lines.push("  火力阶段（骰子=" + rr.fire.dice + "）：攻方兵损=" + rr.fire.attackerStrengthLoss.toFixed(2) + " 守方兵损=" + rr.fire.defenderStrengthLoss.toFixed(2) + " 攻方士气损=" + rr.fire.attackerMoraleLoss.toFixed(2) + " 守方士气损=" + rr.fire.defenderMoraleLoss.toFixed(2));
      for (var di = 0; di < rr.fire.days.length; di++) {
        var day = rr.fire.days[di];
        lines.push("    第" + day.day + "天  攻方兵伤=" + day.attackerStrengthDmg.toFixed(2) + " 守方兵伤=" + day.defenderStrengthDmg.toFixed(2) + "  攻方剩=" + day.attackerStrengthRemaining.toFixed(2) + " 守方剩=" + day.defenderStrengthRemaining.toFixed(2) + "  攻方士气(主动=" + day.attackerMoraleLoss.toFixed(2) + "+被动=" + day.attackerPassiveMoraleLoss.toFixed(2) + ")=" + day.attackerCurrentMorale.toFixed(2) + " 守方士气(主动=" + day.defenderMoraleLoss.toFixed(2) + "+被动=" + day.defenderPassiveMoraleLoss.toFixed(2) + ")=" + day.defenderCurrentMorale.toFixed(2) + "  攻溃败=" + day.attackerBrokenRegiments + " 守溃败=" + day.defenderBrokenRegiments);
      }
    }
    if (rr.shock) {
      lines.push("  冲击阶段（骰子=" + rr.shock.dice + "）：攻方兵损=" + rr.shock.attackerStrengthLoss.toFixed(2) + " 守方兵损=" + rr.shock.defenderStrengthLoss.toFixed(2) + " 攻方士气损=" + rr.shock.attackerMoraleLoss.toFixed(2) + " 守方士气损=" + rr.shock.defenderMoraleLoss.toFixed(2));
      for (di = 0; di < rr.shock.days.length; di++) {
        var day2 = rr.shock.days[di];
        lines.push("    第" + day2.day + "天  攻方兵伤=" + day2.attackerStrengthDmg.toFixed(2) + " 守方兵伤=" + day2.defenderStrengthDmg.toFixed(2) + "  攻方剩=" + day2.attackerStrengthRemaining.toFixed(2) + " 守方剩=" + day2.defenderStrengthRemaining.toFixed(2) + "  攻方士气=" + day2.attackerCurrentMorale.toFixed(2) + " 守方士气=" + day2.defenderCurrentMorale.toFixed(2) + "  攻方后备士气损耗/天=" + day2.attackerPassiveMoraleLoss.toFixed(4) + " 守方后备士气损耗/天=" + day2.defenderPassiveMoraleLoss.toFixed(4) + "  攻溃败=" + day2.attackerBrokenRegiments + " 守溃败=" + day2.defenderBrokenRegiments);
      }
    }
  }

  detailsOutput.textContent = lines.join("\n");
}

function renderSimResults(result, attacker, defender, phaseOnly) {
  // Summary cards
  var winnerClass = result.winner === "attacker" ? "win" : (result.winner === "defender" ? "lose" : "draw");
  var attClass = result.winner === "attacker" ? "win" : (result.winner === "defender" ? "lose" : "draw");
  var defClass = result.winner === "defender" ? "win" : (result.winner === "attacker" ? "lose" : "draw");

  var winnerLabel = result.winner === "attacker" ? "进攻方" : (result.winner === "defender" ? "防守方" : "平局");
  if (result.winReason) {
    winnerLabel += "（" + result.winReason + "）";
  }
  var attBreakLabel = result.attackerMoraleBreakDay === null ? "未溃败" : ("第" + result.attackerMoraleBreakDay + "天");
  var defBreakLabel = result.defenderMoraleBreakDay === null ? "未溃败" : ("第" + result.defenderMoraleBreakDay + "天");

  var attMoralePct = result.initialAttackerMorale > 0 ? (result.finalAttackerMorale / result.initialAttackerMorale * 100).toFixed(0) : 0;
  var defMoralePct = result.initialDefenderMorale > 0 ? (result.finalDefenderMorale / result.initialDefenderMorale * 100).toFixed(0) : 0;

  simSummary.innerHTML =
    '<div class="sim-summary-item">' +
      '<span class="label">获胜方</span>' +
      '<span class="value ' + winnerClass + '">' + winnerLabel + '</span>' +
    '</div>' +
    '<div class="sim-summary-item">' +
      '<span class="label">总天数</span>' +
      '<span class="value">' + result.totalDays + '</span>' +
    '</div>' +
    '<div class="sim-summary-item">' +
      '<span class="label">攻方初始兵力</span>' +
      '<span class="value">' + result.initialAttackerStrength + '</span>' +
    '</div>' +
    '<div class="sim-summary-item">' +
      '<span class="label">攻方剩余兵力</span>' +
      '<span class="value ' + attClass + '">' + result.finalAttackerStrength.toFixed(2) + '</span>' +
    '</div>' +
    '<div class="sim-summary-item">' +
      '<span class="label">攻方初始士气</span>' +
      '<span class="value">' + result.initialAttackerMorale.toFixed(2) + '</span>' +
    '</div>' +
    '<div class="sim-summary-item">' +
      '<span class="label">攻方剩余士气</span>' +
      '<span class="value ' + attClass + '">' + result.finalAttackerMorale.toFixed(2) + '（' + attMoralePct + '%）</span>' +
    '</div>' +
    '<div class="sim-summary-item">' +
      '<span class="label">攻方溃败日</span>' +
      '<span class="value ' + attClass + '">' + attBreakLabel + '</span>' +
    '</div>' +
    '<div class="sim-summary-item">' +
      '<span class="label">守方初始兵力</span>' +
      '<span class="value">' + result.initialDefenderStrength + '</span>' +
    '</div>' +
    '<div class="sim-summary-item">' +
      '<span class="label">守方剩余兵力</span>' +
      '<span class="value ' + defClass + '">' + result.finalDefenderStrength.toFixed(2) + '</span>' +
    '</div>' +
    '<div class="sim-summary-item">' +
      '<span class="label">守方初始士气</span>' +
      '<span class="value">' + result.initialDefenderMorale.toFixed(2) + '</span>' +
    '</div>' +
    '<div class="sim-summary-item">' +
      '<span class="label">守方剩余士气</span>' +
      '<span class="value ' + defClass + '">' + result.finalDefenderMorale.toFixed(2) + '（' + defMoralePct + '%）</span>' +
    '</div>' +
    '<div class="sim-summary-item">' +
      '<span class="label">守方溃败日</span>' +
      '<span class="value ' + defClass + '">' + defBreakLabel + '</span>' +
    '</div>';

  // Table rows
  var rows = "";
  var attStrRemaining = result.initialAttackerStrength;
  var defStrRemaining = result.initialDefenderStrength;
  var attMorRemaining = result.initialAttackerMorale;
  var defMorRemaining = result.initialDefenderMorale;

  for (var r = 0; r < result.rounds.length; r++) {
    var rr = result.rounds[r];
    var fireDice = rr.fire ? rr.fire.dice : "-";
    var shockDice = rr.shock ? rr.shock.dice : "-";

    // Strength losses
    var fireAttStrLoss = rr.fire ? rr.fire.attackerStrengthLoss : 0;
    var fireDefStrLoss = rr.fire ? rr.fire.defenderStrengthLoss : 0;
    var shockAttStrLoss = rr.shock ? rr.shock.attackerStrengthLoss : 0;
    var shockDefStrLoss = rr.shock ? rr.shock.defenderStrengthLoss : 0;
    var roundAttStrLoss = fireAttStrLoss + shockAttStrLoss;
    var roundDefStrLoss = fireDefStrLoss + shockDefStrLoss;

    // Morale losses
    var fireAttMorLoss = rr.fire ? rr.fire.attackerMoraleLoss : 0;
    var fireDefMorLoss = rr.fire ? rr.fire.defenderMoraleLoss : 0;
    var shockAttMorLoss = rr.shock ? rr.shock.attackerMoraleLoss : 0;
    var shockDefMorLoss = rr.shock ? rr.shock.defenderMoraleLoss : 0;
    var roundAttMorLoss = fireAttMorLoss + shockAttMorLoss;
    var roundDefMorLoss = fireDefMorLoss + shockDefMorLoss;

    // Broken regiments (from last day of the round)
    var lastDay = null;
    if (rr.shock && rr.shock.days && rr.shock.days.length > 0) {
      lastDay = rr.shock.days[rr.shock.days.length - 1];
    } else if (rr.fire && rr.fire.days && rr.fire.days.length > 0) {
      lastDay = rr.fire.days[rr.fire.days.length - 1];
    }
    var attBroken = lastDay ? lastDay.attackerBrokenRegiments : 0;
    var defBroken = lastDay ? lastDay.defenderBrokenRegiments : 0;

    attStrRemaining -= roundAttStrLoss;
    defStrRemaining -= roundDefStrLoss;
    attMorRemaining -= roundAttMorLoss;
    defMorRemaining -= roundDefMorLoss;

    rows +=
      '<tr>' +
        '<td>' + rr.round + '</td>' +
        '<td>' + fireDice + '</td>' +
        '<td>' + shockDice + '</td>' +
        '<td>' + fireAttStrLoss.toFixed(2) + '</td>' +
        '<td>' + fireDefStrLoss.toFixed(2) + '</td>' +
        '<td>' + shockAttStrLoss.toFixed(2) + '</td>' +
        '<td>' + shockDefStrLoss.toFixed(2) + '</td>' +
        '<td>' + roundAttStrLoss.toFixed(2) + '</td>' +
        '<td>' + roundDefStrLoss.toFixed(2) + '</td>' +
        '<td>' + roundAttMorLoss.toFixed(2) + '</td>' +
        '<td>' + roundDefMorLoss.toFixed(2) + '</td>' +
        '<td>' + Math.max(0, attStrRemaining).toFixed(2) + '</td>' +
        '<td>' + Math.max(0, defStrRemaining).toFixed(2) + '</td>' +
        '<td>' + Math.max(0, attMorRemaining).toFixed(2) + '</td>' +
        '<td>' + Math.max(0, defMorRemaining).toFixed(2) + '</td>' +
        '<td>' + attBroken + '/' + result.attRegiments + '</td>' +
        '<td>' + defBroken + '/' + result.defRegiments + '</td>' +
      '</tr>';
  }

  // Total row
  rows +=
    '<tr class="total-row">' +
      '<td>总计</td>' +
      '<td>-</td>' +
      '<td>-</td>' +
      '<td>' + result.rounds.reduce(function(s, rr) { return s + (rr.fire ? rr.fire.attackerStrengthLoss : 0); }, 0).toFixed(2) + '</td>' +
      '<td>' + result.rounds.reduce(function(s, rr) { return s + (rr.fire ? rr.fire.defenderStrengthLoss : 0); }, 0).toFixed(2) + '</td>' +
      '<td>' + result.rounds.reduce(function(s, rr) { return s + (rr.shock ? rr.shock.attackerStrengthLoss : 0); }, 0).toFixed(2) + '</td>' +
      '<td>' + result.rounds.reduce(function(s, rr) { return s + (rr.shock ? rr.shock.defenderStrengthLoss : 0); }, 0).toFixed(2) + '</td>' +
      '<td>' + result.totalAttackerStrengthLoss.toFixed(2) + '</td>' +
      '<td>' + result.totalDefenderStrengthLoss.toFixed(2) + '</td>' +
      '<td>' + result.totalAttackerMoraleLoss.toFixed(2) + '</td>' +
      '<td>' + result.totalDefenderMoraleLoss.toFixed(2) + '</td>' +
      '<td>' + result.finalAttackerStrength.toFixed(2) + '</td>' +
      '<td>' + result.finalDefenderStrength.toFixed(2) + '</td>' +
      '<td>' + result.finalAttackerMorale.toFixed(2) + '</td>' +
      '<td>' + result.finalDefenderMorale.toFixed(2) + '</td>' +
      '<td>-</td>' +
      '<td>-</td>' +
    '</tr>';

  simTbody.innerHTML = rows;

  renderDailyLog(result);
}

function renderDailyLog(result) {
  var tbody = document.querySelector("#daily-log-tbody");
  var rows = "";
  var phaseLabel = { fire: "火力", shock: "冲击" };

  for (var r = 0; r < result.rounds.length; r++) {
    var rr = result.rounds[r];
    if (rr.fire) {
      for (var di = 0; di < rr.fire.days.length; di++) {
        var day = rr.fire.days[di];
        rows +=
          '<tr>' +
            '<td>' + day.day + '</td>' +
            '<td>' + phaseLabel.fire + '</td>' +
            '<td>' + rr.fire.dice + '</td>' +
            '<td>' + day.attackerStrengthDmg.toFixed(2) + '</td>' +
            '<td>' + day.defenderStrengthDmg.toFixed(2) + '</td>' +
            '<td>' + day.attackerStrengthLoss.toFixed(2) + '</td>' +
            '<td>' + day.defenderStrengthLoss.toFixed(2) + '</td>' +
            '<td>' + Math.max(0, day.attackerStrengthRemaining).toFixed(2) + '</td>' +
            '<td>' + Math.max(0, day.defenderStrengthRemaining).toFixed(2) + '</td>' +
            '<td>' + day.attackerMoraleLoss.toFixed(2) + '</td>' +
            '<td>' + day.defenderMoraleLoss.toFixed(2) + '</td>' +
            '<td>' + day.attackerPassiveMoraleLoss.toFixed(2) + '</td>' +
            '<td>' + day.defenderPassiveMoraleLoss.toFixed(2) + '</td>' +
            '<td>' + Math.max(0, day.attackerCurrentMorale).toFixed(2) + '</td>' +
            '<td>' + Math.max(0, day.defenderCurrentMorale).toFixed(2) + '</td>' +
            '<td>' + day.attackerBrokenRegiments + '/' + result.attRegiments + '</td>' +
            '<td>' + day.defenderBrokenRegiments + '/' + result.defRegiments + '</td>' +
          '</tr>';
      }
    }
    if (rr.shock) {
      for (di = 0; di < rr.shock.days.length; di++) {
        var day2 = rr.shock.days[di];
        rows +=
          '<tr>' +
            '<td>' + day2.day + '</td>' +
            '<td>' + phaseLabel.shock + '</td>' +
            '<td>' + rr.shock.dice + '</td>' +
            '<td>' + day2.attackerStrengthDmg.toFixed(2) + '</td>' +
            '<td>' + day2.defenderStrengthDmg.toFixed(2) + '</td>' +
            '<td>' + day2.attackerStrengthLoss.toFixed(2) + '</td>' +
            '<td>' + day2.defenderStrengthLoss.toFixed(2) + '</td>' +
            '<td>' + Math.max(0, day2.attackerStrengthRemaining).toFixed(2) + '</td>' +
            '<td>' + Math.max(0, day2.defenderStrengthRemaining).toFixed(2) + '</td>' +
            '<td>' + day2.attackerMoraleLoss.toFixed(2) + '</td>' +
            '<td>' + day2.defenderMoraleLoss.toFixed(2) + '</td>' +
            '<td>' + day2.attackerPassiveMoraleLoss.toFixed(2) + '</td>' +
            '<td>' + day2.defenderPassiveMoraleLoss.toFixed(2) + '</td>' +
            '<td>' + Math.max(0, day2.attackerCurrentMorale).toFixed(2) + '</td>' +
            '<td>' + Math.max(0, day2.defenderCurrentMorale).toFixed(2) + '</td>' +
            '<td>' + day2.attackerBrokenRegiments + '/' + result.attRegiments + '</td>' +
            '<td>' + day2.defenderBrokenRegiments + '/' + result.defRegiments + '</td>' +
          '</tr>';
      }
    }
  }

  tbody.innerHTML = rows;
}

function formatTournamentCandidate(candidate) {
  return translateGroup(candidate.group) + " / " + translateUnitType(candidate.unitType) + " / " + translateUnit(candidate.unitName);
}

function buildRankingLogText(result, template, battleOptions) {
  var lines = [];
  lines.push("=== 全兵种排行日志 ===");
  lines.push("模板来源：当前模板");
  lines.push(
    "科技=" + template.techLevel +
    "  兵力=" + template.strength +
    "  作战能力=" + template.combatAbility +
    "%  训练度=" + template.discipline +
    "%  额外战术=" + template.extraMilitaryTactics.toFixed(2)
  );
  lines.push(
    "步兵火力=" + template.fireDamageInfantry +
    "  骑兵火力=" + template.fireDamageCavalry +
    "  炮兵火力=" + template.fireDamageArtillery +
    "  步/骑/炮冲击=" + template.shockDamageInfantry + "/" + template.shockDamageCavalry + "/" + template.shockDamageArtillery
  );
  lines.push(
    "造成火力伤害=" + template.damageDoneFire +
    "%  造成冲击伤害=" + template.damageDoneShock +
    "%  承受火力伤害=" + template.damageTakenFire +
    "%  承受冲击伤害=" + template.damageTakenShock +
    "%  额外士气=" + template.moraleBonus +
    "%  陆军传统=" + template.armyTradition +
    "  威望=" + template.prestige +
    "  造成士气伤害=" + template.moraleDamageDone +
    "%  承受士气伤害=" + template.moraleDamageTaken +
    "%  职业度=" + template.professionalism
  );
  lines.push(
    "阶段模式=" + (battleOptions.phaseOnly === null ? "火力+冲击交替" : (battleOptions.phaseOnly === "fire" ? "仅火力" : "仅冲击")) +
    "  骰子模式=" + (battleOptions.diceMode === "fixed" ? "固定骰子 5" : (battleOptions.diceMode === "manual" ? "手动序列循环" : "全部随机")) +
    "  将领差额=" + battleOptions.leaderDiff +
    "  进攻地形惩罚=" + battleOptions.terrainPenalty
  );
  lines.push("候选兵种数：" + result.candidates.length + "  配对组合数：" + result.totalPairs + "  实际对战场次：" + result.totalMatches);
  lines.push("");
  lines.push("--- 排行 ---");
  for (var i = 0; i < result.rankings.length; i++) {
    var entry = result.rankings[i];
    lines.push(
      (i + 1) + ". " + formatTournamentCandidate(entry.candidate) +
      "  积分=" + entry.points +
      "  胜/平/负=" + entry.wins + "/" + entry.draws + "/" + entry.losses +
      "  兵损(造/承)=" + entry.totalStrengthInflicted.toFixed(2) + "/" + entry.totalStrengthTaken.toFixed(2) +
      "  士气(造/承)=" + entry.totalMoraleInflicted.toFixed(2) + "/" + entry.totalMoraleTaken.toFixed(2)
    );
  }
  lines.push("");
  lines.push("--- 配对日志 ---");
  for (i = 0; i < result.matchLogs.length; i++) {
    var log = result.matchLogs[i];
    var matchResult = log.result;
    var winnerLabel = matchResult.winner === "attacker" ? formatTournamentCandidate(log.attacker) :
      (matchResult.winner === "defender" ? formatTournamentCandidate(log.defender) : "平局");
    lines.push(
      "[" + log.id + "] 配对#" + log.pairId + " 第" + log.leg + "场  " +
      formatTournamentCandidate(log.attacker) + " 攻  vs  " +
      formatTournamentCandidate(log.defender) + " 守"
    );
    lines.push(
      "    结果：" + winnerLabel + "  " + matchResult.winReason +
      "  结束方式=" + matchResult.endedBy +
      "  总天数=" + matchResult.totalDays
    );
    lines.push(
      "    攻方兵损=" + matchResult.totalAttackerStrengthLoss.toFixed(2) +
      "  守方兵损=" + matchResult.totalDefenderStrengthLoss.toFixed(2) +
      "  攻方士气损=" + matchResult.totalAttackerMoraleLoss.toFixed(2) +
      "  守方士气损=" + matchResult.totalDefenderMoraleLoss.toFixed(2)
    );
    lines.push(
      "    攻方剩余兵力/士气=" + matchResult.finalAttackerStrength.toFixed(2) + "/" + matchResult.finalAttackerMorale.toFixed(2) +
      "  守方剩余兵力/士气=" + matchResult.finalDefenderStrength.toFixed(2) + "/" + matchResult.finalDefenderMorale.toFixed(2)
    );
  }
  return lines.join("\n");
}

function renderRankingResults(result, battleOptions) {
  var topEntry = result.rankings[0];
  rankingSummary.innerHTML =
    '<div class="sim-summary-item">' +
      '<span class="label">模板来源</span>' +
      '<span class="value">当前模板</span>' +
    '</div>' +
    '<div class="sim-summary-item">' +
      '<span class="label">候选兵种数</span>' +
      '<span class="value">' + result.candidates.length + '</span>' +
    '</div>' +
    '<div class="sim-summary-item">' +
      '<span class="label">配对组合数</span>' +
      '<span class="value">' + result.totalPairs + '</span>' +
    '</div>' +
    '<div class="sim-summary-item">' +
      '<span class="label">总对战场次</span>' +
      '<span class="value">' + result.totalMatches + '</span>' +
    '</div>' +
    '<div class="sim-summary-item">' +
      '<span class="label">阶段模式</span>' +
      '<span class="value">' + (battleOptions.phaseOnly === null ? "火力+冲击交替" : (battleOptions.phaseOnly === "fire" ? "仅火力" : "仅冲击")) + '</span>' +
    '</div>' +
    '<div class="sim-summary-item">' +
      '<span class="label">骰子模式</span>' +
      '<span class="value">固定骰子 5</span>' +
    '</div>' +
    '<div class="sim-summary-item">' +
      '<span class="label">排名第一</span>' +
      '<span class="value win">' + formatTournamentCandidate(topEntry.candidate) + '</span>' +
    '</div>';

  var rows = "";
  for (var i = 0; i < result.rankings.length; i++) {
    var entry = result.rankings[i];
    rows +=
      '<tr>' +
        '<td>' + (i + 1) + '</td>' +
        '<td class="text-left">' + translateUnitType(entry.candidate.unitType) + '</td>' +
        '<td class="text-left">' + translateGroup(entry.candidate.group) + '</td>' +
        '<td class="text-left">' + translateUnit(entry.candidate.unitName) + '</td>' +
        '<td>' + entry.points + '</td>' +
        '<td>' + entry.wins + '</td>' +
        '<td>' + entry.draws + '</td>' +
        '<td>' + entry.losses + '</td>' +
        '<td>' + entry.totalStrengthInflicted.toFixed(2) + '</td>' +
        '<td>' + entry.totalStrengthTaken.toFixed(2) + '</td>' +
        '<td>' + entry.totalMoraleInflicted.toFixed(2) + '</td>' +
        '<td>' + entry.totalMoraleTaken.toFixed(2) + '</td>' +
      '</tr>';
  }
  rankingTbody.innerHTML = rows;
}

function renderRankingLogPreview(logText) {
  var lines = logText.split("\n");
  var previewLimit = 120;
  if (lines.length <= previewLimit) {
    rankingLogOutput.textContent = logText;
  } else {
    rankingLogOutput.textContent = lines.slice(0, previewLimit).join("\n") + "\n\n... 已截断，其余 " + (lines.length - previewLimit) + " 行请下载完整日志查看。";
  }
  rankingLogSection.style.display = "";
}

function downloadRankingLog() {
  if (!latestRankingLogText) return;
  var stamp = new Date().toISOString().replace(/[:.]/g, "-");
  var link = document.createElement("a");
  link.href = URL.createObjectURL(new Blob([latestRankingLogText], { type: "text/plain;charset=utf-8" }));
  link.download = "calc_mil_ranking_log_" + stamp + ".txt";
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(function() {
    URL.revokeObjectURL(link.href);
  }, 0);
}

function calculateRanking() {
  var template = readSide("template");
  if (!Number.isInteger(template.techLevel) || template.techLevel < 0 || template.techLevel > 32) {
    throw new Error("排行基准军事科技应为 0 到 32 的整数。");
  }

  var battleOptions = {
    leaderDiff: 0,
    terrainPenalty: 0,
    phaseOnly: null,
    diceConfig: { mode: "fixed", value: 5 },
    diceMode: "fixed"
  };

  var result = runUnitTournament(template, battleOptions);
  renderRankingResults(result, battleOptions);

  latestRankingLogText = buildRankingLogText(result, template, battleOptions);
  renderRankingLogPreview(latestRankingLogText);
  downloadRankingLogButton.disabled = false;
  uiView = "results";
  resultMode = "ranking";
  updateModeUI();
}

// ---- Cross-tech ranking ----

function runCrossTechRanking(template, battleOptions, onProgress, onComplete) {
  var templateKey = buildCrossTechTemplateKey(template, battleOptions);
  if (crossTechData && latestCrossTechTemplateKey === templateKey) {
    if (onComplete) onComplete(crossTechData);
    return;
  }

  var workingTemplate = cloneDataShallow(template);
  var results = [];
  var maxCols = 0;

  function processNext(index) {
    try {
      if (index >= 33) {
        crossTechData = { results: results, maxCols: maxCols, templateKey: templateKey };
        latestCrossTechTemplateKey = templateKey;
        if (onComplete) onComplete(crossTechData);
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

function calculateCrossTechRanking() {
  var runToken = ++crossTechRunToken;
  var totalTechCount = 33;
  var template = readSide("template");
  var battleOptions = {
    leaderDiff: 0,
    terrainPenalty: 0,
    phaseOnly: null,
    diceConfig: { mode: "fixed", value: 5 },
    diceMode: "fixed"
  };

  crossTechRankingBtn.disabled = true;
  updateCrossTechProgress(4, "正在准备遍历科技排行…");

  runCrossTechRanking(
    template,
    battleOptions,
    function(processedCount, candidateCount) {
      if (runToken !== crossTechRunToken) return;
      var ratio = Math.max(0, Math.min(1, processedCount / totalTechCount));
      var progressValue = ratio * 80;
      updateCrossTechProgress(progressValue, "正在计算科技 " + (processedCount - 1) + "/32（候选兵种 " + candidateCount + " 个）…");
    },
    function(data) {
      if (runToken !== crossTechRunToken) return;
      crossTechRankingBtn.disabled = false;
      renderCrossTechResultsWithProgress(data.results, data.maxCols, runToken);
    }
  );
}

function buildGroupPeakSeries(results, primaryUnitType, includeArtillery, recomputeFilteredRanks) {
  var groupRanks = {};
  var groupOrder = [];
  includeArtillery = includeArtillery !== false;
  recomputeFilteredRanks = !!recomputeFilteredRanks;

  for (var i = 0; i < results.length; i++) {
    var row = results[i];
    var techRanks = {};
    var filteredEntries = [];

    for (var j = 0; j < row.rankings.length; j++) {
      var entry = row.rankings[j];
      var candidate = entry.candidate;
      if (candidate.unitType !== primaryUnitType && !(includeArtillery && candidate.unitType === "Artillery")) continue;
      filteredEntries.push(entry);
    }

    for (j = 0; j < filteredEntries.length; j++) {
      entry = filteredEntries[j];
      candidate = entry.candidate;
      var groupKey = candidate.unitType === "Artillery" ? "Shared" : candidate.group;
      var rankValue = recomputeFilteredRanks ? (j + 1) : (row.rankings.indexOf(entry) + 1);
      if (!techRanks[groupKey] || techRanks[groupKey] > rankValue) {
        techRanks[groupKey] = rankValue;
      }
    }

    var keys = Object.keys(techRanks);
    for (var k = 0; k < keys.length; k++) {
      var groupKey = keys[k];
      if (!groupRanks[groupKey]) {
        groupRanks[groupKey] = [];
        groupOrder.push(groupKey);
      }
      groupRanks[groupKey].push({ techLevel: row.techLevel, rank: techRanks[groupKey] });
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
    svg += '<path d="' + path.join(" ") + '" fill="none" stroke="' + group.color + '" stroke-width="' + (group.key === "Shared" ? "3" : "2.2") + '" stroke-linecap="round" stroke-linejoin="round"></path>';
    for (p = 0; p < group.points.length; p++) {
      pt = group.points[p];
      svg += '<circle cx="' + xForTech(pt.techLevel).toFixed(2) + '" cy="' + yForRank(pt.rank).toFixed(2) + '" r="' + (group.key === "Shared" ? "3.4" : "2.6") + '" fill="' + group.color + '"><title>' + group.label + ' | 科技 ' + pt.techLevel + ' | 第 ' + pt.rank + ' 名</title></circle>';
    }
  }

  svg += '</svg>';

  var legend = '<div class="cross-tech-chart-legend">';
  for (i = 0; i < seriesData.groups.length; i++) {
    group = seriesData.groups[i];
    legend += '<span class="cross-tech-chart-legend-item"><span class="cross-tech-chart-legend-swatch" style="background:' + group.color + ';"></span>' + group.label + '</span>';
  }
  legend += '</div>';

  container.innerHTML = '<div class="cross-tech-chart-shell">' + svg + legend + '</div>';
}

function renderCrossTechSummary(results) {
  if (!results.length) {
    crossTechTechRange.textContent = "";
    showCrossTechTemplateBtn.disabled = true;
    return;
  }
  crossTechTechRange.textContent = "科技 " + results[0].techLevel + " – " + results[results.length - 1].techLevel;
  showCrossTechTemplateBtn.disabled = false;
}

function renderCrossTechCharts(results) {
  renderCrossTechLineChart(crossTechInfantryChart, buildGroupPeakSeries(results, "Infantry", true, false), "步兵");
  renderCrossTechLineChart(crossTechCavalryChart, buildGroupPeakSeries(results, "Cavalry", true, false), "骑兵");
  renderCrossTechLineChart(crossTechInfantryOnlyChart, buildGroupPeakSeries(results, "Infantry", false, true), "纯步兵");
  renderCrossTechLineChart(crossTechCavalryOnlyChart, buildGroupPeakSeries(results, "Cavalry", false, true), "纯骑兵");
  bindChartPreview(crossTechInfantryChart, "步兵组最佳排名");
  bindChartPreview(crossTechCavalryChart, "骑兵组最佳排名");
  bindChartPreview(crossTechInfantryOnlyChart, "纯步兵最佳排名");
  bindChartPreview(crossTechCavalryOnlyChart, "纯骑兵最佳排名");
}

function renderCrossTechResultsWithProgress(results, maxCols, runToken) {
  updateCrossTechProgress(84, "正在渲染摘要…");
  setTimeout(function() {
    if (runToken !== crossTechRunToken) return;
    renderCrossTechSummary(results);

    updateCrossTechProgress(88, "正在渲染综合成长图…");
    setTimeout(function() {
      if (runToken !== crossTechRunToken) return;
      renderCrossTechLineChart(crossTechInfantryChart, buildGroupPeakSeries(results, "Infantry", true, false), "步兵");
      renderCrossTechLineChart(crossTechCavalryChart, buildGroupPeakSeries(results, "Cavalry", true, false), "骑兵");
      bindChartPreview(crossTechInfantryChart, "步兵组最佳排名");
      bindChartPreview(crossTechCavalryChart, "骑兵组最佳排名");

      updateCrossTechProgress(93, "正在渲染纯兵种成长图…");
      setTimeout(function() {
        if (runToken !== crossTechRunToken) return;
        renderCrossTechLineChart(crossTechInfantryOnlyChart, buildGroupPeakSeries(results, "Infantry", false, true), "纯步兵");
        renderCrossTechLineChart(crossTechCavalryOnlyChart, buildGroupPeakSeries(results, "Cavalry", false, true), "纯骑兵");
        bindChartPreview(crossTechInfantryOnlyChart, "纯步兵最佳排名");
        bindChartPreview(crossTechCavalryOnlyChart, "纯骑兵最佳排名");

        updateCrossTechProgress(97, "正在渲染排行表格…");
        setTimeout(function() {
          if (runToken !== crossTechRunToken) return;
          renderCrossTechTable(results);
          downloadCrossTechBtn.disabled = false;
          toggleCrossTechChartsBtn.disabled = false;
          updateCrossTechView();

          updateCrossTechProgress(100, "正在完成跳转…");
          setTimeout(function() {
            if (runToken !== crossTechRunToken) return;
            uiView = "results";
            resultMode = "cross-tech";
            updateModeUI();
            crossTechSection.style.display = "";
            updateCrossTechView();
            closeCrossTechConfirmDialog();
          }, 120);
        }, 0);
      }, 0);
    }, 0);
  }, 0);
}

function crossTechCellClassForUnitType(unitType) {
  if (unitType === "Infantry") return "cross-tech-cell-infantry";
  if (unitType === "Cavalry") return "cross-tech-cell-cavalry";
  return "cross-tech-cell-artillery";
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
        unitType: candidate.unitType
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
        unitType: candidate.unitType
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

function buildCrossTechTableRows(results) {
  return crossTechTableMode === "unit" ? buildCrossTechUnitTableRows(results) : buildCrossTechGroupTableRows(results);
}

function updateCrossTechTableModeButton() {
  toggleCrossTechTableModeBtn.disabled = !crossTechData;
  toggleCrossTechTableModeBtn.textContent = crossTechTableMode === "unit" ? "⇄ 转换成兵种组显示" : "⇄ 转换成兵种显示";
}

function buildCrossTechCellHtml(item) {
  var sublabel = item.sublabel ? '<div class="cross-tech-cell-sub">' + item.sublabel + '</div>' : '';
  return '<div class="cross-tech-cell-main">' + item.label + '</div>' + sublabel;
}

function renderCrossTechTable(results) {
  var tableData = buildCrossTechTableRows(results);
  var headerHtml = '<tr><th>科技</th>';
  for (var c = 1; c <= tableData.maxCols; c++) {
    headerHtml += '<th>#' + c + '</th>';
  }
  headerHtml += '</tr>';
  crossTechThead.innerHTML = headerHtml;

  var bodyHtml = "";
  for (var i = 0; i < tableData.rows.length; i++) {
    var row = tableData.rows[i];
    bodyHtml += '<tr><td>' + row.techLevel + '</td>';
    for (var c = 0; c < tableData.maxCols; c++) {
      if (c < row.entries.length) {
        var item = row.entries[c];
        bodyHtml += '<td class="text-left ' + crossTechCellClassForUnitType(item.unitType) + '">' + buildCrossTechCellHtml(item) + '</td>';
      } else {
        bodyHtml += '<td class="text-left" style="color:var(--muted);">-</td>';
      }
    }
    bodyHtml += '</tr>';
  }
  crossTechTbody.innerHTML = bodyHtml;
  downloadCrossTechBtn.disabled = false;
  updateCrossTechTableModeButton();
}

function renderCrossTechResults(results, maxCols) {
  renderCrossTechSummary(results);
  renderCrossTechCharts(results);
  renderCrossTechTable(results);
  downloadCrossTechBtn.disabled = false;
  toggleCrossTechChartsBtn.disabled = false;
  updateCrossTechView();
}

function downloadCrossTechCSV() {
  if (!crossTechData) return;
  var tableData = buildCrossTechTableRows(crossTechData.results);
  var lines = [];
  lines.push("科技等级," + Array(tableData.maxCols).fill(0).map(function(_, i) {
    return crossTechTableMode === "unit" ? ("第" + (i + 1) + "名兵种") : ("第" + (i + 1) + "名兵种组");
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

// ---- Main orchestrator ----
function calculate() {
  var mode = getCalcMode();
  if (mode === "ranking") {
    resetCrossTechResults();
    calculateRanking();
  } else if (mode === "simulation") {
    calculateSimulation();
  } else {
    calculateSingle();
    uiView = "results";
    resultMode = "single";
    updateModeUI();
  }
}

// ---- Event binding ----
function bindEvents() {
  ["attacker", "defender"].forEach(side => {
    sideState[side].group.addEventListener("change", function() { syncUnitOptions(side); });
    sideState[side].unitType.addEventListener("change", function() { syncUnitOptions(side); });
    sideState[side].techLevel.addEventListener("change", function() { syncUnitOptions(side); });
    sideState[side].strength.addEventListener("change", function() { maybeWarnStrengthLimit(sideState[side].strength); });
  });

  Object.keys(sideState.template).forEach(function(key) {
    sideState.template[key].addEventListener("change", resetCrossTechResults);
    if (sideState.template[key].tagName === "INPUT") {
      sideState.template[key].addEventListener("input", resetCrossTechResults);
    }
  });
  sideState.template.strength.addEventListener("change", function() { maybeWarnStrengthLimit(sideState.template.strength); });

  calculateButton.addEventListener("click", function() {
    try {
      errorBanner.style.display = "none";
      errorBanner.textContent = "";
      calculate();
    } catch (error) {
      errorBanner.textContent = error.message;
      errorBanner.style.display = "";
      uiView = "settings";
      resultMode = null;
      updateModeUI();
      attackerLossEl.textContent = "0.00";
      defenderLossEl.textContent = "0.00";
      attackerMoraleLossEl.textContent = "0.00";
      defenderMoraleLossEl.textContent = "0.00";
      latestRankingLogText = "";
      downloadRankingLogButton.disabled = true;
    }
  });

  downloadRankingLogButton.addEventListener("click", function() {
    downloadRankingLog();
  });

  crossTechRankingBtn.addEventListener("click", openCrossTechConfirmDialog);

  showCrossTechTemplateBtn.addEventListener("click", function() {
    if (!crossTechData) return;
    openCrossTechTemplateDialog();
  });

  toggleCrossTechTableModeBtn.addEventListener("click", function() {
    if (!crossTechData) return;
    crossTechTableMode = crossTechTableMode === "unit" ? "group" : "unit";
    renderCrossTechTable(crossTechData.results);
  });

  downloadCrossTechBtn.addEventListener("click", function() {
    downloadCrossTechCSV();
  });

  toggleCrossTechChartsBtn.addEventListener("click", function() {
    crossTechChartsExpanded = !crossTechChartsExpanded;
    updateCrossTechView();
    if (crossTechChartsExpanded) {
      window.requestAnimationFrame(function() {
        window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" });
      });
    }
  });

  crossTechConfirmStart.addEventListener("click", startCrossTechRankingFlow);
  crossTechConfirmCancel.addEventListener("click", closeCrossTechConfirmDialog);
  crossTechConfirmBackdrop.addEventListener("click", closeCrossTechConfirmDialog);
  crossTechTemplateBackdrop.addEventListener("click", closeCrossTechTemplateDialog);
  crossTechTemplateClose.addEventListener("click", closeCrossTechTemplateDialog);

  chartLightboxBackdrop.addEventListener("click", closeChartLightbox);
  chartLightboxClose.addEventListener("click", closeChartLightbox);
  document.addEventListener("keydown", function(event) {
    if (event.key === "Escape" && chartLightbox.style.display !== "none") {
      closeChartLightbox();
      return;
    }
    if (event.key === "Escape" && crossTechTemplateDialog.style.display !== "none") {
      closeCrossTechTemplateDialog();
      return;
    }
    if (event.key === "Escape" && crossTechConfirmDialog.style.display !== "none") {
      closeCrossTechConfirmDialog();
    }
  });

  backButton.addEventListener("click", function() {
    errorBanner.style.display = "none";
    errorBanner.textContent = "";
    closeChartLightbox();
    closeCrossTechTemplateDialog();
    closeCrossTechConfirmDialog();
    crossTechRunToken += 1;
    uiView = "settings";
    resultMode = null;
    updateModeUI();
  });

  // Mode toggle
  modeSingleRadio.addEventListener("change", updateModeUI);
  modeSimRadio.addEventListener("change", updateModeUI);
  modeRankingRadio.addEventListener("change", updateModeUI);
  simDiceMode.addEventListener("change", updateSimDiceVisibility);
}

buildPanel("attacker");
buildPanel("defender");
buildPanel("template");
initOptions();
bindEvents();
document.body.className = "settings-view";
updateModeUI();
