import { useState } from "react";
import { Assistant } from "./assistants/googleai";
import { Loader } from "./components/Loader/Loader";
import { Chat } from "./components/Chat/Chat";
import { Controls } from "./components/Controls/Controls";
import styles from "./App.module.css";
import Lottie from "lottie-react";
import Logo from "./Logo.json";

function App() {
  const assistant = new Assistant();
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(false);

  function updateLastMessageContent(content) {
    setMessages((prevMessages) =>
      prevMessages.map((message, index) =>
        index === prevMessages.length - 1
          ? { ...message, content: `${message.content}${content}` }
          : message
      )
    );
  }

  function addMessage(message, autoScroll = false) {
    setMessages((prevMessages) => [...prevMessages, message]);
    setShouldAutoScroll(autoScroll); // Set auto-scroll flag
  }

  async function handleContentSend(content) {
    addMessage({ content, role: "user" }, true); // Auto-scroll only on user message
    setIsLoading(true);
    try {
      const result = await assistant.chatStream(content);
      let isFirstChunk = false;

      for await (const chunk of result) {
        if (!isFirstChunk) {
          isFirstChunk = true;
          addMessage({ content: "", role: "assistant" }, false); // No auto-scroll on assistant response
          setIsLoading(false);
          setIsStreaming(true);
        }
        updateLastMessageContent(chunk);
      }

      setIsStreaming(false);
    } catch (error) {
      addMessage({
        content: "Sorry, I couldn't process your request. Please try again!",
        role: "system",
      });
      setIsLoading(false);
      setIsStreaming(false);
    }
  }

  return (
    <div className={styles.App}>
      {isLoading && <Loader />}
      <header className={styles.Header}>
        <Lottie className={styles.Logo} animationData={Logo} />
        <h3 className={styles.Title}>AI CHATBOT</h3>
      </header>
      <div className={styles.ChatContainer}>
        <Chat messages={messages} shouldAutoScroll={shouldAutoScroll} />
      </div>
      <Controls
        isDisabled={isLoading || isStreaming}
        onSend={handleContentSend}
      />
    </div>
  );
}

export default App;
