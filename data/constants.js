(function(M) {
var PHASES = [
  { value: "fire", label: "火力" },
  { value: "shock", label: "冲击" }
];

var UNIT_TYPES = [
  { value: "Infantry", label: "步兵" },
  { value: "Cavalry", label: "骑兵" },
  { value: "Artillery", label: "炮兵" }
];

var CROSS_TECH_COLORS = [
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

var TOURNAMENT_UNIT_TYPES = ["Infantry", "Cavalry", "Artillery"];

M['data/constants'] = { PHASES: PHASES, UNIT_TYPES: UNIT_TYPES, CROSS_TECH_COLORS: CROSS_TECH_COLORS, TOURNAMENT_UNIT_TYPES: TOURNAMENT_UNIT_TYPES };
})(window._M = window._M || {});
