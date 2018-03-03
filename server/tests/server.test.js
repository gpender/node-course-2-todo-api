const expect = require('expect');
const request = require('supertest');

//const {app} = require('./../server');
const app = require('./../server').app;
const Todo = require('./../models/todo').Todo;

const todos = [{text:'todo1'},{text:'todo2'}];

beforeEach((done) =>{
    Todo.remove({}).then(()=> {
        return Todo.insertMany(todos)
    }).then(()=>done());    
});

describe('POST /todos',()=>{
    it('should create a new todo',(done)=>{
        var text = 'Test todo text';
        request(app)
        .post('/todos')
        .send({text:text})
        .expect(200)
        .expect((res)=>{
            expect(res.body.text).toBe(text);
        })
        .end((err,res)=>{
            if(err){
                return done(err);
            }
            Todo.find({text:text}).then((todos)=>{
                expect(todos.length).toBe(1);
                expect(todos[0].text === text);
                done();
            }).catch((e)=>done(e));
        });
    });
    it('should not create a todo if the data is bad',(done)=>{
        var text = '';
        request(app)
        .post('/todos')
        .send({text:text})
        .expect(400)
        .end((err,res) => {
            if(err){
                return done(err);
            }
            Todo.find().then((todos) =>{
                expect(todos.length).toBe(2);
                done();
            }).catch((e)=>done(e));
        });
    });
});

describe('GET /todos',()=>{
    it('should get all todos',(done)=>{
        request(app)
        .get('/todos')
        .expect(200)
        .expect((res)=>{
            expect(res.body.todos.length).toBe(2);
        })
        .end(done);
    });
});