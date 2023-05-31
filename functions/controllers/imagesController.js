const imagesSchema = require("../models/imagesSchema");

exports.createImage = (req, res) => {
    const { uuid, image_name, link } = req.body

    imagesSchema.create({ uuid, image_name, link}, (err, image) => {
        if(err){
            res.json(400).json({error: "มีข้อผิดพลาด"})
        }
        res.json(image)
        
    })
}

exports.imageTable = (req, res) => {
    imagesSchema.aggregate([{$lookup:{from:"users_details",localField:"uuid"
    ,foreignField:"uuid",as:"user_detail"}}, {$project:{_id:0,image_name:1,link:1
        ,createdAt:1,user_detail:{HNId:1,prename: 1,name:1,surname:1}}}])
        .exec((err, images) => {
        res.json(images)
    })
}


exports.removeImage = (req, res) => {
    imagesSchema.findOneAndRemove({_id:req.params.id}).exec((err, image) => {
        if(err){
            console.log(err);
        }
        res.json({
            message: "ลบข้อมูลเรียบร้อย"
        })
    })
}