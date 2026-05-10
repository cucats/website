export const STATUSES = [
  "pending",
  "paid",
  "ready",
  "shipped",
  "collected",
  "delivered",
  "cancelled",
] as const;

export type OrderStatus = (typeof STATUSES)[number];
