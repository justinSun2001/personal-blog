import express, { Request, Response, NextFunction } from 'express';
import { user_register, user_login, user_list, get_pubkey } from '../controllers/userController';
import multer from "multer";

const router = express.Router();
const upload = multer(); // 解析 multipart/form-data（不存文件）

// POST request for login
router.post('/login', (req: Request, res: Response, next: NextFunction) => {
  user_login(req, res, next);
});

// POST request for register
router.post('/register', upload.none(), (req: Request, res: Response, next: NextFunction) => {
  user_register(req, res, next);
});

// GET request for list of users
router.get('/', (req: Request, res: Response, next: NextFunction) => {
  user_list(req, res, next);
});

router.get('/pubkey', (req: Request, res: Response, next: NextFunction) => {
  get_pubkey(req, res, next);
})



export default router;
