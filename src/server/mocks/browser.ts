import { setupWorker } from "msw";
import { sickKeywordHandler } from "./sickKeywordHandler";

export const worker = setupWorker(...sickKeywordHandler());
