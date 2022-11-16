const express = require('express');
const connection = require("../connection");
const router = express.Router();
let ejs = require('ejs');
let pdf = require('html-pdf');
let path = require('path');
var fs = require('fs');
var uuid = require('uuid');
var auth = require('../services/authentication');

router.post('/generateReport', (req, res) => {
    const generateUUid = uuid.v1();
    const orderDetails = req.body;
    var productDetailsReport = JSON.parse(orderDetails.productDetails);
    var query = "insert into bill (name, uuid, correo, numero, paymentMethod, total, productDetails) values(?,?,?,?,?,?,?);"
    connection.query(query, [orderDetails.name, generateUUid, orderDetails.correo, orderDetails.numero, orderDetails.paymentMethod, orderDetails.totalAmount, orderDetails.productDetails], (err, results) => {
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
            return res.status(500).json({message: err});
        }
    })
})

router.post('/getPdf', function(req, res){
    const orderDetails = req.body;
    const pdfPath = './bill_pdf/'+orderDetails.uuid+'.pdf';
    if(fs.existsSync(pdfPath)){
        res.contentType("application/pdf");
        fs.createReadStream(pdfPath).pipe(res);
    }else{
        var productDetailsReport = JSON.parse(orderDetails.productDetails);
        ejs.renderFile(path.join(__dirname, '', "report.ejs"), { productDetails: productDetailsReport, name: orderDetails.name, correo: orderDetails.correo, numero: orderDetails.numero, paymentMethod: orderDetails.paymentMethod, totalAmount: orderDetails.totalAmount}, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ err});
            }
            else {
                pdf.create(results).toFile('./bill_pdf/'+orderDetails.uuid+".pdf",function(err, data){
                   if (err) {
                        //console.log(err);
                       return res.status(500).json({message: "error 3"});
                   }else{
                    res.contentType("application/pdf");
                    fs.createReadStream(pdfPath).pipe(res);
                    }
                })
            }
        })
    }
})

router.get('/getBills', (req, res, next)=>{
    var query = "select * from bill order by id DESC";
    connection.query(query,(err,results)=>{
        if(!err){
            return res.status(200).json(results);
        }
    })

})

router.delete('/delete/:id', (req, res, next)=>{
    const id = req.params.id;
    var query = "delete from bill where id = ?"
    connection.query(query,[id],(err,results)=>{
        if(!err){
            return res.status(200).json({message: "recibo eliminado"});
        }
    })

})

module.exports = router;