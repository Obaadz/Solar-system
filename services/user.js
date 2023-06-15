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
  const [isSuccess, errMessage, data] = await UserModel.findById(id)
    .select("-password -__v")
    .then((user) => {
      console.log("getUserById");

      return [true, "", { user }];
    })
    .catch((err) => [false, err.message]);

  return { isSuccess, errMessage, data };
};
