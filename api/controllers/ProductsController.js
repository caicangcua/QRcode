'use strict'
//https://techtalk.vn/blog/posts/bai-21-cach-cau-hinh-iisnode-web-server-cho-nodejs
const util = require('util')
//const mysql = require('mysql')
//const db = require('./../db')

//const table = 'products'
const QRCode = require('qrcode')
const bwipjs = require('bwip-js');
var url = require('url');

var self = module.exports = {
    get: (req, res) => {

        var d = new Date();
        console.log("fucking: " + d.toLocaleString());
        //res.json({ 'callapi': 'adu' });


        
    },
    detail: (req, res) => {
        let sql = 'SELECT * FROM products WHERE id = ?'
        db.query(sql, [req.params.productId], (err, response) => {
            if (err) throw err
            res.json(response[0])
        })
    },
    update: (req, res) => {
        let data = req.body;
        let productId = req.params.productId;
        let sql = 'UPDATE products SET ? WHERE id = ?'
        db.query(sql, [data, productId], (err, response) => {
            if (err) throw err
            res.json({ message: 'Update success!' })
        })
    },
    store: (req, res) => {
        var args = url.parse(req.url, true).query;
        if (!args || !args.bcid) {
            res.json({ 'qrimg': '' });
        } else {
            if (args.bcid == 'qrcode') {
                self.QRcode(req, res);
            } else if (args.bcid == 'datamatrix') {
                self.DataMatrix(req, res);
            } else {
                res.json({ 'qrimg': '' });
            }
        }


        //let sql = 'INSERT INTO products SET ?';
        //var d = new Date();
        //console.log(data.UUID + ": " + d.toLocaleString() + ' - lat: ' + data.lat + ' - lng: ' + data.lng + ' - statux: ' + data.statux);
        //res.json({ message: 'Insert success!' })

        //db.query(sql, [data], (err, response) => {
        //    if (err) throw err
        //    res.json({ message: 'Insert success!'})
        //})
    },
    delete: (req, res) => {
        let sql = 'DELETE FROM products WHERE id = ?'
        db.query(sql, [req.params.productId], (err, response) => {
            if (err) throw err
            res.json({ message: 'Delete success!' })
        })
    }
    , DataMatrix: (req, res) => {
        //var bc = "[)>{RS}06{GS}12SA{GS}16S1{GS}V805233{GS}S192380001{GS}P646802400D{GS}Q20{GS}3QPCE{GS}H19238{GS}5D190826094{GS}{RS}{EOT}";
        //var bc = "^MAC612SA{GS}16S1{GS}V805233{GS}S192380001{GS}P646802400D{GS}Q20{GS}3QPCE{GS}H19238{GS}5D190826094{GS}";
        //var bc = "^MAC612SA16S1V805233S192380001P646802400DQ203QPCEH192385D190826094";
        //bc = bc.replace(/{RS}/g, '^030');//     Dim rs As Char = Convert.ToChar(30)
        //bc = bc.replace(/{GS}/g, '^029');
        //bc = bc.replace(/{EOT}/g, '^004');
        // *****************************************************************************************
        //You can invoke Macro 06 by putting "^MAC6" as a prefix to your input
        //data. For example:

        //Data: ^MAC6remainderOfStructuredData
        //Options: parsefnc dmre

        //Macro 06 should cause a reader to emit a header of "[)>{RS}06{GS}" and
        //trailer of "{RS}{EOT}" so you need only specify the structured data
        //that goes in between.
        // *****************************************************************************************
        //https://groups.google.com/forum/#!msg/postscriptbarcode/G8Eq253g5Pw/aJ8z2IctAwAJ
        //var bc = "12SA{GS}16S1{GS}V805233{GS}S192380001{GS}P646802400D{GS}Q20{GS}3QPCE{GS}H19238{GS}5D190826094{GS}";

        let data = req.body;
        var bc = data[0];
        bc = bc.replace(/{RS}/g, String.fromCharCode(30));//     Dim rs As Char = Convert.ToChar(30)
        bc = bc.replace(/{GS}/g, String.fromCharCode(29));
        bc = bc.replace(/{EOT}/g, String.fromCharCode(4));


        bwipjs.toBuffer({
            parsefnc: true,
            bcid: 'datamatrix',       // Barcode type
            text:  bc,    // Text to encode
            backgroundcolor: 'FFFFFF',
            scale: 2,               // 3x scaling factor
        }, function (err, png) {
            if (err) {
                // Decide how to handle the error
                // `err` may be a string or Error object
                res.json({ 'qrimg': url });

            } else {
                // `png` is a Buffer
                // png.length           : PNG file length
                // png.readUInt32BE(16) : PNG image width
                // png.readUInt32BE(20) : PNG image height


                res.json({ 'qrimg': 'data:image/png;base64,' + png.toString('base64') });

            }
        });

    }
    , QRcode: (req, res) => {
        let data = req.body;
        var bc = data[0];//'K71_15_ADA440250C_2019.07.01_AK190726_006_FOLDING CUSHION ASSY LH MC J72K CAB_3840';//

        var rawPart = bc.split('_ADA');
        var K71_15_ADA = rawPart[0] + '_ADA';
        bc = rawPart[1];

        var _440250 = '', prefixC = 'C_';
        rawPart = bc.split(prefixC);
        if (rawPart.length == 1) {
            prefixC = 'V_';
            rawPart = bc.split(prefixC);
        };
        _440250 = rawPart[0];
        bc = rawPart[1];

        rawPart = bc.split('_AK');
        var _2019_07_01 = rawPart[0];
        //
        bc = rawPart[1];
        rawPart = bc.split('_');

        var partname = [];
        for (var i = 2; i < rawPart.length - 1; i++) {
            partname.push(rawPart[i]);
        }

        var segs = [
            { data: K71_15_ADA, mode: 'byte' },
            { data: _440250, mode: 'numeric' },
            { data: prefixC, mode: 'byte' },
            { data: _2019_07_01, mode: 'alphanumeric' },
            { data: '_AK', mode: 'byte' },
            { data: rawPart[0], mode: 'numeric' },
            { data: '_' + rawPart[1] + '_', mode: 'byte' },
            { data: partname.join('_'), mode: 'alphanumeric' },
            { data: '_' + rawPart[ rawPart.length - 1], mode: 'byte' }
        ]

        QRCode.toDataURL(segs, { errorCorrectionLevel: 'L', version: 5, maskPattern: 4 }, function (err, url) {
            res.json({ 'qrimg': url });
        })
    }
}