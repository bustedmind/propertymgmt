const mongoose = require("mongoose");
const date = require("date-and-time");
const Property = require("../../src/mongoose/models/properties");

//sample data to feed
const shops = [
  {
    _id: new mongoose.Types.ObjectId(),
    shopNo: "1A",
    floorNo: 1,
    leaseAmount: 300000,
    occupied: true,
    tenantName: "tenant one",
    tenantMobile: 1111111111,
    leaseStartDate: "27-09-2023",
    leaseEndDate: "27-09-2024",
  },
  {
    _id: new mongoose.Types.ObjectId(),
    shopNo: "1B",
    floorNo: 1,
    leaseAmount: 400000,
    occupied: true,
    tenantName: "tenant two",
    tenantMobile: 2222222222,
    leaseStartDate: "27-09-2023",
    leaseEndDate: "27-09-2025",
  },
  {
    _id: new mongoose.Types.ObjectId(),
    shopNo: "1C",
    floorNo: 1,
    leaseAmount: 200000
  },
  {
    _id: new mongoose.Types.ObjectId(),
    shopNo: "12A",
    floorNo: 12,
    leaseAmount: 600000
  },
];

const currDatePlusFive = date.format(date.addYears(new Date(), 5), "DD-MM-YYYY");
const currDatePlusThree = date.format(date.addYears(new Date(), 3), "DD-MM-YYYY");

//function to feed the data
const setUpDatabase = async () => {
  await Property.deleteMany();
  for (let i = 0; i < shops.length; i++) await Property(shops[i]).save();
};

//exporting the variables
module.exports = {
  shops,
  setUpDatabase,
  currDatePlusFive,
  currDatePlusThree,
};
