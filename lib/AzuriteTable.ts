"use strict";

const express = require("express"),
    BbPromise = require("bluebird"),
    env = require("./core/env"),
    bodyParser = require("body-parser"),
    morgan = require("morgan"),
    tableStorageManager = require("./core/table/TableStorageManager"),
    cli = require("./core/cli");

export class AzuriteTable {
    private server: any;

    constructor() {
        // Support for PM2 Graceful Shutdown on Windows and Linux/OSX
        // See http://pm2.keymetrics.io/docs/usage/signals-clean-restart/
        const close = this.close;
        if (process.platform === "win32") {
            process.on("message", function (msg) {
                if (msg === "shutdown") {
                    close();
                }
            });
        }
        else {
            process.on("SIGINT", function () {
                close();
            });
        }
    }

    init(options: any) {
        return env.init(options)
            .then(() => {
                return tableStorageManager.init();
            })
            .then(() => {
                const app = express();
                if (!env.silent) {
                    app.use(morgan("dev"));
                }
                app.use(bodyParser.raw({
                    inflate: true,
                    // According to https://docs.microsoft.com/en-us/rest/api/storageservices/understanding-the-table-service-data-model
                    // maximum size of an entity is 1MB
                    limit: "10000kb",
                    type: function (type: any) {
                        return true;
                    }
                }));
                require("./routes/table/TableRoute")(app);
                require("./routes/table/EntityRoute")(app);
                app.use(require("./middleware/table/validation"));
                app.use(require("./middleware/table/actions"));
                this.server = app.listen(env.tableStoragePort, () => {
                    if (!env.silent) {
                        cli.tableStorageStatus();
                    }
                });
            });
    }

    close() {
        return BbPromise.try(() => {
            this.server.close();
        });
    }
}

export default AzuriteTable;