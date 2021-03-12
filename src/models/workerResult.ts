import mongoose from 'mongoose';

//horse schema of Mongo DB
const horseSchema = new mongoose.Schema({
    id:{
        type:Number,
        required: true,
    },
    name:{
        type:String,
        required: true,
    }
})

//event result schema of Mongo DB
const resultSchema = new mongoose.Schema({
    event:{
        type:String,
        required: true,
    },
    time:{
        type:Number,
        required: true,
    },
    horse:[horseSchema]
})

module.exports = mongoose.model('workerResult', resultSchema)
