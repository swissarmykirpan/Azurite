import { assert } from "chai";
import * as path from "path";
import AzuriteTable from "../lib/AzuriteTable";



describe("Table HTTP Api", () => {
    const azurite = new AzuriteTable();


    before(() => {
        console.log("before");
        const location = path.join("azurite-testdrive", "TABLE");
        return azurite.init({ l: location, silent: "false", overwrite: "true" });
        // try {
        //     const createTableResponse = await asyncIt<TableService.TableResult>(cb => tableService.createTableIfNotExists(tableName, cb));
        //     if (!createTableResponse.isSuccessful) {
        //         console.log(createTableResponse.statusCode);
        //     }
        // }
        // catch (ex) {
        //     console.log(ex);
        // }

        // await asyncIt<TableService.EntityMetadata>(cb => tableService.insertEntity(tableName, tableEntity, cb));
        // await asyncIt<TableService.EntityMetadata>(cb => tableService.insertEntity(tableName, tableEntity2, cb));
    });

    after(() => {
        console.log("after");
        return azurite.close();
    });

    it("ABC", () => {
        assert.isTrue(true);
    });

    // describe("GET Table Entity", () => {
    //     // it('By PartitionKey and RowKey', (done) => {
    //     //     tableService.retrieveEntity<TableEntity>(tableName, tableEntity.PartitionKey, tableEntity.RowKey, function(error, result, response) {
    //     //         result.PartitionKey.should.equal(tableEntity.PartitionKey);
    //     //         result.RowKey.should.equal(tableEntity.RowKey);
    //     //         result.Description.should.equal(tableEntity.Description);
    //     //         result.DueDate.should.equal(tableEntity.DueDate);
    //     //     });

    //     //     done();
    //     // });

    //     it("All", () => {
    //         assert.isTrue(false);
    //         // const query = new TableQuery();
    //         // const token: TableService.TableContinuationToken = {
    //         //     nextPartitionKey: "",
    //         //     nextRowKey: "",
    //         //     targetLocation: Constants.StorageLocation.PRIMARY
    //         // };

    //         // const result = await asyncIt<TableService.QueryEntitiesResult<TableEntity>>(cb => tableService.queryEntities<TableEntity>(tableName, query, token, cb));
    //         // assert.lengthOf(result.entries, 3, "array has length of 2");
    //     });
    // });
});