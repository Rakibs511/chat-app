"use client";
import { useEffect, useState, useTransition, useRef } from "react";
import { io } from "socket.io-client";

const socket = io("http://192.168.1.109:4000");
export default function Home() {
  const [msg, setMsg] = useState<string | null>(null);
  const [msgElement, setMsgElement] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();
  const refScrollBottom = useRef<HTMLDivElement>(null);

  //   send msg with type delay
  //   useEffect(() => {
  //     const test = setTimeout(() => {
  //       // msg && setMsgElement((prev) => (prev = [...prev, msg]));
  //       msg && socket.emit("send_message", msg);
  //     }, 1000);
  //     return () => clearTimeout(test);
  //   }, [msg]);

  useEffect(() => {
    refScrollBottom?.current?.scrollIntoView();
  }, [msgElement]);

  const sendMsgHandle = () => {
    try {
      socket.emit("send_message", msg);
      setMsg("");
    } catch (error: any) {
      console.log(error);
    }
  };
  useEffect(() => {
    socket.on("received_message", (data) => {
      setMsgElement((prev) => (prev = [...prev, data]));
    });
    return () => {
      socket.off("received_message");
    };
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center pb-16 scroll-smooth">
      <div className="sticky top-0 min-w-full backdrop-blur-md flex flex-col items-center">
        <h1 className="text-5xl p-3">🟢 Live Chat</h1>
      </div>
      <div className="flex justify-center space-x-2 fixed bottom-0 pb-3 min-w-full backdrop-blur-md">
        <input
          className="text-black  p-3  rounded-md border-r-4"
          type="text"
          value={msg ? msg : ""}
          placeholder="Enter a message"
          onChange={(e) => setMsg(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMsgHandle()}
        />

        <button
          className="bg-slate-500 hover:bg-slate-400 p-3 rounded-md"
          onClick={sendMsgHandle}
        >
          Send
        </button>
      </div>
      <div className="p-5 w-[500px] text-left">
        {msgElement?.map((msg, index) => {
          return <Message key={index} content={msg} />;
        })}
        <div ref={refScrollBottom} />
      </div>
    </main>
  );
}

const Message = ({ content }: { content: string }) => {
  return (
    <div className="flex justify-start text-left items-center bg-slate-500 h-fit w-fit p-6 rounded-xl mb-3">
      <p>{content}</p>
    </div>
  );
};
