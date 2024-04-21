// RESOURCE ROUTE: The purpose is to provide text completions for a chatbot.

import { LoaderFunctionArgs } from "@remix-run/server-runtime";
import dotenv from 'dotenv';
import OpenAI from "openai";
import { json } from "@remix-run/node";

dotenv.config();
const api_key = process.env.OPENAI_API_KEY;
if (api_key === undefined) {
    throw new Error('OPENAI_API_KEY is not defined');
}
const openai = new OpenAI({ apiKey: api_key });

export async function loader({ request }: LoaderFunctionArgs) {
    let thread_id = new URL(request.url).searchParams.get("thread_id");

    if (!thread_id) {
        return { status: 400, data: 'thread_id is missing' };
    }

    try {
        const threadMessages = await openai.beta.threads.messages.list(thread_id, {limit: 100});
        return json({ status: 200, data: threadMessages.data });
    } catch (error) {
        return json({ status: 500, data: 'Internal Server Error' }, { status: 500 });
    }
}