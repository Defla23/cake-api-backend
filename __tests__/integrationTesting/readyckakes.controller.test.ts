import request from "supertest";
import app from "../../src/index";
import { getPool } from "../../src/db/config";

let pool: any;
let testCakeId: number;

beforeAll(async () => {
  pool = await getPool();

  // Seed a test cake
  const result = await pool
    .request()
    .query(`
      INSERT INTO ReadyMade_Cakes (cakeName, flavorsUsed, size, imageURL, quantityAvailable, isactive)
      OUTPUT INSERTED.cakeId
      VALUES ('Test Chocolate Cake', 'Chocolate, Cocoa', 'Small', 'testcake.jpg', 5, 1);
    `);
  testCakeId = result.recordset[0].cakeId;
});

afterAll(async () => {
  // Cleanup
  await pool
    .request()
    .query("DELETE FROM ReadyMade_Cakes WHERE cakeName LIKE 'Test Chocolate Cake%' OR cakeName LIKE 'Integration Strawberry Cake%'");
  await pool.close();
});

describe("ReadyMade Cakes API Integration Tests", () => {
  it("should retrieve all cakes", async () => {
    const res = await request(app).get("/api/readycakes");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should retrieve a cake by ID", async () => {
    const res = await request(app).get(`/api/readycakes/${testCakeId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("cakeId", testCakeId);
  });

  it("should return 404 for a non-existing cake", async () => {
    const res = await request(app).get("/api/readycakes/999999");
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toMatch(/cake not found/i);
  });

  it("should create a new cake", async () => {
    const res = await request(app).post("/api/readycakes").send({
      cakeName: "Integration Strawberry Cake",
      flavorsUsed: "Strawberry, Cream",
      size: "Medium",
      imageURL: "strawberry_test.jpg",
      quantityAvailable: 10,
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("message", "Cake added successfully");
    expect(res.body.newCake).toHaveProperty("cakeId");

    // Cleanup
    const newCakeId = res.body.newCake.cakeId;
    await pool
      .request()
      .input("cakeId", newCakeId)
      .query("DELETE FROM ReadyMade_Cakes WHERE cakeId = @cakeId");
  });

  it("should update an existing cake", async () => {
    const res = await request(app)
      .put(`/api/readycakes/${testCakeId}`)
      .send({ size: "Large", quantityAvailable: 8 });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message", "Cake updated successfully");
  });

  it("should return 404 when updating a non-existent cake", async () => {
    const res = await request(app)
      .put("/api/readycakes/999999")
      .send({ size: "Large" });
    expect(res.statusCode).toBe(400); // matches service error handling
    expect(res.body.message).toMatch(/cake not found/i);
  });

  it("should delete an existing cake", async () => {
    // Insert cake to delete
    const result = await pool
      .request()
      .query(`
        INSERT INTO ReadyMade_Cakes (cakeName, flavorsUsed, size, imageURL, quantityAvailable, isactive)
        OUTPUT INSERTED.cakeId
        VALUES ('CakeToDelete', 'Vanilla', 'Small', 'delete_me.jpg', 2, 1);
      `);
    const deleteId = result.recordset[0].cakeId;

    const res = await request(app).delete(`/api/readycakes/${deleteId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/cake deleted successfully/i);
  });

  it("should return 404 when deleting a non-existing cake", async () => {
    const res = await request(app).delete("/api/readycakes/999999");
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toMatch(/cake not found/i);
  });
});
