export type RawRaceOrQualifyResult = {
  sessionType: "R" | "Q" | "R2" | "Q2",
  trackName: string;
  sessionIndex: number;
  raceWeekendIndex: number;
  metaData: string;
  serverName: string;
  sessionResult: SessionResult,
  laps: Lap[];
  penalties: Penalty[],
  post_race_penalties: Penalty[];
}

export type RawRaceResult = RawRaceOrQualifyResult & {
  sessionType: "R",
}

export type RawQualyResult = RawRaceOrQualifyResult & {
  sessionType: "Q",
}

export type SessionResult = {
  bestlap: number;
  bestSplits: number[];
  isWetSession: number;
  type: number;
  leaderBoardLines: LeaderBoardLine[];
}

export type Car = {
  carId: number;
  raceNumber: number;
  carModel: number;
  cupCategory: number;
  teamName: string;
  nationality: number;
  carGuid: number;
  teamGuid: number;
  drivers: Driver[];
}

export type Timing = {
  lastLap: number;
  lastSplits: number[];
  bestLap: number;
  bestSplits: number[];
  totalTime: number;
  lapCount: number;
  lastSplitId: number;
}

export type LeaderBoardLine = {
  car: Car;
  currentDriver: Driver;
  currentDriverIndex: number;
  timing: Timing,
  missingMandatoryPitstop: number;
  driverTotalTimes: number[];
}

export type Driver = {
  firstName: string;
  lastName: string;
  shortName: string;
  playerId: string;
}

export type Lap = {
  carId: number;
  driverIndex: number;
  laptime: number;
  isValidForBest: boolean;
  splits: number[];
}

export type Penalty = {
  carId: number;
  driverIndex: number;
  reason: 'Trolling' | 'Cutting' | 'PitSpeeding'; // Probably more available
  penalty: 'DriveThrough' | 'PostRaceTime' | 'None' | 'StopAndGo_30'; // Probably more available
  penaltyValue: number;
  violationInLap: number;
  clearedInLap: number;
}

export type RaceFormat = 'endurance' | 'multiSprint' | 'sprint';

export type RaceFormatPoints = {
  race: number[],
  pole: number;
  fastestLap: number;
  pointsAfterLast: number;
};

export type SeasonConfig = {
  points: {
    endurance: RaceFormatPoints;
    multiSprint: RaceFormatPoints;
    sprint: RaceFormatPoints;
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