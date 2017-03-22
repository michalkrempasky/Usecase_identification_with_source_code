/**
 * Created by Michal Krempasky
 * FIIT STU BA
 */

var fs = require('fs');
var delimiter = String(".");
var inserts = require('./../dataHandlers/sqlite3Handler/Inserts');

module.exports = {


    identificationProcess: function (javaClassesArray, ucData, simWords) {
        return new Promise(function (finish, reject) {

            var insertsArray = [];
            var splitWordList;
            var levelBase = String(" <<= ");
            var divider = "->";
            var uc_connection = "".concat(ucData.uid + divider + ucData.name + divider + ucData.sid + divider
                + ucData.step_number + divider + ucData.step + divider + ucData.word + " =>>");

            function splitOnUpperCase(uppCaseWord) {

                return uppCaseWord.split(/(?=[A-Z])/);
            }

            function identification(currentNode, ucData, simWords, level) {

                var levell;
                var typedec;
                var splitWord;
                var sword;

                if (currentNode != null) {

                    for (var property in currentNode) {
                        //console.log("CURRENT NODE: " + JSON.stringify(currentNode[property]));
                        if (currentNode.hasOwnProperty(property)) {
                            switch (currentNode[property].node) {
                                case "Block" : {
                                    //console.log(" BLOCK DECLARATION");
                                    if (currentNode[property].statements == null) {
                                        break;
                                    }
                                    else {
                                        identification(currentNode[property].statements, ucData, simWords, level);
                                        break;
                                    }
                                }//"statements"
                                case "VariableDeclarationStatement" : {

                                    identification(currentNode[property].fragments, ucData, simWords, level);
                                    break;
                                }// "fragments"
                                case "VariableDeclarationFragment" : {

                                    splitWordList = splitOnUpperCase(currentNode[property].name.identifier);
                                    var variable = currentNode[property].name.identifier;
                                    levell = level.concat(delimiter + variable);

                                    for (splitWord in splitWordList) {
                                        if (splitWordList.hasOwnProperty(splitWord)) {
                                            if (ucData.word == splitWordList[splitWord].toLowerCase()) {

                                                insertsArray.push(inserts.insertDetailedRelations(ucData.uid, ucData.sid,
                                                    ucData.wid, ucData.word, ucData.word, ucData.posmap, "Word", uc_connection,
                                                    "VariableDeclaration", variable, levell, ucData.step_number,
                                                    splitWordList[splitWord]));
                                            }
                                            else if (ucData.word_default == splitWordList[splitWord].toLowerCase()) {

                                                insertsArray.push(inserts.insertDetailedRelations(ucData.uid, ucData.sid,
                                                    ucData.wid, ucData.word, ucData.word_default, ucData.posmap, "Word_default",
                                                    uc_connection, "VariableDeclaration", variable, levell, ucData.step_number,
                                                    splitWordList[splitWord]));
                                            }

                                            else {
                                                for (sword in simWords) {
                                                    if (simWords.hasOwnProperty(sword)) {
                                                        if (simWords[sword].word == splitWordList[splitWord].toLowerCase()) {
                                                            insertsArray.push(inserts.insertDetailedRelations(ucData.uid,
                                                                ucData.sid, ucData.wid, ucData.word, simWords[sword].word,
                                                                ucData.posmap, "Synons", uc_connection, "VariableDeclaration",
                                                                variable, levell, ucData.step_number, splitWordList[splitWord]));
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    identification(currentNode[property].initializer, ucData, simWords, levell);
                                    break;
                                }//initializer
                                case "TypeDeclarationStatement" : {

                                    typedec = currentNode[property].declaration;
                                    identification(typedec.bodyDeclarations, ucData, simWords, level);
                                    break;
                                }// "declaration"
                                case "TypeDeclaration": {

                                    splitWordList = splitOnUpperCase(currentNode[property].name.identifier);
                                    var classtype = currentNode[property].name.identifier;
                                    levell = level.concat(delimiter + classtype);

                                    for (splitWord in splitWordList) {
                                        if (splitWordList.hasOwnProperty(splitWord)) {
                                            if (ucData.word == splitWordList[splitWord].toLowerCase()) {

                                                insertsArray.push(inserts.insertDetailedRelations(ucData.uid, ucData.sid,
                                                    ucData.wid, ucData.word, ucData.word, ucData.posmap, "Word",
                                                    uc_connection, "ClassDeclaration", classtype, levell,
                                                    ucData.step_number, splitWordList[splitWord]));
                                            }
                                            else if (ucData.word_default == splitWordList[splitWord].toLowerCase()) {

                                                insertsArray.push(inserts.insertDetailedRelations(ucData.uid, ucData.sid,
                                                    ucData.wid, ucData.word, ucData.word_default, ucData.posmap,
                                                    "Word_default", uc_connection, "ClassDeclaration", classtype,
                                                    levell, ucData.step_number, splitWordList[splitWord]));
                                            }

                                            else {
                                                for (sword in simWords) {
                                                    if (simWords.hasOwnProperty(sword)) {
                                                        if (simWords[sword].word == splitWordList[splitWord].toLowerCase()) {

                                                            insertsArray.push(inserts.insertDetailedRelations(ucData.uid,
                                                                ucData.sid, ucData.wid, ucData.word, simWords[sword].word,
                                                                ucData.posmap, "Synons", uc_connection, "ClassDeclaration",
                                                                classtype, levell, ucData.step_number,
                                                                splitWordList[splitWord]));
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    identification(currentNode[property].bodyDeclarations, ucData, simWords, levell);
                                    break;
                                }//"bodyDeclarations"
                                case "FieldDeclaration": {
                                    identification(currentNode[property].fragments, ucData, simWords, level);
                                    break;
                                } //"fragments"

                                case "MethodInvocation" : {
                                    // arguments, name, typearguments, expression
                                    break;
                                }
                                case "ExpresionStatement": {

                                    //currentNode[property].expression
                                    break;
                                }
                                case "WhileStatement": {
                                    //expression, body
                                    break;
                                }
                                case "ClassInstanceCreation": {
                                    break;
                                }
                                case "MethodDeclaration" : {

                                    splitWordList = splitOnUpperCase(currentNode[property].name.identifier);
                                    var method = currentNode[property].name.identifier;
                                    levell = level.concat(delimiter + method);

                                    for (splitWord in splitWordList) {
                                        if (splitWordList.hasOwnProperty(splitWord)) {
                                            if (ucData.word == splitWordList[splitWord].toLowerCase()) {

                                                insertsArray.push(inserts.insertDetailedRelations(ucData.uid,
                                                    ucData.sid, ucData.wid, ucData.word, ucData.word, ucData.posmap,
                                                    "Word", uc_connection, "MethodDeclaration", method, levell,
                                                    ucData.step_number, splitWordList[splitWord]));
                                            }
                                            else if (ucData.word_default == splitWordList[splitWord].toLowerCase()) {

                                                insertsArray.push(inserts.insertDetailedRelations(ucData.uid,
                                                    ucData.sid, ucData.wid, ucData.word, ucData.word_default,
                                                    ucData.posmap, "Word_default", uc_connection, "MethodDeclaration",
                                                    method, levell, ucData.step_number, splitWordList[splitWord]));
                                            }
                                            else {
                                                for (sword in simWords) {
                                                    if (simWords.hasOwnProperty(sword)) {
                                                        if (simWords[sword].word == splitWordList[splitWord].toLowerCase()) {

                                                            insertsArray.push(inserts.insertDetailedRelations(ucData.uid,
                                                                ucData.sid, ucData.wid, ucData.word, simWords[sword].word,
                                                                ucData.posmap, "Synons", uc_connection, "MethodDeclaration",
                                                                method, levell, ucData.step_number,
                                                                splitWordList[splitWord]));
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }

                                    identification(currentNode[property].body, ucData, simWords, levell);


                                    break;
                                } //"body"
                                default : {
                                    break;
                                }
                            }
                        }
                    }

                }
            }

            function traverseJsonPackage(nodeState) {

                var pom = "";
                if (nodeState == null) {
                    return String("");
                }
                else {
                    switch (nodeState.node) {
                        case "QualifiedName" : {
                            pom = pom.concat(traverseJsonPackage(nodeState.qualifier));
                            pom = pom.concat("." + traverseJsonPackage(nodeState.name));
                            break;
                        }
                        case "SimpleName": {
                            pom = pom.concat(nodeState.identifier);
                            break;
                        }
                        default : {
                            break;
                        }
                    }
                    return pom;
                }
            }

            function packageBuilder(packageJson) {

                if (packageJson == null) {
                    return String(" ");
                }
                else {
                    var name = packageJson.name;
                    var packname = "";
                    packname = packname.concat(traverseJsonPackage(name));
                    return packname;
                }
            }


            for (var jcl in javaClassesArray) {
                if (javaClassesArray.hasOwnProperty(jcl)) {
                    //console.log(javaClassesArray[jcl]);
                    var level = levelBase.concat(packageBuilder(javaClassesArray[jcl].package));
                    // console.log("PACKAGE: "+ level);
                    identification(javaClassesArray[jcl].types, ucData, simWords, level);
                }
            }
            //counterInserts += insertsArray.length;
            //console.log("PO IDENTIFIKACII a INSERTS POLE DLZKA: "+ insertsArray.length);
            Promise.all(insertsArray).then(function () {
                //console.log("INSERTS DONE");
                finish();
            })
                .catch(function (message) {
                    reject();
                    console.log("Inserts array error " + message);
                })
            ;


        });
    }
};