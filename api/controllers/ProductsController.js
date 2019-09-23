'use strict'

const util = require('util')
//const mysql = require('mysql')
//const db = require('./../db')

//const table = 'products'
const QRCode = require('qrcode')
const bwipjs = require('bwip-js');

module.exports = {
    get: (req, res) => {

        var d = new Date();
        console.log("fucking: " + d.toLocaleString());
        //res.json({ 'callapi': 'adu' });


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
        var bc = "12SA{GS}16S1{GS}V805233{GS}S192380001{GS}P646802400D{GS}Q20{GS}3QPCE{GS}H19238{GS}5D190826094{GS}";
        bc = bc.replace(/{RS}/g, String.fromCharCode(30));//     Dim rs As Char = Convert.ToChar(30)
        bc = bc.replace(/{GS}/g, String.fromCharCode(29));
        bc = bc.replace(/{EOT}/g, String.fromCharCode(4));


        bwipjs.toBuffer({
            parsefnc: true,
            bcid: 'datamatrix',       // Barcode type
            text: '^MAC6' + bc,    // Text to encode
            backgroundcolor: 'FFFFFF',
            scale: 2,               // 3x scaling factor
        }, function (err, png) {
            if (err) {
                // Decide how to handle the error
                // `err` may be a string or Error object
            } else {
                // `png` is a Buffer
                // png.length           : PNG file length
                // png.readUInt32BE(16) : PNG image width
                // png.readUInt32BE(20) : PNG image height


                res.json({ 'qrimg': 'data:image/png;base64,' + png.toString('base64') });
      
            }
        });

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
        let data = req.body;

        var segs = [
            { data: 'K71_15_ADA', mode: 'byte' },
            { data: '440250', mode: 'numeric' },
            { data: 'C_', mode: 'byte' },
            { data: '2019.07.01', mode: 'alphanumeric' },
            { data: '_AK', mode: 'byte' },
            { data: '190726', mode: 'numeric' },
            { data: '_005_', mode: 'byte' },
            { data: 'FOLDING CUSHION ASSY LH MC J72K CAB', mode: 'alphanumeric' },
            { data: '_3840', mode: 'byte' }
        ]

        QRCode.toDataURL(segs, { errorCorrectionLevel: 'L', version: 5, maskPattern: 4 }, function (err, url) {
            res.json({ 'qrimg': url });
        })

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
}