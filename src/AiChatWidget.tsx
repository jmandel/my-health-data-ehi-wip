import React, { useState, useRef, useEffect, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import { OpenAIWrapper } from './models';


interface Message {
  content: string;
  role: 'user' | 'assistant' | 'system';
}

interface AIChatProps {
  autoRespondSuggester?: (message: Message) => Promise<{label: string, content: string} | undefined>;
  systemPromptGenerator?: () => {label: string, content?: string};
  llm: OpenAIWrapper;
  defaultInputText?: string;
}

const AIChat: React.FC<AIChatProps> = ({ autoRespondSuggester, llm, defaultInputText = "", systemPromptGenerator}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState(defaultInputText || "");
  const [suggestedResponse, setSuggestedResponse] = useState<{label: string, content: string} | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [waiting, setWaiting] = useState(false);

  const systemPrompt = useMemo(() => (isOpen && systemPromptGenerator) ? systemPromptGenerator() : {label: "You are a helpful assistant"}, [isOpen, systemPromptGenerator])
  console.log("SYSP", systemPrompt)
  const send = async (messages: Message[]) => {
    const res = await llm.createChatCompletion({
      messages
    });
    return res
  }
  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
  };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const userMessage = inputText.trim();
    if (userMessage) {
      const newMessage: Message = { content: userMessage, role: 'user' };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setInputText('');
      setWaiting(true)

      try {
        const aiResponse =  await  send([...(systemPrompt ? [{role: "system", content: systemPrompt.content ?? systemPrompt.label} as Message] : []), ...messages, newMessage]);
        console.log("AI Response", aiResponse)
        setMessages((prevMessages) => [...prevMessages, aiResponse]);
      // Generate suggested response
      if (autoRespondSuggester) {
        const suggestedReply = await autoRespondSuggester(aiResponse);
        if (suggestedReply)  {
          setSuggestedResponse(suggestedReply);
        }
      }

      } catch {
        console.log("Failed, restting", messages);
        setInputText(userMessage)
        setMessages(prevMessages => {
          console.log("Prev", prevMessages)
          return prevMessages.slice(0, -1)
        });
      } finally {
        setWaiting(false)
      }
    }
  };

  const handleSuggestedResponse = () => {
    setInputText((inputText) => `${suggestedResponse?.content}\n\n${inputText}`.trim());
    setSuggestedResponse(null);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function clearMessages() {
    setMessages([]);
    setInputText(defaultInputText || "" )
  }

  return (
    <>
      <button style={{position: 'fixed', top: 0, right: 0}} onClick={toggleDrawer}>AI Chat</button>
      <div
        className={`ai-chat-drawer ${isOpen ? 'open' : ''}`}
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: '900px',
          height: '100%',
          overflowY: 'scroll',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'white',
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
          transition: 'transform 0.1s ease-in-out',
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          zIndex: 1000,
        }}
      >
        <div className="ai-chat-header">
          <h3>AI Chat
            <button onClick={toggleDrawer}>Close</button>
            <button onClick={clearMessages}>Clear</button>
          </h3>
        </div>
        <div className="ai-chat-messages">
          <div className="ai-chat-message system">
            System: <ReactMarkdown>{systemPrompt.label}</ReactMarkdown>
          </div>
          {messages.map((message, index) => (
            <div
              key={index}
              className={`ai-chat-message ${message.role}`}
            >
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>
          ))}

          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={handleSubmit} className="ai-chat-input"
            style={{width: '100%', display: "flex"}} >
          <textarea
          style={{flex: 1}}
            value={inputText}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Type your message... (Ctrl+Enter to send)"
            rows={3}
          />

          {suggestedResponse && (
            <button disabled={waiting} type="button" onClick={handleSuggestedResponse}>
              {suggestedResponse.label}
            </button>
          )}
          <button  disabled={waiting} type="submit">Send</button>
        </form>
      </div>
    </>
  );
};

export default AIChat;