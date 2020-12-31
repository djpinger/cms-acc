import * as faker from "faker";
import { loadCarsConfig } from "../src/fileSystem";
import { Car, Driver, Lap, LeaderBoardLine, RawRaceOrQualifyResult, SeasonConfig, Timing } from "../src/modelsRaw";
import { TrackNames2019 } from "../src/tracks";

const carsConfig = loadCarsConfig();

export function createPlayerId() {
  return `S${faker.random.number()}`;
}

export function createSeasonConfig(overrides: Partial<SeasonConfig> = {}): SeasonConfig {
  return {
    points: {
      endurance: {
        race: [50, 25, 10],
        fastestLap: 1,
        pole: 2,
        pointsAfterEnd: 2,
      },
      multiSprint: {
        race: [50, 25, 10],
        fastestLap: 1,
        pole: 2,
        pointsAfterEnd: 1,
      },
      sprint: {
        race: [20, 15, 5],
        fastestLap: 0.5,
        pole: 1,
        pointsAfterEnd: 1,
      },
    },
    races: [
      {
        "trackName": "zolder_2019",
        "name": "Zolder",
        "format": "multiSprint",
        "numberOfRaces": 1
      },
      {
        "trackName": "misano_2019",
        "name": "Misano",
        "format": "sprint",
        "numberOfRaces": 2
      },
      {
        "trackName": "laguna_seca_2019",
        "name": "Laguna Seca",
        "format": "endurance",
        "numberOfRaces": 1
      }
    ],
    ...overrides,
  };
}

type CreateRaceResults = {
  sessionType?: RawRaceOrQualifyResult['sessionType'];
  trackName?: string;
  leaderBoardLines: LeaderBoardLine[];
  overrides?: Partial<RawRaceOrQualifyResult>;
  split?: number;
}

export function createRaceOrQualifyResults(params: CreateRaceResults): RawRaceOrQualifyResult {
  const {
    sessionType = 'R',
    trackName = TrackNames2019.LagunaSeca,
    leaderBoardLines,
    split = 1,
    overrides = {}
  } = params;

  const laps = leaderBoardLines.map(function (line) {
    return createLap({
      carId: line.car.carId,
      driverIndex: line.currentDriverIndex,
      laptime: line.timing.bestLap,
      splits: line.timing.bestSplits,
    });
  });

  return {
    sessionType: sessionType,
    trackName: trackName,
    sessionIndex: 2,
    raceWeekendIndex: 0,
    metaData: trackName,
    serverName:
      `cmsracing.com - Monday Night Racing - Round 1 at Zolder - Split ${split}`,
    sessionResult: {
      bestlap: 89265,
      bestSplits: [30315, 29034, 29802],
      isWetSession: 0,
      type: 1,
      leaderBoardLines,
    },
    laps,
    penalties: [],
    post_race_penalties: [],
    ...overrides,
  };
}

export function createCar(overrides: Partial<Car> = {}): Car {
  return {
    carId: faker.random.number(),
    raceNumber: faker.random.number(999),
    carModel: 1,
    cupCategory: 2,
    teamName: "",
    nationality: 0,
    carGuid: -1,
    teamGuid: -1,
    drivers: [],
    ...overrides,
  };
}

export function createGt4Car(overrides: Partial<Car> = {}): Car {
  const carModel = overrides.carModel == null ? randomGt4CarModelId() : overrides.carModel;
  return {
    ...createCar(overrides),
    carModel
  }
}

export function createGt3Car(overrides: Partial<Car> = {}): Car {
  const carModel = overrides.carModel == null ? randomGt3CarModelId() : overrides.carModel;
  return {
    ...createCar(overrides),
    carModel
  }
}

export function createDriver(overrides: Partial<Driver> = {}): Driver {
  return {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    shortName: faker.random.alpha(),
    playerId: createPlayerId(),
    ...overrides
  };
}

export function createLeaderBoardLine(overrides: Partial<LeaderBoardLine> = {}): LeaderBoardLine {
  const driver: Driver = {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    shortName: faker.random.alpha(),
    playerId: createPlayerId(),
  };
  return {
    car: createCar({drivers: [driver]}),
    currentDriver: driver,
    currentDriverIndex: 0,
    timing: createTiming(),
    missingMandatoryPitstop: 0,
    driverTotalTimes: [4421053.0],
    ...overrides,
  };
}

export function createTiming(overrides: Partial<Timing> = {}): Timing {
  return {
    lastLap: faker.random.number(90000),
    lastSplits: [faker.random.number(30000), faker.random.number(30000), faker.random.number(30000)],
    bestLap: faker.random.number(90000),
    bestSplits: [faker.random.number(30000), faker.random.number(30000), faker.random.number(30000)],
    totalTime: faker.random.number(490000),
    lapCount: faker.random.number(30),
    lastSplitId: 0,
    ...overrides
  }
}

export function createLap(overrides: Partial<Lap> = {}){
  const line = createLeaderBoardLine();

  return {
    carId: line.car.carId,
    driverIndex: line.currentDriverIndex,
    laptime: line.timing.bestLap,
    isValidForBest: true,
    splits: line.timing.bestSplits,
    ...overrides,
  };
}

export function randomGt3CarModelId(): number {
  let index = Math.round(Math.random() * carsConfig.GT3.length - 1);
  if(index < 0) {
    index = 0;
  }
  return carsConfig.GT3[index];
}

export function randomGt4CarModelId(): number {
  let index = Math.round(Math.random() * carsConfig.GT4.length - 1);
  if(index < 0) {
    index = 0;
  }
  return carsConfig.GT4[index];
}