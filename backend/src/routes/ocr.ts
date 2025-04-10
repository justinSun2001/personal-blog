import express, { Request, Response, NextFunction } from "express";
import {
  count,
  pageData,
  deleteData,
  addData,
  updateData,
  exportData,
  exportAll,
  uploadPic,
  uploadExcel,
  addMultipleData,
} from "../controllers/ocrController";

const router = express.Router();

// GET request for list of users
router.get("/sum", (req: Request, res: Response, next: NextFunction) => {
  count(req, res, next);
});
router.post("/get", (req: Request, res: Response, next: NextFunction) => {
  pageData(req, res, next);
});
router.post("/delete", (req: Request, res: Response, next: NextFunction) => {
  deleteData(req, res, next);
});
router.post("/add", (req: Request, res: Response, next: NextFunction) => {
  addData(req, res, next);
});
router.post("/update", (req: Request, res: Response, next: NextFunction) => {
  updateData(req, res, next);
});
router.post("/export", (req: Request, res: Response, next: NextFunction) => {
  exportData(req, res, next);
});
router.get("/exportAll", (req: Request, res: Response, next: NextFunction) => {
  exportAll(req, res, next);
});
router.post("/uploadPic", (req: Request, res: Response, next: NextFunction) => {
  uploadPic(req, res, next);
});
router.post(
  "/uploadExcel",
  (req: Request, res: Response, next: NextFunction) => {
    uploadExcel(req, res, next);
  }
);
router.post(
  "/multipleAdd",
  (req: Request, res: Response, next: NextFunction) => {
    addMultipleData(req, res, next);
  }
);
export default router;
