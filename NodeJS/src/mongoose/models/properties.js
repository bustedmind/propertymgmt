const mongoose = require("mongoose");

//schema for the collection
const propertySchema = mongoose.Schema({
  shopNo: {
    type: String,
    required: true,
    unique: true,
    match: /^(?:100|[1-9]\d?|[1-9])?[A-Z]$/,
  },
  floorNo: {
    type: Number,
    min: 1,
    max: 100,
  },
  leaseAmount: {
    type: Number,
    required: true,
    min: 200000,
    max: 5000000,
  },
  occupied: {
    type: Boolean,
    default: false,
  },
  tenantName: {
    type: String,
    default: "",
  },
  tenantMobile: {
    type: Number,
    default: null,
  },
  leaseStartDate: {
    type: String,
    default: "",
  },
  leaseEndDate: {
    type: String,
    default: "",
  },
});

const Property = mongoose.model("Property", propertySchema);

module.exports = Property;
