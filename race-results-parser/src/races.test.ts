import { createCar, createGt3Car, createGt4Car, createLap, createLeaderBoardLine, createRaceOrQualifyResults } from "../testHelpers/mockRawData";
import { complileRaces } from "./races";
import { TrackNames2019 } from "./tracks";
import * as qualifying from "./qualifying";
import * as finishingOrder from './finishingOrder';

describe('#complileRaces', () => {
  it('list which race of the round it is', () => {
    const qualifyingOrderMock = jest.spyOn(qualifying, 'qualifyingOrder').mockImplementation(() => [] as any);
    const finishingOrderMock = jest.spyOn(finishingOrder, 'finishingOrder').mockImplementation(() => [] as any);
    const results1 = createRaceOrQualifyResults({
      sessionType: 'R',
      trackName: TrackNames2019.Misano,
      leaderBoardLines: []
    });
    const results2 = createRaceOrQualifyResults({
      sessionType: 'R2',
      trackName: TrackNames2019.Misano,
      leaderBoardLines: []
    });
    const compiled = complileRaces([results1, results2]);

    expect(compiled[0].id).toEqual(TrackNames2019.Misano);
    expect(compiled[0].raceNumber).toEqual(1);
    expect(compiled[1].id).toEqual(TrackNames2019.Misano);
    expect(compiled[1].raceNumber).toEqual(2);

    qualifyingOrderMock.mockRestore();
    finishingOrderMock.mockRestore();
  });

  it('has a fastestLap for GT3', () => {
    const qualifyingOrderMock = jest.spyOn(qualifying, 'qualifyingOrder').mockImplementation(() => [] as any);
    const finishingOrderMock = jest.spyOn(finishingOrder, 'finishingOrder').mockImplementation(() => [] as any);
    const car1 = createGt3Car({
      carId: 1,
    });
    const car2 = createGt3Car({
      carId: 2,
    });
    const lap1 = createLap({ carId: car1.carId, laptime: 66 });
    const lap2 = createLap({ carId: car2.carId, laptime: 44 });
    const lap3 = createLap({ carId: car2.carId, laptime: 55 });
    const leaderBoardLine1 = createLeaderBoardLine({ car: car1 });
    const leaderBoardLine2 = createLeaderBoardLine({ car: car2 });
    const leaderBoardLines = [leaderBoardLine1, leaderBoardLine2];
    const results1 = createRaceOrQualifyResults({
      sessionType: 'R',
      trackName: TrackNames2019.Misano,
      leaderBoardLines,
      overrides: {
        laps: [lap1, lap2, lap3]
      }
    });
    const compiled = complileRaces([results1]);

    expect(compiled[0].fastestLap.GT3.lapTime).toEqual(lap2.laptime);
    expect(compiled[0].fastestLap.GT3.splits).toEqual(lap2.splits);
    expect(compiled[0].fastestLap.GT3.driverId).toEqual(leaderBoardLine2.currentDriver.playerId);

    qualifyingOrderMock.mockRestore();
    finishingOrderMock.mockRestore();
  });

  it('has a fastestLap for GT4', () => {
    const qualifyingOrderMock = jest.spyOn(qualifying, 'qualifyingOrder').mockImplementation(() => [] as any);
    const finishingOrderMock = jest.spyOn(finishingOrder, 'finishingOrder').mockImplementation(() => [] as any);
    const car1 = createGt4Car({
      carId: 1,
    });
    const car2 = createGt4Car({
      carId: 2,
    });
    const lap1 = createLap({ carId: car1.carId, laptime: 66 });
    const lap2 = createLap({ carId: car2.carId, laptime: 44 });
    const lap3 = createLap({ carId: car2.carId, laptime: 55 });
    const leaderBoardLine1 = createLeaderBoardLine({ car: car1 });
    const leaderBoardLine2 = createLeaderBoardLine({ car: car2 });
    const leaderBoardLines = [leaderBoardLine1, leaderBoardLine2];
    const results1 = createRaceOrQualifyResults({
      sessionType: 'R',
      trackName: TrackNames2019.Misano,
      leaderBoardLines,
      overrides: {
        laps: [lap1, lap2, lap3]
      }
    });
    const compiled = complileRaces([results1]);

    expect(compiled[0].fastestLap.GT4.lapTime).toEqual(lap2.laptime);
    expect(compiled[0].fastestLap.GT4.splits).toEqual(lap2.splits);
    expect(compiled[0].fastestLap.GT4.driverId).toEqual(leaderBoardLine2.currentDriver.playerId);

    qualifyingOrderMock.mockRestore();
    finishingOrderMock.mockRestore();
  });

  it('has the finishing order for GT3', () => {
    const qualifyingOrderMock = jest.spyOn(qualifying, 'qualifyingOrder').mockImplementation(() => [] as any);
    const car1 = createGt3Car({
      carId: 1,
    });
    const car2 = createGt3Car({
      carId: 2,
    });
    const leaderBoardLine1 = createLeaderBoardLine({ car: car1 });
    const leaderBoardLine2 = createLeaderBoardLine({ car: car2 });
    const leaderBoardLines = [leaderBoardLine1, leaderBoardLine2];
    const results1 = createRaceOrQualifyResults({
      sessionType: 'R',
      trackName: TrackNames2019.Misano,
      leaderBoardLines,
    });
    const compiled = complileRaces([results1]);

    expect(compiled[0].finishingOrder.GT3[0].driverId).toEqual(leaderBoardLine1.currentDriver.playerId);
    expect(compiled[0].finishingOrder.GT3[0].position).toEqual(1);
    expect(compiled[0].finishingOrder.GT3[1].driverId).toEqual(leaderBoardLine2.currentDriver.playerId);
    expect(compiled[0].finishingOrder.GT3[1].position).toEqual(2);
    
    qualifyingOrderMock.mockRestore();
  });

  it('has the finishing order for GT4', () => {
    const qualifyingOrderMock = jest.spyOn(qualifying, 'qualifyingOrder').mockImplementation(() => [] as any);
    const car1 = createGt4Car({
      carId: 1,
    });
    const car2 = createGt4Car({
      carId: 2,
    });
    const leaderBoardLine1 = createLeaderBoardLine({ car: car1 });
    const leaderBoardLine2 = createLeaderBoardLine({ car: car2 });
    const leaderBoardLines = [leaderBoardLine1, leaderBoardLine2];
    const results1 = createRaceOrQualifyResults({
      sessionType: 'R',
      trackName: TrackNames2019.Misano,
      leaderBoardLines,
    });
    const compiled = complileRaces([results1]);

    expect(compiled[0].finishingOrder.GT4[0].driverId).toEqual(leaderBoardLine1.currentDriver.playerId);
    expect(compiled[0].finishingOrder.GT4[0].position).toEqual(1);
    expect(compiled[0].finishingOrder.GT4[1].driverId).toEqual(leaderBoardLine2.currentDriver.playerId);
    expect(compiled[0].finishingOrder.GT4[1].position).toEqual(2);
    
    qualifyingOrderMock.mockRestore();
  });

  it('has a position for mixed class starting at postion 1', () => {
    const qualifyingOrderMock = jest.spyOn(qualifying, 'qualifyingOrder').mockImplementation(() => [] as any);
    const car1 = createGt3Car({
      carId: 1,
    });
    const car2 = createGt3Car({
      carId: 2,
    });
    const car3 = createGt4Car({
      carId: 3,
    });
    const car4 = createGt4Car({
      carId: 4,
    });
    const leaderBoardLine1 = createLeaderBoardLine({ car: car1 });
    const leaderBoardLine2 = createLeaderBoardLine({ car: car2 });
    const leaderBoardLine3 = createLeaderBoardLine({ car: car3 });
    const leaderBoardLine4 = createLeaderBoardLine({ car: car4 });
    // purposefully mixing gt3 and gt4 positions
    const leaderBoardLines = [leaderBoardLine1, leaderBoardLine3, leaderBoardLine2, leaderBoardLine4];
    const results1 = createRaceOrQualifyResults({
      sessionType: 'R',
      trackName: TrackNames2019.Misano,
      leaderBoardLines,
    });
    const compiled = complileRaces([results1]);

    expect(compiled[0].finishingOrder.GT3[0].driverId).toEqual(leaderBoardLine1.currentDriver.playerId);
    expect(compiled[0].finishingOrder.GT3[0].position).toEqual(1);
    expect(compiled[0].finishingOrder.GT3[1].driverId).toEqual(leaderBoardLine2.currentDriver.playerId);
    expect(compiled[0].finishingOrder.GT3[1].position).toEqual(2);

    expect(compiled[0].finishingOrder.GT4[0].driverId).toEqual(leaderBoardLine3.currentDriver.playerId);
    expect(compiled[0].finishingOrder.GT4[0].position).toEqual(1);
    expect(compiled[0].finishingOrder.GT4[1].driverId).toEqual(leaderBoardLine4.currentDriver.playerId);
    expect(compiled[0].finishingOrder.GT4[1].position).toEqual(2);
    
    qualifyingOrderMock.mockRestore();
  });

  it('has the qualifying order for GT3', () => {
    const car1 = createGt3Car({
      carId: 1,
    });
    const car2 = createGt3Car({
      carId: 2,
    });
    const leaderBoardLine1 = createLeaderBoardLine({ car: car1 });
    const leaderBoardLine2 = createLeaderBoardLine({ car: car2 });
    const raceResults = createRaceOrQualifyResults({
      sessionType: 'R',
      trackName: TrackNames2019.Misano,
      leaderBoardLines: [leaderBoardLine1, leaderBoardLine2],
    });
    const quallyResults = createRaceOrQualifyResults({
      sessionType: 'Q',
      trackName: TrackNames2019.Misano,
      leaderBoardLines: [leaderBoardLine2, leaderBoardLine1],
    });
    const compiled = complileRaces([raceResults, quallyResults]);
    expect(compiled[0].qualifyingOrder.GT3[0].driverId).toEqual(leaderBoardLine2.currentDriver.playerId);
    expect(compiled[0].qualifyingOrder.GT3[0].position).toEqual(1);
    expect(compiled[0].qualifyingOrder.GT3[1].driverId).toEqual(leaderBoardLine1.currentDriver.playerId);
    expect(compiled[0].qualifyingOrder.GT3[1].position).toEqual(2);
  });

  it('has the qualifying order for GT4', () => {
    const car1 = createGt4Car({
      carId: 1,
    });
    const car2 = createGt4Car({
      carId: 2,
    });
    const leaderBoardLine1 = createLeaderBoardLine({ car: car1 });
    const leaderBoardLine2 = createLeaderBoardLine({ car: car2 });
    const raceResults = createRaceOrQualifyResults({
      sessionType: 'R',
      trackName: TrackNames2019.Misano,
      leaderBoardLines: [leaderBoardLine1, leaderBoardLine2],
    });
    const quallyResults = createRaceOrQualifyResults({
      sessionType: 'Q',
      trackName: TrackNames2019.Misano,
      leaderBoardLines: [leaderBoardLine2, leaderBoardLine1],
    });
    const compiled = complileRaces([raceResults, quallyResults]);

    expect(compiled[0].qualifyingOrder.GT4[0].driverId).toEqual(leaderBoardLine2.currentDriver.playerId);
    expect(compiled[0].qualifyingOrder.GT4[0].position).toEqual(1);
    expect(compiled[0].qualifyingOrder.GT4[1].driverId).toEqual(leaderBoardLine1.currentDriver.playerId);
    expect(compiled[0].qualifyingOrder.GT4[1].position).toEqual(2);
  });

  it('has the qualifying order for mixed classes', () => {
    const GT3Car1 = createGt3Car({
      carId: 1,
    });
    const GT3Car2 = createGt3Car({
      carId: 2,
    });
    const GT4Car1 = createGt4Car({
      carId: 3,
    });
    const GT4Car2 = createGt4Car({
      carId: 4,
    });
    const GT3Line1 = createLeaderBoardLine({ car: GT3Car1 });
    const GT3Line2 = createLeaderBoardLine({ car: GT3Car2 });
    const GT4Line1 = createLeaderBoardLine({ car: GT4Car1 });
    const GT4Line2 = createLeaderBoardLine({ car: GT4Car2 });
    const raceResults = createRaceOrQualifyResults({
      sessionType: 'R',
      trackName: TrackNames2019.Misano,
      leaderBoardLines: [GT3Line2, GT3Line1, GT4Line1, GT4Line2],
    });
    const quallyResults = createRaceOrQualifyResults({
      sessionType: 'Q',
      trackName: TrackNames2019.Misano,
      leaderBoardLines: [GT3Line1, GT4Line1, GT3Line2, GT4Line2],
    });
    const compiled = complileRaces([raceResults, quallyResults]);

    expect(compiled[0].qualifyingOrder.GT3[0].driverId).toEqual(GT3Line1.currentDriver.playerId);
    expect(compiled[0].qualifyingOrder.GT3[0].position).toEqual(1);
    expect(compiled[0].qualifyingOrder.GT3[1].driverId).toEqual(GT3Line2.currentDriver.playerId);
    expect(compiled[0].qualifyingOrder.GT3[1].position).toEqual(2);

    expect(compiled[0].qualifyingOrder.GT4[0].driverId).toEqual(GT4Line1.currentDriver.playerId);
    expect(compiled[0].qualifyingOrder.GT4[0].position).toEqual(1);
    expect(compiled[0].qualifyingOrder.GT4[1].driverId).toEqual(GT4Line2.currentDriver.playerId);
    expect(compiled[0].qualifyingOrder.GT4[1].position).toEqual(2);
  });
});