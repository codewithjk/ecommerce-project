exports.getProductsPage = (req, res) => {
  res.render("products");
};

exports.getAddProduct =(req,res)=>{
  res.render("addProduct");
}