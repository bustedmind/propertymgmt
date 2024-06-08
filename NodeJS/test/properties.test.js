const request = require("supertest");
const Property = require("../src/mongoose/models/properties");
const app = require("../src/app");
const {
  setUpDatabase,
  shops,
  currDatePlusFive,
  currDatePlusThree,
} = require("./uitls/testDB");

//resetting the database before each testcase
beforeEach(setUpDatabase);

//adding a new property
test("Adding a new property with valid data", async () => {
  const response = await request(app)
    .post("/property")
    .send({
      shopNo: "12C",
      leaseAmount: 600000,
    })
    .expect(201);
  const properties = await Property.find();
  expect(properties.length).toBe(5);
  expect(properties[4].shopNo).toBe("12C");
  expect(properties[4].floorNo).toBe(12);
  expect(response.body.message).toBe("Created the shop successfully");
  expect(response.body.type).toBe("Created");
});

//adding a new property
test("Adding a new property with valid data", async () => {
  const response = await request(app)
    .post("/property")
    .send({
      shopNo: "100D",
      leaseAmount: 600000,
    })
    .expect(201);
  const properties = await Property.find();
  expect(properties.length).toBe(5);
  expect(properties[4].shopNo).toBe("100D");
  expect(properties[4].floorNo).toBe(100);
  expect(response.body.message).toBe("Created the shop successfully");
  expect(response.body.type).toBe("Created");
});

//adding a new property
test("Adding a new property with invalid shop number", async () => {
  const response = await request(app)
    .post("/property")
    .send({
      shopNo: "112A",
      leaseAmount: 600000,
    })
    .expect(400);
  const properties = await Property.find();
  expect(properties.length).toBe(4);
  expect(response.body.type).toBe("Bad Request");
});

//adding a new property
test("Adding a new property with invalid lease amount", async () => {
  const response = await request(app)
    .post("/property")
    .send({
      shopNo: "12F",
      leaseAmount: 60000,
    })
    .expect(400);
  const properties = await Property.find();
  expect(properties.length).toBe(4);
  expect(response.body.type).toBe("Bad Request");
});

//adding a new property
test("Adding a new property with invalid lease amount", async () => {
  const response = await request(app)
    .post("/property")
    .send({
      shopNo: "12F",
      leaseAmount: 5100000,
    })
    .expect(400);
  const properties = await Property.find();
  expect(properties.length).toBe(4);
  expect(response.body.type).toBe("Bad Request");
});

//viewing the properties
test("Viewing all the properties without filters", async () => {
  const response = await request(app).get("/property").expect(200);
  expect(response.body.shops.length).toBe(4);
  expect(response.body.shops[0].shopNo).toBe(shops[0].shopNo);
  expect(response.body.shops[1].shopNo).toBe(shops[1].shopNo);
  expect(response.body.shops[2].shopNo).toBe(shops[2].shopNo);
  expect(response.body.shops[3].shopNo).toBe(shops[3].shopNo);
  expect(response.body.type).toBe("Ok");
});

//viewing the properties
test("Viewing all the properties sorted by lease amount ascending", async () => {
  const response = await request(app)
    .get("/property?leaseAmount=asc")
    .expect(200);
  expect(response.body.shops.length).toBe(4);
  expect(response.body.shops[0].shopNo).toBe(shops[2].shopNo);
  expect(response.body.shops[1].shopNo).toBe(shops[0].shopNo);
  expect(response.body.shops[2].shopNo).toBe(shops[1].shopNo);
  expect(response.body.shops[3].shopNo).toBe(shops[3].shopNo);
  expect(response.body.type).toBe("Ok");
});

//viewing the properties
test("Viewing all the properties sorted by lease amount descending", async () => {
  const response = await request(app)
    .get("/property?leaseAmount=desc")
    .expect(200);
  expect(response.body.shops.length).toBe(4);
  expect(response.body.shops[0].shopNo).toBe(shops[3].shopNo);
  expect(response.body.shops[1].shopNo).toBe(shops[1].shopNo);
  expect(response.body.shops[2].shopNo).toBe(shops[0].shopNo);
  expect(response.body.shops[3].shopNo).toBe(shops[2].shopNo);
  expect(response.body.type).toBe("Ok");
});

//viewing the properties
test("Viewing all the properties based on the tenant", async () => {
  const response = await request(app)
    .get("/property?tenantName=NaN")
    .expect(200);
  expect(response.body.shops.length).toBe(2);
  expect(response.body.shops[0].shopNo).toBe(shops[0].shopNo);
  expect(response.body.shops[1].shopNo).toBe(shops[1].shopNo);
  expect(response.body.type).toBe("Ok");
});

//viewing the properties
test("Viewing all the properties based on the tenant", async () => {
  const response = await request(app)
    .get("/property?tenantName=wo")
    .expect(200);
  expect(response.body.shops.length).toBe(1);
  expect(response.body.shops[0].shopNo).toBe(shops[1].shopNo);
  expect(response.body.type).toBe("Ok");
});

//viewing the properties
test("Viewing all the properties based on the occupied status", async () => {
  const response = await request(app)
    .get("/property?occupied=true")
    .expect(200);
  expect(response.body.shops.length).toBe(2);
  expect(response.body.shops[0].shopNo).toBe(shops[0].shopNo);
  expect(response.body.shops[1].shopNo).toBe(shops[1].shopNo);
  expect(response.body.type).toBe("Ok");
});

//viewing the properties
test("Viewing all the properties based on the occupied status", async () => {
  const response = await request(app)
    .get("/property?occupied=false")
    .expect(200);
  expect(response.body.shops.length).toBe(2);
  expect(response.body.shops[0].shopNo).toBe(shops[2].shopNo);
  expect(response.body.shops[1].shopNo).toBe(shops[3].shopNo);
  expect(response.body.type).toBe("Ok");
});

//viewing the properties
test("Viewing all the properties based on the occupied status and ordering in descending order of lease amount", async () => {
  const response = await request(app)
    .get("/property?occupied=false&leaseAmount=desc")
    .expect(200);
  expect(response.body.shops.length).toBe(2);
  expect(response.body.shops[0].shopNo).toBe(shops[3].shopNo);
  expect(response.body.shops[1].shopNo).toBe(shops[2].shopNo);
  expect(response.body.type).toBe("Ok");
});

//viewing the properties
test("Viewing all the properties based on the tenant and ordering in descending order of lease amount", async () => {
  const response = await request(app)
    .get("/property?tenantName=NaN&leaseAmount=desc")
    .expect(200);
  expect(response.body.shops.length).toBe(2);
  expect(response.body.shops[0].shopNo).toBe(shops[1].shopNo);
  expect(response.body.shops[1].shopNo).toBe(shops[0].shopNo);
  expect(response.body.type).toBe("Ok");
});

//leasing a property
test("Leasing a available property", async () => {
  const response = await request(app)
    .patch(`/property/${shops[2]._id}`)
    .send({
      tenantName: "new tenant",
      tenantMobile: 9876544433,
      leaseDuration: 3,
    })
    .expect(200);
  const updated_property = await Property.find();
  expect(updated_property[2].leaseAmount).toBe(600000);
  expect(updated_property[2].leaseEndDate).toBe(currDatePlusThree);
  expect(response.body.message).toBe("Lease successfully approved");
  expect(response.body.type).toBe("Ok");
});

//leasing a property
test("Leasing a available property", async () => {
  const response = await request(app)
    .patch(`/property/${shops[3]._id}`)
    .send({
      tenantName: "new tenant",
      tenantMobile: 8765432890,
      leaseDuration: 5,
    })
    .expect(200);
  const updated_property = await Property.find();
  expect(updated_property[3].leaseAmount).toBe(3000000);
  expect(updated_property[3].leaseEndDate).toBe(currDatePlusFive);
  expect(response.body.message).toBe("Lease successfully approved");
  expect(response.body.type).toBe("Ok");
});

//leasing a property
test("Leasing a available property", async () => {
  const response = await request(app)
    .patch(`/property/${shops[1]._id}`)
    .send({
      tenantName: "new tenant",
      tenantMobile: 8765432890,
      leaseDuration: 5,
    })
    .expect(403);
  const updated_property = await Property.find();
  expect(updated_property[1].tenantName).toBe(shops[1].tenantName);
  expect(response.body.type).toBe("Forbidden");
  expect(response.body.message).toBe(
    "Property already occupied, please choose another one"
  );
});
