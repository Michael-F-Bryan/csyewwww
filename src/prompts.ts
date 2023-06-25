import { Liquid } from "liquidjs";
import path from "path";
import fs from "fs/promises";

const templates = loadTemplates();

export async function generatePromptMessages(
  input: Input
): Promise<CompletionMessage[]> {
  const t = await templates;
  const messageDetail = await findMessageDetail(input.incident.cadNumber);

  const ctx = { ...input, messageDetail };

  return [
    {
      role: "system" as const,
      content: (await t.renderFile("system", ctx)) as string,
    },
    {
      role: "user" as const,
      content: (await t.renderFile("user", ctx)) as string,
    },
  ];
}

export type CompletionMessage = {
  role: "user" | "system" | "assistant";
  content: string;
};

export type IncidentInfo = {
  /** The CAD number for this incident. */
  cadNumber: number;
  polygonLevel?: string;
  /**
   * The type of warning (advice, watch and act, etc.).
   */
  type: string;
};

export type UserInfo = {
  /**
   * Is the
   */
  elderly: boolean;
  /**
   * The user doesn't have access to a vehicle.
   */
  noVehicle: boolean;
  /**
   * The user has livestock that needs to be taken care of.
   */
  hasLivestock: boolean;
  /**
   * The user has access to firefighting equipment.
   */
  hasFirefightingEquipment: boolean;
  /**
   * The user requires assistance.
   */
  requiresAssistance: boolean;
  /**
   * The user has mobility issues.
   */
  mobilityIssues: boolean;
  /**
   * The user has issues with seeing.
   */
  visionImpaired: boolean;
  /**
   * The user has issues with hearing.
   */
  hearingImpaired: boolean;
  /**
   * The user has issues accessing their property.
   */
  accessIssues: boolean;
};

export type Input = {
  incident: IncidentInfo;
  user: Partial<UserInfo>;
};

async function loadTemplates() {
  const promptDir = await findDir(__dirname, "prompts");
  const templates = new Liquid({
    root: promptDir,
    extname: ".liquid",
  });

  templates.registerFilter("isSet", {
    handler: (value: any) => {
      switch (typeof value) {
        case "undefined":
          return false;
        case "object":
          return Object.values(value).some(v => !!v);
        default:
          return !!value;
      }
    },
    raw: false,
  });

  return templates;
}

export async function findDir(
  initialDir: string,
  needle: string
): Promise<string> {
  let dir = path.resolve(initialDir);

  while (dir && dir != "/") {
    const promptDir = path.join(dir, needle);
    try {
      await fs.stat(promptDir);
      return promptDir;
    } catch {
      dir = path.dirname(dir);
      continue;
    }
  }

  throw new Error(`Couldn't find ${needle} in ${initialDir}`);
}

async function findMessageDetail(cadNumber: number): Promise<string> {
  const fixtures = await findDir(__dirname, "fixtures");
  const filename = path.join(fixtures, "alerts", `${cadNumber}.html`);

  try {
    return await fs.readFile(filename, { encoding: "utf-8" });
  } catch {
    return "";
  }
}
