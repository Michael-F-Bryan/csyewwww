import fs from "fs/promises";
import path from "path";

import { WarningArea } from "@/types";
import { MessageArea } from "@/app/messageArea";
import { mercatorToLatLong } from "@/app/coordinates";

export async function GET(req: Request): Promise<Response> {
  const messageAreas = await loadFixtures();
  const body = JSON.stringify(messageAreas.flatMap(toWarningArea));
  return new Response(body);
}

async function loadFixtures(): Promise<MessageArea[]> {
  const fixturesDir = path.join(__dirname, "../../../../../fixtures");
  const messageAreasDir = path.join(fixturesDir, "message-areas");

  const messageAreaPromises = (await fs.readdir(messageAreasDir))
    .map(entry => path.join(messageAreasDir, entry))
    .map(async path => {
      const json = await fs.readFile(path, { encoding: "utf-8" });
      return JSON.parse(json);
    });

  return await Promise.all(messageAreaPromises);
}

function toWarningArea(msg: MessageArea): WarningArea[] {
  const warnings: WarningArea[] = [];

  for (const feature of msg.features) {
    if (feature.geometry.type == "Polygon") {
      for (const shape of feature.geometry.coordinates) {
        warnings.push({
          vertices: shape.map(([x, y]) => mercatorToLatLong({ x, y })),
        });
      }
    }
  }

  return warnings;
}
