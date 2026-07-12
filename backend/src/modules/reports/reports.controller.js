import { asyncHandler } from '../../middleware/asyncHandler.js';
import { sendSuccess } from '../../utils/ApiResponse.js';
import { streamExport } from '../../utils/reportExport.js';
import * as reportsService from './reports.service.js';

export const environmental = asyncHandler(async (req, res) => {
  const report = await reportsService.getEnvironmentalReport(req.query);
  return sendSuccess(res, 200, 'Environmental report generated', report);
});

export const social = asyncHandler(async (req, res) => {
  const report = await reportsService.getSocialReport(req.query);
  return sendSuccess(res, 200, 'Social report generated', report);
});

export const governance = asyncHandler(async (req, res) => {
  const report = await reportsService.getGovernanceReport(req.query);
  return sendSuccess(res, 200, 'Governance report generated', report);
});

export const esgSummary = asyncHandler(async (req, res) => {
  const report = await reportsService.getESGSummaryReport();
  return sendSuccess(res, 200, 'ESG summary report generated', report);
});

export const custom = asyncHandler(async (req, res) => {
  const report = await reportsService.getCustomReport(req.body);
  return sendSuccess(res, 200, 'Custom report generated', report);
});

export const exportCanned = asyncHandler(async (req, res) => {
  const { format, ...query } = req.query;
  const report = await reportsService.getCannedReport(req.params.type, query);
  streamExport(res, format, report);
});

export const exportCustom = asyncHandler(async (req, res) => {
  const report = await reportsService.getCustomReport(req.body);
  streamExport(res, req.query.format, report);
});
