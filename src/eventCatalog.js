const EVENT_ROUTE_KINDS = new Set([
  'distribution',
  'event-item',
  'event-unlock',
  'external-game',
])

const EVENT_ROUTE_STATUSES = new Set(['historical', 'unreleased'])

function eventOnly(summary, routes, { excludedEncounterAreaSlugs = [] } = {}) {
  if (typeof summary !== 'string' || summary.trim() === '') {
    throw new TypeError('Event availability requires a summary.')
  }
  if (!Array.isArray(routes) || routes.length === 0) {
    throw new TypeError('Event availability requires at least one route.')
  }

  const frozenRoutes = routes.map((route) => {
    if (!EVENT_ROUTE_KINDS.has(route?.kind) || typeof route.label !== 'string' || route.label.trim() === '') {
      throw new TypeError('Event routes require a supported kind and a label.')
    }
    if (route.status != null && !EVENT_ROUTE_STATUSES.has(route.status)) {
      throw new TypeError(`Unsupported event route status: ${route.status}`)
    }

    return Object.freeze({ ...route })
  })

  return Object.freeze({
    classification: 'event-only',
    summary,
    routes: Object.freeze(frozenRoutes),
    ...(excludedEncounterAreaSlugs.length > 0
      ? { excludedEncounterAreaSlugs: Object.freeze([...excludedEncounterAreaSlugs]) }
      : {}),
  })
}

function speciesAvailability(games) {
  return Object.freeze(games)
}

export const EVENT_ONLY_AVAILABILITY = Object.freeze({
  151: speciesAvailability({
    firered: eventOnly(
      'FireRed has no permanent Mew encounter; every legitimate source begins with a limited event.',
      [
        {
          kind: 'distribution',
          label: 'Official Mew distribution',
          status: 'historical',
          note: 'Receive Mew through a compatible Generation III distribution, then keep it in or trade it to FireRed.',
        },
        {
          kind: 'external-game',
          label: 'Old Sea Map Mew from Emerald',
          status: 'historical',
          location: 'Faraway Island (Emerald)',
          note: 'The Old Sea Map was distributed only for Emerald; catch Mew there and link trade it to FireRed.',
        },
      ],
    ),
    leafgreen: eventOnly(
      'LeafGreen has no permanent Mew encounter; every legitimate source begins with a limited event.',
      [
        {
          kind: 'distribution',
          label: 'Official Mew distribution',
          status: 'historical',
          note: 'Receive Mew through a compatible Generation III distribution, then keep it in or trade it to LeafGreen.',
        },
        {
          kind: 'external-game',
          label: 'Old Sea Map Mew from Emerald',
          status: 'historical',
          location: 'Faraway Island (Emerald)',
          note: 'The Old Sea Map was distributed only for Emerald; catch Mew there and link trade it to LeafGreen.',
        },
      ],
    ),
  }),

  251: speciesAvailability({
    heartgold: eventOnly(
      'HeartGold has no permanent Celebi encounter; Celebi was supplied through limited distributions.',
      [
        {
          kind: 'distribution',
          label: 'Official Celebi distribution',
          status: 'historical',
          location: 'Poké Mart deliveryman',
          note: 'The Ilex Forest and Giovanni sequence is unlocked by an event Celebi; it is not a Celebi capture event.',
        },
      ],
    ),
    soulsilver: eventOnly(
      'SoulSilver has no permanent Celebi encounter; Celebi was supplied through limited distributions.',
      [
        {
          kind: 'distribution',
          label: 'Official Celebi distribution',
          status: 'historical',
          location: 'Poké Mart deliveryman',
          note: 'The Ilex Forest and Giovanni sequence is unlocked by an event Celebi; it is not a Celebi capture event.',
        },
      ],
    ),
  }),

  385: speciesAvailability({
    ruby: eventOnly(
      'Ruby has no permanent Jirachi encounter; its documented routes use companion software or a limited distribution.',
      [
        {
          kind: 'external-game',
          label: 'Pokémon Colosseum Bonus Disc',
          status: 'historical',
          location: 'Pokémon Center',
          note: 'The North American Bonus Disc can transfer Jirachi to a compatible Ruby save.',
        },
        {
          kind: 'external-game',
          label: 'Pokémon Channel',
          status: 'historical',
          location: 'Pokémon Center',
          note: 'The PAL release of Pokémon Channel can transfer Jirachi after its requirements are completed.',
        },
      ],
    ),
    sapphire: eventOnly(
      'Sapphire has no permanent Jirachi encounter; its documented routes use companion software or a limited distribution.',
      [
        {
          kind: 'external-game',
          label: 'Pokémon Colosseum Bonus Disc',
          status: 'historical',
          location: 'Pokémon Center',
          note: 'The North American Bonus Disc can transfer Jirachi to a compatible Sapphire save.',
        },
        {
          kind: 'external-game',
          label: 'Pokémon Channel',
          status: 'historical',
          location: 'Pokémon Center',
          note: 'The PAL release of Pokémon Channel can transfer Jirachi after its requirements are completed.',
        },
      ],
    ),
    emerald: eventOnly(
      'Emerald has no permanent Jirachi encounter; it needs an event-origin Jirachi from a distribution or another game.',
      [
        {
          kind: 'distribution',
          label: 'Official Jirachi distribution',
          status: 'historical',
          note: 'Distribution availability varied by region and date.',
        },
        {
          kind: 'external-game',
          label: 'Trade from Ruby or Sapphire',
          status: 'historical',
          location: 'Link trade',
          note: 'Transfer Jirachi to Ruby or Sapphire with compatible companion software, then trade it to Emerald.',
        },
      ],
    ),
  }),

  386: speciesAvailability({
    ruby: eventOnly(
      'Ruby has no Birth Island encounter; Deoxys must come from a distribution or another Generation III game.',
      [
        {
          kind: 'distribution',
          label: 'Official Deoxys distribution',
          status: 'historical',
          note: 'Distribution availability varied by region and date.',
        },
        {
          kind: 'external-game',
          label: 'Trade an AuroraTicket Deoxys',
          status: 'historical',
          location: 'Birth Island (FireRed, LeafGreen, or Emerald)',
          note: 'Catch Deoxys in an AuroraTicket-compatible game, then link trade it to Ruby.',
        },
      ],
    ),
    sapphire: eventOnly(
      'Sapphire has no Birth Island encounter; Deoxys must come from a distribution or another Generation III game.',
      [
        {
          kind: 'distribution',
          label: 'Official Deoxys distribution',
          status: 'historical',
          note: 'Distribution availability varied by region and date.',
        },
        {
          kind: 'external-game',
          label: 'Trade an AuroraTicket Deoxys',
          status: 'historical',
          location: 'Birth Island (FireRed, LeafGreen, or Emerald)',
          note: 'Catch Deoxys in an AuroraTicket-compatible game, then link trade it to Sapphire.',
        },
      ],
    ),
    emerald: eventOnly(
      'Emerald can catch Deoxys only after receiving the limited AuroraTicket event item.',
      [
        {
          kind: 'event-item',
          label: 'AuroraTicket',
          status: 'historical',
          location: 'Birth Island',
          note: 'Sail from Lilycove City, solve the island triangle puzzle, and battle Deoxys at Lv. 30.',
        },
        {
          kind: 'distribution',
          label: 'Official Deoxys distribution',
          status: 'historical',
          note: 'Some distributions supplied Deoxys directly instead of unlocking Birth Island.',
        },
      ],
    ),
  }),

  490: speciesAvailability({
    diamond: eventOnly(
      'Diamond has no wild Manaphy encounter; its main origin is a transferred Pokémon Ranger Manaphy Egg.',
      [
        {
          kind: 'external-game',
          label: 'Pokémon Ranger Manaphy Egg',
          status: 'historical',
          location: 'Poké Mart deliveryman',
          note: 'Complete a compatible Ranger special mission, transfer the one-time Egg, then hatch it in Diamond.',
        },
        {
          kind: 'distribution',
          label: 'Official Manaphy distribution',
          status: 'historical',
          note: 'Direct distribution availability varied by region and date.',
        },
      ],
    ),
    pearl: eventOnly(
      'Pearl has no wild Manaphy encounter; its main origin is a transferred Pokémon Ranger Manaphy Egg.',
      [
        {
          kind: 'external-game',
          label: 'Pokémon Ranger Manaphy Egg',
          status: 'historical',
          location: 'Poké Mart deliveryman',
          note: 'Complete a compatible Ranger special mission, transfer the one-time Egg, then hatch it in Pearl.',
        },
        {
          kind: 'distribution',
          label: 'Official Manaphy distribution',
          status: 'historical',
          note: 'Direct distribution availability varied by region and date.',
        },
      ],
    ),
    platinum: eventOnly(
      'Platinum has no wild Manaphy encounter; its main origin is a transferred Pokémon Ranger Manaphy Egg.',
      [
        {
          kind: 'external-game',
          label: 'Pokémon Ranger Manaphy Egg',
          status: 'historical',
          location: 'Poké Mart deliveryman',
          note: 'Complete a compatible Ranger special mission, transfer the one-time Egg, then hatch it in Platinum.',
        },
        {
          kind: 'distribution',
          label: 'Official Manaphy distribution',
          status: 'historical',
          note: 'Direct distribution availability varied by region and date.',
        },
      ],
    ),
  }),

  491: speciesAvailability({
    diamond: eventOnly(
      'Diamond had direct Darkrai distributions, but its programmed Member Card encounter was never officially released.',
      [
        {
          kind: 'distribution',
          label: 'Official Darkrai distribution',
          status: 'historical',
          location: 'Poké Mart deliveryman',
          note: 'Darkrai was supplied directly during limited distributions.',
        },
        {
          kind: 'event-item',
          label: 'Member Card',
          status: 'unreleased',
          location: 'Newmoon Island',
          note: 'The encounter is programmed in Diamond, but the Member Card was not officially distributed for this version.',
        },
      ],
      { excludedEncounterAreaSlugs: ['newmoon-island-area'] },
    ),
    pearl: eventOnly(
      'Pearl had direct Darkrai distributions, but its programmed Member Card encounter was never officially released.',
      [
        {
          kind: 'distribution',
          label: 'Official Darkrai distribution',
          status: 'historical',
          location: 'Poké Mart deliveryman',
          note: 'Darkrai was supplied directly during limited distributions.',
        },
        {
          kind: 'event-item',
          label: 'Member Card',
          status: 'unreleased',
          location: 'Newmoon Island',
          note: 'The encounter is programmed in Pearl, but the Member Card was not officially distributed for this version.',
        },
      ],
      { excludedEncounterAreaSlugs: ['newmoon-island-area'] },
    ),
    platinum: eventOnly(
      'Platinum can reach Darkrai only through a limited Member Card event or a direct distribution.',
      [
        {
          kind: 'event-item',
          label: 'Member Card',
          status: 'historical',
          location: 'Newmoon Island',
          note: 'Receive the card through Mystery Gift, visit Canalave City\'s Harbor Inn, then catch Darkrai.',
        },
        {
          kind: 'distribution',
          label: 'Official Darkrai distribution',
          status: 'historical',
          location: 'Poké Mart deliveryman',
          note: 'Some limited distributions supplied Darkrai directly.',
        },
      ],
    ),
  }),

  492: speciesAvailability({
    diamond: eventOnly(
      'Diamond had direct Shaymin distributions, but its programmed Oak\'s Letter encounter was never officially released.',
      [
        {
          kind: 'distribution',
          label: 'Official Shaymin distribution',
          status: 'historical',
          location: 'Poké Mart deliveryman',
          note: 'Shaymin was supplied directly during limited distributions.',
        },
        {
          kind: 'event-item',
          label: 'Oak\'s Letter',
          status: 'unreleased',
          location: 'Flower Paradise',
          note: 'The encounter is programmed in Diamond, but Oak\'s Letter was not officially distributed for this version.',
        },
      ],
      { excludedEncounterAreaSlugs: ['flower-paradise-area'] },
    ),
    pearl: eventOnly(
      'Pearl had direct Shaymin distributions, but its programmed Oak\'s Letter encounter was never officially released.',
      [
        {
          kind: 'distribution',
          label: 'Official Shaymin distribution',
          status: 'historical',
          location: 'Poké Mart deliveryman',
          note: 'Shaymin was supplied directly during limited distributions.',
        },
        {
          kind: 'event-item',
          label: 'Oak\'s Letter',
          status: 'unreleased',
          location: 'Flower Paradise',
          note: 'The encounter is programmed in Pearl, but Oak\'s Letter was not officially distributed for this version.',
        },
      ],
      { excludedEncounterAreaSlugs: ['flower-paradise-area'] },
    ),
    platinum: eventOnly(
      'Platinum can reach Shaymin only through the limited Oak\'s Letter event or a direct distribution.',
      [
        {
          kind: 'event-item',
          label: 'Oak\'s Letter',
          status: 'historical',
          location: 'Flower Paradise',
          note: 'Collect the letter at a Poké Mart, meet Professor Oak on Route 224, and follow Seabreak Path.',
        },
        {
          kind: 'distribution',
          label: 'Official Shaymin distribution',
          status: 'historical',
          location: 'Poké Mart deliveryman',
          note: 'Some limited distributions supplied Shaymin directly.',
        },
      ],
    ),
  }),

  493: speciesAvailability({
    diamond: eventOnly(
      'Diamond received Arceus only through direct distributions; the Azure Flute encounter was never released.',
      [
        {
          kind: 'distribution',
          label: 'Official Arceus distribution',
          status: 'historical',
          location: 'Poké Mart deliveryman',
          note: 'Arceus was supplied directly during limited distributions.',
        },
        {
          kind: 'event-item',
          label: 'Azure Flute',
          status: 'unreleased',
          location: 'Hall of Origin',
          note: 'The Azure Flute was never officially distributed, so the programmed Hall of Origin encounter is not a released route.',
        },
      ],
      { excludedEncounterAreaSlugs: ['sinnoh-hall-of-origin-1-area'] },
    ),
    pearl: eventOnly(
      'Pearl received Arceus only through direct distributions; the Azure Flute encounter was never released.',
      [
        {
          kind: 'distribution',
          label: 'Official Arceus distribution',
          status: 'historical',
          location: 'Poké Mart deliveryman',
          note: 'Arceus was supplied directly during limited distributions.',
        },
        {
          kind: 'event-item',
          label: 'Azure Flute',
          status: 'unreleased',
          location: 'Hall of Origin',
          note: 'The Azure Flute was never officially distributed, so the programmed Hall of Origin encounter is not a released route.',
        },
      ],
      { excludedEncounterAreaSlugs: ['sinnoh-hall-of-origin-1-area'] },
    ),
    platinum: eventOnly(
      'Platinum received Arceus only through direct distributions; the Azure Flute encounter was never released.',
      [
        {
          kind: 'distribution',
          label: 'Official Arceus distribution',
          status: 'historical',
          location: 'Poké Mart deliveryman',
          note: 'Arceus was supplied directly during limited distributions.',
        },
        {
          kind: 'event-item',
          label: 'Azure Flute',
          status: 'unreleased',
          location: 'Hall of Origin',
          note: 'The Azure Flute was never officially distributed, so the programmed Hall of Origin encounter is not a released route.',
        },
      ],
      { excludedEncounterAreaSlugs: ['sinnoh-hall-of-origin-1-area'] },
    ),
  }),

  494: speciesAvailability({
    black: eventOnly(
      'Black can catch Victini only after receiving the limited Liberty Pass event item.',
      [
        {
          kind: 'event-item',
          label: 'Liberty Pass',
          status: 'historical',
          location: 'Liberty Garden lighthouse basement',
          note: 'Receive the pass through Mystery Gift, sail from Castelia City, and catch Victini at Lv. 15.',
        },
        {
          kind: 'distribution',
          label: 'Official Victini distribution',
          status: 'historical',
          note: 'Some limited distributions supplied Victini directly.',
        },
      ],
    ),
    white: eventOnly(
      'White can catch Victini only after receiving the limited Liberty Pass event item.',
      [
        {
          kind: 'event-item',
          label: 'Liberty Pass',
          status: 'historical',
          location: 'Liberty Garden lighthouse basement',
          note: 'Receive the pass through Mystery Gift, sail from Castelia City, and catch Victini at Lv. 15.',
        },
        {
          kind: 'distribution',
          label: 'Official Victini distribution',
          status: 'historical',
          note: 'Some limited distributions supplied Victini directly.',
        },
      ],
    ),
    'black-2': eventOnly(
      'Black 2 has no Liberty Pass encounter; Victini must be traded from Black or White or come from a compatible event.',
      [
        {
          kind: 'external-game',
          label: 'Trade an event-origin Victini',
          status: 'historical',
          location: 'Black or White',
          note: 'Catch Victini with the Liberty Pass in Black or White, then trade it to Black 2.',
        },
        {
          kind: 'distribution',
          label: 'Compatible Victini distribution',
          status: 'historical',
          note: 'Distribution compatibility varied by event and region.',
        },
      ],
    ),
    'white-2': eventOnly(
      'White 2 has no Liberty Pass encounter; Victini must be traded from Black or White or come from a compatible event.',
      [
        {
          kind: 'external-game',
          label: 'Trade an event-origin Victini',
          status: 'historical',
          location: 'Black or White',
          note: 'Catch Victini with the Liberty Pass in Black or White, then trade it to White 2.',
        },
        {
          kind: 'distribution',
          label: 'Compatible Victini distribution',
          status: 'historical',
          note: 'Distribution compatibility varied by event and region.',
        },
      ],
    ),
  }),

  647: speciesAvailability({
    black: eventOnly(
      'Black has no permanent Keldeo encounter; Keldeo was supplied through limited distributions.',
      [
        {
          kind: 'distribution',
          label: 'Official Keldeo distribution',
          status: 'historical',
          note: 'Bring the event Keldeo to Moor of Icirrus with the other Swords of Justice to learn Secret Sword.',
        },
      ],
    ),
    white: eventOnly(
      'White has no permanent Keldeo encounter; Keldeo was supplied through limited distributions.',
      [
        {
          kind: 'distribution',
          label: 'Official Keldeo distribution',
          status: 'historical',
          note: 'Bring the event Keldeo to Moor of Icirrus with the other Swords of Justice to learn Secret Sword.',
        },
      ],
    ),
    'black-2': eventOnly(
      'Black 2 has no permanent Keldeo encounter; Keldeo was supplied through limited distributions.',
      [
        {
          kind: 'distribution',
          label: 'Official Keldeo distribution',
          status: 'historical',
          note: 'Pledge Grove teaches Secret Sword and enables Resolute Form; it is not a Keldeo capture location.',
        },
      ],
    ),
    'white-2': eventOnly(
      'White 2 has no permanent Keldeo encounter; Keldeo was supplied through limited distributions.',
      [
        {
          kind: 'distribution',
          label: 'Official Keldeo distribution',
          status: 'historical',
          note: 'Pledge Grove teaches Secret Sword and enables Resolute Form; it is not a Keldeo capture location.',
        },
      ],
    ),
  }),

  648: speciesAvailability({
    black: eventOnly(
      'Black has no permanent Meloetta encounter; Meloetta was supplied through limited distributions.',
      [
        {
          kind: 'distribution',
          label: 'Official Meloetta distribution',
          status: 'historical',
          note: 'Café Sonata teaches the event Meloetta Relic Song; it is not a capture location.',
        },
      ],
    ),
    white: eventOnly(
      'White has no permanent Meloetta encounter; Meloetta was supplied through limited distributions.',
      [
        {
          kind: 'distribution',
          label: 'Official Meloetta distribution',
          status: 'historical',
          note: 'Café Sonata teaches the event Meloetta Relic Song; it is not a capture location.',
        },
      ],
    ),
    'black-2': eventOnly(
      'Black 2 has no permanent Meloetta encounter; Meloetta was supplied through limited distributions.',
      [
        {
          kind: 'distribution',
          label: 'Official Meloetta distribution',
          status: 'historical',
          note: 'Café Sonata teaches the event Meloetta Relic Song; it is not a capture location.',
        },
      ],
    ),
    'white-2': eventOnly(
      'White 2 has no permanent Meloetta encounter; Meloetta was supplied through limited distributions.',
      [
        {
          kind: 'distribution',
          label: 'Official Meloetta distribution',
          status: 'historical',
          note: 'Café Sonata teaches the event Meloetta Relic Song; it is not a capture location.',
        },
      ],
    ),
  }),

  649: speciesAvailability({
    black: eventOnly(
      'Black has no permanent Genesect encounter; use a compatible event-origin Genesect traded from another game.',
      [
        {
          kind: 'external-game',
          label: 'Trade an event-origin Genesect',
          status: 'historical',
          location: 'Black 2 or White 2',
          note: 'Receive Genesect through a compatible distribution in Black 2 or White 2, then trade it to Black.',
        },
      ],
    ),
    white: eventOnly(
      'White has no permanent Genesect encounter; use a compatible event-origin Genesect traded from another game.',
      [
        {
          kind: 'external-game',
          label: 'Trade an event-origin Genesect',
          status: 'historical',
          location: 'Black 2 or White 2',
          note: 'Receive Genesect through a compatible distribution in Black 2 or White 2, then trade it to White.',
        },
      ],
    ),
    'black-2': eventOnly(
      'Black 2 has no permanent Genesect encounter; Genesect was supplied through limited distributions.',
      [
        {
          kind: 'distribution',
          label: 'Official Genesect distribution',
          status: 'historical',
          note: 'Bring the event Genesect to the P2 Laboratory to receive version-specific Drives.',
        },
      ],
    ),
    'white-2': eventOnly(
      'White 2 has no permanent Genesect encounter; Genesect was supplied through limited distributions.',
      [
        {
          kind: 'distribution',
          label: 'Official Genesect distribution',
          status: 'historical',
          note: 'Bring the event Genesect to the P2 Laboratory to receive version-specific Drives.',
        },
      ],
    ),
  }),
})

export function eventAvailabilityForGame(pokemonOrId, gameId) {
  const rawId = pokemonOrId && typeof pokemonOrId === 'object' ? pokemonOrId.id : pokemonOrId
  const pokemonId = Number(rawId)

  if (!Number.isInteger(pokemonId) || pokemonId <= 0 || typeof gameId !== 'string') return null
  return EVENT_ONLY_AVAILABILITY[pokemonId]?.[gameId] ?? null
}

export function isEventOnlyForGame(pokemonOrId, gameId) {
  return eventAvailabilityForGame(pokemonOrId, gameId)?.classification === 'event-only'
}
