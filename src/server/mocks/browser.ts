import { setupWorker } from "msw";
import { searchedKeywordHandler } from "./searchedKeywordHandler";

export const worker = setupWorker(...searchedKeywordHandler());
