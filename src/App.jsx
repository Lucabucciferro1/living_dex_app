import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import pokemonData from './data/pokemon.json'
import {
  ALL_GAME_ID,
  DEFAULT_GAME_ID,
  GAME_GROUPS,
  GAME_META,
  SELECTABLE_GAME_IDS,
  encountersForGame,
  evolutionRoutesForGame,
  gamesInGroup,
  representativeGameForPokemonGeneration,
} from './gameCatalog.js'
import { eventAvailabilityForGame } from './eventCatalog.js'

export { GAME_META } from './gameCatalog.js'
const MAX_POKEMON_ID = pokemonData.pokemon.at(-1)?.id ?? 0
const CAUGHT_STORAGE_KEY = 'hoenn-living-dex-caught-v1'
const GAME_STORAGE_KEY = 'hoenn-living-dex-game-v1'

const TYPE_ORDER = [
  'normal',
  'fire',
  'water',
  'electric',
  'grass',
  'ice',
  'fighting',
  'poison',
  'ground',
  'flying',
  'psychic',
  'bug',
  'rock',
  'ghost',
  'dragon',
  'dark',
  'steel',
]

const METHOD_LABELS = {
  Walk: 'Walking',
  'Only One': 'Static encounter',
  'Colosseum Bonus Disc': 'Colosseum Bonus Disc',
  'Colosseum Bonus Disc Jpn': 'Bonus Disc (Japan)',
}

const EVOLUTION_TRIGGER_LABELS = {
  'level-up': 'Level up',
  trade: 'Trade',
  'use-item': 'Use item',
  shed: 'Special evolution',
}

function readStoredSet(key) {
  try {
    const stored = JSON.parse(localStorage.getItem(key) ?? '[]')
    return new Set(Array.isArray(stored) ? stored.filter((id) => Number.isInteger(id) && id >= 1 && id <= MAX_POKEMON_ID) : [])
  } catch {
    return new Set()
  }
}

function readStoredGame() {
  const stored = localStorage.getItem(GAME_STORAGE_KEY)
  return SELECTABLE_GAME_IDS.includes(stored) ? stored : DEFAULT_GAME_ID
}

function gameForPokemonInView(activeGame, pokemon) {
  return activeGame === ALL_GAME_ID
    ? representativeGameForPokemonGeneration(pokemon)
    : activeGame
}

function generationForPokemonId(pokemonId) {
  if (pokemonId <= 151) return 'generation-i'
  if (pokemonId <= 251) return 'generation-ii'
  if (pokemonId <= 386) return 'generation-iii'
  if (pokemonId <= 493) return 'generation-iv'
  if (pokemonId <= 649) return 'generation-v'
  return null
}

function spriteGameForPokemonId(pokemonId, game) {
  return game === ALL_GAME_ID
    ? representativeGameForPokemonGeneration(generationForPokemonId(pokemonId))
    : game
}

export function spritePath(pokemonId, game) {
  const selectedGame = GAME_META[spriteGameForPokemonId(pokemonId, game)] ?? GAME_META[DEFAULT_GAME_ID]
  const extension = selectedGame.spriteExtension ?? 'png'
  return `/sprites/${selectedGame.spriteSet}/${pokemonId}.${extension}`
}

export function detailSpritePath(pokemonId, game) {
  const resolvedGame = spriteGameForPokemonId(pokemonId, game)
  const selectedGame = GAME_META[resolvedGame] ?? GAME_META[DEFAULT_GAME_ID]
  if (!selectedGame.animatedSpriteSet) return spritePath(pokemonId, game)

  const extension = selectedGame.animatedSpriteExtension ?? 'gif'
  return `/sprites/${selectedGame.animatedSpriteSet}/${pokemonId}.${extension}`
}

function formatDexNumber(id) {
  return `#${String(id).padStart(3, '0')}`
}

function formatLevels(minLevel, maxLevel) {
  if (minLevel === 0 && maxLevel === 0) return 'Level varies'
  if (minLevel === maxLevel) return `Lv. ${minLevel}`
  return `Lv. ${minLevel}–${maxLevel}`
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="11" cy="11" r="6.75" />
      <path d="m16 16 4 4" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m5 12.5 4.2 4.2L19 7" />
    </svg>
  )
}

function MapPinIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  )
}

function EventIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3Z" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  )
}

function ChevronIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m7 9.5 5 5 5-5" />
    </svg>
  )
}

function PokeballMark({ small = false }) {
  return (
    <span className={`pokeball-mark${small ? ' pokeball-mark--small' : ''}`} aria-hidden="true">
      <span />
    </span>
  )
}

function TypeBadge({ type }) {
  return <span className={`type-badge type-badge--${type}`}>{type}</span>
}

function GameSelector({ activeGame, onChange, compact = false }) {
  const groupGames = gamesInGroup(activeGame)

  return (
    <div
      className={`game-selector${compact ? ' game-selector--compact' : ''}`}
      style={{ '--game-count': groupGames.length }}
      role="group"
      aria-label="Choose version"
    >
      {groupGames.map((game) => (
        <button
          className={`game-option${activeGame === game.id ? ' is-active' : ''}`}
          type="button"
          key={game.id}
          style={{ '--button-color': game.accent }}
          aria-pressed={activeGame === game.id}
          onClick={() => onChange(game.id)}
        >
          <span className="game-option__gem" aria-hidden="true" />
          <span className="game-option__full">{game.label}</span>
          <span className="game-option__short">{game.shortLabel}</span>
        </button>
      ))}
    </div>
  )
}

function GamePicker({ activeGame, onChange }) {
  const selectedGame = GAME_META[activeGame]

  return (
    <div className="game-picker">
      <label htmlFor="game-selection" className="game-picker__label">Game selection</label>
      <div className="game-picker__field" style={{ '--picker-accent': selectedGame.accent }}>
        <span className="game-picker__gem" aria-hidden="true" />
        <select
          id="game-selection"
          value={activeGame}
          onChange={(event) => onChange(event.target.value)}
        >
          <option value={ALL_GAME_ID}>All Pokémon</option>
          {GAME_GROUPS.map((group) => (
            <optgroup label={group.label} key={group.id}>
              {group.games.map((game) => (
                <option value={game.id} key={game.id}>{game.fullLabel}</option>
              ))}
            </optgroup>
          ))}
        </select>
        <ChevronIcon />
      </div>
      <div className="game-picker__meta">
        <span>{activeGame === ALL_GAME_ID ? 'Generations I–V Pokémon' : selectedGame.gameGenerationLabel}</span>
        <span>{activeGame === ALL_GAME_ID ? 'Representative location data' : `${selectedGame.region} location data`}</span>
        <span>{activeGame === ALL_GAME_ID ? 'Generation-matched sprites' : `${selectedGame.spriteGenerationLabel} sprites`}</span>
      </div>
      <p className="game-picker__hint">
        {activeGame === ALL_GAME_ID
          ? 'All view uses a representative game for each generation when opening field notes.'
          : 'Your selection controls the collection, progress, sprites, evolution rules, and encounter locations.'}
      </p>
    </div>
  )
}

function Header({ activeGame, caughtCount, totalCount, onGameChange }) {
  const percent = totalCount === 0 ? 0 : Math.round((caughtCount / totalCount) * 100)
  const selectedGame = GAME_META[activeGame]

  return (
    <header
      className="hero"
      style={{ '--game-accent': selectedGame.accent, '--game-dark': selectedGame.darkAccent }}
    >
      <div className="hero__shine" aria-hidden="true" />
      <div className="hero__brand">
        <div className="device-lights" aria-hidden="true">
          <span className="device-lights__main" />
          <span className="device-lights__dot device-lights__dot--red" />
          <span className="device-lights__dot device-lights__dot--yellow" />
          <span className="device-lights__dot device-lights__dot--green" />
        </div>
        <p className="eyebrow">{selectedGame.dexGenerationLabel} collection</p>
        <h1>{selectedGame.region} Living Dex</h1>
        <p className="hero__lede">
          {activeGame === ALL_GAME_ID
            ? `All ${totalCount} Pokémon across Generations I–V.`
            : `All ${totalCount} Pokémon first discovered in ${selectedGame.dexGenerationLabel}.`}
        </p>
      </div>

      <div className="hero__controls">
        <GamePicker activeGame={activeGame} onChange={onGameChange} />
      </div>

      <div className="progress-panel" aria-label={`${caughtCount} of ${totalCount} Pokémon caught`}>
        <div className="progress-ring" style={{ '--progress': `${percent * 3.6}deg` }}>
          <PokeballMark small />
        </div>
        <div>
          <span className="progress-panel__label">
            {activeGame === ALL_GAME_ID ? 'National Dex progress' : 'Dex progress'}
          </span>
          <strong>{caughtCount}<span> / {totalCount}</span></strong>
          <small>{percent}% complete</small>
        </div>
      </div>
    </header>
  )
}

function FilterBar({
  query,
  onQueryChange,
  caughtFilter,
  onCaughtFilterChange,
  availabilityFilter,
  onAvailabilityFilterChange,
  typeFilter,
  onTypeFilterChange,
  resultCount,
  totalCount,
  isAllView,
  onClear,
}) {
  const hasFilters = query || caughtFilter !== 'all' || availabilityFilter !== 'all' || typeFilter !== 'all'

  return (
    <section className="filter-panel" aria-label="Search and filter Pokédex">
      <div className="search-control">
        <SearchIcon />
        <label htmlFor="pokemon-search" className="sr-only">Search by Pokémon name or number</label>
        <input
          id="pokemon-search"
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Search by name or number…"
          autoComplete="off"
        />
        <kbd>/</kbd>
      </div>

      <div className="filter-fields">
        <label>
          <span>Status</span>
          <select value={caughtFilter} onChange={(event) => onCaughtFilterChange(event.target.value)}>
            <option value="all">All Pokémon</option>
            <option value="caught">Caught</option>
            <option value="missing">Missing</option>
          </select>
        </label>
        <label>
          <span>{isAllView ? 'Representative game' : 'In this game'}</span>
          <select value={availabilityFilter} onChange={(event) => onAvailabilityFilterChange(event.target.value)}>
            <option value="all">Any availability</option>
            <option value="available">Direct encounter</option>
            <option value="unavailable">No direct encounter</option>
          </select>
        </label>
        <label>
          <span>Type</span>
          <select value={typeFilter} onChange={(event) => onTypeFilterChange(event.target.value)}>
            <option value="all">All types</option>
            {TYPE_ORDER.map((type) => (
              <option value={type} key={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="filter-panel__footer">
        <p><strong>{resultCount}</strong> of {totalCount} entries shown</p>
        {hasFilters && (
          <button type="button" className="text-button" onClick={onClear}>Clear filters</button>
        )}
      </div>
    </section>
  )
}

export function PokemonCard({ pokemon, activeGame, isCaught, onOpen, onToggleCaught }) {
  const displayGame = gameForPokemonInView(activeGame, pokemon)
  const hasEncounter = encountersForGame(pokemon, displayGame).length > 0
  const eventAvailability = eventAvailabilityForGame(pokemon, displayGame)
  const groupGames = gamesInGroup(displayGame)
  const eventStatusId = `event-status-${pokemon.id}-${displayGame}`

  function handleContextMenu(event) {
    event.preventDefault()
    onToggleCaught(pokemon)
  }

  return (
    <article
      className={`pokemon-card${isCaught ? ' is-caught' : ''}`}
      data-testid={`pokemon-card-${pokemon.id}`}
      onContextMenu={handleContextMenu}
    >
      <button
        type="button"
        className="pokemon-card__main"
        onClick={() => onOpen(pokemon)}
        aria-label={`View ${pokemon.displayName} field notes`}
        aria-describedby={eventAvailability ? eventStatusId : undefined}
      >
        <span className="pokemon-card__topline">
          <span className="dex-number">{formatDexNumber(pokemon.id)}</span>
          <span className={`availability${eventAvailability ? ' is-event-only' : hasEncounter ? ' is-available' : ''}`}>
            {eventAvailability ? <EventIcon /> : <MapPinIcon />}
            {eventAvailability ? 'Event' : hasEncounter ? 'Found' : pokemon.evolvesFrom ? 'Evolve' : 'Trade'}
          </span>
          {eventAvailability && (
            <span className="sr-only" id={eventStatusId}>Event-only in {GAME_META[displayGame].label}</span>
          )}
        </span>
        <span className="sprite-stage">
          <span className="sprite-shadow" aria-hidden="true" />
          <img
            src={spritePath(pokemon.id, displayGame)}
            alt={`${pokemon.displayName} ${GAME_META[displayGame].spriteGenerationLabel} sprite`}
            width="96"
            height="96"
            loading="lazy"
            draggable="false"
          />
          {isCaught && <span className="caught-stamp" aria-hidden="true"><CheckIcon /></span>}
        </span>
        <strong className="pokemon-card__name">{pokemon.displayName}</strong>
        <span className="type-row">
          {pokemon.types.map((type) => <TypeBadge type={type} key={type} />)}
        </span>
        <span className="game-dots" aria-label="Direct encounter availability">
          {groupGames.map((game) => (
            <span
              key={game.id}
              className={`game-dot${encountersForGame(pokemon, game.id).length ? ' is-on' : ''}`}
              style={{ '--dot-color': game.accent }}
              title={`${game.label}: ${encountersForGame(pokemon, game.id).length ? 'direct encounter' : 'trade, evolve, or unavailable'}`}
            >
              {game.shortLabel}
            </span>
          ))}
        </span>
      </button>

      <button
        type="button"
        className="caught-toggle"
        aria-pressed={isCaught}
        aria-label={`Mark ${pokemon.displayName} ${isCaught ? 'missing' : 'caught'}`}
        onClick={(event) => {
          event.stopPropagation()
          onToggleCaught(pokemon)
        }}
      >
        <span className="caught-toggle__icon"><CheckIcon /></span>
        <span>{isCaught ? 'Caught' : 'Mark caught'}</span>
      </button>
    </article>
  )
}

function EmptyResults({ onClear }) {
  return (
    <div className="empty-results">
      <div className="empty-results__radar" aria-hidden="true"><MapPinIcon /></div>
      <h2>No Pokémon found</h2>
      <p>Try a different name, number, or filter combination.</p>
      <button type="button" className="primary-button" onClick={onClear}>Clear all filters</button>
    </div>
  )
}

function EncounterDetail({ detail }) {
  return (
    <div className="encounter-detail">
      <span className="method-pill">{METHOD_LABELS[detail.method] ?? detail.method}</span>
      <span>{formatLevels(detail.minLevel, detail.maxLevel)}</span>
      <span>{detail.chance}% slot</span>
      {detail.conditions.length > 0 && (
        <span className="condition-list">{detail.conditions.join(' · ')}</span>
      )}
    </div>
  )
}

function EvolutionFact({ term, value }) {
  if (value === undefined || value === null || value === '') return null

  return (
    <div className="evolution-fact">
      <dt>{term}</dt>
      <dd>{value}</dd>
    </div>
  )
}

function EvolutionMethod({ method, showAlternative }) {
  const knownMove = method.knownMoveLevel
    ? `${method.knownMove} — learned at Lv. ${method.knownMoveLevel}`
    : method.knownMove

  return (
    <div className="evolution-method">
      {showAlternative && <span className="evolution-method__or">OR</span>}
      <dl className="evolution-facts">
        <EvolutionFact term="Method" value={EVOLUTION_TRIGGER_LABELS[method.trigger] ?? method.trigger} />
        <EvolutionFact term="Level" value={method.minLevel ? `Lv. ${method.minLevel}` : null} />
        <EvolutionFact term="Move" value={knownMove} />
        <EvolutionFact term="Item" value={method.item} />
        <EvolutionFact term="Held item" value={method.heldItem} />
        <EvolutionFact term="Trade partner" value={method.tradeSpecies} />
        <EvolutionFact term="Location" value={method.location} />
        <EvolutionFact term="Friendship" value={method.minFriendship ? `${method.minFriendship}+` : null} />
        <EvolutionFact term="Beauty" value={method.minBeauty ? `${method.minBeauty}+` : null} />
        <EvolutionFact term="Time" value={method.timeOfDay} />
        <EvolutionFact term="Gender" value={method.gender} />
        <EvolutionFact term="Stats" value={method.relativePhysicalStats} />
        <EvolutionFact term="Party" value={method.partySpecies ? `${method.partySpecies} in party` : null} />
        <EvolutionFact term="Party type" value={method.partyType} />
        <EvolutionFact term="Condition" value={method.specialCondition} />
      </dl>
      {method.notes?.length > 0 && (
        <ul className="evolution-notes">
          {method.notes.map((note) => <li key={note}>{note}</li>)}
        </ul>
      )}
    </div>
  )
}

function EvolutionGuide({ pokemon, game, routes }) {
  const selectedGame = GAME_META[game]
  const headingId = `evolution-title-${pokemon.id}-${game}`

  return (
    <section className="evolution-guide" aria-labelledby={headingId}>
      <header className="evolution-guide__header">
        <div>
          <p className="eyebrow">Evolution guide</p>
          <h4 id={headingId}>Evolution routes</h4>
        </div>
        <span>{selectedGame.label}</span>
      </header>

      {routes.length > 0 ? (
        <ul className="evolution-list">
          {routes.map((route) => {
            const isUnavailable = Boolean(route.unavailableReason) || route.methods.length === 0
            return (
              <li
                className={`evolution-route${isUnavailable ? ' is-unavailable' : ''}`}
                key={`${route.direction}-${route.from.id}-${route.to.id}`}
              >
                <div className="evolution-route__header">
                  <div>
                    <span className="evolution-route__direction">
                      {route.direction === 'from' ? 'Evolves from' : 'Evolves into'}
                    </span>
                    <p className="evolution-route__path">
                      <strong>{route.from.name}</strong>
                      <span className="sr-only"> evolves into </span>
                      <span aria-hidden="true">→</span>
                      <strong>{route.to.name}</strong>
                    </p>
                  </div>
                  <span className="evolution-route__status">
                    {isUnavailable ? 'Unavailable' : route.methods.length > 1 ? `${route.methods.length} options` : 'Available'}
                  </span>
                </div>

                {isUnavailable ? (
                  <p className="evolution-unavailable">
                    {route.unavailableReason ?? `This evolution cannot be performed in ${selectedGame.label}.`}
                  </p>
                ) : (
                  route.methods.map((method, index) => (
                    <EvolutionMethod
                      method={method}
                      showAlternative={index > 0}
                      key={`${method.trigger}-${index}`}
                    />
                  ))
                )}
              </li>
            )
          })}
        </ul>
      ) : (
        <p className="evolution-none">{pokemon.displayName} does not evolve in {selectedGame.label}.</p>
      )}
    </section>
  )
}

function EventOnlyNote({ pokemon, game, availability }) {
  const headingId = `event-note-${pokemon.id}-${game}`
  const selectedGame = GAME_META[game]

  return (
    <section className="event-only-note" role="note" aria-labelledby={headingId}>
      <span className="event-only-note__icon" aria-hidden="true"><EventIcon /></span>
      <div>
        <p className="eyebrow">Event / special distribution</p>
        <h4 id={headingId}>Event-only in {selectedGame.label}</h4>
        <p>{availability.summary}</p>
        {availability.routes?.length > 0 && (
          <ul className="event-only-note__routes">
            {availability.routes.map((route) => (
              <li key={`${route.kind}-${route.label}`}>
                <strong>{route.label}</strong>
                {route.location && <span> — {route.location}</span>}
                {route.note && <span> — {route.note}</span>}
                {route.status === 'unreleased' && <em>Never officially released</em>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}

export function PokemonModal({ pokemon, initialGame, isCaught, onToggleCaught, onClose }) {
  const [game, setGame] = useState(initialGame)
  const dialogRef = useRef(null)
  const closeButtonRef = useRef(null)

  useEffect(() => {
    setGame(initialGame)
  }, [pokemon.id, initialGame])

  useEffect(() => {
    const previouslyFocused = document.activeElement
    const dialog = dialogRef.current
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()

    function onKeyDown(event) {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }

      if (event.key !== 'Tab' || !dialog) return
      const focusable = [...dialog.querySelectorAll('button:not([disabled]), [href], input, select, [tabindex]:not([tabindex="-1"])')]
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = originalOverflow
      previouslyFocused?.focus?.()
    }
  }, [onClose])

  const selectedGame = GAME_META[game]
  const siblingGames = gamesInGroup(game)
  const locations = encountersForGame(pokemon, game)
  const evolutionRoutes = evolutionRoutesForGame(pokemon, game)
  const eventAvailability = eventAvailabilityForGame(pokemon, game)
  const hasAnimatedSprite = Boolean(selectedGame.animatedSpriteSet)

  return (
    <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section
        className="pokemon-modal"
        style={{ '--modal-accent': selectedGame.accent, '--modal-dark': selectedGame.darkAccent }}
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="pokemon-modal-title"
      >
        <button ref={closeButtonRef} className="modal-close" type="button" onClick={onClose} aria-label="Close field notes">
          <CloseIcon />
        </button>

        <aside className="pokemon-modal__profile">
          <p className="eyebrow">National Pokédex {formatDexNumber(pokemon.id)}</p>
          <div className="modal-sprite-stage">
            <div className="modal-sprite-grid" aria-hidden="true" />
            <img
              key={`${pokemon.id}-${game}`}
              src={detailSpritePath(pokemon.id, game)}
              alt={`${pokemon.displayName} ${hasAnimatedSprite ? 'animated ' : ''}${selectedGame.spriteGenerationLabel} sprite`}
              width="128"
              height="128"
              draggable="false"
              onError={(event) => {
                if (selectedGame.animatedSpriteFallback !== 'static') return
                const fallback = spritePath(pokemon.id, game)
                if (!event.currentTarget.src.endsWith(fallback)) event.currentTarget.src = fallback
              }}
            />
          </div>
          <h2 id="pokemon-modal-title">{pokemon.displayName}</h2>
          {pokemon.genus && <p className="pokemon-genus">{pokemon.genus}</p>}
          <div className="type-row type-row--large">
            {pokemon.types.map((type) => <TypeBadge type={type} key={type} />)}
          </div>
          <dl className="pokemon-measurements">
            <div><dt>Height</dt><dd>{(pokemon.height / 10).toFixed(1)} m</dd></div>
            <div><dt>Weight</dt><dd>{(pokemon.weight / 10).toFixed(1)} kg</dd></div>
          </dl>
          <button
            type="button"
            className={`modal-caught-button${isCaught ? ' is-caught' : ''}`}
            aria-pressed={isCaught}
            onClick={() => onToggleCaught(pokemon)}
          >
            <span><CheckIcon /></span>
            {isCaught ? 'Caught — mark missing' : 'Mark as caught'}
          </button>
        </aside>

        <div
          className="pokemon-modal__content"
          role="region"
          aria-label={`${pokemon.displayName} field notes`}
          tabIndex={0}
        >
          <div className="modal-heading">
            <div>
              <p className="eyebrow">Field notes</p>
              <h3>Where to find {pokemon.displayName}</h3>
            </div>
            <GameSelector activeGame={game} onChange={setGame} compact />
          </div>

          <div className="location-summary">
            <span className="location-summary__gem" aria-hidden="true" />
            <p>
              <strong>{selectedGame.label} Version</strong>
              <span>{locations.length ? `${locations.length} recorded ${locations.length === 1 ? 'area' : 'areas'}` : 'No direct encounter recorded'}</span>
            </p>
          </div>

          {eventAvailability && (
            <EventOnlyNote pokemon={pokemon} game={game} availability={eventAvailability} />
          )}

          <EvolutionGuide pokemon={pokemon} game={game} routes={evolutionRoutes} />

          {locations.length > 0 ? (
            <ol className="location-list">
              {locations.map((location) => (
                <li className="location-card" key={`${game}-${location.areaSlug}`}>
                  <div className="location-card__header">
                    <span className="location-card__pin"><MapPinIcon /></span>
                    <div>
                      <h4>{location.area}</h4>
                      <p>Up to {location.maxChance}% encounter chance</p>
                    </div>
                  </div>
                  <div className="encounter-details">
                    {location.details.map((detail, index) => (
                      <EncounterDetail detail={detail} key={`${detail.method}-${detail.minLevel}-${index}`} />
                    ))}
                  </div>
                </li>
              ))}
            </ol>
          ) : (
            <div className="no-locations">
              <div className="no-locations__icon"><PokeballMark /></div>
              <h4>No direct encounter in {selectedGame.label}</h4>
              {eventAvailability ? (
                <p>
                  Use the event or special-distribution routes above. This Pokémon has no standard
                  in-game acquisition route in {selectedGame.label}.
                </p>
              ) : pokemon.evolvesFrom ? (
                <p>
                  Use the evolution guide above for this version’s exact requirements.
                  The earlier stage may still require breeding or trading.
                </p>
              ) : (
                <p>
                  This Pokémon may need to be bred, traded from another compatible {selectedGame.gameGenerationLabel} title,
                  or transferred from another game.
                </p>
              )}
              <div className="other-games">
                {siblingGames.filter((otherGame) => otherGame.id !== game).map((otherGame) => (
                  <span key={otherGame.id} className={encountersForGame(pokemon, otherGame.id).length ? 'is-available' : ''}>
                    {otherGame.label}
                    <strong>{encountersForGame(pokemon, otherGame.id).length ? `${encountersForGame(pokemon, otherGame.id).length} ${encountersForGame(pokemon, otherGame.id).length === 1 ? 'area' : 'areas'}` : 'None'}</strong>
                  </span>
                ))}
              </div>
            </div>
          )}

          <p className="data-note">Evolution requirements and encounter records reflect the selected version. Encounters include wild, gift, static, and special-event methods.</p>
        </div>
      </section>
    </div>
  )
}

export default function App({ pokemon = pokemonData.pokemon }) {
  const [activeGame, setActiveGame] = useState(readStoredGame)
  const [caughtIds, setCaughtIds] = useState(() => readStoredSet(CAUGHT_STORAGE_KEY))
  const [query, setQuery] = useState('')
  const [caughtFilter, setCaughtFilter] = useState('all')
  const [availabilityFilter, setAvailabilityFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [selectedPokemon, setSelectedPokemon] = useState(null)
  const [announcement, setAnnouncement] = useState('')

  const scopedPokemon = useMemo(() => {
    const generation = GAME_META[activeGame]?.pokemonGeneration
    return generation ? pokemon.filter((entry) => entry.generation === generation) : pokemon
  }, [pokemon, activeGame])

  useEffect(() => {
    localStorage.setItem(CAUGHT_STORAGE_KEY, JSON.stringify([...caughtIds].sort((a, b) => a - b)))
  }, [caughtIds])

  useEffect(() => {
    localStorage.setItem(GAME_STORAGE_KEY, activeGame)
  }, [activeGame])

  useEffect(() => {
    if (!announcement) return undefined
    const timeout = window.setTimeout(() => setAnnouncement(''), 2200)
    return () => window.clearTimeout(timeout)
  }, [announcement])

  useEffect(() => {
    function focusSearch(event) {
      if (event.key === '/' && !['INPUT', 'SELECT', 'TEXTAREA'].includes(document.activeElement?.tagName)) {
        event.preventDefault()
        document.getElementById('pokemon-search')?.focus()
      }
    }
    document.addEventListener('keydown', focusSearch)
    return () => document.removeEventListener('keydown', focusSearch)
  }, [])

  const toggleCaught = useCallback((targetPokemon) => {
    const willBeCaught = !caughtIds.has(targetPokemon.id)
    setCaughtIds((current) => {
      const next = new Set(current)
      if (next.has(targetPokemon.id)) next.delete(targetPokemon.id)
      else next.add(targetPokemon.id)
      return next
    })
    setAnnouncement(`${targetPokemon.displayName} marked ${willBeCaught ? 'caught' : 'missing'}.`)
  }, [caughtIds])

  const closeModal = useCallback(() => setSelectedPokemon(null), [])

  const clearFilters = useCallback(() => {
    setQuery('')
    setCaughtFilter('all')
    setAvailabilityFilter('all')
    setTypeFilter('all')
  }, [])

  const caughtCount = useMemo(
    () => scopedPokemon.reduce((count, entry) => count + Number(caughtIds.has(entry.id)), 0),
    [scopedPokemon, caughtIds],
  )

  const filteredPokemon = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase().replace(/^#/, '')
    const isNumericQuery = /^\d+$/.test(normalizedQuery)

    return scopedPokemon.filter((entry) => {
      const matchesQuery = !normalizedQuery
        || (isNumericQuery
          ? entry.id === Number(normalizedQuery)
          : entry.displayName.toLowerCase().includes(normalizedQuery)
            || entry.name.toLowerCase().includes(normalizedQuery))
      const isCaught = caughtIds.has(entry.id)
      const matchesCaught = caughtFilter === 'all'
        || (caughtFilter === 'caught' && isCaught)
        || (caughtFilter === 'missing' && !isCaught)
      const entryGame = gameForPokemonInView(activeGame, entry)
      const isAvailable = encountersForGame(entry, entryGame).length > 0
      const matchesAvailability = availabilityFilter === 'all'
        || (availabilityFilter === 'available' && isAvailable)
        || (availabilityFilter === 'unavailable' && !isAvailable)
      const matchesType = typeFilter === 'all' || entry.types.includes(typeFilter)

      return matchesQuery && matchesCaught && matchesAvailability && matchesType
    })
  }, [scopedPokemon, query, caughtIds, caughtFilter, activeGame, availabilityFilter, typeFilter])

  return (
    <div className="app-shell">
      <a className="skip-link" href="#pokemon-grid">Skip to Pokémon grid</a>
      <Header
        activeGame={activeGame}
        caughtCount={caughtCount}
        totalCount={scopedPokemon.length}
        onGameChange={setActiveGame}
      />

      <main>
        <FilterBar
          query={query}
          onQueryChange={setQuery}
          caughtFilter={caughtFilter}
          onCaughtFilterChange={setCaughtFilter}
          availabilityFilter={availabilityFilter}
          onAvailabilityFilterChange={setAvailabilityFilter}
          typeFilter={typeFilter}
          onTypeFilterChange={setTypeFilter}
          resultCount={filteredPokemon.length}
          totalCount={scopedPokemon.length}
          isAllView={activeGame === ALL_GAME_ID}
          onClear={clearFilters}
        />

        <section className="dex-section" aria-labelledby="dex-heading">
          <div className="dex-section__heading">
            <div>
              <p className="eyebrow">
                {activeGame === ALL_GAME_ID
                  ? 'National Pokédex — Generations I–V'
                  : `Box 01 — ${GAME_META[activeGame].dexGenerationLabel}`}
              </p>
              <h2 id="dex-heading">Pokémon collection</h2>
            </div>
            <p className="interaction-hint">
              <span className="mouse-icon" aria-hidden="true"><i /><i /></span>
              Select for field notes <span>·</span> Right-click or use the check to mark caught
            </p>
          </div>

          {filteredPokemon.length > 0 ? (
            <div className="pokemon-grid" id="pokemon-grid">
              {filteredPokemon.map((entry) => (
                <PokemonCard
                  key={entry.id}
                  pokemon={entry}
                  activeGame={activeGame}
                  isCaught={caughtIds.has(entry.id)}
                  onOpen={setSelectedPokemon}
                  onToggleCaught={toggleCaught}
                />
              ))}
            </div>
          ) : (
            <EmptyResults onClear={clearFilters} />
          )}
        </section>
      </main>

      <footer className="site-footer">
        <div><PokeballMark small /><span>Progress is saved on this device.</span></div>
        <p>
          Pokémon data from <a href="https://pokeapi.co/" target="_blank" rel="noreferrer">PokéAPI</a>
          {' · '}Sprites from <a href="https://github.com/PokeAPI/sprites" target="_blank" rel="noreferrer">PokeAPI/sprites</a>
        </p>
      </footer>

      {announcement && <div className="status-toast" role="status" aria-live="polite">{announcement}</div>}

      {selectedPokemon && (
        <PokemonModal
          pokemon={selectedPokemon}
          initialGame={gameForPokemonInView(activeGame, selectedPokemon)}
          isCaught={caughtIds.has(selectedPokemon.id)}
          onToggleCaught={toggleCaught}
          onClose={closeModal}
        />
      )}
    </div>
  )
}
