import axios from 'axios';
import * as dataService from './dataService';
import { AuthModel } from '../models/authModel';
import { ResultResponseModel } from '../models/raceEventModel';
require('dotenv').config()

//success status code for OK response
const successStatusCode: Number = 200;
//no content status code for request timed out
const noContentStatusCode: Number = 204;
//unauthorized status code for autherization failier
const unauthorizedStatusCode: Number = 401;

//authentication api request call
export const authRequest = async () => {
    const authData: AuthModel = {
        email: process.env.USER_NAME,
        password: process.env.PASSWORD
    };
    try {
        console.log(`/auth api is calling to get token`)
        const response = await axios.post(`${process.env.BASE_URL}/auth`, authData)
        return response.data.token
    } catch (err) {
        throw new Error(err);
    }
};

//results api request call
export const resultsRequest = async (token: string) => {
    const header = { headers: { Authorization: `Bearer ${token}` } };
    try {
        console.log(`/results api is calling with token`)
        const response = await axios.get(`${process.env.BASE_URL}/results`, header);
        await resultAction(response, token);
    } catch (err) {
        throw new Error(err);
    }
}

// initiate call for authentication and result api
export const initRequestService = async () => {
    const token = await authRequest();
    await resultsRequest(token)
}

// result action based on result api response
export const resultAction = async (res: ResultResponseModel, token: string) => {
    switch (res.status) {
        case successStatusCode:
            //save event result in databse on 200 response code
            console.log(`/results api response code ${successStatusCode}`)
            await dataService.saveResultEventData(res.data)
            break;
        case noContentStatusCode:
            //make a new request on 204 response code
            console.log(`/results api response code ${noContentStatusCode}`)
            await resultsRequest(token);
            break;
        case unauthorizedStatusCode:
            //reauthentication and make a new request with new token on 401 response code
            console.log(`/results api response code ${unauthorizedStatusCode}`)
            await initRequestService();
            break;
        default:
            throw new Error(`Recieved unexpected response code`);
    }
};
