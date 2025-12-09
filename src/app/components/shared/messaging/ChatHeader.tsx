import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/components/ui/avatar";

interface ChatHeaderProps {
  name: string;
  avatar?: string;
  isTyping?: boolean;
}

const ChatHeader = ({ name, avatar, isTyping = false }: ChatHeaderProps) => {
  return (
    <div className="flex items-center bg-white gap-3 rounded-t-4xl p-4 border-b border-border">
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
  );
};

export default ChatHeader;
