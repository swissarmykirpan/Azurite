const uuidV1 = require("uuid/v1");
import N from "../../core/HttpHeaderNames";
import { StorageEntityType } from "../../core/Constants";

class AzuriteResponse {
    private httpProps: any;
    constructor(private proxy ?: any, _payload ?: any, _query = {}, cors ?: any) {
        this.httpProps = {};
        if (this.proxy) {
            this.httpProps[N.ETAG] = `\"${this.proxy.etag}\"`;
            this.httpProps[N.LAST_MODIFIED] = this.proxy.lastModified();
            Object.keys(this.proxy.metaProps).forEach((key) => {
                this.httpProps[`x-ms-meta-${key}`] = this.proxy.metaProps[key];
            });

            if (this.proxy.entityType === StorageEntityType.AppendBlob) {
                this.httpProps[N.BLOB_COMMITTED_BLOCK_COUNT] = this.proxy[N.BLOB_COMMITTED_BLOCK_COUNT];
                this.httpProps[N.BLOB_APPEND_OFFSET] = this.proxy.size;
            }

            if (this.proxy.entityType === StorageEntityType.PageBlob) {
                this.httpProps[N.SEQUENCE_NUMBER] = this.proxy.sequenceNumber;
            }
        }
        this.httpProps[N.VERSION] = "2016-05-31";
        this.httpProps[N.DATE] = new Date().toUTCString();
        this.httpProps[N.CONTENT_LENGTH] = 0;
        this.httpProps[N.REQUEST_ID] = uuidV1();

        if (cors !== undefined) {
            this.httpProps[N.ACCESS_CONTROL_ALLOW_ORIGIN] = cors.origin;
            this.httpProps[N.ACCESS_CONTROL_EXPOSE_HEADERS] = cors.exposedHeaders;
            this.httpProps[N.ACCESS_CONTROL_ALLOW_CREDENTIALS] = true;
            this.httpProps[N.ACCESS_CONTROL_ALLOW_HEADERS] = cors.exposedHeaders;
        }
    }

    addHttpProperty(key: any, value: any) {
        if (value !== undefined) {
            this.httpProps[key] = value;
        }
    }

    sasOverrideHeaders(query: any) {
        this.addHttpProperty(N.CACHE_CONTROL, query.rscc);
        this.addHttpProperty(N.CONTENT_DISPOSITION, query.rscd);
        this.addHttpProperty(N.CONTENT_ENCODING, query.rsce);
        this.addHttpProperty(N.CONTENT_LANGUAGE, query.rscl);
        this.addHttpProperty(N.CONTENT_TYPE, query.rsct);
    }
}

export default AzuriteResponse;