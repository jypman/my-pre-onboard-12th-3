import { rest } from "msw";
import data from "./db.json";

export const sickKeywordHandler = () => [
  rest.get("/sick", (req, res, ctx) => {
    const searchedKeyword = req.url.searchParams.get("q");

    if (searchedKeyword === null) return res(ctx.status(400));
    if (searchedKeyword === "") return res(ctx.status(200), ctx.json([]));

    return res(
      ctx.status(200),
      ctx.json(
        data.sick.filter((item) => item.sickNm.indexOf(searchedKeyword) > -1),
      ),
    );
  }),
];
