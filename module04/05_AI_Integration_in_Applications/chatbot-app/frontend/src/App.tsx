import { Button } from "@/components/ui/button"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { useState } from "react"

export function App() {
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: `${import.meta.env.VITE_API_URL}/sessions/9262d525-dd87-4cea-a33f-19dd29638ef7/messages`,
    }),
  })
  const [input, setInput] = useState("")

  return (
    <>
      {messages.map((message) => (
        <div key={message.id}>
          {message.role === "user" ? "User: " : "AI: "}
          {message.parts.map((part, index) =>
            part.type === "text" ? <span key={index}>{part.text}</span> : null
          )}
        </div>
      ))}

      <form
        onSubmit={(e) => {
          e.preventDefault()
          if (input.trim()) {
            sendMessage({ text: input })
            setInput("")
          }
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={status !== "ready"}
          placeholder="Say something..."
        />
        <Button type="submit" disabled={status !== "ready"}>
          Submit
        </Button>
      </form>
    </>
  )
}

export default App
