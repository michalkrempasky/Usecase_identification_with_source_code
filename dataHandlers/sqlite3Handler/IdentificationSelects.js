/**
 * Created by Michal Krempasky
 * FIIT STU BA
 */

module.exports={

    selectDataForIdentification1: function () {
        return new Promise(function (resolve,reject) {
            db.all("SELECT Use_cases.uid,Use_cases.name,Steps.sid,Steps.step_number,Steps.step,Words.wid," +
                "Words.word,Words.posmap,Words.word_default "+
                "FROM Use_cases "+
                "JOIN Steps ON Steps.uid=Use_cases.uid "+
                "JOIN Step_word ON Step_word.sid=Steps.sid "+
                "JOIN Words ON Words.wid=Step_word.wid "+
                "WHERE Words.posmap='v' or Words.posmap='n' or Words.posmap='a' "+
                "ORDER BY Use_cases.uid,Steps.step_number; ",
                function (err,res) {
                    if(err){
                        console.log("Data for identification select Error " + err);
                        reject();
                    }
                    // console.log("QM SELECT DATA FOR IDENT data selected" + JSON.stringify(res));
                    resolve(res);
                });
        });
    },

    selectSimilarWordsForIdentification1: function (wid) {
        return new Promise(function (ondone,reject) {
            db.all("select Words.word from Words where swmap= ? ;",
                [wid],function (err,res) {
                    if(err){
                        console.log("Similar words select Error "+ err);
                        reject(err);
                    }
                    // console.log("QM SIMWselect for WID:" + wid + JSON.stringify(res));
                    ondone(res);
                });
        });
    }

};