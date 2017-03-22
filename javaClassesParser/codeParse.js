/**
 * Created by Michal Krempasky
 * FIIT STU BA
 */

var pathFinder = require('./pathFinder.js');

module.exports = {

    codeParseHandler: function (directory) {
        return new Promise(function (resolve, reject) {

            pathFinder.javaClassFinderFileHound(directory).then(function (pathArray) {
                resolve(pathArray);
            }).catch(function (err) {
                console.log("Code parser handler error " + err);
                reject(err);
            });
        });
    }
};