//const MongoClient = require('mongodb').MongoClient;
var {MongoClient,ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,db) =>{
    if(err){
        console.log('Unable to connect to MongoDb server');
    }else{
        console.log('Connected to MongoDb Server');
    }
    // delete many
    // db.collection('Todos').deleteMany({text:'Something to do'}).then((result)=>{
    //     console.log(result);
    // });
    // delete one
    // db.collection('Todos').deleteOne({text:'Walk the dog'}).then((result)=>{
    //     console.log(result);
    // });
    // find one and delete
    // db.collection('Todos').findOneAndDelete({completed:false}).then((result)=>{
    //     console.log(result);
    // });
    db.collection('Users').findOneAndDelete({_id:123}).then((result) => {
        console.log(JSON.stringify(result,undefined,2));
    });
    db.close();
});