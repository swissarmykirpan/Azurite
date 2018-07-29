import * as express from "express";
import { Server } from "http";
import { ContainerRoute, ContainerRoutePath } from "./routes/blob/ContainerRoute";
import StorageManager from "./core/blob/StorageManager";
const BbPromise = require("bluebird"),
    bodyParser = require("body-parser"),
    env = require("./core/env"),
    morgan = require("morgan"),
    cli = require("./core/cli");

export class AzuriteBlob {
    private server!: Server;
    private storageManager: StorageManager;
    constructor() {
        // Support for PM2 Graceful Shutdown on Windows and Linux/OSX
        // See http://pm2.keymetrics.io/docs/usage/signals-clean-restart/

        this.storageManager = new StorageManager();

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

    private configureRoutes(app: express.Express) {
        app.use(ContainerRoutePath, ContainerRoute);
    }

    public init(options: any) {
        return env.init(options)
            .then(() => {
                return this.storageManager.init();
            })
            .then(() => {
                const app = express();
                if (!env.silent) {
                    app.use(morgan("dev"));
                }
                // According to RFC 7231:
                // An origin server MAY respond with a status code of 415 (Unsupported
                // Media Type) if a representation in the request message has a content
                // coding that is not acceptable.
                // body-parser, however, throws an error. We thus ignore unsupported content encodings and treat them as 'identity'.
                app.use((req: any, res: any, next: any) => {
                    const encoding = (req.headers["content-encoding"] || "identity").toLowerCase();
                    if (encoding !== "deflate" ||
                        encoding !== "gzip" ||
                        encoding !== "identity") {
                        delete req.headers["content-encoding"];
                    }
                    next();
                });
                app.use(bodyParser.raw({
                    inflate: true,
                    limit: "268435kb", // Maximum size of a single PUT Blob operation as per spec.
                    type: function (type: any) {
                        return true;
                    }
                }));
                app.use(`/blobs`, express.static(env.localStoragePath));
                require("./routes/blob/AccountRoute")(app);
                this.configureRoutes(app);
                // require("./routes/blob/BlobRoute")(app);
                // require("./routes/blob/NotFoundRoute")(app);
                // app.use(require("./middleware/blob/cors"));
                // app.use(require("./middleware/blob/authentication"));
                // app.use(require("./middleware/blob/validation"));
                // app.use(require("./middleware/blob/actions"));
                this.server = app.listen(env.blobStoragePort, () => {
                    if (!env.silent) {
                        cli.blobStorageStatus();
                    }
                });
            });
    }

    public close() {
        return BbPromise.try(() => {
            this.server.close();
            this.storageManager.flush();
            return this.storageManager.close();
        });
    }
}
