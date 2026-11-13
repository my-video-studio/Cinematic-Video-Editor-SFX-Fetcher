import { staticFile } from 'remotion';
import storyboardRaw from '../../public/assets/aistudio/storyboard_part3_978c475c.json';
import type { AssetManifestEntry, StoryboardData } from '../types/storyboard';

const storyboard = storyboardRaw as unknown as StoryboardData;

const ASSET_MAP = new Map<string, AssetManifestEntry>();
for (const entry of storyboard.assetManifest) {
  ASSET_MAP.set(entry.assetId, entry);
}

/**
 * Assets verified to exist on disk in public/assets/ as solid-#FFFFFF cutouts
 * requiring SVG white-to-alpha luma keying.
 */
const WHITE_BG_CUTOUT_FILES = new Set<string>([
  'cutout_fg_sandbags_sentries.png',
  'cutout_fg_doorframe_lamp_silhouette.png',
  'cutout_fg_pine_bough_barbed_wire_silhouette.png',
  'cutout_german_lt_henk_waistup.png',
]);

/**
 * Unique verified historical archival plates mapped 1-to-1 for manifest entries
 * without separate AI plates, ensuring zero duplicate image reuse across scenes.
 */
const VERIFIED_FALLBACK_FILES: Record<string, string> = {
  bg_bastogne_outskirts_winter_dawn: 'real_101st_bastogne_road_dec19.jpg',
  bg_typewriter_desk_candlelit: 'real_wwii_dispatch_typewriter_1944.jpg',
  bg_us_outpost_foxhole_line_snow: 'real_dug_in_snow_emplacement_belgium.jpg',
  bg_snowy_treeline_enemy_unseen_dusk: 'real_krinkelt_snow_treeline_1944.jpg',
  cutout_german_volksgrenadier_infantry_waistup: 'real_german_ardennes_infantry_1944.jpg',
  cutout_us_staff_officer_conard_waistup: 'real_mcauliffe_kinnard_bastogne.jpg',
  cutout_us_staff_officer_moore_waistup: 'real_bastogne_infantrymen_nara_1944.jpg',
  bg_cellar_sleeping_quarters_dawn: 'real_stavelot_outpost_dec1944.jpg',
  bg_operations_room_map_table_dim: 'real_ardennes_generals_map_1945.jpg',
  bg_desk_pencil_blank_paper_lamp: 'real_bastogne_regroup_dec1944.jpg',
  bg_bastogne_night_bombing_glow: 'real_bastogne_dispensary_ruins_dec1944.jpg',
  bg_christmas_morning_west_perimeter_dawn: 'real_101st_christmas_1944_bastogne.jpg',
  bg_pocket_southern_edge_road_dusk: 'real_bastogne_corridor_snow_field.jpg',
  cutout_us_sergeant_typist_waistup: 'real_us_sgt_typewriter_1944.jpg',
  cutout_us_colonel_harper_waistup: 'real_belgium_forest_soldier_nara_1944.jpg',
};

export function getAssetEntry(assetId: string): AssetManifestEntry | undefined {
  return ASSET_MAP.get(assetId);
}

export function resolveActualFileName(assetId: string): string {
  if (VERIFIED_FALLBACK_FILES[assetId]) {
    return VERIFIED_FALLBACK_FILES[assetId];
  }
  const entry = ASSET_MAP.get(assetId);
  if (!entry) {
    return `${assetId}.png`;
  }
  return entry.fileName;
}

export function resolveAssetStaticPath(assetId: string): string {
  const fileName = resolveActualFileName(assetId);
  // Always relative to public/ with NO leading slash for Remotion CLI compatibility
  return staticFile(`assets/${fileName}`);
}

export function resolveVoiceoverStaticPath(): string {
  const path =
    storyboard.projectMeta.voiceoverAudioPath ||
    'assets/aistudio/voiceover3_trimmed_52bf49ee.wav';
  return staticFile(path.replace(/^\/+/, ''));
}

export function hasWhiteBackgroundCutout(assetId: string): boolean {
  const fileName = resolveActualFileName(assetId);
  return WHITE_BG_CUTOUT_FILES.has(fileName);
}

export function isCutoutAsset(assetId: string): boolean {
  if (hasWhiteBackgroundCutout(assetId)) return true;
  const entry = ASSET_MAP.get(assetId);
  if (!entry) return false;
  return (
    entry.requiresBackgroundRemoval ||
    entry.assetType === 'cutout_png' ||
    entry.assetType === 'alpha_frame_portal_png'
  );
}
