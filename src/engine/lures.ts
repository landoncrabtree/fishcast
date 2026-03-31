import {
  SeasonPhase as S,
  TimeBucket as T,
  WaterClarity as C,
  LightLevel as L,
  PressureTrend as P,
  type LureDefinition,
  type DerivedConditions,
} from './types';

// ── Helpers ──
function inRange(val: number, lo: number, hi: number): boolean {
  return val >= lo && val <= hi;
}

function seasons(c: DerivedConditions, ...s: string[]): boolean {
  return s.includes(c.seasonPhase);
}

function times(c: DerivedConditions, ...t: string[]): boolean {
  return t.includes(c.timeOfDay);
}

// ── LURE DEFINITIONS ──
// Each lure is independently scored against conditions.
// Points reflect how well the lure matches — higher = better fit.

export const lures: LureDefinition[] = [
  {
    id: 'spinnerbait',
    name: 'Spinnerbait',
    category: 'Reaction',
    score: (c, w) => {
      let pts = 0;
      const r: string[] = [];

      // Wind is spinnerbait's best friend
      if (w.windSpeedMph > 10) { pts += 8; r.push('+8 windy conditions (>10mph) create ideal spinnerbait water'); }
      else if (w.windSpeedMph > 5) { pts += 4; r.push('+4 moderate wind helps spinnerbait effectiveness'); }

      // Stained/muddy water — vibration matters
      if (c.clarity === C.Stained) { pts += 6; r.push('+6 stained water — blade flash/vibration helps bass locate lure'); }
      if (c.clarity === C.Muddy) { pts += 8; r.push('+8 muddy water — Colorado blade thump essential for detection'); }

      // Season bonuses
      if (seasons(c, S.PreSpawn)) { pts += 5; r.push('+5 pre-spawn bass aggressively feeding on shallow flats'); }
      if (seasons(c, S.FallTransition)) { pts += 6; r.push('+6 fall bass chasing shad schools — spinnerbait mimics baitfish'); }
      if (seasons(c, S.PostSpawn)) { pts += 4; r.push('+4 post-spawn bass actively feeding to recover'); }

      // Time of day
      if (times(c, T.Morning, T.Evening)) { pts += 3; r.push('+3 low-light periods increase spinnerbait effectiveness'); }

      // Cloud cover
      if (w.cloudCoverPercent > 70) { pts += 3; r.push('+3 overcast skies — bass roam and react to moving baits'); }

      // Pressure
      if (c.pressureTrend === P.Falling) { pts += 3; r.push('+3 falling pressure activates feeding — power baits shine'); }

      // Penalty in dead of winter
      if (seasons(c, S.Winter) && c.waterTempEstimateF < 45) { pts -= 5; r.push('-5 too cold for spinnerbait effectiveness'); }

      return { points: pts, reasons: r };
    },
  },
  {
    id: 'chatterbait',
    name: 'Chatterbait / Vibrating Jig',
    category: 'Reaction',
    score: (c, w) => {
      let pts = 0;
      const r: string[] = [];

      if (c.clarity === C.Stained) { pts += 6; r.push('+6 stained water — vibration helps bass find chatterbait'); }
      if (c.clarity === C.Muddy) { pts += 7; r.push('+7 muddy water — strong vibration essential'); }
      if (seasons(c, S.PreSpawn, S.PostSpawn)) { pts += 5; r.push('+5 transitional seasons — bass keying on reaction baits'); }
      if (seasons(c, S.FallTransition)) { pts += 6; r.push('+6 fall baitfish migration — chatterbait covers water fast'); }
      if (w.windSpeedMph > 8) { pts += 4; r.push('+4 wind makes chatterbait less visible to wary bass'); }
      if (w.cloudCoverPercent > 60) { pts += 3; r.push('+3 overcast — bass more aggressive toward moving baits'); }
      if (inRange(c.waterTempEstimateF, 55, 75)) { pts += 3; r.push('+3 ideal water temp range for chatterbait'); }
      if (c.pressureTrend === P.Falling) { pts += 2; r.push('+2 falling pressure — fish more active'); }

      return { points: pts, reasons: r };
    },
  },
  {
    id: 'squarebill-crankbait',
    name: 'Squarebill Crankbait',
    category: 'Reaction',
    score: (c, w) => {
      let pts = 0;
      const r: string[] = [];

      if (seasons(c, S.FallTransition)) { pts += 7; r.push('+7 fall — bass follow shad into shallow cover, squarebills excel'); }
      if (seasons(c, S.PreSpawn)) { pts += 5; r.push('+5 pre-spawn bass staging near shallow cover'); }
      if (seasons(c, S.PostSpawn)) { pts += 4; r.push('+4 post-spawn bass feeding aggressively in shallows'); }
      if (w.windSpeedMph > 10) { pts += 5; r.push('+5 wind pushes baitfish to banks — deflection bites increase'); }
      if (c.clarity === C.Stained) { pts += 4; r.push('+4 stained water — crankbait vibration triggers reaction'); }
      if (w.cloudCoverPercent > 60) { pts += 3; r.push('+3 cloud cover — bass push shallow and feed'); }
      if (inRange(c.waterTempEstimateF, 55, 80)) { pts += 2; r.push('+2 good water temp for shallow cranking'); }
      if (c.pressureTrend === P.Falling) { pts += 2; r.push('+2 falling pressure increases shallow activity'); }

      return { points: pts, reasons: r };
    },
  },
  {
    id: 'deep-crankbait',
    name: 'Deep Diving Crankbait',
    category: 'Reaction',
    score: (c, w) => {
      let pts = 0;
      const r: string[] = [];

      if (seasons(c, S.Summer)) { pts += 7; r.push('+7 summer — bass hold deep on ledges and points'); }
      if (c.waterTempEstimateF > 75) { pts += 4; r.push('+4 warm water drives bass to deep structure'); }
      if (times(c, T.Morning, T.Midday)) { pts += 3; r.push('+3 best for day fishing deep structure'); }
      if (c.clarity === C.Clear || c.clarity === C.Stained) { pts += 2; r.push('+2 needs some visibility for deflection bites'); }
      if (w.cloudCoverPercent < 50) { pts += 2; r.push('+2 bright sun pushes bass deeper — where deep cranks work'); }

      return { points: pts, reasons: r };
    },
  },
  {
    id: 'lipless-crankbait',
    name: 'Lipless Crankbait',
    category: 'Reaction',
    score: (c, w) => {
      let pts = 0;
      const r: string[] = [];

      if (seasons(c, S.PreSpawn)) { pts += 7; r.push('+7 pre-spawn — rip over emerging grass on shallow flats'); }
      if (seasons(c, S.FallTransition)) { pts += 5; r.push('+5 fall — effective over dying grass beds'); }
      if (inRange(c.waterTempEstimateF, 48, 62)) { pts += 4; r.push('+4 ideal temp range for lipless cranks'); }
      if (w.windSpeedMph > 5) { pts += 3; r.push('+3 wind activates bass on grass flats'); }
      if (c.clarity === C.Stained) { pts += 3; r.push('+3 rattle helps bass locate in stained water'); }

      return { points: pts, reasons: r };
    },
  },
  {
    id: 'jerkbait',
    name: 'Suspending Jerkbait',
    category: 'Reaction',
    score: (c, w) => {
      let pts = 0;
      const r: string[] = [];

      if (seasons(c, S.PreSpawn)) { pts += 6; r.push('+6 pre-spawn — cold bass react to suspending action'); }
      if (seasons(c, S.Winter)) { pts += 5; r.push('+5 winter — long pauses trigger lethargic bass'); }
      if (seasons(c, S.FallTransition)) { pts += 5; r.push('+5 fall — mimics dying shad perfectly'); }
      if (c.clarity === C.Clear) { pts += 5; r.push('+5 clear water — visual strike trigger at its best'); }
      if (c.clarity === C.Stained) { pts += 2; r.push('+2 stained water — still effective with flash'); }
      if (inRange(c.waterTempEstimateF, 42, 58)) { pts += 4; r.push('+4 cold water — suspending jerkbait territory'); }
      if (w.windSpeedMph < 12) { pts += 2; r.push('+2 calmer conditions let bass track the bait'); }

      return { points: pts, reasons: r };
    },
  },
  {
    id: 'topwater-buzzbait',
    name: 'Buzzbait',
    category: 'Topwater',
    score: (c, w) => {
      let pts = 0;
      const r: string[] = [];

      if (times(c, T.Dawn)) { pts += 8; r.push('+8 dawn — prime buzzbait time, explosive strikes'); }
      if (times(c, T.Evening)) { pts += 6; r.push('+6 evening — low light triggers topwater feeding'); }
      if (times(c, T.Night)) { pts += 5; r.push('+5 night — silhouette against sky draws strikes'); }
      if (seasons(c, S.Summer, S.PostSpawn)) { pts += 5; r.push('+5 warm season — bass actively feeding shallow'); }
      if (w.windSpeedMph < 8) { pts += 3; r.push('+3 calm water lets bass track surface disturbance'); }
      if (c.waterTempEstimateF > 65) { pts += 3; r.push('+3 warm water — bass willing to hit surface'); }
      if (c.clarity === C.Stained) { pts += 2; r.push('+2 stained water — sound helps them find it'); }
      if (times(c, T.Midday)) { pts -= 5; r.push('-5 midday sun kills topwater bite'); }

      return { points: pts, reasons: r };
    },
  },
  {
    id: 'topwater-popper',
    name: 'Topwater Popper',
    category: 'Topwater',
    score: (c, w) => {
      let pts = 0;
      const r: string[] = [];

      if (times(c, T.Dawn, T.Evening)) { pts += 7; r.push('+7 low-light — ideal for popper action'); }
      if (seasons(c, S.PostSpawn)) { pts += 6; r.push('+6 post-spawn bass aggressively eating on surface'); }
      if (seasons(c, S.Summer)) { pts += 4; r.push('+4 summer mornings/evenings — surface feeding windows'); }
      if (w.windSpeedMph < 8) { pts += 4; r.push('+4 calm surface — popper creates visible disturbance'); }
      if (c.clarity === C.Clear) { pts += 3; r.push('+3 clear water — bass can see popper from below'); }
      if (c.waterTempEstimateF > 62) { pts += 2; r.push('+2 warm enough for surface strikes'); }
      if (times(c, T.Midday) && c.lightLevel === L.High) { pts -= 4; r.push('-4 bright midday — bass avoid surface'); }

      return { points: pts, reasons: r };
    },
  },
  {
    id: 'topwater-walking',
    name: 'Walking Topwater (Zara Spook)',
    category: 'Topwater',
    score: (c, w) => {
      let pts = 0;
      const r: string[] = [];

      if (times(c, T.Dawn, T.Morning)) { pts += 6; r.push('+6 early morning — walk-the-dog draws feeding bass'); }
      if (times(c, T.Evening)) { pts += 5; r.push('+5 evening feed — bass looking up'); }
      if (seasons(c, S.Summer, S.PostSpawn)) { pts += 5; r.push('+5 warm season — active topwater bite'); }
      if (w.windSpeedMph < 10) { pts += 3; r.push('+3 light wind — walking action stays visible'); }
      if (c.clarity === C.Clear || c.clarity === C.Stained) { pts += 2; r.push('+2 sufficient visibility for surface strike'); }
      if (c.waterTempEstimateF > 65) { pts += 2; r.push('+2 water warm enough for topwater'); }

      return { points: pts, reasons: r };
    },
  },
  {
    id: 'hollow-body-frog',
    name: 'Hollow Body Frog',
    category: 'Topwater',
    score: (c, w) => {
      let pts = 0;
      const r: string[] = [];

      if (seasons(c, S.Summer)) { pts += 7; r.push('+7 summer — matted grass holds fish underneath'); }
      if (seasons(c, S.PostSpawn)) { pts += 4; r.push('+4 post-spawn — bass hiding in shallow vegetation'); }
      if (c.waterTempEstimateF > 70) { pts += 4; r.push('+4 warm water — heavy vegetation growth'); }
      if (times(c, T.Dawn, T.Morning, T.Evening)) { pts += 4; r.push('+4 low light — frog bites peak'); }
      if (w.cloudCoverPercent > 60) { pts += 3; r.push('+3 overcast extends the frog bite window'); }
      if (c.clarity === C.Stained || c.clarity === C.Muddy) { pts += 2; r.push('+2 dirty water — bass ambush from cover'); }
      if (w.humidityPercent > 70) { pts += 1; r.push('+1 high humidity — frogs more active, natural presentation'); }

      return { points: pts, reasons: r };
    },
  },
  {
    id: 'texas-rig',
    name: 'Texas Rig (Plastic Worm/Creature)',
    category: 'Soft Plastic',
    score: (c, w) => {
      let pts = 0;
      const r: string[] = [];

      // Texas rig is the ultimate all-rounder — slight base
      pts += 3; r.push('+3 versatile presentation works in most conditions');

      if (seasons(c, S.Spawn)) { pts += 5; r.push('+5 spawn — drag through beds for defensive strikes'); }
      if (seasons(c, S.Summer)) { pts += 5; r.push('+5 summer — classic deep worm dragging on structure'); }
      if (c.pressureTrend === P.Rising) { pts += 3; r.push('+3 high/rising pressure — slower finesse approach needed'); }
      if (c.isFrontalPassage) { pts += 4; r.push('+4 post-frontal — bass hug cover, pitch directly to them'); }
      if (times(c, T.Midday)) { pts += 3; r.push('+3 midday — bass hold tight to cover'); }
      if (c.clarity === C.Stained) { pts += 2; r.push('+2 stained water — bulky profile detectable'); }

      return { points: pts, reasons: r };
    },
  },
  {
    id: 'carolina-rig',
    name: 'Carolina Rig',
    category: 'Soft Plastic',
    score: (c, w) => {
      let pts = 0;
      const r: string[] = [];

      if (seasons(c, S.Summer)) { pts += 6; r.push('+6 summer — cover deep flats and points efficiently'); }
      if (seasons(c, S.PostSpawn)) { pts += 5; r.push('+5 post-spawn — bass moving to deeper staging areas'); }
      if (c.waterTempEstimateF > 68) { pts += 3; r.push('+3 warm water — bass spread out on structure'); }
      if (times(c, T.Midday)) { pts += 3; r.push('+3 midday — effective at deep structure fishing'); }
      if (c.clarity === C.Clear || c.clarity === C.Stained) { pts += 2; r.push('+2 works well in moderate visibility'); }
      if (w.windSpeedMph > 5) { pts += 1; r.push('+1 light wind positions boat for long casts'); }

      return { points: pts, reasons: r };
    },
  },
  {
    id: 'wacky-rig',
    name: 'Wacky Rig (Senko)',
    category: 'Finesse',
    score: (c, w) => {
      let pts = 0;
      const r: string[] = [];

      if (seasons(c, S.Spawn, S.PostSpawn)) { pts += 6; r.push('+6 spawn/post-spawn — irresistible wobbling fall near beds'); }
      if (c.clarity === C.Clear) { pts += 5; r.push('+5 clear water — natural presentation fools wary bass'); }
      if (c.pressureTrend === P.Rising || c.isStablePeriod) { pts += 4; r.push('+4 high/stable pressure — finesse needed for lockjaw bass'); }
      if (c.isFrontalPassage) { pts += 4; r.push('+4 post-frontal — subtle presentation for shut-down fish'); }
      if (w.windSpeedMph < 10) { pts += 2; r.push('+2 calm water — fall rate natural and visible'); }
      if (inRange(c.waterTempEstimateF, 55, 78)) { pts += 2; r.push('+2 good temp range for wacky effectiveness'); }
      if (times(c, T.Morning, T.Midday)) { pts += 1; r.push('+1 works well around docks and shade'); }

      return { points: pts, reasons: r };
    },
  },
  {
    id: 'ned-rig',
    name: 'Ned Rig',
    category: 'Finesse',
    score: (c, w) => {
      let pts = 0;
      const r: string[] = [];

      if (c.pressureTrend === P.Rising) { pts += 5; r.push('+5 rising pressure — ultimate finesse for tough bites'); }
      if (c.isFrontalPassage) { pts += 5; r.push('+5 post-frontal — gets bit when nothing else does'); }
      if (c.isStablePeriod) { pts += 3; r.push('+3 stable conditions — pressured fish need subtle approach'); }
      if (c.clarity === C.Clear) { pts += 4; r.push('+4 clear water — small profile fools wary bass'); }
      if (seasons(c, S.Spawn)) { pts += 4; r.push('+4 spawn — subtle drag near beds'); }
      if (seasons(c, S.Winter)) { pts += 3; r.push('+3 winter — slow presentation matches bass metabolism'); }
      if (w.windSpeedMph < 8) { pts += 2; r.push('+2 calm — finesse shines in slick conditions'); }

      return { points: pts, reasons: r };
    },
  },
  {
    id: 'drop-shot',
    name: 'Drop Shot',
    category: 'Finesse',
    score: (c, w) => {
      let pts = 0;
      const r: string[] = [];

      if (seasons(c, S.Summer)) { pts += 6; r.push('+6 summer — vertical presentation in deep strike zone'); }
      if (c.clarity === C.Clear) { pts += 5; r.push('+5 clear water — finesse required, natural look'); }
      if (c.waterTempEstimateF > 70) { pts += 3; r.push('+3 warm water — deep suspended bass territory'); }
      if (c.pressureTrend === P.Rising) { pts += 4; r.push('+4 rising/high pressure — finesse wins'); }
      if (times(c, T.Midday)) { pts += 3; r.push('+3 midday — bass suspend deep, drop shot stays in zone'); }
      if (w.windSpeedMph < 10) { pts += 2; r.push('+2 calm — feel light bites better'); }
      if (c.isStablePeriod) { pts += 2; r.push('+2 stable conditions — pressured fish need subtle approach'); }

      return { points: pts, reasons: r };
    },
  },
  {
    id: 'shaky-head',
    name: 'Shaky Head',
    category: 'Finesse',
    score: (c, w) => {
      let pts = 0;
      const r: string[] = [];

      if (c.pressureTrend === P.Rising) { pts += 5; r.push('+5 high pressure — shaky head coaxes reluctant bites'); }
      if (c.clarity === C.Clear) { pts += 4; r.push('+4 clear water — subtle movement triggers strikes'); }
      if (c.isStablePeriod) { pts += 3; r.push('+3 stable period — finesse presentation for educated fish'); }
      if (seasons(c, S.Summer)) { pts += 4; r.push('+4 summer — drag on deep rock/gravel'); }
      if (times(c, T.Midday)) { pts += 3; r.push('+3 midday — bass tight to bottom cover'); }
      if (w.windSpeedMph < 10) { pts += 2; r.push('+2 light wind — better bite detection'); }

      return { points: pts, reasons: r };
    },
  },
  {
    id: 'flipping-jig',
    name: 'Flipping/Pitching Jig',
    category: 'Jig',
    score: (c, w) => {
      let pts = 0;
      const r: string[] = [];

      if (c.isFrontalPassage) { pts += 6; r.push('+6 post-frontal — bass bury in cover, pitch to them'); }
      if (seasons(c, S.Summer)) { pts += 5; r.push('+5 summer — heavy cover fishing at its best'); }
      if (seasons(c, S.FallTransition)) { pts += 4; r.push('+4 fall — bass positioned in laydowns and docks'); }
      if (c.clarity === C.Stained || c.clarity === C.Muddy) { pts += 4; r.push('+4 dirty water — compact profile detectable'); }
      if (times(c, T.Midday)) { pts += 3; r.push('+3 midday — bass hide in shade/cover'); }
      if (c.pressureTrend === P.Rising) { pts += 3; r.push('+3 high pressure — tight cover the only option'); }
      if (w.cloudCoverPercent < 40) { pts += 2; r.push('+2 bright sky pushes bass deep into cover'); }

      return { points: pts, reasons: r };
    },
  },
  {
    id: 'football-jig',
    name: 'Football Jig',
    category: 'Jig',
    score: (c, w) => {
      let pts = 0;
      const r: string[] = [];

      if (seasons(c, S.Summer)) { pts += 7; r.push('+7 summer — drag on deep rocky structure'); }
      if (c.waterTempEstimateF > 70) { pts += 3; r.push('+3 warm water — bass on deep rock/gravel'); }
      if (times(c, T.Morning, T.Midday)) { pts += 3; r.push('+3 daytime deep structure fishing'); }
      if (c.clarity === C.Clear || c.clarity === C.Stained) { pts += 2; r.push('+2 visibility lets bass see crawfish imitation'); }
      if (seasons(c, S.FallTransition)) { pts += 3; r.push('+3 fall — bass grouping on deep points'); }

      return { points: pts, reasons: r };
    },
  },
  {
    id: 'finesse-jig',
    name: 'Finesse Jig',
    category: 'Jig',
    score: (c) => {
      let pts = 0;
      const r: string[] = [];

      if (seasons(c, S.Winter)) { pts += 7; r.push('+7 winter — ultra-slow drag for lethargic bass'); }
      if (c.waterTempEstimateF < 50) { pts += 4; r.push('+4 cold water — small jig matches slow metabolism'); }
      if (c.pressureTrend === P.Rising) { pts += 3; r.push('+3 high pressure — downsize to get bit'); }
      if (c.clarity === C.Clear) { pts += 3; r.push('+3 clear water — subtle profile needed'); }
      if (times(c, T.Midday)) { pts += 2; r.push('+2 midday winter warmth — best window for deep jig'); }

      return { points: pts, reasons: r };
    },
  },
  {
    id: 'blade-bait',
    name: 'Blade Bait',
    category: 'Reaction',
    score: (c) => {
      let pts = 0;
      const r: string[] = [];

      if (seasons(c, S.Winter)) { pts += 8; r.push('+8 winter — tight vibration on fall triggers reaction'); }
      if (c.waterTempEstimateF < 48) { pts += 5; r.push('+5 cold water — blade bait territory'); }
      if (times(c, T.Midday, T.Morning)) { pts += 3; r.push('+3 daytime — vertical jigging over structure'); }
      if (c.clarity === C.Clear || c.clarity === C.Stained) { pts += 2; r.push('+2 flash visible in moderate clarity'); }

      return { points: pts, reasons: r };
    },
  },
  {
    id: 'swimbait',
    name: 'Paddle Tail Swimbait',
    category: 'Soft Plastic',
    score: (c, w) => {
      let pts = 0;
      const r: string[] = [];

      if (seasons(c, S.PostSpawn, S.Summer)) { pts += 5; r.push('+5 warm season — mimics baitfish schools'); }
      if (seasons(c, S.FallTransition)) { pts += 5; r.push('+5 fall — matches shad migration perfectly'); }
      if (times(c, T.Morning, T.Evening)) { pts += 3; r.push('+3 transition light — feeding windows'); }
      if (c.clarity === C.Clear || c.clarity === C.Stained) { pts += 3; r.push('+3 visibility for baitfish profile match'); }
      if (inRange(c.waterTempEstimateF, 62, 82)) { pts += 2; r.push('+2 ideal swimbait water temp'); }
      if (w.windSpeedMph > 5) { pts += 1; r.push('+1 wind activates baitfish, bass follow'); }

      return { points: pts, reasons: r };
    },
  },
  {
    id: 'creature-bait',
    name: 'Texas-Rigged Creature Bait',
    category: 'Soft Plastic',
    score: (c) => {
      let pts = 0;
      const r: string[] = [];

      if (seasons(c, S.Spawn)) { pts += 7; r.push('+7 spawn — drag through beds for defensive strikes'); }
      if (seasons(c, S.PreSpawn)) { pts += 4; r.push('+4 pre-spawn — flip to staging areas'); }
      if (c.clarity === C.Clear) { pts += 3; r.push('+3 clear water — sight fish with creature bait'); }
      if (c.clarity === C.Stained) { pts += 3; r.push('+3 stained — bulky profile displaces water'); }
      if (inRange(c.waterTempEstimateF, 58, 72)) { pts += 3; r.push('+3 spawn temp range — bass on beds'); }

      return { points: pts, reasons: r };
    },
  },
  {
    id: 'weightless-senko',
    name: 'Weightless Senko (Texas-Rigged)',
    category: 'Soft Plastic',
    score: (c, w) => {
      let pts = 2;
      const r: string[] = ['+2 base — universally effective bait'];

      if (seasons(c, S.Spawn, S.PostSpawn)) { pts += 6; r.push('+6 spawn/post-spawn — senko near beds is deadly'); }
      if (c.clarity === C.Clear) { pts += 4; r.push('+4 clear water — shimmy fall visible to bass'); }
      if (c.clarity === C.Stained) { pts += 3; r.push('+3 stained water — bulky profile still draws bites'); }
      if (c.pressureTrend === P.Rising || c.pressureTrend === P.Stable) { pts += 4; r.push('+4 rising/stable pressure — slow fall wins when bass won\'t chase'); }
      if (c.isFrontalPassage) { pts += 4; r.push('+4 post-frontal — subtle presentation triggers reluctant bass'); }
      if (w.windSpeedMph < 10) { pts += 2; r.push('+2 calm wind — feel the bite on slack line'); }
      if (inRange(c.waterTempEstimateF, 55, 80)) { pts += 2; r.push('+2 versatile water temp range for senko fishing'); }

      return { points: pts, reasons: r };
    },
  },
  {
    id: 'neko-rig',
    name: 'Neko Rig',
    category: 'Finesse',
    score: (c, w) => {
      let pts = 0;
      const r: string[] = [];

      if (c.pressureTrend === P.Rising) { pts += 6; r.push('+6 rising pressure — ultimate finesse presentation'); }
      if (c.isFrontalPassage) { pts += 5; r.push('+5 post-frontal — gets bites when nothing else works'); }
      if (c.clarity === C.Clear) { pts += 5; r.push('+5 clear water — subtle nose-down action looks natural'); }
      if (c.isStablePeriod) { pts += 3; r.push('+3 stable period — pressured fish respond to finesse'); }
      if (seasons(c, S.Spawn)) { pts += 4; r.push('+4 spawn — nose-down action near beds provokes strikes'); }
      if (seasons(c, S.Summer)) { pts += 3; r.push('+3 summer — drag on deep structure for finicky bass'); }
      if (w.windSpeedMph < 8) { pts += 2; r.push('+2 light wind — better feel for subtle bites'); }
      if (inRange(c.waterTempEstimateF, 50, 75)) { pts += 2; r.push('+2 effective water temp range for neko rig'); }

      return { points: pts, reasons: r };
    },
  },
  {
    id: 'inline-spinner',
    name: 'Rooster Tail / Inline Spinner',
    category: 'Reaction',
    score: (c, w) => {
      let pts = 0;
      const r: string[] = [];

      if (c.clarity === C.Stained) { pts += 5; r.push('+5 stained water — blade flash and vibration attract bass'); }
      if (seasons(c, S.FallTransition)) { pts += 5; r.push('+5 fall — matches small baitfish patterns'); }
      if (seasons(c, S.PreSpawn)) { pts += 4; r.push('+4 pre-spawn — bass feeding on emerging forage'); }
      if (seasons(c, S.PostSpawn)) { pts += 4; r.push('+4 post-spawn — active feeding period after beds'); }
      if (inRange(c.waterTempEstimateF, 50, 75)) { pts += 3; r.push('+3 optimal water temp range for inline spinner'); }
      if (times(c, T.Morning, T.Evening)) { pts += 3; r.push('+3 transition light periods — blade flash most effective'); }
      if (w.windSpeedMph > 5) { pts += 2; r.push('+2 wind helps mask presentation'); }
      if (c.clarity === C.Muddy) { pts += 3; r.push('+3 muddy water — vibration helps bass locate spinner'); }
      if (c.clarity === C.Clear) { pts -= 2; r.push('-2 clear water — bass can see it\'s artificial'); }
      if (seasons(c, S.Winter) && c.waterTempEstimateF < 45) { pts -= 4; r.push('-4 too cold for reaction — bass lethargic in winter'); }

      return { points: pts, reasons: r };
    },
  },
  {
    id: 'whopper-plopper',
    name: 'Whopper Plopper / Prop Bait',
    category: 'Topwater',
    score: (c, w) => {
      let pts = 0;
      const r: string[] = [];

      if (times(c, T.Dawn, T.Evening)) { pts += 7; r.push('+7 low light feeding windows — prime topwater time'); }
      if (seasons(c, S.Summer, S.PostSpawn)) { pts += 5; r.push('+5 warm water topwater season — bass looking up'); }
      if (c.waterTempEstimateF > 65) { pts += 4; r.push('+4 warm water — bass actively feeding on surface'); }
      if (c.clarity === C.Stained) { pts += 4; r.push('+4 stained water — plopping noise draws fish from distance'); }
      if (w.windSpeedMph < 10) { pts += 3; r.push('+3 calm conditions — surface action stays visible'); }
      if (w.cloudCoverPercent > 60) { pts += 3; r.push('+3 cloud cover extends the topwater window'); }
      if (c.pressureTrend === P.Falling) { pts += 2; r.push('+2 falling pressure — bass aggressive and willing to surface'); }
      if (times(c, T.Midday) && c.lightLevel === L.High) { pts -= 4; r.push('-4 bright midday sun kills topwater bite'); }
      if (c.waterTempEstimateF < 55) { pts -= 3; r.push('-3 too cold for surface strikes'); }

      return { points: pts, reasons: r };
    },
  },
  {
    id: 'fluke',
    name: 'Soft Jerkbait / Fluke',
    category: 'Soft Plastic',
    score: (c, w) => {
      let pts = 0;
      const r: string[] = [];

      if (seasons(c, S.FallTransition)) { pts += 7; r.push('+7 fall — dying shad imitation matches the hatch'); }
      if (c.clarity === C.Clear) { pts += 5; r.push('+5 clear water — realistic baitfish profile shines'); }
      if (seasons(c, S.PostSpawn)) { pts += 5; r.push('+5 post-spawn — bass chasing shad fry in shallows'); }
      if (c.clarity === C.Stained) { pts += 3; r.push('+3 stained water — erratic action still triggers bites'); }
      if (times(c, T.Morning, T.Evening)) { pts += 3; r.push('+3 baitfish activity peaks at transitions'); }
      if (w.windSpeedMph < 12) { pts += 2; r.push('+2 manageable wind — control the glide action'); }
      if (inRange(c.waterTempEstimateF, 58, 82)) { pts += 2; r.push('+2 baitfish active temp range'); }
      if (c.pressureTrend === P.Falling) { pts += 2; r.push('+2 falling pressure — bass chase moving baits'); }

      return { points: pts, reasons: r };
    },
  },
  {
    id: 'swim-jig',
    name: 'Swim Jig',
    category: 'Jig',
    score: (c, w) => {
      let pts = 0;
      const r: string[] = [];

      if (seasons(c, S.Summer)) { pts += 6; r.push('+6 summer — swim through vegetation mats and grass lines'); }
      if (seasons(c, S.PreSpawn)) { pts += 5; r.push('+5 pre-spawn — bass staging in shallow grass'); }
      if (seasons(c, S.PostSpawn)) { pts += 4; r.push('+4 post-spawn — bass relating to cover'); }
      if (c.clarity === C.Stained) { pts += 5; r.push('+5 stained water — profile and vibration in limited visibility'); }
      if (c.clarity === C.Muddy) { pts += 3; r.push('+3 muddy water — trailer kick displaces water'); }
      if (c.pressureTrend === P.Falling) { pts += 3; r.push('+3 falling pressure — bass feeding actively in cover'); }
      if (w.cloudCoverPercent > 60) { pts += 3; r.push('+3 cloud cover — bass roam in and around cover'); }
      if (w.windSpeedMph > 8) { pts += 2; r.push('+2 wind pushes baitfish to cover edges'); }
      if (seasons(c, S.Winter) && c.waterTempEstimateF < 48) { pts -= 4; r.push('-4 too cold for swimming presentation'); }

      return { points: pts, reasons: r };
    },
  },
  {
    id: 'medium-crankbait',
    name: 'Medium Diving Crankbait',
    category: 'Reaction',
    score: (c, w) => {
      let pts = 0;
      const r: string[] = [];

      if (seasons(c, S.PostSpawn)) { pts += 6; r.push('+6 post-spawn — bass transitioning from shallow to deep structure'); }
      if (seasons(c, S.FallTransition)) { pts += 5; r.push('+5 fall — bass on mid-depth structure chasing baitfish'); }
      if (seasons(c, S.PreSpawn)) { pts += 4; r.push('+4 pre-spawn — bass staging at mid-depth'); }
      if (c.clarity === C.Stained) { pts += 4; r.push('+4 stained water — vibration and deflection trigger reaction'); }
      if (w.windSpeedMph > 8) { pts += 3; r.push('+3 wind increases reaction bite potential'); }
      if (inRange(c.waterTempEstimateF, 55, 80)) { pts += 2; r.push('+2 effective water temp range for mid-depth cranking'); }
      if (w.cloudCoverPercent > 50) { pts += 2; r.push('+2 cloud cover — bass roam mid-depth'); }
      if (c.clarity === C.Clear) { pts += 1; r.push('+1 clear water — still effective with natural color choices'); }
      if (seasons(c, S.Winter) && c.waterTempEstimateF < 45) { pts -= 4; r.push('-4 too cold for cranking — bass lethargic'); }

      return { points: pts, reasons: r };
    },
  },
  {
    id: 'underspin',
    name: 'Underspin / Keel-Weighted Swimbait',
    category: 'Reaction',
    score: (c, w) => {
      let pts = 0;
      const r: string[] = [];

      if (seasons(c, S.FallTransition)) { pts += 6; r.push('+6 fall — matches shad schools perfectly'); }
      if (seasons(c, S.PostSpawn)) { pts += 5; r.push('+5 post-spawn — bass feeding on baitfish'); }
      if (seasons(c, S.Summer)) { pts += 4; r.push('+4 summer — deep schooling bass on ledges'); }
      if (c.clarity === C.Clear) { pts += 4; r.push('+4 clear water — flash and natural profile fool wary bass'); }
      if (c.clarity === C.Stained) { pts += 3; r.push('+3 stained water — blade adds flash and vibration'); }
      if (times(c, T.Morning, T.Evening)) { pts += 3; r.push('+3 transition periods — peak baitfish feeding activity'); }
      if (inRange(c.waterTempEstimateF, 58, 82)) { pts += 2; r.push('+2 baitfish active temp range'); }
      if (c.pressureTrend === P.Falling) { pts += 2; r.push('+2 falling pressure — aggressive feeding behavior'); }

      return { points: pts, reasons: r };
    },
  },
];
