import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/components/ui/avatar";
import { Icon } from "@iconify/react";

interface ChatHeaderProps {
  name: string;
  avatar?: string;
  isTyping?: boolean;
  onBack?: () => void;
}

const ChatHeader = ({
  name,
  avatar,
  isTyping = false,
  onBack,
}: ChatHeaderProps) => {
  return (
    <div className="flex justify-between items-center bg-white gap-3 rounded-t-4xl p-4 border-b border-border">
      <div className="flex ">
        <Avatar className="h-10 w-10">
          <AvatarImage src={avatar} alt={name} />
          <AvatarFallback className="bg-gray-500 text-gray-800">
            {name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold text-gray-800">{name}</p>
          {isTyping && (
            <p className="text-sm text-green-500 font-medium">
              {"en train d'écrire"}
            </p>
          )}
        </div>
      </div>
      {onBack && (
        <button
          onClick={onBack}
          className=" text-blue-600 border-blue-900 bg-white rounded-full p-2 hover:bg-gray-100 transition"
        >
          <Icon icon={"mdi:arrow-left"} className="h-6 w-6" />
        </button>
      )}
    </div>
  );
};

export default ChatHeader;
