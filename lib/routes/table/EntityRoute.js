'use strict';

const env = require('./../../core/env'),
    AzuriteTableRequest = require('./../../model/table/AzuriteTableRequest'),
    N = require('./../../core/HttpHeaderNames'),
    Operations = require('./../../core/Constants').Operations.Table;

/*
 * Route definitions for all operation on the 'message' resource type.
 * See https://docs.microsoft.com/rest/api/storageservices/operations-on-entities
 * for details on specification.
 */
module.exports = (app) => {
    app.route(new RegExp(`\/${env.emulatedStorageAccountName}\/([A-Za-z0-9]+)(.*)`))
        .get((req, res, next) => {
            if (req.query.azuriteOperation === undefined) {
                req.query.azuriteOperation = Operations.QUERY_ENTITY;
                req.query.azuriteRequest = new AzuriteTableRequest({ req: req });
            }
            next();
        })
        .head((req, res, next) => {
            next();
        })
        .put((req, res, next) => {
            if (req.query.azuriteOperation === undefined) {
                req.query.azuriteRequest = new AzuriteTableRequest({ req: req, payload: req.payload });
                req.query.azuriteOperation = req.query.azuriteRequest.httpProps[N.IF_MATCH]
                    ? Operations.UPDATE_ENTITY
                    : Operations.INSERT_OR_REPLACE_ENTITY;
            }
            next();
        })
        .post((req, res, next) => {
            if (req.query.azuriteOperation === undefined) {
                req.query.azuriteOperation = Operations.INSERT_ENTITY
                req.query.azuriteRequest = new AzuriteTableRequest({ req: req, payload: req.payload });
            }
            next();
        })
        .delete((req, res, next) => {
            req.query.azuriteOperation = Operations.DELETE_ENTITY;
            req.query.azuriteRequest = new AzuriteTableRequest({ req: req });
            next();
        })
        .merge((req, res, next) => {
            req.query.azuriteRequest = new AzuriteTableRequest({ req: req, payload: req.payload });
            req.query.azuriteOperation = req.query.azuriteRequest.httpProps[N.IF_MATCH]
                ? Operations.MERGE_ENTITY
                : Operations.INSERT_OR_MERGE_ENTITY;
            next();
        });
}