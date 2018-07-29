import StorageEntityProxy from "./StorageEntityProxy";
import InternalAzuriteError from "../../core/InternalAzuriteError";
const etag = require("./../../core/utils").computeEtag;

/**
 * Serves as a blob proxy to the corresponding LokiJS object.
 *
 * @class BlobProxy
 */
class BlobProxy extends StorageEntityProxy {
    constructor(original: StorageEntityProxy, containerName: string) {
        super(original);
        if (!containerName) {
            throw new InternalAzuriteError("BlobProxy: missing containerName");
        }
    }

    /**
     * Updates and returns the strong ETag of the underlying blob.
     *
     * @returns
     * @memberof BlobProxy
     */
    updateETag() {
        const etagValue = etag(`${this.lastModified()}${JSON.stringify(this.metaProps)}${this.id}${this.meta.revision}`);
        this.etag = `${etagValue}`;
        return this.etag;
    }
}

module.exports = BlobProxy;