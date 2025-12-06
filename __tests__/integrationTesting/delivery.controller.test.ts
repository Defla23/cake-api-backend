import request from "supertest";
import app from "../../src/index";
import { getPool } from "../../src/db/config";

let pool: any;
let testDeliveryId: number;

beforeAll(async () => {
  pool = await getPool();
  
  const result = await pool.request().query(`
    INSERT INTO Deliveries
      (OrderID, DeliveryAddress, DeliveryDate, CourierName, CourierContact, Status)
    OUTPUT INSERTED.DeliveryID
    VALUES 
      (1, 'Test Address, Nyeri', '2025-11-05 10:00:00', 'TestCourier', '+254711111111', 'Scheduled')
  `);

  testDeliveryId = result.recordset[0].DeliveryID;
  console.log("Inserted test delivery with ID:", testDeliveryId);
});

afterAll(async () => {
  
  await pool.request().query(`
    DELETE FROM Deliveries 
    WHERE DeliveryAddress IN ('Test Address, Nyeri', 'Delete Me Address', 'New Test Delivery', 'Updated Address')
  `);
  await pool.close();
});

describe("Delivery Controller Integration Tests", () => {
  it("should retrieve all deliveries", async () => {
    const response = await request(app).get("/delivery");
    expect(response.statusCode).toBe(200);  
  });

  it("should retrieve a delivery by ID", async () => {
    const response = await request(app).get(`/delivery/${testDeliveryId}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.data).toHaveProperty("DeliveryID", testDeliveryId);
  });

  it("should return 404 for a non-existing delivery", async () => {
    const response = await request(app).get("/delivery/ndnd");
    expect(response.statusCode).toBe(404);
  });

it("Create a Schedule a  new delivery",async()=>{
  const response = await request(app).post("/delivery").send({
     OrderId: 501,
      DeliveryAddress: "Updated Address",
      DeliveryDate: "2025-11-07T10:00:00",
      CourierName: "UpdatedCourier",
      CourierContact: "+254733333333",
      Status: "Delivered",
  })
  expect(response.statusCode).toBe(201)
})

  it("should update an existing delivery", async () => {
    const response = await request(app).put(`/delivery/${testDeliveryId}`).send({
      OrderId: 501,
      DeliveryAddress: "Updated Address",
      DeliveryDate: "2025-11-07T10:00:00",
      CourierName: "UpdatedCourier",
      CourierContact: "+254733333333",
      Status: "Delivered",
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty(
      "message",
      "Delivery updated successfully"
    );
  });

  it("should delete an existing delivery", async () => {
   
    const result = await pool.request().query(`
      INSERT INTO Deliveries 
        (OrderID, DeliveryAddress, DeliveryDate, CourierName, CourierContact, Status)
      OUTPUT INSERTED.DeliveryID
      VALUES 
        (503, 'Delete Me Address', '2025-11-08 15:00:00', 'TempCourier', '+254744444444', 'Scheduled')
    `);

    const deleteId = result.recordset[0].DeliveryID;

    const response = await request(app).delete(`/delivery/${deleteId}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty(
      "message",
      "Delivery deleted successfully"
    );
  });

  it("should return 404 when deleting a non-existing delivery", async () => {
    const response = await request(app).delete("/delivery/9999999");
    expect(response.statusCode).toBe(404);
  });
});
