const {
  getUserById,
  getAddressByUid,
  updateAddress,
  addAddress,
  updateProfile,
  deleteAddressById,
} = require("../../helper/dbQueries");

exports.getAccountPage = async (req, res) => {
  const userId = req.user.sub;
  const user = await getUserById(userId);
  res.render("account", { user: user });
};

exports.getAddressOfUser = async (req, res) => {
  const userId = req.user.sub;
  console.log(userId);

  const addresses = await getAddressByUid(userId);

  res.json({ addresses: addresses });
};

exports.editAddress = async (req, res) => {
  try {
    const id = req.body.id;
    console.log(req.body);
    const data = {
      fullName: req.body.fullName,
      addressLine1: req.body.addressLine1,
      city: req.body.city,
      state: req.body.state,
      postalCode: req.body.postalCode,
      phoneNumber: req.body.phoneNumber,
    };

    const updatedAddress = await updateAddress(id, data);
    if (updatedAddress !== null) {
      res.json({ message: "address updated !" });
    }
  } catch (error) {
    console.log();
  }
};

exports.addAddress = async (req, res) => {
  try {
    const userId = req.user.sub;
    console.log(req.body);
    const data = {
      userId: userId,
      fullName: req.body.fullName,
      addressLine1: req.body.addressLine1,
      city: req.body.city,
      state: req.body.state,
      postalCode: req.body.postalCode,
      phoneNumber: req.body.phoneNumber,
    };

    const newaddress = await addAddress(data);
    if (newaddress != null) {
      res.json({ message: "new address added!" });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.editProfile = async (req, res) => {
  try {
    const userId = req.user.sub;
    console.log("edited data ===", req.body);
    const editedProfile = await updateProfile(userId, req.body);
    if (editedProfile !== null) {
      res.json({ message: "profile successfully updated" });
    }
  } catch (error) {
    console.error(error);
  }
};

exports.removeAddress = async (req, res) => {
  try {
    const addressId = req.query.addressId;

    const deletedAddress = await deleteAddressById(addressId);

    if (deletedAddress !== null) {
      res.status(200).json({ message: "address successfully deleted" });
    }
  } catch (error) {
    console.log(error);
  }
};
