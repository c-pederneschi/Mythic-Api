//renderizar o fate chart em uma tabela html usando os dados do doc/gme.js
import { fateChart, chanceLabel, ADVENTURE_TONE, ALIEN_SPECIES_DESCRIPTORS, ANIMAL_ACTIONS, ARMY_DESCRIPTORS, CAVERN_DESCRIPTORS, CHARACTERS, CHARACTER_ACTIONS_COMBAT, CHARACTER_ACTIONS_GENERAL, CHARACTER_APPEARANCE, CHARACTER_BACKGROUND, CHARACTER_CONVERSATIONS, CHARACTER_DESCRIPTORS, CHARACTER_IDENTITY, CHARACTER_MOTIVATIONS, CHARACTER_PERSONALITY, CHARACTER_SKILLS, CHARACTER_TRAITS_FLAWS, CITY_DESCRIPTORS, CIVILIZATION_DESCRIPTORS, CREATURE_ABILITIES, CREATURE_DESCRIPTORS, CRYPTIC_MESSAGE, CURSES, DOMICILE_DESCRIPTORS, DUNGEON_DESCRIPTORS, DUNGEON_TRAPS, FOREST_DESCRIPTORS, GODS, LEGENDS, LOCATIONS, MAGIC_ITEM_DESCRIPTORS, MUTATION_DESCRIPTORS, NAMES, NOBLE_HOUSE, OBJECTS, PLOT_TWISTS, POWERS, SCAVENGING_RESULTS, SMELLS, SOUNDS, SPELL_EFFECTS, STARSHIP_DESCRIPTORS, TERRAIN_DESCRIPTORS, UNDEAD_DESCRIPTORS, VISIONS_DREAMS, mythicMeaningTables } from "../doc/gme";
import { useState } from "react";

export default function Home() {
  const [selectedTable, setSelectedTable] = useState("fateChart");

  const tables = {
    fateChart: { name: "Fate Chart", data: fateChart, isFateChart: true },
    mythicMeaningActions: { name: "Mythic Meaning - Actions (Tabela 1)", data: mythicMeaningTables.actions.table1 },
    mythicMeaningSubjects: { name: "Mythic Meaning - Subjects (Tabela 2)", data: mythicMeaningTables.actions.table2 },
    mythicMeaningDescriptor1: { name: "Mythic Meaning - Descriptors (Modo)", data: mythicMeaningTables.descriptions.descriptor1 },
    mythicMeaningDescriptor2: { name: "Mythic Meaning - Descriptors (Adjetivos)", data: mythicMeaningTables.descriptions.descriptor2 },
    ADVENTURE_TONE: { name: "Adventure Tone", data: ADVENTURE_TONE },
    ALIEN_SPECIES_DESCRIPTORS: { name: "Alien Species Descriptors", data: ALIEN_SPECIES_DESCRIPTORS },
    ANIMAL_ACTIONS: { name: "Animal Actions", data: ANIMAL_ACTIONS },
    ARMY_DESCRIPTORS: { name: "Army Descriptors", data: ARMY_DESCRIPTORS },
    CAVERN_DESCRIPTORS: { name: "Cavern Descriptors", data: CAVERN_DESCRIPTORS },
    CHARACTERS: { name: "Characters", data: CHARACTERS },
    CHARACTER_ACTIONS_COMBAT: { name: "Character Actions - Combat", data: CHARACTER_ACTIONS_COMBAT },
    CHARACTER_ACTIONS_GENERAL: { name: "Character Actions - General", data: CHARACTER_ACTIONS_GENERAL },
    CHARACTER_APPEARANCE: { name: "Character Appearance", data: CHARACTER_APPEARANCE },
    CHARACTER_BACKGROUND: { name: "Character Background", data: CHARACTER_BACKGROUND },
    CHARACTER_CONVERSATIONS: { name: "Character Conversations", data: CHARACTER_CONVERSATIONS },
    CHARACTER_DESCRIPTORS: { name: "Character Descriptors", data: CHARACTER_DESCRIPTORS },
    CHARACTER_IDENTITY: { name: "Character Identity", data: CHARACTER_IDENTITY },
    CHARACTER_MOTIVATIONS: { name: "Character Motivations", data: CHARACTER_MOTIVATIONS },
    CHARACTER_PERSONALITY: { name: "Character Personality", data: CHARACTER_PERSONALITY },
    CHARACTER_SKILLS: { name: "Character Skills", data: CHARACTER_SKILLS },
    CHARACTER_TRAITS_FLAWS: { name: "Character Traits/Flaws", data: CHARACTER_TRAITS_FLAWS },
    CITY_DESCRIPTORS: { name: "City Descriptors", data: CITY_DESCRIPTORS },
    CIVILIZATION_DESCRIPTORS: { name: "Civilization Descriptors", data: CIVILIZATION_DESCRIPTORS },
    CREATURE_ABILITIES: { name: "Creature Abilities", data: CREATURE_ABILITIES },
    CREATURE_DESCRIPTORS: { name: "Creature Descriptors", data: CREATURE_DESCRIPTORS },
    CRYPTIC_MESSAGE: { name: "Cryptic Message", data: CRYPTIC_MESSAGE },
    CURSES: { name: "Curses", data: CURSES },
    DOMICILE_DESCRIPTORS: { name: "Domicile Descriptors", data: DOMICILE_DESCRIPTORS },
    DUNGEON_DESCRIPTORS: { name: "Dungeon Descriptors", data: DUNGEON_DESCRIPTORS },
    DUNGEON_TRAPS: { name: "Dungeon Traps", data: DUNGEON_TRAPS },
    FOREST_DESCRIPTORS: { name: "Forest Descriptors", data: FOREST_DESCRIPTORS },
    GODS: { name: "Gods", data: GODS },
    LEGENDS: { name: "Legends", data: LEGENDS },
    LOCATIONS: { name: "Locations", data: LOCATIONS },
    MAGIC_ITEM_DESCRIPTORS: { name: "Magic Item Descriptors", data: MAGIC_ITEM_DESCRIPTORS },
    MUTATION_DESCRIPTORS: { name: "Mutation Descriptors", data: MUTATION_DESCRIPTORS },
    NAMES: { name: "Names", data: NAMES },
    NOBLE_HOUSE: { name: "Noble House", data: NOBLE_HOUSE },
    OBJECTS: { name: "Objects", data: OBJECTS },
    PLOT_TWISTS: { name: "Plot Twists", data: PLOT_TWISTS },
    POWERS: { name: "Powers", data: POWERS },
    SCAVENGING_RESULTS: { name: "Scavenging Results", data: SCAVENGING_RESULTS },
    SMELLS: { name: "Smells", data: SMELLS },
    SOUNDS: { name: "Sounds", data: SOUNDS },
    SPELL_EFFECTS: { name: "Spell Effects", data: SPELL_EFFECTS },
    STARSHIP_DESCRIPTORS: { name: "Starship Descriptors", data: STARSHIP_DESCRIPTORS },
    TERRAIN_DESCRIPTORS: { name: "Terrain Descriptors", data: TERRAIN_DESCRIPTORS },
    UNDEAD_DESCRIPTORS: { name: "Undead Descriptors", data: UNDEAD_DESCRIPTORS },
    VISIONS_DREAMS: { name: "Visions/Dreams", data: VISIONS_DREAMS }
  };

  const currentTable = tables[selectedTable];

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Mythic GME Data Browser</h1>
      
      {/* Fate Chart Section */}
      <section style={{ marginBottom: "40px" }}>
        <h2>Fate Chart</h2>
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

        <div style={{ marginTop: "30px", padding: "15px", backgroundColor: "#f9f9f9", borderLeft: "4px solid #666" }}>
          <h3 style={{ marginTop: 0 }}>Legenda</h3>
          <p><strong>—</strong> = Resultado impossível (nunca pode ocorrer com essa combinação de Odds e Chaos Factor)</p>
          <p><strong>Exemplo:</strong> Quando o Exceptional Yes (primeira coluna) é "—", significa que é impossível conseguir um resultado Exceptional Yes com aquele nível de probabilidades.</p>
        </div>
      </section>

      {/* Other Tables Section */}
      <section>
        <h2>Tabelas de Geração do Mythic GME</h2>
        
        <div style={{ marginBottom: "20px" }}>
          <label htmlFor="tableSelect" style={{ fontWeight: "bold", marginRight: "10px" }}>Selecione uma tabela:</label>
          <select 
            id="tableSelect"
            value={selectedTable} 
            onChange={(e) => setSelectedTable(e.target.value)}
            style={{ padding: "8px", fontSize: "14px", width: "300px" }}
          >
            {Object.entries(tables).map(([key, table]) => (
              <option key={key} value={key}>{table.name}</option>
            ))}
          </select>
        </div>

        <h3>{currentTable.name}</h3>
        
        {currentTable.isFateChart ? (
          <p>Use o seletor acima para escolher outra tabela.</p>
        ) : (
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", 
            gap: "10px",
            padding: "15px",
            backgroundColor: "#f0f0f0",
            borderRadius: "5px"
          }}>
            {Array.isArray(currentTable.data) ? (
              currentTable.data.map((item, index) => (
                <div 
                  key={index}
                  style={{
                    padding: "10px",
                    backgroundColor: "#fff",
                    border: "1px solid #ddd",
                    borderRadius: "3px",
                    minHeight: "40px",
                    display: "flex",
                    alignItems: "center"
                  }}
                >
                  <span style={{ color: "#666", marginRight: "10px", fontWeight: "bold" }}>
                    [{index}]
                  </span>
                  <span>{item || "(vazio)"}</span>
                </div>
              ))
            ) : (
              <p>Tabela não é um array válido</p>
            )}
          </div>
        )}

        <div style={{ marginTop: "30px", padding: "10px", backgroundColor: "#e8f4f8", borderLeft: "4px solid #0066cc" }}>
          <p style={{ margin: 0 }}>
            <strong>Total de itens:</strong> {Array.isArray(currentTable.data) ? currentTable.data.length : 0}
          </p>
        </div>
      </section>
    </div>
  );
}