import { createCar, createLap, createLeaderBoardLine, createRaceOrQualifyResults } from "../testHelpers/mockRawData";
import { finishingOrder } from "./finishingOrder";

describe('#finisingOrder', () => {
  it('should group GT3 cars', () => {
    const car1 = createCar({
      carModel: 24
    });
    const car2 = createCar({
      carModel: 25
    });
    const leaderBoardLine1 = createLeaderBoardLine({ car: car1 });
    const leaderBoardLine2 = createLeaderBoardLine({ car: car2 });
    const leaderBoardLines = [leaderBoardLine1, leaderBoardLine2]
    const result = createRaceOrQualifyResults({
      leaderBoardLines
    });
    const order = finishingOrder(result);
    const driverIds = order.GT3.map(car => car.driverId);
    expect(driverIds).toContain(leaderBoardLine1.currentDriver.playerId);
    expect(driverIds).toContain(leaderBoardLine2.currentDriver.playerId);
  });

  it('should group GT4 cars', () => {
    const car1 = createCar({
      carModel: 50
    });
    const car2 = createCar({
      carModel: 51
    });
    const leaderBoardLine1 = createLeaderBoardLine({ car: car1 });
    const leaderBoardLine2 = createLeaderBoardLine({ car: car2 });
    const leaderBoardLines = [leaderBoardLine1, leaderBoardLine2]
    const result = createRaceOrQualifyResults({
      leaderBoardLines
    });
    const order = finishingOrder(result);
    const driverIds = order.GT4.map(car => car.driverId);
    expect(driverIds).toContain(leaderBoardLine1.currentDriver.playerId);
    expect(driverIds).toContain(leaderBoardLine2.currentDriver.playerId);
  });

  it('should group GT3 and GT4 cars respectively', () => {
    const carGT31 = createCar({
      carModel: 1
    });
    const carGT32 = createCar({
      carModel: 2
    });
    const carGT41 = createCar({
      carModel: 50
    });
    const carGT42 = createCar({
      carModel: 51
    });
    const leaderBoardLine1 = createLeaderBoardLine({ car: carGT31 });
    const leaderBoardLine2 = createLeaderBoardLine({ car: carGT32 });
    const leaderBoardLine3 = createLeaderBoardLine({ car: carGT41 });
    const leaderBoardLine4 = createLeaderBoardLine({ car: carGT42 });
    const leaderBoardLines = [leaderBoardLine1, leaderBoardLine2, leaderBoardLine3, leaderBoardLine4]
    const result = createRaceOrQualifyResults({
      leaderBoardLines
    });
    const order = finishingOrder(result);
    const driverIdsGT3 = order.GT3.map(car => car.driverId);
    expect(driverIdsGT3).toContain(leaderBoardLine1.currentDriver.playerId);
    expect(driverIdsGT3).toContain(leaderBoardLine2.currentDriver.playerId);

    const driverIdsGT4 = order.GT4.map(car => car.driverId);
    expect(driverIdsGT4).toContain(leaderBoardLine3.currentDriver.playerId);
    expect(driverIdsGT4).toContain(leaderBoardLine4.currentDriver.playerId);
  });

  it('should have laps only for the matching car', () => {
    const car1 = createCar({
      carId: 1,
      carModel: 50
    });
    const car2 = createCar({
      carId: 2,
      carModel: 51
    });
    const leaderBoardLine1 = createLeaderBoardLine({ car: car1 });
    const leaderBoardLine2 = createLeaderBoardLine({ car: car2 });
    const leaderBoardLines = [leaderBoardLine1, leaderBoardLine2];
    const car1Lap = createLap({
      carId: car1.carId,
      laptime: 12,
    });
    const car2Lap = createLap({
      carId: car2.carId,
      laptime: 55,
    });
    const result = createRaceOrQualifyResults({
      leaderBoardLines,
      overrides: {
        laps: [car1Lap, car2Lap]
      }
    });
    const order = finishingOrder(result);
    expect(order.GT4[0].laps.length).toEqual(1);
    expect(order.GT4[0].laps[0].lapTime).toEqual(car1Lap.laptime);
    expect(order.GT4[1].laps.length).toEqual(1);
    expect(order.GT4[1].laps[0].lapTime).toEqual(car2Lap.laptime);
  });
});