const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

//const {app} = require('./../server');
const app = require('./../server').app;
const Todo = require('./../models/todo').Todo;
const {User} = require('./../models/user');

const {todos,populateTodos,users,populateUsers} = require('./seed/seed');
beforeEach(populateTodos);
beforeEach(populateUsers);

describe('POST /todos',()=>{
    it('should create a new todo',(done)=>{
        var text = 'Test todo text';
        request(app)
        .post('/todos')
        .set('x-auth',users[0].tokens[0].token)
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
        .set('x-auth',users[0].tokens[0].token)
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
        .set('x-auth',users[0].tokens[0].token)
        .expect(200)
        .expect((res)=>{
            expect(res.body.todos.length).toBe(1);
        })
        .end(done);
    });
});


describe('GET /todos/:id',()=>{
    it('should return todo doc',(done)=>{
        request(app)
        .get(`/todos/${todos[0]._id.toHexString()}`)
        .set('x-auth',users[0].tokens[0].token)
        .expect(200)
        .expect((res)=>{
            expect(res.body.todo.text).toBe(todos[0].text);
        })
        .end(done);
    });
    it('should NOT return todo doc created by another user',(done)=>{
        request(app)
        .get(`/todos/${todos[0]._id.toHexString()}`)
        .set('x-auth',users[1].tokens[0].token)
        .expect(404)
        .expect((res)=>{
            expect(res.body.todo).toBeFalsy();//.toBe(todos[0].text);
        })
        .end(done);
    });
    it('should return a 404 if todo not found',(done)=>{
        var duffId = new ObjectID().toHexString();
        request(app)
        .get(`/todos/${duffId}`)
        .set('x-auth',users[0].tokens[0].token)
        .expect(404)
        .end(done);
    });
    it('should return a 404 for non object Ids',(done)=>{
        var duffId = 1238;
        request(app)
        .get(`/todos/${duffId}`)
        .set('x-auth',users[0].tokens[0].token)
        .expect(404)
        .end(done);
    });
});

describe('DELETE /todos/:id',()=>{
    it(('should remove a todo'),(done)=>{
        var hexId = todos[1]._id.toHexString();
        request(app)
        .delete(`/todos/${hexId}`)
        .set('x-auth',users[1].tokens[0].token)
        .expect(200)
        .expect((res)=>{
            expect(res.body.todo._id).toBe(hexId);
        })
        .end((err,res)=>{
            if(err){
                return done(err);
            }
            Todo.findById(hexId).then((todo)=>{
                expect(todo).toBeFalsy();
                done();
            })
            .catch((e) => done(e));
        });
    });
    it(('should NOT remove a todo which does not belong to the user'),(done)=>{
        var hexId = todos[1]._id.toHexString();
        request(app)
        .delete(`/todos/${hexId}`)
        .set('x-auth',users[0].tokens[0].token)
        .expect(404)
        .end((err,res)=>{
            if(err){
                return done(err);
            }
            Todo.findById(hexId).then((todo)=>{
                expect(todo).toBeTruthy();
                done();
            })
            .catch((e) => done(e));
        });
    });
    it('should return a 404 if the id does not exist',(done=>{
        var hexId = new ObjectID().toHexString();
        request(app)
        .delete(`/todos/${hexId}`)
        .set('x-auth',users[0].tokens[0].token)
        .expect(404)
        .end(done);
    }));
    it('should return a 404 if the id is invalid',(done)=>{
        var hexId = '123';
        request(app)
        .delete(`/todos/${hexId}`)
        .set('x-auth',users[0].tokens[0].token)
        .expect(404)
        .end(done);
    });
});

describe('PATCH /todos/:id tests',()=>{
    
    it('should update the todo and set the completed property to true', (done)=>{
        var hexId = todos[0]._id.toHexString();
        var text = 'Todo Text 0 changed';
        var completed = true;
        request(app)
        .patch(`/todos/${hexId}`)
        .set('x-auth',users[0].tokens[0].token)
        .send({
                text:text,
                completed:true})
        .expect(200)
        .expect((res)=>{
            var updatedTodo = res.body.todo;
            expect(updatedTodo.text).toBe(text);
            expect(updatedTodo.completed).toBe(true);
            //expect(updatedTodo.completedAt).toBeA('number');
            expect(typeof(updatedTodo.completedAt)).toBe('number');
        })
        .end(done);
    });
    it('should NOT update a todo which does not belong to the user', (done)=>{
        var hexId = todos[0]._id.toHexString();
        var text = 'Todo Text 0 changed';
        var completed = true;
        request(app)
        .patch(`/todos/${hexId}`)
        .set('x-auth',users[1].tokens[0].token)
        .send({
                text:text,
                completed:true})
        .expect(404)
        .end(done);
    });

    it('should clear completedAt when completed is set to false',(done)=>{
        var hexId = todos[1]._id.toHexString();
        request(app)
        .patch(`/todos/${hexId}`)
        .set('x-auth',users[1].tokens[0].token)
        .send({
            completed:false
        })
        .expect(200)
        .expect((res)=>{
            var updatedTodo = res.body.todo;
            expect(updatedTodo.completedAt).toBeFalsy();
        })
        .end(done);
    });
})

describe('GET /users/me',() => {
    it('should return user if authenticated',(done)=>{
        request(app)
        .get('/users/me')
        .set('x-auth',users[0].tokens[0].token)
        .expect(200)
        .expect((res) =>{
            expect(res.body._id).toBe(users[0]._id.toHexString());
            expect(res.body.email).toBe(users[0].email);
        })
        .end(done);
    });
    it('should return a 401 if not authenticated',(done) => {
        request(app)
        .get('/users/me')
        .expect(401)
        .expect((res)=>{
            expect(res.body).toEqual({});
        })
        .end(done);
    });
});

describe('POST /users',()=>{
    it('should create a USER',(done)=>{
        var email = 'brett.pender@me.com';
        var password = '1234567bgh';
        
        request(app)
        .post('/users')
        .send({email,password})
        .expect(200)
        .expect((res)=>{
            expect(res.headers['x-auth']).toBeTruthy();
            expect(res.body._id).toBeTruthy();
            expect(res.body.email).toEqual(email);            
        })
        .end((err)=>{
            if(err){
                return done(err);
            }
            User.findOne({email}).then((user) =>{
                expect(user).toBeTruthy();
                expect(user.password).not.toBe(password);
                done();
            }).catch((err)=>{
                done(err);
            });;
        });
    });

    it('should return validation errors if request is invalid',(done)=>{
        var email = 'error.com';
        var password = '123';
        request(app)
        .post('/users')
        .send({email,password})
        .expect(400)
        .end(done);
    });

    it('should not create a user if the email is in use',(done)=>{
        var email = users[0].email;//'user.Two@me.com';
        var password = '1234567bgh';
        
        request(app)
        .post('/users')
        .send({email,password})
        .expect(400)
        .expect((res)=>{
            expect(res.status).toBe(400);
            expect(res.headers['x-auth']).toBeFalsy();
            expect(res.body._id).toBeFalsy();
            expect(res.body.email).toBeFalsy();            
        })
        .end(done);
    });
});

describe('POST /user/login',()=>{
    it('should login users and return auth token in the header',(done)=>{

        var email = users[1].email;
        var password = users[1].password;

        request(app)
        .post('/users/login')
        .send({email,password})
        .expect(200)
        .expect((res)=>{
            expect(res.headers['x-auth']).toBeTruthy();
        })
        .end((err,res)=>{
            if(err){
                return done(err);
            }
            User.findById(users[1]._id).then((user)=>{
                expect(user.toObject().tokens[1]).toMatchObject({
                    access:'auth',
                    token:res.headers['x-auth']
                });
                done()
            }).catch((err)=>{
                done(err);
            });
        });
    });

    it('should reject an invalid login and return a 401 authentication failed',(done)=>{
        var email = users[1].email;
        var password = users[1].password +'l';

        request(app)
        .post('/users/login')
        .send({email,password})
        .expect(400)       
        .expect((res)=>{
            expect(res.headers['x-auth']).toBeFalsy();
        })
        .end((err,res)=>{
            if(err){
                return done(err);
            }
            User.findById(users[1]._id).then((user)=>{
                expect(user.tokens.length).toBe(1);
                done();
            }).catch((err)=>{
                done(err);
            });
        });
    });
});
describe('DELETE /users/me/token', ()=>{
    it('should remove auth token on logout',(done) => {
        var token = users[0].tokens[0].token;

        request(app)
        .delete('/users/me/token')
        .set('x-auth',token)
        .send()
        .expect(200)
        .end((err)=>{
            if(err){
                done(err);
            }
            User.findById(users[0]._id).then((user)=>{
                expect(user.tokens.length).toBe(0);
                done();
            }).catch((err)=>{
                done(err);
            });
        });

    });
});
