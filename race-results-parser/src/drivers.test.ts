import {
  createCar,
  createDriver,
  createLeaderBoardLine,
  createRaceOrQualifyResults,
  createSeasonConfig,
} from "../testHelpers/mockRawData";
import { compileDrivers } from "./drivers";
import { TrackNames2019 } from "./tracks";

describe("compileDrivers", () => {
  it('should get the appropriate car class based on carModel', () => {
    const driverGT3 = createDriver();
    const driverGT4 = createDriver();
    const carGT3 = createCar({
      carModel: 1,
      drivers: [driverGT3],
    });
    const carGT4 = createCar({
      carModel: 50,
      drivers: [driverGT4],
    });
    const leaderboardLineLagunaGT3 = createLeaderBoardLine({
      car: carGT3,
      currentDriver: driverGT3,
    });
    const leaderboardLineLagunaGT4 = createLeaderBoardLine({
      car: carGT4,
      currentDriver: driverGT4,
    });
    const raceResult = createRaceOrQualifyResults({
      trackName: TrackNames2019.LagunaSeca,
      leaderBoardLines: [leaderboardLineLagunaGT3, leaderboardLineLagunaGT4],
    });
    const result = compileDrivers([raceResult]);
    expect(result[driverGT3.playerId].currentCar.class).toEqual('GT3');
    expect(result[driverGT4.playerId].currentCar.class).toEqual('GT4');
  });

  it("should list drivers that have not competed in all races", () => {
    const driver = createDriver();
    const car = createCar({
      carModel: 1,
      drivers: [driver],
    });
    const leaderboardLineLaguna = createLeaderBoardLine({
      car: car,
      currentDriver: driver,
    });
    const leaderboardLineZolder = createLeaderBoardLine();
    const raceResult1 = createRaceOrQualifyResults({
      trackName: TrackNames2019.LagunaSeca,
      leaderBoardLines: [leaderboardLineLaguna],
    });
    const raceResult2 = createRaceOrQualifyResults({
      trackName: TrackNames2019.Zolder,
      leaderBoardLines: [leaderboardLineZolder],
    });
    const result = compileDrivers([raceResult1, raceResult2]);
    expect(result[driver.playerId]).toBeDefined();
  });

  it("should omit results that are NOT race results", () => {
    const driver = createDriver();
    const car1 = createCar({
      carModel: 1,
      drivers: [driver],
    });
    const car2 = createCar({
      carModel: 2,
      drivers: [driver],
    });
    const leaderboardLineLagunaQually = createLeaderBoardLine({
      car: car2,
      currentDriver: driver,
    });
    const leaderboardLineLagunaRace = createLeaderBoardLine({
      car: car1,
      currentDriver: driver,
    });
    const raceResult = createRaceOrQualifyResults({
      sessionType: "R",
      trackName: TrackNames2019.LagunaSeca,
      leaderBoardLines: [leaderboardLineLagunaRace],
    });
    const quallyResult = createRaceOrQualifyResults({
      sessionType: "Q",
      trackName: TrackNames2019.LagunaSeca,
      leaderBoardLines: [leaderboardLineLagunaQually],
    });
    const result = compileDrivers([quallyResult, raceResult]);
    const carModelIds = result[driver.playerId].cars.map((car) => car.modelId);
    expect(carModelIds).toContain(car1.carModel);
    expect(carModelIds).not.toContain(car2.carModel);
  });

  it("should omit drivers that didn't run any laps", () => {
    const driver = createDriver();
    const car = createCar({
      carModel: 1,
      drivers: [driver],
    });
    const leaderboardLineLaguna = createLeaderBoardLine({
      car: car,
      currentDriver: driver,
    });
    const raceResult = createRaceOrQualifyResults({
      trackName: TrackNames2019.LagunaSeca,
      leaderBoardLines: [leaderboardLineLaguna],
      overrides: {
        laps: [],
      },
    });
    const result = compileDrivers([raceResult]);
    expect(result[driver.playerId]).toBeUndefined();
  });

  describe(".cars", () => {
    it("has a car for each car used", () => {
      const driver = createDriver();
      const car1 = createCar({
        carModel: 1,
        drivers: [driver],
      });
      const car2 = createCar({
        carModel: 2,
        drivers: [driver],
      });
      const leaderboardLineLaguna = createLeaderBoardLine({
        car: car1,
        currentDriver: driver,
      });
      const leaderboardLineZolder = createLeaderBoardLine({
        car: car2,
        currentDriver: driver,
      });
      const raceResult1 = createRaceOrQualifyResults({
        trackName: TrackNames2019.LagunaSeca,
        leaderBoardLines: [leaderboardLineLaguna],
      });
      const raceResult2 = createRaceOrQualifyResults({
        trackName: TrackNames2019.Zolder,
        leaderBoardLines: [leaderboardLineZolder],
      });
      const result = compileDrivers([raceResult1, raceResult2]);
      const carModelIds = result[driver.playerId].cars.map(
        (car) => car.modelId
      );
      expect(carModelIds).toContain(car1.carModel);
      expect(carModelIds).toContain(car2.carModel);
    });

    it('should only have unique values', () => {
      const driver = createDriver();
      const car1 = createCar({
        carModel: 1,
        drivers: [driver],
      });
      const car2 = createCar({
        carModel: 2,
        drivers: [driver],
      });
      const leaderboardLineLaguna = createLeaderBoardLine({
        car: car1,
        currentDriver: driver,
      });
      const leaderboardLineZolder = createLeaderBoardLine({
        car: car2,
        currentDriver: driver,
      });
      const leaderboardLineMisano = createLeaderBoardLine({
        car: car1,
        currentDriver: driver,
      });
      const raceResultLaguna = createRaceOrQualifyResults({
        trackName: TrackNames2019.LagunaSeca,
        leaderBoardLines: [leaderboardLineLaguna],
      });
      const raceResultZolder = createRaceOrQualifyResults({
        trackName: TrackNames2019.Zolder,
        leaderBoardLines: [leaderboardLineZolder],
      });
      const raceResultMisano = createRaceOrQualifyResults({
        trackName: TrackNames2019.Misano,
        leaderBoardLines: [leaderboardLineMisano],
      });
      const result = compileDrivers([raceResultLaguna, raceResultZolder, raceResultMisano]);
      const carModelIds = result[driver.playerId].cars.map(
        (car) => car.modelId
      );
      expect(result[driver.playerId].cars.length).toEqual(2);
    });
  });

  describe(".currentCar", () => {
    it("should be the last car used based on the race order within seasonConfig ", () => {
      const seasonConfig = createSeasonConfig({
        races: [
          {
            trackName: TrackNames2019.Zolder,
            name: "Zolder",
            format: "multiSprint",
            numberOfRaces: 1,
          },
          {
            trackName: TrackNames2019.LagunaSeca,
            name: "Laguna Seca",
            format: "endurance",
            numberOfRaces: 1,
          },
        ],
      });
      const driver = createDriver();
      const car1 = createCar({
        carModel: 1,
        drivers: [driver],
      });
      const car2 = createCar({
        carModel: 2,
        drivers: [driver],
      });
      const leaderboardLineLaguna = createLeaderBoardLine({
        car: car1,
        currentDriver: driver,
      });
      const leaderboardLineZolder = createLeaderBoardLine({
        car: car2,
        currentDriver: driver,
      });
      const raceResultLaguna = createRaceOrQualifyResults({
        trackName: seasonConfig.races[1].trackName,
        leaderBoardLines: [leaderboardLineLaguna],
      });
      const raceResultZolder = createRaceOrQualifyResults({
        trackName: seasonConfig.races[0].trackName,
        leaderBoardLines: [leaderboardLineZolder],
      });
      // race results out of order on purpose to ensure properly checking for currentCar
      // since this could happen when just globbing a dir
      const result = compileDrivers([raceResultLaguna, raceResultZolder]);
      expect(result[driver.playerId].currentCar.modelId).toEqual(car1.carModel);
    });
  });

  describe(".splits", () => {
    it("should list all splits the driver has participated in", () => {
      const driver = createDriver();
      const car = createCar({
        carModel: 1,
        drivers: [driver],
      });
      const leaderboardLineLaguna = createLeaderBoardLine({
        car: car,
        currentDriver: driver,
      });
      const leaderboardLineZolder = createLeaderBoardLine({
        car: car,
        currentDriver: driver,
      });
      const raceResultLaguna = createRaceOrQualifyResults({
        trackName: TrackNames2019.LagunaSeca,
        leaderBoardLines: [leaderboardLineLaguna],
        split: 2,
      });
      const raceResultZolder = createRaceOrQualifyResults({
        trackName: TrackNames2019.Zolder,
        leaderBoardLines: [leaderboardLineZolder],
        split: 1,
      });
      // race results out of order on purpose to ensure properly checking for currentCar
      // since this could happen when just globbing a dir
      const result = compileDrivers([raceResultLaguna, raceResultZolder]);
      expect(result[driver.playerId].splits).toContain(1);
      expect(result[driver.playerId].splits).toContain(2);
    });
  });
});
