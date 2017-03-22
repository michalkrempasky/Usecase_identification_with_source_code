/**
 * Created by Michal Krempasky
 * FIIT STU BA
 */


//TODO: Chybove hlasky
var ucSelects= require('./UsecaseRelatedSelects');
var Promise=require('promise');
module.exports = {

    insertUC: function (uc) {
        return new Promise(function (ondone, reject) {
            var stmt = db.prepare("INSERT INTO Use_cases(name) VALUES(?)");
            stmt.run(uc, function (err) {
                if(err){
                console.log(err);
                reject();
                }
            });
            ondone();
        });
    },

    insertStep: function (stepnumber, steptext, uidname) {
        return new Promise(function (fulfill, reject) {

            db.serialize(function () {
                var stmt = db.prepare("INSERT INTO Steps (uid,step_number,step) VALUES (?,?,?)");
                var helper=ucSelects.selectUCidByName(uidname);
                helper.then(function (uid) {
                    if(uid==null || uid == undefined){reject();}
                    stmt.run(uid[0].uid, stepnumber, steptext, function (err) {
                        if (err) {
                            console.log("err" + err);
                            reject();
                        }
                    });
                   stmt.finalize();
                    fulfill();
                });

            });

        });
    },

    insertIntoWords: function (w, type, sid) {
        return new Promise(function (fulfill, reject) {
            var word;
            var posmap;
            var pom=null;

            posmap = type.charAt(0).toLowerCase();
            if (posmap == 'j') {
                posmap = 'a';
            }
            word = w.toLowerCase();
            db.serialize(function () {
                var checkselect;
                var stmtrel;
                var stmt;
                stmt = db.prepare("INSERT INTO Words(word,wtype,swmap,posmap) VALUES (?,?,?,?)");
                stmtrel = db.prepare("INSERT INTO Step_word(sid,wid) VALUES(?,?)");

                checkselect = new Promise(function (resolve, reject) {
                    db.all("SELECT wid AS id FROM Words " +
                        "WHERE Words.word == ? AND Words.wtype == ? ",
                        [word, type], function (err, row) {

                            if (err) {
                                console.log(err);
                                reject();
                            }
                            var obj = row[0];
                            for (var prop in obj) {
                                if (obj.hasOwnProperty(prop)) {
                                    pom = obj[prop];

                                }
                            }
                                if (pom == undefined || pom == null) {
                                    resolve(0);
                                }
                                else {
                                    resolve(pom);
                                }

                        });
                });
                checkselect.then(function (val) {
                    db.serialize(function () {

                        var prom;
                        if (val == 0) {
                            //add into words and association table with select after insert
                            stmt.run(word, type, 0, posmap);
                            //noinspection JSUnresolvedFunction
                            stmt.finalize();
                            prom = new Promise(function (resolve, reject) {
                                db.all("SELECT wid from Words " +
                                    "WHERE Words.word == ? AND Words.wtype == ? ",
                                    [word, type], function (err, row) {

                                        if (err) {
                                            console.log(err);
                                            reject();
                                        }
                                        var obj;
                                        obj = row[0];
                                        for (var prop in obj) {
                                            if (obj.hasOwnProperty(prop)) {
                                                pom = obj[prop];

                                            }
                                        }
                                        resolve(pom);
                                    });
                            });
                            prom.then(function (datas) {
                                stmtrel.run(sid, datas, function (err) {
                                    if (err) {
                                        console.log(err);
                                        reject();
                                    }
                                });
                                //noinspection JSUnresolvedFunction
                                stmtrel.finalize();
                                fulfill();
                            });
                        }
                        else {
                            stmtrel.run(sid, val, function (err) {
                                if (err) {
                                    console.log(err);
                                    reject();
                                }
                            });
                            //noinspection JSUnresolvedFunction
                            stmtrel.finalize();
                            fulfill();
                        }
                    });
                });
            });
        });
    },

    insertSimilarwordsIntoWords: function (wordlist, mapping, wtype) {
        return new Promise(function (fulfill, reject) {

            // mapping - WID mapped
            // wtype - noun or adverb ....
            // posmap - position from postager
            // swmap - similar word mapping on WordId

            var stmtUpdate = db.prepare("UPDATE Words SET word_default= ? where wid=?");
            var stmt = db.prepare("INSERT INTO Words(word,wtype,swmap,posmap) VALUES (?,?,?,?)");

            for (var i in wordlist) {
                if (wordlist.hasOwnProperty(i)) {
                    if (i == 0 && (wtype == 'n' || wtype == 'v')) {
                        stmtUpdate.run(wordlist[i], mapping, function (err) {
                            if (err) {
                                console.log(err);
                                reject();
                            }
                        });
                    }
                    else {
                        stmt.run(wordlist[i], wtype, mapping, wtype, function (err) {
                            if (err) {
                                console.log(err);
                                reject();
                            }
                        });
                    }
                }
            }
            //noinspection JSUnresolvedFunction
            stmt.finalize();
            fulfill();
        });
    },

    insertDetailedRelations: function (uid, sid, wid, word_in_step, word_matched, word_type, word_method, uc_connection,
                                       code_type, code_name, code_level, step_number, code_name_fragment) {
        return new Promise(function (fulfill, reject) {
            var stmt;
            stmt = db.prepare("INSERT INTO Detailed_relations(uid,sid,wid,word_in_step,word_matched,word_type," +
                "word_method,uc_connection,code_type,code_name,code_level,step_number,code_name_fragment)" +
                " VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)");
            stmt.run(uid, sid, wid, word_in_step, word_matched, word_type, word_method, uc_connection,
                code_type, code_name, code_level, step_number, code_name_fragment, function (err) {
                    if (err) {
                        console.log("Detailed relations insert error " + err);
                        reject();
                    }
                    else {
                        //noinspection JSUnresolvedFunction
                        stmt.finalize();
                        fulfill();
                    }
                });
        });
    }
};