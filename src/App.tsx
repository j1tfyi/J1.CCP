import { React } from "../deps.client.ts";

export default function App() {
  const [count, setCount] = React.useState(0);

  return (
    <div style={{ fontFamily: "sans-serif" }}>
      <h1>Hello from Deno + React 18!</h1>
      <p>Count is {count}</p>
      <button onClick={() => setCount((c) => c + 1)}>Increment</button>
    </div>
  );
}