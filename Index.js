/**
 * Created by Michal Krempasky
 * FIIT STU BA
 */

var sql = require('sqlite3').verbose();
var file = "test.db";
global.db = new sql.Database(file);
var fs = require('fs');
global.counterInserts = 0;
global.ucJSON = "";
global.codeDirectory = "";

var dbInit = require('./dataHandlers/sqlite3Handler/Init.js');
var dbPrototypeCleanup = require('./dataHandlers/sqlite3Handler/PrototypeCleanMethod');
var useCaseProcess = require('./useCaseHandlers/UsecaseProccesing.js');
var codeParser = require('./javaClassesParser/codeParse.js');
var identify = require('./coreIdentificationProccesing/IdentificationHandler.js');
var finalOutput = require('./dataHandlers/sqlite3Handler/SelectRelations.js');

switch (process.argv[2]) {

    case "-t" : {

        dbPrototypeCleanup.cleanup().then(function () {

            codeParser.codeParseHandler(null).then(function (classArray) {

                identify.identificationHandler(classArray).then(function () {

                    finalOutput.selectFinalDataFromDetailedRelations().then(function () {
                        console.log("Identification on populated DB ended");
                        db.close();
                        process.exit(0);
                    });
                }).catch(function (err) {
                    console.log("ERROR IN IDENTIFICATION HANDLER " + err);
                });
            }).catch(function (err) {
                console.log("ERROR IN CODE PARSE HANDLER " + err);
            });
        }).catch(function (err) {
            console.log("ERROR IN DB PROTOTYPE CLEANUP " + err);
        });
        break;
    }

    case "-d" : {

        ucJSON = process.argv[4];
        codeDirectory =process.argv[3];

        dbInit.createTables().then(function () {

            useCaseProcess.ucLoadingHandler().then(function () {

                codeParser.codeParseHandler(null).then(function (classArray) {

                    identify.identificationHandler(classArray).then(function () {

                        finalOutput.selectFinalDataFromDetailedRelations().then(function () {
                            console.log("Identification finished ");
                            db.close();
                            process.exit(0);
                        });
                    }).catch(function (err) {
                        console.log("ERROR IN IDENTIFICATION HANDLER " + err);
                    });
                }).catch(function (err) {
                    console.log("ERROR IN CODE PARSE HANDLER " + err);
                });
            }).catch(function (err) {
                console.log("ERROR IN USE CASE PROCESS HANDLER" + err);
            });
        }).catch(function (err) {
            console.log("ERROR IN DB CREATION " + err);
        });
        break;
    }
    default : {
        console.log("DEFAULT - ENDING");
        db.close();
        process.exit(0);
        break;
    }
}