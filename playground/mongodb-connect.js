//const MongoClient = require('mongodb').MongoClient;
var {MongoClient,ObjectID} = require('mongodb');

var obj= new ObjectID();
console.log(obj);

var user = {name:'fred',age:25};
var {name} = user;
console.log(name);

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,db) =>{
    if(err){
        console.log('Unable to connect to MongoDb server');
    }else{
        console.log('Connected to MongoDb Server');
    }
    // db.collection('Todos').insertOne({
    //     text:'Something to do',
    //     completed:false
    // }, (err,result)=>{
    //     if(err){
    //         return console.log('Unable to insert Todos');
    //     }
    //     console.log(JSON.stringify(result.ops));
    // });
    // db.collection('Users').insertOne({
    //     name:'Guy',
    //     age:51,
    //     location:'Oakwood Drive'
    // }, (err,result)=>{
    //     if(err){
    //         return console.log('Unable to insert into Users');
    //     }
    //     console.log(JSON.stringify(result.ops[0]._id.getTimestamp()));
    // });
    db.close();
});