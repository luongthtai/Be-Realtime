const express = require('express')
const router = express.Router()
const { login, resgister, logout } = require('../controllers/accountController')

router.post('/login', login)
router.post('/register', resgister)
router.get('/logout/:id', logout)

module.exports = router