import InternalAzuriteError from "../../core/InternalAzuriteError";

/**
 * DO NOT INSTANTIATE.
 * Serves as the base class proxy to the corresponding LokiJS object, which could be either a container or a blob.
 *
 * @class StorageEntityProxy
 */
export default class StorageEntityProxy {
    private leaseState: string;
    private leaseBrokenAt: any;
    protected meta: any;
    private leaseExpiredAt: any;
    protected metaProps: any[];
    protected id: any;
    protected etag: any;

    constructor(private original: StorageEntityProxy) {
        if (!original) {
            throw new InternalAzuriteError("StorageEntityProxy: missing original");
        }
        this.leaseState = original.leaseState;
        this.leaseBrokenAt = original.leaseBrokenAt;
        this.meta = original.meta;
        this.leaseExpiredAt = original.leaseExpiredAt;
        this.metaProps = original.metaProps;
        this.id = original.id;
        this.etag = original.etag;
    }

    release() {
        this.updateLeaseState();
        this.updateETag();
        return this.original;
    }

    /**
     * Updates and returns the lease state of the storage item based on its internal state.
     * Changes to the underlying LokiJS object are automatically persisted by LokiJS.
     *
     * @returns
     * @memberof StorageEntityProxy
     */
    updateLeaseState() {
        const now = Date.now();
        switch (this.leaseState) {
            // Has breaking period expired?
            case "breaking":
                this.leaseState = (this.leaseBrokenAt <= now) ? "broken" : "breaking";
                break;
            // Has lease expired?
            case "leased":
                // Infinite Lease
                if (this.leaseExpiredAt === -1) {
                    this.leaseState = "leased";
                } else {
                    this.leaseState = (this.leaseExpiredAt <= now) ? "expired" : "leased";
                }
                break;
            default:
                this.leaseState = this.leaseState || "available";
        }
        return this.leaseState;
    }

    updateETag() {
        throw new InternalAzuriteError("updateETag not implemented!");
    }

    /**
     * Returns the date and time the storage entity was last modified. The date format follows RFC 1123.
     *
     * @returns
     * @memberof StorageEntityProxy
     */
    lastModified() {
        return new Date(this.original.meta.updated || this.original.meta.created).toUTCString();
    }
}

module.exports = StorageEntityProxy;