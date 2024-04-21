import type { MetaFunction } from "@remix-run/node";
import { useEffect, useState } from "react";

export const meta: MetaFunction = () => {
  return [
    { title: "Home" },
    { name: "description", content: "Event Streaming Example" },
  ];
};

async function loadThread(
  thread_id: string,
  setThread: React.Dispatch<any>
) {
  const response = await fetch(`/api/load-thread?thread_id=${thread_id}`);
  const responseJson = await response.json();
  setThread(responseJson.data.map((message: any) => ({ ...message, key: message.id})))
}

async function addMessage(
  thread_id: string,
  message: string,
  setThread: React.Dispatch<React.SetStateAction<any[]>>
) {
  const encodedMessage = encodeURIComponent(message);
  const response = await fetch(`/api/add-message?thread_id=${thread_id}&message=${encodedMessage}`);
  const responseJson = await response.json();
  setThread((thread) => [ { ...responseJson.data, key: responseJson.data.id}, ...thread ])
}

async function run(
  thread_id: string,
  assistant_id: string,
  setThread: React.Dispatch<React.SetStateAction<any[]>>
) {
  const sse = new EventSource(`/api/run?thread_id=${thread_id}&assistant_id=${assistant_id}`);
   
  sse.addEventListener("thread.message.created", (event) => {
    let data = JSON.parse(event.data);
    setThread(thread => [ data, ...thread ]);
  });

  sse.addEventListener("thread.message.delta", (event) => {
    let data = JSON.parse(event.data);
    setThread((prevThread) =>
      prevThread.map((message) => {
        if (message.id === data.id) {
          if (message.content.length === 0) {
            return {
              ...message,
              content: data.delta.content
            }; 
          } else {
            return {
              ...message,
              content: [{
                ...message.content[0],
                text: {
                  ...message.content[0].text,
                  value: message.content[0].text.value + data.delta.content[0].text.value,
                },
              }],
            };
          }
        }
        return message;
      })
    );
  });

  sse.addEventListener("thread.message.completed", (event) => {
    let data = JSON.parse(event.data);
    setThread(thread => 
      thread.map((message) => {
        if (message.id === data.id) {
          return data;
        }
        return message;
      })
    )
    sse.close();
  }); 
}

export default function Index() {
  // INSERT YOUR THREAD_ID AND ASSISTANT_ID HERE
  const thread_id = "thread_xQGrXCKB4LaIYIaq94xM9PWw";
  const assistant_id = "asst_yBFBOAjeYbV44F5oyF7LIgUH";
  
  const [thread, setThread] = useState<any[]>([]);
  useEffect(() => { loadThread(thread_id, setThread) }, []);

  const [userMessage, setUserMessage] = useState("");

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      
      <>
        <input type="text" value={userMessage} onChange={(e) => setUserMessage(e.target.value)} />
        <button onClick={() => addMessage(thread_id, userMessage, setThread)}>
          Add Message 
        </button>
        <button onClick={() => run(thread_id, assistant_id, setThread)}>
          Run 
        </button> 
      </>

      <>
        <br/> <hr/>
        {thread.slice().reverse().map((message: any) => <> <b>{message.role}:</b> {message.content.length > 0 && message.content[0].text.value} <br/> </>)}
      </>
      
    </div>
  );
}
