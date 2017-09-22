var http = require('http');
var fs = require('fs');
var path = require('path');
var gm = require('gm');
var multiparty = require('multiparty');



http.createServer(function (req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    var form = new multiparty.Form({
        uploadDir: './picture'
    });
    form.parse(req, function (err, fields, files) {
        let filename = form.uploadDir + '/' + files.picture[0].originalFilename
        fs.renameSync(files.picture[0].path, filename)
        let truepathname = path.resolve(__dirname, filename)
        let cropData = fields.cropData[0].split(',')
        cropData = cropData.map(num => {
            return Math.floor(num)
        })
        console.log(cropData)
        gm(truepathname).crop(cropData[2], cropData[3], cropData[0], cropData[1]).resize(cropData[4], cropData[5], '!').write(truepathname, (e, d) => {
            console.log(e)
            res.end('ok');
        })
    })
}).listen(3000);