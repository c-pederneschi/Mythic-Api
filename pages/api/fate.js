///api/fate?clvl=&pbld
import { fateChart } from "../../doc/gme";
import { fateResultLabel } from "../../doc/gme";

export default function handler(req, res) {
  const { clvl, pbld } = req.query;
  
  //validar os parametros
  if (!clvl || !pbld) {
    res.status(400).json({ error: "Missing clvl or pbld parameter" });
    return;
  } else if (isNaN(clvl) || isNaN(pbld)) {
    res.status(400).json({ error: "clvl and pbld must be numbers" });
    return;
  }
  
  const clvlNum = parseInt(clvl);
  const pbldNum = parseInt(pbld);
  
  //validar os limites dos parametros
  if (clvlNum < 0 || clvlNum > 8) {
    res.status(400).json({ error: "clvl must be between 0 and 8" });
    return;
  } else if (pbldNum < 0 || pbldNum > 8) {
    res.status(400).json({ error: "pbld must be between 0 and 8" });
    return;
  }

  //calcular o resultado do destino
  const fateResult = fateChart[clvlNum][pbldNum];
  const fateLabel = fateResultLabel[fateResult];
  
  res.status(200).json({ fate: fateResult, label: fateLabel });
}