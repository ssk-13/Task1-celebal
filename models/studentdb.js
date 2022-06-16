const mongoose =require('mongoose')



const studentSchema = new mongoose.Schema({


    studid:{
        type:String,
        required: true
    },
    username:{
        type:String,
        required: true
    },
    mobile:{
        type:Number,
        required:true
    },
    subject:{
        type:String,
        required:true
    },
    marks:{
        type:Number,
        required:true

    }
})

module.exports = mongoose.model('studentdb',studentSchema)