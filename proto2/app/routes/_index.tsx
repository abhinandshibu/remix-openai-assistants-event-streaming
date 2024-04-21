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

export default function Index() {
  const thread_id = "thread_xQGrXCKB4LaIYIaq94xM9PWw";
  const [thread, setThread] = useState<any[]>([]);

  useEffect(() => { loadThread(thread_id, setThread) }, []);


  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      {/* <button onClick={() => loadThread(thread_id, setThread)}>
        Load Thread
      </button> */}
      <>
        {/* {JSON.stringify(thread, null, 2)} */}
        {thread.map((message: any) => <> { JSON.stringify(message, null, 2) } <br/><br/> </>)}
      </>
      
    </div>
  );
}
