import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import App from './App.jsx'
import pokemonData from './data/pokemon.json'
import {
  EVENT_ONLY_AVAILABILITY,
  eventAvailabilityForGame,
  isEventOnlyForGame,
} from './eventCatalog.js'
import { GAME_IDS, encountersForGame, evolutionRoutesForGame } from './gameCatalog.js'

const emptyEncounters = () => ({
  firered: [],
  leafgreen: [],
  heartgold: [],
  soulsilver: [],
  ruby: [],
  sapphire: [],
  emerald: [],
  diamond: [],
  pearl: [],
  platinum: [],
  black: [],
  white: [],
  'black-2': [],
  'white-2': [],
})

const fixturePokemon = [
  {
    id: 1,
    name: 'bulbasaur',
    displayName: 'Bulbasaur',
    genus: 'Seed Pokémon',
    generation: 'generation-i',
    evolvesFrom: null,
    types: ['grass', 'poison'],
    height: 7,
    weight: 69,
    encounters: {
      firered: [
        {
          area: 'Pallet Town',
          areaSlug: 'pallet-town-area',
          maxChance: 100,
          details: [{ method: 'Gift', minLevel: 5, maxLevel: 5, chance: 100, conditions: [] }],
        },
      ],
      leafgreen: [
        {
          area: 'Pallet Town',
          areaSlug: 'pallet-town-area',
          maxChance: 100,
          details: [{ method: 'Gift', minLevel: 5, maxLevel: 5, chance: 100, conditions: [] }],
        },
      ],
    },
  },
  {
    id: 152,
    name: 'chikorita',
    displayName: 'Chikorita',
    genus: 'Leaf Pokémon',
    generation: 'generation-ii',
    evolvesFrom: null,
    types: ['grass'],
    height: 9,
    weight: 64,
    encounters: {
      heartgold: [
        {
          area: 'New Bark Town',
          areaSlug: 'new-bark-town-area',
          maxChance: 100,
          details: [{ method: 'Gift', minLevel: 5, maxLevel: 5, chance: 100, conditions: [] }],
        },
      ],
      soulsilver: [
        {
          area: 'New Bark Town',
          areaSlug: 'new-bark-town-area',
          maxChance: 100,
          details: [{ method: 'Gift', minLevel: 5, maxLevel: 5, chance: 100, conditions: [] }],
        },
      ],
    },
  },
  {
    id: 387,
    name: 'turtwig',
    displayName: 'Turtwig',
    genus: 'Tiny Leaf Pokémon',
    generation: 'generation-iv',
    evolvesFrom: null,
    types: ['grass'],
    height: 4,
    weight: 102,
    encounters: {
      diamond: [
        {
          area: 'Route 201',
          areaSlug: 'sinnoh-route-201-area',
          maxChance: 100,
          details: [{ method: 'Gift', minLevel: 5, maxLevel: 5, chance: 100, conditions: [] }],
        },
      ],
      pearl: [
        {
          area: 'Route 201',
          areaSlug: 'sinnoh-route-201-area',
          maxChance: 100,
          details: [{ method: 'Gift', minLevel: 5, maxLevel: 5, chance: 100, conditions: [] }],
        },
      ],
      platinum: [
        {
          area: 'Route 201',
          areaSlug: 'sinnoh-route-201-area',
          maxChance: 100,
          details: [{ method: 'Gift', minLevel: 5, maxLevel: 5, chance: 100, conditions: [] }],
        },
      ],
    },
  },
  {
    id: 252,
    name: 'treecko',
    displayName: 'Treecko',
    genus: 'Wood Gecko Pokémon',
    generation: 'generation-iii',
    evolvesFrom: null,
    types: ['grass'],
    height: 5,
    weight: 50,
    encounters: {
      ruby: [
        {
          area: 'Route 101',
          areaSlug: 'hoenn-route-101-area',
          maxChance: 100,
          details: [{ method: 'Gift', minLevel: 5, maxLevel: 5, chance: 100, conditions: [] }],
        },
      ],
      sapphire: [
        {
          area: 'Route 101',
          areaSlug: 'hoenn-route-101-area',
          maxChance: 100,
          details: [{ method: 'Gift', minLevel: 5, maxLevel: 5, chance: 100, conditions: [] }],
        },
      ],
      emerald: [
        {
          area: 'Route 101',
          areaSlug: 'hoenn-route-101-area',
          maxChance: 100,
          details: [{ method: 'Gift', minLevel: 5, maxLevel: 5, chance: 100, conditions: [] }],
        },
      ],
    },
  },
  {
    id: 253,
    name: 'grovyle',
    displayName: 'Grovyle',
    genus: 'Wood Gecko Pokémon',
    generation: 'generation-iii',
    evolvesFrom: { id: 252, name: 'Treecko' },
    types: ['grass'],
    height: 9,
    weight: 216,
    encounters: emptyEncounters(),
  },
  {
    id: 258,
    name: 'mudkip',
    displayName: 'Mudkip',
    genus: 'Mud Fish Pokémon',
    generation: 'generation-iii',
    evolvesFrom: null,
    types: ['water'],
    height: 4,
    weight: 76,
    encounters: emptyEncounters(),
  },
  {
    id: 495,
    name: 'snivy',
    displayName: 'Snivy',
    genus: 'Grass Snake Pokémon',
    generation: 'generation-v',
    evolvesFrom: null,
    types: ['grass'],
    height: 6,
    weight: 81,
    encounters: {
      ...emptyEncounters(),
      black: [
        {
          area: 'Nuvema Town',
          areaSlug: 'nuvema-town-area',
          maxChance: 100,
          details: [{ method: 'Gift', minLevel: 5, maxLevel: 5, chance: 100, conditions: [] }],
        },
      ],
      white: [
        {
          area: 'Nuvema Town',
          areaSlug: 'nuvema-town-area',
          maxChance: 100,
          details: [{ method: 'Gift', minLevel: 5, maxLevel: 5, chance: 100, conditions: [] }],
        },
      ],
      'black-2': [
        {
          area: 'Aspertia City',
          areaSlug: 'aspertia-city-area',
          maxChance: 100,
          details: [{ method: 'Gift', minLevel: 5, maxLevel: 5, chance: 100, conditions: [] }],
        },
      ],
      'white-2': [
        {
          area: 'Aspertia City',
          areaSlug: 'aspertia-city-area',
          maxChance: 100,
          details: [{ method: 'Gift', minLevel: 5, maxLevel: 5, chance: 100, conditions: [] }],
        },
      ],
    },
  },
]

describe('Living Dex Tracker', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('toggles caught state on right-click without opening the location dialog', async () => {
    localStorage.setItem('hoenn-living-dex-game-v1', 'emerald')
    render(<App pokemon={fixturePokemon} />)
    const card = screen.getByTestId('pokemon-card-252')

    expect(fireEvent.contextMenu(card)).toBe(false)
    expect(card).toHaveClass('is-caught')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('Treecko marked caught')

    await waitFor(() => {
      expect(JSON.parse(localStorage.getItem('hoenn-living-dex-caught-v1'))).toEqual([252])
    })

    fireEvent.contextMenu(card)
    expect(card).not.toHaveClass('is-caught')
  })

  it('opens version-specific encounter details on left-click and closes with Escape', async () => {
    const user = userEvent.setup()
    localStorage.setItem('hoenn-living-dex-game-v1', 'emerald')
    render(<App pokemon={fixturePokemon} />)

    await user.click(screen.getByRole('button', { name: 'View Treecko field notes' }))
    const dialog = screen.getByRole('dialog', { name: 'Treecko' })
    expect(within(dialog).getByRole('region', { name: 'Treecko field notes' })).toHaveAttribute('tabindex', '0')

    expect(within(dialog).getByText('Route 101')).toBeInTheDocument()
    expect(within(dialog).getByText('Gift')).toBeInTheDocument()
    expect(within(dialog).getByText('Lv. 5')).toBeInTheDocument()

    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('defaults to the Generation I collection and uses the header game selection for sprites and location details', async () => {
    const user = userEvent.setup()
    render(<App pokemon={fixturePokemon} />)

    const gameSelection = screen.getByLabelText('Game selection')
    expect(gameSelection).toHaveValue('firered')
    expect([...gameSelection.querySelectorAll('optgroup')].map(({ label }) => label)).toEqual([
      'Generation I — Kanto',
      'Generation II — Johto',
      'Generation III — Hoenn',
      'Generation IV — Sinnoh',
      'Generation V — Unova',
    ])
    expect(screen.getByRole('heading', { name: 'Kanto Living Dex' })).toBeInTheDocument()
    expect(screen.getByText('All 1 Pokémon first discovered in Generation I.')).toBeInTheDocument()
    expect(screen.getByText('Bulbasaur')).toBeInTheDocument()
    expect(screen.queryByText('Treecko')).not.toBeInTheDocument()
    expect(screen.getByAltText('Bulbasaur Generation III sprite')).toHaveAttribute('src', '/sprites/firered-leafgreen/1.png')

    await user.selectOptions(gameSelection, 'emerald')

    expect(screen.getByAltText('Treecko Generation III sprite')).toHaveAttribute('src', '/sprites/emerald/252.png')

    await user.selectOptions(gameSelection, 'ruby')

    expect(screen.getByAltText('Treecko Generation III sprite')).toHaveAttribute('src', '/sprites/ruby-sapphire/252.png')
    await user.click(screen.getByRole('button', { name: 'View Treecko field notes' }))
    expect(within(screen.getByRole('dialog')).getByText('Ruby Version')).toBeInTheDocument()
  })

  it('offers an All Pokémon view with a national header, progress, and generation-specific card sprites', async () => {
    const user = userEvent.setup()
    render(<App pokemon={fixturePokemon} />)

    const gameSelection = screen.getByLabelText('Game selection')
    const allOption = gameSelection.querySelector('option[value="all"]')

    expect(allOption).toBeInTheDocument()
    expect(allOption).toHaveTextContent('All Pokémon')

    await user.selectOptions(gameSelection, 'all')

    expect(screen.getByRole('heading', { name: 'National Living Dex' })).toBeInTheDocument()
    expect(screen.getByText(/All 7 Pokémon.*Generations I–V/i)).toBeInTheDocument()
    const progress = screen.getByLabelText('0 of 7 Pokémon caught')
    expect(progress).toHaveTextContent(/National.*Dex progress/i)

    for (const id of [1, 152, 252, 253, 258, 387, 495]) {
      expect(screen.getByTestId(`pokemon-card-${id}`)).toBeInTheDocument()
    }

    expect(within(screen.getByTestId('pokemon-card-1')).getByRole('img'))
      .toHaveAttribute('src', '/sprites/firered-leafgreen/1.png')
    expect(within(screen.getByTestId('pokemon-card-152')).getByRole('img'))
      .toHaveAttribute('src', '/sprites/emerald/152.png')
    expect(within(screen.getByTestId('pokemon-card-252')).getByRole('img'))
      .toHaveAttribute('src', '/sprites/emerald/252.png')
    expect(within(screen.getByTestId('pokemon-card-387')).getByRole('img'))
      .toHaveAttribute('src', '/sprites/platinum/387.png')
    expect(within(screen.getByTestId('pokemon-card-495')).getByRole('img'))
      .toHaveAttribute('src', '/sprites/black-white/495.png')
  })

  it('shows all 649 bundled Pokémon in the national view', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.selectOptions(screen.getByLabelText('Game selection'), 'all')

    expect(screen.getByLabelText('0 of 649 Pokémon caught')).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Search and filter Pokédex' }))
      .toHaveTextContent('649 of 649 entries shown')
    expect(screen.getByTestId('pokemon-card-1')).toBeInTheDocument()
    expect(screen.getByTestId('pokemon-card-649')).toBeInTheDocument()
  }, 15000)

  it('keeps search, type, and caught filters working across the national view', async () => {
    const user = userEvent.setup()
    render(<App pokemon={fixturePokemon} />)

    await user.selectOptions(screen.getByLabelText('Game selection'), 'all')
    const search = screen.getByRole('searchbox', { name: 'Search by Pokémon name or number' })

    await user.type(search, '#495')
    expect(screen.getByText('Snivy')).toBeInTheDocument()
    expect(screen.queryByText('Bulbasaur')).not.toBeInTheDocument()

    await user.clear(search)
    await user.selectOptions(screen.getByLabelText('Type'), 'water')
    expect(screen.getByText('Mudkip')).toBeInTheDocument()
    expect(screen.queryByText('Snivy')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Mark Mudkip caught' }))
    await user.selectOptions(screen.getByLabelText('Status'), 'caught')
    expect(screen.getByText('Mudkip')).toBeInTheDocument()
    expect(screen.queryByText('Treecko')).not.toBeInTheDocument()
  })

  it('opens a Generation V card from All in Black field notes with an animated sprite', async () => {
    const user = userEvent.setup()
    render(<App pokemon={fixturePokemon} />)

    await user.selectOptions(screen.getByLabelText('Game selection'), 'all')
    await user.click(screen.getByRole('button', { name: 'View Snivy field notes' }))

    const dialog = screen.getByRole('dialog', { name: 'Snivy' })
    expect(within(dialog).getByText('Black Version')).toBeInTheDocument()
    expect(within(dialog).getByAltText('Snivy animated Generation V sprite'))
      .toHaveAttribute('src', '/sprites/black-white/animated/495.gif')
    const selectedVersion = within(dialog).getByRole('group', { name: 'Choose version' })
      .querySelector('[aria-pressed="true"]')
    expect(selectedVersion).toHaveTextContent(/^BlackB$/)
  })

  it('keeps FireRed and LeafGreen in a separate Kanto section', async () => {
    const user = userEvent.setup()
    render(<App pokemon={fixturePokemon} />)

    const gameSelection = screen.getByLabelText('Game selection')
    expect(screen.getByRole('group', { name: 'Generation I — Kanto' })).toBeInTheDocument()

    await user.selectOptions(gameSelection, 'firered')

    expect(screen.getByRole('heading', { name: 'Kanto Living Dex' })).toBeInTheDocument()
    expect(screen.getByText('All 1 Pokémon first discovered in Generation I.')).toBeInTheDocument()
    expect(screen.queryByText('Treecko')).not.toBeInTheDocument()
    expect(screen.getByAltText('Bulbasaur Generation III sprite')).toHaveAttribute('src', '/sprites/firered-leafgreen/1.png')

    await user.click(screen.getByRole('button', { name: 'View Bulbasaur field notes' }))
    const dialog = screen.getByRole('dialog', { name: 'Bulbasaur' })
    expect(within(dialog).getByText('FireRed Version')).toBeInTheDocument()
    expect(within(dialog).getByText('Pallet Town')).toBeInTheDocument()
    expect(within(dialog).queryByText('Emerald')).not.toBeInTheDocument()
  })

  it('uses HeartGold and SoulSilver locations with Generation III sprites for Johto', async () => {
    const user = userEvent.setup()
    render(<App pokemon={fixturePokemon} />)

    const gameSelection = screen.getByLabelText('Game selection')
    expect(screen.getByRole('group', { name: 'Generation II — Johto' })).toBeInTheDocument()

    await user.selectOptions(gameSelection, 'heartgold')

    expect(screen.getByRole('heading', { name: 'Johto Living Dex' })).toBeInTheDocument()
    expect(screen.getByText('All 1 Pokémon first discovered in Generation II.')).toBeInTheDocument()
    expect(screen.queryByText('Bulbasaur')).not.toBeInTheDocument()
    expect(screen.queryByText('Treecko')).not.toBeInTheDocument()
    expect(screen.getByAltText('Chikorita Generation III sprite')).toHaveAttribute('src', '/sprites/emerald/152.png')

    await user.click(screen.getByRole('button', { name: 'View Chikorita field notes' }))
    const dialog = screen.getByRole('dialog', { name: 'Chikorita' })
    expect(within(dialog).getByText('HeartGold Version')).toBeInTheDocument()
    expect(within(dialog).getByText('New Bark Town')).toBeInTheDocument()
    expect(within(dialog).queryByText('Emerald')).not.toBeInTheDocument()

    await user.click(within(dialog).getByRole('button', { name: /SoulSilver/ }))
    expect(within(dialog).getByText('SoulSilver Version')).toBeInTheDocument()
  })

  it('uses Diamond, Pearl, and Platinum locations with Generation IV sprites for Sinnoh', async () => {
    const user = userEvent.setup()
    render(<App pokemon={fixturePokemon} />)

    await user.selectOptions(screen.getByLabelText('Game selection'), 'diamond')

    expect(screen.getByRole('heading', { name: 'Sinnoh Living Dex' })).toBeInTheDocument()
    expect(screen.getByText('All 1 Pokémon first discovered in Generation IV.')).toBeInTheDocument()
    expect(screen.queryByText('Chikorita')).not.toBeInTheDocument()
    expect(screen.getByAltText('Turtwig Generation IV sprite')).toHaveAttribute('src', '/sprites/diamond-pearl/387.png')

    await user.click(screen.getByRole('button', { name: 'View Turtwig field notes' }))
    const dialog = screen.getByRole('dialog', { name: 'Turtwig' })
    expect(within(dialog).getByText('Diamond Version')).toBeInTheDocument()
    expect(within(dialog).getByText('Route 201')).toBeInTheDocument()
    expect(within(dialog).queryByText('Emerald')).not.toBeInTheDocument()

    await user.click(within(dialog).getByRole('button', { name: /Platinum/ }))
    expect(within(dialog).getByText('Platinum Version')).toBeInTheDocument()
    expect(within(dialog).getByAltText('Turtwig Generation IV sprite')).toHaveAttribute('src', '/sprites/platinum/387.png')
  })

  it('scopes the Unova section to Generation V and uses an animated modal sprite with a static fallback', async () => {
    const user = userEvent.setup()
    render(<App pokemon={fixturePokemon} />)

    const gameSelection = screen.getByLabelText('Game selection')
    const unovaGroup = [...gameSelection.querySelectorAll('optgroup')]
      .find(({ label }) => label === 'Generation V — Unova')

    expect(unovaGroup).toBeDefined()
    expect([...unovaGroup.querySelectorAll('option')].map(({ value, textContent }) => [value, textContent])).toEqual([
      ['black', 'Pokémon Black'],
      ['white', 'Pokémon White'],
      ['black-2', 'Pokémon Black 2'],
      ['white-2', 'Pokémon White 2'],
    ])

    await user.selectOptions(gameSelection, 'black')

    expect(screen.getByRole('heading', { name: 'Unova Living Dex' })).toBeInTheDocument()
    expect(screen.getByText('All 1 Pokémon first discovered in Generation V.')).toBeInTheDocument()
    expect(screen.getByTestId('pokemon-card-495')).toBeInTheDocument()
    expect(screen.queryByTestId('pokemon-card-1')).not.toBeInTheDocument()
    expect(screen.queryByTestId('pokemon-card-152')).not.toBeInTheDocument()
    expect(screen.queryByTestId('pokemon-card-252')).not.toBeInTheDocument()
    expect(screen.queryByTestId('pokemon-card-387')).not.toBeInTheDocument()

    const gridSprite = within(screen.getByTestId('pokemon-card-495'))
      .getByAltText('Snivy Generation V sprite')
    expect(gridSprite).toHaveAttribute('src', '/sprites/black-white/495.png')

    await user.click(screen.getByRole('button', { name: 'View Snivy field notes' }))
    const dialog = screen.getByRole('dialog', { name: 'Snivy' })
    const versionButtons = within(dialog).getByRole('group', { name: 'Choose version' })
    expect(within(versionButtons).getAllByRole('button')).toHaveLength(4)
    expect([...versionButtons.querySelectorAll('button')].map((button) => button.textContent)).toEqual([
      'BlackB',
      'WhiteW',
      'Black 2B2',
      'White 2W2',
    ])

    const modalSprite = within(dialog).getByAltText('Snivy animated Generation V sprite')
    expect(modalSprite).toHaveAttribute('src', '/sprites/black-white/animated/495.gif')

    fireEvent.error(modalSprite)
    expect(modalSprite).toHaveAttribute('src', '/sprites/black-white/495.png')
  })

  it('restores caught Generation IV entries from existing local progress', () => {
    localStorage.setItem('hoenn-living-dex-game-v1', 'diamond')
    localStorage.setItem('hoenn-living-dex-caught-v1', '[387]')

    render(<App pokemon={fixturePokemon} />)

    expect(screen.getByTestId('pokemon-card-387')).toHaveClass('is-caught')
    expect(screen.getByLabelText('1 of 1 Pokémon caught')).toBeInTheDocument()
  })

  it('shows exact evolution requirements when a Pokémon has no direct encounter', async () => {
    const user = userEvent.setup()
    const grovyle = pokemonData.pokemon.find(({ id }) => id === 253)
    localStorage.setItem('hoenn-living-dex-game-v1', 'emerald')
    render(<App pokemon={[grovyle]} />)

    await user.click(screen.getByRole('button', { name: 'View Grovyle field notes' }))
    const dialog = screen.getByRole('dialog', { name: 'Grovyle' })
    const evolutionGuide = within(dialog).getByRole('region', { name: 'Evolution routes' })
    const incomingRoute = within(evolutionGuide).getByText('Evolves from').closest('li')

    expect(within(incomingRoute).getByText('Treecko')).toBeInTheDocument()
    expect(within(incomingRoute).getByText('Grovyle')).toBeInTheDocument()
    expect(within(incomingRoute).getByText('Level')).toBeInTheDocument()
    expect(within(incomingRoute).getByText('Lv. 16')).toBeInTheDocument()
    expect(within(dialog).getByText('No direct encounter in Emerald')).toBeInTheDocument()
  })

  it('identifies event-only availability on the card and in field notes', async () => {
    const user = userEvent.setup()
    const mew = pokemonData.pokemon.find(({ id }) => id === 151)
    render(<App pokemon={[mew]} />)

    const card = screen.getByTestId('pokemon-card-151')
    const fieldNotesButton = within(card).getByRole('button', { name: 'View Mew field notes' })

    expect(within(card).getByText('Event')).toBeInTheDocument()
    expect(fieldNotesButton).toHaveAccessibleDescription(/event-only in FireRed/i)

    await user.click(fieldNotesButton)
    const dialog = screen.getByRole('dialog', { name: 'Mew' })
    const eventNote = within(dialog).getByRole('note')

    expect(eventNote).toHaveAccessibleName(/event-only.*FireRed/i)
    expect(eventNote).toHaveTextContent(/special event|distribution/i)
  })

  it('does not mistake a normal static encounter for event-only availability', async () => {
    const user = userEvent.setup()
    const mewtwo = pokemonData.pokemon.find(({ id }) => id === 150)
    render(<App pokemon={[mewtwo]} />)

    const card = screen.getByTestId('pokemon-card-150')
    const fieldNotesButton = within(card).getByRole('button', { name: 'View Mewtwo field notes' })

    expect(within(card).getByText('Found')).toBeInTheDocument()
    expect(within(card).queryByText('Event')).not.toBeInTheDocument()
    expect(fieldNotesButton).not.toHaveAccessibleDescription(/event/i)

    await user.click(fieldNotesButton)
    expect(within(screen.getByRole('dialog', { name: 'Mewtwo' })).queryByRole('note')).not.toBeInTheDocument()
  })

  it('keeps unflagged no-location guidance free of event-only wording', async () => {
    const user = userEvent.setup()
    const phione = pokemonData.pokemon.find(({ id }) => id === 489)
    localStorage.setItem('hoenn-living-dex-game-v1', 'diamond')
    render(<App pokemon={[phione]} />)

    const card = screen.getByTestId('pokemon-card-489')
    expect(within(card).queryByText('Event')).not.toBeInTheDocument()

    await user.click(within(card).getByRole('button', { name: 'View Phione field notes' }))
    const dialog = screen.getByRole('dialog', { name: 'Phione' })
    const emptyState = within(dialog).getByText('No direct encounter in Diamond').closest('.no-locations')

    expect(within(dialog).queryByRole('note')).not.toBeInTheDocument()
    expect(emptyState).not.toHaveTextContent(/event/i)
  })

  it('searches by exact Pokédex number and combines status filters', async () => {
    const user = userEvent.setup()
    localStorage.setItem('hoenn-living-dex-game-v1', 'emerald')
    render(<App pokemon={fixturePokemon} />)

    const search = screen.getByRole('searchbox', { name: 'Search by Pokémon name or number' })
    await user.type(search, '#252')

    expect(screen.getByText('Treecko')).toBeInTheDocument()
    expect(screen.queryByText('Grovyle')).not.toBeInTheDocument()

    await user.clear(search)
    await user.click(screen.getByRole('button', { name: 'Mark Mudkip caught' }))
    await user.selectOptions(screen.getByLabelText('Status'), 'caught')

    expect(screen.getByText('Mudkip')).toBeInTheDocument()
    expect(screen.queryByText('Treecko')).not.toBeInTheDocument()
  })
})

describe('bundled Pokédex data', () => {
  it('contains one complete National Dex through Generation V with valid game encounter arrays', () => {
    const ids = pokemonData.pokemon.map(({ id }) => id)
    const introducedInGen1 = pokemonData.pokemon.filter(({ generation }) => generation === 'generation-i')
    const introducedInGen2 = pokemonData.pokemon.filter(({ generation }) => generation === 'generation-ii')
    const introducedInGen3 = pokemonData.pokemon.filter(({ generation }) => generation === 'generation-iii')
    const introducedInGen4 = pokemonData.pokemon.filter(({ generation }) => generation === 'generation-iv')
    const introducedInGen5 = pokemonData.pokemon.filter(({ generation }) => generation === 'generation-v')

    expect(pokemonData.pokemon).toHaveLength(649)
    expect(new Set(ids).size).toBe(649)
    expect(Math.min(...ids)).toBe(1)
    expect(Math.max(...ids)).toBe(649)
    expect(pokemonData.pokemon[385].displayName).toBe('Deoxys')
    expect(pokemonData.pokemon[492].displayName).toBe('Arceus')
    expect(pokemonData.pokemon[648].displayName).toBe('Genesect')
    expect(pokemonData.meta.games).toEqual([
      'firered',
      'leafgreen',
      'heartgold',
      'soulsilver',
      'ruby',
      'sapphire',
      'emerald',
      'diamond',
      'pearl',
      'platinum',
      'black',
      'white',
      'black-2',
      'white-2',
    ])
    expect(introducedInGen1).toHaveLength(151)
    expect(introducedInGen1[0].id).toBe(1)
    expect(introducedInGen1.at(-1).id).toBe(151)
    expect(introducedInGen2).toHaveLength(100)
    expect(introducedInGen2[0].id).toBe(152)
    expect(introducedInGen2.at(-1).id).toBe(251)
    expect(introducedInGen3).toHaveLength(135)
    expect(introducedInGen3[0].id).toBe(252)
    expect(introducedInGen3.at(-1).id).toBe(386)
    expect(introducedInGen4).toHaveLength(107)
    expect(introducedInGen4[0].id).toBe(387)
    expect(introducedInGen4.at(-1).id).toBe(493)
    expect(introducedInGen5).toHaveLength(156)
    expect(introducedInGen5[0].id).toBe(494)
    expect(introducedInGen5.at(-1).id).toBe(649)
    expect(introducedInGen1.filter(({ encounters }) => encounters.firered.length > 0)).toHaveLength(100)
    expect(introducedInGen1.filter(({ encounters }) => encounters.leafgreen.length > 0)).toHaveLength(100)
    expect(introducedInGen2.filter(({ encounters }) => encounters.heartgold.length > 0)).toHaveLength(59)
    expect(introducedInGen2.filter(({ encounters }) => encounters.soulsilver.length > 0)).toHaveLength(59)
    expect(introducedInGen4.filter(({ encounters }) => encounters.diamond.length > 0)).toHaveLength(61)
    expect(introducedInGen4.filter(({ encounters }) => encounters.pearl.length > 0)).toHaveLength(61)
    expect(introducedInGen4.filter(({ encounters }) => encounters.platinum.length > 0)).toHaveLength(62)
    expect(introducedInGen5.filter(({ encounters }) => encounters.black.length > 0)).toHaveLength(111)
    expect(introducedInGen5.filter(({ encounters }) => encounters.white.length > 0)).toHaveLength(111)
    expect(introducedInGen5.filter(({ encounters }) => encounters['black-2'].length > 0)).toHaveLength(109)
    expect(introducedInGen5.filter(({ encounters }) => encounters['white-2'].length > 0)).toHaveLength(109)
    expect(pokemonData.pokemon[164].encounters.heartgold).toHaveLength(0)
    expect(pokemonData.pokemon[164].encounters.soulsilver.length).toBeGreaterThan(0)
    expect(pokemonData.pokemon[166].encounters.heartgold.length).toBeGreaterThan(0)
    expect(pokemonData.pokemon[166].encounters.soulsilver).toHaveLength(0)
    expect(pokemonData.pokemon[22].encounters.firered.length).toBeGreaterThan(0)
    expect(pokemonData.pokemon[22].encounters.leafgreen).toHaveLength(0)
    expect(pokemonData.pokemon[26].encounters.firered).toHaveLength(0)
    expect(pokemonData.pokemon[26].encounters.leafgreen.length).toBeGreaterThan(0)
    expect(pokemonData.pokemon[34].types).toEqual(['normal'])
    expect(pokemonData.pokemon[430].encounters.diamond).toHaveLength(0)
    expect(pokemonData.pokemon[430].encounters.pearl.length).toBeGreaterThan(0)
    expect(pokemonData.pokemon[433].encounters.diamond.length).toBeGreaterThan(0)
    expect(pokemonData.pokemon[433].encounters.pearl).toHaveLength(0)
    expect(pokemonData.pokemon[486].encounters.platinum.length).toBeGreaterThan(0)
    expect(pokemonData.pokemon[467].types).toEqual(['normal', 'flying'])

    for (const pokemon of pokemonData.pokemon) {
      expect(pokemon.displayName).toBeTruthy()
      expect(pokemon.types.length).toBeGreaterThan(0)
      expect(Array.isArray(pokemon.encounters.ruby)).toBe(true)
      expect(Array.isArray(pokemon.encounters.sapphire)).toBe(true)
      expect(Array.isArray(pokemon.encounters.emerald)).toBe(true)
      expect(Array.isArray(pokemon.encounters.firered)).toBe(true)
      expect(Array.isArray(pokemon.encounters.leafgreen)).toBe(true)
      expect(Array.isArray(pokemon.encounters.heartgold)).toBe(true)
      expect(Array.isArray(pokemon.encounters.soulsilver)).toBe(true)
      expect(Array.isArray(pokemon.encounters.diamond)).toBe(true)
      expect(Array.isArray(pokemon.encounters.pearl)).toBe(true)
      expect(Array.isArray(pokemon.encounters.platinum)).toBe(true)
      expect(Array.isArray(pokemon.encounters.black)).toBe(true)
      expect(Array.isArray(pokemon.encounters.white)).toBe(true)
      expect(Array.isArray(pokemon.encounters['black-2'])).toBe(true)
      expect(Array.isArray(pokemon.encounters['white-2'])).toBe(true)
      for (const location of Object.values(pokemon.encounters).flat()) {
        expect(location.maxChance).toBeLessThanOrEqual(100)
      }
    }
  })

  it.each([
    ['Generation I', 'Mew', 151, 'firered'],
    ['Generation II', 'Celebi', 251, 'heartgold'],
    ['Generation III', 'Deoxys', 386, 'emerald'],
    ['Generation IV', 'Darkrai', 491, 'platinum'],
    ['Generation V', 'Victini', 494, 'black'],
  ])('flags %s event-only availability for %s in the selected game', (_generation, _name, id, game) => {
    const pokemon = pokemonData.pokemon.find((entry) => entry.id === id)

    expect(isEventOnlyForGame(pokemon, game)).toBe(true)
    expect(eventAvailabilityForGame(pokemon, game)).not.toBeNull()
  })

  it.each([
    ['Mewtwo', 150, 'firered'],
    ['Ho-Oh', 250, 'heartgold'],
    ['Rayquaza', 384, 'emerald'],
    ['Giratina', 487, 'platinum'],
    ['Reshiram', 643, 'black'],
    ['Phione', 489, 'diamond'],
    ['Zorua', 570, 'black'],
  ])('does not flag ordinary, breedable, or event-assisted %s as event-only', (_name, id, game) => {
    const pokemon = pokemonData.pokemon.find((entry) => entry.id === id)

    expect(isEventOnlyForGame(pokemon, game)).toBe(false)
    expect(eventAvailabilityForGame(pokemon, game)).toBeNull()
  })

  it('keeps the event-only catalogue restricted to the 12 event-origin species', () => {
    const eventPokemonIds = Object.keys(EVENT_ONLY_AVAILABILITY).map(Number)
    const gameRecords = Object.values(EVENT_ONLY_AVAILABILITY)
      .flatMap((availability) => Object.entries(availability))

    expect(eventPokemonIds).toEqual([151, 251, 385, 386, 490, 491, 492, 493, 494, 647, 648, 649])
    expect(gameRecords).toHaveLength(38)

    for (const [game, availability] of gameRecords) {
      expect(GAME_IDS).toContain(game)
      expect(availability.classification).toBe('event-only')
      expect(availability.summary).toBeTruthy()
      expect(availability.routes.length).toBeGreaterThan(0)
    }
  })

  it('hides programmed event encounters that were never officially unlocked', () => {
    const darkrai = pokemonData.pokemon.find(({ id }) => id === 491)
    const shaymin = pokemonData.pokemon.find(({ id }) => id === 492)
    const arceus = pokemonData.pokemon.find(({ id }) => id === 493)

    expect(encountersForGame(darkrai, 'diamond')).toHaveLength(0)
    expect(encountersForGame(darkrai, 'platinum').map(({ area }) => area)).toContain('Newmoon Island')
    expect(encountersForGame(shaymin, 'pearl')).toHaveLength(0)
    expect(encountersForGame(shaymin, 'platinum').map(({ area }) => area)).toContain('Flower Paradise')
    expect(encountersForGame(arceus, 'diamond')).toHaveLength(0)
    expect(encountersForGame(arceus, 'pearl')).toHaveLength(0)
    expect(encountersForGame(arceus, 'platinum')).toHaveLength(0)
  })

  it('provides game-aware evolution routes for every supported requirement type', () => {
    const pokemon = (id) => pokemonData.pokemon[id - 1]
    const route = (id, game, fromId, toId) => evolutionRoutesForGame(pokemon(id), game)
      .find(({ from, to }) => from.id === fromId && to.id === toId)

    expect(route(2, 'firered', 1, 2).methods[0]).toMatchObject({ trigger: 'level-up', minLevel: 16 })
    expect(route(134, 'firered', 133, 134).methods[0]).toMatchObject({ trigger: 'use-item', item: 'Water Stone' })
    expect(route(68, 'firered', 67, 68).methods[0]).toMatchObject({ trigger: 'trade' })
    expect(route(208, 'heartgold', 95, 208).methods[0]).toMatchObject({ trigger: 'trade', heldItem: 'Metal Coat' })
    expect(route(463, 'diamond', 108, 463).methods[0]).toMatchObject({ trigger: 'level-up', knownMove: 'Rollout' })
    expect(route(462, 'diamond', 82, 462).methods[0]).toMatchObject({ trigger: 'level-up', location: 'Mt. Coronet' })
    expect(route(472, 'platinum', 207, 472).methods[0]).toMatchObject({ heldItem: 'Razor Fang', timeOfDay: 'Night' })
    expect(route(169, 'emerald', 42, 169).methods[0]).toMatchObject({ minFriendship: 220 })
    expect(route(350, 'firered', 349, 350).methods[0]).toMatchObject({ minBeauty: 170 })
    expect(route(350, 'heartgold', 349, 350).methods[0].notes.join(' ')).toMatch(/Beauty is hidden/)
    expect(route(237, 'heartgold', 236, 237).methods[0]).toMatchObject({ minLevel: 20, relativePhysicalStats: 'Attack = Defense' })
    expect(route(413, 'diamond', 412, 413).methods[0]).toMatchObject({ minLevel: 20, gender: 'Female' })
    expect(route(458, 'diamond', 458, 226).methods[0]).toMatchObject({ partySpecies: 'Remoraid' })
    expect(route(266, 'emerald', 265, 266).methods[0].specialCondition).toMatch(/personality value/i)
    expect(route(292, 'emerald', 290, 292).methods[0]).toMatchObject({ trigger: 'shed', minLevel: 20 })
    expect(route(292, 'platinum', 290, 292).methods[0].specialCondition).toMatch(/regular Poké Ball/)
    expect(route(473, 'diamond', 221, 473).methods[0]).not.toHaveProperty('knownMoveLevel')
    expect(route(473, 'diamond', 221, 473).methods[0].notes.join(' ')).toMatch(/Move Reminder/)
    expect(route(490, 'diamond', 489, 490)).toBeUndefined()

    const heartGoldMagnezone = route(462, 'heartgold', 82, 462)
    expect(heartGoldMagnezone.methods).toHaveLength(0)
    expect(heartGoldMagnezone.unavailableReason).toMatch(/Diamond|Pearl|Platinum/)

    const fireRedEspeon = route(196, 'firered', 133, 196)
    expect(fireRedEspeon.methods).toHaveLength(0)
    expect(fireRedEspeon.unavailableReason).toMatch(/time/i)

    for (const entry of pokemonData.pokemon) {
      for (const game of GAME_IDS) {
        for (const evolution of evolutionRoutesForGame(entry, game)) {
          expect(['from', 'to']).toContain(evolution.direction)
          expect(evolution.from.id).toBeGreaterThan(0)
          expect(evolution.to.id).toBeLessThanOrEqual(649)
          expect(evolution.methods.length > 0 || evolution.unavailableReason).toBeTruthy()

          for (const method of evolution.methods) {
            expect(['level-up', 'trade', 'use-item', 'shed']).toContain(method.trigger)
            if (method.minLevel) expect(method.minLevel).toBeGreaterThan(0)
            for (const value of method.notes ?? []) expect(value).toBeTruthy()
          }
        }
      }
    }
  })
})
