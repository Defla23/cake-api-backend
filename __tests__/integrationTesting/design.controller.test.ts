import request from "supertest";
import app from "../../src/index";
import { getPool } from "../../src/db/config";

let pool: any;
let testDesignId: number;

beforeAll(async () => {
  pool = await getPool();

  // Insert a test design before running tests
  const result = await pool
    .request()
    .query(`
      INSERT INTO Cake_Designs (designName, description, baseFlavor, availability, size, imageUrl, category)
      OUTPUT INSERTED.designId
      VALUES ('Test Design', 'A simple test design', 'Chocolate', 1, 'Medium', 'test.jpg', 'Birthday')
    `);

  testDesignId = result.recordset[0].designId;
});

afterAll(async () => {
  // Clean up test data
  await pool.request().query(`
    DELETE FROM Cake_Designs 
    WHERE designName IN ('Test Design', 'New Design', 'Delete Me')
  `);
  await pool.close();
});

describe("Cake Designs Controller Integration Tests", () => {
  it("should retrieve all designs", async () => {
    const response = await request(app).get("/designs");
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it("should retrieve a design by ID", async () => {
    const response = await request(app).get(`/designs/${testDesignId}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("DesignID", testDesignId);
  });

  it("should return 404 for a non-existing design", async () => {
    const response = await request(app).get("/designs/999999");
    expect(response.statusCode).toBe(404);
  });

  it("should create a new design", async () => {
    const response = await request(app).post("/designs").send({
      DesignName: "New Design",
      Description: "Newly added design for testing",
      BaseFlavor: "Vanilla",
      Availability: 1,
      Size: "Large",
      ImageUrl: "newdesign.jpg",
      Category: "Wedding",
    });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty(
      "message",
      "Cake design created successfully"
    );
  });

  it("should update an existing design", async () => {
    const response = await request(app).put(`/designs/${testDesignId}`).send({
      DesignName: "Updated Test Design",
      Description: "Updated Description",
      BaseFlavor: "Vanilla",
      Availability: 1,
      Size: "Small",
      ImageUrl: "updated.jpg",
      Category: "Anniversary",
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty(
      "message",
      "Cake design updated successfully"
    );
  });

  it("should delete an existing design", async () => {
    // Insert a temporary design to delete
    const result = await pool.request().query(`
      INSERT INTO Cake_Designs (DesignName, Description, BaseFlavor, Availability, size, imageUrl, category)
      OUTPUT INSERTED.designId
      VALUES ('Delete Me', 'Temp design', 'Vanilla', 1, 'Small', 'temp.jpg', 'Test')
    `);

    const deleteId = result.recordset[0].designId;

    const response = await request(app).delete(`/designs/${deleteId}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty(
      "message",
      "Cake design deleted successfully"
    );
  });

  it("should return 404 when deleting a non-existing design", async () => {
    const response = await request(app).delete("/designs/9999999");
    expect(response.statusCode).toBe(404);
  });
});
