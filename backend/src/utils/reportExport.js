import { Parser as CsvParser } from 'json2csv';
import ExcelJS from 'exceljs';
import PDFDocument from 'pdfkit';

const slugify = (title) =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

export const exportCSV = (res, { title, columns, rows }) => {
  const fields = columns.map((c) => ({ label: c.label, value: c.key }));
  const parser = new CsvParser({ fields });
  const csv = parser.parse(rows);
  res.header('Content-Type', 'text/csv');
  res.attachment(`${slugify(title)}.csv`);
  res.send(csv);
};

export const exportExcel = async (res, { title, columns, rows }) => {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet(title.slice(0, 31));
  sheet.columns = columns.map((c) => ({ header: c.label, key: c.key, width: 24 }));
  sheet.addRows(rows);
  sheet.getRow(1).font = { bold: true };

  res.header(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  );
  res.attachment(`${slugify(title)}.xlsx`);
  await workbook.xlsx.write(res);
  res.end();
};

export const exportPDF = (res, { title, columns, rows }) => {
  res.header('Content-Type', 'application/pdf');
  res.attachment(`${slugify(title)}.pdf`);

  const doc = new PDFDocument({ margin: 40, size: 'A4', layout: 'landscape' });
  doc.pipe(res);

  doc.fontSize(16).text(title, { underline: true });
  doc.moveDown();
  doc.fontSize(9);

  const usableWidth = doc.page.width - 80;
  const colWidth = usableWidth / columns.length;

  const drawRow = (values, isHeader = false) => {
    const y = doc.y;
    if (isHeader) doc.font('Helvetica-Bold');
    values.forEach((value, i) => {
      doc.text(String(value ?? ''), 40 + i * colWidth, y, { width: colWidth - 6 });
    });
    if (isHeader) doc.font('Helvetica');
    doc.moveDown(0.4);
  };

  drawRow(columns.map((c) => c.label), true);
  doc.moveTo(40, doc.y).lineTo(40 + usableWidth, doc.y).stroke();
  doc.moveDown(0.3);

  rows.forEach((row) => {
    if (doc.y > doc.page.height - 60) doc.addPage();
    drawRow(columns.map((c) => row[c.key]));
  });

  doc.end();
};

export const streamExport = (res, format, report) => {
  if (format === 'csv') return exportCSV(res, report);
  if (format === 'excel') return exportExcel(res, report);
  if (format === 'pdf') return exportPDF(res, report);
  throw new Error(`Unsupported export format: ${format}`);
};
