import { query } from "@/app/gpt";
import { Input } from "@/app/prompts";

export async function POST(req: Request): Promise<Response> {
  const input: Partial<Input> = await req.json();
  const advice = await query(input);

  return new Response(JSON.stringify(advice));
}
