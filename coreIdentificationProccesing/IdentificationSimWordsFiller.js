/**
 * Created by Michal Krempasky
 * FIIT STU BA
 */

var identSelects = require('.././dataHandlers/sqlite3Handler/IdentificationSelects');
var identStepsInCode = require('./IdentificationStepsInCode');

module.exports = {
    synonymsFiller: function (d, data, javaClassesArray) {
        return new Promise(function (done, reject) {

            //noinspection JSUnresolvedVariable
            identSelects.selectSimilarWordsForIdentification1(data.wid).then(function (simWordsList) {
                // console.log("DATA: " + JSON.stringify(data));
                identStepsInCode.identificationProcess(javaClassesArray, data, simWordsList).then(function () {
                    //console.log("NIECO");
                    done();
                }).catch(function (error) {
                    console.log("Identification process error " + error);
                    reject(error);
                });

            }).catch(function (error) {
                console.log("Similar words select error " + error);
                reject(error);
            });
        });
    }
};