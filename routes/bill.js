const express = require('express');
const connection = require("../connection");
const router = express.Router();
let ejs = require('ejs');
let pdf = require('html-pdf');
let path = require('path');
var fs = require('fs');
var uuid = require('uuid');
var auth = require('../services/authentication');

router.post('/generateReport', auth.authenticateToken, (req, res) => {
    const generateUUid = uuid.v1();
    const orderDetails = req.body;
    var productDetailsReport = JSON.parse(orderDetails.productDetails);
    var query = "insert into bill (name, uuid, correo, numero, paymentMethod, total, productDetails, createdBy) values(?,?,?,?,?,?,?,?);"
    connection.query(query, [orderDetails.name, generateUUid, orderDetails.correo, orderDetails.numero, orderDetails.paymentMethod, orderDetails.totalAmount, orderDetails.productDetails, res.locals.correo], (err, results) => {
        if (!err) {
            ejs.renderFile(path.join(__dirname, '', "report.ejs"), { productDetails: productDetailsReport, name: orderDetails.name, correo: orderDetails.correo, numero: orderDetails.numero, paymentMethod: orderDetails.paymentMethod, totalAmount: orderDetails.totalAmount}, (err, results) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({message: "error  2"});
                }
                else {
                    pdf.create(results).toFile('./bill_pdf/'+generateUUid+".pdf",function(err, data){
                       if (err) {
                            //console.log(err);
                           return res.status(500).json({message: "error 3"});
                       }else{
                           return res.status(200).json({ uuid: generateUUid });
                        }
                    })
                }
            })
        }
        else {
            return res.status(500).json({message: "error aqui2"});
        }
    })
})

module.exports = router;