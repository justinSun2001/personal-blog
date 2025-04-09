import { Request, Response, NextFunction } from "express";
import ExcelJS from "exceljs";
import fs from "fs";
import path from "path";
import { promisify } from "util";
const unlinkAsync = promisify(fs.unlink);
import multer from "multer";
import { spawn } from "child_process";
import config from "../config.json";

const osType = process.platform; // 获取操作系统类型
// 获取不同系统下的python环境的路径
function getPythonPath() {
  const pathMap = {
    win32: config.pythonPath.win32,
    linux: config.pythonPath.linux,
    darwin: config.pythonPath.darwin,
  };
  // 只处理已知的平台
  if (osType in pathMap) {
    return pathMap[osType as keyof typeof pathMap];
  }
  return "python"; // 默认回退到系统环境变量
}

export const count = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const mysqlPool = req.app.get("mysqlPool");
  try {
    const [totalRows] = await mysqlPool.execute(
      "SELECT COUNT(*) AS total FROM product"
    );
    const total = totalRows[0].total;
    res.json(total);
  } catch (err) {
    next(err);
  }
};
export const pageData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const mysqlPool = req.app.get("mysqlPool");
  try {
    const { page, pageSize } = req.body;
    console.log(req.body);
    const [rows] = await mysqlPool.query(
      "SELECT * FROM product LIMIT ? OFFSET ?",
      [pageSize, pageSize * (page - 1)]
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

export const deleteData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const mysqlPool = req.app.get("mysqlPool");
  const ids = req.body.ids;
  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ error: "ids 必须是一个非空数组" });
  }
  try {
    // 构建 SQL 语句
    const placeholders = ids.map(() => "?").join(",");
    const sql = `DELETE FROM product WHERE id IN (${placeholders})`;

    // 执行删除操作
    const [result] = await mysqlPool.execute(sql, ids);

    // 获取受影响的行数
    const affectedRows = (result as any).affectedRows;

    if (affectedRows > 0) {
      res.json({ message: "数据删除成功", deletedCount: affectedRows });
    } else {
      res.json({ message: "未找到要删除的数据", deletedCount: 0 });
    }
  } catch (err) {
    next(err);
  }
};

export const addData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const mysqlPool = req.app.get("mysqlPool");
  const {
    型号1,
    型号2,
    标识,
    版号,
    片号,
    检验批号,
    生产批号,
    备注,
    目检合格数,
    筛选单状态,
    收费状态,
    是否合检,
  } = req.body;

  try {
    const sql = `
      INSERT INTO product (日期, 型号1, 型号2, 标识, 版号, 片号, 检验批号, 生产批号, 备注, 目检合格数, 筛选单状态, 收费状态, 是否合检)
      VALUES (CURRENT_DATE,?,?,?,?,?,?,?,?,?,?,?,?)
    `;
    const values = [
      型号1,
      型号2,
      标识,
      版号,
      片号,
      检验批号,
      生产批号,
      备注,
      目检合格数,
      筛选单状态,
      收费状态,
      是否合检,
    ];

    const [result] = await mysqlPool.execute(sql, values);
    const insertId = (result as any).insertId;

    res.status(201).json({ message: "数据添加成功", insertId });
  } catch (err) {
    next(err);
  }
};

export const updateData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const mysqlPool = req.app.get("mysqlPool");
  const { id, ...updateFields } = req.body;

  if (!id) {
    return res.status(400).json({ message: "请求体中缺少 id 参数" });
  }
  // 获取当前日期并转换为 YYYY-MM-DD 格式
  const currentDate = new Date().toISOString().split("T")[0];
  updateFields.日期 = currentDate;
  const setClause = Object.keys(updateFields)
    .map((field) => `${field} =?`)
    .join(", ");

  const values = [...Object.values(updateFields), id];

  try {
    const sql = `
      UPDATE product
      SET ${setClause}
      WHERE id =?
    `;

    const [result] = await mysqlPool.execute(sql, values);
    const affectedRows = (result as any).affectedRows;

    if (affectedRows > 0) {
      res.json({ message: "数据更新成功", affectedRows });
    } else {
      res.status(404).json({ message: "未找到指定 id 的数据", affectedRows });
    }
  } catch (err) {
    next(err);
  }
};

export const exportData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const mysqlPool = req.app.get("mysqlPool");
  const ids = req.body.ids;
  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ error: "ids 必须是一个非空数组" });
  }
  try {
    const start_time = Date.now();
    // 构建 SQL 语句
    const placeholders = ids.map(() => "?").join(",");
    const sql = `SELECT * FROM product WHERE id IN (${placeholders})`;

    // 执行查询操作
    const [rows] = await mysqlPool.execute(sql, ids);

    if (Array.isArray(rows) && rows.length > 0) {
      const headers = Object.keys(rows[0]);
      const sheetData = [headers, ...rows.map((row) => Object.values(row))];
      const sheetName = "Sheet1";
      res.setHeader("Content-Type", "application/octet-stream");
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=table_data.xlsx"
      );

      const tempFilePath = `./${Date.now()}.xlsx`;
      const workbook = new ExcelJS.stream.xlsx.WorkbookWriter({
        filename: tempFilePath,
      });

      const worksheet = workbook.addWorksheet(sheetName);
      sheetData.forEach((row) => {
        worksheet.addRow(row);
      });
      worksheet.commit();
      await workbook.commit();

      const readStream = fs.createReadStream(tempFilePath);
      readStream.pipe(res);

      readStream.on("end", async () => {
        try {
          await unlinkAsync(tempFilePath);
        } catch (error) {
          console.error("删除临时文件时出错:", error);
        }
      });

      const end_time = Date.now();
      const duration = end_time - start_time;
      console.log("创建excel程序执行完毕，用时：", duration);
    } else {
      res.status(404).json({ message: "未找到指定 id 的数据" });
    }
  } catch (err) {
    next(err);
    console.error("传输错误:", err);
  }
};

export const exportAll = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const mysqlPool = req.app.get("mysqlPool");
  const PAGE_SIZE = 5000; // 增大分页尺寸提升吞吐量
  let currentPage = 0;

  try {
    const start_time = Date.now();
    // 获取总记录数（带过滤条件）
    const [totalRows] = await mysqlPool.execute(
      "SELECT COUNT(*) AS total FROM product"
    );
    const total = totalRows[0].total;

    // 获取表头（独立查询）
    const [sample] = await mysqlPool.execute("SELECT * FROM product LIMIT 1");
    const headers = Object.keys(sample[0]);

    // 初始化Excel
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=table_data_stream.xlsx"
    );
    const workbook = new ExcelJS.stream.xlsx.WorkbookWriter({
      stream: res,
      useStyles: false,
      useSharedStrings: false,
    });
    const worksheet = workbook.addWorksheet("Sheet1");
    worksheet.addRow(headers).commit();
    // 使用 Query 替代 Execute（备用方案）
    // 某些驱动版本对预处理语句支持不完善，可尝试改用 query 方法：
    // 流式分页写入
    while (currentPage * PAGE_SIZE < total) {
      const offset = currentPage * PAGE_SIZE;
      const [rows] = await mysqlPool.query(
        "SELECT * FROM product LIMIT ? OFFSET ?",
        [PAGE_SIZE, offset]
      );

      for (const row of rows) {
        worksheet.addRow(Object.values(row)).commit();
      }

      currentPage++;
    }

    await workbook.commit();
    console.log("导出耗时:", Date.now() - start_time);
  } catch (err) {
    next(err);
    console.error("传输错误:", err);
  }
};

// Multer 配置（处理formdata类型里面的文件类型）
const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    const dir = path.join(__dirname, "../public/ocr");
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true }); // 递归创建目录
    }
    cb(null, dir);
  },
  filename: function (_req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// ocr识别返回结果类型定义
interface IOCRResult {
  data: any; // 根据实际数据结构细化类型
  filename: string;
  time: number; // 对应 Python 返回的 all_time 字段
}
// 调用python脚本执行，获取标准输出结果并返回
async function runPythonScript(
  pythonPath: string,
  imgPath: string
): Promise<IOCRResult> {
  return new Promise<IOCRResult>((resolve, reject) => {
    const scriptPath = path.join(__dirname, "../py/my_paddle.py");
    const pythonProcess = spawn(pythonPath, [scriptPath, imgPath]);
    let outputData = "";
    let errorData = "";
    // 2. 捕获标准输出（JSON 结果）
    pythonProcess.stdout.on("data", (data) => {
      outputData += data.toString();
    });
    // 3. 捕获错误输出
    pythonProcess.stderr.on("data", (data) => {
      errorData += data.toString();
    });
    // 4. 处理进程结束
    pythonProcess.on("close", (code) => {
      if (code !== 0 || errorData) {
        return reject(new Error(`Python 错误: ${errorData || "非零退出码"}`));
      }
      try {
        const result = JSON.parse(outputData);
        if (result.error) reject(new Error(result.error));
        // 返回结构化的 OCR 数据 + 生成图片路径
        resolve({
          data: result.data,
          filename: result.filename,
          time: result.time,
        });
      } catch (e) {
        reject(new Error("解析 JSON 失败"));
      }
    });
    pythonProcess.on("exit", (code) => {
      console.log(`Python 进程退出，状态码: ${code}`);
    });
  });
}

// 上传图片接口实现
export const uploadPic = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const start = Date.now();
  upload.single("pic")(req, res, (err: any) => {
    if (!req.file) {
      return res.status(400).json({ code: 400, message: "未选择文件" });
    }
    const middle = Date.now();
    const imgPath = path.join(__dirname, "../public/ocr/" + req.file.filename);
    runPythonScript(getPythonPath(), imgPath)
      .then((result: IOCRResult) => {
        const { data, filename, time } = result;
        // 构造返回数据
        const responseData = {
          code: 200,
          message: "上传成功",
          data: {
            url: `http://localhost:3000/ocr/${filename}`, // 访问路径
            ocrData: data,
            time: time,
          },
        };

        res.json(responseData);
        console.log("OCR 数据:", data);
        console.log("生成图片:", filename);
        console.log("总耗时:", time);
        const end = Date.now();
        console.log(middle - start);
        console.log(end - start);
      })
      .catch((err) => {
        console.error("失败:", err);
        res
          .status(500)
          .json({ code: 500, message: "识别失败", error: err.message });
      });
  });
};

// 类型定义
interface ExcelRow {
  [header: string]: string | number | boolean | Date | null;
}

interface SheetData {
  sheetName: string;
  sheetId: number;
  data: ExcelRow[];
}
export const uploadExcel = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 执行文件上传
    await new Promise<void>((resolve, reject) => {
      upload.single("excel")(req, res, (err: unknown) => {
        if (err) reject(err);
        else resolve();
      });
    });

    if (!req.file?.path) {
      return res.status(400).json({ code: 400, message: "未选择文件" });
    }

    // 初始化工作簿
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(req.file.path);

    // 处理第一个工作表
    const worksheet = workbook.worksheets[0];
    if (!worksheet) {
      throw new Error("Excel文件中没有工作表");
    }

    const result: SheetData[] = [];
    const sheetData: ExcelRow[] = [];

    // 获取表头（假设第一行为表头）
    const headerRow = worksheet.getRow(1);
    const headerValues = headerRow.values || []; // 处理null值
    const headers = (headerValues as ExcelJS.CellValue[]).slice(1).map(String); // 显式类型转换
    // 处理数据行
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return; // 跳过表头

      const rowData: ExcelRow = {};
      row.eachCell((cell, colNumber) => {
        const header = headers[colNumber - 1] || `column_${colNumber}`;
        rowData[header] = getCellValue(cell);
      });
      sheetData.push(rowData);
    });

    result.push({
      sheetName: worksheet.name,
      sheetId: worksheet.id,
      data: sheetData,
    });

    // 清理临时文件
    await unlinkAsync(req.file.path);
    res.status(200).json({
      code: 200,
      message: "文件解析成功",
      data: result,
    });
  } catch (error) {
    // 清理临时文件（如果存在）
    if (req.file?.path) {
      await unlinkAsync(req.file.path);
    }

    const errorMessage = error instanceof Error ? error.message : "未知错误";
    res.status(500).json({
      code: 500,
      message: "文件处理失败",
      error: errorMessage,
    });
  }
};

// 处理单元格值类型
function getCellValue(
  cell: ExcelJS.Cell
): string | number | boolean | Date | null {
  if (!cell.value) return null;

  switch (cell.type) {
    case ExcelJS.ValueType.Date:
      return cell.value instanceof Date
        ? cell.value
        : new Date(cell.value.toString());
    case ExcelJS.ValueType.Number:
      return Number(cell.value);
    case ExcelJS.ValueType.String:
      return cell.text;
    case ExcelJS.ValueType.Boolean:
      return Boolean(cell.value);
    default:
      return cell.text;
  }
}

// 上传多条数据
export const addMultipleData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const mysqlPool = req.app.get("mysqlPool");
  const dataArray = req.body; // 假设前端传递的是一个数组

  try {
    const sql = `
      INSERT INTO product (日期, 型号1, 型号2, 标识, 版号, 片号, 检验批号, 生产批号, 备注, 目检合格数, 筛选单状态, 收费状态, 是否合检)
      VALUES (CURRENT_DATE,?,?,?,?,?,?,?,?,?,?,?,?)
    `;
    let count = 0;
    for (const data of dataArray) {
      const {
        型号1,
        型号2,
        标识,
        版号,
        片号,
        检验批号,
        生产批号,
        备注,
        目检合格数,
        筛选单状态,
        收费状态,
        是否合检,
      } = data;

      const values = [
        型号1,
        型号2,
        标识,
        版号,
        片号,
        检验批号,
        生产批号,
        备注,
        目检合格数,
        筛选单状态,
        收费状态,
        是否合检,
      ];

      await mysqlPool.execute(sql, values);
      count++;
    }

    res.status(201).json({ message: "数据添加成功", count });
  } catch (err) {
    next(err);
  }
};
