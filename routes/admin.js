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


//admin login
//jwt
router.post('/login',(req,res)=>{
    //Authenticate admin

    const username=req.body.adminid
    const user={name: username}
    const accessToken=jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
    res.json({accessToken:accessToken})


})


//add new students
router.post('/addstudent',authToken,async(req,res)=>{
    const students =new studentdb({
     
        studid: req.body.studid,
        username: req.body.username,
        mobile: req.body.mobile,
        subject: req.body.subject,
        marks: req.body.marks

    })

    try{
        const a1 = await students.save()
        res.json(a1)

    }catch(error){
        res.send('Error' +error)

    }

})

//admin details update
router.put('/update',authToken,async(req,res)=>{
    try {

        let update =await studentdb.updateOne({studid:req.body.studid},{$set:req.body})
        res.send(update)

        
    } catch (error) {
        res.send('Error' +error)
        
    }
})




//admin delete record

router.delete('/delete/:studid',authToken,async(req,res)=>{
    
    try {

        let deletedata = await studentdb.deleteOne({studid:req.params.studid})
        res.send(deletedata)
    } catch (error) {
        res.send('Error' +error)
        
    }
})





module.exports=router