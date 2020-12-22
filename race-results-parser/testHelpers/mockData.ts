import * as faker from "faker";
import { Car, ConsolidatedRaceDriver, Driver, LeaderBoardLine, ParsedClassDataClass, PlayerPoints, RawRaceOrQualifyResult, SeasonConfig, Timing } from "../src/models";

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

export function createRaceResults(drivers: LeaderBoardLine[]): RawRaceOrQualifyResult {
  const laps = drivers.map(function (driver) {
    return {
      carId: driver.car.carId,
      driverIndex: driver.currentDriverIndex,
      laptime: driver.timing.bestLap,
      isValidForBest: true,
      splits: driver.timing.bestSplits,
    };
  });
  return {
    sessionType: "R",
    trackName: "zolder_2019",
    sessionIndex: 2,
    raceWeekendIndex: 0,
    metaData: "zolder_2019",
    serverName:
      "cmsracing.com - Monday Night Racing - Round 1 at Zolder - Split 2",
    sessionResult: {
      bestlap: 89265,
      bestSplits: [30315, 29034, 29802],
      isWetSession: 0,
      type: 1,
      leaderBoardLines: drivers,
    },
    laps,
    penalties: [],
    post_race_penalties: [],
  };
}

export function createParsedClassDataClass(leaderBoardLines: LeaderBoardLine[]): ParsedClassDataClass {
  const laps = leaderBoardLines.map(function (driver) {
    return {
      carId: driver.car.carId,
      driverIndex: driver.currentDriverIndex,
      laptime: driver.timing.bestLap,
      isValidForBest: true,
      splits: driver.timing.bestSplits,
    };
  });
  return {
    leaderBoardLines: leaderBoardLines,
    laps,
  };
}

export function createCar(overrides = {}): Car {
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

export function createDriver(overrides: Partial<Driver> = {}): Driver{
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
    timing: {
      lastLap: 92397,
      lastSplits: [31449, 29787, 31161],
      bestLap: 90717,
      bestSplits: [30801, 29445, 30045],
      totalTime: 4509977,
      lapCount: 48,
      lastSplitId: 0,
    },
    missingMandatoryPitstop: 0,
    driverTotalTimes: [4421053.0],
    ...overrides,
  };
}

export function createTiming(overrides: Partial<Timing> = {}): Timing{
  return {
    lastLap: 92397,
    lastSplits: [31449, 29787, 31161],
    bestLap: 90717,
    bestSplits: [30801, 29445, 30045],
    totalTime: 4509977,
    lapCount: 48,
    lastSplitId: 0,
    ...overrides
  }
}

export function createConsolidatedRaceResultsDriver(overrides: Partial<ConsolidatedRaceDriver> = {}): ConsolidatedRaceDriver {
  return {
    carNumber: faker.random.number(999),
    carModels: [1, 1, 1],
    name: faker.name.findName(),
    finishingPositions: [1, 2, 10],
    racePoints: [36, 30, 9],
    playerId: createPlayerId(),
    ...overrides,
  };
}

export function createPlayerPoints(overrides: Partial<PlayerPoints> = {}): PlayerPoints {
  return {
    playerId: createPlayerId(),
    points: 5,
    ...overrides,
  }
}