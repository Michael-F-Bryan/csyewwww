import { query } from "../../gpt";
import { Input } from "../../prompts";

export default async function handle(req: any, res: any): Promise<void> {
  const input: Partial<Input> = JSON.parse(req.body);
  let advice;

  try {
    console.log("Querying", input);
    advice = await query(input);
    console.log("Advice", advice);
  } catch (e) {
    console.error("Bad response from GPT-3.5", e);
    // Fall back to the hard-coded response
    advice = {
      Title: "Stay Informed",
      ShortDescription: "You are in a warning area, stay updated",
      IncidentType: "Fire",
      TimeSensitiveInformation:
        "- A fire has started in your area\n- There is currently no immediate threat to lives or homes\n- Stay aware and keep up to date with the latest information\n- Prepare your bushfire survival plan and be ready to act\n- If you need to evacuate, follow the advice of emergency services\n- Click 'Read More' for road closure information",
    };
  }

  res.status(200).json(advice);
}
