import type { MetaFunction } from "@remix-run/node";
import { FetcherWithComponents, useFetcher } from "@remix-run/react";
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
  setThread(responseJson.data)
}

async function addMessage(
  thread_id: string,
  message: string,
  setThread: React.Dispatch<React.SetStateAction<any[]>>
) {
  const encodedMessage = encodeURIComponent(message);
  const response = await fetch(`/api/add-message?thread_id=${thread_id}&message=${encodedMessage}`);
  const responseJson = await response.json();
  setThread((thread) => [ responseJson.data, ...thread ])
}

export default function Index() {
  const thread_id = "thread_xQGrXCKB4LaIYIaq94xM9PWw";
  const [thread, setThread] = useState<any[]>([]);

  const [userMessage, setUserMessage] = useState("");

  /* Load the thread on initial render */
  useEffect(() => { loadThread(thread_id, setThread) }, []);

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      
      <>
        <input type="text" value={userMessage} onChange={(e) => setUserMessage(e.target.value)} />
        <button onClick={() => addMessage(thread_id, userMessage, setThread)}>
          Add Message 
        </button>
      </>

      <>
        <br/> --------- <br/>
        {thread.map((message: any) => <> { JSON.stringify(message, null, 2) } <br/><br/> </>)}
      </>
      
    </div>
  );
}
