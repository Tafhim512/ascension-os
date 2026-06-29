import { getCurrentProfile } from "@/lib/auth";
import { chatStream } from "@/lib/ai/conversation";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    if (!messages || !Array.isArray(messages)) {
      return new Response("Missing messages", { status: 400 });
    }

    const profile = await getCurrentProfile();
    const stream = await chatStream(profile, messages);

    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          controller.enqueue(new TextEncoder().encode(chunk.message.content));
        }
        controller.close();
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error) {
    console.error("Chat error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
