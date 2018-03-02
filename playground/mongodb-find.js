//const MongoClient = require('mongodb').MongoClient;
var {MongoClient,ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,db) =>{
    if(err){
        console.log('Unable to connect to MongoDb server');
    }else{
        console.log('Connected to MongoDb Server');
    }
    // db.collection('Todos').find({_id:new ObjectID('5a99a2bb141c2129b721f6de')}).toArray().then((docs)=>{
    //     console.log('To Dos');
    //     console.log(JSON.stringify(docs,undefined,2));
    // },(err) => {

    // });
    db.collection('Todos').find().toArray().then((docs)=>{
        console.log('To Dos');
        console.log(JSON.stringify(docs,undefined,2));
    },(err) => {

    });
    // db.collection('Todos').count().then((count)=>{
    //     console.log(`Count: ${count}`);
    // },(err) => {

    // });
    
    //db.close();
});