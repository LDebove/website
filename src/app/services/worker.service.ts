import { Injectable } from '@angular/core';
import { WorkerData } from '../models/worker.model';

@Injectable({
  providedIn: 'root'
})
export class WorkerService {

  /**
   * calls a function inside a worker depending on the worker message passed in parameter
   * calls the callback function if no worker can be spawned
   * @param workerData object containing the path of the worker called and the message to be sent
   * @param callback function called if no worker can be spawned
   * @returns result of the function called
   */
  async callFunction<T>(workerData: WorkerData, callback: (...args: unknown[]) => T): Promise<T> {
    let response: T = {} as T;
    await new Promise<T>(resolve => {
      if (typeof Worker !== 'undefined') {
        let worker = new Worker(new URL(workerData.path, import.meta.url));
        worker.onmessage = ({ data }) => {
          if (data.function === workerData.message) {
            response = data.response;
            worker.terminate();
            resolve(response);
          }
        };
        worker.postMessage({
          function: workerData.message,
          params: [
            ...arguments[1]
          ]
        });
      } else {
        response = callback();
        resolve(response);
      }
    });
    return response;
  }
}
