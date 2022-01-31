const User = require('../models/user')
const bcrypt =  require('bcryptjs')
const jwt = require('jsonwebtoken')
const {secret} = require('../config')


const generateAccessToken = (id) =>{
    const payload = {
        id
    }
    return jwt.sign(payload, secret, {expiresIn:"1h"})
}

class authController{
    async registration(req, res){
        try{
            const {email, username, password} = req.body
            const candidate = await User.findOne({username})
            if( candidate ){
                return res.status(400).json({
                    message: 'User with this name has been already created', 
                    errorType:"USERNAME_ALREADY_CREATED"
                })
            }
            const checkEmail = await User.findOne({email})
            if(checkEmail){
                return res.status(400).json({
                    message: 'User with this email has been already created', 
                    errorType:"EMAIL_ALREADY_CREATED"
                })
            }

            const hashPassword = bcrypt.hashSync(password, 7)
            const user = new User({email, username, password: hashPassword})
            await user.save()
            return res.status(200).json(user)
        }catch(e){
            console.log(e)
            res.status(400).json({message: 'Registration error'})
        }
    }
    
    async login(req, res){
        try{
            const {email, password} = req.body
            const user = await User.findOne({email})
            if(!user){
                return res.status(400).json({message: `User with this email: ${email} dont exit`})
            }
            const validPassword = bcrypt.compareSync(password, user.password)
            if(!validPassword){    
                return res.status(400).json({message: `Wrong password`})
            }
            const token = generateAccessToken(user._id)
            return res.json({
                token: token,
                expiresIn: 3600,
                username: user.username,
                userId: user.id
            })

        }catch(e){
            console.log(e)
            res.status(400).json({message: 'Login error'})
        }
    }
    

}

module.exports = new authController()