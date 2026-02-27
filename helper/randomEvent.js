import { randomEventFocusTable, mythicMeaningTables } from "../doc/gme";

/**
 * Checks if a d100 roll triggers a random event for a specific chaos factor
 * Random events occur on doubles (11, 22, 33, etc.) equal to or less than the chaos factor
 * @param {number} roll - The d100 roll (1-100)
 * @param {number} chaosLevel - The chaos factor (1-9)
 * @returns {boolean} - True if random event is triggered
 */
export function checkRandomEvent(roll, chaosLevel) {
  // Extract the digits
  const digit1 = Math.floor(roll / 10);
  const digit2 = roll % 10;
  
  // Check if it's a double
  const isDouble = (digit1 === digit2) || (roll === 100);
  
  if (!isDouble) {
    return false;
  }
  
  // Check if the double is within chaos factor range
  // For example: if chaos is 5, doubles 11, 22, 33, 44, 55 trigger RE
  // 100 always triggers if chaos >= 10 (but max is 9, so 100 might not trigger)
  const doubleValue = digit1;
  
  return doubleValue <= chaosLevel;
}

/**
 * Generates a complete random event with focus and meaning
 * @returns {object} - Random event with focus and meaning
 */
export function generateRandomEvent() {
  // Step 1: Determine Event Focus
  const eventFocusRoll = Math.floor(Math.random() * 100) + 1;
  let eventFocus = "Current Context";
  
  for (const entry of randomEventFocusTable) {
    const [min, max] = entry.range;
    if (eventFocusRoll >= min && eventFocusRoll <= max) {
      eventFocus = entry.result;
      break;
    }
  }
  
  // Step 2: Determine Event Meaning (roll twice on d100)
  // Roll on Actions table (table1 and table2)
  const actionRoll1 = Math.floor(Math.random() * 100) + 1;
  const actionRoll2 = Math.floor(Math.random() * 100) + 1;
  
  // Get action from table1 (index 0 is null, so direct indexing works)
  const action = mythicMeaningTables.actions.table1[actionRoll1] || "Continue";
  
  // Get subject from table2 (index 0 is null, so direct indexing works)
  const subject = mythicMeaningTables.actions.table2[actionRoll2] || "Goal";
  
  // Step 3: Also roll on Descriptions table for additional meaning
  const descRoll1 = Math.floor(Math.random() * 100) + 1;
  const descRoll2 = Math.floor(Math.random() * 100) + 1;
  
  const descriptor1 = mythicMeaningTables.descriptions.descriptor1[descRoll1] || "Naturally";
  const descriptor2 = mythicMeaningTables.descriptions.descriptor2[descRoll2] || "Normal";
  
  return {
    focus: {
      roll: eventFocusRoll,
      result: eventFocus
    },
    meaning: {
      action: {
        roll: actionRoll1,
        word: action
      },
      subject: {
        roll: actionRoll2,
        word: subject
      },
      description: {
        roll1: descRoll1,
        word1: descriptor1,
        roll2: descRoll2,
        word2: descriptor2
      }
    }
  };
}
