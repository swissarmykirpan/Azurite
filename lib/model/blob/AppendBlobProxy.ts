const BlobProxy = require("./BlobProxy"),
    HeaderNames = require("./../../core/HttpHeaderNames");

/**
 * Serves as a Append blob proxy to the corresponding LokiJS object.
 *
 * @class AppendBlobProxy
 */
export default class AppendBlobProxy extends BlobProxy {
    constructor(original, containerName) {
        super(original, container);
    }

    incrementCommittedBlockCount() {
        this.original[HeaderNames.BLOB_COMMITTED_BLOCK_COUNT] += 1;
    }
}
