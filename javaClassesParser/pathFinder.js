/**
 * Created by Michal Krempasky
 * FIIT STU BA
 */

const FileHound = require('filehound');

module.exports = {

    javaClassFinderFileHound: function (path) {

        return new Promise(function (resolve, reject) {

            if (process.argv[2] == "-t" || process.argv[2] == "-d") {
                // path='C:/Users/KrempiOEM/WebstormProjects';
                //path=process.argv[3];
                ///TODO: uprav cesty
                // path='C:/Users/michal.krempasky/WebstormProjects';
                path = codeDirectory;
                console.log(path);
            }
            //'C:/Users/KrempiOEM/WebstormProjects'
            const files = FileHound.create()
                .paths(path)
                .ext('java')
                .find();
            files.then(function (list) {
                //console.log(list);
                resolve(list);

            }).catch(function (message) {
                console.log("Filehound ERROR:" + message);
                reject(message);
            });
        });
    }
};