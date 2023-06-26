const passport =require('passport');

const localStrategy= require('passport-local').Strategy;
const User=require('../Models/user');

passport.use(new localStrategy({
    usernameField: 'email'
    },
    function(email,password,done){
        User.findOne( {email: email},function(err,user){
            if(err){
                console.log('Error in finding user');
                return done(err);
            }
            if(!user || user.password!=password){
                console.log("Invalid Username password");
                return done(null,false);
            }
            return done(null,user); 
        })
    }
));

passport.serializeUser(function(user,done){
    done(null,user.id);
});

passport.deserializeUser(function(id,done){
    User.findById(id,function(err,user){
        if(err){
            console.log('Error in finding user');
            return done(err);
        }
        return done(null,user);
    });
});
passport.checkAuthentication=function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    return res.redirect('/');
}
passport.setAuthenticatedUser=function(req,res,next){
    if(req.isAuthenticated()){
        res.locals.user=req.user;
    }
    next();
} 
module.exports =passport;  