import axios from "axios";
import type { AuditTrailData, FetchAuditParams } from "./audit-trail.types";
import { useQuery } from "@tanstack/react-query";

export const fetchAuditData = async ({ page, limit }: FetchAuditParams): Promise<AuditTrailData> => {
  const res = await axios.get(`${import.meta.env.VITE_BACK_URL}/api/audit`, {
    params: {
      page,
      limit,
    },
  });
  return res.data;
};

export const useAuditTrailQuery = (page: number, limit: number) => {
  return useQuery<AuditTrailData>({
    queryKey: ['audit', page, limit],
    queryFn: () => fetchAuditData({ page, limit }),
  });
};
