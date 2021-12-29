const OrderItem = require('../models/order-item')
const Order = require('../models/orderModel')

exports.postOrder = async(req, res) =>{
 const orderItemIds = Promise.all(req.body.orderItems.map(async(orderItem)=>{
  let newOrderItem = new OrderItem({
   quantity:orderItem.quantity,
   product:orderItem.product
  })
  newOrderItem = await newOrderItem.save()
  return newOrderItem._id
 }))
 const orderItemsIdsResolved = await orderItemIds

 const totalPrices = await Promise.all(orderItemsIdsResolved.map(async(orderItemId)=>{
  const orderItem = await OrderItem.findById(orderItemId).populate('product','product_price')
  const total = orderItem.quantity * orderItem.product.product_price
  return total
 }))
 
 const finalPrice = totalPrices.reduce((prev, cur) => prev + cur, 0)
 
 let order = new Order({
  orderItems:orderItemsIdsResolved,
  shippingAddress:req.body.shippingAddress,
  shippingAddress2:req.body.shippingAddress2,
  city:req.body.city,
  zip:req.body.zip,
  country:req.body.country,
  phone:req.body.phone,
  status:req.body.status,
  totalPrice: finalPrice,
  user:req.body.user
 })
 order = await order.save()
 if(!order){
  return res.status(400).json({error:'Something Went Wrong'})
 }
 res.send(order)
}

exports.orderList = async(req, res)=> {
 const order = await Order.find().populate('user','name').sort({dateOrdered:-1})
 if(!order){
  return res.status(400).json({error:'Something Went Wrong'})
 }
 res.send(order)

}