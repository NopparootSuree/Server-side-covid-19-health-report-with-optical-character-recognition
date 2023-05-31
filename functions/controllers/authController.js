const jwt = require('jsonwebtoken')
const { expressjwt: expressJWT } = require('express-jwt');
const authen = require('../models/authenticationSchema')
const bcrypt = require('bcrypt');

exports.login = async (req, res) => {
    //ข้อมูล username , password
    let { username, password} = req.body

    const authenticate = await authen.findOne({username:  username})

    if(authenticate){
        const validPassword = bcrypt.compareSync(password, authenticate.password)
        if(validPassword){
            const token = jwt.sign({username}, process.env.JWT_SECRET,{ expiresIn: '1d' }) //สร้าง Token ให้ User
            return res.status(200).json({token, username})
        }else{
            return res.status(400).json({ error:"รหัสผ่านผิด" })
        }
    } else {
        return res.status(401).json({ error: "ไม่มีผู้ใช้ในระบบ" });
    }
}

exports.createAuthen = async (req, res) => {
    let { username, password } = req.body

    if(!username || username === "") {
        res.json({
            message: "กรุณาใส่ Username"
        })
    }

    if(!password || password === "") {
        res.json({
            message: "กรุณาใส่ Password"
        })
    }

    const salt = await bcrypt.genSalt(10);

    password = await bcrypt.hash(password, salt);

    authen.create({ username, password }, (err, authen) => {
        if(err){
            res.json(400).json({error: "มีข้อผิดพลาด"})
        }
        res.json(authen)
    })
}

exports.requireLogin = expressJWT({
    secret: process.env.JWT_SECRET,
    algorithms: ['HS256'],
    userProperty: 'auth'
})