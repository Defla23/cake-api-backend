import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import * as userRepositories from "../repositories/user.repository";
import { NewUser, UpdateUser } from "../types/user.types";
import { sendEmail } from "../mailer/mailer";
import { emailTemplate } from "../mailer/emailtemplate";
import { error } from "console";
import { throws } from "assert";
import dotenv from "dotenv";

dotenv.config();

export const createUserWithVerification = async (user: NewUser) => {
  if (user.password) {
    const hashedPassword = await bcrypt.hash(user.password, 10);

    user.password = hashedPassword;
  }

  const availableuser = await userRepositories.getUserByEmail(user.email);

  if (availableuser) {
    throw new Error("Email already exists");
  }

  await userRepositories.createUser(user);

  const verificationCode = Math.floor(
    100000 + Math.random() * 900000,
  ).toString();

  await userRepositories.setVerificationCode(user.email, verificationCode);

  try {
    console.log("Sending verification email to", user.email);
    await sendEmail(
      user.email,
      "Verify your email - CAKEApp By Liz",
      emailTemplate.verify(user.name, verificationCode),
    );
    console.log(user.name, verificationCode);
    return {
      message: `User created successfully. Verification code sent to ${user.email}.`,
    };
  } catch (error) {
    console.error("Error sending verification email");
  }
};

// Login user with role-based JWT
export const loginUser = async (email: string, password: string) => {
  const user = await userRepositories.getUserByEmail(email);

  // Check if user exists
  if (!user) {
    const error: any = new Error("User not found.");
    error.status = 404;
    throw error;
  }

  // Verify password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const error: any = new Error("Invalid credentials.");
    error.status = 401;
    throw error;
  }

  if (!user.is_verified) {
    const error: any = new Error("Please verify your email before logging in.");
    error.status = 403;
    throw error;
  }

  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    const error: any = new Error("JWT secret not defined.");
    error.status = 500;
    throw error;
  }

  const token = jwt.sign(payload, secret, { expiresIn: "1h" });

  return {
    message: "Login successful.",
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    },
  };
};

// Verify user email
export const verifyUser = async (email: string, code: string) => {
  const user = await userRepositories.getUserByEmail(email);

  if (!user) throw new Error("User not found");

  if (user.verification_code !== code) {
    throw new Error("Invalid verification code");
  }

  await userRepositories.verifyUser(email);

  try {
    await sendEmail(
      user.email,
      "Your email has been verified",
      emailTemplate.verifiedSuccess(user.name),
    );
  } catch (error) {
    console.error("Error sending success email:", error);
  }
  return { message: "User verified successfully." };
};

//  Resend verification code
export const resendVerificationCode = async (email: string) => {
  const user = await userRepositories.getUserByEmail(email);
  if (!user) throw new Error("User not found.");

  const verificationCode = Math.floor(
    100000 + Math.random() * 900000,
  ).toString();
  await userRepositories.setVerificationCode(email, verificationCode);

  try {
    await sendEmail(
      user.email,
      "Resend verification code",
      emailTemplate.verify(user.name, verificationCode),
    );
  } catch (error) {
    console.error(" Error resending verification email:", error);
  }

  return { message: "Verification code resent successfully." };
};

//  Get all users
export const getAllUsers = async () => {
  return await userRepositories.getUsers();
};

// Get user by ID
export const getUserById = async (id: number) => {
  const user = await userRepositories.getUserById(id);
  if (!user) throw new Error("User not found.");
  return user;
};

// Delete user
export const deleteUser = async (id: number) => {
  const user = await userRepositories.getUserById(id);

  if (!user) {
    throw new Error("User not found");
  }

  await userRepositories.deleteUser(id);

  return { message: "user deleted successfully" };
};

// Get user by email
export const getUserByEmail = async (email: string) => {
  return await userRepositories.getUserByEmail(email);
};

export const updateUser = async (id: number, userUpdates: UpdateUser) => {
  if (userUpdates.password) {
    userUpdates.password = await bcrypt.hash(userUpdates.password, 10);
  }

  const updatedUser = await userRepositories.updateUser(id, userUpdates);

  if (!updatedUser) {
    throw new Error("User not found");
  }

  return updatedUser;
};
