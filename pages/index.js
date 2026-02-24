//renderizar o fate chart em uma tabela html usando os dados do doc/gme.js
import { fateChart, chanceLabel } from "../doc/gme";

export default function Home() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Fate Chart</h1>
      <p><strong>Linhas:</strong> Odds | <strong>Colunas:</strong> Chaos Factor (1-9)</p>
      <p style={{ fontSize: "12px", color: "#666" }}>Formato nas células: [Exceptional Yes | Yes | Exceptional No]</p>
      
      <table border="1" cellPadding="10" style={{ borderCollapse: "collapse", marginTop: "20px" }}>
        <thead>
          <tr style={{ backgroundColor: "#f0f0f0" }}>
            <th>Odds \ CF</th>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((cf) => (
              <th key={cf} style={{ minWidth: "100px", textAlign: "center" }}>
                CF {cf}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {fateChart.map((row, oddIndex) => (
            <tr key={oddIndex}>
              <td style={{ fontWeight: "bold", backgroundColor: "#f9f9f9" }}>
                {chanceLabel[oddIndex]}
              </td>
              {row.map((cell, cfIndex) => (
                <td key={cfIndex} style={{ textAlign: "center", fontFamily: "monospace", fontSize: "12px" }}>
                  {cell[0] !== null ? cell[0] : "—"} | {cell[1]} | {cell[2] !== null ? cell[2] : "—"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}