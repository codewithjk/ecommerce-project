const {
  getAllProducts,
  getOneProduct,
  getAllReviews,
  getAllProductByCategory,
} = require("../../helper/dbQueries");

exports.getAllProducts = async (req, res) => {
  const products = await getAllProducts();
  res.render("products", { products: products });
};

exports.getProductPage = async (req, res) => {
  const id = req.query.id;
  const product = await getOneProduct(id);
  const reviews = await getAllReviews(id);
  const sumOfRatings = reviews.reduce((acc, curr) => acc + curr.rating, 0);
  const averageRating = sumOfRatings / reviews.length;
  const productsByCategory = await getAllProductByCategory(product.category);

  res.render("productDetails", {
    product: product,
    reviews: reviews,
    averageRating: averageRating,
    similar: productsByCategory,
  });
};
