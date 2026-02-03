import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/components/ui/avatar";
import { cn } from "@/app/lib/utils";
import { Conversation } from "@/app/types/chat";

interface ConversationItemProps {
  conversation: Conversation;
  isActive?: boolean;
  onClick?: () => void;
}

const ConversationItem = ({
  conversation,
  isActive,
  onClick,
}: ConversationItemProps) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 bg-white p-3 rounded-lg cursor-pointer transition-colors",
        isActive ? "bg-accent" : "hover:bg-accent/50",
      )}
    >
      <Avatar className="h-12 w-12 shrink-0">
        <AvatarImage
          src={conversation.recipient.avatar}
          alt={conversation.recipient.name}
        />
        <AvatarFallback className="bg-muted text-slate-400">
          {conversation.recipient.name.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-800 truncate">
          {conversation.recipient.name}
        </p>
        {conversation.is_typing ? (
          <p className="text-sm text-green-500 font-medium">
            {"en train d'écrire"}
          </p>
        ) : (
          <p className="text-sm text-gray-500 truncate">
            {conversation.last_message?.content}
          </p>
        )}
      </div>

      <div className="flex flex-col items-end gap-1 shrink-0">
        <span className="text-xs text-slate-400">
          {conversation.last_message_at}
        </span>
        {conversation.unread_count > 0 ? (
          <span className="flex items-center justify-center h-5 min-w-5 px-1.5 rounded-full bg-orange-500 text-white text-xs font-medium">
            {conversation.unread_count}
          </span>
        ) : conversation.is_read ? (
          <span className="text-primary">✓✓</span>
        ) : null}
      </div>
    </div>
  );
};

export default ConversationItem;
