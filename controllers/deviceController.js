import { DEVICE_DEFAULT_ID } from "../index.js";
import DeviceModel from "../models/device.js";
import {
  getDeviceInformationById,
  changeDeviceUser,
  removeCurrentUserFromDevice,
} from "../services/device.js";
import {
  enableTimerForUserById,
  getUserById,
  disableAvailabilityForUserById,
} from "../services/user.js";

export default class DeviceController {
  static async getInformation(req, res) {
    const { isSuccess, errMessage, data } = await getDeviceInformationById(
      DEVICE_DEFAULT_ID
    );

    if (isSuccess) res.send({ isSuccess, message: "OK", data });
    else res.send({ isSuccess, message: errMessage });
  }

  static async insertOne(req, res) {
    try {
      await DeviceModel.insertMany({});
    } catch (err) {}

    res.send("OK");
  }

  static async changeCurrentUserOnDevice(req, res) {
    const newCurrentUserId = req.body.id;

    console.log("userId:", newCurrentUserId);

    try {
      const {
        isSuccess: isGetUserByIdSuccess,
        errMessage: errMessageForGetUserById,
        data: { newCurrentUser },
      } = await getUserById(newCurrentUserId);

      if (!isGetUserByIdSuccess) throw new Error(errMessageForGetUserById);

      const {
        isSuccess: isChangeDeviceSuccess,
        errMessage: errMessageForChangeDeviceUser,
      } = await changeDeviceUser(newCurrentUserId);

      if (!isChangeDeviceSuccess) throw new Error(errMessageForChangeDeviceUser);

      const {
        isSuccess: isEnableTimerForDeviceSuccess,
        errMessage: errMessageForEnableTimerForUserById,
      } = await enableTimerForUserById(newCurrentUserId);

      if (!isEnableTimerForDeviceSuccess)
        throw new Error(errMessageForEnableTimerForUserById);

      res.send({ isSuccess: true, message: "OK" });
    } catch (err) {
      res.send({ isSuccess: false, message: err.message || "error" });
    }
  }

  static async closeCharger(req, res) {
    try {
      const {
        isSuccess: isGetDeviceInformationSuccess,
        errMessage: errMessageForGetDeviceInformation,
        data: { device },
      } = await getDeviceInformationById(DEVICE_DEFAULT_ID);

      if (!isGetDeviceInformationSuccess || !device.currentUser)
        throw new Error(errMessageForGetDeviceInformation);

      const userOnDevice = device.currentUser;

      await removeCurrentUserFromDevice(device);

      const {
        isSuccess: isDisableAvailabilitySuccess,
        errMessage: errMessageForDisableAvailability,
      } = await disableAvailabilityForUserById(userOnDevice._id);

      if (!isDisableAvailabilitySuccess)
        throw new Error(errMessageForDisableAvailability);

      res.send({ isSuccess: true, message: "OK" });
    } catch (err) {
      res.send({ isSuccess: false, message: err.message });
    }
  }
}
