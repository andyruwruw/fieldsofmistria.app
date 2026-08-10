# Data Reader Completion Plan

Scope: `data-reader/` — the Cheerio-based scraper that turns fieldsofmistria.wiki.gg pages into the JSON the app consumes (`export/*.json`, mirrored into `app/src/data/`).

## Status: all 24 categories implemented and verified against the live wiki

Every category now has a working list-parser → detail-parser → service → `export/<x>.json` pipeline, wired into `src/index.ts`. Run the whole thing with `npm run start`, or a subset with `npm run start -- --only=monsters,weapons` (see "Running it" below). This is a rewrite of the original plan, which covered only 12 finished categories out of 24; the rest were stubbed, broken, or not started. All of that work is now done.

### What was already working, untouched

Characters, Bugs, Animals, Crops, Museum, Artifacts, Fish, Skills, Dishes, Spells, Weather — 11 categories, no changes needed beyond re-enabling them in `index.ts` (they were previously commented out; nothing ran by default except Festivals).

### Fixed: Festivals

Looked finished but silently produced `export/festivals.json = {}`. Two real bugs, both fixed:
- `FestivalsParser` relied on the generic `_condenseTable` helper against a table with no `<thead>` and a rowspan-merged Season column — the helper's `i === 0` header heuristic grabbed the wrong row and the body ended up empty. Rewrote it to walk `<tr>`s directly and always take the last `<td>`'s link (works regardless of whether that row also carries the rowspanned Season cell).
- `FestivalPageParser` never set `id` on the `Event` it returned, so even a working list parser would've produced nothing once `convertArrayToObjectWithIds` filtered every object out for lacking an `id`. Rewrote it against the real `div.druid-infobox` structure (stable `.druid-data-<field>` classes, the same pattern later reused for Locations and Quests) — now captures id/name/href/location/day/season/frequency/quests/theme/theme-audio/activities/stalls.

Verified: 10/10 festivals parse correctly, `export/festivals.json` is 4KB of real structured data.

### New/completed categories (this pass)

| Category | Count | Notes |
|---|---|---|
| Monsters | 35 | Detail pages are tabbed (`div.druid-infobox` with `data-druid-from-tab`) — one page documents every color variant of a monster family (e.g. all 5 Rock Clod colors + all 5 Ore Clod colors share `/wiki/Clod`), so multiple list rows resolve to the same page and the parser matches variant name against tab label. |
| Tools | 42 | 7 tool types × 6 tiers. Found and added a previously-undocumented **mistril** tier above gold — extended the `ToolTier` enum. |
| Equipment | 60 | Armor. The wiki's own infobox only labels items "Armor" or "Ring" (not the specific slot); the parser derives the real `EquipmentType` from the item name's suffix (Cuirass/Chestpiece/Armor, Cuisses/Pants/Tassets, Greaves/Boots/Shoes, Wristband/Ring). |
| Cosmetics | 338 | No individual item pages exist at all (confirmed by checking every item-name cell across all 3 category pages) — `COSMETICS_URL` is a hub linking to Accessories/Clothes/Hairstyles category pages, and everything lives in their tables. Parser shape adapted accordingly (`Parser<Cosmetic[]>` per category page, not per item). |
| Weapons | 10 | Swords are currently the only implemented weapon type per the wiki's own text; two navbox-referenced swords (Corrupted Mistril, Dragon-Forged) aren't in the actual data table yet and were correctly excluded as unimplemented content. |
| Materials | 74 | One flat table, no ore/wood/gem sub-categories on the wiki. List-table data (skills/source/recipes/museum) and detail-page infobox data (sell/location/season) don't overlap — merged both. Found and worked around (without touching `parser.ts`) a `_parseAside()` bug where hidden MediaWiki sort-key spans leak into Location text. |
| Furniture | 434 | No single list page — `FURNITURE_URL` only links to 15 category sub-pages. Two infobox formats in use depending on item age (`div.druid-infobox` for most, `aside.portable-infobox` for older/simpler decorative items) — parser handles both transparently. Captures color/style variants with per-variant sell price. |
| Infusions | 16 | A random-bonus-effect mechanic across 4 disciplines (Blacksmithing/Cooking/Woodcrafting/Other), all on one page (`INFUSIONS_URL`) — no per-item pages, so it's a single-parser category. Custom rowspan-aware table walker needed (`_condenseTable` doesn't track rowspan continuation). |
| Locations | 48 | `LOCATIONS_URL` is a MediaWiki `Category:` listing page — structurally different from every other category (no wikitable at all, just `#mw-pages .mw-category-group li a`). This selector is reusable for any other `Category:X` URL on this wiki. Detail pages use `div.druid-infobox`. Also fixed a pre-existing bug: the `LocationsService` stub imported `EVENTS_URL` instead of `LOCATIONS_URL` (copy-paste leftover). |
| Quests | 356 | No individual pages — all quests are rows across 10 table sections on the one `QUESTS_URL` page (confirmed the `#Festival_Quests`-style anchors Festivals links to are literally table sections). Needed a colspan+rowspan-aware matrix resolver; an early version was colspan-blind and silently dropped rewards for 54 quests, caught during the agent's own verification pass and fixed. |
| Ranching | 12 products + 127 cosmetics | Covers `ANIMAL_PRODUCTS_URL` + `ANIMAL_COSMETICS_URL`. Detail pages exist for both but add nothing new (every animal-cosmetic detail page has identical boilerplate description text) — list-table-only parsing, cross-referencing `animalId`/`gender` back into the existing `Animal` model's id convention. |
| Blacksmithing | 70 recipes + 17 skill perks | Had no config URL at all — research confirmed `https://fieldsofmistria.wiki.gg/wiki/Blacksmithing` exists and is real; its "Skill Perks" section duplicates data `SkillsService` already scrapes, but its **Recipes** section (ingots/tools/swords/armor, with skill-perk-conditional ingredient/time discounts) was genuinely new. Also fixed a typo in the wiki's own HTML (a missing `)` that was breaking a regex match on the Tools table). |

### Foundational fix: the wiki now rate-limits (HTTP 429)

Discovered while debugging Festivals: `fieldsofmistria.wiki.gg` (via Cloudflare) now returns 429 once more than a handful of requests land close together. Every existing service used `Promise.all(urls.map(fetchDetailPage))`, firing every request at once — this pattern will get rate-limited today even for the categories that worked fine when originally scraped in August 2025.

Fixed at the shared-utility level so every category benefits, old and new: `src/utils/scraper.ts` now exports `fetchAll(urls, handler, delayMs=750)`, which fetches sequentially with a delay, and `fetchPage` itself retries with exponential backoff on a 429 before giving up. All 12 new/fixed services use `fetchAll` instead of `Promise.all`. **The 11 already-working services (Animals, Crops, Fish, etc.) still use raw `Promise.all` and have not been migrated** — they'll likely 429 if re-run today at their original scale. Migrating them to `fetchAll` is the same one-line change in each service and is the top item in the task list below.

## The established pattern

For a category "X":

1. **`src/models/<x>.d.ts`** — TS interface for one record.
2. **`src/parsers/<x>-list.parser.ts`** — extends `Parser<Record<string,string>[]>` (or returns the full array directly, if the category has no per-item pages — see Cosmetics/Infusions/Quests/Ranching above). Parses the category's index page. Check first whether it's a normal content page (`_parseNavigationTable()`/`_parseHorizontalTable()` may apply), a MediaWiki `Category:` listing (bespoke — see Locations), or a hub linking to several category sub-pages (see Furniture/Cosmetics).
3. **`src/parsers/<x>.parser.ts`** — extends `Parser<X>`, if individual detail pages exist. Inspect the real page first: `aside.portable-infobox.pi-background` → use `_parseAside()`; `div.druid-infobox` → query its stable `.druid-data-<field>` classes directly (more reliable than the shared `_parseDruidAside()` walker, which does fragile positional-index digging — see the Festivals rewrite for the preferred approach). Some wiki tables merge cells with `rowspan`/`colspan`; `_parseTable`/`_condenseTable` don't track spans, so a bespoke cell walker is often needed (see Materials, Infusions, Quests, Tools).
4. **`src/services/<x>.service.ts`** — orchestrates list → detail fetch. Use `fetchAll(urls, handler, 750)` from `src/utils/scraper.ts`, never `Promise.all`, for any loop over more than a couple of URLs.
5. **Wire into `src/index.ts`**: add a `{ name: 'x', run: async () => {...} }` entry to the `TASKS` array.
6. **Sync to the frontend**: copy `export/x.json` → `app/src/data/x.json` (see task 1 below for automating this).

## Remaining tasks, in priority order

1. **Automate (or at minimum re-run) the export → app sync.** `app/src/data/` only has the 11 originally-working categories' output copied over (plus the earlier `dishes`/`spells`/`weather` catch-up). The 13 categories finished in this pass (`monsters`, `tools`, `equipment`, `cosmetics`, `weapons`, `materials`, `furniture`, `infusions`, `locations`, `quests`, `ranching`, `blacksmithing`, and the fixed `festivals`) still need `export/*.json` copied to `app/src/data/*.json` before the frontend can use them — and every future scrape will hit this same manual step until it's a script (`npm run export:sync` in data-reader, or a build-time copy step in the app).
2. **Migrate the 11 original services from `Promise.all` to `fetchAll`.** They're not broken today only because nobody's re-run them since the rate limit appeared. One-line change per service (see `festivals.service.ts` or any of the 12 new services for the pattern).
3. **Retire or wire up `ItemsService`.** Its static `queueItem`/`_links` registry is still dead code — nothing calls it. Decide whether any category actually needs cross-referencing (e.g. an item that's both a Material and a Museum donation) or delete it.
4. **Add smoke tests** for the `Parser` base class helpers, and for at least one of the new bespoke cell-walkers (Materials/Infusions/Quests/Tools all wrote their own rowspan/colspan resolution independently — a shared, tested helper here would remove duplication and catch the next Festivals-style silent breakage before it ships as an empty export). `jest`/`ts-jest` are configured but there are zero tests today.
5. **Consider consolidating the repeated rowspan/colspan table-walking logic** written independently by Materials, Infusions, Quests, and Tools into a shared `Parser` helper (carefully — the last attempt at a shared table helper, `_condenseTable`, is what caused the Festivals bug, so any replacement needs the smoke tests from task 4 alongside it).

## Running it

- Full run: `npm run start` (runs all 24 categories in `src/index.ts`'s `TASKS` array, in order).
- One or a few categories: `npm run start -- --only=monsters,weapons`.
- A full run is slow by design — the rate limiter forces ~750ms between per-item requests. Furniture alone is ~449 requests (~5-6 minutes); Quests/Cosmetics/Ranching do all their parsing off a single page fetch (seconds); most others fall in between. Expect a genuinely full run (all 24 categories, several hundred detail pages total) to take on the order of 20-40 minutes.
