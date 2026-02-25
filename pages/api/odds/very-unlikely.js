import { fateChart, chanceLabel } from "../../../doc/gme";
import { checkRandomEvent, generateRandomEvent } from "../../../helper/randomEvent";

export default function handler(req, res) {
  // Roll 1d100 (1-100)
  const roll = Math.floor(Math.random() * 100) + 1;
  
  // Chance level index: 6 = Very Unlikely
  const oddIndex = 6;
  const chanceName = chanceLabel[oddIndex];
  
  // Calculate results for all chaos levels
  const results = {};
  let hasRETriggered = false;
  
  for (let cfIndex = 0; cfIndex < 9; cfIndex++) {
    const [exYes, yes, exNo] = fateChart[oddIndex][cfIndex];
    
    let result;
    if (roll <= exYes) {
      result = "EXCEPTIONAL YES";
    } else if (roll <= yes) {
      result = "YES";
    } else if (roll <= exNo) {
      result = "NO";
    } else {
      result = "EXCEPTIONAL NO";
    }
    
    // Check if this CF triggers a random event
    const hasRE = checkRandomEvent(roll, cfIndex + 1);
    if (hasRE) hasRETriggered = true;
    
    results[`CF${cfIndex + 1}`] = {
      fate: result,
      RE: hasRE
    };
  }
  
  // Generate one random event only if RE was triggered
  const randomEvent = hasRETriggered ? generateRandomEvent() : null;
  
  res.status(200).json({
    chance: chanceName,
    roll: roll,
    results: results,
    randomEvent: randomEvent
  });
}
