export const GAME_GROUPS = [
  {
    id: 'generation-i-kanto',
    label: 'Generation I — Kanto',
    gameGenerationLabel: 'Generation III',
    dexGenerationLabel: 'Generation I',
    pokemonGeneration: 'generation-i',
    mechanicsGeneration: 3,
    spriteGeneration: 'generation-iii',
    spriteGenerationLabel: 'Generation III',
    region: 'Kanto',
    games: [
      {
        id: 'firered',
        label: 'FireRed',
        fullLabel: 'Pokémon FireRed',
        shortLabel: 'FR',
        versionGroup: 'firered-leafgreen',
        spriteSet: 'firered-leafgreen',
        accent: '#e25b3f',
        darkAccent: '#923624',
      },
      {
        id: 'leafgreen',
        label: 'LeafGreen',
        fullLabel: 'Pokémon LeafGreen',
        shortLabel: 'LG',
        versionGroup: 'firered-leafgreen',
        spriteSet: 'firered-leafgreen',
        accent: '#69a94b',
        darkAccent: '#3e6d31',
      },
    ],
  },
  {
    id: 'generation-ii-johto',
    label: 'Generation II — Johto',
    gameGenerationLabel: 'Generation IV',
    dexGenerationLabel: 'Generation II',
    pokemonGeneration: 'generation-ii',
    mechanicsGeneration: 4,
    spriteGeneration: 'generation-iii',
    spriteGenerationLabel: 'Generation III',
    region: 'Johto',
    games: [
      {
        id: 'heartgold',
        label: 'HeartGold',
        fullLabel: 'Pokémon HeartGold',
        shortLabel: 'HG',
        versionGroup: 'heartgold-soulsilver',
        spriteSet: 'emerald',
        accent: '#8b6412',
        darkAccent: '#5c410c',
      },
      {
        id: 'soulsilver',
        label: 'SoulSilver',
        fullLabel: 'Pokémon SoulSilver',
        shortLabel: 'SS',
        versionGroup: 'heartgold-soulsilver',
        spriteSet: 'emerald',
        accent: '#4f7987',
        darkAccent: '#2c4d59',
      },
    ],
  },
  {
    id: 'generation-iii-hoenn',
    label: 'Generation III — Hoenn',
    gameGenerationLabel: 'Generation III',
    dexGenerationLabel: 'Generation III',
    pokemonGeneration: 'generation-iii',
    mechanicsGeneration: 3,
    spriteGeneration: 'generation-iii',
    spriteGenerationLabel: 'Generation III',
    region: 'Hoenn',
    games: [
      {
        id: 'ruby',
        label: 'Ruby',
        fullLabel: 'Pokémon Ruby',
        shortLabel: 'R',
        versionGroup: 'ruby-sapphire',
        spriteSet: 'ruby-sapphire',
        accent: '#c84c5a',
        darkAccent: '#7f2836',
      },
      {
        id: 'sapphire',
        label: 'Sapphire',
        fullLabel: 'Pokémon Sapphire',
        shortLabel: 'S',
        versionGroup: 'ruby-sapphire',
        spriteSet: 'ruby-sapphire',
        accent: '#3977bd',
        darkAccent: '#205080',
      },
      {
        id: 'emerald',
        label: 'Emerald',
        fullLabel: 'Pokémon Emerald',
        shortLabel: 'E',
        versionGroup: 'emerald',
        spriteSet: 'emerald',
        accent: '#3a9a72',
        darkAccent: '#24654c',
      },
    ],
  },
  {
    id: 'generation-iv-sinnoh',
    label: 'Generation IV — Sinnoh',
    gameGenerationLabel: 'Generation IV',
    dexGenerationLabel: 'Generation IV',
    pokemonGeneration: 'generation-iv',
    mechanicsGeneration: 4,
    spriteGeneration: 'generation-iv',
    spriteGenerationLabel: 'Generation IV',
    region: 'Sinnoh',
    games: [
      {
        id: 'diamond',
        label: 'Diamond',
        fullLabel: 'Pokémon Diamond',
        shortLabel: 'D',
        versionGroup: 'diamond-pearl',
        spriteSet: 'diamond-pearl',
        accent: '#3f67a0',
        darkAccent: '#28446d',
      },
      {
        id: 'pearl',
        label: 'Pearl',
        fullLabel: 'Pokémon Pearl',
        shortLabel: 'P',
        versionGroup: 'diamond-pearl',
        spriteSet: 'diamond-pearl',
        accent: '#97516d',
        darkAccent: '#663449',
      },
      {
        id: 'platinum',
        label: 'Platinum',
        fullLabel: 'Pokémon Platinum',
        shortLabel: 'Pt',
        versionGroup: 'platinum',
        spriteSet: 'platinum',
        accent: '#596775',
        darkAccent: '#394550',
      },
    ],
  },
]

export const GAME_CATALOG = GAME_GROUPS.flatMap((group) =>
  group.games.map((game) => ({
    ...game,
    groupId: group.id,
    groupLabel: group.label,
    gameGenerationLabel: group.gameGenerationLabel,
    dexGenerationLabel: group.dexGenerationLabel,
    pokemonGeneration: group.pokemonGeneration,
    mechanicsGeneration: group.mechanicsGeneration,
    spriteGeneration: group.spriteGeneration,
    spriteGenerationLabel: group.spriteGenerationLabel,
    region: group.region,
  })),
)

export const GAME_META = Object.fromEntries(GAME_CATALOG.map((game) => [game.id, game]))
export const GAME_IDS = GAME_CATALOG.map(({ id }) => id)
export const DEFAULT_GAME_ID = 'emerald'

export function gamesInGroup(gameId) {
  const groupId = GAME_META[gameId]?.groupId
  return GAME_CATALOG.filter((game) => game.groupId === groupId)
}

export function encountersForGame(pokemon, gameId) {
  return pokemon.encounters?.[gameId] ?? []
}

export function evolutionRoutesForGame(pokemon, gameId) {
  const game = GAME_META[gameId]
  if (!game) return []

  return (pokemon.evolutionRoutes?.[game.versionGroup] ?? [])
    .filter(({ introducedGeneration = 1 }) => introducedGeneration <= game.mechanicsGeneration)
    .map(({ direction, from, to, methods = [], unavailableReason = null }) => ({
      direction,
      from,
      to,
      methods,
      unavailableReason,
    }))
}
