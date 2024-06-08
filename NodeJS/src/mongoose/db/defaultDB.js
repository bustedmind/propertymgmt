const mongoose = require("mongoose");
const Property = require("../models/properties");
require("./mongoose");

//sample data to feed
const shops = [
  {
    shopNo: "1A",
    floorNo: 1,
    leaseAmount: 200000,
    occupied: true,
    tenantName: "tenant one",
    tenantMobile: 1111111111,
    leaseStartDate: "27-09-2023",
    leaseEndDate: "27-09-2024",
  },
  {
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
    shopNo: "1C",
    floorNo: 1,
    leaseAmount: 200000,
  },
  {
    shopNo: "12A",
    floorNo: 12,
    leaseAmount: 600000,
  },
];

//function to feed the data
const setUpDatabase = async () => {
  await Property.deleteMany();
  for (let i = 0; i < shops.length; i++) await Property(shops[i]).save();
  await mongoose.disconnect();
};

setUpDatabase();
