/**
 * Created by Michal Krempasky
 * FIIT STU BA
 */

var fs = require('fs');
var jsjavaparser = require('java-parser');
var identSelects = require('.././dataHandlers/sqlite3Handler/IdentificationSelects');
var identFiller = require('./IdentificationSimWordsFiller');
var Promise = require("promise");

module.exports = {

    // INPUT
    // UC NAME/step number/ step/ word/sim word list/postag/path/class/
    // OUTPUT
    // UC NAME/ STEP NUMBER/STEP/ WORD/ SIM WORD/postag/path/CL.tree

    identificationHandler: function (classArray) {
        return new Promise(function (fulfill, reject) {
            // gather data // UC NAME/ STEP NUMBER/STEP/ WORD/ SIM WORD/postag
            var javaClassesArray = [];
            var synonymsFill = [];
            var classData;
            var tree;

            for (var jClass in classArray) {
                if (classArray.hasOwnProperty(jClass)) {
                    classData = fs.readFileSync(classArray[jClass], "utf8");
                    tree = jsjavaparser.parse(classData);
                    javaClassesArray.push(tree);
                }
            }

            identSelects.selectDataForIdentification1().then(function (data) {

                for (var d in data) {
                    if (data.hasOwnProperty(d)) {
                        synonymsFill.push(identFiller.synonymsFiller(d, data[d], javaClassesArray));
                    }
                }
                console.log("Synonyms FILLED, now process");
                Promise.all(synonymsFill).then(function () {

                    console.log("Identification ENDED with inserts: " + counterInserts);
                    fulfill();


                }).catch(function (message) {
                    console.log("synonymsFill Error " + message);
                    reject();
                });

            }).catch(function (message) {
                console.log("Identification error " + message);
                reject();
            });

        });
    }


};