export type AuditTrailData = {
  data: AuditTrail[];
  count: number;
}

export type AuditTrail = {
  entityType: string;
  entityId: string;
  changedField: string;
  oldValue: string;
  newValue: string;
  changedAt: string;
};

export type FetchAuditParams = {
  page: number;
  limit: number;
};

export type AuditFilterOptions = {
  entityType: string[];
  changedField: string[];
};

export type AuditFilter = {
  entityType: string;
  changedField: string;
  startDate: string;
  endDate: string;
};