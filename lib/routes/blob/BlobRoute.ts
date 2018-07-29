const env = from "./../../core/env"),
  BlobRequest = from "./../../model/blob/AzuriteBlobRequest"),
  AzuriteRequest = from "./../../model/blob/AzuriteRequest"),
  EntityType = from "./../../core/Constants").StorageEntityType,
  Serializers = from "./../../xml/Serializers"),
  Operations = from "./../../core/Constants").Operations;

/*
 * Route definitions for all operation on the "Blob" resource type.
 * See https://docs.microsoft.com/en-us/rest/api/storageservices/fileservices/blob-service-rest-api
 * for details on specification.
 */
export default app => {
  app
    .route(`/${env.emulatedStorageAccountName}/:container/*?`)
    .get((req, res, next) => {
      if (req.query.comp === "blocklist") {
        req.azuriteOperation = Operations.Blob.GET_BLOCK_LIST;
      } else if (req.query.comp === "metadata") {
        req.azuriteOperation = Operations.Blob.GET_BLOB_METADATA;
      } else if (req.query.comp === "pagelist") {
        req.azuriteOperation = Operations.Blob.GET_PAGE_RANGES;
      } else {
        req.azuriteOperation = Operations.Blob.GET_BLOB;
      }
      req.azuriteRequest = new BlobRequest({ req });
      next();
    })
    .head((req, res, next) => {
      req.azuriteOperation = Operations.Blob.GET_BLOB_PROPERTIES;
      req.azuriteRequest = new BlobRequest({ req });
      next();
    })
    .put((req, res, next) => {
      let entityType = null;
      if (req.query.comp === "block") {
        req.azuriteOperation = Operations.Blob.PUT_BLOCK;
        entityType = EntityType.BlockBlob;
      } else if (req.query.comp === "blocklist") {
        req.azuriteOperation = Operations.Blob.PUT_BLOCK_LIST;
        Serializers.deserializeBlockList(req.body).then(blocklist => {
          req.azuriteRequest = new BlobRequest({
            req,
            entityType: EntityType.BlockBlob,
            payload: blocklist
          });
          next();
        });
        return;
      } else if (req.query.comp === "page") {
        req.azuriteOperation = Operations.Blob.PUT_PAGE;
        entityType = EntityType.PageBlob;
      } else if (req.query.comp === "appendblock") {
        req.azuriteOperation = Operations.Blob.APPEND_BLOCK;
        entityType = EntityType.AppendBlob;
      } else if (req.query.comp === "snapshot") {
        req.azuriteOperation = Operations.Blob.SNAPSHOT_BLOB;
      } else if (req.query.comp === "lease") {
        req.azuriteOperation = Operations.Blob.LEASE_BLOB;
      } else if (req.query.comp === "metadata") {
        req.azuriteOperation = Operations.Blob.SET_BLOB_METADATA;
      } else if (req.query.comp === "properties") {
        req.azuriteOperation = Operations.Blob.SET_BLOB_PROPERTIES;
      } else if (req.query.comp === "copy") {
        req.azuriteOperation = Operations.Blob.ABORT_COPY_BLOB;
      } else if (req.headers["x-ms-copy-source"] !== undefined) {
        req.azuriteOperation = Operations.Blob.COPY_BLOB;
      } else {
        req.azuriteOperation = Operations.Blob.PUT_BLOB;
      }
      req.azuriteRequest = new BlobRequest({
        req,
        entityType
      });
      next();
    })
    .delete((req, res, next) => {
      req.azuriteOperation = Operations.Blob.DELETE_BLOB;
      req.azuriteRequest = new BlobRequest({ req });
      next();
    })
    .options((req, res, next) => {
      req.azuriteOperation = Operations.Account.PREFLIGHT_BLOB_REQUEST;
      req.azuriteRequest = new AzuriteRequest({ req });
      next();
    });
};
