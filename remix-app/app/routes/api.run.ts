// RESOURCE ROUTE: The purpose is to provide text completions for a chatbot.

import { LoaderFunctionArgs } from "@remix-run/server-runtime";
import dotenv from 'dotenv';
import OpenAI from "openai";
import { eventStream } from "remix-utils/sse/server";

dotenv.config();
const api_key = process.env.OPENAI_API_KEY;
if (api_key === undefined) {
    throw new Error('OPENAI_API_KEY is not defined');
}
const openai = new OpenAI({ apiKey: api_key });

export async function loader({ request }: LoaderFunctionArgs) {
    let thread_id = new URL(request.url).searchParams.get("thread_id");
    let assistant_id = new URL(request.url).searchParams.get("assistant_id");
    if (!assistant_id || !thread_id) {
        return { status: 400, data: 'assistant_id or thread_id is missing' };
    }

    console.log("RUN TRIGGERED")
    
    const stream = await openai.beta.threads.runs.create(
        thread_id!,
        { assistant_id: assistant_id!, stream: true }
    );
    
    // /* Acting as a proxy, just returning the stream. */
    // return new Response(stream.toReadableStream(), {
    //     headers: {
    //       'Content-Type': 'text/event-stream',
    //       'Cache-Control': 'no-cache',
    //       'Connection': 'keep-alive',
    //     },
    // });


    return eventStream(request.signal, (send) => {
		async function run() {
			// for await (let _ of interval(1000, { signal: request.signal })) {
			// 	send({ event: "time", data: new Date().toISOString() });
			// }
            for await (const event of stream) {
                send({ event: event.event, data: JSON.stringify(event.data) });
            }
		}

		run();

        return function clear() {};
	});
}