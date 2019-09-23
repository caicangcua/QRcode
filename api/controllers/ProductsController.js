'use strict'

const util = require('util')
//const mysql = require('mysql')
//const db = require('./../db')

//const table = 'products'
const QRCode = require('qrcode')
module.exports = {
    get: (req, res) => {
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
        let data = req.body;
        let sql = 'INSERT INTO products SET ?';
        var d = new Date();
        console.log(data.UUID + ": " + d.toLocaleString() + ' - lat: ' + data.lat + ' - lng: ' + data.lng + ' - statux: ' + data.statux);
        res.json({ message: 'Insert success!' })

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