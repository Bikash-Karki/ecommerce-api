const express = require('express')
const { postOrder, orderList } = require('../controllers/orderController')
const router = express.Router()

router.post('/postorder', postOrder)
router.get('/orderlist', orderList)

module.exports = router