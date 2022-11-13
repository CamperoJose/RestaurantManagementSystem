const express = require('express');
const connection = require("../connection");
const router = express.Router();
var auth = require('../services/authentication');
var checkRole = require('../services/checkRole');

router.post('/add',auth. authenticateToken, checkRole.checkRole, (req, res, next)=>{
    let category = req.body;
    query = "insert into category (name) values (?)";
    connection.query(query, [category.name], (err, results)=>{
        if(!err){
            return res.status (200) .json({message: "Category Added Successfully"});
        }
        else{
            return res. status (500).json(err);
        }
    })
})

router.get('/get',auth. authenticateToken, (req, res, next)=>{
    var query = "select * from category"
    connection.query(query, (err, results)=>{
        if(!err){
            return res.status (200) .json(results);
        }
        else{
            return res. status (500).json(err);
        }
    })
})

router.patch('/update',auth. authenticateToken, checkRole.checkRole, (req, res, next)=>{
    let product = req.body;
    var query = "update category set name=? where id=?"
    connection.query(query, [product.name, product.id],(err, results)=>{
        if(err){
            return res. status (500).json(err);
        }
        else{
            return res. status (200).json({message: "categoria actualizada"});
        }
    })
})

module.exports = router;
