import { eventAvailabilityForGame } from './eventCatalog.js'

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
  {
    id: 'generation-v-unova',
    label: 'Generation V — Unova',
    gameGenerationLabel: 'Generation V',
    dexGenerationLabel: 'Generation V',
    pokemonGeneration: 'generation-v',
    mechanicsGeneration: 5,
    spriteGeneration: 'generation-v',
    spriteGenerationLabel: 'Generation V',
    region: 'Unova',
    games: [
      {
        id: 'black',
        label: 'Black',
        fullLabel: 'Pokémon Black',
        shortLabel: 'B',
        versionGroup: 'black-white',
        spriteSet: 'black-white',
        spriteExtension: 'png',
        animatedSpriteSet: 'black-white/animated',
        animatedSpriteExtension: 'gif',
        animatedSpriteFallback: 'static',
        accent: '#3f4650',
        darkAccent: '#1f252b',
      },
      {
        id: 'white',
        label: 'White',
        fullLabel: 'Pokémon White',
        shortLabel: 'W',
        versionGroup: 'black-white',
        spriteSet: 'black-white',
        spriteExtension: 'png',
        animatedSpriteSet: 'black-white/animated',
        animatedSpriteExtension: 'gif',
        animatedSpriteFallback: 'static',
        accent: '#a9aaa3',
        darkAccent: '#656861',
      },
      {
        id: 'black-2',
        label: 'Black 2',
        fullLabel: 'Pokémon Black 2',
        shortLabel: 'B2',
        versionGroup: 'black-2-white-2',
        spriteSet: 'black-white',
        spriteExtension: 'png',
        animatedSpriteSet: 'black-white/animated',
        animatedSpriteExtension: 'gif',
        animatedSpriteFallback: 'static',
        accent: '#3b6593',
        darkAccent: '#233f61',
      },
      {
        id: 'white-2',
        label: 'White 2',
        fullLabel: 'Pokémon White 2',
        shortLabel: 'W2',
        versionGroup: 'black-2-white-2',
        spriteSet: 'black-white',
        spriteExtension: 'png',
        animatedSpriteSet: 'black-white/animated',
        animatedSpriteExtension: 'gif',
        animatedSpriteFallback: 'static',
        accent: '#c66469',
        darkAccent: '#813a40',
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

export const ALL_GAME_ID = 'all'

export const ALL_GAME_META = Object.freeze({
  id: ALL_GAME_ID,
  label: 'All generations',
  fullLabel: 'All supported generations',
  shortLabel: 'All',
  groupId: 'all-generations',
  groupLabel: 'All generations',
  gameGenerationLabel: 'Generations III–V',
  dexGenerationLabel: 'National Pokédex',
  pokemonGeneration: null,
  mechanicsGeneration: 5,
  spriteGeneration: null,
  spriteGenerationLabel: 'Generation-specific',
  region: 'National',
  accent: '#4f7987',
  darkAccent: '#2c4d59',
})

export const REAL_GAME_IDS = Object.freeze(GAME_CATALOG.map(({ id }) => id))

// Kept as the real-game list for the data generator and encounter schema.
export const GAME_IDS = REAL_GAME_IDS

export const SELECTABLE_GAME_IDS = Object.freeze([ALL_GAME_ID, ...REAL_GAME_IDS])

export const GAME_META = Object.freeze({
  [ALL_GAME_ID]: ALL_GAME_META,
  ...Object.fromEntries(GAME_CATALOG.map((game) => [game.id, game])),
})
export const DEFAULT_GAME_ID = 'firered'

export const REPRESENTATIVE_GAME_BY_POKEMON_GENERATION = Object.freeze({
  'generation-i': 'firered',
  'generation-ii': 'heartgold',
  'generation-iii': 'emerald',
  'generation-iv': 'platinum',
  'generation-v': 'black',
})

export function representativeGameForPokemonGeneration(pokemonOrGeneration) {
  const generation = typeof pokemonOrGeneration === 'string'
    ? pokemonOrGeneration
    : pokemonOrGeneration?.generation

  return REPRESENTATIVE_GAME_BY_POKEMON_GENERATION[generation] ?? DEFAULT_GAME_ID
}

export function gamesInGroup(gameId) {
  const groupId = GAME_META[gameId]?.groupId
  return GAME_CATALOG.filter((game) => game.groupId === groupId)
}

export function encountersForGame(pokemon, gameId) {
  const encounters = pokemon.encounters?.[gameId] ?? []
  const excludedAreaSlugs = eventAvailabilityForGame(pokemon, gameId)?.excludedEncounterAreaSlugs

  if (!excludedAreaSlugs?.length) return encounters
  return encounters.filter(({ areaSlug }) => !excludedAreaSlugs.includes(areaSlug))
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
