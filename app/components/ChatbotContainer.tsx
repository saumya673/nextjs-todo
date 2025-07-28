"use client";

import { useState, useRef, useEffect } from "react";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { DynamicStructuredTool } from "@langchain/core/tools";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { z } from "zod";
import {
  BaseMessage,
  MessageContent,
  isBaseMessage,
} from "@langchain/core/messages";

export function getStringMessageContent(
  input: MessageContent | BaseMessage
): string {
  const content = isBaseMessage(input) ? input.content : input;
  return typeof content === "string" ? content : JSON.stringify(content);
}

type Message = { from: "user" | "bot"; text: string };

interface ChatbotContainerProps {
  addTask: (todo: string) => void;
}

export default function ChatbotContainer({ addTask }: ChatbotContainerProps) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const panelRef = useRef<HTMLDivElement>(null);

  // set up the tool that will call your addTask prop
  const addTodoTool = new DynamicStructuredTool({
    name: "addTodo",
    description: "Adds a todo to the list",
    schema: z.object({
      todo: z.string().describe("the text of the task to add"),
    }),
    func: async ({ todo }) => {
      // call the parent’s setTasks
      addTask(todo);
      // you can return a confirmation message
      return `✅ Added “${todo}” to your list.`;
    },
  });

  const toggle = () => setOpen((o) => !o);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text) return;
    setMessages((m) => [...m, { from: "user", text }]);
    setInput("");

    // invoke Gemini plus our custom tool
    const googleClient = new ChatGoogleGenerativeAI({
      model: "gemini-2.5-flash",
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY!,
    });

    const agent = createReactAgent({
      llm: googleClient,
      tools: [addTodoTool],
    });

    const response = await agent.invoke({
      messages: [{ role: "user", content: text }],
    });
    const last = response.messages.at(-1);
    console.log("Response messages:", response.messages);
    console.log("Response message type:", typeof response.messages);
    const bot = JSON.stringify(last?.content);
    const botText = last ? getStringMessageContent(last) : "(no reply)";
    setMessages((m) => [
      ...m,
      {
        from: "bot",
        text: bot,
      },
    ]);
  };

  // click‑outside to close
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (
        open &&
        panelRef.current &&
        !panelRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  return (
    <div className="fixed bottom-4 right-4 flex flex-col items-end">
      {open && (
        <div
          ref={panelRef}
          className="w-72 h-96 bg-white rounded-lg shadow-lg flex flex-col overflow-hidden mb-2"
        >
          <div className="bg-pink-500 text-white px-4 py-2">Chatbot</div>
          <div className="flex-1 p-2 space-y-1 overflow-y-auto">
            {messages.map((m, i) => (
              <div
                key={i}
                className={m.from === "user" ? "text-right" : "text-left"}
              >
                <span
                  className={`inline-block px-2 py-1 rounded ${
                    m.from === "user" ? "bg-pink-100" : "bg-pink-200"
                  }`}
                >
                  {m.text}
                </span>
              </div>
            ))}
          </div>
          <div className="flex border-t border-pink-200">
            <input
              className="flex-1 px-2 py-1 focus:outline-none"
              placeholder="Type..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              onClick={sendMessage}
              className="px-3 bg-pink-500 text-white rounded-r"
            >
              Send
            </button>
          </div>
        </div>
      )}

      <button
        onClick={toggle}
        aria-label="Toggle Chatbot"
        className="w-12 h-12 rounded-full bg-pink-500 text-white flex items-center justify-center shadow-lg hover:bg-pink-600"
      >
        💬
      </button>
    </div>
  );
}
