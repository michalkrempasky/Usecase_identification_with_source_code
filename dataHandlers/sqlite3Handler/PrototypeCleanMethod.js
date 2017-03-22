/**
 * Created by Michal Krempasky
 * FIIT STU BA
 */

module.exports = {

    cleanup: function () {
        return new Promise(function (fulfill, reject) {

            db.serialize(function () {
                db.run("DROP TABLE IF EXISTS Detailed_relations");

                db.run("CREATE TABLE Detailed_relations (id INTEGER PRIMARY KEY, "+
                    " uid INTEGER, sid INTEGER , wid INTEGER,  word_in_step TEXT, word_matched TEXT, word_type VARCHAR(5)," +
                    " word_method VARCHAR(5), uc_connection TEXT, code_type TEXT, code_name TEXT, code_level TEXT, step_number TEXT, code_name_fragment TEXT,"  +
                    " FOREIGN KEY (uid) REFERENCES Use_cases(uid),FOREIGN KEY (sid) REFERENCES Steps(sid), FOREIGN KEY (wid) REFERENCES Words(wid))",function (err) {
                    if(err){
                        console.log("PROTOTYPE CLEAN METHOD error: "+ err);
                        reject(err);
                    }
                    else{
                        console.log("Initial Cleanup of Relations DONE");
                        fulfill();
                    }
                });
            });
        });
    }
};