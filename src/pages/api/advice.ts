import { IncomingMessage } from "http";
import { query } from "../gpt";
import { Input } from "../prompts";

export default async function handle(req: any, res: any): Promise<void> {
  console.log("Advice!");
  const input: Partial<Input> = JSON.parse(req.body);
  console.log("input", input);
  const advice = await query(input);

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
