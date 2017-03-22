/**
 * Created by Michal Krempasky
 * FIIT STU BA
 */

var rpc = require('./../rpcHandlers/xmlRpcConector');
var usecaseSelects = require('./../dataHandlers/sqlite3Handler/UsecaseRelatedSelects');
var inserts = require('./../dataHandlers/sqlite3Handler/Inserts');
var fs = require('fs');
//const readline = require('readline');
//const os = require('os');
var Promise = require('promise');

module.exports = {
//TODO: refactor rejects and warnings + has owm property
    stepCallback: function (wordcalls, postagged, stepId) {
        var word;
        for (var pos in postagged) {
            if (postagged.hasOwnProperty(pos)) {
                word = postagged[pos];
                wordcalls.push(inserts.insertIntoWords(word[0], word[1], stepId));
            }
        }
    },

    wordCallback: function (simwordcallsIns, similarWordsList, wordId, posTagMapping) {

        simwordcallsIns.push(inserts.insertSimilarwordsIntoWords(similarWordsList, wordId, posTagMapping));
    },

    stepsProcessing: function (steps) {

        ///// PROCCESING of ALL steps in DB and CREATING WORDS
        ///// ALSO with RPC connection to PYTHON lib NLTK
        ///// and creating Words DB
        return new Promise(function (fulfill, reject) {

            var calls = [];
            var wordcalls = [];
            var simwordcalls = [];
            var simwordcallsIns = [];
            var emptyarr = [];
            console.log("StepsProcessing");

            for (var i in steps) {
                //  obj = steps[i];
                //console.log(obj.id); //
                //  console.log(obj.step);
                calls.push(
                    rpc.waterfallWrap(
                        null, rpc.positionTagger,
                        [wordcalls, steps[i].step, steps[i].id, module.exports.stepCallback]));
            }

            function positionTaggerWaterfall() {
                return new Promise(function (ondone, reject) {
                    new Promise(function () {
                        rpc.waterfall(calls, function (emptyarr) {
                            new Promise(function (resolve, reject) {
                                ondone(emptyarr);
                                resolve(emptyarr);
                            });
                        }, emptyarr)
                    });
                });
            }

            function similarWordsWaterfall() {
                return new Promise(function (ondone, reject) {
                    new Promise(function () {
                        rpc.waterfall(simwordcalls, function (emptyarr) {
                            new Promise(function (resolve, reject) {
                                ondone(emptyarr);
                                resolve(emptyarr);
                            });
                        }, emptyarr)
                    });
                });
            }

            //TODO: later refactor or try to replace wordcalls on empyarr
            var waterfallStepsProc = positionTaggerWaterfall();
            waterfallStepsProc.then(function (emptyarr) {
                //   console.log("WATERFALL END STEPS"+  wordcalls.length);
                Promise.all(wordcalls).then(function () {
                    //  console.log("WORDCALLS END ");
                    usecaseSelects.selectWordsData().then(function (wordArr) {
                        for (var i in wordArr) {
                            simwordcalls.push(
                                rpc.waterfallWrap(
                                    null, rpc.similarWords,
                                    [simwordcallsIns, wordArr[i].wid, wordArr[i].word, wordArr[i].posmap, module.exports.wordCallback]));
                        }

                        var waterfallSimWordsProc = similarWordsWaterfall();
                        waterfallSimWordsProc.then(function (emptyarr) {
                            //  console.log("WATERFALL END WORDS");
                            Promise.all(simwordcallsIns).then(function () {
                                //  console.log("SIMWORDS END");
                                fulfill();
                            });
                        });
                    });
                });
            });
        });
    },

    ucLoaderFromJSON: function (path) {
        ////// LOADING UC from JSON and storing them in DB
        ////// into UC table and Steps table , also with realtion between them
        // TestUCJSON.json
        return new Promise(function (done, reject) {

            var insertUCProc = [];
            var insertStepsProc = [];

            fs.readFile(path, "utf8", function (err, data) {
                if (err) {
                    console.log(err);
                    reject();
                }

                var parsedJson = JSON.parse(data);
                var usecasesNode = parsedJson.usecases;

                for (var useCasesIterator in usecasesNode) {

                    if (usecasesNode.hasOwnProperty(useCasesIterator)) {
                        var useCaseName = usecasesNode[useCasesIterator].usecase;
                        insertUCProc.push(inserts.insertUC(useCaseName));

                        var useCaseScenario = usecasesNode[useCasesIterator].scenario;

                        for (var useCaseSteps in useCaseScenario) {
                            if (useCaseScenario.hasOwnProperty(useCaseSteps)) {
                                insertStepsProc.push(inserts.insertStep(useCaseScenario[useCaseSteps].stepNumber,
                                    useCaseScenario[useCaseSteps].stepData, useCaseName));
                            }
                        }
                    }
                }

                Promise.all(insertUCProc).then(function () {

                    Promise.all(insertStepsProc).then(function () {

                        done();
                    });
                });
            });
        });
    },

    ucLoadingHandler: function () {

        ////// LOADING Use cases from JSON to DB
        ////// and filling up DB with UC and UC_Steps
        ///// ALSO CREATING Words via post tab
        ///// AND CREATING Similar words via synsets in NLTK
        return new Promise(function (done, reject) {

            /// NACITANIE UC DAT
            module.exports.ucLoaderFromJSON(ucJSON).then(function () {
                usecaseSelects.selectStepsAndSid().then(function (steps) {
                    //console.log(JSON.stringify(steps));
                    module.exports.stepsProcessing(steps).then(function () {
                        console.log("STEPS PROC DONE");
                        done();
                    });
                });
            });
        });
    }
};