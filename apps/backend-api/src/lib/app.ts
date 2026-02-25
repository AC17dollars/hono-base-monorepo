import { Hono } from "hono";
import { auth } from "./instances.js";

export type SessionUser = (typeof auth)["$Infer"]["Session"]["user"];
export type Session = (typeof auth)["$Infer"]["Session"]["session"];

export type AppVariables = {
  user: SessionUser | null;
  session: Session | null;
};

export type AppEnv = { Variables: AppVariables };
export type AppType = Hono<AppEnv>;
