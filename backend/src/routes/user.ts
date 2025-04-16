import express, { Request, Response, NextFunction } from "express";
import {
  user_register,
  user_login,
  user_list,
  get_pubkey,
  refreshed_token,
  get_code,
} from "../controllers/userController";
import { authenticateRefreshToken } from "../jwt";

const router = express.Router();

// POST request for login
router.post("/login", (req: Request, res: Response, next: NextFunction) => {
  user_login(req, res, next);
});

// POST request for register
router.post("/register", (req: Request, res: Response, next: NextFunction) => {
  user_register(req, res, next);
});

// GET request for list of users
router.get("/", (req: Request, res: Response, next: NextFunction) => {
  user_list(req, res, next);
});

router.get("/pubkey", (req: Request, res: Response, next: NextFunction) => {
  get_pubkey(req, res, next);
});

router.post("/code", (req: Request, res: Response, next: NextFunction) => {
  get_code(req, res, next);
});

router.get(
  "/refreshedToken",
  authenticateRefreshToken,
  (req: Request, res: Response, next: NextFunction) => {
    refreshed_token(req, res, next);
  }
);

export default router;
