### 6. GENERATION ORDER (CRITICAL WORKFLOW RULE)
1. **Always generate all Remotion TypeScript code and scene sequence files FIRST.**
2. **ONLY after the complete code and scene animations are fully generated, compile and output `public/sfx_cues.json` and `public/music_plan.json` at the very end.**
   - **How Prompt 2 Compiles Sound Design**: Since `storyboard.json` delegates all audio manifests to this engine, Prompt 2 acts as the master sound compiler by scanning:
     - **`scene.microActions`**: Read exact integer `triggerFrame` timestamps for stamps (`stamp_slam`), ink circles (`marker_circle`), odometers (`odometer_roll`), and redactions (`strikethrough_slice`).
     - **Scene Transitions**: Place Layer 1 camera sweeps (`whoosh_fast`, `camera_move`) right at transition boundaries.
     - **Montage Drops (`scene.montage.items`)**: Trigger archival drop (`photo_drop` at -1 frame), physical impact (`wood_thud` on trigger frame), and archival docket lock (`film_sprocket` or `paper_slide` at +2 frames) for every montage item.
     - **Atmosphere & Weather Passes (`weatherPass`)**: Mount Layer 3 continuous beds (`howling_blizzard`, `cold_wind`, `dark_drone`, `torch_fire_crackle`, `distant_artillery_rumble`) with explicit `frame` and `end_frame` windows across desolate or snowy scenes.

---

### 7. ADVANCED SOUND DESIGN & MULTI-TRACK AUDIO MIXING (`public/sfx_cues.json` - GENERATED AT THE VERY END)
> **Master Audio Authority**: `storyboard.json` contains zero audio arrays. This engine compiles all sound design by reading the exact frame timestamps of animations, stage events, and micro-actions generated above.

In world-class historical and war documentary filmmaking (e.g., *Ken Burns, Magnates Media, Johnny Harris, Lemmino, Vox*), sound design is never a series of loud, continuous clicks or cartoon UI noises. It is an **authored, dynamic soundscape** characterized by acoustic contrast: long stretches of desolate environmental realism and negative space, punctuated by visceral, tactile military Foley, and crowned by heavily rationed cinematic hero impacts.

---

#### 7.1 THE 3-TIER SOUND ARCHITECTURE & CANONICAL TAXONOMY:
Every cue in `sfx_cues.json` must be assigned to its correct `audio_track_layer`.
*(Note: Cartoon and tech UI sounds such as `bubble_pop`, `pop_soft`, `reveal_pop`, `pop_firm`, `vine_boom`, and `neon_hud_flicker` are strictly forbidden in serious historical productions. Use tactile, era-appropriate archival and mechanical cues instead.)*

1. **Layer 1: Motion, Cartography, Archival Evidence & Tactile UI (`audio_track_layer: 1`)**
   - **Camera, Portals & Kinetic Moves**: `whoosh_fast`, `camera_move`, `map_pan`, `portal_zoom_whoosh`, `pillar_wipe_swish`, `barrel_roll_whoosh`, `doppler_whoosh`, `camera_push`, `pullback_whoosh`, `camera_dive`, `shutter_wipe`, `tape_rewind`
   - **Archival Evidence, Documents & Folios**: `photo_drop`, `polaroid_drop`, `paper_slide`, `paper_unfold`, `dossier_drop`, `blueprint_unroll`, `film_sprocket`, `paper_clip`, `string_snap`
   - **Cartography, Tactical Brushes & Ledger Markup**: `marker_circle`, `marker_underline`, `marker_scratch`, `pencil_draw`, `draw_line`, `brush_swipe_heavy`, `ink_splatter_reveal`, `border_draw`, `sonar_ping`
   - **Tactile Optics, Rangefinders & Reticle Locks**: `rangefinder_click`, `crosshair_lock`, `camera_shutter`, `lens_click`, `viewfinder_click`, `typewriter_key_clack`
   - **Numerical Telemetry & Odometers**: `odometer_roll`, `odometer_click`, `counter_roll`, `counter_digital`, `geiger_counter`, `data_flutter`, `ticker_count`, `adding_machine`
   - **Ballistic Projectile Flybys**: `bullet_whiz`, `shrapnel_flyby`, `arrow_shot`
   - *Target Broadcast Volume:* **-24.0 dB to -26.0 dB** (crisp, quiet, non-fatiguing, never masks voiceover).

2. **Layer 2: Action, Foley, Tactile Stamps & Physical Impacts (`audio_track_layer: 2`)**
   - **Military Footgear & Mass Movement**: `foley_snow_crunch` (tactile winter boot crunches in snow/mud), `marching_boots` (tactile combat infantry boots), `army_marching` (synchronized battalion troop cadence)
   - **Battlefield Relics & Communications**: `brass_casing_clink` (spent artillery/rifle shells on desk or stone), `paper_rustle_heavy` (heavy telegrams, stiff maps, folded battle orders), `trench_radio_crackle` (distorted field radio static & Morse code)
   - **Physical Impacts & Drops**: `wood_thud`, `thud`, `impact_hit`
   - **Official Seals, Stamps & Rulings**: `courtroom_gavel`, `stamp_slam`, `rubber_stamp`, `stamp_thud`
   - **Text Slices & Redactions**: `strikethrough_slice`, `percussive_slice`
   - **Era-Aware Infantry & Ballistic Combat**:
     - *Ancient / Medieval / 18th–19th Century*: `sword_clash`, `arrow_shot`, `musket_fire`, `cannon_blast`
     - *WWI / WWII / Modern*: `bolt_action_rifle` (rifle bolt pull, chambering & shot), `mortar_thud`, `shrapnel_ricochet`, `metal_helmet_ding`, `blast`
   - **Hardware Switches & Triggers**: `camera_shutter_burst`, `relay_switch`, `switch_click`, `spark_ignition`
   - **Labor & Commerce**: `hammer_hit`, `tool_clink`, `coin_clink`, `coin_bag_drop`
   - **Crowd & Formations**: `crowd_shout`, `crowd_cheer`, `army_charge`
   - **Percussion & Battle Drums**: `epic_drums`, `battle_drums`, `trailer_hit`
   - *Target Broadcast Volume:* **-20.0 dB to -22.0 dB** (visceral, punchy tactile physical weight).

3. **Layer 3: Musical Accents, Tension Stingers & Environmental Beds (`audio_track_layer: 3`)**
   - **Hero Climax Stingers (STRICTLY RATIONED: Max 1–2 per entire 5-minute video!):**
     - `dramatic_braam`: Deep brass/synth cinematic impact. Reserved exclusively for the Opening Hook paradox climax or monumental collapse.
     - `sub_drop`: Monumental sub-bass drop underneath catastrophic destruction or turning point.
   - **Subtle Dramatic Accents & Suspense Risers (Support Moments):**
     - `musical_riser`: Orchestral or synth crescendo building suspense over 2 to 4 seconds leading into a major reveal or crisis.
     - `tension_swell`: Rapid reverse cymbal or string swell accentuating an abrupt realization.
     - `synth_swell`: Swelling cinematic synth chord cut abruptly on dramatic climax words.
     - `orchestral_hit` / `investigative_piano` / `bowed_metal`: Subtle chord or metallic accent for investigative reveals.
     - `suspense_stinger`: Sharp musical shock stinger when a trap is sprung or unexpected danger strikes.
     - `warhorn`: Battlefield brass call for military mobilization or invasion.
     - `downer`: Pitch-fall sub-bass dive for surrender, retreat, or collapse.
     - `clock_pulse`: Tense ticking clock / rhythmic heartbeat pulse during siege deadlines.
   - **Continuous Environmental Beds (Extended 20–35s Sustained Audio):**
     - `howling_blizzard`: Extended 20s–35s sub-zero winter storm ambience bed across winter warfare and frozen retreats.
     - `cold_wind`: Desolate whistling wind gust bed across mountain passes, frozen steppes, and cold transitions.
     - `desert_wind`: Whistling arid sand wind ambience bed across desert campaigns, ruins, and scorched plains.
     - `forest_ambient`: Rustling pine canopy, dark woodland atmosphere, and wilderness wind bed for forest engagements (e.g. Ardennes, deep woods).
     - `thunderstorm`: Low rolling distant thunder and stormy rain wash for torrential weather and stormy sieges.
     - `rain_heavy`: Steady heavy rainfall and wet ground ambience for muddy trenches and autumn campaigns.
     - `night_crickets`: Quiet nocturnal wilderness and cricket bed for stealth night maneuvers and quiet encampments.
     - `torch_fire_crackle`: Warm flickering torch/fire ambience bed for night trenches, fortresses, and bivouacs.
     - `distant_artillery_rumble` / `war_distant`: Extended 18s–25s low-frequency muffled horizon bombardment bed (calibrated at `-28.0 dB` to `-30.0 dB`).
     - `dark_drone`: Low ominous drone sustained beneath brewing conspiracies and war cabinets.
     - `marching_cadence_bed`: Sustained infantry squad marching bed beneath troop redeployments.
     - `dystopian_pad`: Sustained atmospheric drone pad for ruined cities and scorched earth.
   - *Target Broadcast Volume:*
     - **Environmental Beds & Drones:** **-28.0 dB to -30.0 dB** (Must sit *at or below* the -29.0 dB BGM bed so they never fight narration or music!).
     - **Hero Stingers & Dramatic Accents:** **-21.0 dB to -22.0 dB** (calibrated to pierce momentarily through the mix).

---

#### 7.2 SOUND DESIGN HIERARCHY, IMPORTANCE TIERS & DENSITY BUDGET
Continuous sound creates acoustic fatigue. In master documentary editing, sound is structured into three clear importance tiers:

1. **Hero Moments (Strictly 3–4 moments per entire 5-minute video):**
   - *Examples*: The Opening Hook paradox climax, the sudden declaration of war, the breakthrough at the siege lines, or total empire collapse.
   - *Stacking*: Full 3-layer stack permitted (Layer 1 motion + Layer 2 visceral impact + Layer 3 hero stinger like `dramatic_braam` or `sub_drop`).
2. **Support Moments (Scene transitions, key troop advances, major document reveals):**
   - *Stacking*: 1 to 2 sounds maximum (e.g. Layer 1 camera wipe + Layer 2 tactile stamp, OR Layer 2 marching foley + quiet Layer 3 drone).
3. **Detail Moments (Micro-actions, dates, caption tags, ledger circles, reticle locks):**
   - *Stacking*: Exactly 1 quiet Foley sound (`paper_slide`, `film_sprocket`, `marker_circle`, `rangefinder_click`) or near-silence. Never add Layer 3 stingers to detail moments!
4. **Density Budget (Acoustic Breathing Room):**
   - Outside fast-paced montages, strictly enforce a budget of **maximum 4–6 cues per 10 seconds** (12–18 cues per 30 seconds).
   - Let scenes breathe. Long stretches of desolate ambient room tone (`cold_wind` or `distant_artillery_rumble` at `-29.0 dB`) make the hero moments land with 10x greater emotional force.
5. **Negative Space & The "Vacuum Drop":**
   - Pull the music and ambient beds down 0.5s–1.0s before a massive cannon volley or hero reveal. When the explosion or reveal strikes in a momentary acoustic vacuum, the visceral impact is doubled.
6. **Casualty Figure & Memorial Restraint:**
   - When displaying staggering death tolls, casualty figures, or famine statistics: **NEVER place loud braams, booms, or orchestral stingers!**
   - Drop all beds and music. Use heavy negative space—subtle silence, a muted low `sub_bass` at `-28.0 dB`, or a slow `clock_pulse`. Let the visual number carry the solemn moral weight.

---

#### 7.2.1 THE CONTINUOUS WORLD BED DIRECTIVE (MANDATORY SCENE ENVIRONMENT MATRIX)
> **The Golden Production Rule**: In world-class filmmaking, an environmental bed is **ALMOST ALWAYS PLAYING** in the background for each scene. A visual scene without its acoustic environment feels like a sterile, soundless CGI void. **Every single scene in the video MUST mount a continuous Layer 3 environmental bed that spans the scene from start frame to end frame (`frame` to `end_frame`)**, matched directly to that scene's visual setting and `weatherPass`:

| Visual Setting & `weatherPass` | Mandatory Layer 3 Cue | Target Volume | Acoustic Role |
| :--- | :--- | :--- | :--- |
| `snow` / Winter Steppes / Frozen Mountain Passes | `howling_blizzard` or `cold_wind` | `-28.0 dB` to `-30.0 dB` | Howling sub-zero blizzards & frozen desolation |
| `dust` / Desert Dunes / Arid Wastelands | `desert_wind` | `-28.0 dB` to `-30.0 dB` | Whistling arid wind & sand gusts |
| `fog_mist` / Dense Forest / Woods / Ardennes | `forest_ambient` | `-28.0 dB` to `-30.0 dB` | Deep forest canopy, rustling pine needles |
| `rain` / Wet Muddy Trenches / Torrential Siege | `thunderstorm` or `rain_heavy` | `-28.0 dB` to `-30.0 dB` | Rolling thunder & steady rainfall |
| `embers` / Night Encampments / Bivouacs | `torch_fire_crackle` or `night_crickets` | `-28.0 dB` to `-30.0 dB` | Flickering firelight & nocturnal wilderness |
| War Room / Command Bunker / Ministry / Vault | `dark_drone` or `vintage_hum` | `-29.0 dB` to `-30.0 dB` | Claustrophobic room tone & enclosed tension hum |
| Frontline Warzone / Encirclement Standoff | `distant_artillery_rumble` | `-28.0 dB` to `-30.0 dB` | Muffled horizon cannon volleys (<800 Hz) |

- **Why Continuous Beds Never Mask the Voiceover**: Because environmental beds are seated at **-28.0 dB to -30.0 dB** (sitting *at or below* the -29.0 dB ducked music bed), they serve as gentle, subliminal psychological texture underneath the narrator. They never fight human vocal frequencies or cause listener fatigue.
- **Smooth Scene Transitions (Acoustic J-Cuts)**: When Scene 1 cuts to Scene 2, Scene 2's environmental bed pre-laps **15–30 frames (0.5s–1.0s) BEFORE the visual cut**. The automated engine smoothly crossfades between the beds across parallel CapCut lanes.
- **The ONLY Exceptions to "Always Playing" (Intentional Dramatic Silence)**:
  1. *Calm Before the Storm*: Cut the environmental bed 2 seconds before the first cannon volley to build unbearable dread.
  2. *Vacuum Drop*: Strip beds 0.5s before a massive hero explosion so the detonation lands in absolute acoustic vacuum.
  3. *Casualty & Memorial Silence*: Strip beds into solemn silence when staggering death tolls appear on screen.

---

#### 7.3 WAR-DOCUMENTARY PRODUCTION TECHNIQUES

1. **Pre-Lap Ambient J-Cuts (Smooth Acoustic Geography):**
   - Start the incoming scene's environmental bed (`cold_wind`, `distant_artillery_rumble`, `torch_fire_crackle`) **15 to 30 frames (0.5s–1.0s) BEFORE the visual cut**. Pre-lapping the sound pulls the viewer into the new geography before their eyes register the visual shift.
2. **Impact Anatomy (Staggered Detonation):**
   - Real military detonations are never a single flat sound. Stagger 2–3 cues across frames instead of triggering everything simultaneously:
     - **Frame 0**: High-frequency transient blast crack (`cannon_blast` or `blast` Layer 2, `-20.0 dB`).
     - **Frame +2**: Physical shockwave / debris / mechanicals (`shrapnel_ricochet` or `impact_hit` Layer 2, `-22.0 dB`).
     - **Frame +6 to +15**: Low-frequency horizon rumble tail (`distant_artillery_rumble` Layer 3, `-28.0 dB`).
3. **Shellshock Moment:**
   - Following a catastrophic artillery barrage or devastating frontline explosion, drop into 1.5–2.0 seconds of muffled silence or low-frequency sub-bass before the narrator resumes.
4. **Calm Before the Storm:**
   - In the 2 seconds (60 frames) immediately preceding the opening artillery barrage, strip all background ambient beds. Silence builds immense dread.
5. **Historical Era Guards:**
   - Ensure all cues strictly respect historical eras:
     - *Napoleonic / 18th–19th Century*: `musket_fire`, `cannon_blast`, `sword_clash`, `paper_rustle_heavy`, `marching_boots`. (FORBIDDEN: `bolt_action_rifle`, `trench_radio_crackle`, `counter_digital`).
     - *WWI / WWII*: `bolt_action_rifle`, `trench_radio_crackle`, `brass_casing_clink`, `shrapnel_ricochet`, `mortar_thud`, `distant_artillery_rumble`.
     - *Modern / Cold War*: `sonar_ping`, `geiger_counter`, `counter_digital`, `typewriter_key_clack`.

---

#### 7.4 MULTI-LAYER SOUND STACKING & MANDATORY COVERAGE RULES:

1. **The Opening Hook & Fast Montages:**
   - On an explosive opening cut: stack `whoosh_fast` (Layer 1) + `impact_hit` or `wood_thud` (Layer 2).
   - Only if this is the single Hero Paradox Reveal of the hook, add `dramatic_braam` (Layer 3).
   - On a montage transition across years: trigger a `musical_riser` (Layer 3) spanning 3 seconds while `ticker_count` or `odometer_roll` (Layer 1) rolls the year, culminating in a `wood_thud` (Layer 2) on the final date.
2. **Tension Rising into a Climax / Crisis:**
   - Start a `clock_pulse` or `dark_drone` (Layer 3) to establish atmospheric dread.
   - 2–3 seconds before the breaking point, trigger a `musical_riser` (Layer 3).
   - On the breaking frame: cut the riser into `cannon_blast` or `blast` (Layer 2) + `camera_move` (Layer 1).
3. **Mandatory SFX for Every Canvas Montage Item (`STAGE_3_CANVAS_MONTAGE`):**
   - Whenever a scene uses `STAGE_3_CANVAS_MONTAGE`, read every item's exact `triggerFrame` from `scene.montage.items` and stack:
     - **1 frame before `triggerFrame`:** `photo_drop` or `polaroid_drop` (Layer 1, `-25.0 dB`).
     - **On `triggerFrame`:** A physical surface impact matching the subject—`wood_thud`, `thud`, `hammer_hit`, or `paper_rustle_heavy` (Layer 2, `-21.0 dB` to `-22.0 dB`).
     - **2 frames after `triggerFrame`:** Tactile docket lock—`film_sprocket`, `paper_slide`, or `rangefinder_click` (Layer 1, `-26.0 dB`) as the `EXHIBIT #` caption tag locks. (NO cartoon pops!).
4. **Mandatory Continuous Environmental Beds (Layer 3 - The World Bed):**
   - Every single scene MUST include a continuous atmospheric bed cue on **Layer 3** matching its visual environment from the Section 7.2.1 Environment Matrix (`howling_blizzard`, `cold_wind`, `forest_ambient`, `thunderstorm`, `rain_heavy`, `desert_wind`, `torch_fire_crackle`, `night_crickets`, `dark_drone`, or `distant_artillery_rumble` at `-28.0 dB` to `-30.0 dB`).
   - Specify both `frame` and `end_frame` (e.g. `frame: 0, end_frame: 450` = 15.0s bed). The engine automatically crossfades and sustains the audio smoothly across the entire scene. Pre-lap the bed by 15–30 frames before each new scene cut.
5. **Stage 4 Archival SFX Coverage:**
   - **`STAGE_4` (`MULTI_NODE_3D_AUDITORIUM_RIG` / `MIRROR_PORTAL_HUD_ROOM` / `BRUSH_TITLE_TO_NEWSPAPER_CUTOUT`)**:
     - Stack `portal_zoom_whoosh` (Layer 1) + `camera_shutter_burst` (Layer 2) when pulling back from the auditorium wall screen.
     - Trigger `whoosh_fast` (Layer 1) + `paper_slide` (Layer 1) on lateral whip-pans to the 3D contract folder.
     - Trigger `crosshair_lock` (Layer 1) + `dark_drone` (Layer 3) on tactical room HUD locks.
     - Trigger `brush_swipe_heavy` (Layer 1) on the crimson brush banner and `paper_unfold` (Layer 1) + `wood_thud` (Layer 2) on the 3D newspaper unfold.

---

#### 7.5 CUE PROPERTIES & STINGER DURATION RULES (5 Required Fields + Optional Sustained Stinger Window):
1. **Decision Fields Only**: Every cue in `sfx_cues.json` contains:
   - **`frame`** (integer): Global integer start frame (at 30 fps: 0, 30, 45, 120, ...). For pre-lap J-cuts, this starts 15–30 frames before the scene cut.
   - **`end_frame`** (Optional integer for Layer 3 Sustained Beds): Specify for sustained beds and risers (`musical_riser`, `tension_swell`, `dark_drone`, `cold_wind`, `howling_blizzard`, `distant_artillery_rumble`, `marching_cadence_bed`, `clock_pulse`, `torch_fire_crackle`). The engine automatically sustains and crossfades across the window. Single-point hits omit this field.
   - **`cue`** (string): Exact canonical sound effect identifier from the 3-Tier taxonomy above.
   - **`audio_track_layer`** (integer): `1` (Motion/Archival/UI), `2` (Impact/Foley), or `3` (Musical Stingers/Beds).
   - **`volume_db`** (number): Unified broadcast decibel level:
     - **Layer 1:** `-24.0` to `-26.0 dB`
     - **Layer 2:** `-20.0` to `-22.0 dB`
     - **Layer 3 Sustained Beds:** `-28.0` to `-30.0 dB` (always below or at BGM level)
     - **Layer 3 Hero Stingers:** `-21.0` to `-22.0 dB` (rationed to 1–2 per video)
   - **`reason`** (string): Precise visual or narrative trigger explaining why the sound is placed here.

---

#### 7.6 GOLDEN SOUND DESIGN RULES (BROADCAST STANDARDS):
1. **Separation of Layers:** Never stack two cues on the same `audio_track_layer` at the exact same frame. Stacking must always be cross-layer (Layer 1 + Layer 2 + Layer 3).
2. **Pre-Impact Lead-In Timing:** Whooshes, sweeps, and camera glides should peak ~1 frame before or right on their corresponding impact/arrival frame.
3. **Sonic Variation (No Machine-Gun Duplicates):** Avoid repeating the exact same cue name back-to-back within 90 frames (3 seconds). Rotate between variants (e.g., `whoosh_fast` $\rightarrow$ `map_pan` $\rightarrow$ `doppler_whoosh`, or `paper_slide` $\rightarrow$ `film_sprocket` $\rightarrow$ `rangefinder_click`).
4. **Ambience & Scene Beds Restraint:** Place an atmospheric drone, cold wind, or room tone once per scene transition or major mood shift—never trigger new ambient beds on every text beat.
5. **Voiceover Dominance:** Narration is always supreme. Bed BGM is mixed at `-29.0 dB`, ambient beds at `-28.0 dB` to `-30.0 dB`, standard SFX at `-24.0 dB`, and heavy impacts at `-20.0 dB` to `-21.0 dB`.

#### Output Schema (`public/sfx_cues.json`):
```json
[
  {
    "frame": 0,
    "cue": "whoosh_fast",
    "audio_track_layer": 1,
    "volume_db": -24.0,
    "reason": "Opening hook camera zooms into archival battle map"
  },
  {
    "frame": 0,
    "cue": "dramatic_braam",
    "audio_track_layer": 3,
    "volume_db": -21.0,
    "reason": "Hero moment: dramatic brass impact establishes high-stakes wartime gravity"
  },
  {
    "frame": 45,
    "cue": "marker_circle",
    "audio_track_layer": 1,
    "volume_db": -25.0,
    "reason": "Red marker circles strategic railway junction on map"
  },
  {
    "frame": 180,
    "end_frame": 270,
    "cue": "musical_riser",
    "audio_track_layer": 3,
    "volume_db": -22.0,
    "reason": "3-second suspense riser building tension before the assault command"
  },
  {
    "frame": 270,
    "cue": "cannon_blast",
    "audio_track_layer": 2,
    "volume_db": -20.0,
    "reason": "Artillery barrage initiates assault on the fortress"
  },
  {
    "frame": 272,
    "cue": "shrapnel_ricochet",
    "audio_track_layer": 2,
    "volume_db": -22.0,
    "reason": "Detonation shockwave and shrapnel scatter"
  },
  {
    "frame": 276,
    "end_frame": 450,
    "cue": "distant_artillery_rumble",
    "audio_track_layer": 3,
    "volume_db": -29.0,
    "reason": "Sub-bass horizon rumble tail sustained beneath the encirclement sequence"
  }
]
```

---

### 8. BACKGROUND MUSIC DESIGN & MULTI-TRACK HOOK PACING (`public/music_plan.json` - GENERATED AT THE VERY END)
- Output `public/music_plan.json` (or part-wise `music_plan1.json`, `music_plan2.json`... when generating multi-part documentary series) as the final step.
- **High-Velocity Multi-Track Music Pacing in Opening Hook**:
  - Do NOT use a single slow background track across the entire 45–60s Opening Hook.
  - Split the Opening Hook into **2 to 3 shorter, fast-paced musical sub-acts** (15–18 seconds each) that shift mood rapidly as the hook's paradox unfolds (e.g., Part 1: initial discovery $\rightarrow$ Part 2: dark twist / dead zone $\rightarrow$ Part 3: climax and chronological rewind).
  - Opening Hook sub-acts use **1.5s–2.0s crossfades** or hard cuts on sudden military shifts (e.g., sudden dawn invasion).
- Divide the remainder of the video into thematic narrative acts (typically 1 to 3 minutes per act, aligned with major script transitions).
- **Calibrated BGM level:** The engine mixes music at **-29.0 dB** with dynamic voiceover ducking (ducked to -29 dB during speech, smoothly swelling to -18 dB during pauses).
- **Available Serious Music Track Library (select from these exact filenames by narrative mood):**
  - **1. Epic Warfare, Frontline Battles & Military Advances:**
    - `epic-battle-orchestral_789290_epic_soundtrack_with_choir_and_strings_for_video_g.mp3` (Mood: epic_battle / full choir & orchestral battle climax)
    - `orchestral-combat-theme_767837_sunixmuz_-_blessed_hall_opening_trailer_epic_music.mp3` (Mood: combat_trailer / grand opening trailer & clash)
    - `cinematic-war-percussion_125933_reenactment3_aif.mp3` (Mood: war_percussion / historical battle reenactment drums)
    - `cinematic-war-drums-battle_510955_orchestral_hero_theme.mp3` (Mood: battle_march / heroic orchestral brass & drums)
    - `epic-battle-action_320970_loop_computer_feeling_good_08_wav.mp3` (Mood: battle_action / rapid tempo combat advance)
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

#### Output Schema (`public/music_plan.json` - Strict Schema):
```json
[
  {
    "act_id": 1,
    "title": "Hook Part 1: Discovery of the Deep Reservoir",
    "track_file": "documentary-suspense-ambient-313131.mp3",
    "mood": "suspense_ambient",
    "transition": "crossfade",
    "start_s": 0.0,
    "end_s": 16.5
  },
  {
    "act_id": 2,
    "title": "Hook Part 2: The 99% Dead Zone & Latitude Paradox",
    "track_file": "dark-story-investigator-sinister-mystery-instrumental-309020.mp3",
    "mood": "dark_mystery",
    "transition": "crossfade",
    "start_s": 16.5,
    "end_s": 34.0
  },
  {
    "act_id": 3,
    "title": "Hook Part 3: 5.5 Million Thriving & The 11,000-Year Rewind",
    "track_file": "tense-suspense-background-music-320439.mp3",
    "mood": "suspense",
    "transition": "hard_cut",
    "start_s": 34.0,
    "end_s": 50.1
  },
  {
    "act_id": 4,
    "title": "Act 1: Holocene Deglaciation & Early Settlements",
    "track_file": "ambient_history_01.mp3",
    "mood": "historical_epic",
    "transition": "crossfade",
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
