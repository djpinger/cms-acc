import { createGt3Car, createGt4Car, createLap, createLeaderBoardLine, createRaceOrQualifyResults } from "../testHelpers/mockRawData";
import { RawQualyResult } from "./modelsRaw";
import { qualifyingOrder } from "./qualifying";

describe('#qualifyingOrder', () => {
  it('should group GT3 cars', () => {
    const car1 = createGt3Car({
      carId: 2,
    });

    const car2 = createGt3Car({
      carId: 3,
    });
    const line1 = createLeaderBoardLine({
      car: car1
    });
    const line2 = createLeaderBoardLine({
      car: car2
    });
    const lapCar1 = createLap({
      carId: car1.carId
    });
    const lapCar2 = createLap({
      carId: car2.carId
    });
    const result = createRaceOrQualifyResults({
      sessionType: 'Q',
      leaderBoardLines: [line1, line2],
      overrides: {
        laps: [lapCar1, lapCar2]
      }
    }) as RawQualyResult;
    const order = qualifyingOrder(result);
    const driverIds = order.GT3.map(car => car.driverId);
    expect(driverIds).toContain(line1.currentDriver.playerId);
    expect(driverIds).toContain(line2.currentDriver.playerId);
  });

  it('should group GT4 cars', () => {
    const car1 = createGt4Car({
      carId: 2,
    });

    const car2 = createGt4Car({
      carId: 3,
    });
    const line1 = createLeaderBoardLine({
      car: car1
    });
    const line2 = createLeaderBoardLine({
      car: car2
    });
    const lapCar1 = createLap({
      carId: car1.carId
    });
    const lapCar2 = createLap({
      carId: car2.carId
    });
    const result = createRaceOrQualifyResults({
      sessionType: 'Q',
      leaderBoardLines: [line1, line2],
      overrides: {
        laps: [lapCar1, lapCar2]
      }
    }) as RawQualyResult;
    const order = qualifyingOrder(result);
    const driverIds = order.GT4.map(car => car.driverId);
    expect(driverIds).toContain(line1.currentDriver.playerId);
    expect(driverIds).toContain(line2.currentDriver.playerId);
  });

  it('should group GT3 and GT4 cars respectively', () => {
    const gt4Car1 = createGt4Car({
      carId: 2,
    });

    const gt4Car2 = createGt4Car({
      carId: 3,
    });

    const gt3Car1 = createGt3Car({
      carId: 4,
    });

    const gt3Car2 = createGt3Car({
      carId: 5,
    });
    const gt4Line1 = createLeaderBoardLine({
      car: gt4Car1
    });
    const gt4Line2 = createLeaderBoardLine({
      car: gt4Car2
    });
    const gt3Line1 = createLeaderBoardLine({
      car: gt3Car1
    });
    const gt3Line2 = createLeaderBoardLine({
      car: gt3Car2
    });
    const gt4Car1Lap = createLap({
      carId: gt4Car1.carId
    });
    const gt4Car2Lap = createLap({
      carId: gt4Car2.carId
    });
    const gt3Car1Lap = createLap({
      carId: gt3Car1.carId
    });
    const gt3Car2Lap = createLap({
      carId: gt3Car2.carId
    });
    const result = createRaceOrQualifyResults({
      sessionType: 'Q',
      leaderBoardLines: [gt3Line1, gt4Line1, gt3Line2, gt4Line2],
      overrides: {
        laps: [gt3Car1Lap, gt3Car2Lap, gt4Car1Lap, gt4Car2Lap]
      }
    }) as RawQualyResult;
    const order = qualifyingOrder(result);
    const driverIdsGT3 = order.GT3.map(car => car.driverId);
    expect(driverIdsGT3).toContain(gt3Line1.currentDriver.playerId);
    expect(driverIdsGT3).toContain(gt3Line2.currentDriver.playerId);
    
    const driverIdsGT4 = order.GT4.map(car => car.driverId);
    expect(driverIdsGT4).toContain(gt4Line1.currentDriver.playerId);
    expect(driverIdsGT4).toContain(gt4Line2.currentDriver.playerId);
  });

  it('should set the bestLap to fastest lap for driver', () => {
    const car1 = createGt4Car({
      carId: 2,
    });
    const line1 = createLeaderBoardLine({
      car: car1
    });
    const lap1 = createLap({
      carId: car1.carId,
      laptime: 120,
    });
    const lap2 = createLap({
      carId: car1.carId,
      laptime: 90,
    });
    const lap3 = createLap({
      carId: car1.carId,
      laptime: 100
    });
    const result = createRaceOrQualifyResults({
      sessionType: 'Q',
      leaderBoardLines: [line1],
      overrides: {
        laps: [lap1, lap2, lap3]
      }
    }) as RawQualyResult;
    const order = qualifyingOrder(result);
    expect(order.GT4[0].bestLap.lapTime).toEqual(90);
  });

  it('returns a qualifying position based on leaderboard order and class', () => {
    const carGT4_1 = createGt4Car({
      carId: 1,
    });
    const carGT4_2 = createGt4Car({
      carId: 2,
    });
    const carGT3_1 = createGt3Car({
      carId: 3,
    });
    const carGT3_2 = createGt3Car({
      carId: 4,
    });
    const lineGT4_1 = createLeaderBoardLine({
      car: carGT4_1
    });
    const lineGT4_2 = createLeaderBoardLine({
      car: carGT4_2
    });
    const lineGT3_1 = createLeaderBoardLine({
      car: carGT3_1
    });
    const lineGT3_2 = createLeaderBoardLine({
      car: carGT3_2
    });
    const gt3Car1Lap = createLap({
      carId: carGT3_1.carId
    });
    const gt3Car2Lap = createLap({
      carId: carGT3_2.carId,
    });
    const gt4Car1Lap = createLap({
      carId: carGT4_1.carId,
    });
    const gt4Car2Lap = createLap({
      carId: carGT4_2.carId,
    });
    const result = createRaceOrQualifyResults({
      sessionType: 'Q',
      leaderBoardLines: [lineGT3_2, lineGT3_1, lineGT4_1, lineGT4_2],
      overrides: {
        laps: [gt3Car1Lap, gt3Car2Lap, gt4Car1Lap, gt4Car2Lap]
      }
    }) as RawQualyResult;
    const order = qualifyingOrder(result);
    expect(order.GT3[0].position).toEqual(1);
    expect(order.GT3[0].driverId).toEqual(lineGT3_2.currentDriver.playerId);
    expect(order.GT3[1].position).toEqual(2);
    expect(order.GT3[1].driverId).toEqual(lineGT3_1.currentDriver.playerId);

    expect(order.GT4[0].driverId).toEqual(lineGT4_1.currentDriver.playerId);
    expect(order.GT4[0].position).toEqual(1);
    expect(order.GT4[1].driverId).toEqual(lineGT4_2.currentDriver.playerId);
    expect(order.GT4[1].position).toEqual(2);
  });
});