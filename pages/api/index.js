export default function handler(req, res) {
  res.status(200).json({
    name: "Mythic GME API",
    version: "1.0.0",
    description: "API para Mythic Game Master Engine - Sistema de RPG solo baseado no livro Mythic GME",
    documentation: {
      toolUse: {
        description: "Fluxo para a IA pedir rolagens via ferramentas",
        endpointFormat: "Sempre enviar endpoint sem /api, por exemplo: odds/fifty-fifty ou tables/adventure-tone",
        acceptedFormats: {
          keys: ["tool_use", "toolUse"],
          values: [
            "Array de objetos com endpoint",
            "Objeto único com endpoint",
            "Array de strings de endpoint"
          ]
        },
        requestFormat: {
          tool_use: [
            { endpoint: "odds/fifty-fifty" },
            { endpoint: "tables/adventure-tone" }
          ]
        },
        controlTools: {
          "chat/reset": "Apaga todas as mensagens do chat para recomeçar do zero"
        },
        stateTools: {
          "adventure/cf": "Lê o Chaos Factor atual persistido",
          "adventure/cf/cf1..cf9": "Atualiza o Chaos Factor persistido"
        },
        queueExamples: [
          {
            tool_use: [
              { endpoint: "odds/fifty-fifty" },
              { endpoint: "chaos/cf5" },
              { endpoint: "tables/adventure-tone" }
            ]
          },
          {
            tool_use: [
              { endpoint: "chat/reset" }
            ]
          },
          {
            tool_use: [
              { endpoint: "adventure/cf" },
              { endpoint: "adventure/cf/cf4" }
            ]
          },
          {
            toolUse: {
              endpoint: "tables/names"
            }
          },
          {
            tool_use: ["odds/likely", "tables/powers", "tables/locations"]
          }
        ],
        queueSupport: "Pode enviar múltiplos endpoints em fila no array tool_use",
        resultFormat: [
          {
            table: "fifty-fifty",
            result: "YES"
          },
          {
            table: "adventure-tone",
            result: "Bold"
          }
        ]
      },
      fateQuestions: {
        description: "Faça perguntas de destino com probabilidade fixa, veja resultados para todos chaos factors",
        routePattern: "/api/odds/[odds]",
        routes: {
          "/api/odds/certain": "Probabilidade: Certain (Certo)",
          "/api/odds/nearly-certain": "Probabilidade: Nearly Certain (Quase certo)",
          "/api/odds/very-likely": "Probabilidade: Very Likely (Muito provável)",
          "/api/odds/likely": "Probabilidade: Likely (Provável)",
          "/api/odds/fifty-fifty": "Probabilidade: 50/50",
          "/api/odds/unlikely": "Probabilidade: Unlikely (Improvável)",
          "/api/odds/very-unlikely": "Probabilidade: Very Unlikely (Muito improvável)",
          "/api/odds/nearly-impossible": "Probabilidade: Nearly Impossible (Quase impossível)",
          "/api/odds/impossible": "Probabilidade: Impossible (Impossível)"
        },
        responseExample: {
          chance: "50/50",
          roll: 55,
          results: {
            CF1: { fate: "YES", RE: false },
            CF2: { fate: "YES", RE: false },
            CF3: { fate: "EXCEPTIONAL YES", RE: true },
            "...": "CF4 até CF9"
          },
          randomEvent: {
            focus: { roll: 87, result: "Current Context" },
            meaning: {
              action: { roll: 42, word: "Protect" },
              subject: { roll: 73, word: "Personal" },
              description: {
                roll1: 19, word1: "Dangerously",
                roll2: 54, word2: "Mysterious"
              }
            }
          }
        }
      },
      chaosFactor: {
        description: "Fixe o chaos factor, veja resultados para todas probabilidades",
        routePattern: "/api/chaos/[cflvl]",
        routes: {
          "/api/chaos/cf1": "Chaos Factor: 1 (baixo caos)",
          "/api/chaos/cf2": "Chaos Factor: 2",
          "/api/chaos/cf3": "Chaos Factor: 3",
          "/api/chaos/cf4": "Chaos Factor: 4",
          "/api/chaos/cf5": "Chaos Factor: 5 (padrão)",
          "/api/chaos/cf6": "Chaos Factor: 6",
          "/api/chaos/cf7": "Chaos Factor: 7",
          "/api/chaos/cf8": "Chaos Factor: 8",
          "/api/chaos/cf9": "Chaos Factor: 9 (alto caos)"
        },
        acceptedParams: {
          cflvl: ["cf1", "cf2", "cf3", "cf4", "cf5", "cf6", "cf7", "cf8", "cf9", "1", "2", "3", "4", "5", "6", "7", "8", "9"]
        },
        responseExample: {
          chaosLevel: 5,
          roll: 55,
          RE: true,
          results: {
            Certain: { fate: "YES" },
            "Nearly Certain": { fate: "YES" },
            "Very Likely": { fate: "YES" },
            Likely: { fate: "NO" },
            "50/50": { fate: "NO" },
            "...": "até Impossible"
          },
          randomEvent: "Mesmo formato das rotas /odds"
        }
      },
      individualTables: {
        description: "Rolagem de tabelas individuais (1-100) usando rota dinâmica",
        route: "/api/tables/[table]",
        examples: {
          "/api/tables/adventure-tone": "Rola na tabela ADVENTURE_TONE",
          "/api/tables/names": "Rola na tabela NAMES",
          "/api/tables/powers": "Rola na tabela POWERS",
          "/api/tables/locations": "Rola na tabela LOCATIONS",
          "/api/tables/character-appearance": "Rola na tabela CHARACTER_APPEARANCE"
        },
        responseExample: {
          table: "adventure-tone",
          source: "ADVENTURE_TONE",
          roll: 42,
          word: "Hard"
        }
      },
      adventureState: {
        description: "Estado persistente simples da aventura (evoluível para login no futuro)",
        profileKey: "Usa profile=... (query) ou header x-profile-key. Sem enviar, usa 'anonymous'.",
        routes: {
          "/api/adventure/cf": "GET consulta CF atual; POST atualiza com body { chaosFactor: 1..9 }",
          "/api/adventure/cf/[cflvl]": "GET atualiza CF para cf1..cf9 (ou 1..9)"
        },
        examples: {
          "/api/adventure/cf": "Consulta CF atual",
          "/api/adventure/cf/cf4": "Define CF para 4",
          "/api/adventure/cf?profile=player-a": "Consulta CF do profile player-a"
        }
      },
      randomEvents: {
        description: "Random Events são gerados quando o d100 resulta em 'doubles' (11, 22, 33...) e o valor ≤ Chaos Factor",
        rules: {
          trigger: "Roll = double (11, 22, 33, etc.) E valor_double ≤ Chaos_Factor",
          example: "Roll 33 com CF5 = RE ativado (3 ≤ 5). Roll 77 com CF5 = RE não ativado (7 > 5)"
        },
        components: {
          focus: "Tipo do evento (12 opções: NPC Action, Current Context, etc.)",
          meaning: {
            action: "Verbo de ação (100 opções)",
            subject: "Substantivo (100 opções)",
            description: "2 descritores (100 opções cada)"
          }
        }
      },
      fateResults: {
        description: "Tipos de resultado do Fate Chart",
        types: [
          "EXCEPTIONAL YES - Roll muito baixo, sucesso extraordinário",
          "YES - Roll moderado, sucesso",
          "NO - Roll alto, falha",
          "EXCEPTIONAL NO - Roll muito alto, falha catastrófica"
        ]
      }
    },
    usage: {
      get: "Todas as rotas de rolagem usam método GET",
      post: "/api/chat/message usa POST",
      cors: "CORS habilitado para todos os domínios",
      rateLimit: "Sem limite de requisições"
    },
    source: "Based on Mythic Game Master Emulator 2nd Edition by Tana Pigeon",
    repository: "https://github.com/claudionegao/Mythic-Api"
  });
}
