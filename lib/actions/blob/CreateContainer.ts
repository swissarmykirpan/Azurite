import StorageManager from "../../core/blob/StorageManager";


class CreateContainer {
    constructor() {
    }

    process(azuriteRequest: any, res: any) {
        const storageManager = new StorageManager();
        storageManager.createContainer(azuriteRequest)
            .then((response: any) => {
                res.set(response.httpProps);
                res.status(201).send();
            });
    }
}

export default new CreateContainer();