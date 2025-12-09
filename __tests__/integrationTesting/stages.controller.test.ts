import request from "supertest";
import app from "../../src/index";
import { getPool } from "../../src/db/config";

let pool: any;
let testUserId: number;

const testUserEmail = "integrationtest@example.com";
const testUser = {
  name: "Integration Test",
  email: testUserEmail,
  password: "Password123!",
  phone: "1234567890",
  role: "customer",
};

beforeAll(async () => {
  pool = await getPool();

  
  await pool.request().query(`DELETE FROM Users WHERE email='${testUserEmail}'`);
});

afterAll(async () => {
 
  if (testUserId) {
    await pool.request().query(`DELETE FROM Users WHERE userid=${testUserId}`);
  }
  await pool.close();
});

describe("User Controller Integration Tests", () => {
  it("should register a new user", async () => {
    const res = await request(app).post("/users/register").send(testUser);
    expect(res.status).toBe(201);
    expect(res.body.message).toContain("User created successfully");
  });

  it("should not allow duplicate registration", async () => {
    const res = await request(app).post("/users/register").send(testUser);
    expect(res.status).toBe(500);
    expect(res.body.message).toBe("Email already exists");
  });

  it("should fetch all users", async () => {
    const res = await request(app).get("/users");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("should fetch user by id", async () => {
    const userRes = await pool.request().query(`SELECT * FROM Users WHERE email='${testUserEmail}'`);
    testUserId = userRes.recordset[0].userid;

    const res = await request(app).get(`/users/${testUserId}`);
    expect(res.status).toBe(200);
    expect(res.body.email).toBe(testUserEmail);
  });

  it("should update user details", async () => {
    const res = await request(app)
      .put(`/users/${testUserId}`)
      .send({ name: "Updated Name" });
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("User updated successfully");
  });

  it("should mark user as verified and login successfully", async () => {
    await pool.request().query(`UPDATE Users SET is_verified=1 WHERE userid=${testUserId}`);

    const res = await request(app)
      .post("/users/login")
      .send({ email: testUserEmail, password: testUser.password });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe(testUserEmail);
  });

  it("should delete the user", async () => {
    const res = await request(app).delete(`/users/${testUserId}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("user deleted successfully");
  });

  it("should return 404 for non-existing user", async () => {
    const res = await request(app).get("/users/999999");
    expect(res.status).toBe(404);
  });
});
