//race event model to use get data from results api
export interface RaceEventModel {
    event: String;
    time: Number;
    horse: HorseModel
}

//horse model
export interface HorseModel {
    id: Number;
    name: String;
}

//result response model
export interface ResultResponseModel {
    status: Number;
    data?: RaceEventModel;
}