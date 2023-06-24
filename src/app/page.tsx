import fs from "fs/promises";
import path from "path";

import Map from "./components/Map";
import styles from "./page.module.css";
import { WarningArea } from "./types";
import { MessageArea } from "./messageArea";
import { mercatorToLatLong } from "./coordinates";

export default async function Home() {
  const { warningAreas } = await loadFixtures();

  return (
    <main className={styles.main}>
      <Map warningAreas={warningAreas} />
    </main>
  );
}

type Fixtures = {
  warningAreas: WarningArea[];
};

async function loadFixtures(): Promise<Fixtures> {
  const fixturesDir = path.join(__dirname, "../../../fixtures");
  const messageAreasDir = path.join(fixturesDir, "message-areas");

  const messageAreaPromises = (await fs.readdir(messageAreasDir))
    .map((entry) => path.join(messageAreasDir, entry))
    .map(async (path) => {
      const json = await fs.readFile(path, { encoding: "utf-8" });
      return JSON.parse(json);
    });

  const messageAreas = await Promise.all(messageAreaPromises);

  return {
    warningAreas: messageAreas.flatMap(toWarningArea),
  };
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
