# ROLE & ARCHITECTURE

You are a Principal React, Remotion, and SVG Animation Engineer specializing in cinematic historical military documentary production.
Build a complete, production-ready 1080p 30fps documentary video engine in Remotion rendering the **War-Friendly Continuous Multiplane Composite Hook (`STAGE_0_WAR_COMPOSITE_MASTER`)** alongside Visual Stages 1 through 4 (`STAGE_1_FULL_BLEED_VINTAGE`, `STAGE_2_ARCHIVAL_BOARD`, `STAGE_3_CANVAS_MONTAGE`, `STAGE_4_PARALLAX_CUTOUT`), active cinematic visual aliveness, unbroken multi-directional camera momentum, persistent 3D world object permanence, and automatic white-background cutout resolution.

---

### 1. MULTIMODAL ASSET INSPECTION, CUTOUT ALPHA EXTRACTION & REAL ARCHIVAL VERIFICATION
As the builder AI, you can inspect all uploaded archival images, AI cutouts, maps, and voiceover audio. Visually analyze each image and its `assetManifest` entry in `storyboard.json` before structuring its scene component to decide the appropriate visual treatment:

1. **Real Archival Download & Visual Verification Protocol**:
   - When downloading `real_archival` assets from Wikipedia / Wikimedia Commons API:
     - Always send a descriptive `User-Agent` header in all HTTP requests to prevent 403 Forbidden blocks.
     - Query the exact `wikipediaPageTitle` image list or Wikimedia Commons search API, filtering out SVG icons, flags, maps with modern text, or low-resolution thumbnails.
   - **Mandatory Visual Inspection**: After downloading archival images to `public/assets/`, you MUST inspect the downloaded images using `view_file` to verify they are historically accurate and visually relevant to the scene. If any downloaded image is irrelevant, anachronistic, or a placeholder, immediately re-query and replace it.

2. **Cutout PNG & Hollow-Center Portal Frame Handling (`requiresBackgroundRemoval: true`)**:
   - Inspect every asset in `storyboard.json` where `requiresBackgroundRemoval: true`, `assetType: "cutout_png"`, or `assetType: "alpha_frame_portal_png"`.
   - Build a reusable `<CutoutImg />` wrapper component in `src/components/common/CutoutImg.tsx` around Remotion's `<Img />`:
     - If an uploaded AI-generated cutout or hollow portal frame (such as `portal_gold_museum_frame` or `portal_stone_window_wall`) still has a solid pure white (`#FFFFFF`) background instead of an alpha channel, automatically apply a crisp inline SVG `<filter id="white-to-alpha">` (`<feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  -4 -4 -4 11.5 0" />`) or canvas alpha threshold so `#FFFFFF` pixels become 100% transparent while preserving crisp subject silhouettes and inner portal openings.
     - When `colorTreatment === "bw_halftone_cutout"`, apply `filter: "grayscale(1) contrast(1.45) brightness(1.04)"` with a subtle drop shadow (`drop-shadow(0 14px 24px rgba(0,0,0,0.28))`).

3. **Winter, War & Ruin Scenes (Weather Particle Pass)**:
   - When an image or scene specifies `weatherPass` (`snow`, `fog_mist`, `embers`, `dust`), mount `<WeatherParticleCanvas type="snow" | "embers" | "dust" | "fog_mist" />` over the scene.

4. **Maps & Cartography (Tactical Map Layer)**:
   - When an image is a historical map, tactical chart, or territorial division, treat it as `<StageTacticalMap />` with animated SVG route arrows and concentric radar pulses.

5. **Portraits & Archival Documents (Board & Inspection Drift)**:
   - When an image is a formal historical portrait or scanned document (`STAGE_2_ARCHIVAL_BOARD`), stage it using `<StageArchivalBoard />` with an uncropped `4:3` or `1:1` white photo mount border (`16px solid #f6f4ee`), realistic drop-shadow, and a slow word-triggered `inspectionZoom`.

6. **General Still Photos (Continuous Cinematic Drift)**:
   - Never leave any still 2D photo motionless for more than 15 frames. Apply continuous S-curve easing (`scale: 1.00 -> 1.04`, subtle horizontal tracking).

#### 1.1 THE "3-LAYER ATMOSPHERIC GLUE", OPTICAL DEPTH & UNIFIED COLOR GRADE
To eliminate the "cardboard cutout sticker" look and unify separate AI-generated plates, cutouts, and archival relics into one cohesive photograph:

1. **Optical Depth-of-Field Split & Differential Parallax**:
   - **Background Environment Plate (`zIndex: 1`)**: Mount the 16:9 environment plate with slow continuous drift (`scale: 1.00 -> 1.03`) and apply optical depth-of-field lens blur: `filter: 'blur(2.5px) contrast(1.06) brightness(0.96)'`.
   - **Midground Hero Cutout (`zIndex: 3`)**: Ground the waist-up hero cutout to `bottom: 0` in 100% crisp focus with faster forward camera momentum (`scale: 1.00 -> 1.10`) to create authentic telephoto separation.
2. **The Atmospheric Weather Sandwich (Depth-Separated Particles)**:
   - **FORBIDDEN**: Never render weather or fog as a single flat overlay sitting on top of the entire composition.
   - **MANDATORY**: Split atmospheric passes across Z-planes:
     - *Back Layer (`zIndex: 2`)*: Mount `<WeatherParticleCanvas type="fog_mist" intensity={0.8} />` *behind* the hero cutout and *in front* of the background forest plate to create physical air depth.
     - *Front Layer (`zIndex: 7`)*: Mount `<WeatherParticleCanvas type="snow" intensity={1.4} windSpeed={-3.5} />` in the extreme foreground directly over the characters and sentries with `pointerEvents: 'none'`.
3. **Universal Cold-Grade Filter Pass**:
   - Wrap the entire master camera container with a global color matrix / CSS filter to ensure cutouts and backgrounds match the exact same sub-zero color temperature:
     ```tsx
     filter: 'contrast(1.08) brightness(0.94) saturate(0.82) sepia(0.06) hue-rotate(-12deg)'
     ```
   - Apply a subtle edge vignette: `boxShadow: 'inset 0 0 120px rgba(0, 10, 20, 0.65)'`.
4. **Contact Shadow & Occlusion Edge Feathering**:
   - Any cutout anchored to the bottom edge or resting on terrain must have an inline linear gradient mask applied to its bottom 10% (`maskImage: 'linear-gradient(to top, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 12%)'`) so the cut edge dissolves naturally into the snowdrift rather than showing a razor-sharp cut line.

---

### 2. CRITICAL ENGINE & CAMERA MOMENTUM RULES

1. **Strict 16:9 Canvas Fit (`1920x1080` at 30 fps)**:
   - Root composition is locked to `1920x1080`. Wrap all stages in `overflow: "hidden"`.
2. **Momentum Hand-Off (Zero Dead Stops Across Scenes & Beats)**:
   - **FORBIDDEN**: The camera must NEVER come to an abrupt 0-velocity stop or reset its scale to `1.00` between sentences or beats.
   - **REQUIRED**: If Beat $N$ finishes with a forward drift (`scale: 1.10 -> 1.04`), Beat $N+1$ begins at `scale: 1.04` and continues drifting smoothly. When pulling back or panning, interpolate velocities using continuous cubic Bézier easing (`Easing.bezier(0.25, 0.1, 0.25, 1.0)`).
3. **The Persistent 3D World Object Permanence Law**:
   - **FORBIDDEN**: Never unmount previously revealed layers when the camera sweeps to a new focal element.
   - **REQUIRED**: When pulling back from the live battlefield to the command table (`LIVING_SCENE_TO_DESK_PULLBACK`), the live combat scene stays mounted and active inside the aged photograph frame resting on the table. When panning past sentries, they slide off-screen through realistic lens bokeh.
4. **Staggered Layer Entry (Word-Level Synchronization)**:
   - In each composite beat, layers mount **5 frames before their trigger frame (`mountFrame = triggerFrame - 5`)**, smoothly fading in (`opacity: 0 -> 1`) and settling in scale (`1.06 -> 1.00`) so they are locked and sharp on the exact spoken syllable.

---

### 3. STAGE 0: WAR MULTIPLANE COMPOSITE MASTER (`Stage0ContinuousCanvas.tsx`)

Build an autonomous 16:9 multiplane composite engine executing the full 52.76-second Opening Hook without cuts:

#### A. Master Camera Trajectory Engine:
- Animate a single master camera wrapper: `transform: scale(${camScale}) translate3d(${camPanX}px, ${camPanY}px, 0px) rotate(${camRotate}deg)`.
- Interpolate coordinates continuously across the 12 transcript beats:
  1. *Beats 1–3 (0–16s | F0–F480)*: Forward Steadicam glide past sandbags and envoys (`scale: 1.18 -> 0.96 -> 1.14`, `panX: 0 -> 30px`, `panY: 0 -> -25px -> 10px`).
  2. *Beat 4 (16–20s | F480–F580)*: Living scene pulls back in Z-space, outer borders gaining a 12px `#f6f4ee` photo frame and shadow, settling flat onto the oak desk (`scale: 1.14 -> 0.42`, `rotate: 0 -> -3.5°`).
  3. *Beats 5–6 (20–30s | F625–F917)*: Lateral glide across desk to the 1:25,000 tactical map (`panX: -80 -> -420px`), followed by a dive into the Bastogne perimeter with camera shake (`amplitude: 3.5px`).
  4. *Beats 7–10 (30–45s | F917–F1366)*: Vertical crane tilt up to General McAuliffe's waist-up portrait (`panY: -50 -> +120px`), followed by a macro push toward the document in his hands.
  5. *Beats 11–12 (45–52.76s | F1366–F1583)*: Descent down to the dispatch pad as the `"NUTS!"` telegram slams down with 6px camera shake, followed by an exponential map dive (`scale: 1.40 -> 2.40`) flashing into white light at France.

#### B. Unified Layer Stacking Order inside the 16:9 Master Viewport:
- **`zIndex: 0`**: Command cellar oak desk plate (`bg_command_desk_surface.png`) with flickering candle lighting and brass shell casings.
- **`zIndex: 1`**: Deep Ardennes snowy road plate (`bg_snow_ardennes_road.png`, optical blur `2.5px`, slow drift `1.00 -> 1.03`).
- **`zIndex: 2`**: Back atmospheric ground fog pass (`<WeatherParticleCanvas type="fog_mist" intensity={0.8} />`).
- **`zIndex: 3`**: Waist-up German envoys cutout (`cutout_german_envoys_waistup.png`) anchored to `bottom: 0` with bottom-edge gradient feathering.
- **`zIndex: 4`**: Authentic archival documents & tactical Bastogne relief map (`real_german_surrender_note.jpg`, `real_map_bastogne_tactical.jpg`) resting on the desk with realistic drop shadows (`boxShadow: '0 20px 50px rgba(0,0,0,0.85)'`), red grease-pencil arcs, and pulsing Flak reticles.
- **`zIndex: 5`**: Foreground American paratrooper helmets and sandbags (`cutout_fg_sandbags_sentries.png`, soft aperture blur).
- **`zIndex: 6`**: General McAuliffe waist-up portrait cutout (`real_mcauliffe_portrait.png`).
- **`zIndex: 7`**: Foreground high-speed blizzard snow pass (`<WeatherParticleCanvas type="snow" intensity={1.4} windSpeed={-3.5} />`).
- **`zIndex: 8`**: `"NUTS!"` archival telegram (`real_nuts_telegram.jpg`) and red rubber ultimatum stamp (`2-HOUR ULTIMATUM`).

---

### 4. PHASE B STAGE IMPLEMENTATIONS (`STAGE_1` THROUGH `STAGE_4`)

1. **`<StageFullBleedVintage />` (`STAGE_1_FULL_BLEED_VINTAGE`)**:
   - Renders full-bleed `16:9` archival image with authentic vintage grade: `filter: "contrast(1.08) sepia(0.20) brightness(0.96)"`, subtle corner vignette, and continuous S-curve pan (`1.00 -> 1.04`).

2. **`<StageArchivalBoard />` (`STAGE_2_ARCHIVAL_BOARD`)**:
   - Centers uncropped photo in a `4:3` or `1:1` mount (`16px solid #f6f4ee`) over a dark wood/slate surface with realistic shadow, archival citation, and word-triggered `inspectionZoom` (`scale: 1.12`).

3. **`<StageCanvasMontage />` (`STAGE_3_CANVAS_MONTAGE`)**:
   - Mounts 2 to 4 photos (`4:3`, `3:4`, or `1:1`) sequentially on a dark textured background (`#141414`) with damped spring pop-ins on designated trigger words (`scene.montage.items`, keeping all dropped photos visible on the board).

4. **`<Stage4ParallaxCutout />` (`STAGE_4_PARALLAX_CUTOUT` — 4 Sub-Variants Supported with Pass-By Object Permanence)**:
   Read `scene.parallaxVariant` (defaults to `"STANDARD_2_5D_PARALLAX"`) and render the matching multi-plane 2.5D/3D rig where **every element in the room remains permanently mounted across all sub-nodes**:
   - **Variant A (`"STANDARD_2_5D_PARALLAX"`)**:
     - Background plate (`zIndex: 1`) drifting forward (`scale: 1.00 -> 1.05`).
     - Hero Cutout (`zIndex: 3`) anchored to `bottom: 0`, scaling faster (`scale: 1.02 -> 1.12`) with drop-shadow.
     - Foreground flanking silhouettes (`zIndex: 4`) scaling at `1.05 -> 1.22` with soft edge blur.
     - Word-triggered `dynamicOverlay` (rubber stamp or metric) on `triggerFrame`, and forward push-through transition past foreground cutouts (`scale: 1.12 -> 1.80`, `filter: blur()`).
   - **Variant B (`"MULTI_NODE_3D_AUDITORIUM_RIG"` — Chained 10-Null Persistent 3D Room Rig)**:
     - Mount the entire auditorium/briefing world (`width: 3840px, height: 2160px`) inside a single 3D camera transform wrapper (`translate3d(camX, camY, camZ) rotateZ(camRot)`) so **nothing ever unmounts when the camera whips between subNodes**:
       1. *Optional Nested Wall Screen Pullback*: If `nestedScreenBgAssetId` is provided, start zoomed `2.85x` inside the wall monitor showing the nested 2.5D scene (`16:9` court/sky BG + blurred `9:16` foreground occlusion prop + `1:1` seated subject cutout), then pull back to `1.0x` over 28 frames to reveal the monitor mounted on the back wall of the `16:9` auditorium (`bgAssetId`), while the `1:1` podium speaker cutout (`heroCutoutAssetId`) and blurred `16:9` foreground press photographers silhouette (`foregroundFlankAssetId`) rise into the foreground—and the wall screen **continues playing live behind the speaker's head**!
       2. *Podium Push-In*: Push in on `heroCutoutAssetId` (`scale: 1.00 -> 1.22`, `rotateZ: -2.5deg`).
       3. *Lateral Pass-By Whip-Left to Floating 3D Dossier (`"floating_3d_prop_whip_left"`)*: On `subNode.triggerFrame`, whip camera `panX` left (`-680px` using snappy cubic-bezier easing) to center a floating `4:3` contract/evidence folder cutout (`propCutoutAssetId`) backed by a vertical cyan/white glowing light streak. Because the podium speaker stays mounted at center, the speaker's right shoulder and arm **stay visible on the right edge of the viewport** (`keepMainHeroVisibleOnFrameEdge: true`)!
       4. *Lateral Pass-By Whip-Right & Tilt-Up to Brush-Masked Vignette (`"brush_vignette_whip_right_up"`)*: Whip camera right (`+640px`) and up (`-220px`) right past the podium speaker and foreground press cameras to focus on a floating `16:9` action shot (`vignetteAssetId`) masked inside a soft organic rough-brush SVG `<mask>` (`maskType: "rough_brush_alpha"`).
   - **Variant C (`"MIRROR_PORTAL_HUD_ROOM"`)**:
     - Layer 1 (`zIndex: 1`): `16:9` dark teal room background plate (`bgAssetId`).
     - Layer 2 (`zIndex: 2`): `1:1` or `3:4` character reflection cutout (`reflectionCutoutAssetId`) positioned inside the mirror opening, with an animated white/cyan neon edge-glow flash on key trigger frames.
     - Layer 3 (`zIndex: 3`): `3:4` hollow-center mirror frame portal PNG (`mirrorFrameAssetId`).
     - Layer 4 (`zIndex: 4`): `1:1` dark over-the-shoulder viewer silhouette cutout (`foregroundFlankAssetId`) anchored to `bottom: 0, right: '8%'`, revealed as the camera pulls back from `scale: 1.45 -> 1.00`.
     - Support lateral whip-pans to `hudOverlays[]`: a glowing `1:1` 3-person neon hologram SVG/PNG icon (`type: "neon_svg_hologram"`) on the right wall and a red digital clock/score callout box (`type: "digital_clock_badge"`, e.g. `"18:16"`) beside the mirror.
   - **Variant D (`"BRUSH_TITLE_TO_NEWSPAPER_CUTOUT"`)**:
     - Frames `0 -> 45`: Black void canvas with an animated rough crimson (`#e11d1d`) SVG brushstroke banner wiping left-to-right behind bold white condensed text (`introBrushBanner.text`, e.g., `"the real problem started"`).
     - Frames `45 -> 95`: 3D unfold transition (`rotateX(-75deg) -> rotateX(0deg)`, `perspective: 1200px`) revealing the `16:9` vintage newspaper background plate (`bgAssetId`).
     - Frames `95 -> end`: The newspaper stays mounted in the background (softly blurring `blur(0px -> 14px)` as a crimson brush highlight bar sweeps across `newspaperHeadlineHighlight`), while the bottom-anchored `1:1` or `3:4` hero portrait cutout (`heroCutoutAssetId`) springs up from `bottom: -400px -> 0px` in crisp focus (`zIndex: 5`).

5. **Cinematic Transitions (Between Backstory Scenes)**:
   Support all 10 full-canvas transitions: `panoramic_push_glide`, `iris_zoom_through`, `diagonal_shutter_wipe`, `tectonic_vertical_rise`, `halation_flash_dissolve`, `archival_pip_over_fullbleed`, `camera_pullback_through_monitor`, `foreground_pillar_whip_wipe`, `window_portal_push_through`, and `barrel_roll_stone_wipe`.

---

### 5. REQUIRED PROJECT STRUCTURE
- `src/Root.tsx` (Registers 1920x1080 composition `HistoricalDocumentary`)
- `src/DocumentaryMain.tsx` (Timeline orchestrator mounting master voiceover and mapping scenes sequentially inside `<Series>`)
- `src/components/stages/Stage0ContinuousCanvas.tsx` (Stage 0 16:9 War Multiplane Composite Master rig)
- `src/components/stages/StageFullBleedVintage.tsx` (Stage 1 vintage full-bleed renderer)
- `src/components/stages/StageArchivalBoard.tsx` (Stage 2 uncropped archival photo mounted on dark slate/wood desk board)
- `src/components/stages/StageCanvasMontage.tsx` (Stage 3 multi-photo canvas with spring pop-ins)
- `src/components/stages/Stage4ParallaxCutout.tsx` (Stage 4 2.5D parallax & persistent 10-Null 3D room/mirror/newspaper variants)
- `src/components/stages/StageTacticalMap.tsx` (Cartographic map renderer with animated SVG arrows, radar rings, and badges)
- `src/components/common/CutoutImg.tsx` (Remotion `<Img />` wrapper with SVG white-to-alpha luma key & B&W halftone filter support)
- `src/components/particles/WeatherParticleCanvas.tsx` (Procedural canvas snow, ash embers, fog mist, and ambient dust engine)
- `src/components/common/SubtitleOverlay.tsx` (Sentence-level documentary subtitles)
- `src/utils/assetResolver.ts` (Dynamic hash/filename mismatch resolver)
- `src/utils/colorGrading.ts` (Vintage sepia, archival cold, B&W halftone, and film grain LUT filters)

---

### 6. LOCAL REMOTION CLI PORTABILITY, VOICEOVER-ONLY RENDER TREE & INLINE-STYLE ENFORCEMENT

The generated project must be 100% ready to download and drop directly into a multi-project Remotion workspace where the user launches Remotion Studio or renders via CLI from their parent workspace root:
`npx remotion studio "<project-folder>/src/Root.tsx" --public-dir="<project-folder>/public"`

To guarantee zero 404 render errors, zero layout/effect corruption under Remotion's Webpack bundler, and clean audio separation, enforce all rules below:

#### 6.1 Remotion CLI Studio Portability Lock:
- Always register `<Composition id="HistoricalDocumentary" ... />` inside `src/Root.tsx` and call `registerRoot(RemotionRoot)` in `src/index.ts`.
- Every asset path passed to `staticFile(...)` MUST be a relative path inside `public/` with **NO leading slash** (e.g., `staticFile("assets/voiceover.wav")` or `staticFile("assets/real_german_surrender_note.jpg")`, never `staticFile("/assets/...")`), ensuring 100% compatibility when launched from a parent workspace via `npx remotion studio "<project>/src/Root.tsx" --public-dir="<project>/public"`.

#### 6.2 Voiceover-Only Remotion Composition (No Synthetic SFX/Music in Code):
- Inside the Remotion composition tree (`src/Root.tsx`, `src/DocumentaryMain.tsx`, and all `src/components/stages/*.tsx`), mount **ONLY** the master voiceover `<Audio src={staticFile(storyboardData.projectMeta.voiceoverAudioPath)} />`.
- **NEVER** generate synthetic Web Audio SFX/music engines or mount `<Audio />` tags for SFX or background music inside the React/Remotion codebase.

#### 6.3 ZERO Tailwind Classes Inside Remotion Components (100% Explicit Inline `style={{ ... }}` & `<Img />` / `<CutoutImg />`):
- **CRITICAL BUNDLER RULE**: AI Studio previews with Vite (`@tailwindcss/vite`), whereas `npx remotion studio` and `npx remotion render` bundle `src/Root.tsx` with Remotion's default **Webpack** bundler, which does NOT process Tailwind v4 `@import "tailwindcss";` utility classes by default.
- Therefore, inside `src/DocumentaryMain.tsx`, `src/components/stages/*.tsx`, `src/components/particles/*.tsx`, and `src/components/common/*.tsx`:
  1. **NEVER rely on Tailwind `className` utilities** (`absolute`, `inset-0`, `h-full`, `w-full`, `object-cover`, `flex`, `items-center`, `justify-center`, etc.) for positioning, sizing, flexbox centering, typography, borders, shadows, or overlays.
  2. **ALWAYS use explicit React inline `style={{ ... }}` objects** (or `<AbsoluteFill style={{ ... }}>` from `'remotion'`) for every single element, container, canvas, subtitle bar, portal frame, and photo card.
  3. **ALWAYS use `<Img />` from `'remotion'`** (or `<CutoutImg />` wrapping `<Img />`, never raw `<img>` tags) with explicit inline `style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}` so Remotion waits for every high-resolution image frame to decode before capturing the video frame.
  4. **Canvas & Particle Overlays (`WeatherParticleCanvas`)** MUST explicitly set `style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%', pointerEvents: 'none' }}` so they never fall back to normal HTML block flow and push stage elements off-screen.

---

## INPUT ASSETS:
- **Voiceover file:** [ATTACH voiceover.mp3 OR INSERT FILENAME]
- **Timestamped Transcript / Storyboard:** [ATTACH storyboard.json OR transcript.json]
- **Archival Images, Portal Frames & Cutout PNGs:** [ATTACH/UPLOAD ALL ASSET IMAGES HERE]

Please inspect all uploaded image assets, verify authentic historical relevance, determine optimal cinematic staging and dynamic animations (enforcing 100% 3D Object Permanence and Pass-By Camera Physics on all continuous stages), read timestamps from the transcript, convert every segment into exact 30 fps frame counts (`seconds * 30`), and generate the complete production-ready code with all components and `<Series>` scenes.