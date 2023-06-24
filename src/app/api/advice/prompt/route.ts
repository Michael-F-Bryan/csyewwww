import { Input, generatePromptMessages } from "@/app/prompts";

export async function POST(req: Request): Promise<Response> {
  const input: Partial<Input> = await req.json();
  const messages = await generatePromptMessages(input);
  return new Response(JSON.stringify(messages));
}
