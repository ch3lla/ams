import { NextFunction, Response } from "express";
import { verify, sign } from "jsonwebtoken";

export const authenticate = (req: any, res: Response, next: NextFunction) => {
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No Token, please login.' });
    }

    const token = authorization.split(' ')[1];
    try {
        const decoded = verify(token, process.env.JWT_SECRET_KEY!);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).json({ message: "Invalid token" });
    }
};

export const authenticateLecturer = (req: any, res: any, next: NextFunction) => {
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No Token, please login.' });
    }

    const token = authorization.split(' ')[1];
    try {
        const decoded = verify(token, process.env.JWT_SECRET_KEY!);
        req.user = decoded;
        if (req.user.role !== "lecturer"){
            res.status(400).json({ message: "Unauthorized" });
            return;
        }
        next();
    } catch (error) {
        res.status(400).json({ message: "Invalid token" });
    }
};

export const authenticateStudent = (req: any, res: any, next: NextFunction) => {
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No Token, please login.' });
    }

    const token = authorization.split(' ')[1];
    try {
        const decoded = verify(token, process.env.JWT_SECRET_KEY!);
        req.user = decoded;
        if (req.user.role !== "student"){
            res.status(400).json({ message: "Unauthorized" });
            return;
        }
        next();
    } catch (error) {
        res.status(400).json({ message: "Invalid token" });
    }
};