# Living Dex Tracker

A responsive living Pokédex tracker with separate regional game sections:

- **Kanto:** FireRed and LeafGreen locations for the 151 Pokémon introduced in Generation I.
- **Johto:** HeartGold and SoulSilver locations for the 100 Pokémon introduced in Generation II.
- **Hoenn:** Ruby, Sapphire, and Emerald locations for the 135 Pokémon introduced in Generation III.
- **Sinnoh:** Diamond, Pearl, and Platinum locations for the 107 Pokémon introduced in Generation IV.
- **Unova:** Black, White, Black 2, and White 2 locations for the 156 Pokémon introduced in Generation V.

Kanto, Johto, and Hoenn use authentic Generation III sprites. The Johto collection
deliberately uses the complete Emerald-era set with HeartGold/SoulSilver encounter data.
Sinnoh switches between the authentic Diamond/Pearl and Platinum Generation IV sprites.
Unova uses Generation V Black/White sprites: cards stay still for quick scanning,
while the larger sprite animates when a Pokémon's field notes are open.

## Run it locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite.

## Controls

- Use **Game selection** in the header to choose the active title. That choice
  controls sprites, availability filters, and location details everywhere.
- New trackers open on Generation I with FireRed selected.
- Left-click or tap a Pokémon card to view its evolution requirements and locations for the selected game.
- Right-click a card to toggle it as caught.
- On touch or keyboard, use the visible **Mark caught** control.
- Use `/` to jump to search.
- Progress and the selected game are stored in the browser on the current device.

The field-notes panel distinguishes direct encounters from Pokémon that need to be
evolved, bred, traded, or obtained through an event. Its game-aware evolution guide
covers levels, learned moves, evolutionary items, held items, trades, friendship,
time, gender, stats, party requirements, and location-based evolutions. Encounter
records can include wild, gift, static, and special-distribution methods.

## Development

```bash
npm test          # interaction and data-integrity tests
npm run build     # production build
npm run check     # tests, then production build
npm run data:refresh
```

`data:refresh` rebuilds `src/data/pokemon.json` and vendors the configured sprite
sets into `public/sprites`. The generated data comes from [PokéAPI](https://pokeapi.co/),
and the images come from the [PokeAPI sprite repository](https://github.com/PokeAPI/sprites).

## Adding future games

Game definitions live in `src/gameCatalog.js`. Add a game to an existing group or
create a new generation/region group there. Groups define the region, the games'
hardware generation, the species-introduction generation used for the tracker scope,
the mechanics generation used for historical typings, and the sprite generation.
Individual game entries define the PokéAPI version ID and version group, labels,
still and optional animated sprite sets, and visual accent. The version group selects the correct evolution rules
for that title. These separate fields allow remakes to use
newer encounter data while deliberately showing an older sprite set—for example,
HeartGold/SoulSilver locations with Emerald sprites.
The header picker, version buttons, sprites, progress scope, and data refresh script
all read from this catalogue.

Before refreshing data for a later generation, also raise the National Pokédex
limit in `scripts/build-pokemon-data.mjs` so those species are included.
