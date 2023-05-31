const express = require('express')
const router = express.Router()
const { createVitalSign, getAllVitalSign, getOneVitalSign, removeVitalSign, updateVitalSign, table } = require('../controllers/vital_signController')
const { createUser, getAllUsers, getOneUser, removeUser, updateUser, getNextHN, checkUUIDIsEmpty} = require('../controllers/users_detalController')
const { createImage, imageTable, removeImage } = require('../controllers/imagesController')
const { createAuthen } = require('../controllers/authController')
const { requireLogin } = require('../controllers/authController')

router.post('/create/vitalsign', createVitalSign)
router.get('/vitalsigns', getAllVitalSign)
router.get('/vitalsign/:id',  getOneVitalSign)
router.delete('/vitalsign/:id',  removeVitalSign)
router.put('/vitalsign/:id',  updateVitalSign)
router.get('/table', table)
 
router.post('/create/user', createUser)
router.get('/users',  getAllUsers)
router.get('/user/:id', getOneUser)
router.delete('/user/:id',  removeUser)
router.put('/user/:id', updateUser) 
router.get('/HN', getNextHN)
router.get('/checkUUIDIsEmpty', checkUUIDIsEmpty)

router.post('/createauthen',requireLogin, createAuthen)

router.post('/create/image', createImage)
router.get('/images', imageTable)
router.delete('/image/:id', removeImage)

module.exports = router;