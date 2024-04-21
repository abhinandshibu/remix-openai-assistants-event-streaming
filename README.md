# Remix OpenAI Event Streaming with OpenAI Assistants API

This example aims to keep a single state variable that stores the message of the thread and is up to date. In that, the every streamed token is updated in this thread state variable, leading to automatic UI updates. So when creating your UI, you only need to use the thread state variable as you wish. 

This is done through three resource routes, with three corresponding functions:
- `api.add-message.ts` and `addMessage(thread_id, message, setThread)`
- `api.load-thread.ts` and `loadThread(thread_id, setThread)`
- `api.run.ts` and `run(thread_id, assistant_id, setThread)`

Though as a developer just copy in the resource routes, and place the corresponding functions in a file, and now you should be able to utilise them in your application as you wish. 

Create and populate your thread on initial render:
```javascript
const [thread, setThread] = useState<any[]>([]);
useEffect(() => { loadThread(thread_id, setThread) }, []);
```

Run with your `OPENAI_API_KEY` in `.env` file.

Install `npm i remix-utils`, which is used to create the `eventStream`.

---

Design Aims:
- A single state variable that has all the messages on the thread and is up to date. 
- It should be up to date in that it is updated by every token that is streamed.
- The format of this state variable is a list of messages, namely in the format that the openai `threads/{thread_id}/messages` gives

Method:
- Initially => Load openai thread into thread state var
- User sends message => Add message to openai thread & append result onto thread state var
- Response => 
    Trigger message run & 
    when event `thread.message.created` is given, its return value is the message which should be appended to the thread state var & 
    when events `thread.message.delta` are given, its return value should be appended to the specific message in the thread state var &
    when event `thread.message.completed` is given, its return value is the message which should overwrite the message

Backend & Frontend
- The backend will essentially act as a proxy 
- The frontend will create a few functions to handle the logic, which can be stored in seperate files to simplify the view
- The frontend development experience will then consist of 4 elements
    - `loadThread()`
    - `addMessage()`
    - `run()`
    - the state variable that holds the up-to-date context (note, it is in desc order of time)


