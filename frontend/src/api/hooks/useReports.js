import { useMutation, useQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/client';

export const useEnvironmentalReport = (params = {}) =>
  useQuery({
    queryKey: ['reports', 'environmental', params],
    queryFn: () => apiClient.get('/reports/environmental', { params }),
  });

export const useSocialReport = (params = {}) =>
  useQuery({
    queryKey: ['reports', 'social', params],
    queryFn: () => apiClient.get('/reports/social', { params }),
  });

export const useGovernanceReport = (params = {}) =>
  useQuery({
    queryKey: ['reports', 'governance', params],
    queryFn: () => apiClient.get('/reports/governance', { params }),
  });

export const useESGSummaryReport = () =>
  useQuery({
    queryKey: ['reports', 'esg-summary'],
    queryFn: () => apiClient.get('/reports/esg-summary'),
  });

export const useRunCustomReport = () =>
  useMutation({
    mutationFn: (filters) => apiClient.post('/reports/custom', filters),
  });

const triggerDownload = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

const EXTENSIONS = { csv: 'csv', excel: 'xlsx', pdf: 'pdf' };

export const downloadCannedReport = async (type, format, params = {}) => {
  const blob = await apiClient.get(`/reports/export/${type}`, {
    params: { ...params, format },
    responseType: 'blob',
  });
  triggerDownload(blob, `${type}-report.${EXTENSIONS[format]}`);
};

export const downloadCustomReport = async (filters, format) => {
  const blob = await apiClient.post('/reports/custom/export', filters, {
    params: { format },
    responseType: 'blob',
  });
  triggerDownload(blob, `custom-report.${EXTENSIONS[format]}`);
};
