const express = require('express')
const { postOrder, orderList, orderDetails, deleteOrder, userOrders } = require('../controllers/orderController')
const router = express.Router()

router.post('/postorder', postOrder)
router.get('/orderlist', orderList)
router.get('/orderdetails/:id', orderDetails)
router.delete('/deleteorder/:id', deleteOrder)
router.get('/userorderlist/:userid', userOrders)

module.exports = router