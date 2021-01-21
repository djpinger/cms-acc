export type RaceFormat = 'endurance' | 'multiSprint' | 'sprint';

export type SeasonConfig = {
  points: {
    endurance: {
      race: number[],
      pole: number;
      fastestLap: number;
      pointsAfterLast: number;
    };
    multiSprint: {
      race: number[],
      pole: number;
      fastestLap: number;
      pointsAfterLast: number;
    };
    sprint: {
      race: number[],
      pole: number;
      fastestLap: number;
      pointsAfterLast
      : number;
    };
  },
  races: SeasonConfigRace[];
}

export type SeasonConfigRace = {
  name: string;
  trackName: string;
  format: RaceFormat;
  numberOfRaces: number;
}

export type CarConfig = {
  cars: (string | null)[];
  GT3: number[];
  GT4: number[];
  PCC: number[];
  ST: number[];
}