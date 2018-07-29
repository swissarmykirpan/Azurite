'use strict';

const env = require('./../../core/env'),
    AzuriteQueueRequest = require('../../model/queue/AzuriteQueueRequest'),
    Serializers = require('./../../xml/Serializers'),
    Operations = require('./../../core/Constants').Operations;

/*
 * Route definitions for all operation on the 'queue' resource type.
 * See https://docs.microsoft.com/rest/api/storageservices/operations-on-queues
 * for details on specification.
 */
module.exports = (app) => {
    app.route(`/${env.emulatedStorageAccountName}/:queue/`)
        .get((req, res, next) => {
            if (req.query.comp === 'metadata') {
                req.query.azuriteOperation = Operations.Queue.GET_QUEUE_METADATA;
            } else if (req.query.comp === 'acl') {
                req.query.azuriteOperation = Operations.Queue.GET_QUEUE_ACL;
            }
            req.query.azuriteRequest = new AzuriteQueueRequest({ req: req });
            next();
        })
        .head((req, res, next) => {
            if (req.query.comp === 'metadata') {
                req.query.azuriteOperation = Operations.Queue.GET_QUEUE_METADATA;
            } else if (req.query.comp === 'acl') {
                req.query.azuriteOperation = Operations.Queue.GET_QUEUE_ACL;
            }
            req.query.azuriteRequest = new AzuriteQueueRequest({ req: req });
            next();
        })
        .put((req, res, next) => {
            if (req.query.comp === 'metadata') {
                req.query.azuriteOperation = Operations.Queue.SET_QUEUE_METADATA;
            } else if (req.query.comp === 'acl') {
                req.query.azuriteOperation = Operations.Queue.SET_QUEUE_ACL;
                Serializers.parseSignedIdentifiers(req.body)
                    .then((signedIdentifiers) => {
                        req.query.azuriteRequest = new AzuriteQueueRequest({ req: req, payload: signedIdentifiers });
                        next();
                    });
                return;
            } else {
                req.query.azuriteOperation = Operations.Queue.CREATE_QUEUE;
            }
            req.query.azuriteRequest = new AzuriteQueueRequest({ req: req });
            next();
        })
        .delete((req, res, next) => {
            req.query.azuriteOperation = Operations.Queue.DELETE_QUEUE;
            req.query.azuriteRequest = new AzuriteQueueRequest({ req: req });
            next();
        });
}