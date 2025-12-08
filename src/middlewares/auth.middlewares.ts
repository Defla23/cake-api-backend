// middleware/auth.middleware.ts
import jwt from "jsonwebtoken";

import { Request, Response, NextFunction } from "express";

import dotenv from "dotenv";
dotenv.config();


interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: string;
  };
}


export const checkRoles = (requiredRoles: string | string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }

    
    const token = authHeader.split(" ")[1];

    try {
      
      const secret = process.env.JWT_SECRET as string;
      if (!secret) throw new Error("JWT secret not defined");

      const decoded = jwt.verify(token, secret) as {
        id: number;
        email: string;
        role: string;
      };

      
      req.user = decoded;

      
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

      next();
    } catch (error) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  };
};


export const adminOnly = checkRoles("admin"); 
export const customerOnly = checkRoles("customer"); 
export const bakerOnly = checkRoles("baker"); 
export const anyRole = checkRoles(["admin", "customer", "baker"]); 
export const userOnly = checkRoles("user"); 
export const adminUser = checkRoles("both"); 
