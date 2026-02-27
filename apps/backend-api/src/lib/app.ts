import { Hono } from "hono";
import { getAuth } from "./instances.js";

export type Auth = ReturnType<typeof getAuth>;
export type SessionUser = Auth["$Infer"]["Session"]["user"];
export type Session = Auth["$Infer"]["Session"]["session"];

export type AppVariables = {
  user: SessionUser | null;
  session: Session | null;
};

export type AppEnv = { Variables: AppVariables };
export type AppType = Hono<AppEnv>;
