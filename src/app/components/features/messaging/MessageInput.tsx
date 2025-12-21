import { useState } from "react";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { Icon } from "@iconify/react";

interface MessageInputProps {
  onSend: (message: string) => void;
  onUpload?: () => void;
}

const MessageInput = ({ onSend, onUpload }: MessageInputProps) => {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim()) {
      onSend(message.trim());
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex items-center bg-white gap-3 p-4 rounded-b-4xl">
      <div className="flex-1 relative">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Écrivez un message"
          className="pr-12 rounded-full border border-gray-400 placeholder:text-blue-900 bg-white"
        />
        <button
          onClick={onUpload}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <Icon icon={"mdi:image-plus"} className="h-5 w-5 text-blue-900" />
        </button>
      </div>

      <Button
        onClick={handleSend}
        className="rounded-full text-white px-6 gap-2 bg-blue-900 hover:bg-blue-900/90"
      >
        <Icon icon={"mdi:send"} className="h-4 w-4" />
        <span className="hidden md:inline">Envoyer</span>
      </Button>
    </div>
  );
};

export default MessageInput;
