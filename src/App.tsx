import { useDebouncedCallback } from "@charlietango/hooks/use-debounced-callback";
import { useEffect, useState } from "react";
import "./App.css";

const fetchRoot = async () => {
  console.log("🚀 ~ Fetching ~");
  const response = await fetch("http://localhost:3001", {
    signal: AbortSignal.timeout(1000)
    // headers: {
    //   "Content-Type": "application/json"
    // }
  });
  console.log(await response.text());
};

function App() {
  const debouncedCallback = useDebouncedCallback(fetchRoot, 1000);
  debouncedCallback();
  return <></>;
}

export default App;
