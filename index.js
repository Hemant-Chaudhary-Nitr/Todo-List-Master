const express=require('express');
const path=require('path');
const port=8000;
app=express();

app.set('view engine','ejs');
app.set('views','./views');

const db=require('./config/mongoose');
const task = require('./Models/todo.js');
const user=require('./Models/user.js');

//session cookie
const session =require('express-session');
const passport=require('passport');
const passportLocal= require('./config/passport-local');
const MongoStore=require('connect-mongo');


app.use(express.static(path.join(__dirname,'CSS')));
app.use(express.static(path.join(__dirname,'Javascript')));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());



app.use(session({
    name: 'TODO',
    secret: "hello",
    saveUninitialized: false,
    resave: false,
    cookie:{
        maxAge:(1000*60*100)
    },
    store: MongoStore.create({
        mongoUrl: 'mongodb://localhost/to_do_list_db'
    })
}));

app.use(passport.initialize());
app.use(passport.session());  

app.use(passport.setAuthenticatedUser);

app.get('/',function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/todolist');
    }
    return res.render('signin');
});
app.get('/sign-up',function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/todolist');
    }
    return res.render('signup');
});

app.get('/todolist',passport.checkAuthentication,function(req,res){
    return res.render('todolist');
}); 

app.post('/sign-in',passport.authenticate(
    'local',
    {failureRedirect:'/'}
),function(req,res){
    return res.redirect('/todolist');
});

app.get('/sign-out',function(req,res){
    req.logout();
    return res.redirect('/');
})
app.post('/create-user',function(req,res){
    user.create({
        email : req.body.uemail,
        password: req.body.psw,
        name: req.body.uname,
    },function(err,User){
        if(err){
            console.log('Error in Creating User');
            return res.redirect('back');
        }
        return res.redirect('back');
    })
});

app.post('/api1',function(req,res){
    task.findOneAndDelete({'_id':req.body.use}, function(err) {
        if (err) {
            console.log(err);
        }
    });
    return;
});

app.get('/getapi',function(req,res){
    var ipsumTextArray;
    task.find({'email':req.user.email}, function(err, allIpsumTexts) {
        if (err) {
            console.log(err);
        } else {
           ipsumTextArray=allIpsumTexts;
        }
        res.send(ipsumTextArray);
    });
});

app.post('/toggle',function(req,res){
    task.findByIdAndUpdate(req.body.id, { class: req.body.check},function (err, docs) {
        if (err){
            console.log(err);
        }
    });
    return;
});

app.post('/add-task',function(req,res){
    task.create({
        task : req.body.todoitems,
        email: req.user.email,
        class: "unchecked"
    },function(err,newTask){
        if(err){
            console.log('Error in creating task!!!');
            return;
        }
        return res.redirect('back');
    })
});


app.listen(port,function(err){
    if(err){
        console.log('Error in starting the server');
        return;
    }
    console.log(`Server is running at port: ${port}`);
})