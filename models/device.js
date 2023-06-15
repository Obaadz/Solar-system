import mongoose, { Types } from "mongoose";

const deviceSchema = new mongoose.Schema({
  currentUser: { type: Types.ObjectId, default: null },
});

const DeviceModel = mongoose.model("Devices", deviceSchema);

export default DeviceModel;
