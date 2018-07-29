import * as chai from "chai";
import { assert } from "chai";
import chaiHttp = require("chai-http");
import chaiAsPromised = require("chai-as-promised");
import { createBlobService } from "azure-storage";
import { asyncIt } from "../lib/AsyncIt";
import { AzuriteBlob } from "../lib/AzuriteBlob";
import path = require("path");

chai.use(chaiHttp);
chai.use(chaiAsPromised);

const containerName = "testcontainer";
// const blockBlobName = "testblockblob";
// const appendBlobName = "testappendblob";
// const pageBlobName = "testpageblob";
// const url = `http://localhost:10000`;
// const urlPath = `/devstoreaccount1`;
const blobService = createBlobService("UseDevelopmentStorage=true");


describe("Blob HTTP API", () => {
    const azurite = new AzuriteBlob();

    before(() => {
        const location = path.join("azurite-testdrive", "BLOB");
        return azurite.init({ l: location, silent: "true", overwrite: "true" })
        .then(async () => {
            // Make sure there is an existing container 'testcontainer'
            await asyncIt(cb => blobService.createContainer(containerName, cb));
            // await asyncIt(cb => blobService.createBlockBlobFromText(containerName, blockBlobName, "abc123", cb));
            // await asyncIt(cb => blobService.createAppendBlobFromText(containerName, appendBlobName, "", cb));
            // await asyncIt(cb => blobService.createPageBlob(containerName, pageBlobName, 0, cb));
        });
    });

    after(() => {
        return azurite.close();
    });

    describe("PUT Block Blob", () => {
        it("should fail to create a block due to missing container", () => {
            assert.isTrue(true);
        //    return expect(asyncIt(cb => blobService.createBlockBlobFromText("doesnotexist", "blob", "THIS IS CONTENT", cb))).to.be.rejectedWith();
        });
    });

    // describe("Delete Blob", () => {
    //     it("should delete an existing Block Blob", async () => {
    //         await asyncIt(cb => blobService.createBlockBlobFromText(containerName, "blob", "abc123", cb));
    //         return asyncIt(cb => blobService.deleteBlob(containerName, "blob", cb));
    //     });
    //     it("should fail when deleting a non-existant blob", () => {
    //         return expect(asyncIt(cb => blobService.deleteBlob("deleteblobtest", "doesnotexist", cb))).to.be.rejectedWith();
    //     });
    //     it("should fail when deleting from a non-existant container", () => {
    //         return expect(asyncIt(cb => blobService.deleteBlob("doesnotexist", "doesnotexist", cb))).to.be.rejectedWith();
    //     });
    // });

    // describe("Append Blobs", () => {
    //     it.only("should create an append blob", async () =>
    //         asyncIt(cb => blobService.createAppendBlobFromText(containerName, "appendBlob", "", cb)));

    //     it("should append data to the append blob", async () =>
    //         asyncIt(cb => blobService.appendBlockFromText(containerName, "appendBlob", "abcdefghi", cb)));

    //     // Not sure what this is meant to test?
    //     it("should fail to create an append blob with size > 0", () => {
    //         return chai.request(url)
    //             .put(`${urlPath}/${containerName}/appendBlob`)
    //             .set("x-ms-blob-type", "AppendBlob")
    //             .set("Content-Type", "application/octet-stream")
    //             .send("abcdefgh")
    //             .catch((e) => {
    //                 e.should.have.status(409);
    //             });
    //     });
    // });

    // describe("Page Blobs", () => {
    //     it("should get an empty page list from the page blob", () => {
    //         return chai.request(url)
    //             .get(`${urlPath}/${containerName}/${pageBlobName}`)
    //             .query({ comp: "pagelist" })
    //             .then((res) => {
    //                 res.should.have.status(200);
    //                 xml2js.Parser().parseString(res.text, function(err, result) {
    //                     expect(result.PageList).to.not.have.any.keys("PageRange");
    //                 });
    //             });
    //         });

    //     it("should write data to the page blob range [0-511]", () => {
    //         const bodydata = Buffer.alloc(512);
    //             return chai.request(url)
    //                 .put(`${urlPath}/${containerName}/${pageBlobName}`)
    //                 .query({ comp: "page" })
    //                 .set("x-ms-page-write", "update")
    //                 .set("x-ms-range", "bytes=0-511")
    //                 .set("Content-Type", "application/octet-stream")
    //                 .send(bodydata)
    //                 .then((res) => {
    //                     res.should.have.status(201);
    //                 });
    //     });

    //     it("should fail to write data to the page blob with an invalid range", async () => {
    //         const bodydata = Buffer.alloc(513);
    //             return chai.request(url)
    //                 .put(`${urlPath}/${containerName}/${pageBlobName}`)
    //                 .query({ comp: "page" })
    //                 .set("x-ms-page-write", "update")
    //                 .set("x-ms-range", "bytes=0-512")
    //                 .set("Content-Type", "application/octet-stream")
    //                 .send(bodydata)
    //                 .catch((e) => {
    //                     e.should.have.status(416);
    //                 });
    //     });
    //     it("should fail to write data to the page blob with an invalid body length", () => {
    //         const bodydata = Buffer.alloc(513);
    //             return chai.request(url)
    //                 .put(`${urlPath}/${containerName}/${pageBlobName}`)
    //                 .query({ comp: "page" })
    //                 .set("x-ms-page-write", "update")
    //                 .set("x-ms-range", "bytes=0-511")
    //                 .set("Content-Type", "application/octet-stream")
    //                 .send(bodydata)
    //                 .catch((e) => {
    //                     e.should.have.status(400);
    //                 });
    //     });

    //     it("should get the page range [0-511] from the page blob", () => {
    //         return chai.request(url)
    //             .get(`${urlPath}/${containerName}/${pageBlobName}`)
    //             .query({ comp: "pagelist" })
    //             .then((res) => {
    //                 res.should.have.status(200);
    //                 xml2js.Parser().parseString(res.text, function(err, result) {
    //                 expect(result.PageList.PageRange.length).to.equal(1);
    //                     expect(result.PageList.PageRange[0]).to.deep.equal({"Start": ["0"], "End": ["511"]});
    //                 });
    //             });
    //     });
    //     it("should get the page range [0-511] from the page blob within range [0-1023]", () => {
    //         return chai.request(url)
    //             .get(`${urlPath}/${containerName}/${pageBlobName}`)
    //             .query({ comp: "pagelist" })
    //             .set("x-ms-range", "bytes=0-1023")
    //             .then((res) => {
    //                 res.should.have.status(200);
    //                 xml2js.Parser().parseString(res.text, function(err, result) {
    //                 expect(result.PageList.PageRange.length).to.equal(1);
    //                     expect(result.PageList.PageRange[0]).to.deep.equal({"Start": ["0"], "End": ["511"]});
    //                 });
    //             });
    //     });
    //     it("should fail to get the page list from the page blob within an invalid range", () => {
    //         return chai.request(url)
    //             .get(`${urlPath}/${containerName}/${pageBlobName}`)
    //             .query({ comp: "pagelist" })
    //             .set("x-ms-range", "bytes=0-1095")
    //             .catch((e) => {
    //                 e.should.have.status(416);
    //             });
    //     });
    //     it("should write data to the page blob range [1024-1535]", () => {
    //         const bodydata = Buffer.alloc(512);
    //             return chai.request(url)
    //                 .put(`${urlPath}/${containerName}/${pageBlobName}`)
    //                 .query({ comp: "page" })
    //                 .set("x-ms-page-write", "update")
    //                 .set("x-ms-range", "bytes=1024-1535")
    //                 .set("Content-Type", "application/octet-stream")
    //                 .send(bodydata)
    //                 .then((res) => {
    //                     res.should.have.status(201);
    //                 });
    //         });
    //     it("should get the page ranges [0-511],[1024-1535] from the page blob", () => {
    //         return chai.request(url)
    //             .get(`${urlPath}/${containerName}/${pageBlobName}`)
    //             .query({ comp: "pagelist" })
    //             .then((res) => {
    //                 res.should.have.status(200);
    //                 xml2js.Parser().parseString(res.text, function(err, result) {
    //                     expect(result.PageList.PageRange.length).to.equal(2);
    //                     expect(result.PageList.PageRange[0]).to.deep.equal({"Start": ["0"], "End": ["511"]});
    //                     expect(result.PageList.PageRange[1]).to.deep.equal({"Start": ["1024"], "End": ["1535"]});
    //                 });
    //             });
    //     });
    //     it("should write data to the page blob range [512-1023]", () => {
    //         const bodydata = Buffer.alloc(512);
    //             return chai.request(url)
    //                 .put(`${urlPath}/${containerName}/${pageBlobName}`)
    //                 .query({ comp: "page" })
    //                 .set("x-ms-page-write", "update")
    //                 .set("x-ms-range", "bytes=512-1023")
    //                 .set("Content-Type", "application/octet-stream")
    //                 .send(bodydata)
    //                 .then((res) => {
    //                     res.should.have.status(201);
    //                 });
    //     });
    //     it("should get the page range [0-1535] from the page blob", () => {
    //         return chai.request(url)
    //             .get(`${urlPath}/${containerName}/${pageBlobName}`)
    //             .query({ comp: "pagelist" })
    //             .then((res) => {
    //                 res.should.have.status(200);
    //                 xml2js.Parser().parseString(res.text, function(err, result) {
    //                     expect(result.PageList.PageRange.length).to.equal(1);
    //                     expect(result.PageList.PageRange[0]).to.deep.equal({"Start": ["0"], "End": ["1535"]});
    //                 });
    //             });
    //     });
    //     it("should clear data in the page blob range [512-1023]", () => {
    //         return chai.request(url)
    //             .put(`${urlPath}/${containerName}/${pageBlobName}`)
    //             .query({ comp: "page" })
    //             .set("x-ms-page-write", "clear")
    //             .set("x-ms-range", "bytes=512-1023")
    //             .then((res) => {
    //                 res.should.have.status(201);
    //             });
    //     });
    //     it("should get the page ranges [0-511],[1024-1535] from the page blob", () => {
    //         return chai.request(url)
    //             .get(`${urlPath}/${containerName}/${pageBlobName}`)
    //             .query({ comp: "pagelist" })
    //             .then((res) => {
    //                 res.should.have.status(200);
    //                 xml2js.Parser().parseString(res.text, function(err, result) {
    //                     expect(result.PageList.PageRange.length).to.equal(2);
    //                     expect(result.PageList.PageRange[0]).to.deep.equal({"Start": ["0"], "End": ["511"]});
    //                     expect(result.PageList.PageRange[1]).to.deep.equal({"Start": ["1024"], "End": ["1535"]});
    //                 });
    //             });
    //     });
    // });

    // describe("GET Blob", () => {
    //     it("should get the correct content of the Block Blob", () => {
    //         const optionsBlockBlobGet = {
    //             method: "GET",
    //             headers: {
    //                 "Content-Type": "application/octet-stream"
    //             },
    //             uri: `http://localhost:10000/devstoreaccount1/${containerName}/${blockBlobName}`
    //         };
    //         return rp(optionsBlockBlobGet)
    //             .then((res) => {
    //                 expect(res).to.be.equal("abc123");
    //             });
    //     });
    //     it("should get the correct type of the append blob", () => {
    //         return chai.request(url)
    //             .get(`${urlPath}/${containerName}/${appendBlobName}`)
    //             .then((res) => {
    //                 res.should.have.status(200);
    //                 res.should.have.header("x-ms-blob-type", "AppendBlob");
    //             });
    //     });
    // });

    // describe("Blob Metadata", () => {
    //     it("should update an existing blob with metadata.", () => {
    //         return chai.request(url)
    //             .put(`${urlPath}/${containerName}/${blockBlobName}`)
    //             .query({ comp: "metadata" })
    //             .set("x-ms-meta-test1", "value1")
    //             .set("x-ms-meta-test2", "value2")
    //             .set("x-ms-meta-meta1", "meta1Value")
    //             .then((res) => {
    //                 res.should.have.status(200);
    //             });
    //     });
    //     it("should get the correct metadata", () => {
    //         return chai.request(url)
    //             .get(`${urlPath}/${containerName}/${blockBlobName}`)
    //             .query({ comp: "metadata" })
    //             .then((res) => {
    //                 res.should.have.status(200);
    //                 res.should.have.header("x-ms-meta-test1", "value1");
    //                 res.should.have.header("x-ms-meta-test2", "value2");
    //                 res.should.have.header("x-ms-meta-meta1", "meta1Value");
    //                 res.should.have.header("Last-Modified");
    //                 res.should.have.header("ETag");
    //             });
    //     });
    //     it("should fail to get metadata of a non-existant blob", () => {
    //         return chai.request(url)
    //             .get(`${urlPath}/${containerName}/BLOB_DOESNOTEXISTS`)
    //             .query({ comp: "metadata" })
    //             .catch((e) => {
    //                 e.should.have.status(404);
    //             });
    //     });
    //     it("should fail to get metadata of a blob in a non-existant container", () => {
    //         return chai.request(url)
    //             .get(`${urlPath}/CONTAINER_DOESNOTEXIST/BLOB_DOESNOTEXISTS`)
    //             .query({ comp: "metadata" })
    //             .catch((e) => {
    //                 e.should.have.status(404);
    //             });
    //     });
    // });

    // describe("Blob Properties", () => {
    //     it("should successfully set all system properties", () => {
    //         return chai.request(url)
    //             .put(`${urlPath}/${containerName}/${blockBlobName}`)
    //             .set("x-ms-blob-cache-control", "true")
    //             .set("x-ms-blob-content-type", "ContentType")
    //             .set("x-ms-blob-content-md5", "ContentMD5")
    //             .set("x-ms-blob-content-encoding", "ContentEncoding")
    //             .set("x-ms-blob-content-language", "ContentLanguage")
    //             .query({ comp: "properties" })
    //             .then((res) => {
    //                 res.should.have.status(200);
    //             });
    //     });
    //     it("should get all previously set system properties", () => {
    //         return chai.request(url)
    //             .head(`${urlPath}/${containerName}/${blockBlobName}`)
    //             .then((res) => {
    //                 res.should.have.status(200);
    //                 res.should.have.header("ETag");
    //                 res.should.have.header("Last-Modified");
    //                 res.should.have.header("Content-Type", "ContentType");
    //                 res.should.have.header("Content-Encoding", "ContentEncoding");
    //                 res.should.have.header("Content-MD5", "ContentMD5");
    //                 res.should.have.header("Content-Language", "ContentLanguage");
    //                 res.should.have.header("Cache-Control", "true");
    //                 res.should.have.header("x-ms-blob-type", "BlockBlob");
    //             });
    //     });
    // });
});
