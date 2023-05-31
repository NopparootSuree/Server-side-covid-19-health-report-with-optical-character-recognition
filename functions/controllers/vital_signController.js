const vital_sign = require('../models/vitalSignsSchema')

exports.createVitalSign = (req, res) => {
    const { uuid, body_temperature, upper_blood_pressure, 
        lower_blood_pressure, pulse_rate, respiratory,
        pulse_ox, blood_sugar, see_a_doctor, sickness } = req.body

    vital_sign.create({ uuid, body_temperature, upper_blood_pressure, 
        lower_blood_pressure, pulse_rate, respiratory,
        pulse_ox, blood_sugar, see_a_doctor, sickness
    }, (err, vitalSigns) => {
        if(err){
            res.json(400).json({error: "มีข้อผิดพลาด"})
        }
        res.json(vitalSigns)
        
    })
}

exports.getAllVitalSign = (req, res) => {
    vital_sign.find({}).exec((err, vitalSigns) => {
        res.json(vitalSigns)
    })
}

exports.getOneVitalSign = (req, res) => {
    vital_sign.findOne({_id:req.params.id}).exec((err, vitalSign) => {
        res.json(vitalSign)
    })
}

exports.removeVitalSign = (req, res) => {
    vital_sign.findOneAndRemove({_id:req.params.id}).exec((err, vitalSign) => {
        if(err){
            console.log(err);
        }
        res.json({
            message: "ลบข้อมูลเรียบร้อย"
        })
    })
}

exports.updateVitalSign = (req, res) => {
    const { body_temperature, upper_blood_pressure, 
        lower_blood_pressure, pulse_rate, respiratory,
        pulse_ox, blood_sugar, see_a_doctor, sickness 
    } = req.body

    vital_sign.findOneAndUpdate({_id:req.params.id},
        { body_temperature, upper_blood_pressure, 
        lower_blood_pressure, pulse_rate, respiratory,
        pulse_ox ,blood_sugar, see_a_doctor,  sickness 
    }, {new: true}).exec((err, vitalSign) => {
        if (err){
            console.log(err);
        }
        res.json(vitalSign)
    })
}

exports.table = (req, res) => {
    vital_sign.aggregate([{$lookup:{from:"users_details",localField:"uuid",
    foreignField:"uuid",as:"user_detail"}}, 
    {$project:{_id:1,createdAt:1,user_detail:{ HNId:1, prename: 1, name:1,surname:1, gender: 1 },
    body_temperature:1,upper_blood_pressure:1,lower_blood_pressure:1,
    pulse_rate:1,respiratory:1,pulse_ox:1,blood_sugar:1,see_a_doctor:1,
    sickness:1}}]).exec((err, vitalSigns) => {
        res.json(vitalSigns)
    })
}
