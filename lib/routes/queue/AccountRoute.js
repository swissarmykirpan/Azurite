'use strict';

const env = require('./../../core/env'),
    AzuriteQueueRequest = require('../../model/queue/AzuriteQueueRequest'),
    Operations = require('./../../core/Constants').Operations;

/*
 * Route definitions for all operation on the 'account' resource type.
 * See https://docs.microsoft.com/en-us/rest/api/storageservices/operations-on-the-account--queue-service-
 * for details on specification.
 */
module.exports = (app) => {
    app.route(`/${env.emulatedStorageAccountName}`)
        .get((req, res, next) => {
            if (req.query.comp === 'list') {
                req.query.azuriteOperation = Operations.Queue.LIST_QUEUES;
            } 
            req.query.azuriteRequest = new AzuriteQueueRequest({ req: req });
            next();
        });
}