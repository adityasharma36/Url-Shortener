
import { initTRPC } from "@trpc/server";


const t = initTRPC.create();


export const Router = t.router;
export const publicProcedure = t.procedure;