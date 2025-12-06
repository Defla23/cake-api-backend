// middleware/auth.middleware.ts
import jwt from "jsonwebtoken";

import { Request, Response, NextFunction } from "express";

import dotenv from "dotenv";
dotenv.config();

// Extend Express Request type to include user
interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: string;
  };
}

// Main role-checking function
export const checkRoles = (requiredRoles: string | string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    // Step 1: Check Authorization header
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }

    // Step 2: Extract token
    const token = authHeader.split(" ")[1];

    try {
      // Step 3: Verify JWT
      const secret = process.env.JWT_SECRET as string;
      if (!secret) throw new Error("JWT secret not defined");

      const decoded = jwt.verify(token, secret) as {
        id: number;
        email: string;
        role: string;
      };

      // Step 4: Attach user info to request
      req.user = decoded;

      // Step 5: Check roles
      if (Array.isArray(requiredRoles)) {
        if (!requiredRoles.includes(decoded.role)) {
          return res
            .status(403)
            .json({ message: "Forbidden: Insufficient role" });
        }
      } else {
        if (decoded.role !== requiredRoles) {
          return res
            .status(403)
            .json({ message: "Forbidden: Insufficient role" });
        }
      }

      // Access granted
      next();
    } catch (error) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  };
};

// Pre-configured middleware
export const adminOnly = checkRoles("admin"); // Only admin
export const customerOnly = checkRoles("customer"); // Only customer
export const bakerOnly = checkRoles("baker"); // Only baker
export const anyRole = checkRoles(["admin", "customer", "baker"]); // Any role allowed
export const userOnly = checkRoles("user"); // Only regular users allowed
export const adminUser = checkRoles("both"); // Both admins and users allowed
