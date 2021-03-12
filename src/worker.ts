import { workerData, parentPort } from 'worker_threads';
import { authRequest, resultsRequest } from './service/requestService'

//get request call limit from workerdata
const { requestCallLimit: requestCallLimit } = workerData as { requestCallLimit: number };

//request worker to all api to get event data
const requestWorker = async (requestCallLimit: number) => {
    return new Promise(async (resolve, reject) => {
        //added console log to view progress in output window
        console.log(`Worker has started`)
        try {
            const token = await authRequest();
            for (let i = 0; i < requestCallLimit; i++) {
                console.log(`Worker is runing..(${i + 1} out of ${requestCallLimit})request`)
                await resultsRequest(token);
            }
            await resolve(requestCallLimit);
        } catch (err) {
            await reject(err);
        }
    });
};

// execute rquest worker
(async () => {
    const response = await requestWorker(requestCallLimit);
    if (parentPort) {
        parentPort.postMessage(`Worker has compleated task for ${response} request call`);
    }
})();