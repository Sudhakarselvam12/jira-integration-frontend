import axios from "axios";
import type { AuditFilter, AuditFilterOptions, AuditTrailData, FetchAuditParams } from "./audit-trail.types";
import { useQuery } from "@tanstack/react-query";

export const fetchAuditData = async (filters: AuditFilter, { page, limit }: FetchAuditParams): Promise<AuditTrailData> => {
  const res = await axios.get(`${import.meta.env.VITE_BACK_URL}/api/audit`, {
    params: {
      entityType: filters.entityType,
      changedField: filters.changedField,
      startDate: filters.startDate,
      endDate: filters.endDate,
      page,
      limit,
    },
  });
  return res.data;
};

export const useAuditTrailQuery = (filters: AuditFilter, page: number, limit: number, options? : { enabled?: boolean } ) => {
  return useQuery<AuditTrailData>({
    queryKey: ['audit', filters, page, limit],
    queryFn: () => fetchAuditData(filters, { page, limit }),
    ...options,
  });
};

export const useGetAuditFilterQuery = () => {
  return useQuery<AuditFilterOptions>({
    queryKey: ['auditFilter'],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_BACK_URL}/api/audit/filteroptions`);
      return res.data;
    },
  });
};

export const useGetAuditCountsQuery = () => {
  return useQuery({
    queryKey: ['auditCount'],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_BACK_URL}/api/audit/count`);
      return res.data;
    },
  });
};

export const exportAuditData = async () => {
  const response = await axios.get(`${import.meta.env.VITE_BACK_URL}/api/audit/export`, {
    responseType: 'blob',
  });
  if (response.status !== 200) {
    throw new Error('Failed to export audit trail');
  }
  return response.data;
}
