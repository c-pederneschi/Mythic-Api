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

const mythicMeaningTables = {
  actions: {
    table1: [
      "Abandon", "Accompany", "Activate", "Agree", "Ambush", "Arrive", "Assist", "Attack", "Attain", "Bargain",
      "Befriend", "Bestow", "Betray", "Block", "Break", "Carry", "Celebrate", "Change", "Close", "Combine",
      "Communicate", "Conceal", "Continue", "Control", "Create", "Deceive", "Decrease", "Defend", "Delay", "Deny",
      "Depart", "Deposit", "Destroy", "Dispute", "Disrupt", "Distrust", "Divide", "Drop", "Easy", "Energize",
      "Escape", "Expose", "Fail", "Fight", "Flee", "Free", "Guide", "Harm", "Heal", "Hinder",
      "Imitate", "Imprison", "Increase", "Indulge", "Inform", "Inquire", "Inspect", "Invade", "Leave", "Lure",
      "Misuse", "Move", "Neglect", "Observe", "Open", "Oppose", "Overthrow", "Praise", "Proceed", "Protect",
      "Punish", "Pursue", "Recruit", "Refuse", "Release", "Relinquish", "Repair", "Repulse", "Return", "Reward",
      "Ruin", "Separate", "Start", "Stop", "Strange", "Struggle", "Succeed", "Support", "Suppress", "Take",
      "Threaten", "Transform", "Trap", "Travel", "Triumph", "Truce", "Trust", "Use", "Usurp", "Waste"
    ],
    table2: [
      "Advantage", "Adversity", "Agreement", "Animal", "Attention", "Balance", "Battle", "Benefits", "Building", "Burden",
      "Bureaucracy", "Business", "Chaos", "Comfort", "Completion", "Conflict", "Cooperation", "Danger", "Defense", "Depletion",
      "Disadvantage", "Distraction", "Elements", "Emotion", "Enemy", "Energy", "Environment", "Expectation", "Exterior", "Extravagance",
      "Failure", "Fame", "Fear", "Freedom", "Friend", "Goal", "Group", "Health", "Hindrance", "Home",
      "Hope", "Idea", "Illness", "Illusion", "Individual", "Information", "Innocent", "Intellect", "Interior", "Investment",
      "Leadership", "Legal", "Location", "Military", "Misfortune", "Mundane", "Nature", "Needs", "News", "Normal",
      "Object", "Obscurity", "Official", "Opposition", "Outside", "Pain", "Path", "Peace", "People", "Personal",
      "Physical", "Plot", "Portal", "Possessions", "Poverty", "Power", "Prison", "Project", "Protection", "Reassurance",
      "Representative", "Riches", "Safety", "Strength", "Success", "Suffering", "Surprise", "Tactic", "Technology", "Tension",
      "Time", "Trial", "Value", "Vehicle", "Victory", "Vulnerability", "Weapon", "Weather", "Work", "Wound"
    ]
  },
  descriptions: {
    descriptor1: [
      "Adventurously", "Aggressively", "Anxiously", "Awkwardly", "Beautifully", "Bleakly", "Boldly", "Bravely", "Busily", "Calmly",
      "Carefully", "Carelessly", "Cautiously", "Ceaselessly", "Cheerfully", "Combatively", "Coolly", "Crazily", "Curiously", "Dangerously",
      "Defiantly", "Deliberately", "Delicately", "Delightfully", "Dimly", "Efficiently", "Emotionally", "Energetically", "Enormously", "Enthusiastically",
      "Excitedly", "Fearfully", "Ferociously", "Fiercely", "Foolishly", "Fortunately", "Frantically", "Freely", "Frighteningly", "Fully",
      "Generously", "Gently", "Gladly", "Gracefully", "Gratefully", "Happily", "Hastily", "Healthily", "Helpfully", "Helplessly",
      "Hopelessly", "Innocently", "Intensely", "Interestingly", "Irritatingly", "Joyfully", "Kindly", "Lazily", "Lightly", "Loosely",
      "Loudly", "Lovingly", "Loyally", "Majestically", "Meaningfully", "Mechanically", "Mildly", "Miserably", "Mockingly", "Mysteriously",
      "Naturally", "Neatly", "Nicely", "Oddly", "Offensively", "Officially", "Partially", "Passively", "Peacefully", "Perfectly",
      "Playfully", "Politely", "Positively", "Powerfully", "Quaintly", "Quarrelsomely", "Quietly", "Roughly", "Rudely", "Ruthlessly",
      "Slowly", "Softly", "Strangely", "Swiftly", "Threateningly", "Timidly", "Very", "Violently", "Wildly", "Yieldingly"
    ],
    descriptor2: [
      "Abnormal", "Amusing", "Artificial", "Average", "Beautiful", "Bizarre", "Boring", "Bright", "Broken", "Clean",
      "Cold", "Colorful", "Colorless", "Comforting", "Creepy", "Cute", "Damaged", "Dark", "Defeated", "Dirty",
      "Disagreeable", "Dry", "Dull", "Empty", "Enormous", "Extraordinary", "Extravagant", "Faded", "Familiar", "Fancy",
      "Feeble", "Festive", "Flawless", "Forlorn", "Fragile", "Fragrant", "Fresh", "Full", "Glorious", "Graceful",
      "Hard", "Harsh", "Healthy", "Heavy", "Historical", "Horrible", "Important", "Interesting", "Juvenile", "Lacking",
      "Large", "Lavish", "Lean", "Less", "Lethal", "Lively", "Lonely", "Lovely", "Magnificent", "Mature",
      "Messy", "Mighty", "Military", "Modern", "Mundane", "Mysterious", "Natural", "Normal", "Odd", "Old",
      "Pale", "Peaceful", "Petite", "Plain", "Poor", "Powerful", "Protective", "Quaint", "Rare", "Reassuring",
      "Remarkable", "Rotten", "Rough", "Ruined", "Rustic", "Scary", "Shocking", "Simple", "Small", "Smooth",
      "Soft", "Strong", "Stylish", "Unpleasant", "Valuable", "Vibrant", "Warm", "Watery", "Weak", "Young"
    ]
  }
};