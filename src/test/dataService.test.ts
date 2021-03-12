import {RaceEventModel} from '../models/raceEventModel';
const { saveResultEventData,deleteResultByName, getResultByName } = require('../service/dataService');
const dataSchema = require('../models/workerResult')

describe("test data service", () => {
    jest.useFakeTimers();
    const eventName ='test-data-service-event-name';

    it("should insert event with valid data", async () => {
        //Arrange
        const eventData: RaceEventModel = { event: eventName, time: 100, horse: { id: 1, name: 'test-horse-name' } };

        //Act 
        await saveResultEventData(eventData)
        const result = await getResultByName(eventName)

        //Assert
        expect(result.event).toBe(eventData.event);
        expect(result.time).toBe(eventData.time);

        // data cleanup after perform test
        await deleteResultByName(eventName);
    });

    it("should throw error with invalid data", async () => {
        //Arrange
        const eventData: any = null;
        const errorMessage: string = "Event result is missing";

        //Act & Assert
        await expect(saveResultEventData(eventData)).rejects.toThrow(errorMessage);
    });
});