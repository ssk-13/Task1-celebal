const express = require('express')
const app = express()
require('dotenv').config()

const mongoose = require('mongoose')
const url = 'mongodb://localhost/Student'
const studentdb = require('./models/studentdb')
require('dotenv').config()
const jwt= require('jsonwebtoken')

const swaggerJsDoc=require('swagger-jsdoc')
const swaggerUI=require('swagger-ui-express')

//swagger documentation

//Extended: https://swagger.io/specification/#infoObject
const swaggerOptions ={
    definition:{
        openapi:'3.0.0',
        components:{
            securitySchemes:{
                bearerAuth:{
                 type: 'http',
                 scheme:'bearer',
                 bearerFormat: 'JWT'

        }}},
        security:[{
            bearerAuth:[]
        }],
        info:{
            title:'student application',
            description:'students can view result and personal info',
            version:'1.0.0',
            contact:{
                name:'Shubham Kotkar'
            },
            servers:['http://localhost:8000']
            }
        },
        //['.routes/*.js']
        apis:['./routes/admin','./routes/students','app.js']
    };

    const swaggerDocs=swaggerJsDoc(swaggerOptions)
    app.use('/api-docs',swaggerUI.serve, swaggerUI.setup(swaggerDocs))
    
//Routes
/**
 * @swagger
 * /all:
 *  get:
 *     summary: Returns a list of users.
 *     description: Optional extended description in CommonMark or HTML.
 *     responses:
 *       '200':    # status code
 *         description: A JSON array of user names
 *         content:
 *           application/json:
 *             schema: 
 *               type: array
 *               items: 
 *                 type: string
 * 
 * 
 * 
 * /admin/login:
 *  post:
 *   description: login admin using adminid
 *   requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               adminid:
 *                 type: string
 *   responses:
 *     '200':    # status code
 *         description: access token
 *         content:
 *           application/json:
 *             schema: 
 *               type: array
 *               items: 
 *                 type: string
 * 
 * 
 * 
 * /admin/addstudent:
 *  post:
 *   description: add new student 
 *   requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               studid:
 *                 type: string
 *               username:
 *                  type: string
 *               mobile:
 *                  type: number
 *               subject:
 *                  type: string
 *               marks:
 *                  type: number        
 *   responses:
 *     '200':    # status code
 *         description: access token
 *         content:
 *           application/json:
 *             schema: 
 *               type: array
 *               items: 
 *                 type: string
 * 
 * 
 * 
 * /admin/update:
 *  put:
 *   description: update student  all info 
 *   requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               studid:
 *                 type: string
 *               username:
 *                  type: string
 *               mobile:
 *                  type: number
 *               subject:
 *                  type: string
 *               marks:
 *                  type: number  
 *   responses:
 *     '200':    # status code
 *         description: access token
 *         content:
 *           application/json:
 *             schema: 
 *               type: array
 *               items: 
 *                 type: string
 * 
 * 
 * 
 * /admin/delete/{id}:
 *  delete:
 *   description: delete student from database
 *   parameters:
 *     - in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: string
 *   responses:
 *     '200':    # status code
 *         description: access token
 *         content:
 *           application/json:
 *             schema: 
 *               type: array
 *               items: 
 *                 type: string
 * 
 * 
 * 
 * 
 * 
 * /student/login:
 *  post:
 *   description: login student using studid
 *   requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               studid:
 *                 type: string
 *   responses:
 *     '200':    # status code
 *         description: access token
 *         content:
 *           application/json:
 *             schema: 
 *               type: array
 *               items: 
 *                 type: string
 * 
 * 
 * 
  * /student/update:
 *  put:
 *   description: update student personal info 
 *   requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               studid:
 *                 type: string
 *               username:
 *                  type: string
 *               mobile:
 *                  type: number
 *               subject:
 *                  type: string 
 *   responses:
 *     '200':    # status code
 *         description: access token
 *         content:
 *           application/json:
 *             schema: 
 *               type: array
 *               items: 
 *                 type: string
 *         
 * 
 * 
 * 
 * /student/result:
 *  get:
 *     summary: Returns a marks of subject.
 *     description: Optional extended description in CommonMark or HTML.
 *     responses:
 *       '200':    # status code
 *         description: A JSON array of user names
 *         content:
 *           application/json:
 *             schema: 
 *               type: array
 *               items: 
 *                 type: string
 * 
 * 
 * /me:
 *  get:
 *     summary: Returns a user details.
 *     description: Optional extended description in CommonMark or HTML.
 *     responses:
 *       '200':    # status code
 *         description: A JSON array of user names
 *         content:
 *           application/json:
 *             schema: 
 *               type: array
 *               items: 
 *                 type: string
 * 
 * 
 *                   
 */

//mongodb connection
mongoose.connect(url, {useNewUrlParser:true})
const con = mongoose.connection

con.on('open',()=>{
    console.log('connected...')
})


//for json format
app.use(express.json())



const admin =require('./routes/admin')
app.use('/admin',admin)

const student =require('./routes/students')
app.use('/student',student)

//all database
app.get('/all',async(req,res)=>{
    try {
            const students= await studentdb.find()
            res.json(students)
    } catch (error) {
        res.send('Error' +error)

        
    }
})


//get student details
app.get('/me',authToken,async(req,res)=>{
    try {
            const students= await studentdb.find({studid: req.user.name},{marks:0})
            res.json(students)
    } catch (error) {
        res.send('Error' +error)

        
    }
})



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


app.listen(8000,()=>{
    console.log('Server started')
})