import { Worker } from 'worker_threads';
require('dotenv').config()

//default value for request limit count
const defaultRequestLimit:Number = 10;

//get request call limit from process argument or config
const requestCallLimit = process.env.REQUEST_LIMIT || defaultRequestLimit;

//worker service to execute worker request
const workerService = (workerData: { requestCallLimit: number }) => {
    return new Promise((resolve, reject) => {
        //here added commpiled ./dist/worker.js file path (*.ts is not supporting in worker_threads)
        const requestWorker = new Worker('./dist/worker.js', {
            workerData
        });

        workerShutdownHandler(requestWorker);
        requestWorker.on('message', resolve);
        requestWorker.on('error', reject);
        requestWorker.on('exit', (code) => {
            if (code !== 0) {
                reject(new Error(`Worker has exit with code ${code}`));
            }
        });
    });
}

//gracefully shutdown worker application
function workerShutdownHandler(requestWorker: Worker) {
    const cleanup = () => {
        console.info('gracefully shutdown worker app');
        requestWorker.terminate();
        process.exit(0);
    };

    process.on('SIGTERM', cleanup);
};

//execute worker service
const executeWorker = async () => {
    const response = await workerService({ requestCallLimit: +requestCallLimit });
    console.log(response);
    process.exit(0);
}
executeWorker().catch(error => console.error(error));
