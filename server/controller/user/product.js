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
} = require("../../helper/dbQueries");

exports.getAllProducts = async (req, res) => {
  const products = await getAllProducts();
  const userId = req.user.sub;
  const user = await getUserById(userId);

  res.render("products", { user: user });
};

exports.getProductPage = async (req, res) => {
  const userId = req.user.sub;
  const user = await getUserById(userId);
  const id = req.query.id;
  const product = await getOneProduct(id);
  const reviews = await getAllReviews(id);
  const sumOfRatings = reviews.reduce((acc, curr) => acc + curr.rating, 0);
  const averageRating = sumOfRatings / reviews.length;
  const productsByCategory = await getAllProductByCategory(product.category);

  res.render("productDetails", {
    user: user,
    product: product,
    reviews: reviews,
    averageRating: averageRating,
    similar: productsByCategory,
  });
};

//cart
exports.getCartItems = async (req, res) => {
  const userId = req.user.sub;
  const cartItems = await getCartByUserId(userId);
  let total = 0;

  cartItems.forEach((item) => {
    total += item.price * item.quantity;
  });
  console.log(total);
  if (cartItems !== null) {
    res.json({ items: cartItems, total: total });
  } else {
    res.json({ error: "Something went wrong" });
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
  try {
    const deletedItem = await addItemToCart(userId, itemId);

    console.log("========kdfal======", deletedItem);
    if (deletedItem === undefined) {
      res.status(200).json({ message: "product already added to cart" });
    } else {
      if (deletedItem !== null) {
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
  const userId = req.user.sub;
  const user = await getUserById(userId);

  res.render("cartPage", { user: user });
};

exports.listAllProduct = async (req, res) => {
  try {
    const products = await getAllProducts();
    res.status(200).json({ products: products });
  } catch (error) {
    console.log(error);
  }
};

exports.searchProduct = async (req, res) => {
  try {
    const query = req.query.search;
    const products = await searchProducts(query);
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
    const cartItems = await getCartByUserId(userId);
    res.render("checkoutPage", { user: user, items: cartItems });
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

exports.placeOrder = async (req, res) => {
  try {
    const userId = req.user.sub;
    const user = await getUserById(userId);
    const userName = user.firstName + " " + user.lastName;
    const addressId = req.query.addressId;
    const address = await getAddressById(addressId);
    const items = await getCartByUserId(userId);
    const method = "COD";

    let total_amount = 0;
    items.forEach((item) => {
      total_amount += item.price * item.quantity;
    });

    const newOrder = await createOrder(
      userId,
      userName,
      address,
      items,
      total_amount,
      method
    );
    console.log(newOrder);
    if (newOrder !== null) {
      //remove all items from cart
      const remove = await removeAllItemFromCart(userId);
      console.log("cart is now empty ====", remove);
      res
        .status(200)
        .render("confirmation", { user: user, orderId: newOrder._id });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const userId = req.user.sub;
    const orders = await getOrdersByUserId(userId);
    console.log("order === ", orders);
    if (orders !== null) {
      res.status(200).json({ orders: orders });
    } else {
      res.status(200).json({ message: "no orders found" });
    }
  } catch (error) {
    console.log(error);
  }
};
