import { useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { MessageCircleQuestion, RotateCcw, X } from "lucide-react";

import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";

const STORAGE_KEY = "hygi-help-chat";

const SUGGESTIONS = [
  "What is a passkey?",
  "How do I spot a phishing email?",
  "Which lesson should I start with?",
];

function readStored(): UIMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as UIMessage[]) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function messageText(message: UIMessage) {
  return message.parts
    .map((part) => (part.type === "text" ? part.text : ""))
    .join("")
    .trim();
}

function ChatPanel({
  initialMessages,
  onClose,
  panelId,
}: {
  initialMessages: UIMessage[];
  onClose: () => void;
  panelId: string;
}) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const { messages, sendMessage, status, setMessages, error } = useChat({
    id: "hygi-help",
    messages: initialMessages,
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });
  const busy = status === "submitted" || status === "streaming";

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      /* storage unavailable */
    }
  }, [messages]);

  useEffect(() => {
    if (!busy) textareaRef.current?.focus();
  }, [busy]);

  // Escape closes the panel; Tab cycles within it so keyboard users never get lost.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.stopPropagation();
        onClose();
        return;
      }
      if (event.key !== "Tab") return;
      const panel = panelRef.current;
      if (!panel) return;
      const focusables = Array.from(
        panel.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((el) => el.offsetParent !== null);
      if (focusables.length === 0) return;
      const first = focusables[0]!;
      const last = focusables[focusables.length - 1]!;
      const active = document.activeElement as HTMLElement | null;
      if (event.shiftKey && (active === first || !panel.contains(active))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    }
    const panel = panelRef.current;
    panel?.addEventListener("keydown", onKeyDown);
    return () => panel?.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  function ask(text: string) {
    const trimmed = text.trim();
    if (!trimmed || busy) return;
    setInput("");
    void sendMessage({ text: trimmed });
  }

  return (
    <div
      ref={panelRef}
      id={panelId}
      role="dialog"
      aria-modal="false"
      aria-labelledby={`${panelId}-title`}
      aria-describedby={`${panelId}-desc`}
      className="flex h-[min(34rem,calc(100dvh-7rem))] w-[min(24rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-2xl"
    >
      <div className="flex items-center justify-between gap-2 border-b border-border/60 px-4 py-3">
        <div>
          <h2 id={`${panelId}-title`} className="text-sm font-semibold tracking-tight">
            Hygi Helper
          </h2>
          <p id={`${panelId}-desc`} className="text-xs text-muted-foreground">
            Lessons, glossary &amp; cyber hygiene guide
          </p>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => {
              setMessages([]);
              try {
                window.localStorage.removeItem(STORAGE_KEY);
              } catch {
                /* storage unavailable */
              }
            }}
            className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            aria-label="Start a new conversation"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            aria-label="Close help chat"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      <Conversation className="flex-1" aria-label="Help chat transcript">
        <ConversationContent className="gap-3 p-4">
          {messages.length === 0 ? (
            <div className="text-sm text-muted-foreground">
              <p>
                Hi! Ask me anything about the Hygi. lessons, a glossary term, or the cyber hygiene
                guide.
              </p>
              <div
                role="group"
                aria-label="Suggested questions"
                className="mt-3 flex flex-col items-start gap-2"
              >
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => ask(s)}
                    className="rounded-full border border-border px-3 py-1.5 text-left text-xs text-foreground transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {messages.map((message) => (
            <Message from={message.role} key={message.id}>
              <MessageContent>
                <span className="sr-only">
                  {message.role === "user" ? "You said:" : "Hygi Helper said:"}
                </span>
                <MessageResponse>{messageText(message)}</MessageResponse>
              </MessageContent>
            </Message>
          ))}

          <div role="status" aria-live="polite" className="contents">
            {status === "submitted" ? <Shimmer className="text-sm">Thinking…</Shimmer> : null}
            {error ? (
              <p className="text-sm text-destructive">
                Something went wrong reaching the helper. Please try again in a moment.
              </p>
            ) : null}
          </div>
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <div className="border-t border-border/60 p-3">
        <PromptInput
          onSubmit={(_message, event) => {
            event.preventDefault();
            ask(input);
          }}
        >
          <PromptInputTextarea
            ref={textareaRef}
            value={input}
            onChange={(event) => setInput(event.currentTarget.value)}
            placeholder="Ask about a lesson or term…"
            aria-label="Ask the Hygi Helper a question"
            aria-describedby={`${panelId}-hint`}
          />
          <p id={`${panelId}-hint`} className="sr-only">
            Press Enter to send, Shift plus Enter for a new line, Escape to close the chat.
          </p>
          <PromptInputFooter className="justify-end">
            <PromptInputSubmit status={status} disabled={!input.trim() && !busy} />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </div>
  );
}

/** Floating help assistant, scoped to Hygi. course content, glossary and the guide. */
export function HelpChat() {
  const [open, setOpen] = useState(false);
  const [initialMessages, setInitialMessages] = useState<UIMessage[] | null>(null);
  const toggleRef = useRef<HTMLButtonElement | null>(null);
  const panelId = "hygi-help-panel";

  useEffect(() => {
    setInitialMessages(readStored());
  }, []);

  function closePanel() {
    setOpen(false);
    toggleRef.current?.focus();
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3 print:hidden">
      {open && initialMessages ? (
        <ChatPanel initialMessages={initialMessages} onClose={closePanel} panelId={panelId} />
      ) : null}
      <button
        type="button"
        ref={toggleRef}
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls={panelId}
        aria-haspopup="dialog"
        aria-label={open ? "Close help chat" : "Open help chat"}
        className="flex h-14 w-14 min-h-14 min-w-14 items-center justify-center rounded-full text-primary-foreground transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        style={{ background: "var(--gradient-hero)", boxShadow: "var(--shadow-glow)" }}
      >
        {open ? (
          <X className="h-6 w-6" aria-hidden="true" />
        ) : (
          <MessageCircleQuestion className="h-6 w-6" aria-hidden="true" />
        )}
      </button>
    </div>
  );
}