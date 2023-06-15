import {
  getUserByEmailAndPassword,
  insertUser,
  getUserById,
  resetAllUsersAvailability,
} from "../services/user.js";

export default class UserController {
  static async signup(req, res) {
    const user = req.body;

    const { isSuccess, errMessage } = await insertUser(user);

    if (isSuccess) successed();
    else failed(errMessage);

    function successed() {
      res.status(201).send({
        message: "user signup successed",
        isSuccess: true,
      });
    }

    function failed(errMessage = "") {
      res.send({
        message: `user signup failed: ${
          errMessage.includes("duplicate") ? "user already registerd" : errMessage
        }`,
        isSuccess: false,
      });
    }
  }

  static async signin(req, res) {
    const user = req.body;

    const { isSuccess, errMessage, data } = await getUserByEmailAndPassword(
      user.email,
      user.password
    );

    if (isSuccess) successed(data);
    else failed(errMessage);

    function successed(data) {
      res.send({
        message: "user signin successed",
        isSuccess: true,
        data,
      });
    }

    function failed(errMessage = "") {
      res.send({
        message: `user signin failed: ${errMessage}`,
        isSuccess: false,
      });
    }
  }

  static async getOneById(req, res) {
    const { id } = req.query;

    console.log("ID :", id);
    const { isSuccess, errMessage, data } = await getUserById(id);

    if (isSuccess) successed(data);
    else failed(errMessage);

    function successed(data) {
      res.send({
        message: "user search successed",
        isSuccess: true,
        data,
      });
    }

    function failed(errMessage = "") {
      res.send({
        message: `user search failed: ${errMessage}`,
        isSuccess: false,
      });
    }
  }

  static async resetAvailability(req, res) {
    const { isSuccess, errMessage } = await resetAllUsersAvailability();

    if (isSuccess) res.send({ isSuccess: true, message: "OK" });
    else res.send({ isSuccess: false, message: errMessage });
  }
}
