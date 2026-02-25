//renderizar o fate chart em uma tabela html usando os dados do doc/gme.js
import { fateChart, chanceLabel, ADVENTURE_TONE, ALIEN_SPECIES_DESCRIPTORS, ANIMAL_ACTIONS, ARMY_DESCRIPTORS, CAVERN_DESCRIPTORS, CHARACTERS, CHARACTER_ACTIONS_COMBAT, CHARACTER_ACTIONS_GENERAL, CHARACTER_APPEARANCE, CHARACTER_BACKGROUND, CHARACTER_CONVERSATIONS, CHARACTER_DESCRIPTORS, CHARACTER_IDENTITY, CHARACTER_MOTIVATIONS, CHARACTER_PERSONALITY, CHARACTER_SKILLS, CHARACTER_TRAITS_FLAWS, CITY_DESCRIPTORS, CIVILIZATION_DESCRIPTORS, CREATURE_ABILITIES, CREATURE_DESCRIPTORS, CRYPTIC_MESSAGE, CURSES, DOMICILE_DESCRIPTORS, DUNGEON_DESCRIPTORS, DUNGEON_TRAPS, FOREST_DESCRIPTORS, GODS, LEGENDS, LOCATIONS, MAGIC_ITEM_DESCRIPTORS, MUTATION_DESCRIPTORS, NAMES, NOBLE_HOUSE, OBJECTS, PLOT_TWISTS, POWERS, SCAVENGING_RESULTS, SMELLS, SOUNDS, SPELL_EFFECTS, STARSHIP_DESCRIPTORS, TERRAIN_DESCRIPTORS, UNDEAD_DESCRIPTORS, VISIONS_DREAMS, mythicMeaningTables } from "../doc/gme";

export default function Home() {
  const tables = [
    { name: "Mythic Meaning - Actions", data: mythicMeaningTables.actions.table1 },
    { name: "Mythic Meaning - Subjects", data: mythicMeaningTables.actions.table2 },
    { name: "Mythic Meaning - Descriptors (Modo)", data: mythicMeaningTables.descriptions.descriptor1 },
    { name: "Mythic Meaning - Descriptors (Adjetivos)", data: mythicMeaningTables.descriptions.descriptor2 },
    { name: "Adventure Tone", data: ADVENTURE_TONE },
    { name: "Alien Species Descriptors", data: ALIEN_SPECIES_DESCRIPTORS },
    { name: "Animal Actions", data: ANIMAL_ACTIONS },
    { name: "Army Descriptors", data: ARMY_DESCRIPTORS },
    { name: "Cavern Descriptors", data: CAVERN_DESCRIPTORS },
    { name: "Characters", data: CHARACTERS },
    { name: "Character Actions - Combat", data: CHARACTER_ACTIONS_COMBAT },
    { name: "Character Actions - General", data: CHARACTER_ACTIONS_GENERAL },
    { name: "Character Appearance", data: CHARACTER_APPEARANCE },
    { name: "Character Background", data: CHARACTER_BACKGROUND },
    { name: "Character Conversations", data: CHARACTER_CONVERSATIONS },
    { name: "Character Descriptors", data: CHARACTER_DESCRIPTORS },
    { name: "Character Identity", data: CHARACTER_IDENTITY },
    { name: "Character Motivations", data: CHARACTER_MOTIVATIONS },
    { name: "Character Personality", data: CHARACTER_PERSONALITY },
    { name: "Character Skills", data: CHARACTER_SKILLS },
    { name: "Character Traits/Flaws", data: CHARACTER_TRAITS_FLAWS },
    { name: "City Descriptors", data: CITY_DESCRIPTORS },
    { name: "Civilization Descriptors", data: CIVILIZATION_DESCRIPTORS },
    { name: "Creature Abilities", data: CREATURE_ABILITIES },
    { name: "Creature Descriptors", data: CREATURE_DESCRIPTORS },
    { name: "Cryptic Message", data: CRYPTIC_MESSAGE },
    { name: "Curses", data: CURSES },
    { name: "Domicile Descriptors", data: DOMICILE_DESCRIPTORS },
    { name: "Dungeon Descriptors", data: DUNGEON_DESCRIPTORS },
    { name: "Dungeon Traps", data: DUNGEON_TRAPS },
    { name: "Forest Descriptors", data: FOREST_DESCRIPTORS },
    { name: "Gods", data: GODS },
    { name: "Legends", data: LEGENDS },
    { name: "Locations", data: LOCATIONS },
    { name: "Magic Item Descriptors", data: MAGIC_ITEM_DESCRIPTORS },
    { name: "Mutation Descriptors", data: MUTATION_DESCRIPTORS },
    { name: "Names", data: NAMES },
    { name: "Noble House", data: NOBLE_HOUSE },
    { name: "Objects", data: OBJECTS },
    { name: "Plot Twists", data: PLOT_TWISTS },
    { name: "Powers", data: POWERS },
    { name: "Scavenging Results", data: SCAVENGING_RESULTS },
    { name: "Smells", data: SMELLS },
    { name: "Sounds", data: SOUNDS },
    { name: "Spell Effects", data: SPELL_EFFECTS },
    { name: "Starship Descriptors", data: STARSHIP_DESCRIPTORS },
    { name: "Terrain Descriptors", data: TERRAIN_DESCRIPTORS },
    { name: "Undead Descriptors", data: UNDEAD_DESCRIPTORS },
    { name: "Visions/Dreams", data: VISIONS_DREAMS }
  ];

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif", maxWidth: "1400px", margin: "0 auto" }}>
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

        <div style={{ marginTop: "20px", padding: "15px", backgroundColor: "#f9f9f9", borderLeft: "4px solid #666" }}>
          <h3 style={{ marginTop: 0 }}>Legenda</h3>
          <p><strong>—</strong> = Resultado impossível (nunca pode ocorrer com essa combinação de Odds e Chaos Factor)</p>
        </div>
      </section>

      {/* All Other Tables */}
      <section>
        <h2>Todas as Tabelas do Mythic GME</h2>
        
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "20px" }}>
          {tables.map((table, tableIndex) => (
            <div 
              key={tableIndex}
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "15px",
                backgroundColor: "#fff",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
              }}
            >
              <h3 style={{ 
                marginTop: 0, 
                marginBottom: "10px", 
                fontSize: "16px", 
                color: "#333",
                borderBottom: "2px solid #0066cc",
                paddingBottom: "5px"
              }}>
                {table.name}
              </h3>
              
              <div style={{ 
                maxHeight: "300px", 
                overflowY: "auto",
                fontSize: "12px",
                backgroundColor: "#f8f8f8",
                padding: "10px",
                borderRadius: "4px"
              }}>
                {Array.isArray(table.data) ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                    {table.data.slice(1).map((item, index) => (
                      <div 
                        key={index}
                        style={{
                          padding: "4px 8px",
                          backgroundColor: index % 2 === 0 ? "#fff" : "#f0f0f0",
                          borderRadius: "2px",
                          display: "flex",
                          alignItems: "center"
                        }}
                      >
                        <span style={{ 
                          color: "#666", 
                          marginRight: "8px", 
                          fontWeight: "bold",
                          minWidth: "35px",
                          fontSize: "11px"
                        }}>
                          [{index + 1}]
                        </span>
                        <span>{item || "(vazio)"}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>Tabela não disponível</p>
                )}
              </div>
              
              <div style={{ 
                marginTop: "10px", 
                fontSize: "11px", 
                color: "#666",
                textAlign: "right"
              }}>
                Total: {Array.isArray(table.data) ? table.data.length - 1 : 0} itens
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}