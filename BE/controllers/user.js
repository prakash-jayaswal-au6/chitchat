const mongoose = require('mongoose');
const User = require('../models/user')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Post = require('../models/post')
const nodemailer = require('nodemailer')
const crypto = require('crypto')
const Message = require('../models/message')

const transporter = nodemailer.createTransport({
    host:'smtp.gmail.com',
    port:465,
    secure:true,
    debug:'development',
    auth:{
        user:process.env.GMAIL_EMAIL,
        pass:process.env.PASSWORD
    },
    tls: {
      rejectUnauthorized: false
    }
}) 

const dotenv = require('dotenv');
const { use } = require('../routes/user');
dotenv.config();



exports.register_user = (req,res) => {
    const {name ,email ,password ,pic} = req.body
    if(!name || !email || !password){
     return  res.status(422).json({error:"please Fill all fields"})
    }
    //make sure that user not exist already in database
    User.find({email:email}).exec().then(user => {
        if(user.length >= 1){
            return res.status(409).json({message:"user already exist can't register"});
        } else {
            bcrypt.hash(password,10,(err,hash) => {
                if(err) {
                    return res.status(500).json({error:err});
                } else {
                   //send confirmation mail
                   const token = jwt.sign({user:email},process.env.secretKey,{expiresIn:"5m"})
                    const url = `${process.env.WEB_LINK}/confirmation/${token}`;
                    const mailOption ={
                        from:process.env.GMAIL_EMAIL,
                        to:email,
                        subject:'Verify your email',
                        text:`welcome to ${process.env.WEB_LINK}`,
                        html:  `hi "${email}"You started a Registration process on ChitChat.com,This email is valid for next 5 minute, Please click link to confirm your email: <a href="${url}">ClickMe !</a>`
                                         
                     }
                    
                    let newUser = new User({
                        name:name,
                        email:email,
                        password: hash,
                        pic:pic
                    });
                   
                    newUser.save().then(response => {
                        console.log(response);
                        transporter.sendMail(mailOption,(error,info) => {
                            if(error){
                                console.log(error)
                            }else{
                                res.status(201).json({message:"verification link sent to Your email address",User:response})
                                }
                               })
                        }).catch(err => {
                            console.log(err);
                            res.status(500).json({error:err});
                        });   
                }
            })
        }
    }).catch();   
}

exports.confirmation = (req,res,next) => {
    try {
        const confirmToken = req.params.token
        const { user } = jwt.verify(confirmToken, process.env.secretKey);
        //console.log(user);
        User.findOneAndUpdate({email:user},{isConfirmed:true}, {new: true}, (err, doc) => {
            if (err) {
                console.log("Something wrong when updating data!");
            }
            return res.status(200).json({message:"email verification Successfull now u can access your account "})  
        })
  
      } catch (e) {
        console.log(e.message);
        return res.status(400).json({error:e.message});
      }
      
}

exports.login_user = (req,res,next) => {
    
    const {email ,password } = req.body

    if(!email || !password){
     return  res.status(422).json({error:"please Fill all fields"})
    }
    
    User.find({email:email}).exec().then(user => {
        if(user.length < 1){
            return res.status(401).json({error:"User Doesn't Exist"});
        }
        bcrypt.compare(password, user[0].password,(err,isMatch) => {
            if(err) {
               return res.status(401).json({error:"Authentication Failed"});
            } 
            //check email verified or not
            if(!user[0].isConfirmed){ 
                return res.status(401).json({error:"You need to verify email"});
            }   
            //if password are matched
            if(isMatch){
                const {_id, name, email,pic,following,followers} = user[0]
                const token = jwt.sign({email: user[0].email, userId: user[0]._id},process.env.secretKey,{expiresIn:500000});
                return res.status(200).json({message:"Authentication successful",Token : token,user:{_id,name,email,pic,followers,following} })
            }
            //if the accound is beign verified  
            res.status(401).json({error:"Authentication Failed"});
        })
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error:err});
    });
}

exports.profile = (req,res) => {
    console.log(req.user[0]._id)
    User.findOne({_id:req.user[0]._id})
    .select("-password")
    .then(user => {
        Post.find({ postedBy:req.user[0]._id})
        .populate("postedBy", "_id name")
        .exec((err,posts) => {
            if(err) {
                return res.status(422).json({error:err})
            }
            res.json({ user,posts})
        })
    }).catch(err => {
        return res.status(404).json({error:"User not found"})
    })
}


exports.update_profile_pic = (req,res) => {
    console.log(req)
    User.findByIdAndUpdate(req.user[0]._id,
        {$set:{pic:req.body.pic}},{new: true}, 
        (err, result) => {
            if(err) {
                return res.status(422).json({err:"Image can't update"})
            }
                res.json(result)
    })
}



exports.recomendation = (req,res)=>{
    User.find({_id:{$ne:req.user[0]._id}})
    .populate("User","_id name email pic ")
    .populate("User following ","_id name email ")
    .populate("followers","_id name email pic ")
    .select('-password')
    .sort('-createdAt')
    .then(users =>{        
        res.json({users})
    })
    .catch(err=>{
        console.log(err)
    })
}

//This route is to see the profile of the other user
exports.get_a_user_profile =(req,res) => {
    
    User.findOne({_id:req.params.id})
    .select("-password") //making sure that we dont get the password among al fields
    .then(user=>{
        console.log(user)
        Post.find({postedBy:req.params.id})
        .populate("postedBy","_id name")
        .exec((err,posts)=>{
            if(err){
                return res.status(422).json({error:err})
            }
            res.json({user,posts})
        })
    }).catch(err=>{
        return res.status(404).json({error:"User not Found"})
    })
}


exports.change_password =(req,res)=> {
    const {oldPassword,newPassword,confirmPassword} = req.body
    console.log(oldPassword,newPassword,confirmPassword)
    if(!oldPassword || !newPassword || !confirmPassword){
        return  res.status(422).json({error:"please Fill all fields"})
       }
   // console.log(req.user[0])
    User.findOne({email:req.user[0].email}).exec().then(user => {
        if(user != null){
            console.log(user)
            const hash = user.password;
            bcrypt.compare(oldPassword,hash,(err,isMatch)=>{
                if(isMatch){
                    //means password matched
                    if(newPassword == confirmPassword){
                        bcrypt.hash(newPassword,10,(err,hash)=>{
                            user.password =hash;
                            user.save((err,user)=>{
                                if(err) return console.log(err)
                                console.log(user.name +' !your password has been changed');
                                //return res.status(204).json({message:"password updated succefullly"})
                                return res.status(200).json({message:"password updated succefullly"})
                            })
                        })
                    }
                }
                else {
                    return res.status(401).json({error:"Old Password not mathed"});
                 } 
            })
        }  
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error:err});
    }); 
}

//WhenEver any user follow another user,then we have to update both user ,like first user following and another user followers 

//follow user//step2
exports.follow_user = (req, res) => {
    User.findByIdAndUpdate(req.body.followId, {
        $push: { followers: req.user[0]._id }
    }, {
        new: true
    }, (err, result) => {
        if (err) {
            return res.status(422).json({ error: err })
        }
        //updating the logged In user here
        User.findByIdAndUpdate(req.user[0]._id, {
            $push: { following: req.body.followId }
        }, 
        { new: true }).select("-password").then(result => {
            res.json(result)
        }).catch(err => {
            return res.status(422).json({ error: err })
        })

    })
}


//unfollow user//step3 update in both user data
exports.unfollow_user = (req, res) => {
    User.findByIdAndUpdate(req.body.unfollowId, {
        $pull: { followers: req.user[0]._id }
    }, {
        new: true
    }, (err, result) => {
        if (err) {
            return res.status(422).json({ error: err })
        }
        User.findByIdAndUpdate(req.user[0]._id, {
            $pull: { following: req.body.unfollowId }
        }, 
        { new: true }).select("-password").then(result => {
            res.json(result)
        }).catch(err => {
            return res.status(422).json({ error: err })
        })
    })
}



exports.reset_password =(req,res) => {
    crypto.randomBytes(32,(err,buffer)=>{
        if(err){
            console.log(err)
        }
        const token = buffer.toString("hex")
        User.findOne({email:req.body.email})
        .then(user=>{
            if(!user){
                return res.status(422).json({error:"user dont exist with this email"})
            }
            user.resetToken =token
            //token validity
            user.expireToken = Date.now()+3600000
            user.save().then((result)=>{
                transporter.sendMail({
                    to:user.email,
                    from:"prakashjayaswal62@gmail.com",
                    subject:"password reset",
                    html:`<p>You requested for password reset on ${process.env.WEB_LINK}</p>
                    <h5>Click in this <a href="${process.env.WEB_LINK}/reset/${token}">link</a>to reset password</h5>`
                })
                res.json({message:"Reset Link sent to your email"})
            }).catch(err => console.log(err))
        })
    })
}


exports.new_password = (req,res)=>{
    const newPassword = req.body.password
    const sentToken = req.body.token
    User.findOne({resetToken:sentToken,expireToken:{$gt:Date.now()}})
    .then(user=>{
        if(!user){
            return res.status(422).json({error:"Try again session expired"})
        }
        bcrypt.hash(newPassword,12).then(hashedPassword=>{
            user.password = hashedPassword
            user.resetToken = undefined
            user.expireToken = undefined
            user.save().then((saveduser)=>{
                res.json({message:"passsword updated successfully"})
            })
        }).catch(err=> console.log(err))
    }).catch(err=>{
        console.log(err)
    })
}


exports.search_user =(req,res)=>{
    let userPattern = new RegExp("^"+req.body.query)
    User.find({email:{$regex:userPattern}})
    .select("_id email")
    .then(user=>res.json({user}))
    .catch(err=>{
        console.log(err)
    })
}


exports.chat_user  = async (req,res)=>{   
    try {
        const  userId = req.user[0]._id
        console.log("user",userId)
        var friendId = req.params.id
        const msgs=await Message.find({})
        const m = msgs.filter(el=>{
          if ((el.from == userId && el.to == friendId ) || (el.from == friendId && el.to == userId )) {
              return el
          }
        })
        res.send(m)
      } catch (err) {
        console.log(err);
      }
}