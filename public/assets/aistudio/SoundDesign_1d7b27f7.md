### 6. GENERATION ORDER (CRITICAL WORKFLOW RULE)
1. **Always generate all Remotion TypeScript code and scene sequence files FIRST.**
2. **ONLY after the complete code and scene animations are fully generated, compile and output `public/sfx_cues.json` and `public/music_plan.json` at the very end.**
   - **How Prompt 2 Compiles Sound Design**: Since `storyboard.json` delegates all audio manifests to this engine, Prompt 2 acts as the master sound compiler by scanning:
     - **`scene.microActions`**: Read exact integer `triggerFrame` timestamps for stamps (`stamp_slam`), ink circles (`marker_circle`), odometers (`odometer_roll`), and redactions (`strikethrough_slice`).
     - **Scene Transitions**: Place Layer 1 camera sweeps (`whoosh_fast`, `camera_move`) right at transition boundaries.
     - **Montage Drops (`scene.montage.items`)**: Trigger `photo_drop` (-1 frame), physical impact (`wood_thud` on trigger frame), and `pop_soft` (+2 frames) for every montage item.
     - **Atmosphere & Weather Passes (`weatherPass`)**: Mount Layer 3 continuous beds (`cold_wind`, `dark_drone`, `torch_fire_crackle`) with explicit `frame` and `end_frame` windows across desolate or snowy scenes.

---

### 7. ADVANCED SOUND DESIGN & MULTI-TRACK AUDIO MIXING (`public/sfx_cues.json` - GENERATED AT THE VERY END)
> **Master Audio Authority**: `storyboard.json` contains zero audio arrays. This engine compiles all sound design by reading the exact frame timestamps of animations, stage events, and micro-actions generated above.

In high-end documentary filmmaking (e.g., *Magnates Media, Johnny Harris, Lemmino, Vox*), sound design is never a series of isolated, single-file clicks. It is a **multi-layered, cinematic soundscape** where visual motion, tactile impacts, musical stingers, and ambient tension overlap simultaneously on separate tracks.

#### A. THE 3-TIER SOUND ARCHITECTURE:
Every cue in `sfx_cues.json` must be assigned to its correct `audio_track_layer`:
1. **Layer 1: Motion, Cartography, Portals, Archival & UI (`audio_track_layer: 1`)**
   - Camera, portals & transitions: `whoosh_fast`, `camera_move`, `map_pan`, `portal_zoom_whoosh`, `pillar_wipe_swish`, `barrel_roll_whoosh`, `doppler_whoosh`, `camera_push`, `pullback_whoosh`, `camera_dive`, `shutter_wipe`, `tape_rewind`
   - Archival evidence, documents & paper unfolds: `photo_drop`, `polaroid_drop`, `paper_slide`, `paper_unfold`, `dossier_drop`, `blueprint_unroll`, `film_sprocket`, `paper_clip`, `string_snap`
   - Document markup, brushes & ink reveals: `marker_circle`, `marker_underline`, `marker_scratch`, `pencil_draw`, `draw_line`, `brush_swipe_heavy`, `ink_splatter_reveal`
   - Small UI tags, HUDs, badges & reticle locks: `pop_soft`, `click`, `camera_shutter`, `lens_click`, `viewfinder_click`, `neon_hud_flicker`, `typewriter_key_clack`
   - Macro props, character & building reveals: `pop_firm`, `reveal_pop`
   - Numerical & data telemetry: `odometer_roll`, `odometer_click`, `counter_roll`, `counter_digital`, `geiger_counter`, `data_flutter`, `ticker_count`, `adding_machine`
   - Cartography & flight paths: `border_draw`, `sonar_ping`
   - Projectiles: `bullet_whiz`, `arrow_shot`
   - *Target Volume:* **-19.0 dB to -24.0 dB** (clean, crisp, non-fatiguing).

2. **Layer 2: Action, Foley, Tactile Stamps & Physical Impacts (`audio_track_layer: 2`)**
   - Heavy stamps, gavels & rulings: `courtroom_gavel`, `stamp_slam`, `rubber_stamp`, `stamp_thud`
   - Press & hardware switches: `camera_shutter_burst`, `relay_switch`, `switch_click`, `spark_ignition`, `electric_spark`
   - Physical impacts & drops: `wood_thud`, `thud`, `impact_hit`
   - Text cuts & slices: `strikethrough_slice`, `percussive_slice`
   - Historical combat & weapons: `musket_fire`, `cannon_blast`, `blast`, `sword_clash`
   - Military footgear & mass troop movement: `foley_snow_crunch` (tactile winter boot crunches in snow/mud), `marching_boots` (`HistoryConflict/b2_marching_boots_a.mp3`), `army_marching` (synchronized battalion troop cadence)
   - Battlefield command relics & communications: `brass_casing_clink` (spent artillery/rifle shells clinking on desk/stone), `paper_rustle_heavy` (heavy telegrams, stiff battlefront maps, folded orders), `trench_radio_crackle` (distorted field radio static & Morse code)
   - Infantry weaponry & ballistic impacts: `bolt_action_rifle` (rifle bolt pull, chambering & shot), `shrapnel_ricochet`, `mortar_thud`, `metal_helmet_ding`
   - Commerce & treasury: `coin_clink`, `coin_bag_drop`
   - Documents & labor: `paper_rustle`, `hammer_hit`, `tool_clink`
   - Crowd & atmosphere: `crowd_shout`, `crowd_cheer`, `army_charge`
   - Cinematic battle drums & trailer hits: `epic_drums`, `battle_drums`, `trailer_hit`, `vine_boom`
   - *Target Volume:* **-18.0 dB to -23.0 dB** (punchy, visceral tactile weight).

3. **Layer 3: Musical Accents, Tension Stingers & Atmosphere Beds (`audio_track_layer: 3`)**
   - **`dramatic_braam` / `braam`:** Low brass/synth cinematic impact or sub-drop hit for staggering realizations, empire collapses, or ominous turning points.
   - **`sub_drop` / `sub_bass` / `sub_surge`:** Deep sub-bass throb underneath critical high-stakes moments, disasters, or catastrophic news.
   - **`musical_riser` / `tension_riser`:** Cinematic orchestral or synth crescendo building suspense over 2 to 5 seconds leading into a major reveal or crisis.
   - **`tension_swell` / `swell`:** Rapid reverse cymbal or string swell accentuating an abrupt realization or turning point.
   - **`synth_swell`:** Swelling cinematic synth chord cut abruptly on dramatic climax words.
   - **`dark_drone` / `drone`:** Low ominous atmospheric drone sustained beneath brewing conflicts, conspiracies, or economic corruption.
   - **`cold_wind`:** Ominous desolate wind gust for dark periods, collapse, or cold transitions.
   - **`howling_blizzard` / `siberia_wind`:** Extended 20s–35s sub-zero winter storm ambience bed (`howling_blizzard_long` 35s, `b5_siberia_wind` 20s, `b2_snow_mountain` 20s) sustained across winter warfare, frozen sieges, and mountain retreats.
   - **`distant_artillery_rumble` / `war_distant`:** Extended 18s–20s low-frequency muffled horizon bombardment bed (`deep_boom_heavy_cannon`, `distant_tank_shots` 18s, `b2_war_distant` 20s) placed at `-24.0 dB` during narrative pauses and command council scenes to reinforce tactical encirclement.
   - **`marching_army` / `marching_cadence_bed`:** Sustained 36-second infantry squad marching bed (`marching_army_fs333907_squad_march_wav.mp3`) sustained beneath troop redeployments and mobilization sequences.
   - **`vintage_hum` / `tape_hum` / `projector_hum`:** Analog tape or projector hum underneath vintage equipment/archival scenes.
   - **`torch_fire_crackle`:** Warm flickering torch/fire ambience bed for ancient caves, chambers, and medieval nights.
   - **`clock_pulse` / `ticking_tension`:** Tense ticking clock / rhythmic heartbeat pulse when time is running out, deadlines loom, or war is imminent.
   - **`orchestral_hit` / `accent_hit` / `piano_hit` / `investigative_piano` / `bowed_metal`:** Dramatic string stab, investigative piano chord, or bowed metal accent marking a shocking fact, casualty figure, or turning point.
   - **`suspense_stinger` / `stinger`:** Sharp musical shock stinger when a trap is sprung or unexpected danger strikes.
   - **`warhorn`:** Ancient battlefield brass calls and warhorns (`NGTVST - Warhorn 1–3.wav`) for epic historical clashes, military declarations, or territorial invasions.
   - **`downer`:** Pitch-fall sub-bass dive (`NGTVST - Downer 1–4.wav`) for catastrophic collapse, sudden economic crash, or crushing defeat.
   - **`neuro_bass`:** Heavy modern distorted bass surge (`NGTVST - Neuro Bass 1–2.wav`) for dark technological intrigue, high-stakes espionage, or sinister power grabs.
   - **`heartbeat`:** Muffled deep sub-bass pulse (`NGTVST - Heartbeat 1–2.wav`) for survival tension, ticking countdowns, or life-or-death suspense.
   - **`dystopian_pad`:** Sustained atmospheric drone pad (`NGTVST - Dystopian Pad 1–2.wav`, `NGTVST - Horror Atmosphere.wav`) for totalitarian regimes, barren wastelands, or eerie aftermath scenes.
   - **`desert_wind`:** Whistling arid wind ambience bed (`desert wind.mp3`, `wind swirling.mp3`) for desolate terrains, ruins, and harsh climates.
   - **`crackling_fire` / `torch_fire_crackle`:** Crackling campfire/torch ambience bed (`Intense_crackling_fl.mp3`, `burning.mp3`) for ancient torchlit chambers, fortress blazes, and nighttime bivouacs.
   - *Target Volume:* **-18.0 dB to -22.0 dB** (loud enough to cut through, perfectly seated over -29.0 dB bed BGM).

#### 7.2 TACTILE FOLEY & SUB-ZERO ACOUSTIC GROUNDING (WAR DOCUMENTARY PRODUCTION)
A military documentary feels artificial if visual movement lacks visceral acoustic weight. Unlike short 1–2 second UI clicks, military environment beds (howling blizzard, distant artillery rumble, battalion marching cadence) are **extended 20 to 35+ second continuous audio beds** that must be mounted on Layer 3 using exact `frame` and `end_frame` timestamps. Prompt 2 must actively compile tactile real-world Foley into Layer 2 (`audio_track_layer: 2`) alongside visual micro-actions and anchor continuous environmental beds on Layer 3 (`audio_track_layer: 3`):

- **Snow Boot Crunches**: Mount `foley_snow_crunch` on the exact entry frame of foot soldiers walking through drifts (`audio_track_layer: 2`, `volume_db: -21.0`).
- **Synchronized Battalion March**: Mount `marching_boots` or `army_marching` on infantry troop line advances (`audio_track_layer: 2`, `-20.0 dB`, or continuous Layer 3 bed across multi-second marches).
- **Sub-Zero Environmental Bed (Extended 20–35s)**: Mount a continuous `cold_wind` or `howling_blizzard` bed (`audio_track_layer: 3`, `volume_db: -21.0`) with both `frame` and `end_frame` across the entire outdoor sequence. The engine automatically sustains and crossfades the full 35s waveform.
- **Distant Encirclement Rumble (Extended 18–25s)**: Mount `distant_artillery_rumble` or `war_distant` on Layer 3 at low volume (`volume_db: -24.0`) during pauses between narration beats to reinforce tactical encirclement.
- **Tactile Relics & Command Desk Foley**:
  - `paper_rustle_heavy` on document, treaty, or telegram entries (`audio_track_layer: 2`, `-22.0 dB`).
  - `brass_casing_clink` when the camera sweeps across artillery shells on the command table or after rifle discharge (`audio_track_layer: 2`, `-21.0 dB`).
  - `trench_radio_crackle` on Morse code intercepts, telegraph dispatches, and field telephone communication (`audio_track_layer: 2`, `-23.0 dB`).
  - `bolt_action_rifle` on sniper, guard, or firing line actions (`audio_track_layer: 2`, `-20.0 dB`).

---

#### B. MULTI-LAYER SOUND STACKING & MANDATORY COVERAGE RULES:
Never restrict yourself to one sound at a time. Top creators achieve cinematic immersion by **stacking multiple sounds across different layers simultaneously** (or staggered by 2–5 frames):

1. **The Opening Hook & Fast Montages:**
   - On an explosive opening cut: stack `whoosh_fast` (Layer 1) + `dramatic_braam` (Layer 3) + `pop_firm` (Layer 1).
   - On a montage transition across years: trigger a `musical_riser` (Layer 3) spanning 3 seconds while `ticker_count` or `odometer_roll` (Layer 1) rolls the year, culminating in a `sub_drop` (Layer 3) + `wood_thud` (Layer 2) on the final date.
2. **Tension Rising into a Climax / Crisis:**
   - Start a `clock_pulse` or `dark_drone` (Layer 3) to establish atmospheric dread.
   - 2–3 seconds before the breaking point, trigger a `musical_riser` (Layer 3).
   - On the exact impact frame: cut the riser into a `dramatic_braam` (Layer 3) + `cannon_blast` or `impact_hit` (Layer 2) + `camera_move` (Layer 1).
3. **Dramatic Facts & Shocking Revelations:**
   - When revealing a shocking truth, scandal, or sudden casualty count: trigger an `orchestral_hit` or `suspense_stinger` (Layer 3) stacked with a `stamp_thud` or `wood_thud` (Layer 2) and a tag `pop_soft` (Layer 1).
4. **Mandatory SFX for Every Canvas Montage Item (`STAGE_3_CANVAS_MONTAGE`):**
   - Whenever a scene uses `STAGE_3_CANVAS_MONTAGE`, read every item's exact `triggerFrame` from `scene.montage.items` and stack:
     - **1 frame before `triggerFrame`:** `photo_drop` or `polaroid_drop` (Layer 1, `-23.0 dB`).
     - **On `triggerFrame`:** A physical surface impact matching the subject—`wood_thud`, `thud`, `hammer_hit`, or `paper_rustle` (Layer 2, `-21.0 dB` to `-22.0 dB`).
     - **2 frames after `triggerFrame`:** `pop_soft` or `click` (Layer 1, `-25.0 dB`) as the `EXHIBIT #` caption tag locks.
5. **Mandatory Weather & Emotional Atmosphere Beds (Layer 3):**
   - Every scene with a `weatherPass` (`snow`, `fog_mist`, `rain`, `embers`, `ash`, `sea_spray`) or depicting an uninhabitable wasteland, exile, or tragic aftermath MUST include an atmospheric bed cue on **Layer 3** (`cold_wind`, `dark_drone`, `torch_fire_crackle`, or `sub_bass` at `-21.0 dB` to `-22.0 dB`) synchronized with the scene entry or key emotional trigger word.
   - **Sustained Beds vs. Single-Point Hits:** When triggering Layer 3 drones, cold wind, clock pulses, or tension risers, provide both `frame` and `end_frame` (e.g. `frame: 0, end_frame: 180` = 6.0s bed). The engine automatically crossfades them smoothly over the background music tracks and allocates overlapping stingers to separate CapCut lanes. For sharp accent hits (`dramatic_braam`, `orchestral_hit`), specify `frame` only.
6. **Mid-Video Continuous Canvas Parity:**
   - Any mid-video `STAGE_0_WAR_COMPOSITE_MASTER` sequence must receive the exact same 3-layer sound density as the Opening Hook—stacking whip-pan whooshes (`map_pan`, `whoosh_fast`), radar pings (`sonar_ping`), ink circles (`marker_circle`), physical impacts (`army_charge`, `sword_clash`, `stamp_slam`), and musical stingers (`synth_swell`, `suspense_stinger`, `dramatic_braam`) on every single beat's `microActions` trigger frames.
7. **Mandatory SFX Stacking for New Stages (`STAGE_4`):**
   - **`STAGE_4` (`MULTI_NODE_3D_AUDITORIUM_RIG` / `MIRROR_PORTAL_HUD_ROOM` / `BRUSH_TITLE_TO_NEWSPAPER_CUTOUT`)**:
     - Stack `portal_zoom_whoosh` (Layer 1) + `camera_shutter_burst` (Layer 2) when pulling back from the auditorium wall screen past the press photographers.
     - Trigger `whoosh_fast` (Layer 1) + `paper_slide` (Layer 1) on lateral whip-pans past the speaker's shoulder to the floating 3D contract folder.
     - Trigger `neon_hud_flicker` (Layer 1) + `sub_bass` (Layer 3) on locker room mirror neon flashes and `"18:16"` HUD popups.
     - Trigger `brush_swipe_heavy` (Layer 1) on the crimson brush banner and `paper_unfold` (Layer 1) + `pop_firm` (Layer 1) on the 3D newspaper unfold and hero cutout pop.
Our automated CapCut engine automatically packs overlapping cues into parallel audio lanes—there is zero risk of collision. Stack generously wherever visual or narrative drama demands it!

---

#### C. CUE PROPERTIES & STINGER DURATION RULES (5 Required Fields + Optional Sustained Stinger Window):
1. **Decision Fields Only**: Every cue in `sfx_cues.json` contains:
   - **`frame`** (integer): Global integer start frame (at 30 fps: 0, 30, 45, 120, ...).
   - **`end_frame`** (Optional integer for Layer 3 Sustained Beds): Specify for sustained tension elements (`musical_riser`, `tension_riser`, `tension_swell`, `dark_drone`, `cold_wind`, `clock_pulse`, `projector_hum`, `torch_fire_crackle`). The engine automatically sustains/loops and applies smooth CapCut audio crossfades across the exact frame window. Single-point hits (`whoosh_fast`, `wood_thud`, `dramatic_braam`) omit this field.
   - **`cue`** (string): Exact sound effect identifier from the 3-Tier taxonomy above.
   - **`audio_track_layer`** (integer): `1` (Motion/UI), `2` (Impact/Foley), or `3` (Musical Stingers/Ambience).
   - **`volume_db`** (number): Calibrated broadcast level (`-23.0` to `-25.0` for Layer 1; `-21.0` to `-23.0` for Layer 2; `-20.0` to `-22.0` for Layer 3).
   - **`reason`** (string): Precise visual or narrative trigger explaining why the sound is placed here.

---

#### D. GOLDEN SOUND DESIGN RULES (TOP DOCUMENTARY PRODUCTION):
1. **Separation of Layers:** Never stack two cues on the same `audio_track_layer` at the exact same frame.
2. **Pre-Impact Lead-In Timing:** Whooshes, risers, sweeps, and camera glides should peak or finish ~1 frame before or right on their corresponding impact/arrival frame.
3. **Sonic Variation (No Back-to-Back Duplicates):** Avoid repeating the exact same cue name back-to-back within 90 frames (3 seconds). Rotate between variants (e.g., `whoosh_fast` $\rightarrow$ `map_pan` $\rightarrow$ `doppler_whoosh`, or `pop_soft` $\rightarrow$ `click` $\rightarrow$ `paper_slide`).
4. **Ambience & Scene Beds Restraint:** Place an atmospheric drone, cold wind, or room tone once per scene transition or major mood shift—not on every individual text beat.
5. **Voiceover Dominance:** Narration must remain king. Bed BGM is mixed at `-29.0 dB`, standard SFX at `-23.0 dB`, and heavy impacts at `-21.0 dB` (never exceeding `-14.0 dB` under dialogue).

#### Output Schema (`public/sfx_cues.json`):
```json
[
  {
    "frame": 0,
    "cue": "whoosh_fast",
    "audio_track_layer": 1,
    "volume_db": -23.0,
    "reason": "Opening hook camera zooms into archival document"
  },
  {
    "frame": 0,
    "cue": "dramatic_braam",
    "audio_track_layer": 3,
    "volume_db": -21.0,
    "reason": "Dramatic low brass establishes high-stakes documentary gravity"
  },
  {
    "frame": 45,
    "cue": "marker_circle",
    "audio_track_layer": 1,
    "volume_db": -24.0,
    "reason": "Red marker circles suspect name on ledger"
  },
  {
    "frame": 180,
    "end_frame": 270,
    "cue": "musical_riser",
    "audio_track_layer": 3,
    "volume_db": -20.0,
    "reason": "3-second suspense riser building tension before courtroom verdict"
  },
  {
    "frame": 270,
    "cue": "courtroom_gavel",
    "audio_track_layer": 2,
    "volume_db": -21.0,
    "reason": "Judge gavel strikes on the guilty verdict"
  },
  {
    "frame": 270,
    "cue": "sub_drop",
    "audio_track_layer": 3,
    "volume_db": -21.0,
    "reason": "Sub-bass boom reinforces gavel impact"
  },
  {
    "frame": 275,
    "cue": "pop_firm",
    "audio_track_layer": 1,
    "volume_db": -23.0,
    "reason": "Verdict exhibit badge pops into frame"
  }
]
```

---

### 8. BACKGROUND MUSIC DESIGN & MULTI-TRACK HOOK PACING (`public/music_plan.json` - GENERATED AT THE VERY END)
- Output `public/music_plan.json` (or part-wise `music_plan1.json`, `music_plan2.json`... when generating multi-part documentary series) as the final step.
- **High-Velocity Multi-Track Music Pacing in Opening Hook**:
  - Do NOT use a single slow background track across the entire 45–60s Opening Hook.
  - Split the Opening Hook into **2 to 3 shorter, fast-paced musical sub-acts** (15–18 seconds each) that shift mood rapidly as the hook's paradox unfolds (e.g., Part 1: initial discovery $\rightarrow$ Part 2: dark twist / dead zone $\rightarrow$ Part 3: climax and chronological rewind).
- Divide the remainder of the video into thematic narrative acts (typically 1 to 3 minutes per act, aligned with major script transitions).
- **Calibrated BGM level:** The engine mixes music at **-29.0 dB** with seamless 4.0-second dual-deck crossfades.
- **Available Serious Music Track Library (select from these exact filenames by narrative mood):**
  - **1. Epic Warfare, Frontline Battles & Military Advances:**
    - `epic-battle-orchestral_789290_epic_soundtrack_with_choir_and_strings_for_video_g.mp3` (Mood: epic_battle / full choir & orchestral battle climax)
    - `orchestral-combat-theme_767837_sunixmuz_-_blessed_hall_opening_trailer_epic_music.mp3` (Mood: combat_trailer / grand opening trailer & clash)
    - `cinematic-war-percussion_125933_reenactment3_aif.mp3` (Mood: war_percussion / historical battle reenactment drums)
    - `cinematic-war-drums-battle_510955_orchestral_hero_theme.mp3` (Mood: battle_march / heroic orchestral brass & drums)
    - `Percussion_Only-2023-09-07_-_Preparing_For_Battle_-_www.FesliyanStudios.com.mp3` (Mood: battle_buildup / war drums / tactical staging)
    - `Action_Rhythms_-_David_Fesliyan.mp3` (Mood: combat_rhythm / dynamic tactical pursuit)
    - `cinematic-action-orchestral-adventure-240981.mp3` (Mood: military_march / combined arms advance)
    - `2024-03-26_-_Hot_Pursuit_-_www.FesliyanStudios.com.mp3` (Mood: pursuit / high-speed military maneuver)
    - `epic-cinematic-trailer-music-231087.mp3` (Mood: war_trailer / climactic counter-offensive)
    - `epic-cinematic-dramatic-adventure-trailer-153859.mp3` (Mood: epic_trailer / grand historical campaign)
    - `triumphant-trailer-score-powerful-orchestral-build-up-274380.mp3` (Mood: victory_triumph / breakthrough & celebration)
    - `dramatic-epic-background-305293.mp3` (Mood: epic_campaign / monumental historical confrontation)

  - **2. Urgent Tension, Deadlines & Siege Countdowns:**
    - `against-the-clock-urgent-builder-instrumental-177815.mp3` (Mood: urgent_tension / race against time / escalating crisis)
    - `time_is_ticking_138-242522.mp3` (Mood: deadline_clock / impending zero hour)
    - `tense-suspense-background-music-320439.mp3` (Mood: suspense / impending disaster / siege encirclement)
    - `tense-suspense-background-music-364864.mp3` (Mood: deep_suspense / frontline standoff)
    - `race-against-time-289734.mp3` (Mood: race_against_time / desperate relief column)
    - `tension-build-6035.mp3` (Mood: tension_buildup / escalating breaking point)
    - `intense-orchestral-piece-anxiety-and-suspense-284211.mp3` (Mood: anxiety_suspense / nervous command decisions)
    - `drone-high-tension-and-suspense-background-162365.mp3` (Mood: tension_drone / psychological warfare)

  - **3. Dark Mystery, Conspiracies, Espionage & Corruption:**
    - `dark-story-investigator-sinister-mystery-instrumental-309020.mp3` (Mood: dark_mystery / corruption / secret treaties)
    - `documentary-suspense-ambient-313131.mp3` (Mood: suspense_ambient / intelligence & codebreaking)
    - `investigations-are-ongoing-263601.mp3` (Mood: investigation / power struggles / audit trails)
    - `dark-mystery-cinematic-melody-137263.mp3` (Mood: sinister_melody / palace intrigue / treason)
    - `dark-suspense-133282.mp3` (Mood: dark_suspense / midnight assassinations)
    - `dark-thriller-castle-atmo-orchestral-drone-9276.mp3` (Mood: gothic_intrigue / fortress dungeons & war cabinets)
    - `mystery-of-the-investigation-215184.mp3` (Mood: investigative_puzzle / deciphering logistics)
    - `ambient_tension_01.mp3`, `ambient_tension_02.mp3`, `ambient_tension_03.mp3` (Mood: brewing_rebellion / institutional breakdown)

  - **4. Solemn Tragedy, Mass Casualties, Scorched Earth & Defeat:**
    - `dark-and-sad-epic-dramatic-cinematic-254261.mp3` (Mood: war_tragedy / solemn aftermath / historic mourning)
    - `cloud-of-sorrow-13984 sad.mp3` (Mood: sorrow / civilian famine & depopulation)
    - `sad-piano-instrumental-background-music-279069.mp3` (Mood: tragic_piano / fallen heroes & sacrifice)
    - `pain-of-the-soul-very-sad-286739.mp3` (Mood: devastating_loss / winter retreat casualties)
    - `pad-a-sombre-moment-in-time-237103.mp3` (Mood: sombre_reflection / post-battle silence)
    - `Hopeless - Jimena Contreras.mp3` (Mood: hopeless_despair / surrender & collapse)
    - `A_deep,_emotional_ci.mp3` (Mood: emotional_gravity / memorial & remembrance)
    - `Dead Forest - Brian Bolger.mp3` (Mood: bleak_wasteland / no-man's land)

  - **5. Historical Epic, Foundational Eras & Civilizations:**
    - `ambient_history_01.mp3` (Mood: historical_epic / foundational origins & ancient frontiers)
    - `history_serious_01.mp3` (Mood: investigation / solemn crisis / heavy history)
    - `history-historical-music-261143.mp3` (Mood: history / trade windfalls & golden ages)
    - `dreaming-of-arabia-unplugged-demo-prod-madirfan-206092.mp3` (Mood: middle_eastern_desert / ancient desert empires)
    - `persian music.mp3` (Mood: persian_dynasty / silk road empires)

  - **6. Reflective, Systemic Economics, Governance & Post-War Peace:**
    - `reflective_01.mp3`, `reflective_02.mp3`, `reflective_03.mp3` (Mood: reflective / institutional turning points & economics)
    - `ambient_warm_01.mp3`, `ambient_warm_02.mp3`, `ambient_warm_03.mp3` (Mood: warm_reflective / peace treaties & recovery)
    - `hopeful_01.mp3`, `hope-187053.mp3` (Mood: rebuilding / post-war reconstruction)
    - `explainer_01.mp3`, `explainer_02.mp3`, `explainer_03.mp3` (Mood: analytical / macroeconomic trade & production)

#### Output Schema (`public/music_plan.json` - Strict 6-Field Schema):
```json
[
  {
    "act_id": 1,
    "title": "Hook Part 1: Discovery of the Deep Reservoir",
    "track_file": "documentary-suspense-ambient-313131.mp3",
    "mood": "suspense_ambient",
    "start_s": 0.0,
    "end_s": 16.5
  },
  {
    "act_id": 2,
    "title": "Hook Part 2: The 99% Dead Zone & Latitude Paradox",
    "track_file": "dark-story-investigator-sinister-mystery-instrumental-309020.mp3",
    "mood": "dark_mystery",
    "start_s": 16.5,
    "end_s": 34.0
  },
  {
    "act_id": 3,
    "title": "Hook Part 3: 5.5 Million Thriving & The 11,000-Year Rewind",
    "track_file": "tense-suspense-background-music-320439.mp3",
    "mood": "suspense",
    "start_s": 34.0,
    "end_s": 50.1
  },
  {
    "act_id": 4,
    "title": "Act 1: Holocene Deglaciation & Early Settlements",
    "track_file": "ambient_history_01.mp3",
    "mood": "historical_epic",
    "start_s": 50.1,
    "end_s": 180.0
  }
]
```

---

location to place these files:
- `public/sfx_cues.json` (Multi-track 3-layer sound design manifest for CapCut post-production)
- `public/music_plan.json` (Multi-act background music manifest for CapCut post-production)

- All sound effects and music design belong **exclusively** inside the exported `public/sfx_cues.json` and `public/music_plan.json` manifest files, which are consumed by the external CapCut post-production engine.

and finally scan all animation events and micro-actions to output `public/sfx_cues.json` and `public/music_plan.json` at the very end.