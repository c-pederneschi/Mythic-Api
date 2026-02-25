import { raw } from "./string.js";

function parseMeaningTables(rawText) {
  const lines = rawText
    .replace(/\r/g, "")
    .split("\n")
    .map(l => l.trim())
    .filter(Boolean);

  const tables = {};
  let currentTitle = null;
  let currentArr = null;

  const isNoiseLine = (l) => {
    // Linhas “MEANING TABLES: ELEMENTS”, “201 201”, “202202”, etc.
    if (/^MEANING TABLES:\s*ELEMENTS$/i.test(l)) return true;
    if (/^\d+\s*\d+$/.test(l)) return true;       // ex: "201 201"
    if (/^\d{3,}\s*$/.test(l)) return true;       // ex: "211" ou "202202"
    return false;
  };

  const looksLikeTitle = (l) => {
    // Títulos: normalmente tudo em maiúsculo (com espaços, &, vírgula etc.)
    // Ex: "ADVENTURE TONE", "CHARACTER ACTIONS, COMBAT"
    if (isNoiseLine(l)) return false;
    if (/^\d+\s*:/.test(l)) return false; // linha de item
    return /^[A-Z0-9][A-Z0-9 &,'\/\-]+$/.test(l) && /[A-Z]/.test(l);
  };

  const parseItemLine = (l) => {
    // Ex: "27: Evil " -> ["27", "Evil"]
    const m = l.match(/^(\d+)\s*:\s*(.+)$/);
    if (!m) return null;
    const idx = Number(m[1]);
    const value = m[2].trim();
    return { idx, value };
  };

  for (const l of lines) {
    if (isNoiseLine(l)) continue;

    if (looksLikeTitle(l)) {
      // Fecha tabela anterior
      if (currentTitle && currentArr) {
        tables[currentTitle] = currentArr;
      }
      // Abre nova
      currentTitle = l;
      currentArr = [null]; // índice 0 = null, como você quer
      continue;
    }

    const item = parseItemLine(l);
    if (item && currentArr) {
      // Garante posição correta (1..100)
      currentArr[item.idx] = item.value;
    }
  }

  // Fecha última tabela
  if (currentTitle && currentArr) {
    tables[currentTitle] = currentArr;
  }

  // Normaliza: garante que todo índice vazio vire null (opcional)
  for (const [k, arr] of Object.entries(tables)) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === undefined) arr[i] = null;
    }
    tables[k] = arr;
  }

  return tables;
}

// --- uso ---
const tables = parseMeaningTables(raw);

// Exemplo: pegar uma tabela específica
console.log(tables["ADVENTURE TONE"]);

// Exemplo: exportar todas como JS pronto pra colar
const jsExport = Object.entries(tables)
  .map(([name, arr]) => `export const ${toConstName(name)} = ${JSON.stringify(arr, null, 2)};`)
  .join("\n\n");

//console.log(jsExport);

// helper: transforma título em nome de constante JS
function toConstName(title) {
  return title
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}