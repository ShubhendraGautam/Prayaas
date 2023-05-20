const express = require("express");
const mysql = require("mysql");
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');

// Multer upload

   
  // Use diskstorage option in multer
var upload = multer({ storage: multer.memoryStorage() });

const app = express();
const PORT= 4000;
dotenv.config({path:'./.env'});

const options = {                
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database: process.env.DB
};

const db = mysql.createConnection(options);
const sessionStore = new MySQLStore({}, db);

app.use(express.static(__dirname+'/assets'));
app.use(express.static(__dirname+'/lib'));
app.use(express.static(__dirname+'/uploads'));
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({
    extended:false
}));
app.use(session({
    
        genid: (req) => {
            return uuidv4() // use UUIDs for session IDs
          },
        secret: 'cookie_secret',
        resave: false,
        saveUninitialized: false,
        store: sessionStore,      // assigning sessionStore to the session
        cookie: {
            maxAge: 60000, // 1 minute
            secure: false,
            httpOnly: true
          },
          rolling: true
    }));


db.connect(function(error){
    if(error)
    {
      console.log(error);
    }else{
        console.log("Database connected!!");
    }
})


    var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
            user: process.env.authemail,			//email ID
            pass: process.env.authepass				//Password 
        }
    });


    function sendMail(email, sub, bodi){
        var details = {
            from: 'sktsdhkhn@gmail.com', // sender address same as above
            to: email, 					// Receiver's email id
            subject: sub, // Subject of the mail.
            html: bodi					// Sending OTP 
        };


	transporter.sendMail(details, function (error, data) {
		if(error)
			console.log(error)
		else
			console.log(data);
		});
	}

    function generatePassword() {
        var length = 12,
            charset = 
    "@#$&*0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ@#$&*0123456789abcdefghijklmnopqrstuvwxyz",
            password = "";
        for (var i = 0, n = charset.length; i < length; ++i) {
            password += charset.charAt(Math.floor(Math.random() * n));
        }
        return password;
    }

    const redirectULogin = function(req,res,next){
        if(!req.session.loggedin)
        {
            return res.redirect('/login');
        }
        next();
    }


    app.get("/",function(req,res){

        db.query('SELECT * from testimonial ',function(err,ress)
                {
                    if(err) {
                        console.log(err);
                    }  
                    else
                    { return res.render('index',{
                        message: ress,
                    });}
                })   
    })
    
    app.get("/about",function(req,res){
        res.sendFile(__dirname+"/views/about.html")
    })

    app.get("/merch",function(req,res){
        res.sendFile(__dirname+"/views/merch.html")
    })

    
    app.get("/contact",function(req,res){
        res.sendFile(__dirname+"/views/contact.html")
    })

    app.get("/successstories",function(req,res){
        res.sendFile(__dirname+"/views/successstories.html")
    })
    

    app.get("/login",function(req,res){  
        res.sendFile(__dirname + "/views/login.html");
    })

    app.get("/fpass",function(req,res){  
        res.sendFile(__dirname + "/views/fpass.html");
    })

    app.get("/cpass",redirectULogin,function(req,res){  
        res.sendFile(__dirname + "/views/cpass.html");
    })

    app.get("/alumni",function(req,res){  
        res.sendFile(__dirname + "/views/alumni.html");
    })

    app.get("/upcomingevent",redirectULogin,function(req,res){  
        res.sendFile(__dirname + "/views/form.html");
    })

    app.get("/event",function(req,res){ 
        db.query('SELECT * from event ',function(err,ress)
        {
            if(err) {
                console.log(err);
            }  
            else
            { 
                db.query('SELECT image from gallery ',function(err,resss)
                {
                    if(err) {
                        console.log(err);
                    }  
                    else
                    { return res.render('event',{
                        message: ress,
                        images:resss
                    });}
                }) 
                
                
               
            }
        }) 


    })

    app.get("/logout",function(req,res){
        req.session.destroy((err) => {
            res.redirect('/');
          })
    })

    app.post("/cpass", async function (req,res){
        const email = req.session.email;
        const { pass, confirmpass} = req.body;
        if (pass != confirmpass){
            return res.render('error',{
                message: 'Passwords does not match',
                code:'cpass'
               });
           }
            let hashpass = await bcrypt.hash(pass,8);
            console.log(hashpass);
            console.log(pass);
            db.query('UPDATE student SET ? WHERE email = ?',[{
                password: hashpass
             },email],function(error,result){
                if(error){
                    console.log(error);
                }
                else{
                    console.log(result);
                    return res.render('success',{
                        message: 'Password Changed successfully',
                        code:'login'
                       });
                }
             })
           
        });

    app.post("/reqdonate",function(req,res){  
        const { name, email, proposal} = req.body;
        db.query('INSERT INTO devent SET ?',{
           name: name,
           email: email,
           proposal:proposal,
        },function(error,result){
            if(error){
                console.log(error);
            }
            else{
                console.log(result); 
                return res.redirect("/");
            }
         })
    })
    
    app.get("/proposals",redirectULogin,function(req,res){ 
        db.query('SELECT * from devent ',function(err,ress)
        {
            if(err) {
                console.log(err);
            }  
            else
            { return res.render('proposals',{
                message: ress,
            });
        }  
        }) 
    })
    


    app.get("/gallery",redirectULogin,function(req,res){
        res.sendFile(__dirname+"/views/uploadGallery.html")
    })
    app.post("/gallery",upload.single("mypic"),async function(req,res){
    
        db.query('INSERT INTO gallery SET ?',{
            image:(req.file.buffer.toString("base64"))
         },function(error,result){
             if(error){
                 console.log(error);
             }
             else{
                 console.log(result); 
                 res.redirect("/");
             }
          })
   
    })

    app.post("/alumni",function(req,res){  
        const { email, profession, name, descr} = req.body;
        
        db.query('INSERT INTO testimonial SET ?',{
           email: email,
           profession: profession,
           name: name,
           testimonial: descr
        },function(error,result){
            if(error){
                console.log(error);
            }
            else{
                console.log(result); 
                return res.redirect("/");
            }
         })
    })

    app.post("/upcomingevent",function(req,res){  
        const { date, time, loc, name, descr} = req.body;
        console.log(req.body);
        db.query('INSERT INTO event SET ?',{
           date: date,
           time: time,
           loc: loc,
           name: name,
           descr: descr
        },function(error,result){
            if(error){
                console.log(error);
            }
            else{
                console.log(result); 
                return res.redirect("/event");
            }
         })
    })


    app.post("/signup",function(req,res){
        const { username, type, email, password, cpassword} = req.body;
        if(email.endsWith("@iiita.ac.in")==false)
        {
            return res.render('error',{
                message: 'Only IIITA domains can register',
                code:'signup'
               });
        }
        db.query('SELECT email from student WHERE email = ?',[email],async function(err,result)
        {
            if(err) {
                console.log(err);
            }
            if(result.length > 0){
               return res.render('error',{
                message: 'User is already registered. Kindly Login',
                code:'login'
               });
            }else if (password != cpassword){
                return res.render('error',{
                    message: 'Passwords does not match',
                    code:'login'
                   });
               }
            let hashpass = await bcrypt.hash(password,8); 
            console.log(hashpass);
            db.query('INSERT INTO student SET ?',{
                username: username,
                email: email,
                type: type,
                password: hashpass,
             },function(error,result){
                if(error){
                    console.log(error);
                }
                else{
                    console.log(result);
                    return res.render('success',{
                        message: 'User registered successfully',
                        code:'login'
                       });
                }
             })
        })
    });

    app.post("/fpass",  function (req,res){
        const  email = req.body.email;
        console.log(email);
        db.query('SELECT * from student WHERE email = ?',[email],async function(err,result)
        {
            if(err) {
                console.log(err);
            }
            if(result.length <= 0){
               return res.render('error',{
                message: 'Wrong email id',
                code:'login'
               });
            }
            let pass = generatePassword();
            console.log(pass);
            let hashpass = await bcrypt.hash(pass,8);
            console.log(hashpass);
            db.query('UPDATE student SET ? WHERE email = ?',[{
                password: hashpass
             },email],function(error,result){
                if(error){
                    console.log(error);
                }
                else{
                    sendMail(email,'Temporary password', pass + ' is your temporary password for Prayaas login');
                    console.log(result);
                    return res.render('success',{
                        message: 'Check your mail for temporary password',
                        code:'login'
                       });
                }
             })
        });
    });

    app.post("/login",function(req,res){
        const { email,type, password } = req.body;
    
        db.query('SELECT password from student WHERE email = ?',[email],async function(err,result)
        {
            if(err) {
                console.log(err);
            }
            if(result.length > 0){
                var savedPass = result[0].password;
                console.log(savedPass);
                if( await bcrypt.compare(password,savedPass))
                {
                 req.session.loggedin = true;
                 req.session.email = email;
                 return res.redirect('/');
                }else{
                    return res.render('error',{
                        message: 'Password doesnt match',
                        code:'login'
                });}
            
            }else {
                return res.render('error',{
                    message: 'Account does not exist. Please SignUp',
                    code:'login'
                   });
               }  
        })
    });
    

    app.listen(PORT,function(){
        console.log("Server started on port "+PORT);
    });