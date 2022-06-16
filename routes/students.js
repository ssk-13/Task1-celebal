const express = require('express')
const router = express.Router()
const studentdb = require('../models/studentdb')
require('dotenv').config()
const jwt= require('jsonwebtoken')





//middelware authtoken function

function authToken(req,res,next){
    const authHeader =req.headers['authorization']
    const token= authHeader && authHeader.split(' ')[1]
    if (token==null) return res.sendStatus(401)

    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,user)=>{
        if (err) return res.sendStatus(403)
        req.user=user
        next()
    })
    

}

//student login
//jwt
router.post('/login',(req,res)=>{
    //Authenticate USer

    const username=req.body.studid
    const user={name: username}
    const accessToken=jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
    res.json({accessToken:accessToken})


})

//get results
router.get('/result',authToken,async(req,res)=>{
    try {
            const students= await studentdb.find({studid: req.user.name})
            res.json(students)
    } catch (error) {
        res.send('Error' +error)

        
    }
})



//student details update

router.put('/update',authToken,async(req,res)=>{
    try {

        let update =await studentdb.updateOne({studid:req.user.name},{$set:req.body})
        res.send({status:"updated"})

        
    } catch (error) {
        res.send('Error' +error)
        
    }
})





module.exports=router