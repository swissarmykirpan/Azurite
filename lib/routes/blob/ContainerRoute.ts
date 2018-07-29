import * as express from "express";
import { Request, Response, NextFunction } from "express-serve-static-core";

const ContainerRequest = require("./../../model/blob/AzuriteContainerRequest"),
    env = require("./../../core/env"),
    Serializers = require("./../../xml/Serializers"),
    Operations = require("./../../core/Constants").Operations;

// Possibly implicit call to blob in $root container
const REWRITE_URL_AND_FORWARD_TO_BLOB_ROUTE = (req: Request, next: NextFunction) => {
    req.url = req.url.replace(req.params.container, `$root/${req.params.container}`);
    next("route");
};

/*
 * Route definitions for all operation on the 'Container' resource type.
 * See https://docs.microsoft.com/en-us/rest/api/storageservices/fileservices/blob-service-rest-api
 * for details on specification.
 */

const router: express.Router = express.Router();
const path = `/${env.emulatedStorageAccountName}/:container`;

router.get("/", (req: Request, res: Response, next: NextFunction) => {
    if (req.query.restype === "container" && req.query.comp === "list") {
        req.query.azuriteOperation = Operations.Container.LIST_BLOBS;
    } else if (req.query.restype === "container" && req.query.comp === "metadata") {
        req.query.azuriteOperation = Operations.Container.GET_CONTAINER_METADATA;
    } else if (req.query.restype === "container" && req.query.comp === "acl") {
        req.query.azuriteOperation = Operations.Container.GET_CONTAINER_ACL;
    } else if (req.query.restype === "container") {
        req.query.azuriteOperation = Operations.Container.GET_CONTAINER_PROPERTIES;
    } else {
        REWRITE_URL_AND_FORWARD_TO_BLOB_ROUTE(req, next);
        return;
    }
    req.query.azuriteRequest = new ContainerRequest({ req: req });
    next();
});

router.head("/", (req: Request, res: Response, next: NextFunction) => {
    if (req.query.restype === "container" && req.query.comp === "metadata") {
        req.query.azuriteOperation = Operations.Container.GET_CONTAINER_METADATA;
    }
    else if (req.query.restype === "container" && req.query.comp === "acl") {
        req.query.azuriteOperation = Operations.Container.GET_CONTAINER_ACL;
    } else if (req.query.restype === "container") {
        req.query.azuriteOperation = Operations.Container.GET_CONTAINER_PROPERTIES;
    } else {
        REWRITE_URL_AND_FORWARD_TO_BLOB_ROUTE(req, next);
        return;
    }
    req.query.azuriteRequest = new ContainerRequest({ req: req });
    next();
});

router.put("/", (req: Request, res: Response, next: NextFunction) => {
    if (req.query.restype === "container" && req.query.comp === "metadata") {
        req.query.azuriteOperation = Operations.Container.SET_CONTAINER_METADATA;
    }
    else if (req.query.restype === "container" && req.query.comp === "acl") {
        req.query.azuriteOperation = Operations.Container.SET_CONTAINER_ACL;
        Serializers.parseSignedIdentifiers(req.body)
            .then((signedIdentifiers: any) => {
                req.query.azuriteRequest = new ContainerRequest({ req: req, payload: signedIdentifiers });
                next();
            });
        return;
    }
    else if (req.query.restype === "container" && req.query.comp === "lease") {
        req.query.azuriteOperation = Operations.Container.LEASE_CONTAINER;
    }
    else if (req.query.restype === "container") {
        req.query.azuriteOperation = Operations.Container.CREATE_CONTAINER;
    } else {
        REWRITE_URL_AND_FORWARD_TO_BLOB_ROUTE(req, next);
        return;
    }
    req.query.azuriteRequest = new ContainerRequest({ req: req });
    next();
});

router.delete("/", (req: Request, res: Response, next: NextFunction) => {
    if (req.query.restype === "container") {
        req.query.azuriteOperation = Operations.Container.DELETE_CONTAINER;
    } else {
        REWRITE_URL_AND_FORWARD_TO_BLOB_ROUTE(req, next);
        return;
    }
    req.query.azuriteRequest = new ContainerRequest({ req: req });
    next();
});

export const ContainerRoute: express.Router = router;
export const ContainerRoutePath = path;
