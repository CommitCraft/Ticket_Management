import type { Request, Response } from 'express';
import ExcelJS from 'exceljs';
import PDFDocument from 'pdfkit';
import { asyncHandler } from '../utils/async-handler.js';
import { buildReportSummary, buildUserReportSummary } from '../services/report.service.js';

export const getReportSummary = asyncHandler(async (_req: Request, res: Response) => {
  const report = await buildReportSummary();
  res.json(report);
});

export const getMyReportSummary = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;
  const report = await buildUserReportSummary(String(userId));
  res.json(report);
});

export const exportReport = asyncHandler(async (req: Request, res: Response) => {
  const format = String(req.query.format ?? 'csv');
  const report = await buildReportSummary();

  if (format === 'xlsx') {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Summary');
    sheet.columns = [
      { header: 'Metric', key: 'metric', width: 30 },
      { header: 'Value', key: 'value', width: 15 }
    ];
    Object.entries(report.summary).forEach(([metric, value]) => sheet.addRow({ metric, value }));
    const buffer = await workbook.xlsx.writeBuffer();
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=report.xlsx');
    res.send(Buffer.from(buffer));
    return;
  }

  if (format === 'pdf') {
    const doc = new PDFDocument({ margin: 40 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=report.pdf');
    doc.pipe(res);
    doc.fontSize(18).text('Helpdesk Report Summary');
    doc.moveDown();
    Object.entries(report.summary).forEach(([metric, value]) => {
      doc.fontSize(12).text(`${metric}: ${value}`);
    });
    doc.end();
    return;
  }

  const rows = Object.entries(report.summary)
    .map(([metric, value]) => `${metric},${value}`)
    .join('\n');
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=report.csv');
  res.send(`metric,value\n${rows}`);
});
