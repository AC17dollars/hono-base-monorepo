import type { HealthResponse } from "./schemas.js";

export const getHealthStatus = (): HealthResponse => {
  return {
    status: "ok",
    timestamp: new Date().toISOString(),
  };
};
