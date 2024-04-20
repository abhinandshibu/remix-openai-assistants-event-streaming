import { Outlet } from "@remix-run/react";



export function Layout({ children }: { children: React.ReactNode }) {
  let a = new EventSource('/api/add-message-to-thread')
  return (
    <html lang="en">

    </html>
  );
}

export default function App() {
  return <Outlet />;
}
