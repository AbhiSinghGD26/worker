import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import * as requestService from '../service/requestService';
import * as dataService from '../service/dataService';
import {RaceEventModel} from '../models/raceEventModel';
jest.useFakeTimers();

describe("test request service", () => {
    const mock = new MockAdapter(axios);
    const token = 'test-token';
    const authResponceData = { token: token };
    const eventName ='test-request-service-event-name';
    const resultResponseData:RaceEventModel = { event: eventName, time: 100, horse: { id: 1, name: 'test-horse-name' } };

    describe("auth request", () => {

        it("should get data from auth request", async () => {
            //Arrange
            mock.onPost(`${process.env.BASE_URL}/auth`).reply(200, authResponceData);

            //Act 
            const token = await requestService.authRequest();

            //Assert
            expect(mock.history.post.length).toBe(1)
            expect(token).toBe(authResponceData.token);
        });

        it("should throw error while auth request not connect", async () => {
            //Arrange
            mock.onPost(`${process.env.BASE_URL}/auth`).timeout();

            //Act & Assert
            expect(mock.history.post.length).toBe(0)
            await expect(requestService.authRequest()).rejects.toThrow();
        });
    });

    describe("event result request", () => {
        // integration test against the database
        it("should save data by result request (integration test against the database)", async () => {
            //Arrange
            mock.onGet(`${process.env.BASE_URL}/results`).reply(200, resultResponseData);
            //const mockSaveResultEventData = jest.spyOn(dataService, 'saveResultEventData');

            //Act 
            await requestService.resultsRequest(token);
            const result = await dataService.getResultByName(eventName)


            //Assert
            expect(mock.history.get.length).toBe(1)
           // expect(mockSaveResultEventData).toHaveBeenCalled();
            expect(result.event).toBe(resultResponseData.event);
            expect(result.time).toBe(resultResponseData.time);

           //data cleanup after perform test
           await dataService.deleteResultByName(eventName);
        });

        it("should throw error while auth request not connect", async () => {
            //Arrange
            mock.onGet(`${process.env.BASE_URL}/results`).timeout();

            //Act & Assert
            expect(mock.history.post.length).toBe(0)
            await expect(requestService.resultsRequest(token)).rejects.toThrow();
        });
    });

    describe("responce action for reslt request", () => {
        let mockSaveResultEventData: any;
         beforeEach(()=>{
            //create mock function of data service to perform unit test
            mockSaveResultEventData = jest.spyOn(dataService, 'saveResultEventData').mockImplementation();
         })

        it("should call again result request if response is 200", async () => {
            //Arrange
            const response = { status: 200 }

            //Act 
            await requestService.resultAction(response, token);

            //Assert
            expect(mockSaveResultEventData).toHaveBeenCalled();

        });

        it("should call again result request if response is 204", async () => {
            //Arrange
            const response = { status: 204 }
            mock.onGet(`${process.env.BASE_URL}/results`).reply(200, resultResponseData);

            //Act 
            await requestService.resultAction(response, token);

            //Assert
            expect(mock.history.get.length).toBe(1)
            expect(mockSaveResultEventData).toHaveBeenCalled();
        });

        it("should call auth request and then result request if response is 401", async () => {
            //Arrange
            const response = { status: 401 }
            mock.onPost(`${process.env.BASE_URL}/auth`).reply(200, authResponceData);
            mock.onGet(`${process.env.BASE_URL}/results`).reply(200, resultResponseData);

            //Act 
            await requestService.resultAction(response, token);

            //Assert
            expect(mock.history.post.length).toBe(1)
            expect(mock.history.get.length).toBe(1)
            expect(mockSaveResultEventData).toHaveBeenCalled()
        });
        it("should throw error for unexpected response code(203)", async () => {
            //Arrange
            const response = { status: 203 }
            const errorMessage: string = "Recieved unexpected response code";

            //Act & Assert
            await expect(requestService.resultAction(response, token)).rejects.toThrow(errorMessage);

        });
        afterEach(() => {
            //mock restore for dataservice
            mockSaveResultEventData.mockRestore();
        });
    });
    afterEach(() => {
        //reset mock axios request api call history
        mock.resetHistory();
    });
});