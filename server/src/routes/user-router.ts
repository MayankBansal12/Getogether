// Router for user -> /user
import { Router, Request, Response } from "express";

const router = Router();

// /user/login -> User login
router.post("/login", (req: Request, res: Response) => {

});

// /user/signup -> User signup
router.post("/signup", (req: Request, res: Response) => {

});

// /user/event -> For fetching all events that user is part of
router.get("/event", (req: Request, res: Response) => {

});

export default router
