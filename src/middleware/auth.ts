import { NextFunction, Response } from "express";
import { verify, sign } from "jsonwebtoken";

export const authenticate = (req: any, res: Response, next: NextFunction) => {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ message: "Access denied" });

    try {
        const decoded = verify(token, process.env.JWT_SECRET_KEY!);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).json({ message: "Invalid token" });
    }
};

export const generateToken = (id: string, role: string) => {
    return sign({ id, role }, process.env.JWT_SECRET_KEY!, { expiresIn: "1h" });
};