import * as userService from "../../src/service/user.service";
import * as userRepositories from "../../src/repositories/user.repository";
import { sendEmail } from "../../src/mailer/mailer";
import { emailTemplate } from "../../src/mailer/emailtemplate";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// Mock dependencies
jest.mock("../../src/repositories/user.repository");
jest.mock("bcryptjs", () => ({
  __esModule: true,
  default: { hash: jest.fn(), compare: jest.fn() },

}));

jest.mock("../../src/mailer/mailer");
jest.mock("../../src/mailer/emailtemplate");

describe("User Service ", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return a list of users", async () => {
    const mockUsers = [
      {
        userid: 2,
        name: "James Mwangi",
        email: "jamesbaker@gmail.com",
        password: "password123",
      },
      {
        userid: 3,
        name: "Ann Wanjiku",
        email: "annwanjiku@gmail.com",
        password: "password123",
      },
    ];

    (userRepositories.getUsers as jest.Mock).mockResolvedValue(mockUsers);

    const users = await userService.getAllUsers();
    expect(users).toEqual(mockUsers);
    expect(userRepositories.getUsers).toHaveBeenCalledTimes(1);
  });

  it("should hash password, save user, and send verification email", async () => {
    const mockUser = {
      name: "Defla Chebet",
      email: "chebet@gmail.com",
      password: "password123",
    };

    // Mocks
    (bcrypt.hash as jest.Mock).mockResolvedValue("hashedPassword");
    (userRepositories.createUser as jest.Mock).mockResolvedValue({
      message: "User created successfully. Verification code sent to email.",
    });
    (sendEmail as jest.Mock).mockResolvedValue(true);
    (emailTemplate.verify as jest.Mock).mockReturnValue(
      "<p>Your verification code is 123456</p>"
    );

    // Call the correct service function
    const result = await userService.createUserWithVerification(mockUser as any);

    expect(bcrypt.hash).toHaveBeenCalledWith("password123", 10);
    expect(userRepositories.createUser).toHaveBeenCalled();
    expect(sendEmail).toHaveBeenCalled();
    expect(result).toEqual({
      message: "User created successfully. Verification code sent to chebet@gmail.com.",
    });
  });
  it("should verify user with correct code", async () => {
        const mockUser = {
            email: "kemboi@gmail.com",
            verification_code: "123456",
            is_verified: false,
            name: "Brian kemboi",
           
        };
        (userRepositories.getUserByEmail as jest.Mock).mockResolvedValue(mockUser);
        (userRepositories.verifyUser as jest.Mock).mockResolvedValue({});
        (sendEmail as jest.Mock).mockResolvedValue(true);
        (emailTemplate.welcome as jest.Mock).mockReturnValue("<p>Account Verified</p>");

        const result = await userService.verifyUser("kemboi@gmail.com", "123456");

        expect(userRepositories.getUserByEmail).toHaveBeenCalledWith("kemboi@gmail.com");
        expect(userRepositories.verifyUser).toHaveBeenCalledWith("kemboi@gmail.com");
        expect(sendEmail).toHaveBeenCalled();
       expect(result).toEqual({ message: "User verified successfully." });

    });
    it("should throw error for invalid verification code", async () => {
        const mockUser = {
            email: "kemboi@gmail.com",
            verification_code: "123456",
            is_verified: false,
            name: "Brian kemboi",
            
        };

        (userRepositories.getUserByEmail as jest.Mock).mockResolvedValue(mockUser);

        await expect(userService.verifyUser("kemboi@gmail.com", "987654"))
            .rejects
            .toThrow("Invalid verification code");
    });
it.skip("should return token and user info when login is successful", async () => {
        const mockUser = {
            userid: 3,
            name: 'Ann Wanjiku',
            email: 'annwanjiku@gmail.com',
            password: 'hashedPass',
            phone_number: '0711000004',
            is_verified: true,
        };

        (userRepositories.getUserByEmail as jest.Mock).mockResolvedValue(mockUser);
        (bcrypt.compare as jest.Mock).mockResolvedValue(true);
        (jwt.sign as jest.Mock).mockReturnValue("mockjwtToken");

        const result = await userService.loginUser("annwanjiku@gmail.com", "password123");

        expect(userRepositories.getUserByEmail).toHaveBeenCalledWith("annwanjiku@gmail.com");
        expect(jwt.sign).toHaveBeenCalled();
        expect(result).toHaveProperty("token", "mockjwtToken");
        expect(result.user.email).toBe("annwanjiku@gmail.com");
    });
     it("should throw error for invalid credentials", async () => {
        const mockUser = { email: 'annwanjiku@gmail.com', password: 'hashedPass' };
        (userRepositories.getUserByEmail as jest.Mock).mockResolvedValue(mockUser);
        (bcrypt.compare as jest.Mock).mockResolvedValue(false);

        await expect(userService.loginUser("annwanjiku@gmail.com", "wrongpassword"))
            .rejects
            .toThrow("Invalid credentials");
    });
    it("should update user after hashing password", async () => {
        (userRepositories.getUserById as jest.Mock).mockResolvedValue({ userid: 1 });
        (bcrypt.hash as jest.Mock).mockResolvedValue("newHashedPassword");
        (userRepositories.updateUser as jest.Mock).mockResolvedValue({ message: "User updated successfully" });

        const result = await userService.updateUser(1, { password: "newpassword123" } as any);

        expect(bcrypt.hash).toHaveBeenCalledWith("newpassword123", 10);
        expect(userRepositories.updateUser).toHaveBeenCalled();
        expect(result).toEqual({ message: "User updated successfully" });
    });
it("should delete user if exists", async () => {
        (userRepositories.getUserById as jest.Mock).mockResolvedValue({ userid
: 1 });
        (userRepositories.deleteUser as jest.Mock).mockResolvedValue({ message: "User deleted successfully" });

        const result = await userService.deleteUser(1);
        expect(userRepositories.deleteUser).toHaveBeenCalledWith(1);
        expect(result).toEqual({ message: "user deleted successfully"});
    });

});
