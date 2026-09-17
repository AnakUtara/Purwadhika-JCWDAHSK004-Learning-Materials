import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { Bubble, BubbleContent } from "./components/ui/bubble"
import api from "./lib/axios"
import { AxiosError } from "axios"

export function App() {
  const { messages, status, sendMessage } = useChat({
    transport: new DefaultChatTransport({
      api: `${import.meta.env.VITE_API_URL}/sessions/84a42769-2663-491d-ba4e-53472c4338a2/messages`,
    }),
  })

  const [input, setInput] = useState("")

  const [existingMessages, setExistingMessages] = useState<
    {
      id: string
      sessionId: string
      content: string
      role: string
    }[]
  >([])

  const fetchExistingMessages = async () => {
    try {
      const res = await api.get(
        `/sessions/84a42769-2663-491d-ba4e-53472c4338a2/messages`
      )

      const { data } = res.data

      setExistingMessages(data)
    } catch (error: unknown) {
      console.error(
        "fetch messages error: ",
        error instanceof AxiosError
          ? error.response?.data?.message
          : (error as Error).message
      )
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchExistingMessages()
  }, [])

  return (
    <main className="flex min-h-screen flex-col gap-4 p-24">
      {existingMessages.length > 0
        ? existingMessages.map((message) => (
            <Bubble
              key={message.id}
              variant={message.role === "user" ? "default" : "muted"}
              align={message.role === "user" ? "end" : "start"}
            >
              <BubbleContent>{message.content}</BubbleContent>
            </Bubble>
          ))
        : null}
      {messages.length > 0
        ? messages.map((message) => (
            <Bubble
              key={message.id}
              variant={message.role === "user" ? "default" : "muted"}
              align={message.role === "user" ? "end" : "start"}
            >
              <BubbleContent>
                {message.parts.map((part, index) =>
                  part.type === "text" ? (
                    <span key={index}>{part.text}</span>
                  ) : null
                )}
              </BubbleContent>
            </Bubble>
          ))
        : null}
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
          disabled={status != "ready"}
          placeholder="Say something..."
          className={"w-full px-4 py-2"}
        />
        <Button className={"w-full"} type="submit" disabled={status != "ready"}>
          Submit
        </Button>
      </form>
    </main>
  )
}

export default App
