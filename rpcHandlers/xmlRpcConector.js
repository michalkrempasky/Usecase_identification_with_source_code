/**
* Created by Michal Krempasky
* FIIT STU BA
*/

var xmlrpc = require('xmlrpc');
var client = xmlrpc.createClient({host: 'localhost', port: 9000, path: '/'});
var Promise = require('promise');

module.exports = {

    waterfall: function (fns, done, ress) {

        var _this = this;
        if (!ress) ress = [];
        if (fns.length >= 1) {
            var promise = fns[0]();
            promise.then(function (res) {
                ress.push(res);
                _this.waterfall(fns.slice(1), done, ress);
            });
        } else {
            done(ress);
        }
    },
    waterfallWrap: function (that, fn, params) {
        return function () {
            var prom = fn.apply(that, params); //TODO: skontroluje upravenie
            return prom;
        };
    },

    positionTagger: function (wordcalls, sentence, id, callback) {
        return new Promise(function (resolve, reject) {

            client.methodCall('postag', [sentence], function (error, helper) {
                if (error) {
                    console.log("postion tagger error " + error);
                    reject();
                }
                else {
                    callback(wordcalls, helper, id);
                    resolve();
                }
            });
        });
    },

    similarWords: function (simwordcallsIns, wid, word, type, callback) {
        //WORD to do we need to convert NOUN to n Verb to v a ADJ je JJ takze do a
        return new Promise(function (resolve, reject) {
            client.methodCall('sim', [word, type], function (error, value) {
                if (error) {
                    console.log("similar words error "+ error);
                    reject();
                }
                else {
                    callback(simwordcallsIns, value, wid, type);
                    resolve();
                }

            });
        });
    }
};