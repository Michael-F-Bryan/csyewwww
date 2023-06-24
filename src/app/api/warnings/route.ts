import fs from "fs/promises";
import path from "path";

import { WarningArea } from "@/types";
import { MessageArea } from "@/app/messageArea";
import { mercatorToLatLong } from "@/app/coordinates";

export async function GET(req: Request): Promise<Response> {
  const messageAreas = await loadFixtures();
  const body = JSON.stringify(messageAreas.flatMap(msg => toWarningArea(msg)));
  return new Response(body);
}

type Fixture = {
  cadNumber: number;
  msg: MessageArea;
};

async function loadFixtures(): Promise<Fixture[]> {
  const fixturesDir = path.join(__dirname, "../../../../../fixtures");
  const messageAreasDir = path.join(fixturesDir, "message-areas");

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
