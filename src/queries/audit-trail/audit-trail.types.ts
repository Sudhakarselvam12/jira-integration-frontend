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