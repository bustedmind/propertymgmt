const express = require("express");
const Property = require("../mongoose/models/properties");
const date = require("date-and-time");
const properties = require(`../mongoose/models/properties`);
//setting up the property router
const propertyRouter = express.Router();

propertyRouter.post("/property", async (req, res, next) => {
  let property = await properties.findOne({ shopNo: req.body.shopNo });
  if (property !== null) {
    res.status(400).send({
      "type": "Bad Request",
      message: `Duplicate shop number ${req.body.shopNo}`
    });
  } else {
    try {
      if (req.body.shopNo !== undefined) {
        let floorNo = req.body.shopNo.substring(0, req.body.shopNo.length - 1);
        floorNo = Number(floorNo);
        data = {
          shopNo: req.body.shopNo,
          floorNo: floorNo,
          leaseAmount: req.body.leaseAmount,
        };
        let property = new properties(data);
        await property.save();
        res.status(201).json({
          type: "Created",
          message: "Created the shop successfully",
        });
      }
    } catch (error) {
      res.status(400).send({
        "type": "Bad Request",
        message: error
      });
    }
  }

});


propertyRouter.get("/property", async (req, res) => {
  let data = await properties.find();
  //   console.log(data);
  if (req.query.tenantName !== undefined) {
    data = data.filter((d) =>
      d.tenantName.toUpperCase().includes(req.query.tenantName.toUpperCase())
    );
  }
  if (req.query.occupied === true || req.query.occupied === "true") {
    data = data.filter((d) => d.occupied === true);
  }
  if (req.query.occupied === false || req.query.occupied === "false") {
    data = data.filter((d) => d.occupied === false);
  }
  if (req.query.leaseAmount !== undefined && req.query.leaseAmount === "asc") {
    data = data.sort((a, b) => a.leaseAmount - b.leaseAmount);
  }
  if (req.query.leaseAmount !== undefined && req.query.leaseAmount === "desc") {
    data = data.sort((a, b) => b.leaseAmount - a.leaseAmount);
  }
  try {
    res.status(200).json({
      type: "Ok",
      shops: data,
    });
  } catch (e) {
    res.status(400);
  }
});


propertyRouter.patch('/property/:id', async (req, res) => {
  let data = await properties.findOne({ _id: req.params.id });
  try {
    if (!data) {
      throw new Error();
    }
    else {
      if (data.occupied === true || data.occupied === "true") {
        res.status(403).json({
          type: "Forbidden",
          message:
            "Property already occupied, please choose another one",
        });
      }
      else {
        let body = req.body;
        let leaseAmount = data.leaseAmount * Number(body.leaseDuration);
        const today = new Date();
        const yyyy = today.getFullYear();
        let mm = today.getMonth() + 1; // Months start at 0!
        let dd = today.getDate();
        if (dd < 10) dd = "0" + dd;
        if (mm < 10) mm = "0" + mm;
        const leaseStartDate = dd + "-" + mm + "-" + yyyy;
        const leaseEndDate = dd + "-" + mm + "-" + String(Number(yyyy) + Number(body.leaseDuration));
        const occupied = true;
        body = { ...body, leaseStartDate, leaseEndDate, leaseAmount, occupied };
        // let property = new properties(body);
        // await property.save();
        //await properties.insertOne(body)
        await properties.findOneAndUpdate({ _id: req.params.id }, body);
        res.status(200).json({
          type: "Ok",
          message: "Lease successfully approved",
        });
      }
    }
  }
  catch (e) {
    res.status(400).json({ type: "Bad Request" })
  }
})

module.exports = propertyRouter;




















// const express = require("express");
// const Property = require("../mongoose/models/properties");
// const date = require("date-and-time");

// //setting up the property router
// const propertyRouter = express.Router();
// propertyRouter.get("/property", async (req, res) => {
//     let data = await Property.find();
//     if (req.query.tenantName !== undefined)
//         data = data.filter(d => d.tenantName.toLowerCase().includes(req.query.tenantName.toLowerCase()));
//     if (req.query.occupied !== undefined)
//         data = data.filter(d => d.occupied === req.query.occupied);
//     if (req.query.leaseAmount  !== undefined && req.query.leaseAmount  === "desc")
//         data = data.sort((a, b) => a.leaseAmount  < b.leaseAmount  ? 1 : a.leaseAmount  > b.leaseAmount  ? -1 : 0);
//     if (req.query.leaseAmount  !== undefined && req.query.leaseAmount  === "asc")
//         data = data.sort((a, b) => a.leaseAmount  > b.leaseAmount  ? 1 : a.leaseAmount  < b.leaseAmount  ? -1 : 0);
//     try {
//         res.status(200).send({
//             "type": "Ok",
//             shops: data,
//         });
//     } catch (error) {
//         res.status(400).send(error);
//     }
// });

// propertyRouter.post("/property", async (req, res) => {
//     let property = await Property.findOne({ roll_number: req.body.roll_number });
//     let total = Number(req.body.subject1) + Number(req.body.subject2) + Number(req.body.subject3);
//     if (student !== null) {
//         res.status(403).send({
//             "type": "Forbidden",
//             "message": "Student already exists"
//         });
//     } else if (student === null && total !== req.body.marks_obtained_for_300) {
//         res.status(400).send({
//             "type": "Bad Request",
//             "message": "The total marks calculated is invalid"
//         });
//     } else if (req.body.subject1 === "" || req.body.subject2 === "" || req.body.subject3 === "") {
//         res.status(400).send({
//             "type": "Bad Request",
//             "message": "Invalid form values"
//         });
//     } else {
//         try {
//             property = new Property(req.body);
//             await property.save();
//             res.status(201).send({
//                 "type": "Created", 
//                 "message": "Created the shop successfully"
//             });
//         } catch (error) {
//             res.status(400).send({
//                 "type": "Bad Request",
//                 message: error
//             });
//         }
//     }
// });


// module.exports = propertyRouter;
