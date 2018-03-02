//const MongoClient = require('mongodb').MongoClient;
var {MongoClient,ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,db) =>{
    if(err){
        console.log('Unable to connect to MongoDb server');
    }else{
        console.log('Connected to MongoDb Server');
    }
    // delete many
    db.collection.deleteMany({text:'Something to do'}).then((result)=>{
        console.log(result);
    });
    // delete one
    // find one and delete

    //db.close();
});