export const fateChart = [
  [
    [10, 50, 91],
    [13, 65, 94],
    [15, 75, 96],
    [17, 85, 98],
    [18, 90, 99],
    [19, 95, 100],
    [20, 99, null],
    [20, 99, null],
    [20, 99, null]
  ],
  [
    [7, 35, 88],
    [10, 50, 91],
    [13, 65, 94],
    [15, 75, 96],
    [17, 85, 98],
    [18, 90, 99],
    [19, 95, 100],
    [20, 99, null],
    [20, 99, null]
  ],
  [
    [5, 25, 86],
    [7, 35, 88],
    [10, 50, 91],
    [13, 65, 94],
    [15, 75, 96],
    [17, 85, 98],
    [18, 90, 99],
    [19, 95, 100],
    [20, 99, null]
  ],
  [
    [3, 15, 84],
    [5, 25, 86],
    [7, 35, 88],
    [10, 50, 91],
    [13, 65, 94],
    [15, 75, 96],
    [17, 85, 98],
    [18, 90, 99],
    [19, 95, 100]
  ],
  [
    [2, 10, 83],
    [3, 15, 84],
    [5, 25, 86],
    [7, 35, 88],
    [10, 50, 91],
    [13, 65, 94],
    [15, 75, 96],
    [17, 85, 98],
    [18, 90, 99]
  ],
  [
    [1, 5, 82],
    [2, 10, 83],
    [3, 15, 84],
    [5, 25, 86],
    [7, 35, 88],
    [10, 50, 91],
    [13, 65, 94],
    [15, 75, 96],
    [17, 85, 98]
  ],
  [
    [null, 1, 81],
    [1, 5, 82],
    [2, 10, 83],
    [3, 15, 84],
    [5, 25, 86],
    [7, 35, 88],
    [10, 50, 91],
    [13, 65, 94],
    [15, 75, 96]
  ],
  [
    [null, 1, 81],
    [null, 1, 81],
    [1, 5, 82],
    [2, 10, 83],
    [3, 15, 84],
    [5, 25, 86],
    [7, 35, 88],
    [10, 50, 91],
    [13, 65, 94]
  ],
  [
    [null, 1, 81],
    [null, 1, 81],
    [null, 1, 81],
    [1, 5, 82],
    [2, 10, 83],
    [3, 15, 84],
    [5, 25, 86],
    [7, 35, 88],
    [10, 50, 91]
  ]
];

export const chanceLabel = {
  0: "Certain",
  1: "Nearly Certain",
  2: "Very Likely",
  3: "Likely",
  4: "50/50",
  5: "Unlikely",
  6: "Very Unlikely",
  7: "Nearly Impossible",
  8: "Impossible"
};

//criar legenda para resultado do fate chart
export const fateResultLabel = {
  0: "Yes",
  1: "Exceptional Yes",
  2: "No",
  3: "Exceptional No"
};

export const randomEventFocusTable = [
  { range: [1, 5], result: "Remote Event" },
  { range: [6, 10], result: "Ambiguous Event" },
  { range: [11, 20], result: "New NPC" },
  { range: [21, 40], result: "NPC Action" },
  { range: [41, 45], result: "NPC Negative" },
  { range: [46, 50], result: "NPC Positive" },
  { range: [51, 55], result: "Move Toward A Thread" },
  { range: [56, 65], result: "Move Away From A Thread" },
  { range: [66, 70], result: "Close A Thread" },
  { range: [71, 80], result: "PC Negative" },
  { range: [81, 85], result: "PC Positive" },
  { range: [86, 100], result: "Current Context" }
];

// Função auxiliar para obter resultado da Focus Table
export const getEventFocus = () => {
  const roll = Math.floor(Math.random() * 100) + 1; // Gera número entre 1-100
  
  const entry = randomEventFocusTable.find(
    item => roll >= item.range[0] && roll <= item.range[1]
  );
  
  return entry ? { roll, result: entry.result } : null;
};



//função para obter resultado da Fate Chart
export const getFateChartResult = (Chaos, possibility) => {
  if (Chaos < 0 || Chaos > 8 || possibility < 0 || possibility > 8) {
    throw new Error("Chaos and Possibility must be between 0 and 8");
  }
  // gerar um numero entre 1 e 100
  const roll = Math.floor(Math.random() * 100) + 1;
  const thresholds = fateChart[Chaos][possibility];
  
  //o trio de numeros representa os limites para cada resultado +sim, sim, nõo, +não
  //+sim [N1] sim [N2] nõo [N3] +não
  if (roll <= thresholds[0]) {
    return { roll, result: fateResultLabel[1] };
  } else if (roll <= thresholds[1]) {
    return { roll, result: fateResultLabel[0] };
  } else if (roll <= thresholds[2]) {
    return { roll, result: fateResultLabel[2] };
  } else {
    return { roll, result: fateResultLabel[3] };
  }
}
