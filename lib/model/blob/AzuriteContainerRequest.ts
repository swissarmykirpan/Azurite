import AzuriteRequest from "./AzuriteRequest";
import { Request } from "express-serve-static-core";
import { StorageEntityType } from "../../core/Constants";
const path = require("path"),
    env = require("./../../core/env");

class AzuriteContainerRequest extends AzuriteRequest {
    constructor(
        req: Request,
        payload = undefined) {

        super(req, StorageEntityType.Container, payload);

        this.containerName = req.params.container;
    }

    /**
     * Returns the full path on disk where the container (directory) will be created
     * (e.g. /home/user1/azurite-workspace/__blobstorage__/my-container)
     *
     * @returns full path to container
     * @memberof AzuriteContainerRequest
     */
    fullPath() {
        return path.join(env.localStoragePath, this.containerName);
    }
}

module.exports = AzuriteContainerRequest;