import { findDir } from "@/prompts";
import path from "path";
import fs from "fs/promises";

export default async function handler(req: Request, res: any) {
    const match = req.url.match(/\/\d+$/);
    if (!match) {
        throw new Error();
    }
    console.log(match);
    const cadNumber = parseInt(match[0].replace("/", ""));
    const fixtures = await findDir(__dirname, "fixtures");
    const filename = path.join(fixtures, "original-alerts", `${cadNumber}.html`);
    const text = await fs.readFile(filename, {encoding: "utf-8"});

    res.status(200).send(text);
}
