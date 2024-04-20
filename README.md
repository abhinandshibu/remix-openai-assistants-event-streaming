# Remix OpenAI Event Streaming

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
    when events `thread.message.delta` are given, its value should be appended to the message it was intended for 

Backend & Frontend
- The backend will essentially act as a proxy (for now)
- The frontend will create a few functions to handle the logic, which will be stored in seperate files to simplify the view
- The frontend development experience will then consist of 4 elements
    - `loadThread()`
    - `addMessage()`
    - `run()`
    - the state variable that holds the up-to-date context

---

Run with your `OPENAI_API_KEY` in `.env` file.

- The `eventStream` from remix utils will be used to create backend event stream, so install using `npm i remix-utils`
- We will be using the inbuilt `EventSource` to consume the event stream on the frontend (you can also use `useEventSource` from `remix-utils`)

---
    
Self Notes:
- We can optimise this process by using the most recent message_id in the `after` key of the request, to just load the recent messages
- Different event types within the streams triggered by runs (https://platform.openai.com/docs/api-reference/assistants-streaming/events)

