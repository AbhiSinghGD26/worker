import { RaceEventModel } from '../models/raceEventModel';
const dataSchema = require('../models/workerResult')
const mongoose = require('mongoose');
require('dotenv').config()

//Connect to MongoDB database
if (process.env.NODE_ENV === 'production') {
    mongoose.connect(process.env.PRODUCTION_DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
} else {
    mongoose.connect(process.env.LOCAL_DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
    mongoose.set('debug', true);
}

export const saveResultEventData = async (eventResult?: RaceEventModel) => {
    if (!eventResult)
        throw new Error(`Event result is missing`);

        const horseRacing = new dataSchema(eventResult);
        await horseRacing.save();
        console.log(`Saved race event result in Mongo DB`)
};

//get event result by event name
export const getResultByName = async (eventName: string) => {
    return await dataSchema.findOne({ event: eventName });
};

//delete event result by event name
export const deleteResultByName = async (eventName: string) => {
    await dataSchema.deleteMany({ event: eventName });
};