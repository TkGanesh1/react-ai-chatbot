import { useEffect, useRef } from "react";
import Markdown from "react-markdown";
import styles from "./Chat.module.css";

const WELCOME_MESSAGE = {
  role: "assistant",
  content: "👋Hello! How can I assist you?🤖",
};

export function Chat({ messages, shouldAutoScroll }) {
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (shouldAutoScroll) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, shouldAutoScroll]); // Auto-scroll only when user sends a new message

  return (
    <div className={styles.Chat}>
      {[WELCOME_MESSAGE, ...messages].map(({ role, content }, index) => (
        <div key={index} className={styles.Message} data-role={role}>
          <Markdown>{content}</Markdown>
        </div>
      ))}
      <div ref={chatEndRef} />
    </div>
  );
}
