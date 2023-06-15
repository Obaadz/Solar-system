import UserModel from "../models/user.js";

export const insertUser = async (userData) => {
  const User = new UserModel({
    fullName: userData.fullName,
    email: userData.email,
    password: userData.password,
    gender: userData.gender,
    phoneNumber: userData.phoneNumber,
  });

  const [isSuccess, errMessage] = await User.save()
    .then(() => [true, ""])
    .catch((err) => [false, err.message]);

  return { isSuccess, errMessage };
};

export const getUserByEmailAndPassword = async (email, password) => {
  const [isSuccess, errMessage, data] = await UserModel.findOne({ email, password })
    .select("-password -__v")
    .then((user) => {
      if (user) return [true, "", { user }];

      return [false, "email or password is incorrect"];
    })
    .catch((err) => [false, err.message]);

  return { isSuccess, errMessage, data };
};

export const getUserById = async (id) => {
  console.log("id in getUserById:", id);
  const [isSuccess, errMessage, data] = await UserModel.findOne({ _id: id })
    .select("-password -__v")
    .then((user) => {
      if (user) return [true, "", { user }];
      else return [false, "user not found"];
    })
    .catch((err) => [false, err.message]);

  return { isSuccess, errMessage, data };
};

export async function enableTimerForUserById(id) {
  const [isSuccess, errMessage, data] = await UserModel.findByIdAndUpdate(
    { _id: id },
    { chargerEnabledAt: Date.now() },
    { new: true }
  )
    .select("-_id chargerEnabledAt")
    .then((user) => {
      return [true, "", { user }];
    })
    .catch((err) => [false, err.message]);

  return { isSuccess, errMessage, data };
}

export async function resetAllUsersAvailability() {
  try {
    const users = await UserModel.find({});

    users.map(async (user) => {
      await user.updateOne({ isAvailableToCharge: true, chargerEnabledAt: null });
    });

    return { isSuccess: true };
  } catch (err) {
    return { isSuccess: false, message: err.message };
  }
}

export async function disableAvailabilityForUserById(id) {
  const [isSuccess, errMessage] = await UserModel.updateOne(
    { _id: id },
    { isAvailableToCharge: false, chargerEnabledAt: null }
  )
    .then(() => [true, ""])
    .catch((err) => [false, err.message]);

  return { isSuccess, errMessage };
}
