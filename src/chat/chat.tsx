import React, { useEffect, useState, useCallback, useRef, useMemo } from "react";


import * as d3 from "d3";
import ReactMarkdown from "react-markdown";
import { ChatCompletionMessage, OpenAIWrapper } from "../models";
import _, { set } from "lodash";

type MessageID = string;

interface Message extends ChatCompletionMessage {
  id: MessageID;
  content: string;
  length: number; // Length of the message used for circle size
  completedAt: number; // Timestamp, used for vertical positioning
  parent?: MessageID;
  llmName?: string;
}

interface MessageTree {
  [key: string]: Message;
}

interface DendrogramProps {
  messages: MessageTree;
  onHover: (path: MessageID[]) => void;
  onClick: (path: MessageID[]) => void;
  onLeave: () => void;
  lockedIn: MessageID | null
}

interface AIChatState {
  messages: MessageTree;
  currentMessage: MessageID | null;
  lockedIn: MessageID | null;
  inputText: string;
  suggestedResponse: { label: string; content: string } | null;
  waiting: boolean;
  chunks?: string;
  llm: OpenAIWrapper;
}

const sampleTree: MessageTree = {
  message1: {
    id: "message1",
    content: "Hello, how can I assist you?",
    length: 30,
    completedAt: 1633027200,
    role: "assistant",
  },
  message2: {
    id: "message2",
    content: "I need help with my code.",
    length: 25,
    completedAt: 1633027300,
    role: "user",
    parent: "message1",
  },
  message3: {
    id: "message3",
    content: "I have a question about my account.",
    length: 40,
    completedAt: 1633027400,
    role: "user",
    parent: "message1",
  },
  message4: {
    id: "message4",
    content: "Can you recommend a good resource for learning TypeScript?",
    length: 70,
    completedAt: 1633027500,
    role: "user",
    parent: "message1",
  },
  message5: {
    id: "message5",
    content: "Sure, what seems to be the problem?",
    length: 40,
    completedAt: 1633027600,
    role: "assistant",
    parent: "message2",
  },
  message6: {
    id: "message6",
    content: "I can't log in to my account.",
    length: 30,
    completedAt: 1633027700,
    role: "assistant",
    parent: "message3",
  },
  message7: {
    id: "message7",
    content: "I forgot my password.",
    length: 20,
    completedAt: 1633027800,
    role: "assistant",
    parent: "message3",
  },
  message8: {
    id: "message8",
    content:
      "Yes, I recommend the TypeScript Handbook on the official TypeScript website.",
    length: 85,
    completedAt: 1633027900,
    role: "assistant",
    parent: "message4",
  },
  message9: {
    id: "message9",
    content: "Thank you!",
    length: 10,
    completedAt: 1633028000,
    role: "user",
    parent: "message5",
  },
  message10: {
    id: "message10",
    content: "I'll try resetting my password.",
    length: 30,
    completedAt: 1633028100,
    role: "user",
    parent: "message6",
  },
  message11: {
    id: "message11",
    content: "I'll try resetting my password.",
    length: 30,
    completedAt: 1633028200,
    role: "user",
    parent: "message7",
  },
  message12: {
    id: "message12",
    content: "Great, I'll check it out. Thanks!",
    length: 30,
    completedAt: 1633028300,
    role: "user",
    parent: "message8",
  },
};

interface AIChatProps {
  autoRespondSuggester?: (message: Message) => Promise<{ label: string; content: string } | undefined>;
  systemPromptGenerator?: () => { label: string; content?: string };
  llm: OpenAIWrapper;
  llms: Record<string, OpenAIWrapper>;
  defaultInputText?: string;
}

export const AIChat: React.FC<AIChatProps> = ({ autoRespondSuggester, llm: llmDefault, llms = {}, defaultInputText = "", systemPromptGenerator }) => {
  const [state, setState] = useState<AIChatState>({
    messages: {},
    currentMessage: null,
    lockedIn: null,
    inputText: defaultInputText || "",
    suggestedResponse: null,
    waiting: false,
    llm: llmDefault
  });

  const sendCount = useRef(0);
  const llmName = Object.keys(llms).find(k => llms[k] === state.llm) ?? "default";

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const systemPrompt = useMemo(() => (systemPromptGenerator ? systemPromptGenerator() : { label: "You are a helpful assistant" }), [systemPromptGenerator]);

  const send = async (messages: ChatCompletionMessage[]) => {
    const messagesClamped = messages.map(m => ({role: m.role, content: m.content}));
    console.log("Sending", messagesClamped)
    const expectedSendCount = ++sendCount.current;
    const res = await state.llm.createChatCompletion({
      messages: messagesClamped
    }, (chunk) => {
      if (sendCount.current !== expectedSendCount) {
        throw new Error("Chunk arrived on canceled feed")
      }
      setState(state => ({...state, chunks: (state.chunks || "") + chunk}))
    });

    if (sendCount.current !== expectedSendCount) {
      throw new Error("Chunk arrived on canceled feed")
    }
    setState(state => ({...state, chunks: ""}))
    return res;
  };

  async function playUserMessage(newMessageId: MessageID, newMessageIn?: Message) {
    const newMessage = newMessageIn ?? state.messages[newMessageId];
    if (newMessage.role !== "user") {
      throw new Error("Can only replay a user message");
    }

    setState(state => ({...state, waiting: true}))

    try {
      const pathToNewMessage = pathToMessage(newMessage.parent);
      let messageHx = pathToNewMessage.map(m => state.messages[m]).map(({role, content}) => ({role, content}));
      const aiResponse = await send([...(systemPrompt ? [{ role: "system", content: systemPrompt.content ?? systemPrompt.label } as ChatCompletionMessage] : []), ...messageHx, newMessage]);
      await addMessage(aiResponse.content, 'assistant', newMessageId);
      if (autoRespondSuggester) {
        const asChatRespose: Message = {
            ...aiResponse,
            completedAt: Date.now(),
            length: aiResponse.content.length,
            id: Date.now().toString(),
            parent: newMessageId,
            llmName
        }
        const suggestedResponse = await autoRespondSuggester(asChatRespose);
        if (suggestedResponse) {
          setState(state => ({...state, suggestedResponse}));
        }
      }
    } catch (e ) {
      if (e?.message?.includes("canceled")) {
        return;
      }

      console.log("Failed, resetting", state);
      setState(state)
    } finally {
      setState((state) => ({...state, waiting: false}));
    }

  }

  const addMessage = useCallback(
    async (content: string, role: "user" | "assistant", parentId?: MessageID) => {
      const newMessageId = Date.now().toString();
      const newMessage: Message = {
        id: newMessageId,
        content,
        role,
        parent: parentId,
        completedAt: Date.now(),
        length: content.length,
        llmName: role === "assistant" ? llmName : undefined
      };

      setState((state) => ({
        ...state,
        messages: {
            ...state.messages,
            [newMessageId]: newMessage
        },
        currentMessage: newMessageId,
        lockedIn: newMessageId,
        inputText: "",
        waiting: true
      }));

      if (role === 'user') {
        playUserMessage(newMessageId, newMessage)
      }
    },
    [autoRespondSuggester, state.llm, state, systemPrompt]
  );

  const pathToMessage = (messageId?: MessageID | null, messages: MessageTree = state.messages): MessageID[] => {
    let path = [];
    let currentMessage = messageId ? messages[messageId] : null;

    while (currentMessage) {
      path.unshift(currentMessage.id);
      if (currentMessage.parent) {
        currentMessage = messages[currentMessage.parent];
      } else {
        break;
      }
    }
    return path;
  };

  const selectCurrentMessage = useCallback((messageId: MessageID, lock = false) => {
    setState((state) => ({ ...state, currentMessage: messageId, lockedIn: lock ? messageId : state.lockedIn }));
  }, []);

  const handleDendrogramClick = useCallback((path: MessageID[]) => {
    if (path.length > 0) {
      selectCurrentMessage(path.at(-1)!, true);
    }
  }, []);

  const handleDendrogramHover = useCallback((path: MessageID[]) => {
    if (path.length > 0) {
      selectCurrentMessage(path.at(-1)!, false);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setState((state) => ({ ...state, inputText: e.target.value }));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const userMessage = state.inputText.trim();
    if (userMessage) {
      await addMessage(userMessage, 'user', state.currentMessage ?? undefined);
    }
  };

  const handleSuggestedResponse = () => {
    setState((state) => ({
      ...state,
      inputText: `${state.suggestedResponse?.content}\n\n${state.inputText}`.trim(),
      suggestedResponse: null,
    }));
  };

  const clearMessages = () => {
    setState((state) => ({
      ...state,
      messages: {},
      currentMessage: "",
      inputText: defaultInputText || "",
    }));
  };

  const scrollToBottom = useCallback((force: boolean) => {;
    const bottomTarget = _([textAreaRef, messagesEndRef])
      .dropWhile((ref) => !ref?.current)
      .value()
      .at(0);
    if (bottomTarget?.current) {
      const isAlreadyAtBottom = bottomTarget.current?.getBoundingClientRect().bottom <= window.innerHeight + 50;
      if (force || isAlreadyAtBottom) {
        bottomTarget.current.scrollIntoView({block: 'end', behavior: 'instant' });
      }
    }
  }, [])

  useEffect(() => {
    scrollToBottom(true);
  }, [state.currentMessage]);

  useEffect(() => {
    scrollToBottom(false)
  }, [state.chunks]);

  let textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  const setTextAreaRef = useCallback((node: HTMLTextAreaElement) => {
    textAreaRef.current = node;
  }, []);

  const {role: curreMessageRole, parent: currMessageParent} = state.currentMessage ? state.messages[state.currentMessage] ?? {} : {"role": "assistant", parent: null};

  return (
    <div style={{ display: "flex", height: "100%" }}>
      <div style={{ flexGrow: 1, flexShrink: 1, overflowY: 'scroll'}}>
        <div className="ai-chat-messages">
          
          <div className="ai-chat-message system">
            System: <ReactMarkdown>{systemPrompt.label}</ReactMarkdown>
          </div>
          {pathToMessage(state.currentMessage).map((messageId) => (
            <div key={messageId} className={`ai-chat-message ${state.messages[messageId].role}`}>
              {state.messages[messageId].llmName && <small>{state.messages[messageId].llmName}</small>}<ReactMarkdown >{state.messages[messageId].content}</ReactMarkdown>
            </div>
          ))}
        </div>
        {state.chunks && <div className="ai-chat-message assistant">
            <small>{llmName}</small><ReactMarkdown>{state.chunks}</ReactMarkdown></div>}
        {curreMessageRole === "assistant" && 
        <form onSubmit={handleSubmit} className="ai-chat-input" style={{ width: '100%', display: "flex" }}>
          <textarea
            ref={setTextAreaRef}
            style={{ flex: 1 }}
            value={state.inputText}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Type your message... (Ctrl+Enter to send)"
            rows={3}
          />
          <button disabled={state.waiting} type="submit">Send</button>
          {currMessageParent && <button disabled={state.waiting} onClick={() => {
            setState(state => ({...state, currentMessage: currMessageParent!, lockedIn: currMessageParent!}))
            playUserMessage(currMessageParent)

          }}>Again</button>}

          {state.suggestedResponse && (
            <button disabled={state.waiting} type="button" onClick={handleSuggestedResponse}>
              {state.suggestedResponse.label}
            </button>
          )}
        </form>}
        {curreMessageRole === "user" && (<><button onClick={() => {
          setState(state => ({
            ...state,
            inputText: state.messages[state.currentMessage!].content!,
            currentMessage: currMessageParent!,
            lockedIn: currMessageParent!}))
        }}>Edit</button>
        {state.waiting && <button onClick={() => {
          sendCount.current++
          setState(state => ({
            ...state,
            waiting: false,
            chunks: "",
            inputText: state.messages[state.currentMessage!].content!,
            currentMessage: currMessageParent!,
            lockedIn: currMessageParent!}))
          }}> Cancel</button>}</>)
      }
            <select value={llmName} style={{width: '100%'}} onChange={(e) => {
              const selectedLLM = e.target.value;
              
              setState(state => ({
                ...state, 
                llm: llms[selectedLLM]
              }));
            }}>
              {Object.keys(llms).map((key) => (
                <option  value={key}>{key}</option>
              ))}
            </select>
          <div ref={messagesEndRef} />
      </div>
      <div style={{ flexBasis: "100px", flexGrow: 0, flexShrink: 0, overflow: "clip" }}>
        <ConversationDendrogramMemo
          messages={state.messages}
          onHover={handleDendrogramHover}
          onClick={handleDendrogramClick}
          onLeave={() => selectCurrentMessage(state.currentMessage!, false)}
          lockedIn={state.lockedIn}
        />
        {/* <button onClick={clearMessages}>Clear</button> */}
      </div>
    </div>
  );
};

interface DendriteTree {
  data: Message | null;
  children: DendriteTree[];
}

export const ConversationDendrogram: React.FC<DendrogramProps> = ({
  messages,
  onHover,
  onClick,
  onLeave,
  lockedIn
}) => {
  const [ref, setRefState] = useState(null);
  const [dimensions, setDimensions] = useState({ width: 300, height: 600 });

  const setRef = useCallback((node) => {
    if (node) {
      setRefState(node);
      setDimensions({
        width: node.clientWidth,
        height: node.clientHeight,
      });
    }
  }, []);

  const resizeObserver = useMemo(() => {
    const ro = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        setDimensions({ width, height });
      }
    })
    return ro
  }, [])

  useEffect(() => {
    if (!ref || !resizeObserver) {
      return;
    }

    resizeObserver.observe(ref);
    return () => {
      resizeObserver.unobserve(ref);
    };

  }, [resizeObserver, ref])

  useEffect(() => {
    if (!ref) return;

    const svg = d3.select(ref);
    svg.selectAll("*").remove(); // Clear previous SVG contents

    const minPadding = 5;
    const nodeSizeRatio = 0.1; // Adjust this value to change node sizes

    const maxNodeRadius = Math.min(dimensions.width, dimensions.height) * nodeSizeRatio;
    const padding = {
      top: Math.max(maxNodeRadius, minPadding),
      bottom: Math.max(maxNodeRadius, minPadding),
      left: Math.max(maxNodeRadius, minPadding),
      right: Math.max(maxNodeRadius, minPadding),
    };
    const effectiveWidth = dimensions.width - padding.left - padding.right;
    const effectiveHeight = dimensions.height - padding.top - padding.bottom;

    // Prepare data and layout
    const rootNode: DendriteTree = {
      data: null,
      children: [],
    };
    addChildren(rootNode, messages);

    const root = d3.hierarchy(rootNode, (d) => d.children);
    const treeLayout = d3.tree().size([effectiveWidth, effectiveHeight]);
    treeLayout(root as d3.HierarchyNode<any>);

    // Define links and nodes
    const _nodes = svg
      .selectAll("circle.node")
      .data(root.descendants())
      .enter()
      .append("circle")
      .classed("node", true)
      .classed("user", (d) => d.data.data?.role === "user")
      .classed("assistant", (d) => d.data.data?.role === "assistant")
      .classed("locked", (d) => d.data.data?.id === lockedIn)
      .attr("cx", (d) => d.x! + padding.left)
      .attr("cy", (d) => d.y! + padding.top)
      .attr("r", (d) => Math.min(Math.sqrt(d.data.data?.content?.length ?? 0), maxNodeRadius))
      .attr("node-locked", (d) => d.data.data?.id === lockedIn)
      .attr("node-id", (d) => d.data.data?.id ?? "ROOT");

    const linkGenerator = d3
      .linkVertical()
      .x((d) => d.x! + padding.left)
      .y((d) => d.y! + padding.top);

    svg
      .selectAll("path.link")
      .data(root.links())
      .enter()
      .append("path")
      .classed("link", true)
      .classed("user", (d) => d.target.data.data?.role === "user")
      .classed("assistant", (d) => d.target.data.data?.role === "assistant")
      .attr("d", linkGenerator)
      .attr("fill", "none")
      .attr(
        "link-id",
        (d) =>
          `${d.target.data.data?.id ?? "ROOT"}-${d.source.data.data?.id ?? "ROOT"}`
      ); // Set link-id attribute

    // Interaction logic
    svg
      .on("mousemove", (event) => {
        const [mx, my] = d3.pointer(event);
        const closestNode = findClosestNode(mx, my);
        if (closestNode) {
          highlightPath(closestNode);
          onHover(findPath(closestNode));
        }
      })
      .on("click", (event) => {
        const [mx, my] = d3.pointer(event);
        const closestNode = findClosestNode(mx, my);
        if (closestNode) {
          onClick(findPath(closestNode));
        }
      })
      .on("mouseleave", () => {
        clearHighlights(); // Assuming you have a function to remove highlights
        onLeave?.();         // Assuming you have a function to handle when mouse leaves the SVG
      });

    function findClosestNode(mx, my) {
      let minDist = Infinity;
      let closestNode = null;
      root.descendants().forEach((d) => {
        const dx = d.x + padding.left - mx;
        const dy = d.y + padding.top - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < minDist) {
          minDist = dist;
          closestNode = d;
        }
      });
      return closestNode;
    }

    function highlightPath(d: d3.HierarchyPointNode<DendriteTree> | null) {
      // Clear existing highlights
      clearHighlights();
      // Highlight the path to the root
      let current = d;
      while (current) {
        svg
          .select(`circle[node-id='${current.data.data?.id ?? "ROOT"}']`)
          .classed("highlighted", true);

        if (current.parent) {
          svg
            .select(
              `path[link-id='${current.data.data?.id ?? "ROOT"}-${current.parent.data.data?.id ?? "ROOT"}']`
            )
            .classed("highlighted", true);
        }
        current = current.parent;
      }
      svg.selectAll(".node").order();
      svg.selectAll(".node.highlighted").raise();

      // Bring highlighted links to the front
      svg.selectAll(".link").order();
      svg.selectAll(".link.highlighted").raise();
    }

    function clearHighlights() {
      svg.selectAll(".highlighted").classed("highlighted", false);
      svg.selectAll("circle").style("stroke", null);
      svg.selectAll("circle").style("z-index", null);
      svg.selectAll("path").style("stroke", null); // Clear stroke for paths
    }

    function findPath(d: d3.HierarchyPointNode<DendriteTree> | null) {
      const path = [];
      let current = d;
      while (current?.parent) {
        path.unshift(current.data.data?.id ?? "ROOT");
        current = current.parent;
      }
      path.unshift(current.data.data?.id ?? "ROOT"); // Include root
      return path;
    }

    function addChildren(node: DendriteTree, messages: MessageTree) {
      Object.values(messages).forEach((msg) => {
        if (msg.parent === node?.data?.id || (!msg.parent && !node?.data?.id)) {
          const childNode = { data: msg, children: [] };
          node.children.push(childNode);
          addChildren(childNode, messages);
        }
      });
    }
  }, [messages, dimensions, lockedIn, onHover, onClick, ref]);

  return (
    <svg
      ref={setRef}
      width="100%"
      height="100%"
      style={{ border: "0px" }}
    ></svg>
  );
};

const ConversationDendrogramMemo = React.memo(ConversationDendrogram)