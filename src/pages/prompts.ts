import { Liquid } from "liquidjs";
import path from "path";

const scriptDir = path.dirname(import.meta.url.replace("file://", ""));
const promptDir = path.join(scriptDir, "../../prompts");
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

export async function generatePromptMessages(
  input: Partial<Input>
): Promise<CompletionMessage[]> {
  console.log(__dirname, import.meta.url);

  const msg = {
    role: "user" as const,
    content: (await templates.renderFile("user", input)) as string,
  };
  return [msg];
}

export type CompletionMessage = {
  role: "user" | "system" | "assistant";
  content: string;
};

export type IncidentInfo = {
  /** The CAD number for this incident. */
  cadNumber: number;
  polygonLevel: string;
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
  incident: Partial<IncidentInfo>;
  user: Partial<UserInfo>;
};
