import {
  SeasonPhase as S,
  WaterClarity as C,
  LightLevel as L,
  type ColorDefinition,
  type DerivedConditions,
} from './types';

function seasons(c: DerivedConditions, ...s: string[]): boolean {
  return s.includes(c.seasonPhase);
}

export const colors: ColorDefinition[] = [
  {
    id: 'white-chartreuse',
    name: 'White/Chartreuse',
    score: (c, w) => {
      let pts = 0;
      const r: string[] = [];
      if (c.clarity === C.Stained) { pts += 6; r.push('+6 high visibility in stained water'); }
      if (c.clarity === C.Muddy) { pts += 8; r.push('+8 chartreuse essential in muddy water'); }
      if (w.windSpeedMph > 10) { pts += 3; r.push('+3 wind-stirred water needs bright colors'); }
      if (c.lightLevel === L.Low || c.lightLevel === L.Dark) { pts += 3; r.push('+3 bright colors visible in low light'); }
      if (seasons(c, S.PreSpawn, S.FallTransition)) { pts += 2; r.push('+2 classic transitional season color'); }
      return { points: pts, reasons: r };
    },
  },
  {
    id: 'natural-shad',
    name: 'Natural Shad / Chrome',
    score: (c, w) => {
      let pts = 0;
      const r: string[] = [];
      if (c.clarity === C.Clear) { pts += 7; r.push('+7 clear water — natural profile matches forage'); }
      if (c.lightLevel === L.High) { pts += 3; r.push('+3 bright light — chrome flash mimics baitfish'); }
      if (seasons(c, S.FallTransition)) { pts += 4; r.push('+4 fall — shad patterns match the hatch'); }
      if (seasons(c, S.PostSpawn, S.Summer)) { pts += 2; r.push('+2 shad are primary forage in warm months'); }
      if (w.cloudCoverPercent < 50) { pts += 1; r.push('+1 sun enhances chrome flash'); }
      return { points: pts, reasons: r };
    },
  },
  {
    id: 'green-pumpkin',
    name: 'Green Pumpkin',
    score: (c) => {
      let pts = 0;
      const r: string[] = [];
      // The most versatile bass color — always scores something
      pts += 2; r.push('+2 most versatile bass fishing color');
      if (c.clarity === C.Clear) { pts += 5; r.push('+5 clear water — natural translucency fools bass'); }
      if (c.clarity === C.Stained) { pts += 3; r.push('+3 stained — still visible, natural looking'); }
      if (seasons(c, S.Spawn)) { pts += 3; r.push('+3 spawn — matches crawfish and bluegill tones'); }
      if (seasons(c, S.Summer, S.FallTransition)) { pts += 2; r.push('+2 natural forage color year-round'); }
      return { points: pts, reasons: r };
    },
  },
  {
    id: 'watermelon',
    name: 'Watermelon / Watermelon Red',
    score: (c) => {
      let pts = 0;
      const r: string[] = [];
      if (c.clarity === C.Clear) { pts += 6; r.push('+6 clear water — translucent profile looks natural'); }
      if (seasons(c, S.Spawn, S.PostSpawn)) { pts += 3; r.push('+3 spring colors match vegetation'); }
      if (c.lightLevel === L.High || c.lightLevel === L.Medium) { pts += 2; r.push('+2 light penetration shows off color'); }
      if (c.waterTempEstimateF > 55) { pts += 1; r.push('+1 warm-season forage match'); }
      return { points: pts, reasons: r };
    },
  },
  {
    id: 'black-blue',
    name: 'Black/Blue',
    score: (c, w) => {
      let pts = 0;
      const r: string[] = [];
      if (c.clarity === C.Muddy) { pts += 7; r.push('+7 muddy water — strong silhouette for detection'); }
      if (c.clarity === C.Stained) { pts += 4; r.push('+4 stained water — dark profile stands out'); }
      if (c.lightLevel === L.Dark || c.lightLevel === L.Low) { pts += 5; r.push('+5 low light — dark silhouette against sky'); }
      if (w.cloudCoverPercent > 80) { pts += 3; r.push('+3 heavy overcast — dark colors create contrast'); }
      if (seasons(c, S.Winter)) { pts += 2; r.push('+2 winter jig staple color'); }
      return { points: pts, reasons: r };
    },
  },
  {
    id: 'crawdad-red',
    name: 'Red Crawdad / Crawfish',
    score: (c) => {
      let pts = 0;
      const r: string[] = [];
      if (seasons(c, S.PreSpawn)) { pts += 6; r.push('+6 pre-spawn — crawfish emerge, bass key on them'); }
      if (seasons(c, S.Spawn)) { pts += 4; r.push('+4 spawn — crawfish primary bed invader'); }
      if (c.clarity === C.Stained) { pts += 3; r.push('+3 stained water — red is still visible'); }
      if (c.waterTempEstimateF > 48 && c.waterTempEstimateF < 65) { pts += 3; r.push('+3 crawfish active in this temp range'); }
      return { points: pts, reasons: r };
    },
  },
  {
    id: 'bone-white',
    name: 'Bone / Pearl White',
    score: (c, w) => {
      let pts = 0;
      const r: string[] = [];
      if (c.clarity === C.Clear) { pts += 4; r.push('+4 clear water — subtle and natural'); }
      if (seasons(c, S.PostSpawn, S.Summer)) { pts += 3; r.push('+3 warm season — matches shad belly'); }
      if (c.lightLevel === L.Low) { pts += 3; r.push('+3 low light — white visible from below'); }
      if (w.cloudCoverPercent > 60) { pts += 2; r.push('+2 overcast — bone stands out subtly'); }
      return { points: pts, reasons: r };
    },
  },
  {
    id: 'junebug',
    name: 'Junebug / Plum',
    score: (c, w) => {
      let pts = 0;
      const r: string[] = [];
      if (c.clarity === C.Stained) { pts += 5; r.push('+5 stained water — purple shows as dark profile'); }
      if (seasons(c, S.Summer)) { pts += 4; r.push('+4 summer worm color — proven big bass producer'); }
      if (c.lightLevel === L.Low || c.lightLevel === L.Dark) { pts += 3; r.push('+3 low light — dark silhouette effective'); }
      if (w.cloudCoverPercent > 60) { pts += 2; r.push('+2 overcast — junebug shines'); }
      return { points: pts, reasons: r };
    },
  },
  {
    id: 'sexy-shad',
    name: 'Sexy Shad / Citrus Shad',
    score: (c, w) => {
      let pts = 0;
      const r: string[] = [];
      if (c.clarity === C.Clear || c.clarity === C.Stained) { pts += 3; r.push('+3 versatile in moderate visibility'); }
      if (seasons(c, S.Summer, S.FallTransition)) { pts += 4; r.push('+4 warm months — shad are primary forage'); }
      if (c.lightLevel === L.High) { pts += 2; r.push('+2 sun flash enhances shad pattern'); }
      if (w.cloudCoverPercent < 60) { pts += 1; r.push('+1 brighter conditions favor shad patterns'); }
      return { points: pts, reasons: r };
    },
  },
  {
    id: 'black',
    name: 'Black',
    score: (c) => {
      let pts = 0;
      const r: string[] = [];
      if (c.lightLevel === L.Dark) { pts += 8; r.push('+8 night fishing — maximum silhouette against sky'); }
      if (c.lightLevel === L.Low) { pts += 4; r.push('+4 low light — strong contrast from below'); }
      if (c.clarity === C.Muddy) { pts += 4; r.push('+4 muddy water — darkest option for visibility'); }
      return { points: pts, reasons: r };
    },
  },
  {
    id: 'bluegill',
    name: 'Bluegill / Bream',
    score: (c) => {
      let pts = 0;
      const r: string[] = [];
      if (seasons(c, S.Spawn, S.PostSpawn)) { pts += 6; r.push('+6 spawn — bluegill raiding beds, bass attack on sight'); }
      if (c.clarity === C.Clear) { pts += 3; r.push('+3 clear water — realistic color match matters'); }
      if (c.waterTempEstimateF > 60 && c.waterTempEstimateF < 80) { pts += 2; r.push('+2 bluegill most active in this range'); }
      return { points: pts, reasons: r };
    },
  },
];
