"use client";
import { useEffect, useState } from "react";

export default function AIPage() {
  const [answer, setAnswer] = useState<string>("Loading...");

  useEffect(() => {
    // Load script của Puter
    const script = document.createElement("script");
    script.src = "https://js.puter.com/v2/";
    script.onload = async () => {
      // Khi script load xong, gọi hàm AI
      // @ts-ignore: vì Puter không có type
      const response = await window.puter.ai.chat(
        "Explain the difference between frontend and backend development."
      );
      // @ts-ignore
      setAnswer(response.message.content || response);
    };
    document.body.appendChild(script);
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>💬 GPT-5 nano (Puter)</h1>
      <pre
        style={{
          background: "#111",
          color: "#0f0",
          padding: "1rem",
          borderRadius: "8px",
          whiteSpace: "pre-wrap",
        }}
      >
        {answer}
      </pre>
    </div>
  );
}
