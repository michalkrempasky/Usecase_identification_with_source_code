/**
 * Created by Michal Krempasky
 * FIIT STU BA
 */

var Promise= require('promise');

module.exports = {

    selectUCidByName: function (uid) {
        return new Promise(function(resolve,reject){
            db.all("SELECT uid FROM Use_cases WHERE name= ?",[uid],function(err,res){

                if(err != null && res == null ){
                    console.log("Select UC by name error "+ err);
                    reject(err);
                }
                resolve(res);
            });
        });
    },

    selectStepsAndSid: function(){
        return new Promise(function(resolve,reject){
            db.all("SELECT sid AS id, step FROM Steps",function(err,res){

                if(err){
                    console.log("Select steps and SID error "+ err);
                    reject();
                }
                resolve(res);
            });
        });
    },

    selectWordsData: function(){
        return new Promise(function(resolve,reject){
            db.all("SELECT wid,word,posmap FROM Words",function(err,res){
                if(err){
                    console.log("select words data error "+ err);
                    reject();
                }
                resolve(res);
            });
        });
    }
};