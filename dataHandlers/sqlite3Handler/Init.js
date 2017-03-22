/**
 * Created by Michal Krempasky
 * FIIT STU BA
 */

module.exports = {

    createTables: function () {
        return new Promise(function (fulfill, reject) {

            db.serialize(function () {

                db.run("DROP TABLE IF EXISTS Step_word",function (err) {
                    if(err){
                        console.log(err);
                        reject();
                    }
                });
                db.run("DROP TABLE IF EXISTS Steps");
                db.run("DROP TABLE IF EXISTS Use_cases");
                db.run("DROP TABLE IF EXISTS Words");
                db.run("DROP TABLE IF EXISTS Classes");
                db.run("DROP TABLE IF EXISTS Detailed_relations");

                db.run("PRAGMA foreign_keys=ON");
                db.run("CREATE TABLE Use_cases(uid INTEGER PRIMARY KEY, uc_type VARCHAR(15), name VARCHAR(25))");

                db.run("CREATE TABLE Steps (sid INTEGER PRIMARY KEY, " +
                    "uid INTEGER, step_number VARCHAR(5), step TEXT, FOREIGN KEY (uid) REFERENCES Use_cases(uid))");

                db.run("CREATE TABLE Words (wid INTEGER PRIMARY KEY,word VARCHAR(30), " +
                    "wtype VARCHAR(30), swmap INTEGER, posmap TEXT, word_default VARCHAR(30))");

                db.run("CREATE TABLE Step_word (id INTEGER PRIMARY KEY,sid INTEGER," +
                    "wid INTEGER, FOREIGN KEY (sid) REFERENCES Steps(sid), FOREIGN KEY (wid) REFERENCES Words(wid))");

                db.run("CREATE TABLE Classes (id INTEGER PRIMARY KEY, class_name VARCHAR(50), class_data BLOB )");

                db.run("CREATE TABLE Detailed_relations (id INTEGER PRIMARY KEY, "+
                    " uid INTEGER, sid INTEGER , wid INTEGER,  word_in_step TEXT, word_matched TEXT, word_type VARCHAR(5)," +
                    " word_method VARCHAR(5), uc_connection TEXT, code_type TEXT, code_name TEXT, code_level TEXT, step_number TEXT, code_name_fragment TEXT,"  +
                    " FOREIGN KEY (uid) REFERENCES Use_cases(uid),FOREIGN KEY (sid) REFERENCES Steps(sid), FOREIGN KEY (wid) REFERENCES Words(wid))");

                console.log("DB created");
                fulfill();
            });
        });
    }
};