var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp');

var Todo = mongoose.model('Todo',{
    text:{
        type:String
    },
    completed:{
        tye:Boolean
    },
    completeAt:{
        type:Number
    }
});

// var newTodo = new Todo({text:'Cook Dinner',completed:false});

// newTodo.save().then((result)=>{
//     console.log('Saved to do ', result);
// },(e)=>{
//     console.log('Unable to save todo');
// });

// var newTodo = new Todo({text:'Cook Dinner',completed:false});

// newTodo.save().then((result)=>{
//     console.log('Saved to do ', result);
// },(e)=>{
//     console.log('Unable to save todo');
// });

 var otherTodo = new Todo({text:'feed cat',completed:true,completeAt:8});

 otherTodo.save().then((result)=>{
    console.log(JSON.stringify(result,undefined,2));
 },(err)=>{
     console.log('error saving');
 })
// save new something