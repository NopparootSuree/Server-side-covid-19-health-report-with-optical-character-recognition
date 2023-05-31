const functions = require("firebase-functions");
const express = require('express')
const morgan = require("morgan")
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config()
const vitalsign = require('./models/vitalSignsSchema')

async function ListenUsingEventEmitter(){
    vitalsign.watch().on('change', async (next) => {
        if(next.operationType === 'insert'){
            const { uuid, body_temperature, upper_blood_pressure,lower_blood_pressure,
            pulse_rate, respiratory, pulse_ox, blood_sugar, createdAt } = next.fullDocument
            
            let userid = `\n${uuid}`
            let bodyTemperature = `\nอุณหภูมิ ${body_temperature}`
            let bloodPressure = `\nความดัน บน ${upper_blood_pressure}/ล่าง ${lower_blood_pressure}`
            let pulseRate = `\nการเต้นชีพจร ${pulse_rate}`
            let breathing = `\nหายใจต่อนาที ${respiratory}`
            let bloodOxygen = `\nออกซิเจนในเลือดผิดปกติ ${pulse_ox}`
            let bloodSugar = `\nปริมาณน้ำตาลในเลือด ${blood_sugar}`
            let createTime = `\n${createdAt.toLocaleString()}`

            message = `${createTime}${userid}${bodyTemperature}${bloodPressure}${pulseRate}${breathing}${bloodOxygen}${bloodSugar}`

            await lineNotify.notify({
                message: message,
            }).then((response) => {
                console.log('send completed!');
            }).catch((err) => {
                 console.log(err);
            })
        }
    })
    
}

ListenUsingEventEmitter()

const adminRoute = require('./routes/adminRoute.js');
const authRoute = require('./routes/authRoute.js');

const app = express()

const notiToken = process.env.NOTYFY_TOKEN

const lineNotify = require('line-notify-nodejs')(`${notiToken}`);

mongoose.connect(process.env.DATABASE, {
    useNewUrlParser:true,
    useUnifiedTopology:false
})
.then(() => {
    console.log('Connect DATABASE Successfully')
})
.catch((err) => {
    console.log(err)
})

app.use(express.json())
app.use(cors())
app.use(morgan('dev'))

app.use('/api', adminRoute)
app.use('/api', authRoute)

exports.app = functions.region('asia-southeast1').https.onRequest(app)

exports.myCallable = functions.region('asia-southeast1').https.onCall(async (data, context) => {
    // รับค่า base64 ที่ได้จาก LIFF app โดย split เพื่อตัด type ที่นำหน้าออก
    const base64 = data.base64.split(",")
    // import และ initial ตัว lib ของ Cloud Vision API
    const vision = require('@google-cloud/vision')
    const client = new vision.ImageAnnotatorClient()

    // ส่งค่า base64 ไปให้ Cloud Vision API และรับค่าได้ที่กลับมา
    const request = { image: { content: base64[1] }}
    const [result] = await client.textDetection(request)
    const detections = result.fullTextAnnotation.text
    const datas = {}
    
    // เอาผลลัพธ์ที่ได้มาตัดบรรทัดและ loop ออกมาทีละบรรทัด
    detections.split('\n').forEach((row) => {
        // ตัดข้อความในบรรทัดเป็นท่อนๆด้วย space
        let items = row.split(' ')
        
        if(row.includes('อุณหภูมิร่างกาย')){
            datas.bt = items[1]
        }

        if(row.includes('ค่าตัวบน')){
            datas.bp_above = items[1]
        }

        if(row.includes('ค่าตัวล่าง')){
            datas.bp_under = items[1]
        }

        if(row.includes('การเต้นชีพจรต่อนาที')){
            datas.pr = items[1]
        }

        if(row.includes('การหายใจต่อนาที')){
            datas.rr = items[1]
        }

        if(row.includes('ออกซิเจนในเลือด')){
            datas.spo2 = items[1]
        }

        if(row.includes('ค่าน้ำตาลในเลือด')){
            datas.bg = items[1]
        }

        if(row.includes('ต้องการพบแพทย์')){
            datas.see_a_doctor = items[1]
        }

        if(row.includes('ปกติ')){
            datas.normal = items[1]
        }

        if(row.includes('โปรดระบุอาการ')){
            datas.abnormal = items[2]
        }

        if(row.includes('เจ็บคอ')){
            datas.sore_throat  = items[1]
        }

        if(row.includes('มีไข้')){
            datas.fever = items[1]
        }
        
        if(row.includes('แน่นหน้าอก')){
            datas.dyspnea = items[1]
        }

        if(row.includes('ไอ')){
            datas.cough = items[1]
        }

    })

    return {
        body_temperature: datas.bt,
        upper_blood_pressure: datas.bp_above,
        lower_blood_pressure: datas.bp_under,
        pulse_rate: datas.pr,
        respiratory: datas.rr,
        pulse_ox: datas.spo2,
        blood_sugar: datas.bg,
        see_a_doctor: datas.see_a_doctor,
        normal: datas.normal,
        abnormal: datas.abnormal,
        sore_throat: datas.sore_throat,
        fever: datas.fever,
        dyspnea: datas.dyspnea,
        cough: datas.cough
    }
})