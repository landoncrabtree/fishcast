import type { Condition, Recommendation, DerivedConditions, WeatherData, AppSettings, MaxDepth } from './types';
import { lures } from './lures';
import { colors } from './colors';
import { retrieves } from './retrieves-depths';
import { depths } from './retrieves-depths';

// Depth zones available for each max depth setting
const allowedDepthZones: Record<MaxDepth, string[]> = {
  Pond: ['surface', 'shallow'],
  Lake: ['surface', 'shallow', 'mid-depth'],
  Reservoir: ['surface', 'shallow', 'mid-depth', 'deep'],
};

interface ScoredItem {
  id: string;
  name: string;
  points: number;
  reasons: string[];
}

function scoreAll<T extends { id: string; name: string; score: (c: DerivedConditions, w: WeatherData) => { points: number; reasons: string[] } }>(
  items: T[],
  c: DerivedConditions,
  w: WeatherData,
): ScoredItem[] {
  return items
    .map((item) => {
      const { points, reasons } = item.score(c, w);
      return { id: item.id, name: item.name, points, reasons: reasons.filter((r) => !r.startsWith('-') || points > 0 ? true : true) };
    })
    .sort((a, b) => b.points - a.points);
}

// Compatibility matrix: some lure+color/retrieve/depth combos don't make sense
// Rather than enumerate all bad combos, we define affinities
const lureRetrieveAffinity: Record<string, string[]> = {
  'spinnerbait': ['slow-roll', 'steady-medium', 'fast-burn'],
  'chatterbait': ['steady-medium', 'fast-burn', 'slow-roll'],
  'squarebill-crankbait': ['steady-medium', 'fast-burn'],
  'deep-crankbait': ['steady-medium'],
  'lipless-crankbait': ['yo-yo', 'steady-medium', 'fast-burn'],
  'jerkbait': ['twitch-pause'],
  'topwater-buzzbait': ['steady-medium', 'fast-burn'],
  'topwater-popper': ['pop-pause'],
  'topwater-walking': ['walk-the-dog'],
  'hollow-body-frog': ['walk-the-dog', 'steady-medium'],
  'texas-rig': ['bottom-drag', 'deadstick', 'slow-roll'],
  'carolina-rig': ['bottom-drag', 'slow-roll'],
  'wacky-rig': ['deadstick'],
  'ned-rig': ['bottom-drag', 'deadstick'],
  'drop-shot': ['vertical-jig', 'deadstick'],
  'shaky-head': ['bottom-drag', 'deadstick'],
  'flipping-jig': ['bottom-drag', 'deadstick'],
  'football-jig': ['bottom-drag'],
  'finesse-jig': ['bottom-drag', 'deadstick', 'slow-roll'],
  'blade-bait': ['vertical-jig', 'yo-yo'],
  'swimbait': ['steady-medium', 'slow-roll'],
  'creature-bait': ['bottom-drag', 'deadstick'],
  'weightless-senko': ['deadstick', 'slow-roll'],
  'neko-rig': ['bottom-drag', 'deadstick'],
  'inline-spinner': ['steady-medium', 'slow-roll', 'fast-burn'],
  'whopper-plopper': ['steady-medium', 'slow-roll'],
  'fluke': ['twitch-pause', 'deadstick', 'steady-medium'],
  'swim-jig': ['swimming', 'steady-medium', 'slow-roll'],
  'medium-crankbait': ['steady-medium', 'fast-burn'],
  'underspin': ['swimming', 'steady-medium', 'slow-roll'],
};

const lureDepthAffinity: Record<string, string[]> = {
  'spinnerbait': ['shallow', 'mid-depth'],
  'chatterbait': ['shallow', 'mid-depth'],
  'squarebill-crankbait': ['shallow', 'mid-depth'],
  'deep-crankbait': ['deep', 'mid-depth'],
  'lipless-crankbait': ['shallow', 'mid-depth'],
  'jerkbait': ['mid-depth', 'shallow'],
  'topwater-buzzbait': ['surface'],
  'topwater-popper': ['surface'],
  'topwater-walking': ['surface'],
  'hollow-body-frog': ['surface'],
  'texas-rig': ['shallow', 'mid-depth', 'deep'],
  'carolina-rig': ['mid-depth', 'deep'],
  'wacky-rig': ['shallow', 'mid-depth'],
  'ned-rig': ['shallow', 'mid-depth'],
  'drop-shot': ['mid-depth', 'deep'],
  'shaky-head': ['mid-depth', 'deep'],
  'flipping-jig': ['shallow', 'mid-depth'],
  'football-jig': ['deep'],
  'finesse-jig': ['deep', 'mid-depth'],
  'blade-bait': ['deep'],
  'swimbait': ['mid-depth', 'shallow', 'deep'],
  'creature-bait': ['shallow', 'mid-depth'],
  'weightless-senko': ['shallow', 'mid-depth'],
  'neko-rig': ['shallow', 'mid-depth', 'deep'],
  'inline-spinner': ['shallow', 'mid-depth'],
  'whopper-plopper': ['surface'],
  'fluke': ['surface', 'shallow', 'mid-depth'],
  'swim-jig': ['shallow', 'mid-depth'],
  'medium-crankbait': ['mid-depth', 'shallow'],
  'underspin': ['mid-depth', 'shallow', 'deep'],
};

function generateTitle(lure: string, season: string): string {
  // Clean season name
  const seasonClean = season.replace('-', ' ');
  // Extract lure short name
  const lureShort = lure.split('(')[0].split('/')[0].trim();
  return `${seasonClean} ${lureShort}`;
}

export function getRecommendations(condition: Condition, settings?: AppSettings, maxResults: number = 5): Recommendation[] {
  const { derived: c, weather: w } = condition;
  const maxDepth = settings?.maxDepth ?? 'Reservoir';
  const allowed = allowedDepthZones[maxDepth];

  const scoredLures = scoreAll(lures, c, w);
  const scoredColors = scoreAll(colors, c, w);
  const scoredRetrieves = scoreAll(retrieves, c, w);
  const scoredDepths = scoreAll(depths, c, w).filter((d) => allowed.includes(d.id));

  // Lookup for retrieve descriptions
  const retrieveDescriptions = Object.fromEntries(retrieves.map((r) => [r.id, r.description]));

  // Generate candidate combinations from top lures
  const candidates: Recommendation[] = [];
  const seen = new Set<string>();

  // Take top 8 lures and find best compatible color/retrieve/depth for each
  for (const lure of scoredLures.slice(0, 10)) {
    if (lure.points <= 0) continue;

    // Find best compatible retrieve
    const compatRetrieves = lureRetrieveAffinity[lure.id] ?? [];
    const bestRetrieve = scoredRetrieves.find((r) => compatRetrieves.includes(r.id)) ?? scoredRetrieves[0];

    // Find best compatible depth (filtered to allowed zones)
    const compatDepths = lureDepthAffinity[lure.id] ?? [];
    const compatAllowed = compatDepths.filter((d) => allowed.includes(d));
    const bestDepth = scoredDepths.find((d) => compatAllowed.includes(d.id))
      ?? scoredDepths[0];

    // Skip lures with no usable depth zone (all affinities excluded and no fallback)
    if (!bestDepth) continue;

    // Best color (all colors work with all lures)
    const bestColor = scoredColors[0];

    // Also try second-best color for variety
    const altColor = scoredColors[1];

    const combos = [
      { color: bestColor, retrieve: bestRetrieve, depth: bestDepth },
    ];
    // Add variety with alt color if significantly scored
    if (altColor && altColor.points > 0 && altColor.id !== bestColor.id) {
      combos.push({ color: altColor, retrieve: bestRetrieve, depth: bestDepth });
    }

    for (const combo of combos) {
      const comboKey = `${lure.id}-${combo.color.id}`;
      if (seen.has(comboKey)) continue;
      seen.add(comboKey);

      const totalPoints = lure.points + combo.color.points + combo.retrieve.points + combo.depth.points;

      // Build reasoning from the top reasons
      const topReasons = [
        ...lure.reasons.slice(0, 2),
        ...combo.color.reasons.slice(0, 1),
        ...combo.retrieve.reasons.slice(0, 1),
        ...combo.depth.reasons.slice(0, 1),
      ].map((r) => r.replace(/^[+-]\d+\s*/, '')).join('. ') + '.';

      candidates.push({
        id: comboKey,
        title: generateTitle(lure.name, c.seasonPhase),
        lureType: lure.name,
        color: combo.color.name,
        retrieve: combo.retrieve.name,
        retrieveDescription: retrieveDescriptions[combo.retrieve.id] ?? '',
        depth: combo.depth.name,
        totalPoints,
        confidence: 0, // normalized below
        reasoning: topReasons,
        breakdown: {
          lure: { name: lure.name, points: lure.points, reasons: lure.reasons },
          color: { name: combo.color.name, points: combo.color.points, reasons: combo.color.reasons },
          retrieve: { name: combo.retrieve.name, points: combo.retrieve.points, reasons: combo.retrieve.reasons },
          depth: { name: combo.depth.name, points: combo.depth.points, reasons: combo.depth.reasons },
        },
      });
    }
  }

  // Sort by total points, take top N
  candidates.sort((a, b) => b.totalPoints - a.totalPoints);
  const top = candidates.slice(0, maxResults);

  // Normalize confidence: best = 100, rest proportional
  if (top.length > 0) {
    const maxPts = top[0].totalPoints;
    for (const rec of top) {
      rec.confidence = maxPts > 0 ? Math.round((rec.totalPoints / maxPts) * 100) : 0;
    }
  }

  return top;
}
