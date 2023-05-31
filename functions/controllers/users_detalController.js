const Users_detail = require('../models/usersSchema')


exports.getNextHN = (req, res) => {
    Users_detail.find({}).count().exec((err, counter) => {
        res.json(counter)
    })
}

exports.checkUUIDIsEmpty = (req, res) => {
    Users_detail.aggregate([{$project:{_id:0,uuid:1}}]).exec((err, uuid) => {
        res.json(uuid)
    })
}

exports.createUser = (req, res) => {
    const { HNId,uuid, prename, name, surname, birthdate, id_card, email, address, subdistrict,
        district, province, zip_code, phone_number
    } = req.body

    if (prename === 'นาง') {
        gender = 'หญิง'
    }

    if (prename === 'นางสาว') {
        gender = 'หญิง'
    }

    if (prename === 'เด็กหญิง') {
        gender = 'หญิง'
    }

    if (prename === 'นาย') {
        gender = 'ชาย'
    }

    if (prename === 'เด็กชาย') {
        gender = 'ชาย'
    }

    Users_detail.create({ HNId,uuid, prename, name, surname, gender, birthdate, id_card, email, address, subdistrict,
        district, province, zip_code, phone_number
    }, (err, user) => {
        if(err){
            res.json(400).json({error: "มีข้อผิดพลาด"})
        }
        res.json(user)
        
    })
}

exports.getAllUsers = (req, res) => {
    Users_detail.find({}).exec((err, users) => {
        res.json(users)
    })
}

exports.getOneUser = (req, res) => {
    Users_detail.find({uuid:req.params.id}).exec((err, user) => {
        res.json(user)
    })
}

exports.removeUser = (req, res) => {
    Users_detail.findOneAndRemove({_id:req.params.id}).exec((err, vitalSign) => {
        if(err){
            console.log(err);
        }
        res.json({
            message: "ลบข้อมูลเรียบร้อย"
        })
    })
}

exports.updateUser = (req, res) => {

    const { uuid, prename, name, surname, birthdate, 
        id_card, email, address, subdistrict,
        district, province, zip_code, phone_number
    } = req.body

    if (prename === 'นาง') {
        gender = 'หญิง'
    }

    if (prename === 'นางสาว') {
        gender = 'หญิง'
    }

    if (prename === 'เด็กหญิง') {
        gender = 'หญิง'
    }

    if (prename === 'นาย') {
        gender = 'ชาย'
    }

    if (prename === 'เด็กชาย') {
        gender = 'ชาย'
    }


    Users_detail.findOneAndUpdate({_id:req.params.id}, 
        { uuid, prename, name, surname, gender: gender, birthdate,  
        id_card, email, address, subdistrict,
        district, province, zip_code, phone_number
    }, {new: true}).exec((err, user) => {
        if (err){
            console.log(err);
        }
        res.json(user)
    })
}

