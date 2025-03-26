import { Request, Response, NextFunction } from "express";
import ExcelJS from "exceljs";
import fs from "fs";
import path from "path";
import { promisify } from "util";
const unlinkAsync = promisify(fs.unlink);

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

      const start_time = Date.now();

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
