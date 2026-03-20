import { SeasonPhase, TimeBucket, WaterClarity, type FishingRule, type DerivedConditions } from './types';

// Helper: returns 0-100 based on how close val is to [lo, hi]
function rangeFit(val: number, lo: number, hi: number, falloff: number = 15): number {
  if (val >= lo && val <= hi) return 100;
  const dist = val < lo ? lo - val : val - hi;
  return Math.max(0, 100 - (dist / falloff) * 100);
}

function seasonMatch(c: DerivedConditions, ...phases: SeasonPhase[]): boolean {
  return phases.includes(c.seasonPhase);
}

function timeMatch(c: DerivedConditions, ...buckets: TimeBucket[]): boolean {
  return buckets.includes(c.timeOfDay);
}

function clarityMatch(c: DerivedConditions, ...clarities: WaterClarity[]): boolean {
  return clarities.includes(c.clarity);
}

export const fishingRules: FishingRule[] = [
  // ===== PRE-SPAWN =====
  {
    id: 'prespawn-jerkbait',
    title: 'Pre-Spawn Jerkbait',
    lureType: 'Suspending Jerkbait',
    color: 'Natural shad / chrome',
    retrieve: 'Twitch-twitch-pause (long pauses in cold water)',
    depth: 'Shallow to mid-depth (3-8 ft)',
    reasoning: 'Bass are staging near spawning flats. Cold water makes them lethargic — a suspending jerkbait that hangs in the strike zone triggers reaction strikes.',
    match: (c, w) => {
      if (!seasonMatch(c, SeasonPhase.PreSpawn)) return 0;
      let score = 60;
      score += rangeFit(c.waterTempEstimateF, 48, 58) * 0.2;
      if (clarityMatch(c, WaterClarity.Clear, WaterClarity.Stained)) score += 10;
      if (timeMatch(c, TimeBucket.Morning, TimeBucket.Evening)) score += 10;
      return Math.min(100, score);
    },
  },
  {
    id: 'prespawn-lipless-crank',
    title: 'Pre-Spawn Lipless Crankbait',
    lureType: 'Lipless Crankbait',
    color: 'Red crawdad / gold',
    retrieve: 'Yo-yo retrieve — rip and let fall over grass',
    depth: 'Shallow flats (2-6 ft) near grass',
    reasoning: 'Bass move onto shallow flats to feed before spawning. A lipless crank ripped over emerging grass triggers aggressive reaction bites.',
    match: (c, w) => {
      if (!seasonMatch(c, SeasonPhase.PreSpawn)) return 0;
      let score = 55;
      score += rangeFit(c.waterTempEstimateF, 50, 60) * 0.25;
      if (w.windSpeedMph > 5) score += 10;
      if (timeMatch(c, TimeBucket.Morning, TimeBucket.Midday)) score += 5;
      return Math.min(100, score);
    },
  },
  {
    id: 'prespawn-spinnerbait-wind',
    title: 'Windy Pre-Spawn Spinnerbait',
    lureType: 'Spinnerbait',
    color: 'White / chartreuse',
    retrieve: 'Steady retrieve with pauses near structure',
    depth: 'Shallow flats near structure (2-6 ft)',
    reasoning: 'Wind pushes baitfish onto shallow flats and muddies the water. A spinnerbait\'s flash and vibration helps bass locate it in stained conditions.',
    match: (c, w) => {
      if (!seasonMatch(c, SeasonPhase.PreSpawn)) return 0;
      let score = 40;
      if (w.windSpeedMph > 8) score += 25;
      if (clarityMatch(c, WaterClarity.Stained, WaterClarity.Muddy)) score += 15;
      score += rangeFit(c.waterTempEstimateF, 50, 62) * 0.15;
      return Math.min(100, score);
    },
  },

  // ===== SPAWN =====
  {
    id: 'spawn-soft-plastic-sight',
    title: 'Spawn Bed Soft Plastic',
    lureType: 'Texas-Rigged Creature Bait',
    color: 'White / green pumpkin',
    retrieve: 'Drag slowly across bed, let sit',
    depth: 'Shallow (1-4 ft) on beds',
    reasoning: 'Bass guard their beds aggressively. Slowly dragging a creature bait through the bed triggers a defensive bite. White is visible for sight fishing.',
    match: (c, w) => {
      if (!seasonMatch(c, SeasonPhase.Spawn)) return 0;
      let score = 65;
      score += rangeFit(c.waterTempEstimateF, 60, 72) * 0.2;
      if (clarityMatch(c, WaterClarity.Clear)) score += 15;
      if (timeMatch(c, TimeBucket.Morning, TimeBucket.Midday)) score += 5;
      if (w.windSpeedMph < 10) score += 5;
      return Math.min(100, score);
    },
  },
  {
    id: 'spawn-ned-rig',
    title: 'Spawn Ned Rig',
    lureType: 'Ned Rig (mushroom head jig + stick bait)',
    color: 'Green pumpkin / TRD',
    retrieve: 'Drag and shake on bottom near beds',
    depth: 'Shallow (2-5 ft)',
    reasoning: 'A subtle Ned rig drags bottom near spawning areas. Its small profile fools pressured bass that ignore bigger lures.',
    match: (c, w) => {
      if (!seasonMatch(c, SeasonPhase.Spawn)) return 0;
      let score = 55;
      score += rangeFit(c.waterTempEstimateF, 58, 70) * 0.2;
      if (clarityMatch(c, WaterClarity.Clear, WaterClarity.Stained)) score += 10;
      if (w.windSpeedMph < 15) score += 5;
      return Math.min(100, score);
    },
  },
  {
    id: 'spawn-wacky-senko',
    title: 'Wacky-Rigged Senko',
    lureType: 'Wacky Rig (Senko-style stick bait)',
    color: 'Green pumpkin / watermelon',
    retrieve: 'Cast near cover, let fall naturally with subtle shakes',
    depth: 'Shallow (2-6 ft)',
    reasoning: 'The Senko\'s natural wobbling fall is irresistible near spawn. A wacky rig maximizes that action. Works even when bass are finicky.',
    match: (c) => {
      if (!seasonMatch(c, SeasonPhase.Spawn, SeasonPhase.PostSpawn)) return 0;
      let score = 60;
      score += rangeFit(c.waterTempEstimateF, 58, 75) * 0.2;
      if (clarityMatch(c, WaterClarity.Clear, WaterClarity.Stained)) score += 10;
      return Math.min(100, score);
    },
  },

  // ===== POST-SPAWN =====
  {
    id: 'postspawn-topwater-popper',
    title: 'Post-Spawn Topwater Popper',
    lureType: 'Topwater Popper',
    color: 'Bone / shad pattern',
    retrieve: 'Pop-pop-pause, vary cadence',
    depth: 'Surface',
    reasoning: 'Post-spawn bass are aggressive and hungry after guarding beds. Topwater poppers draw explosive strikes in low-light and calm conditions.',
    match: (c, w) => {
      if (!seasonMatch(c, SeasonPhase.PostSpawn)) return 0;
      let score = 50;
      if (timeMatch(c, TimeBucket.Dawn, TimeBucket.Evening)) score += 25;
      if (w.windSpeedMph < 10) score += 10;
      if (clarityMatch(c, WaterClarity.Clear, WaterClarity.Stained)) score += 10;
      score += rangeFit(c.waterTempEstimateF, 65, 78) * 0.1;
      return Math.min(100, score);
    },
  },
  {
    id: 'postspawn-swimbait',
    title: 'Post-Spawn Swimbait',
    lureType: 'Paddle Tail Swimbait (on jig head)',
    color: 'Shad / white',
    retrieve: 'Steady retrieve at mid-depth, match baitfish speed',
    depth: 'Mid-depth (4-10 ft)',
    reasoning: 'Post-spawn bass chase shad schools. A swimbait mimics the profile and movement of baitfish, drawing feeding strikes.',
    match: (c, w) => {
      if (!seasonMatch(c, SeasonPhase.PostSpawn, SeasonPhase.Summer)) return 0;
      let score = 55;
      score += rangeFit(c.waterTempEstimateF, 65, 80) * 0.2;
      if (timeMatch(c, TimeBucket.Morning, TimeBucket.Evening)) score += 10;
      if (w.cloudCoverPercent > 50) score += 5;
      return Math.min(100, score);
    },
  },

  // ===== SUMMER =====
  {
    id: 'summer-deep-crank',
    title: 'Summer Deep Crankbait',
    lureType: 'Deep Diving Crankbait',
    color: 'Citrus shad / sexy shad',
    retrieve: 'Steady crank to reach depth, deflect off structure',
    depth: 'Deep (10-20 ft) along ledges and points',
    reasoning: 'Summer heat pushes bass deep to ledges and drop-offs. A deep-diving crank deflecting off cover triggers reaction bites from lethargic fish.',
    match: (c, w) => {
      if (!seasonMatch(c, SeasonPhase.Summer)) return 0;
      let score = 55;
      score += rangeFit(c.waterTempEstimateF, 75, 90) * 0.2;
      if (timeMatch(c, TimeBucket.Morning, TimeBucket.Midday)) score += 10;
      if (w.cloudCoverPercent < 50) score += 5;
      return Math.min(100, score);
    },
  },
  {
    id: 'summer-texas-rig-worm',
    title: 'Summer Texas Rig Worm',
    lureType: 'Texas-Rigged Plastic Worm (10")',
    color: 'Junebug / plum',
    retrieve: 'Slow drag on bottom with occasional hops',
    depth: 'Deep structure (8-20 ft)',
    reasoning: 'The classic summer technique. Slow-dragging a big worm through deep cover is a proven big bass producer when the heat drives fish down.',
    match: (c) => {
      if (!seasonMatch(c, SeasonPhase.Summer)) return 0;
      let score = 60;
      score += rangeFit(c.waterTempEstimateF, 72, 88) * 0.2;
      if (timeMatch(c, TimeBucket.Midday)) score += 10;
      return Math.min(100, score);
    },
  },
  {
    id: 'summer-topwater-dawn',
    title: 'Summer Dawn Topwater',
    lureType: 'Buzzbait / Walking Topwater',
    color: 'Black / white belly',
    retrieve: 'Steady buzz or walk-the-dog',
    depth: 'Surface',
    reasoning: 'Early summer mornings offer the best topwater bite. Bass move shallow to feed before the heat. A buzzbait at dawn produces explosive strikes.',
    match: (c, w) => {
      if (!seasonMatch(c, SeasonPhase.Summer, SeasonPhase.PostSpawn)) return 0;
      let score = 40;
      if (timeMatch(c, TimeBucket.Dawn)) score += 35;
      else if (timeMatch(c, TimeBucket.Evening)) score += 25;
      else return 0;
      if (w.windSpeedMph < 8) score += 10;
      score += rangeFit(c.waterTempEstimateF, 70, 85) * 0.1;
      return Math.min(100, score);
    },
  },
  {
    id: 'summer-drop-shot',
    title: 'Summer Drop Shot',
    lureType: 'Drop Shot Rig',
    color: 'Morning dawn / natural shad',
    retrieve: 'Vertical presentation, subtle shakes, hold in strike zone',
    depth: 'Deep (12-25 ft) on points and humps',
    reasoning: 'Drop shot excels at keeping a finesse bait in the strike zone for deep, finicky summer bass. Perfect for spotted and pressured bass.',
    match: (c, w) => {
      if (!seasonMatch(c, SeasonPhase.Summer)) return 0;
      let score = 55;
      score += rangeFit(c.waterTempEstimateF, 75, 90) * 0.2;
      if (timeMatch(c, TimeBucket.Midday, TimeBucket.Morning)) score += 10;
      if (w.windSpeedMph < 10) score += 5;
      if (clarityMatch(c, WaterClarity.Clear)) score += 10;
      return Math.min(100, score);
    },
  },
  {
    id: 'summer-frog',
    title: 'Summer Frog over Grass',
    lureType: 'Hollow Body Frog',
    color: 'Black / white belly',
    retrieve: 'Walk over matted grass and lily pads',
    depth: 'Surface over vegetation',
    reasoning: 'Matted summer vegetation holds bass underneath. A frog walked across the top draws explosive blow-ups from hiding fish.',
    match: (c, w) => {
      if (!seasonMatch(c, SeasonPhase.Summer, SeasonPhase.PostSpawn)) return 0;
      let score = 45;
      score += rangeFit(c.waterTempEstimateF, 72, 90) * 0.15;
      if (timeMatch(c, TimeBucket.Dawn, TimeBucket.Morning, TimeBucket.Evening)) score += 15;
      if (w.cloudCoverPercent > 60) score += 10;
      if (clarityMatch(c, WaterClarity.Stained)) score += 5;
      return Math.min(100, score);
    },
  },
  {
    id: 'summer-jig-deep',
    title: 'Summer Football Jig',
    lureType: 'Football Jig',
    color: 'PB&J / green pumpkin',
    retrieve: 'Drag and hop along rocky bottom',
    depth: 'Deep (10-25 ft) on rock/gravel',
    reasoning: 'A football jig crawling over deep rocky structure imitates crawfish. The football head prevents snagging and creates an erratic action bass can\'t resist.',
    match: (c) => {
      if (!seasonMatch(c, SeasonPhase.Summer)) return 0;
      let score = 50;
      score += rangeFit(c.waterTempEstimateF, 72, 88) * 0.2;
      if (timeMatch(c, TimeBucket.Morning, TimeBucket.Midday)) score += 10;
      return Math.min(100, score);
    },
  },

  // ===== FALL TRANSITION =====
  {
    id: 'fall-squarebill',
    title: 'Fall Squarebill Crankbait',
    lureType: 'Squarebill Crankbait',
    color: 'Sexy shad / chartreuse black back',
    retrieve: 'Medium retrieve, deflect off wood and rock',
    depth: 'Shallow (2-6 ft) near cover',
    reasoning: 'Fall bass follow shad into shallow creeks and pockets. A squarebill crashed into cover triggers aggressive reaction bites from feeding fish.',
    match: (c, w) => {
      if (!seasonMatch(c, SeasonPhase.FallTransition)) return 0;
      let score = 65;
      score += rangeFit(c.waterTempEstimateF, 55, 72) * 0.15;
      if (timeMatch(c, TimeBucket.Morning, TimeBucket.Midday)) score += 10;
      if (w.windSpeedMph > 5) score += 5;
      return Math.min(100, score);
    },
  },
  {
    id: 'fall-spinnerbait',
    title: 'Fall Spinnerbait',
    lureType: 'Spinnerbait (willow/Colorado combo)',
    color: 'White / chartreuse',
    retrieve: 'Slow-roll near laydowns and docks',
    depth: 'Shallow to mid-depth (3-10 ft)',
    reasoning: 'Spinnerbaits mimic the shad schools bass chase in fall. The blade flash and vibration draw strikes even in stained water.',
    match: (c, w) => {
      if (!seasonMatch(c, SeasonPhase.FallTransition)) return 0;
      let score = 55;
      score += rangeFit(c.waterTempEstimateF, 55, 70) * 0.15;
      if (clarityMatch(c, WaterClarity.Stained, WaterClarity.Muddy)) score += 15;
      if (w.windSpeedMph > 8) score += 10;
      return Math.min(100, score);
    },
  },
  {
    id: 'fall-jerkbait',
    title: 'Fall Jerkbait',
    lureType: 'Jerkbait',
    color: 'Natural shad / ghost minnow',
    retrieve: 'Aggressive jerk-jerk-pause',
    depth: 'Mid-depth (4-8 ft)',
    reasoning: 'As water cools in fall, bass key on dying shad. A jerkbait\'s erratic darting action perfectly mimics injured baitfish.',
    match: (c, w) => {
      if (!seasonMatch(c, SeasonPhase.FallTransition)) return 0;
      let score = 55;
      score += rangeFit(c.waterTempEstimateF, 50, 65) * 0.2;
      if (clarityMatch(c, WaterClarity.Clear, WaterClarity.Stained)) score += 10;
      if (timeMatch(c, TimeBucket.Morning, TimeBucket.Evening)) score += 5;
      if (w.windSpeedMph < 15) score += 5;
      return Math.min(100, score);
    },
  },
  {
    id: 'fall-chatterbait',
    title: 'Fall Chatterbait',
    lureType: 'Chatterbait / Vibrating Jig',
    color: 'Green pumpkin / white',
    retrieve: 'Steady retrieve with trailer, bump grass',
    depth: 'Shallow to mid (3-8 ft) near grass',
    reasoning: 'Chatterbaits cover water fast and mimic fleeing baitfish over grass. The vibration and erratic action trigger fall feeding aggression.',
    match: (c, w) => {
      if (!seasonMatch(c, SeasonPhase.FallTransition, SeasonPhase.PostSpawn)) return 0;
      let score = 50;
      score += rangeFit(c.waterTempEstimateF, 55, 72) * 0.2;
      if (w.windSpeedMph > 5) score += 10;
      if (clarityMatch(c, WaterClarity.Stained)) score += 10;
      return Math.min(100, score);
    },
  },

  // ===== WINTER =====
  {
    id: 'winter-jig-slow',
    title: 'Winter Slow Jig',
    lureType: 'Finesse Jig (3/8 oz)',
    color: 'Brown / black & blue',
    retrieve: 'Ultra-slow drag, long pauses on bottom',
    depth: 'Deep (15-30 ft) near steep drops',
    reasoning: 'Winter bass are sluggish and hold deep. An ultra-slow finesse jig dragged near them can coax a lethargic bite when nothing else works.',
    match: (c) => {
      if (!seasonMatch(c, SeasonPhase.Winter)) return 0;
      let score = 60;
      score += rangeFit(c.waterTempEstimateF, 38, 48) * 0.2;
      if (timeMatch(c, TimeBucket.Midday)) score += 10;
      return Math.min(100, score);
    },
  },
  {
    id: 'winter-blade-bait',
    title: 'Winter Blade Bait',
    lureType: 'Blade Bait (Silver Buddy style)',
    color: 'Silver / gold',
    retrieve: 'Vertical jigging — lift and drop',
    depth: 'Deep (15-35 ft) over structure',
    reasoning: 'Blade baits excel in cold water. The tight vibration on the fall triggers reaction strikes from sluggish winter bass holding over deep structure.',
    match: (c) => {
      if (!seasonMatch(c, SeasonPhase.Winter)) return 0;
      let score = 55;
      score += rangeFit(c.waterTempEstimateF, 35, 48) * 0.25;
      if (timeMatch(c, TimeBucket.Midday, TimeBucket.Morning)) score += 10;
      return Math.min(100, score);
    },
  },
  {
    id: 'winter-suspending-jerkbait',
    title: 'Winter Suspending Jerkbait',
    lureType: 'Suspending Jerkbait',
    color: 'Clear / ghost minnow',
    retrieve: 'Jerk then pause 5-10 seconds',
    depth: 'Mid-depth (5-12 ft)',
    reasoning: 'In clear winter water, a suspending jerkbait hung motionless for long pauses is deadly. Cold bass won\'t chase, but they\'ll eat what\'s right in front of them.',
    match: (c, w) => {
      if (!seasonMatch(c, SeasonPhase.Winter)) return 0;
      let score = 55;
      score += rangeFit(c.waterTempEstimateF, 40, 50) * 0.2;
      if (clarityMatch(c, WaterClarity.Clear)) score += 15;
      if (w.windSpeedMph < 10) score += 5;
      if (timeMatch(c, TimeBucket.Midday)) score += 5;
      return Math.min(100, score);
    },
  },

  // ===== CONDITION-BASED (any season) =====
  {
    id: 'muddy-water-spinnerbait',
    title: 'Muddy Water Spinnerbait',
    lureType: 'Spinnerbait (Colorado blade)',
    color: 'Chartreuse / white',
    retrieve: 'Slow-roll, keep blades thumping',
    depth: 'Shallow (2-6 ft)',
    reasoning: 'In muddy water, bass rely on vibration to feed. The heavy thump of a Colorado blade spinnerbait in chartreuse helps them find and eat your lure.',
    match: (c) => {
      if (!clarityMatch(c, WaterClarity.Muddy)) return 0;
      let score = 70;
      if (timeMatch(c, TimeBucket.Morning, TimeBucket.Evening)) score += 10;
      return Math.min(100, score);
    },
  },
  {
    id: 'muddy-water-chatter',
    title: 'Muddy Water Chatterbait',
    lureType: 'Chatterbait / Vibrating Jig',
    color: 'Black & blue',
    retrieve: 'Steady retrieve, bump cover',
    depth: 'Shallow to mid (2-8 ft)',
    reasoning: 'Chatterbaits generate strong vibration that muddy-water bass home in on. Dark colors create a strong silhouette even in zero-visibility water.',
    match: (c) => {
      if (!clarityMatch(c, WaterClarity.Muddy)) return 0;
      let score = 65;
      if (timeMatch(c, TimeBucket.Morning, TimeBucket.Midday)) score += 10;
      return Math.min(100, score);
    },
  },
  {
    id: 'high-pressure-finesse',
    title: 'High Pressure Finesse',
    lureType: 'Ned Rig / Shaky Head',
    color: 'Natural (green pumpkin)',
    retrieve: 'Subtle shakes on bottom, long pauses',
    depth: 'Match current depth (varies)',
    reasoning: 'High barometric pressure (>1020 hPa) makes bass inactive and tight to cover. Finesse presentations get bit when power fishing fails.',
    match: (c, w) => {
      if (w.pressureHpa < 1020) return 0;
      let score = 55;
      if (w.pressureHpa > 1030) score += 15;
      if (clarityMatch(c, WaterClarity.Clear)) score += 10;
      if (timeMatch(c, TimeBucket.Midday)) score += 5;
      return Math.min(100, score);
    },
  },
  {
    id: 'low-pressure-power',
    title: 'Low Pressure Power Fishing',
    lureType: 'Crankbait / Spinnerbait',
    color: 'Bright (chartreuse, firetiger)',
    retrieve: 'Aggressive, fast retrieve',
    depth: 'Shallow to mid (2-10 ft)',
    reasoning: 'Dropping or low pressure (<1010 hPa) activates bass feeding. They move shallower and bite aggressively — cover water fast with power baits.',
    match: (c, w) => {
      if (w.pressureHpa > 1012) return 0;
      let score = 60;
      if (w.pressureHpa < 1005) score += 15;
      if (w.windSpeedMph > 5) score += 5;
      if (timeMatch(c, TimeBucket.Morning, TimeBucket.Evening)) score += 10;
      return Math.min(100, score);
    },
  },
  {
    id: 'overcast-moving-baits',
    title: 'Overcast Moving Baits',
    lureType: 'Squarebill / Spinnerbait / Chatterbait',
    color: 'Natural patterns',
    retrieve: 'Medium-speed, cover water',
    depth: 'Shallow to mid (2-8 ft)',
    reasoning: 'Heavy cloud cover emboldens bass to roam and feed. Moving baits cover water and intercept actively feeding fish.',
    match: (c, w) => {
      if (w.cloudCoverPercent < 70) return 0;
      let score = 55;
      if (w.cloudCoverPercent > 85) score += 10;
      if (timeMatch(c, TimeBucket.Morning, TimeBucket.Midday, TimeBucket.Evening)) score += 10;
      if (!seasonMatch(c, SeasonPhase.Winter)) score += 5;
      return Math.min(100, score);
    },
  },
  {
    id: 'windy-bank-crankbait',
    title: 'Windy Bank Crankbait',
    lureType: 'Squarebill / Medium Crankbait',
    color: 'Shad / crawdad',
    retrieve: 'Cast into the wind, steady crank',
    depth: 'Shallow (2-8 ft) on wind-blown banks',
    reasoning: 'Wind pushes baitfish and stirs up the bottom on windblown banks. Bass ambush from this buffet line. Fish the windy side for best results.',
    match: (c, w) => {
      if (w.windSpeedMph < 10) return 0;
      let score = 50;
      if (w.windSpeedMph > 15) score += 15;
      if (w.windSpeedMph > 20) score += 10;
      if (!seasonMatch(c, SeasonPhase.Winter)) score += 10;
      if (timeMatch(c, TimeBucket.Morning, TimeBucket.Midday)) score += 5;
      return Math.min(100, score);
    },
  },
  {
    id: 'clear-water-finesse',
    title: 'Clear Water Finesse Worm',
    lureType: 'Drop Shot / Shaky Head',
    color: 'Translucent / smoke / morning dawn',
    retrieve: 'Subtle movements, let the bait do the work',
    depth: 'Match depth to fish (6-20 ft)',
    reasoning: 'In clear water, bass can see everything — including you. Scale down, use natural colors, and finesse presentations to fool wary fish.',
    match: (c) => {
      if (!clarityMatch(c, WaterClarity.Clear)) return 0;
      let score = 50;
      if (timeMatch(c, TimeBucket.Midday)) score += 15;
      if (seasonMatch(c, SeasonPhase.Summer, SeasonPhase.Winter)) score += 10;
      return Math.min(100, score);
    },
  },
  {
    id: 'night-dark-jig',
    title: 'Night Fishing Jig',
    lureType: 'Heavy Jig (1/2 - 3/4 oz)',
    color: 'Black / black & blue',
    retrieve: 'Slow drag and swim near docks and seawalls',
    depth: 'Shallow (2-8 ft) near lights and structure',
    reasoning: 'Night fishing with a dark jig near dock lights and lit structures targets big bass that feed under cover of darkness.',
    match: (c) => {
      if (!timeMatch(c, TimeBucket.Night)) return 0;
      let score = 65;
      if (seasonMatch(c, SeasonPhase.Summer, SeasonPhase.PostSpawn)) score += 15;
      if (clarityMatch(c, WaterClarity.Clear, WaterClarity.Stained)) score += 5;
      return Math.min(100, score);
    },
  },
  {
    id: 'night-topwater-buzz',
    title: 'Night Buzzbait',
    lureType: 'Buzzbait',
    color: 'Black',
    retrieve: 'Steady retrieve to keep it gurgling on surface',
    depth: 'Surface',
    reasoning: 'A black buzzbait at night creates a silhouette against the sky. The noise and vibration attract bass that hunt by sound and feel after dark.',
    match: (c) => {
      if (!timeMatch(c, TimeBucket.Night)) return 0;
      let score = 55;
      if (seasonMatch(c, SeasonPhase.Summer, SeasonPhase.PostSpawn, SeasonPhase.FallTransition)) score += 15;
      if (clarityMatch(c, WaterClarity.Stained)) score += 5;
      return Math.min(100, score);
    },
  },
  {
    id: 'cold-front-tight-cover',
    title: 'Post Cold-Front Tight Cover',
    lureType: 'Jig / Texas Rig',
    color: 'Natural (green pumpkin / brown)',
    retrieve: 'Pitch to tight cover, slow presentation',
    depth: 'Tight to cover at various depths',
    reasoning: 'After a cold front (high pressure, clear skies, dropping temps), bass hunker down in cover. Pitch directly to them with a compact presentation.',
    match: (c, w) => {
      if (w.pressureHpa < 1020) return 0;
      if (w.cloudCoverPercent > 30) return 0;
      let score = 50;
      if (w.pressureHpa > 1025) score += 10;
      if (c.waterTempEstimateF < 65 && c.waterTempEstimateF > 40) score += 15;
      if (timeMatch(c, TimeBucket.Midday)) score += 10;
      return Math.min(100, score);
    },
  },
];
