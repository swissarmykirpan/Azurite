import { StorageError } from "azure-storage";

export async function asyncIt<T>(call: (serviceCallback: (error: StorageError, result: T) => void) => void): Promise<T> {
    return new Promise<T>((resolve, reject) => {
        try {
            call((error, result) => {
                if (error) { reject(error); }
                resolve(result);
            });
        } catch (err) {
            reject(err);
        }
    });
}