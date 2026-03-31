import {
  SeasonPhase as S,
  WaterClarity as C,
  PressureTrend as P,
  type RetrieveDefinition,
  type DepthDefinition,
  type DerivedConditions,
} from './types';

function seasons(c: DerivedConditions, ...s: string[]): boolean {
  return s.includes(c.seasonPhase);
}

// ── RETRIEVE STYLES ──

export const retrieves: RetrieveDefinition[] = [
  {
    id: 'slow-roll',
    name: 'Slow Roll',
    description: 'Reel just fast enough to keep the blade(s) spinning or the bait moving. Let it bump along near the bottom or through cover. Think "barely moving" — you should feel the blades thumping.',
    score: (c, w) => {
      let pts = 0;
      const r: string[] = [];
      if (c.waterTempEstimateF < 55) { pts += 5; r.push('+5 cold water — slow retrieve matches bass metabolism'); }
      if (seasons(c, S.Winter, S.PreSpawn)) { pts += 4; r.push('+4 cold season — bass won\'t chase fast baits'); }
      if (c.clarity === C.Muddy) { pts += 3; r.push('+3 muddy water — slow gives bass time to locate'); }
      if (c.pressureTrend === P.Rising) { pts += 2; r.push('+2 high pressure — bass less aggressive'); }
      return { points: pts, reasons: r };
    },
  },
  {
    id: 'steady-medium',
    name: 'Steady Retrieve',
    description: 'Cast out and reel back at a consistent, medium pace — no pauses, no jerks. Let the lure do the work. This is your default "just reel it in" retrieve for crankbaits and swimbaits.',
    score: (c) => {
      let pts = 0;
      const r: string[] = [];
      // Versatile — always somewhat applicable
      pts += 2; r.push('+2 reliable all-purpose retrieve');
      if (seasons(c, S.PostSpawn, S.FallTransition)) { pts += 3; r.push('+3 active seasons — steady covers water effectively'); }
      if (c.clarity === C.Stained) { pts += 2; r.push('+2 consistent vibration in stained water'); }
      return { points: pts, reasons: r };
    },
  },
  {
    id: 'fast-burn',
    name: 'Fast / Burn',
    description: 'Reel as fast as you can while keeping the bait in the water. Triggers reaction strikes from aggressive bass that can\'t resist chasing. Great for covering water quickly.',
    score: (c, w) => {
      let pts = 0;
      const r: string[] = [];
      if (c.waterTempEstimateF > 70) { pts += 4; r.push('+4 warm water — bass metabolism high, chase fast baits'); }
      if (seasons(c, S.Summer, S.PostSpawn)) { pts += 3; r.push('+3 active season — aggressive feeding'); }
      if (c.pressureTrend === P.Falling) { pts += 3; r.push('+3 falling pressure — bass aggressive, burn it'); }
      if (w.windSpeedMph > 12) { pts += 2; r.push('+2 windy — reaction bite from fast-moving lure'); }
      if (c.waterTempEstimateF < 50) { pts -= 3; r.push('-3 too cold — bass can\'t catch fast baits'); }
      return { points: pts, reasons: r };
    },
  },
  {
    id: 'twitch-pause',
    name: 'Twitch-Twitch-Pause',
    description: 'Two sharp snaps of the rod tip, then let the bait sit still for 2-10 seconds. The pause is when the bite happens — watch your line. Longer pauses in colder water.',
    score: (c) => {
      let pts = 0;
      const r: string[] = [];
      if (seasons(c, S.PreSpawn, S.Winter)) { pts += 5; r.push('+5 cold water — pause lets bass commit'); }
      if (c.clarity === C.Clear) { pts += 4; r.push('+4 clear water — erratic action mimics injured bait'); }
      if (c.waterTempEstimateF < 58) { pts += 3; r.push('+3 cold water — longer pauses more effective'); }
      if (seasons(c, S.FallTransition)) { pts += 3; r.push('+3 fall — dying shad imitation'); }
      return { points: pts, reasons: r };
    },
  },
  {
    id: 'yo-yo',
    name: 'Yo-Yo / Rip and Drop',
    description: 'Rip the rod tip up sharply to lift the bait off the bottom, then let it flutter back down on slack line. Most strikes come on the fall. Great over submerged grass.',
    score: (c) => {
      let pts = 0;
      const r: string[] = [];
      if (seasons(c, S.PreSpawn)) { pts += 5; r.push('+5 pre-spawn — rip over grass, reaction strikes'); }
      if (seasons(c, S.FallTransition)) { pts += 3; r.push('+3 fall — erratic action over dying grass'); }
      if (c.clarity === C.Stained) { pts += 2; r.push('+2 stained — sound/vibration on rip triggers bites'); }
      return { points: pts, reasons: r };
    },
  },
  {
    id: 'bottom-drag',
    name: 'Slow Drag / Bottom Contact',
    description: 'Drag the bait along the bottom with your rod tip, then reel up slack. Keep contact with the bottom at all times — feel for rocks, shells, and wood. Pause when you feel something.',
    score: (c) => {
      let pts = 0;
      const r: string[] = [];
      if (seasons(c, S.Summer)) { pts += 5; r.push('+5 summer — deep structure dragging is king'); }
      if (seasons(c, S.Winter)) { pts += 5; r.push('+5 winter — ultra-slow bottom contact for cold bass'); }
      if (c.pressureTrend === P.Rising) { pts += 3; r.push('+3 high pressure — bottom presentations best'); }
      if (c.isFrontalPassage) { pts += 3; r.push('+3 post-frontal — bass glued to bottom'); }
      return { points: pts, reasons: r };
    },
  },
  {
    id: 'walk-the-dog',
    name: 'Walk-the-Dog',
    description: 'With a slack line, snap your rod tip down in a rhythmic cadence. The bait will zig-zag side to side on the surface. Keep a steady rhythm — snap, pause, snap, pause.',
    score: (c, w) => {
      let pts = 0;
      const r: string[] = [];
      if (c.waterTempEstimateF > 65) { pts += 4; r.push('+4 warm water — bass looking up for surface meals'); }
      if (c.lightLevel === 'Low') { pts += 4; r.push('+4 low light — topwater feeding window'); }
      if (w.windSpeedMph < 8) { pts += 3; r.push('+3 calm surface — walking action visible'); }
      if (seasons(c, S.Summer, S.PostSpawn)) { pts += 2; r.push('+2 warm season topwater opportunity'); }
      return { points: pts, reasons: r };
    },
  },
  {
    id: 'pop-pause',
    name: 'Pop-Pop-Pause',
    description: 'Give two short, sharp pops with your rod tip to make the bait spit water, then let it sit still for 3-5 seconds. The rings on the water draw bass in, and the pause triggers the strike.',
    score: (c, w) => {
      let pts = 0;
      const r: string[] = [];
      if (c.waterTempEstimateF > 62) { pts += 3; r.push('+3 warm water for surface feeding'); }
      if (c.lightLevel === 'Low') { pts += 4; r.push('+4 low light — popping action draws attention'); }
      if (w.windSpeedMph < 8) { pts += 3; r.push('+3 calm water — pop rings visible'); }
      if (seasons(c, S.PostSpawn)) { pts += 3; r.push('+3 post-spawn aggression — explosive strikes'); }
      return { points: pts, reasons: r };
    },
  },
  {
    id: 'vertical-jig',
    name: 'Vertical Jigging',
    description: 'Position directly above the fish. Drop the bait straight down, pop it up 1-2 feet with the rod tip, and let it fall back on semi-slack line. Best from a boat over deep structure.',
    score: (c) => {
      let pts = 0;
      const r: string[] = [];
      if (seasons(c, S.Winter)) { pts += 6; r.push('+6 winter — vertical approach for deep staging bass'); }
      if (c.waterTempEstimateF < 48) { pts += 4; r.push('+4 cold water — bass schooled deep, stay over them'); }
      if (seasons(c, S.Summer)) { pts += 3; r.push('+3 summer — deep ledge bass respond to vertical fall'); }
      return { points: pts, reasons: r };
    },
  },
  {
    id: 'deadstick',
    name: 'Deadstick / Natural Fall',
    description: 'Cast it out and do almost nothing. Let the bait sink on slack or semi-slack line — the natural shimmy and fall does the work. Watch your line for any twitch or movement, that\'s a bite.',
    score: (c) => {
      let pts = 0;
      const r: string[] = [];
      if (c.pressureTrend === P.Rising) { pts += 5; r.push('+5 high pressure — motionless presentations win'); }
      if (c.isFrontalPassage) { pts += 5; r.push('+5 post-frontal — bass won\'t chase, let it sit'); }
      if (c.clarity === C.Clear) { pts += 3; r.push('+3 clear water — natural fall looks realistic'); }
      if (seasons(c, S.Spawn)) { pts += 3; r.push('+3 spawn — wacky/Senko fall irresistible near beds'); }
      return { points: pts, reasons: r };
    },
  },
  {
    id: 'swimming',
    name: 'Swimming / Steady Swim',
    description: 'Reel at a medium pace to keep the jig or bait swimming through the water column. Let it tick the tops of grass or brush. Keep your rod tip up and maintain contact — bites feel like a sudden heaviness.',
    score: (c, w) => {
      let pts = 0;
      const r: string[] = [];
      if (seasons(c, S.Summer)) { pts += 5; r.push('+5 summer — swim through vegetation'); }
      if (seasons(c, S.PostSpawn)) { pts += 4; r.push('+4 post-spawn — bass relating to shallow cover'); }
      if (seasons(c, S.PreSpawn)) { pts += 3; r.push('+3 pre-spawn — staging in grass'); }
      if (c.clarity === C.Stained) { pts += 3; r.push('+3 stained — profile/vibration matters'); }
      if (c.pressureTrend === P.Falling) { pts += 3; r.push('+3 falling pressure — bass aggressive in cover'); }
      if (c.waterTempEstimateF > 55) { pts += 2; r.push('+2 need some warmth for active bass'); }
      if (w.windSpeedMph > 8) { pts += 2; r.push('+2 wind positions bait near cover'); }
      if (seasons(c, S.Winter) && c.waterTempEstimateF < 48) { pts -= 3; r.push('-3 too cold for swimming retrieve'); }
      return { points: pts, reasons: r };
    },
  },
];

// ── DEPTH ZONES ──

export const depths: DepthDefinition[] = [
  {
    id: 'surface',
    name: 'Surface',
    score: (c, w) => {
      let pts = 0;
      const r: string[] = [];
      if (c.waterTempEstimateF > 65) { pts += 4; r.push('+4 warm water — bass willing to hit surface'); }
      if (c.lightLevel === 'Low' || c.lightLevel === 'Dark') { pts += 5; r.push('+5 low light — prime topwater window'); }
      if (w.windSpeedMph < 8) { pts += 3; r.push('+3 calm — surface disturbance visible'); }
      if (seasons(c, S.PostSpawn, S.Summer)) { pts += 3; r.push('+3 warm season — surface feeding active'); }
      if (c.lightLevel === 'High') { pts -= 3; r.push('-3 bright sun — bass avoid surface'); }
      if (c.waterTempEstimateF < 55) { pts -= 4; r.push('-4 too cold for surface strikes'); }
      return { points: pts, reasons: r };
    },
  },
  {
    id: 'shallow',
    name: 'Shallow (1-5 ft)',
    score: (c, w) => {
      let pts = 0;
      const r: string[] = [];
      if (seasons(c, S.PreSpawn, S.Spawn)) { pts += 6; r.push('+6 spawn cycle — bass moving/holding shallow'); }
      if (seasons(c, S.FallTransition)) { pts += 5; r.push('+5 fall — bass follow bait into shallows'); }
      if (w.windSpeedMph > 10) { pts += 3; r.push('+3 wind pushes baitfish shallow'); }
      if (w.cloudCoverPercent > 70) { pts += 3; r.push('+3 overcast — bass comfortable in shallows'); }
      if (c.pressureTrend === P.Falling) { pts += 2; r.push('+2 falling pressure — fish push shallow'); }
      if (seasons(c, S.Summer) && c.lightLevel === 'High') { pts -= 3; r.push('-3 summer sun drives bass off shallows'); }
      return { points: pts, reasons: r };
    },
  },
  {
    id: 'mid-depth',
    name: 'Mid-Depth (5-12 ft)',
    score: (c) => {
      let pts = 0;
      const r: string[] = [];
      // Mid-depth is the most versatile — always somewhat relevant
      pts += 2; r.push('+2 versatile depth zone for most conditions');
      if (seasons(c, S.PostSpawn)) { pts += 4; r.push('+4 post-spawn transition — bass between shallow and deep'); }
      if (seasons(c, S.FallTransition)) { pts += 3; r.push('+3 fall — bass staging between creek channels and flats'); }
      if (seasons(c, S.PreSpawn)) { pts += 3; r.push('+3 pre-spawn — staging depth before shallow push'); }
      return { points: pts, reasons: r };
    },
  },
  {
    id: 'deep',
    name: 'Deep (12-25 ft)',
    score: (c, w) => {
      let pts = 0;
      const r: string[] = [];
      if (seasons(c, S.Summer)) { pts += 7; r.push('+7 summer — bass hold on deep ledges and points'); }
      if (seasons(c, S.Winter)) { pts += 6; r.push('+6 winter — bass congregate in deep structure'); }
      if (c.waterTempEstimateF > 80) { pts += 3; r.push('+3 hot water — thermocline pushes bass deep'); }
      if (c.lightLevel === 'High') { pts += 3; r.push('+3 bright sun — bass seek depth for shade'); }
      if (c.pressureTrend === P.Rising) { pts += 2; r.push('+2 high pressure — bass pull deep'); }
      if (w.cloudCoverPercent < 30) { pts += 2; r.push('+2 clear skies — bass avoid shallow sun'); }
      return { points: pts, reasons: r };
    },
  },
];
