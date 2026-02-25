import { fateChart, chanceLabel } from "../../../doc/gme";
import { checkRandomEvent, generateRandomEvent } from "../../../helper/randomEvent";

export default function handler(req, res) {
  // Roll 1d100 (1-100)
  const roll = Math.floor(Math.random() * 100) + 1;
  
  // Fixed Chaos Factor: 9
  const cfIndex = 8;
  const chaosLevel = cfIndex + 1;
  
  // Calculate results for all odds levels
  const results = {};
  
  for (let oddIndex = 0; oddIndex < 9; oddIndex++) {
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
    
    results[chanceLabel[oddIndex]] = {
      fate: result
    };
  }
  
  // Check if this CF triggers a random event
  const hasRE = checkRandomEvent(roll, chaosLevel);
  
  // Generate one random event only if RE was triggered
  const randomEvent = hasRE ? generateRandomEvent() : null;
  
  res.status(200).json({
    chaosLevel: chaosLevel,
    roll: roll,
    RE: hasRE,
    results: results,
    randomEvent: randomEvent
  });
}
