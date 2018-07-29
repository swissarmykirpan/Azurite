import storageManager from "./../../core/blob/StorageManager";
import N from "./../../core/HttpHeaderNames";

class AbortCopyBlob {
  public process(azuriteRequest, res) {
    storageManager.copyBlob(azuriteRequest).then(response => {
      res.status(204).send();
    });
  }
}

export default new AbortCopyBlob();
