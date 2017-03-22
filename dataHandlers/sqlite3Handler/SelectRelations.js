/**
 * Created by Michal Krempasky
 * FIIT STU BA
 */

//todo: errors
var os = require('os');
var fs = require('fs');

module.exports = {

    selectFinalDataFromDetailedRelations: function () {
        return new Promise(function (resolve, reject) {
            db.all("SELECT DISTINCT Detailed_relations.uid,sid,wid,word_in_step,word_matched,word_type,word_method," +
                "uc_connection,code_type,code_name,code_level,step_number,code_name_fragment,name " +
                "FROM Detailed_relations " +
                "JOIN Use_cases ON Use_cases.uid = Detailed_relations.uid ORDER BY Detailed_relations.uid"
                , function (err, res) {
                    if (err) {
                        console.log(err);
                        reject();
                    }
                    else {
                        var arr = "";
                        for (var h in res) {
                            if (res.hasOwnProperty(h)) {
                                arr = arr.concat(JSON.stringify(res[h]), os.EOL);
                            }
                        }
                        fs.writeFile("final.txt", arr, function (err) {
                            if (err) {
                                console.log("writefile error" + err);
                            }
                            else {
                                resolve();
                                console.log("The file was saved!");
                            }
                        });
                    }
                });
        });
    }
};