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


`EventSource` is inbuilt and supported by most browsers. It establishes a persistant HTTP connection and is primarily used for pushing updates from the server to client.
- The client attaches event listeners, to listen to and handle these events
- The persistant connection keeps the connection open after the server responds, allowing them to push updates anytime they want without needing another request from the client. To do this the server responds with the header `content-type: text/event-stream`
- Event-streams use the server-side events (SSE) protocol, it not seperate like HTTP or websockets, but rather is standard for formatting and communicating messages using HTTP.
- SSE have simple field names `event, data, retry, id`, meaningfully `data: ...` followed by `'\n\n`
- It automatically attempts to reconnect if connection is lost.

Websockets are a full duplex connection between the server and client.
- Data packets in websocket are framed to be smaller than normal HTTP for small messages
- HTTP mandates that the client initiates messages, while websockets allow for either
