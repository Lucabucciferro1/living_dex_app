import { mkdir, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { GAME_CATALOG, GAME_GROUPS, GAME_IDS } from '../src/gameCatalog.js'

const ROOT = path.resolve(import.meta.dirname, '..')
const DATA_DIR = path.join(ROOT, 'src', 'data')
const SPRITE_ROOT = path.join(ROOT, 'public', 'sprites')
const POKEMON_LIMIT = 649
const GAMES = GAME_IDS
const MECHANICS_BY_POKEMON_GENERATION = new Map(
  GAME_GROUPS.map(({ pokemonGeneration, mechanicsGeneration }) => [pokemonGeneration, mechanicsGeneration]),
)
const SPRITE_SOURCES = [
  ...new Map(
    GAME_CATALOG.map(({ spriteGeneration, spriteSet, spriteExtension = 'png' }) => [
      `${spriteGeneration}:${spriteSet}:${spriteExtension}`,
      { generation: spriteGeneration, set: spriteSet, extension: spriteExtension },
    ]),
  ).values(),
]
const ANIMATED_SPRITE_SOURCES = [
  ...new Map(
    GAME_CATALOG
      .filter(({ animatedSpriteSet }) => animatedSpriteSet)
      .map(({ spriteGeneration, animatedSpriteSet, animatedSpriteExtension = 'gif' }) => [
        `${spriteGeneration}:${animatedSpriteSet}:${animatedSpriteExtension}`,
        { generation: spriteGeneration, set: animatedSpriteSet, extension: animatedSpriteExtension },
      ]),
  ).values(),
]
const SPRITE_SETS = [
  ...new Set([
    ...SPRITE_SOURCES.map(({ set }) => set),
    ...ANIMATED_SPRITE_SOURCES.map(({ set }) => set),
  ]),
]
const VERSION_GROUP_CONFIGS = [
  ...new Map(
    GAME_CATALOG.map((game) => [
      game.versionGroup,
      {
        id: game.versionGroup,
        mechanicsGeneration: game.mechanicsGeneration,
        region: game.region,
      },
    ]),
  ).values(),
]

const RESOURCE_DISPLAY_NAMES = {
  'ancient-power': 'Ancient Power',
  'deep-sea-scale': 'Deep Sea Scale',
  'deep-sea-tooth': 'Deep Sea Tooth',
  'kings-rock': "King's Rock",
  'mt-coronet': 'Mt. Coronet',
  'sinnoh-route-217': 'Route 217',
  'up-grade': 'Up-Grade',
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function fetchWithRetry(url, options = {}, attempts = 5, allowNotFound = false) {
  let lastError

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(url, options)
      if (allowNotFound && response.status === 404) return null
      if (!response.ok) throw new Error(`${response.status} ${response.statusText}`)
      return response
    } catch (error) {
      lastError = error
      if (attempt < attempts) await sleep(250 * 2 ** (attempt - 1))
    }
  }

  throw new Error(`Failed to fetch ${url}: ${lastError?.message}`)
}

async function runPool(items, worker, concurrency = 14) {
  let cursor = 0
  const results = new Array(items.length)

  async function next() {
    while (cursor < items.length) {
      const index = cursor
      cursor += 1
      results[index] = await worker(items[index], index)
    }
  }

  await Promise.all(Array.from({ length: concurrency }, next))
  return results
}

function titleCase(value) {
  return value
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function displayName(name) {
  const specialNames = {
    'deoxys-normal': 'Deoxys',
    'deoxys': 'Deoxys',
    'farfetchd': 'Farfetch’d',
    'mr-mime': 'Mr. Mime',
    'nidoran-f': 'Nidoran♀',
    'nidoran-m': 'Nidoran♂',
    'ho-oh': 'Ho-Oh',
  }
  return specialNames[name] ?? titleCase(name)
}

function displayLocation(slug) {
  return titleCase(
    slug
      .replace(/^(hoenn|kanto|johto|sinnoh|unova)-/, '')
      .replace(/-area$/, '')
      .replace(/-b[0-9]+f$/, (floor) => `-${floor.slice(1).toUpperCase()}`),
  )
}

function resourceId(resource) {
  return Number(resource?.url?.match(/\/(\d+)\/$/)?.[1]) || null
}

function displayResource(resource) {
  if (!resource?.name) return null
  return RESOURCE_DISPLAY_NAMES[resource.name] ?? displayName(resource.name)
}

function versionGroupLabel(versionGroup) {
  const labels = GAME_CATALOG
    .filter((game) => game.versionGroup === versionGroup)
    .map(({ label }) => label)

  if (labels.length === 0) return titleCase(versionGroup)
  if (labels.length === 1) return labels[0]
  return `${labels.slice(0, -1).join(', ')} and ${labels.at(-1)}`
}

function compactEncounterDetails(details) {
  const grouped = new Map()

  for (const detail of details) {
    const method = detail.method.name
    const conditions = detail.condition_values.map(({ name }) => titleCase(name))
    const key = [method, detail.min_level, detail.max_level, conditions.join('|')].join(':')
    const current = grouped.get(key)

    if (current) {
      current.chance = Math.min(100, current.chance + detail.chance)
    } else {
      grouped.set(key, {
        method: titleCase(method),
        minLevel: detail.min_level,
        maxLevel: detail.max_level,
        chance: detail.chance,
        conditions,
      })
    }
  }

  return [...grouped.values()]
}

function maximumChanceByMethod(details) {
  const totals = new Map()

  for (const detail of details) {
    const conditions = detail.condition_values.map(({ name }) => name).sort().join('|')
    const key = `${detail.method.name}:${conditions}`
    totals.set(key, Math.min(100, (totals.get(key) ?? 0) + detail.chance))
  }

  return Math.max(0, ...totals.values())
}

function generationNumber(name) {
  const roman = name.replace('generation-', '')
  const values = { i: 1, ii: 2, iii: 3, iv: 4, v: 5, vi: 6, vii: 7, viii: 8, ix: 9 }
  return values[roman] ?? Number.POSITIVE_INFINITY
}

function typesInGeneration(details, targetGeneration) {
  const historicalTypes = details.past_types
    .map((entry) => ({ ...entry, lastGeneration: generationNumber(entry.generation.name) }))
    .filter(({ lastGeneration }) => lastGeneration >= targetGeneration)
    .sort((a, b) => a.lastGeneration - b.lastGeneration)[0]?.types

  return (historicalTypes ?? details.types)
    .sort((a, b) => a.slot - b.slot)
    .map(({ type }) => type.name)
}

function encountersByGame(encounters) {
  const result = Object.fromEntries(GAMES.map((game) => [game, []]))

  for (const encounter of encounters) {
    for (const version of encounter.version_details) {
      const game = version.version.name
      if (!GAMES.includes(game)) continue

      const compactedDetails = compactEncounterDetails(version.encounter_details)
      result[game].push({
        area: displayLocation(encounter.location_area.name),
        areaSlug: encounter.location_area.name,
        maxChance: maximumChanceByMethod(version.encounter_details),
        details: compactedDetails,
      })
    }
  }

  for (const game of GAMES) {
    result[game].sort((a, b) => a.area.localeCompare(b.area, undefined, { numeric: true }))
  }

  return result
}

function flattenEvolutionTransitions(chains, pokemonById) {
  const transitions = []

  function visit(node) {
    const fromId = resourceId(node.species)

    for (const child of node.evolves_to ?? []) {
      const toId = resourceId(child.species)
      const fromPokemon = pokemonById.get(fromId)
      const toPokemon = pokemonById.get(toId)
      const details = child.evolution_details ?? []

      if (fromPokemon && toPokemon && details.length > 0) {
        transitions.push({
          from: { id: fromId, name: fromPokemon.displayName },
          to: { id: toId, name: toPokemon.displayName },
          introducedGeneration: Math.max(
            generationNumber(fromPokemon.generation),
            generationNumber(toPokemon.generation),
          ),
          details,
        })
      }

      visit(child)
    }
  }

  for (const chain of chains) visit(chain.chain)
  return transitions
}

function knownMoveLearnLevel(pokemonBuildById, pokemonId, moveName, versionGroup) {
  const move = pokemonBuildById.get(pokemonId)?.moves
    ?.find(({ move: moveResource }) => moveResource.name === moveName)

  const levels = (move?.version_group_details ?? [])
    .filter(({ move_learn_method: method, version_group: group }) => (
      method.name === 'level-up' && group.name === versionGroup
    ))
    .map(({ level_learned_at: level }) => level)
    .filter((level) => level > 0)

  return levels.length > 0 ? Math.min(...levels) : null
}

function evolutionUnavailableReason(detail, versionGroup) {
  if (versionGroup.id === 'firered-leafgreen' && detail.time_of_day) {
    return 'FireRed and LeafGreen have no time-of-day evolution. Evolve this Pokémon in Ruby, Sapphire, or Emerald, then trade it back.'
  }

  if (versionGroup.id === 'heartgold-soulsilver' && detail.location) {
    return 'HeartGold and SoulSilver do not support this location evolution. Evolve it in Diamond, Pearl, or Platinum, then trade it back.'
  }

  return null
}

function normalizeEvolutionMethod(detail, transition, versionGroup, pokemonBuildById) {
  const method = {
    trigger: detail.trigger?.name ?? 'level-up',
  }
  const notes = []

  if (detail.min_level != null) method.minLevel = detail.min_level
  if (detail.item) method.item = displayResource(detail.item)
  if (detail.held_item) method.heldItem = displayResource(detail.held_item)

  if (detail.known_move) {
    method.knownMove = displayResource(detail.known_move)
    const learnLevel = knownMoveLearnLevel(
      pokemonBuildById,
      transition.from.id,
      detail.known_move.name,
      versionGroup.id,
    )
    if (learnLevel > 1) method.knownMoveLevel = learnLevel
    if (learnLevel === 1) notes.push(`Use the Move Reminder to teach ${method.knownMove} if needed.`)
  }

  if (detail.trade_species) method.tradeSpecies = displayResource(detail.trade_species)
  if (detail.location) method.location = displayResource(detail.location)
  if (detail.min_happiness != null) method.minFriendship = 220
  if (detail.min_beauty != null) method.minBeauty = detail.min_beauty
  if (detail.time_of_day) method.timeOfDay = titleCase(detail.time_of_day)
  if (detail.gender === 1) method.gender = 'Female'
  if (detail.gender === 2) method.gender = 'Male'
  if (detail.party_species) method.partySpecies = displayResource(detail.party_species)
  if (detail.party_type) method.partyType = displayResource(detail.party_type)

  const relativeStats = {
    '-1': 'Attack < Defense',
    0: 'Attack = Defense',
    1: 'Attack > Defense',
  }
  if (detail.relative_physical_stats != null) {
    method.relativePhysicalStats = relativeStats[detail.relative_physical_stats]
  }

  const locationConditions = {
    462: 'Special magnetic field',
    470: 'Near the Moss Rock',
    471: 'Near the Ice Rock',
    476: 'Special magnetic field',
  }
  if (detail.location && locationConditions[transition.to.id]) {
    method.specialCondition = locationConditions[transition.to.id]
  }

  if (method.trigger === 'shed') {
    method.minLevel = 20
    method.specialCondition = versionGroup.mechanicsGeneration <= 3
      ? 'Evolve Nincada with an empty party slot'
      : 'Evolve Nincada with an empty party slot and a regular Poké Ball'
  }

  if (transition.from.id === 265 && [266, 268].includes(transition.to.id)) {
    method.specialCondition = 'Wurmple’s hidden personality value determines this branch'
  }
  if (detail.min_beauty != null && versionGroup.id === 'firered-leafgreen') {
    notes.push('Beauty cannot be raised here; raise it in Ruby, Sapphire, or Emerald before trading Feebas over.')
  }
  if (detail.min_beauty != null && versionGroup.id === 'heartgold-soulsilver') {
    notes.push('Beauty is hidden in HeartGold and SoulSilver; it must reach 170 before leveling up.')
  }
  if (versionGroup.id === 'firered-leafgreen' && transition.introducedGeneration > 1) {
    notes.push('The National Pokédex must be unlocked first.')
  }
  if (notes.length > 0) method.notes = notes

  return method
}

function buildEvolutionRoutes({
  pokemon,
  pokemonBuildById,
  transitions,
  versionGroupMeta,
}) {
  const routesByPokemon = new Map(
    pokemon.map(({ id }) => [
      id,
      Object.fromEntries(VERSION_GROUP_CONFIGS.map(({ id: versionGroup }) => [versionGroup, []])),
    ]),
  )

  for (const transition of transitions) {
    for (const configuredGroup of VERSION_GROUP_CONFIGS) {
      const versionGroup = {
        ...configuredGroup,
        ...versionGroupMeta.get(configuredGroup.id),
      }

      if (transition.introducedGeneration > versionGroup.mechanicsGeneration) continue

      const inheritedDetails = transition.details.filter((detail) => {
        if (!detail.version_group) return true
        const detailVersionGroup = versionGroupMeta.get(detail.version_group.name)
        return detailVersionGroup
          && detailVersionGroup.generation <= versionGroup.mechanicsGeneration
          && detailVersionGroup.order <= versionGroup.order
      })
      const locationDetails = inheritedDetails.filter(({ location }) => location)
      const latestLocationOrder = Math.max(
        -1,
        ...locationDetails.map((detail) => versionGroupMeta.get(detail.version_group?.name)?.order ?? 0),
      )
      const applicableDetails = inheritedDetails.filter((detail) => (
        !detail.location
        || (versionGroupMeta.get(detail.version_group?.name)?.order ?? 0) === latestLocationOrder
      ))

      const availableDetails = applicableDetails.filter((detail) => !evolutionUnavailableReason(detail, versionGroup))
      const unavailableReasons = applicableDetails
        .map((detail) => evolutionUnavailableReason(detail, versionGroup))
        .filter(Boolean)

      const methods = [
        ...new Map(
          availableDetails.map((detail) => {
            const method = normalizeEvolutionMethod(detail, transition, versionGroup, pokemonBuildById)
            return [JSON.stringify(method), method]
          }),
        ).values(),
      ]

      const unavailableReason = methods.length === 0
        ? unavailableReasons[0] ?? `This evolution is not available in ${versionGroupLabel(versionGroup.id)}.`
        : null

      const route = {
        introducedGeneration: transition.introducedGeneration,
        from: transition.from,
        to: transition.to,
        methods,
        unavailableReason,
      }

      routesByPokemon.get(transition.from.id)[versionGroup.id].push({ direction: 'to', ...route })
      routesByPokemon.get(transition.to.id)[versionGroup.id].push({ direction: 'from', ...route })
    }
  }

  for (const routesByVersionGroup of routesByPokemon.values()) {
    for (const routes of Object.values(routesByVersionGroup)) {
      routes.sort((a, b) => {
        if (a.direction !== b.direction) return a.direction === 'from' ? -1 : 1
        return a.to.id - b.to.id || a.from.id - b.from.id
      })
    }
  }

  return routesByPokemon
}

async function downloadSprite(id, set, generation, extension = 'png', optional = false) {
  const folder = path.join(SPRITE_ROOT, set)
  const target = path.join(folder, `${id}.${extension}`)
  if (existsSync(target)) return true

  const url = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/${generation}/${set}/${id}.${extension}`
  const response = await fetchWithRetry(url, {}, 5, optional)
  if (!response) return false
  await writeFile(target, Buffer.from(await response.arrayBuffer()))
  return true
}

async function main() {
  await mkdir(DATA_DIR, { recursive: true })
  await Promise.all(SPRITE_SETS.map((set) => mkdir(path.join(SPRITE_ROOT, set), { recursive: true })))

  console.log('Fetching National Dex list…')
  const listResponse = await fetchWithRetry(`https://pokeapi.co/api/v2/pokemon-species?limit=${POKEMON_LIMIT}&offset=0`)
  const { results: pokemonList } = await listResponse.json()

  console.log('Fetching Pokémon details and supported-game encounters…')
  const pokemonBuildEntries = await runPool(pokemonList, async ({ name }, index) => {
    const id = index + 1
    const [detailsResponse, speciesResponse, encountersResponse] = await Promise.all([
      fetchWithRetry(`https://pokeapi.co/api/v2/pokemon/${id}`),
      fetchWithRetry(`https://pokeapi.co/api/v2/pokemon-species/${id}`),
      fetchWithRetry(`https://pokeapi.co/api/v2/pokemon/${id}/encounters`),
    ])
    const [details, species, encounters] = await Promise.all([
      detailsResponse.json(),
      speciesResponse.json(),
      encountersResponse.json(),
    ])

    const englishName = species.names.find(({ language }) => language.name === 'en')?.name
    const englishGenus = species.genera.find(({ language }) => language.name === 'en')?.genus

    if (id % 25 === 0 || id === POKEMON_LIMIT) {
      console.log(`  Processed ${id}/${POKEMON_LIMIT}`)
    }

    return {
      data: {
        id,
        name,
        displayName: englishName ?? displayName(name),
        genus: englishGenus ?? 'Pokémon',
        generation: species.generation.name,
        evolvesFrom: species.evolves_from_species
          ? {
              id: resourceId(species.evolves_from_species),
              name: displayName(species.evolves_from_species.name),
            }
          : null,
        types: typesInGeneration(
          details,
          MECHANICS_BY_POKEMON_GENERATION.get(species.generation.name) ?? Number.POSITIVE_INFINITY,
        ),
        height: details.height,
        weight: details.weight,
        encounters: encountersByGame(encounters),
      },
      evolutionChainUrl: species.evolution_chain?.url ?? null,
      moves: details.moves,
    }
  })

  const pokemon = pokemonBuildEntries.map(({ data }) => data)
  const pokemonById = new Map(pokemon.map((entry) => [entry.id, entry]))
  const pokemonBuildById = new Map(pokemonBuildEntries.map((entry) => [entry.data.id, entry]))

  const evolutionChainUrls = [
    ...new Set(pokemonBuildEntries.map(({ evolutionChainUrl }) => evolutionChainUrl).filter(Boolean)),
  ]
  console.log(`Fetching ${evolutionChainUrls.length} unique evolution chains…`)
  const evolutionChains = await runPool(evolutionChainUrls, async (url, index) => {
    if ((index + 1) % 50 === 0 || index + 1 === evolutionChainUrls.length) {
      console.log(`  Processed ${index + 1}/${evolutionChainUrls.length} evolution chains`)
    }
    return (await fetchWithRetry(url)).json()
  }, 12)

  const evolutionTransitions = flattenEvolutionTransitions(evolutionChains, pokemonById)
  const versionGroups = [
    ...new Set([
      ...VERSION_GROUP_CONFIGS.map(({ id }) => id),
      ...evolutionTransitions.flatMap(({ details }) => (
        details.map(({ version_group: versionGroup }) => versionGroup?.name).filter(Boolean)
      )),
    ]),
  ]

  console.log(`Resolving ${versionGroups.length} evolution-rule version groups…`)
  const versionGroupMeta = new Map(await runPool(versionGroups, async (versionGroup) => {
    const response = await fetchWithRetry(`https://pokeapi.co/api/v2/version-group/${versionGroup}`)
    const details = await response.json()
    return [
      versionGroup,
      {
        order: details.order,
        generation: generationNumber(details.generation.name),
      },
    ]
  }, 10))

  const evolutionRoutesByPokemon = buildEvolutionRoutes({
    pokemon,
    pokemonBuildById,
    transitions: evolutionTransitions,
    versionGroupMeta,
  })

  for (const entry of pokemon) {
    entry.evolutionRoutes = evolutionRoutesByPokemon.get(entry.id)
  }

  console.log('Downloading configured sprite sets…')
  const spriteJobs = [
    ...new Map(
      GAME_CATALOG.flatMap((game) =>
        pokemon
          .filter(({ generation }) => !game.pokemonGeneration || generation === game.pokemonGeneration)
          .map(({ id }) => [
            `${game.spriteGeneration}:${game.spriteSet}:${game.spriteExtension ?? 'png'}:${id}`,
            {
              id,
              set: game.spriteSet,
              generation: game.spriteGeneration,
              extension: game.spriteExtension ?? 'png',
            },
          ]),
      ),
    ).values(),
  ]
  await runPool(spriteJobs, ({ id, set, generation, extension }, index) => {
    if ((index + 1) % 100 === 0 || index + 1 === spriteJobs.length) {
      console.log(`  Downloaded ${index + 1}/${spriteJobs.length}`)
    }
    return downloadSprite(id, set, generation, extension)
  }, 20)

  const animatedSpriteJobs = [
    ...new Map(
      GAME_CATALOG
        .filter(({ animatedSpriteSet }) => animatedSpriteSet)
        .flatMap((game) =>
          pokemon
            .filter(({ generation }) => !game.pokemonGeneration || generation === game.pokemonGeneration)
            .map(({ id }) => [
              `${game.spriteGeneration}:${game.animatedSpriteSet}:${game.animatedSpriteExtension ?? 'gif'}:${id}`,
              {
                id,
                set: game.animatedSpriteSet,
                generation: game.spriteGeneration,
                extension: game.animatedSpriteExtension ?? 'gif',
              },
            ]),
        ),
    ).values(),
  ]

  if (animatedSpriteJobs.length > 0) {
    console.log('Downloading optional animated detail sprites…')
    const animatedResults = await runPool(animatedSpriteJobs, ({ id, set, generation, extension }, index) => {
      if ((index + 1) % 50 === 0 || index + 1 === animatedSpriteJobs.length) {
        console.log(`  Processed ${index + 1}/${animatedSpriteJobs.length} animated sprites`)
      }
      return downloadSprite(id, set, generation, extension, true)
    }, 16)
    const missingAnimatedSprites = animatedResults.filter((downloaded) => !downloaded).length

    if (missingAnimatedSprites > 0) {
      console.log(`  ${missingAnimatedSprites} animated sprites were unavailable; the UI will use static fallbacks`)
    }
  }

  const output = {
    meta: {
      generatedAt: new Date().toISOString(),
      pokemonCount: pokemon.length,
      maxPokemonId: pokemon.at(-1)?.id ?? 0,
      games: GAMES,
      sources: {
        data: 'https://pokeapi.co/',
        sprites: 'https://github.com/PokeAPI/sprites',
      },
    },
    pokemon,
  }

  await writeFile(path.join(DATA_DIR, 'pokemon.json'), `${JSON.stringify(output)}\n`)
  console.log(`Wrote ${path.relative(ROOT, path.join(DATA_DIR, 'pokemon.json'))}`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
