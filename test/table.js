import chai from 'chai';
import chaiHttp from 'chai-http';
import AzuriteTable from './../lib/AzuriteTable';
import rp from 'request-promise';
import path from 'path';
import xml2js from 'xml2js';
import * as BbPromise from 'bluebird';
import fsextra from 'fs-extra';
import * as azureStorage from "azure-storage";
import { asyncIt } from './../lib/core/otherutils';

const fs = BbPromise.promisifyAll(fsextra);
const should = chai.should(), expect = chai.expect;

chai.use(chaiHttp);

const tableName = 'testtable';

const tableService = azureStorage.createTableService("UseDevelopmentStorage=true");
const entGen = azureStorage.TableUtilities.entityGenerator;

describe('Table HTTP Api', () => {
    const azurite = new AzuriteTable();
    const tableEntity = {
        PartitionKey: entGen.String('azurite').toString(),
        RowKey: entGen.String('1').toString(),
        description: entGen.String('foo').toString(),
        dueDate: entGen.DateTime(new Date(Date.UTC(2018, 12, 25)))
    };

    const tableEntity2 = {
        PartitionKey: entGen.String('azurite').toString(),
        RowKey: entGen.String('2').toString(),
        description: entGen.String('foo').toString(),
        dueDate: entGen.DateTime(new Date(Date.UTC(2018, 12, 26)))
    };

    describe('GET Table Entity', () => {

        before(() => {  
            const location = path.join(process.env.AZURITE_LOCATION, 'TABLE');
            await azurite.init({ l: location, silent: 'true', overwrite: 'true' });

                const x = await asyncIt(cb => tableService.createTableIfNotExists(tableName, cb));
                console.log(x);
                const y = await asyncIt(cb => tableService.insertEntity(tableName, tableEntity, cb));
                console.log(y);
                    
                //     tableService.insertEntity(tableName, tableEntity2, function(error, result, response) {
                //     });
                // }));
        });

        after(() => azurite.close());

        // it('By PartitionKey and RowKey', (done) => {
        //     tableService.retrieveEntity(tableName, tableEntity.PartitionKey, tableEntity.RowKey, function(error, result, response) {
        //         result.should.have.PartitionKey(tableEntity.PartitionKey);
        //         result.should.have.RowKey(tableEntity.RowKey);
        //         result.should.have.description(tableEntity.description);
        //         result.should.have.dueDate(tableEntity.dueDate);
        //     });

        //     done();
        // });

        it('All', (done) => {
            const query = new azureStorage.TableQuery();
            tableService.queryEntities(tableName, query, null, function(error, result, response) {
                console.log(error);
                console.log(result);
                console.log(response);
                expect(result.length).to.equal(2);
                done();
            });

        });
    });
});