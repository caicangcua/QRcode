//var connect = require('express')
//const app = connect()
//var QRCode = require('qrcode')

//var segs = [
//    { data: 'K71_15_ADA', mode:'byte' },
//    { data: '440250', mode: 'numeric' },
//    { data: 'C_', mode:'byte'  },
//    { data: '2019.07.01', mode: 'alphanumeric' },
//    { data: '_AK', mode: 'byte' },
//    { data: '190726', mode: 'numeric' },
//    { data: '_005_', mode: 'byte' },
//    { data: 'FOLDING CUSHION ASSY LH MC J72K CAB', mode: 'alphanumeric' },
//    { data: '_3840', mode: 'byte' }
//]

//QRCode.toDataURL(segs, { errorCorrectionLevel: 'L', version: 5, maskPattern:4}, function (err, url) {
//    console.log(url)
//})

////connect.createServer(testQRCode).listen(3030)
//app.listen(3030)
//console.log('test server started on port 3030')

//https://www.nayuki.io/page/optimal-text-segmentation-for-qr-codes
//https://www.nayuki.io/page/creating-a-qr-code-step-by-step

// tai lieu encode segments
//https://www.sba-research.org/wp-content/uploads/publications/QR_Code_Security.pdf
//project 
//https://github.com/soldair/node-qrcode#qr-code-options


const express = require('express')
const app = express()
const bodyParser = require('body-parser')
require('dotenv').load()
const port = process.env.PORT || 3000

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())


let routes = require('./api/routes') //importing route
routes(app)

app.use(function (req, res) {
    res.status(404).send({ url: req.originalUrl + ' not found' })
})


app.listen(port)

console.log('RESTful API server started on: ' + port)