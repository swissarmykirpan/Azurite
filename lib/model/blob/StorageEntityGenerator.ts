import AzuriteRequest from "./AzuriteRequest";
import {  } from "azure-storage";

const EntityType = require("./../../core/Constants").StorageEntityType,
    N = require("./../../core/HttpHeaderNames"),
    etag = require("./../../core/utils").computeEtag;

/**
 * Generates an according Storage Entity (@type Container or @type Blob) out of a @ref AzuriteRequest object.
 *
 * @class StorageEntityGenerator
 */

// interface StorageEntity {
//     metaProps: any;
//     name: string;
//     etag: string;
//     access: string;
// }

// class ContainerEntity implements StorageEntity {
//     etag: string = "";
//     name: string = "";
//     metaProps: any;
//     access: string = "";
// }

// class BlobEntity implements StorageEntity {
//     metaProps: any;
//     name: string = "";
//     etag: string = "";
//     access: string = "";
//     id: string = "";
// }

class StorageEntityGenerator {
    constructor() {
    }

    /**
     * Generates a persistable storage entity respresentation based on a @type AzuriteRequest object
     *
     * @returns
     * @memberof StorageEntityGenerator
     */
    generateStorageEntity(request: AzuriteRequest) {
        // let entity: StorageEntity;
        // // Common to all entities (containers and blobs)
        // entity.metaProps = request.metaProps;
        // entity.entityType = request.entityType;
        // entity.leaseState = "available";
        // entity.access = "private";

        // if (request.entityType === EntityType.Container) {
        //     entity = new ContainerEntity();
        //     entity.name = request.containerName;
        //     entity.access = request.httpProps[N.BLOB_PUBLIC_ACCESS];
        //     entity.etag = etag(`${new Date()}${JSON.stringify(entity.metaProps)}${request.containerName}`);
        // } else {
        //     entity = new BlobEntity();
        //     // Common to all blobs
        //     entity.name = request.blobName;
        //     entity.id = request.id;
        //     // Parent ID refers to the blob a block belongs to
        //     entity.parentId = request.parentId; entity.parentId === undefined ? delete entity.parentId : (() => {/*NOOP*/ });
        //     // Origin ID refers to the blob a snapshot belongs to
        //     entity.originId = request.originId; entity.originId === undefined ? delete entity.originId : (() => {/*NOOP*/ });
        //     entity.uri = request.uri;
        //     entity.snapshot = false;
        //     entity.committed = request.commit; // this is true per default
        //     entity.md5 = request.httpProps[N.CONTENT_MD5] || request.calculateContentMd5();
        //     entity.size = request.body ? request.body.length : 0;
        //     entity.etag = etag(`${Date.parse(new Date())}${JSON.stringify(entity.metaProps)}${request.id}`);
        //     // The following attributes are deleted if they are undefined
        //     entity.cacheControl = request.httpProps[N.CACHE_CONTROL]; entity.cacheControl === undefined ? delete entity.cacheControl : (() => {/*NOOP*/ });
        //     entity.contentType = request.httpProps[N.CONTENT_TYPE]; entity.contentType === undefined ? delete entity.contentType : (() => {/*NOOP*/ });
        //     entity.contentEncoding = request.httpProps[N.CONTENT_ENCODING]; entity.contentEncoding === undefined ? delete entity.contentEncoding : (() => {/*NOOP*/ });
        //     entity.contentLanguage = request.httpProps[N.CONTENT_LANGUAGE]; entity.contentLanguage === undefined ? delete entity.contentLanguage : (() => {/*NOOP*/ });
        //     entity.contentDisposition = request.httpProps[N.CONTENT_DISPOSITION]; entity.contentDisposition === undefined ? delete entity.contentDisposition : (() => {/*NOOP*/ });
        //     entity.md5 = request.httpProps[N.CONTENT_MD5]; entity.md5 === undefined ? delete entity.md5 : (() => {/*NOOP*/ });
        // }
        // // Specific to Append Blobs
        // if (request.entityType === EntityType.AppendBlob) {
        //     entity[N.BLOB_COMMITTED_BLOCK_COUNT] = 0;
        //     // According to https://docs.microsoft.com/en-us/rest/api/storageservices/append-block the MD5 hash which is
        //     // optionally set in Content-MD5 header is not stored with the blob, thus we delete it.
        //     delete entity.md5;
        // }
        // // Specific to Block Blobs that are potentially part of a commit
        // else if (request.entityType === EntityType.BlockBlob && request.blockId !== undefined) {
        //     entity.blockId = request.blockId;
        //     // entity.parent = `${request.containerName}-${request.blobName}`;
        //     // entity.name = `${entity.parent}-${entity.blockId}`;
        //     entity.committed = false;
        // }
        // // Specific to Page Blobs
        // else if (request.entityType === EntityType.PageBlob) {
        //     entity.size = request.httpProps[N.BLOB_CONTENT_LENGTH];
        //     entity.sequenceNumber = 0;
        //     // MD5 calculation of a page blob seems to be wrong, thus deleting it for now...
        //     delete entity.md5;
        // }
        // return entity;
    }
}

module.exports = new StorageEntityGenerator();