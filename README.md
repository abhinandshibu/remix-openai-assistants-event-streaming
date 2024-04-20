# Remix OpenAI Event Streaming

An example performing event streaming with the OpenAI assistants API. 

The primary aim is to simplify the usage of event streaming on the frontend, hence complexity will be pushed to the API routes and other helper functions, by copying them you only need to use the front-end functions:
- loadThread(thread_id, set: setStateAction)
- addMessage(thread_id: string, message: string)
- run(thread_id: string, assistant_id: string, set: setStateAction) 
- addMessageAndRun(thread_id: string, message: string, assistant_id: string, set: setStateAction) 
- addMessageAndRuns(thread_id: string, message: string, assistant_ids: string[], set: setStateAction) 
NOTE: the `set` state variable will represent all the information inside of a singular thread, it is something that can be used universally, it can be filtered for appropriate assistants, it represents the order of the messages. Vitally, it is a real-time representation of the thread for the frontend, that encompasses second by second streaming changes.
```
[
    {
        assistant_id: string,
        message: ...
    },
    
]
```

hook? but that only allows us to use the result on the top level, so what if we want to add another message and make another run

Run with your `OPENAI_API_KEY` in `.env` file.

- The `eventStream` from remix utils will be used, so install using `npm i remix-utils`
- We will be using the javascript inbuilt `EventSource`, rather than using the hook `useEventSource` from `remix-utils`

`EventSource` is inbuilt and supported by most browsers. It establishes a persistant HTTP connection and is primarily used for pushing updates from the server to client.
- The client attaches event listeners, to listen to and handle these events
- The persistant connection keeps the connection open after the server responds, allowing them to push updates anytime they want without needing another request from the client. To do this the server responds with the header `content-type: text/event-stream`
- Event-streams use the server-side events (SSE) protocol, it not seperate like HTTP or websockets, but rather is standard for formatting and communicating messages using HTTP.
- SSE have simple field names `event, data, retry, id`, meaningfully `data: ...` followed by `'\n\n`
- It automatically attempts to reconnect if connection is lost.

Websockets are a full duplex connection between the server and client.
- Data packets in websocket are framed to be smaller than normal HTTP for small messages
- HTTP mandates that the client initiates messages, while websockets allow for either

---

Design Aims:
- A single state variable that has all the messages on the thread and is up to date.
- It should be up to date in that it is updated by every token that is streamed.
- The format of this state variable is a list of messages, namely in the format that the openai `threads/{thread_id}/messages` gives


Method:
- Initially => Load thread into state var
- User sends message => Add message to thread & reload thread into state var
- Response => 
    Trigger message run with assistant & 
    when event `thread.message.created` is given, its object is the message which should be appended the state var & 
    when events `thread.message.delta` is given, its value should be appended to the message it was intended for 

Backend & Frontend
- The backend will essentially act as a proxy (for now)
- The frontend will create a few functions to handle the logic, which will be stored in seperate files to simplify the view
- The frontend development experience will then consist of 4 elements
    - `loadThread()`
    - `addMessage()`
    - `run()`
    - the state variable that holds the context
    
Self Notes:
- We can optimise this process by using the most recent message_id in the `after` key of the request, to just load the recent messages.
- Different event types within the streams triggered by runs (https://platform.openai.com/docs/api-reference/assistants-streaming/events) 

