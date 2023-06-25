import { IncomingMessage } from "http";
import { query } from "../gpt";
import { Input } from "../prompts";

export default async function handle(req: any, res: any): Promise<void> {
  console.log("Advice!");
  const input: Partial<Input> = JSON.parse(req.body);
  console.log("input", input);

  // HACK: Use a hard-coded response for now
  // const advice = await query(input);
  const advice = {
    "Title": "Stay Informed",
    "ShortDescription": "You are in a warning area, stay updated",
    "IncidentType": "Fire",
    "TimeSensitiveInformation": "- A fire has started in your area\n- There is currently no immediate threat to lives or homes\n- Stay aware and keep up to date with the latest information\n- Prepare your bushfire survival plan and be ready to act\n- If you need to evacuate, follow the advice of emergency services\n- Click 'Read More' for road closure information",
  };

  console.log(advice);

  res.status(200).json(advice);
}

function readBody<T>(request: IncomingMessage): Promise<T> {
  return new Promise(resolve => {
    const body: any[]  = [];

    request.on('data', function(chunk: any) {
        body.push(chunk);
        console.log(chunk);
    }).on('end', function() {
      const joined = Buffer.concat(body).toString();
      resolve(JSON.parse(joined));
    })
    .on('close', () => console.log("Closed"))
    .on('error', e => console.log("Error", e))
    ;
  })
}
