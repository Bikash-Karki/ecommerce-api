const Category =require('../models/catergoryModel')



//to post category
exports.postCategory=async(req,res)=>{
 let category = new Category({
  category_name:req.body.category_name
 })
 category = await category.save()
 if(!category){
  return res.status(400).json({error:'Something Went Wrong'})
 }
 res.send(category)
}
//to show all categories
exports.categoryList=async(req,res)=>{
 const category = await Category.find()
 if(!category){
  return res.status(400).json({error:'Something Went Wrong'})
 }
 res.send(category)
}
//to show single categoty
exports.categoryDetails=async(req,res)=>{
 const category = await Category.findById(req.params.id)
 if(!category){
  return res.status(400).json({error:'Something Went Wrong'})
 }
 res.send(category)
}
//to update category
exports.updateCategory = async(req,res)=>{
 const category= await Category.findByIdAndUpdate(
  req.params.id,
  {
   category_name:req.body.category_name
  },
  {new:true}
 )
 if(!category){
  return res.status(400).json({error:'Something Went Wrong'})
 }
 res.send(category)
}
//to delete category
exports.deleteCategory=(req,res)=>{
 Category.findByIdAndRemove(req.params.id).then(category=>{
  if(!category){
   return res.status(400).json({error:'Category Not Found'})
  }
  else{
   return res.status(200).json({message:'Category Deleted'})
  }
 })
 .catch(err=>{
  return res.status(400).json({error:err})
 })
}