import { Input, generatePrompt } from "./prompt/route";

export async function POST(req: Request): Promise<Response> {
  const input: Partial<Input> = await req.json();
  const prompt = await generatePrompt(input);

  return new Response(prompt);
}
