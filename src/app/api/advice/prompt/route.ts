import { Liquid } from "liquidjs";
import path from "path";

const promptDir = path.join(__dirname, "../../../../../../prompts");
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
                return Object.getOwnPropertyNames(value).length > 0;
            default:
                return !!value;
        }
    },
    raw: false,
})

export async function POST(req: Request): Promise<Response> {
  const input: Partial<Input> = await req.json();
  const prompt = await generatePrompt(input);
  return new Response(prompt);
}

export function generatePrompt(input: Partial<Input>): Promise<string> {
  return templates.renderFile("user", input);
}

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

type PromptOutput = {
  Title: string;
  ShortDescription: string;
  IncidentType: string;
  TimeSensitiveInformation: string;
};

