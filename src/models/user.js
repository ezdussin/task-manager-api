const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('../models/task')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        require: true
    },
    email: {
        type: String,
        trim: true,
        unique: true,
        lowercase: true,
        required: true,
        validate(v){
            if(!validator.isEmail(v)) throw new Error('Email invalid')
        }
    },
    password: {
        type: String,
        trim: true,
        required: true,
        minlength: 6,
        validate(v){
            if(v.toLowerCase().includes('password')) throw new Error('Common password')
        }
    },
    avatar: {
        type: Buffer
    },
    tokens: [{
        token:{
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true
})

userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'user_id'
})

userSchema.methods.toJSON = function () {
    const userObject = this.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar

    return userObject
}

userSchema.methods.generateAuthToken = async function(){
    const token = jwt.sign({_id: this._id.toString()}, process.env.JWT_SECRET)
    
    this.tokens = this.tokens.concat({token})
    await this.save()
}

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({email})
    
    if(!user) throw new Error('Unable to login')

    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch) throw new Error('Unable to login')

    return user
}

userSchema.pre('save', async function (next){
    if(this.isModified('password')) this.password = await bcrypt.hash(this.password, 8)

    next()
})

userSchema.pre('remove', async function (next){
    await Task.deleteMany({user_id: this._id})

    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User