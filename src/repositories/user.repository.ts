import { getPool } from "../db/config";
import sql from "mssql";
import { NewUser, UpdateUser, User } from "../types/user.types";

//  Create user
export const createUser = async (user: NewUser) => {
  const pool = await getPool();
  const result = await pool
    .request()
    .input("name", sql.VarChar, user.name)
    .input("email", sql.VarChar, user.email)
    .input("password", sql.VarChar, user.password)
    .input("phone", sql.VarChar, user.phone || "")
    .input("address", sql.VarChar, user.address || "")
    .input("role", sql.VarChar, user.role || "customer")
    .input("is_verified", sql.Bit, 0)
    .input("verification_code", sql.VarChar, user.verification_code || null)
    .query(`
      INSERT INTO Users (name, email, password, phone, address, role, is_verified, verification_code)
      OUTPUT INSERTED.*
      VALUES (@name, @email, @password, @phone, @address, @role, @is_verified, @verification_code)
    `);

  return result.recordset[0];
};

// Get all users
export const getUsers = async (): Promise<User[]> => {
  const pool = await getPool();
  const result = await pool.request().query("SELECT * FROM Users");
  return result.recordset;
};

// Get user by ID
export const getUserById = async (id: number): Promise<any | null> => {
  const pool = await getPool();

  const result = await pool.request()
    .input("userid", sql.Int, id)

    .query("SELECT * FROM Users WHERE userid = @userid");
  return result.recordset[0] || null;
};

// Get user by Email
export const getUserByEmail = async (email: string) => {
  const pool = await getPool();
  const result = await pool
    .request()
    .input("email", sql.VarChar, email)
    .query("SELECT * FROM Users WHERE email = @email");
  return result.recordset[0] || null;
};

export const updateUser = async (id: number, updates: UpdateUser) => {
  const pool = await getPool();

  const fields: string[] = [];
  if (updates.name) fields.push(`name='${updates.name}'`);
  if (updates.email) fields.push(`email='${updates.email}'`);
  if (updates.password) fields.push(`password='${updates.password}'`);
  if (updates.phone) fields.push(`phone='${updates.phone}'`);
  if (updates.address) fields.push(`address='${updates.address}'`);
  if (updates.role) fields.push(`role='${updates.role}'`);
  if (typeof updates.is_verified !== "undefined")
    fields.push(`is_verified=${updates.is_verified ? 1 : 0}`);
  if (updates.verification_code)
    fields.push(`verification_code='${updates.verification_code}'`);

  if (fields.length === 0) return { message: "No fields to update" };

  const query = `UPDATE Users SET ${fields.join(", ")} WHERE userid=${id}`;
  const result = await pool.request().query(query);

  // Check if any row was updated
  if (result.rowsAffected[0] === 0) {
    return null; // user not found
  }

  return { message: "User updated successfully" };
};

//  Delete user
export const deleteUser = async (id: number) => {
  const pool = await getPool();

  await pool.request()
    .input("userid", sql.Int, id)

    .query("DELETE FROM Users WHERE userid = @userid");
  return { message: "User deleted successfully" };
};

// Set verification code
export const setVerificationCode = async (
  email: string,
  verification_code: string,
) => {
  const pool = await getPool();
  await pool
    .request()
    .input("email", email)
    .input("verification_code", verification_code)
    .query(
      "UPDATE  Users SET verification_code = @verification_code   WHERE email = @email ",
    );
  return { message: "Verification code saved" };
};

// Verify user
export const verifyUser = async (email: string) => {
  const pool = await getPool();
  await pool.request().input("email", email).query(`
      UPDATE Users
      SET is_verified =1, verification_code=NULL
      WHERE email=@email
    `);
  return { message: "User verified successfully" };
};
