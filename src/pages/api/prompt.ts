import { Input, generatePromptMessages } from "../../prompts";

export default async function handle(req: Request): Promise<Response> {
  const input: Input = await req.json();
  const messages = await generatePromptMessages(input);
  return new Response(JSON.stringify(messages));
}
