#!/usr/bin/env node

const fs = require('fs');
const request = require('request');
const path = require('path');
const dois = fs.readFileSync(process.argv[2],{encoding:'utf8'}).trim().split("\n");
const tmpDir = '/dev/shm';
const outputDir = process.argv[3];
const suffixUrl = process.argv[4];
const crossrefPrefix = 'https://api.crossref.org/works/';
// const eachOfLimit =require('async/eachOfLimit');
const mapLimit =require('async/mapLimit');
const spawnSync = require('child_process').spawnSync;

// dois.forEach(myDoi => {
//     console.log("retrieving ref for DOI "+myDoi);
//     request.get(crossrefPrefix+myDoi+'.xml')
//     .on('error', function(err) {
//         console.log(err)
//       })
//     .on('response', function(response) {
//         console.log(response.statusCode) // 200
//         console.log(response.headers['content-type']) // 'image/png'
//         // console.log(response);
//     }).on('data', function(data) {
//         console.log(new Buffer(data).toString('utf8')) // 200
        
//     });
// });


mapLimit(dois, 10, function(myDoi,cb) {
    let xmlData = '';
    let statusCode = 0;
    const suffix = (suffixUrl && suffixUrl!=='') ? suffixUrl : '';
    const apiDocUrl = crossrefPrefix+myDoi+'.xml'+suffix;
    request.get(apiDocUrl)
    .on('response', function(response) {
        if (response.statusCode !== 200 ) {
            console.error("Erreur dans la récupération de "+apiDocUrl);
            console.error("Status code : "+response.statusCode);
            console.error("Body renvoyé : "+xmlData);
        }
        statusCode = response.statusCode;
    })
    .on('error', function(err) {
        console.log(err)
        cb(err);
    })
    .on('data', function(data) {
        xmlData += data;
        // console.log(new Buffer(data).toString('utf8')) // 200    
    })
    .on('end', function(response) {
        if (statusCode !== 200 ) {
            cb();
        } else {
            const tmpPath = path.join(tmpDir,myDoi.replace(/\//g,'_')+'.xml');
            const outputPath = path.join(outputDir,myDoi.replace(/\//g,'_')+'.xml');
            // console.log('xml string : ',xmlString)
            console.log('écriture du fichier '+outputPath);

            
            fs.writeFileSync(tmpPath,xmlData.toString('utf8'),{encoding:'utf8'});
            const args = ['--output',outputPath ,'crossref.xsl',tmpPath];
            const opts = {}
            const res = spawnSync('xsltproc',args,opts);
            if (res.status === 0) {
                console.log(outputPath+" : génération OK");
            } else {
                console.error(outputPath+" : fichier non généré (code "+res.status+").");
                console.error("Erreur : "+res.stderr);
            }
            fs.unlinkSync(tmpPath);
            cb(res.status);
        }
    });

}, function(){
    console.log("fini !")
});

