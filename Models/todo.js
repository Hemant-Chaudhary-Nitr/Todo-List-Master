const mongoose=require('mongoose');

const todoSchema = new mongoose.Schema({
    task: {
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    class:{
        type: String,
        required: true
    }
});

const Todo=mongoose.model('Todolist',todoSchema);

module.exports=Todo; 