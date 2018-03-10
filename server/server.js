require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var mongoose = require('./db/mongoose.js').mongoose;
var User = require('./models/user').User;
var {authenticate} = require('./middleware/authenticate');
var Todo = require('./models/todo').Todo;

var app = express();
const port = process.env.PORT;// || 3000;

app.use(bodyParser.json());

app.post('/users',(req,res)=>{
    var body = _.pick(req.body,['email','password']);
    var user = new User(body);
    
    user.save().then((result) => {
       return user.generateAuthToken();
    },(err)=>{
        res.status(400).send();
    }).then((token) => {
        if(token){
            res.header('x-auth',token).send(user);
        }else{
            res.status(400).send();
        }
    })
    .catch((err)=>{
        res.status(400).send(err);
    });
});

app.get('/users/me',authenticate,(req,res)=>{
    res.send(req.user);
});

app.get('/users',(req,res)=>{
    User.find().then((users)=>{
        res.send({users});
    },(err)  => {
        res.status(404).send('Error fetching users')
    });
});

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

app.get('/todos/:id',(req,res)=>{
    var id = req.params.id;
    if(!ObjectID.isValid(id)){
        return res.status(404).send('Invalid Id ' + id);
    }
    Todo.findById(id).then((todo)=>{
        if(!todo){
            return res.status(404).send();
        }   
        res.send({todo});
    }).catch((e)=>{
        res.status(404).send();
    });
});

app.delete('/todos/:id',(req,res)=>{
    var id = req.params.id;
    if(!ObjectID.isValid(id)){
        return res.status(404).send('Invalid Id ' + id);
    }
    Todo.findByIdAndRemove(id).then((todo) =>{
        if(todo){
            return res.send({todo:todo});
        }
        res.status(404).send('Could not find a todo with id ' + id);
    }).catch((e)=>{
        res.status(404).send('Could not delete ' + id);
    });
})
app.patch('/todos/:id',(req,res) => {
    var id = req.params.id;
    var body = _.pick(req.body,['text','completed']);
    if(!ObjectID.isValid(id)){
        return res.status(404).send('Invalid Id ' + id);
    }
    if(_.isBoolean(body.completed) && body.completed){
        body.completedAt = new Date().getTime();
    }else{
        body.completed = false;
        body.completedAt = null;
    }
    Todo.findByIdAndUpdate(id, {$set: body},{new: true}).then((todo) => {
        if(!todo){
            return res.status(404).send(`Todo with id: ${id} not found`);
        }
        res.send({todo});
    }).catch((err)=>{
        res.status(404).send('Todo patch error');
    });
});

app.listen(port,()=>{
    console.log(`Server started on port ${port}`);
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