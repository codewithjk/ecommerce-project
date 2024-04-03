const {
  getAllProducts,
  getOneProduct,
  getAllReviews,
  getAllProductByCategory,
  getUserById,
  getCartByUserId,
  deleteFromCart,
  addItemToCart,
  updateItemCount,
  searchProducts,
  getAddressById,
  createOrder,
  getOrdersByUserId,
  removeAllItemFromCart,
  getAllCategories,
  getOfferByCategoryId,
  createNewReview,
} = require("../../helper/dbQueries");

exports.getAllProducts = async (req, res) => {
  try {
    const products = await getAllProducts();
    const userId = req.user.sub;
    const user = await getUserById(userId);
    const categories = await getAllCategories();

    res.render("products", { user: user, categories: categories });
  } catch (error) {
    res.render("clientError");
  }
};

exports.getProductPage = async (req, res) => {
  try {
    const userId = req.user.sub;

    const user = await getUserById(userId);
    const id = req.query.id;
    const product = await getOneProduct(id);
    const reviews = await getAllReviews(id);
    const sumOfRatings = reviews.reduce((acc, curr) => acc + curr.rating, 0);
    const averageRating = sumOfRatings / reviews.length;
    const productsByCategory = await getAllProductByCategory(product.category);
    const categoryOffers = await getOfferByCategoryId(product.category);
    console.log(categoryOffers);
    console.log("adskfldaskdflaskfalsddfksalk");

    res.render("productDetails", {
      user: user,
      product: product,
      reviews: reviews,
      averageRating: averageRating,
      similar: productsByCategory,
      categoryOffers: categoryOffers,
    });
  } catch (error) {
    res.render("clientError");
  }
};

//cart items
exports.getCartItems = async (req, res) => {
  try {
    const userId = req.user.sub;
    const cart = await getCartByUserId(userId);
    //get cart  coupon discount

    const cartItems = cart.cartItems;

    const couponDiscount = cart?.couponDiscount?.couponDiscount;

    console.log(couponDiscount);

    let total = 0;

    cartItems.forEach((item) => {
      const itemPrice = Math.round(
        item.PriceAfterCategoryDiscount -
          (item.PriceAfterCategoryDiscount * item.discount) / 100
      );

      total += item.PriceAfterCategoryDiscount * item.quantity;
    });
    console.log(total);
    if (cartItems !== null) {
      res.json({
        items: cartItems,
        total: total,
        couponDiscount: couponDiscount ?? 0,
      });
    } else {
      res.json({ error: "Something went wrong" });
    }
  } catch (error) {
    res.render("clientError");
  }
};

exports.removeCartItem = async (req, res) => {
  const userId = req.user.sub;
  const itemId = req.query.itemId;
  console.log("uer id for cart", userId);
  console.log(itemId);
  try {
    const deletedItem = await deleteFromCart(userId, itemId);
    if (deletedItem != null) {
      res.status(200).json({ message: "successfully removed" });
    } else {
      res.status(501).json({ error: "somthing went wrong try again!" });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.addToCart = async (req, res) => {
  const userId = req.user.sub;
  const itemId = req.query.itemId;
  const size = req.query.size;
  const quantity = req.query.quantity;
  try {
    const newItem = await addItemToCart(userId, itemId, size, quantity);
    if (newItem === undefined) {
      res.status(200).json({ message: "product already added to cart" });
    } else {
      if (newItem !== null) {
        res.status(200).json({ message: "successfully added" });
      } else {
        res.status(501).json({ error: "somthing went wrong try again!" });
      }
    }
  } catch (error) {
    console.log("error code====", error.code);
  }
};

exports.getCartPage = async (req, res) => {
  try {
    const userId = req.user.sub;
    const user = await getUserById(userId);

    res.render("cartPage", { user: user });
  } catch (error) {
    res.render("clientError");
  }
};

exports.listAllProduct = async (req, res) => {
  try {
    const limit = req.query.limit;
    const skip = req.query.skip;
    const products = await getAllProducts(limit, skip);
    res.status(200).json({ products: products });
  } catch (error) {
    console.log(error);
  }
};

exports.searchProduct = async (req, res) => {
  try {
    const query = req.query.search;
    const limit = req.query.limit;
    const skip = req.query.skip;
    const products = await searchProducts(query, limit, skip);
    if (products.length > 0) {
      res.status(200).json({ products: products });
    } else {
      res.status(200).json({ message: `No  result found for '${query}'` });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.updateItemCountInCart = async (req, res) => {
  try {
    const userId = req.user.sub;
    const itemId = req.query.itemId;
    const count = req.query.count;
    const updated = await updateItemCount(userId, itemId, count);
    if (updated !== null) {
      res.status(200).json({ message: "count updated" });
    } else {
      res.status(500).json({ message: "something went wrong! try again" });
    }
  } catch (error) {}
};

exports.getCheckoutPage = async (req, res) => {
  try {
    const userId = req.user.sub;
    const user = await getUserById(userId);
    const cart = await getCartByUserId(userId);
    res.render("checkoutPage", { user: user, items: cart.cartItems });
  } catch (error) {
    console.log(error);
  }
};

exports.getPaymentPage = async (req, res) => {
  try {
    const userId = req.user.sub;
    const user = await getUserById(userId);
    const addressId = req.query.addressId;
    res.render("payment", { addressId: addressId, user: user });
  } catch (error) {
    console.log(error);
  }
};

exports.addReview = async (req, res) => {
  try {
    const userId = req.user.sub;
    console.log(req.query);
    console.log(req.body);
    const productId = req.query.productId;
    const message = req.body.comment;
    const newReview = await createNewReview(productId, userId, message);
    if (newReview !== null) {
      res.redirect(`/product-details?id=${productId}`);
    } else {
      res.redirect(`/product-details?id=${productId}`);
    }
  } catch (error) {
    console.log(error);
  }
};
