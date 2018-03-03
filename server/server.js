var express = require('express');
var bodyParser = require('body-parser');

var mongoose = require('./db/mongoose.js').mongoose;
var User = require('./models/user').User;
var Todo = require('./models/todo').Todo;

var app = express();
app.use(bodyParser.json());

app.post('/todos',(req,res) => {
    var todo = new Todo({
        text:req.body.text,
        completed:req.body.completed,
        completedAt:req.body.completedAt
    });
    todo.save().then((result)=>{
        res.send(result);
    },(err)=>{
        res.status(400).send(err);
    });
    console.log(req.body);
});

app.get('/todos',(req,res)=>{
    Todo.find().then((todos)=>{
        res.send({todos:todos});
    },(err)=>{
        res.status(400).send(err);
    });
});

app.listen(3000,()=>{
    console.log('Server started on port 3000');
})

module.exports = {app};

//https://maps.googleapis.com/maps/api/geocode/json?address=BN164GB&key=AIzaSyDGG6l5sdrAy3c4kmqQAM-WoefoUVr1Usw

// var user = new User({email:' guy.pender@me.com  '});
// user.save().then((result)=>{
//     console.log(JSON.stringify(result,undefined,2));
// },(err)=>{
//     console.log('Unable to save user',err);
// });
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

//var otherTodo = new Todo({text:'feed cat',completed:true,completeAt:8});
//var otherTodo = new Todo({text:'  guy   '});

//  otherTodo.save().then((result)=>{
//     console.log(JSON.stringify(result,undefined,2));
//  },(err)=>{
//      console.log('error saving');
//  })
// save new something