const express = require('express');
const connection = require('../connection')
const router = express.Router();

const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();
var auth = require('../services/authentication')
var checkRole = require('../services/checkRole')
router.post('/signup', (req, res) => {
    let user = req.body;
    query = "select correo, password, role, status from user where correo=?";
    connection.query(query, [user.correo], (err, results) => {
        if (!err) {
            if (results.length <= 0) {
                query = "insert into user (name, numero, correo, password, status, role) values(?,?,?,?, 'false', 'user')"
                connection.query(query, [user.name, user.numero, user.correo, user.password], (err, results) => {
                    if (!err) {
                        return res.status(200).json({ message: "registrado correctamente" });
                    } else {
                        return res.status(500).json(err);
                    }
                })
            } else {
                return res.status(400).json({ message: "correo ya existe" });
            }
        } else {
            return res.status(500).json(err);
        }
    })
})

router.post('/login', (req, res) => {
    const user = req.body;
    query = "select correo, password, role, status from user where correo=?";
    connection.query(query, [user.correo], (err, results) => {
        if (!err) {
            if (results.length <= 0 || results[0].password != user.password) {
                return res.status(401).json({ message: "usuario o contrasena incorrecta" });
            }
            else if (results[0].status === 'false') {
                return res.status(401).json({ message: "espera de aprobacion" });
            }

            else if (results[0].password == user.password) {
                const response = { correo: results[0].correo, role: results[0].role };
                const accessToken = jwt.sign(response, process.env.ACCESS_TOKEN, { expiresIn: '8h' });
                res.status(200).json({ token: accessToken })

            } else {
                return res.status(400).json({ message: "ocurrio un problema inesperado, vuelva a intentar" });
            }


        }
        else {
            return res.status(500).json(err);
        }
    })
})


router.get('/get', auth.authenticateToken,checkRole.checkRole,(req, res) =>{
    var query = "select id, name, numero, correo, status from user where role='user'";
    connection.query(query,(err, results)=>{
        if(!err){
            return res.status(200).json(results);
        }
        else {
            return res.status(500).json(err);
        }
    })
})

router.patch('/update', (req, res) =>{
    let user = req.body;
    var query = "update user set status=? where id=?"
    //var query = "select id, name, numero, correo, status from user where role='user'";
    connection.query(query,[user.status, user.id], (err, results)=>{
        if(!err){
            if(results.affectedRows == 0){
                return res.status(404).json({ message: "id de4 usuario no existe" });
            }
            return res.status(200).json({ message: "usuario actualizado" });
        }
        else {
            return res.status(500).json(err);
        }
    })
})

router.get('/checktoken', (req, res)=>{
    return res.status(200).json({ message: "true" });
})

router.post('/changePassword', (req, res)=>{
    //const
})

module.exports = router;
