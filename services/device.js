import { DEVICE_DEFAULT_ID } from "../index.js";
import DeviceModel from "../models/device.js";

export async function getDeviceInformationById(id) {
  const [isSuccess, errMessage, data] = await DeviceModel.findOne({ _id: id })
    .select("-__v")
    .populate("currentUser", "-__v -_id -password")
    .then((device) => {
      if (device) return [true, "", { device }];

      return [false, "something wrong"];
    })
    .catch((err) => [false, err.message]);
  return { isSuccess, errMessage, data };
}

export async function changeDeviceUser(newUserId) {
  const [isSuccess, errMessage] = await DeviceModel.updateOne(
    { _id: DEVICE_DEFAULT_ID },
    { currentUser: newUserId }
  )
    .then(() => {
      return [true, ""];
    })
    .catch((err) => [false, err.message]);

  return { isSuccess, errMessage };
}

export async function removeCurrentUserFromDevice(device) {
  await device.updateOne({ currentUser: null });
}
