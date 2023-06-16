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
  updateTimeRemainingForUserById,
} from "../services/user.js";
import secondsToHoursMinutesSeconds from "../utils/secondsToHoursMinutesSeconds.js";

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
        data: { user: newCurrentUser },
      } = await getUserById(newCurrentUserId);

      if (
        !isGetUserByIdSuccess ||
        !newCurrentUser.isAvailableToCharge ||
        newCurrentUser.chargerEnabledAt
      )
        throw new Error(errMessageForGetUserById || "user not allowed to charge");

      const {
        isSuccess: isGetDeviceInformationSuccess,
        errMessage: errMessageForGetDeviceInformation,
        data: { device },
      } = await getDeviceInformationById(DEVICE_DEFAULT_ID);

      if (!isGetDeviceInformationSuccess || device.currentUser)
        throw new Error(
          errMessageForGetDeviceInformation ||
            "there is another user on the same device at the same time"
        );

      const {
        isSuccess: isChangeDeviceSuccess,
        errMessage: errMessageForChangeDeviceUser,
      } = await changeDeviceUser(newCurrentUserId);

      if (!isChangeDeviceSuccess) throw new Error(errMessageForChangeDeviceUser);

      const {
        isSuccess: isEnableTimerForDeviceSuccess,
        errMessage: errMessageForEnableTimerForUserById,
        data,
      } = await enableTimerForUserById(newCurrentUserId);

      if (!isEnableTimerForDeviceSuccess)
        throw new Error(errMessageForEnableTimerForUserById);

      res.send({ isSuccess: true, message: "OK", data });
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
        throw new Error(errMessageForGetDeviceInformation || "device closed already");

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

  static async updateChargerTimeForUser(req, res) {
    try {
      const {
        isSuccess: isGetDeviceInformationSuccess,
        errMessage: errMessageForGetDeviceInformation,
        data: { device },
      } = await getDeviceInformationById(DEVICE_DEFAULT_ID);

      if (!isGetDeviceInformationSuccess || !device.currentUser)
        throw new Error(
          errMessageForGetDeviceInformation || "there is no current user on device now"
        );

      const {
        isSuccess: isGetUserByIdSuccess,
        errMessage: errMessageForGetUserById,
        data: { user },
      } = await getUserById(device.currentUser);

      if (!isGetUserByIdSuccess)
        throw new Error(errMessageForGetUserById || "user not allowed to charge");

      const noTimeRemainingForUser =
        user.timeRemaining &&
        user.timeRemaining.hours <= 0 &&
        user.timeRemaining.minutes <= 0 &&
        user.timeRemaining.seconds <= 0;

      if (noTimeRemainingForUser) await DeviceController.closeCharger(req, res);
      // TODO: update charger time for user in database...

      const currentTime = Date.now();
      const elapsedTime = currentTime - user.chargerEnabledAt;

      const timeElapsed = secondsToHoursMinutesSeconds(parseInt(elapsedTime));
      const newTimeRemaining = {
        hours: user.timeRemaining.hours - timeElapsed.hours,
        minutes: user.timeRemaining.minutes - timeElapsed.minutes,
        seconds: user.timeRemaining.seconds - timeElapsed.seconds,
      };

      const {
        isSuccess: isUpdateTimeRemainingSuccess,
        errMessage: errMessageForUpdateTimeRemaining,
      } = await updateTimeRemainingForUserById(user._id, newTimeRemaining);

      if (!isUpdateTimeRemainingSuccess)
        throw new Error(errMessageForUpdateTimeRemaining);

      res.send({ isSuccess: true, message: "OK" });
    } catch (err) {
      res.send({ isSuccess: false, message: err.message || "error" });
    }
  }
}
