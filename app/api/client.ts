import { hc } from "hono/client";
import { AppType } from "./[[...route]]/route";

export const client = hc<AppType>("");
