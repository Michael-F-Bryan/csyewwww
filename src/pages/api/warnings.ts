import fs from "fs/promises";
import path from "path";

import { WarningArea } from "@/types";
import { MessageArea } from "../../messageArea";
import { mercatorToLatLong } from "../../coordinates";
import { NextApiRequest } from "next";
import { findDir } from "@/prompts";

export default async function handle(
  req: NextApiRequest,
  res: any
): Promise<void> {
  const messageAreas = await loadFixtures();
  console.log(messageAreas.map(m => m.cadNumber));
  const warningAreas = messageAreas.flatMap(msg => toWarningArea(msg));
  res.status(200).json(warningAreas);
}

type Fixture = {
  cadNumber: number;
  msg: MessageArea;
};

const fixturesDir = findDir(__dirname, "fixtures");

async function loadFixtures(): Promise<Fixture[]> {
  const messageAreasDir = path.join(await fixturesDir, "message-areas");

  const promises = (await fs.readdir(messageAreasDir))
    .map(entry => path.join(messageAreasDir, entry))
    .map(async filename => {
      const json = await fs.readFile(filename, { encoding: "utf-8" });
      const cadNumber = parseInt(path.basename(filename, "json"));
      const msg: MessageArea = JSON.parse(json);
      return { cadNumber, msg };
    });

  return await Promise.all(promises);
}

function toWarningArea({ cadNumber, msg }: Fixture): WarningArea[] {
  const warnings: WarningArea[] = [];

  for (const feature of msg.features) {
    if (feature.geometry.type == "Polygon") {
      for (const shape of feature.geometry.coordinates) {
        const vertices = shape.map(([x, y]) => mercatorToLatLong({ x, y }));
        warnings.push({ cadNumber, vertices });
      }
    }
  }

  return warnings;
}
