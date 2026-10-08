import { useEffect, useRef, useState } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "./components/ui/card";
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "./components/ui/empty";
import { Scroll, User } from "lucide-react";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "./components/ui/input-group";
import { Textarea } from "./components/ui/textarea";
import { Button } from "./components/ui/button";
import { ScrollArea } from "./components/ui/scroll-area";
import { chatSchema, type ChatMessage } from "./validations/chat.validation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "./lib/utils";
import { io, Socket } from "socket.io-client";
import { toast } from "sonner";
import { formatDateForDisplay } from "./helpers/date.formatter";
import type { ISocketResponse } from "./types/socket-response.type";

function App() {
	const [socket, setSocket] = useState<Socket | null>(null);

	const [isConnected, setIsConnected] = useState<boolean>(false);

	const [chatMessages, setChatMessages] = useState<
		(ChatMessage & { id: string })[]
	>([]);

	// Untuk memastikan bahwa setiap kali ada pesan baru,
	// area scroll akan otomatis bergulir ke bawah untuk menampilkan pesan terbaru.
	const scrollRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (scrollRef.current) {
			scrollRef.current.scrollIntoView({ behavior: "smooth" });
		}
	}, [chatMessages]);

	useEffect(() => {
		const newSocket = io(import.meta.env.VITE_BASE_API_URL, {
			transports: ["websocket"],
		});

		newSocket.on("connect", () => {
			console.log(`Connected to server with id: ${newSocket.id}`);
			setSocket(newSocket);
			setIsConnected(true);

			toast.success("Handshake success!");
		});

		newSocket.on("connect_error", (err) => {
			console.error(err.message);
			toast.error("Handshake failed!");
			setIsConnected(false);
		});

		return () => {
			newSocket.disconnect();
		};
	}, []);

	useEffect(() => {
		if (!socket) return;

		socket?.on("message-received", (data: ChatMessage & { id: string }) => {
			setChatMessages((prev) => [...prev, data]);
		});

		return () => {
			socket.off("messsage-received");
		};
	}, [socket]);

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<ChatMessage>({
		defaultValues: {
			sender: "",
			content: "",
			timestamp: new Date(),
		},
		resolver: zodResolver(chatSchema),
	});

	const submitHandler = (data: ChatMessage) => {
		//emit message-sent event to send chat data to server
		socket?.emit("message-sent", data, (res: ISocketResponse) => {
			if (res.status === "ok") {
				toast.success(res.message);
				reset({ ...data, content: "" });
			} else {
				toast.error(res.message);
				console.error(res.message);
			}
		});
	};

	return (
		<div className="container mx-auto flex justify-center items-center min-h-screen px-8">
			<div className="w-full md:w-1/2">
				<Card className="px-4">
					<CardHeader className="p-0">
						<CardTitle>Chit Chat!</CardTitle>
						<CardDescription>
							Start chatting with your friends now!
						</CardDescription>
					</CardHeader>
					<CardContent
						className={cn(
							"border-neutral-100 border min-h-72",
							!chatMessages.length && "flex items-center justify-center",
						)}
					>
						{!chatMessages.length ? (
							<Empty>
								<EmptyHeader>
									<EmptyMedia variant="icon">
										<Scroll />
									</EmptyMedia>
									<EmptyTitle>No Chat Yet</EmptyTitle>
									<EmptyDescription>
										No chat conversations yet. Start a new conversation to see
										it here!
									</EmptyDescription>
								</EmptyHeader>
							</Empty>
						) : (
							<ScrollArea className="h-72 pr-4">
								<div className="flex flex-col gap-4 py-4">
									{chatMessages.map((msg, index) => {
										const isMe = msg.id === socket?.id; // mengacu pada id socket saat ini untuk menentukan apakah pesan tersebut dikirim oleh pengguna/browser saat ini atau bukan
										// Ke depannya di production grade chat app, isMe bisa diubah menjadi isSender,
										// yang mana akan mengacu pada userId yang unik untuk setiap pengguna,
										// bukan id socket.
										// Karena id socket akan berubah setiap kali pengguna melakukan refresh halaman,
										// sehingga tidak bisa dijadikan acuan untuk menentukan apakah pesan tersebut dikirim oleh pengguna saat ini atau bukan.
										return (
											<div
												key={index}
												className={cn(
													"flex flex-col w-full",
													isMe ? "items-end" : "items-start", // Jika pesan dikirim oleh pengguna saat ini, maka akan ditempatkan di sisi kanan (items-end), jika tidak, maka akan ditempatkan di sisi kiri (items-start)
												)}
											>
												{/* Metadata: Name and Time */}
												<div className="flex gap-2 text-xs text-muted-foreground mb-1">
													<span className="font-bold">{msg.sender} | </span>
													<span>
														{formatDateForDisplay(new Date(msg.timestamp))}
													</span>
												</div>

												{/* The Bubble */}
												<div
													className={cn(
														"px-3 py-2 rounded-lg max-w-[80%] text-sm",
														isMe
															? "bg-primary text-primary-foreground rounded-tr-none"
															: "bg-muted rounded-tl-none",
													)}
												>
													{msg.content}
												</div>
												<div ref={scrollRef} />
											</div>
										);
									})}
								</div>
							</ScrollArea>
						)}
					</CardContent>
					<CardFooter className="px-0">
						<form
							onSubmit={handleSubmit(submitHandler)}
							className="w-full flex flex-col gap-4"
						>
							<InputGroup>
								<InputGroupInput
									id="sender"
									placeholder="Type your name here..."
									{...register("sender")}
									disabled={!isConnected}
								/>
								<InputGroupAddon>
									<User />
								</InputGroupAddon>
							</InputGroup>
							{errors.sender && (
								<span className="text-red-500 text-xs">
									{errors.sender.message}
								</span>
							)}
							<Textarea
								id="content"
								placeholder="Type your message here..."
								{...register("content")}
								disabled={!isConnected}
							/>
							{errors.content && (
								<span className="text-red-500 text-xs">
									{errors.content.message}
								</span>
							)}
							<Button type="submit" className="w-full" disabled={!isConnected}>
								Send
							</Button>
						</form>
					</CardFooter>
				</Card>
			</div>
		</div>
	);
}

export default App;
