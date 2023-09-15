const express = require('express')
const { createConversation, getConversationByIdAccount, getConversationByIdCvt } = require('../controllers/conversationController')
const router = express.Router()

router.get('/:id', getConversationByIdAccount)
router.get('/create/:idAccount/:idUser', createConversation)
router.get('/cvt/:idCvt/:idAccount', getConversationByIdCvt)

module.exports = router
