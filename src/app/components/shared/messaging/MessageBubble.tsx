import { cn } from "@/app/lib/utils";

interface MessageBubbleProps {
  content: string;
  time: string;
  isSent: boolean;
  images?: string[];
}

const MessageBubble = ({
  content,
  time,
  isSent,
  images,
}: MessageBubbleProps) => {
  return (
    <div
      className={cn(
        "flex flex-col gap-1 max-w-[70%]",
        isSent ? "items-start" : "items-end"
      )}
    >
      {content && (
        <div
          className={cn(
            "px-4 py-3 rounded-2xl shadow-sm",
            isSent
              ? "bg-blue-100 text-gray-800 rounded-bl-md"
              : "bg-gray-200 text-gray-800 rounded-br-md"
          )}
        >
          <p className="text-sm leading-relaxed">{content}</p>
        </div>
      )}

      {images && images.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`Image ${index + 1}`}
              className="w-32 h-32 object-cover rounded-xl shadow-sm"
            />
          ))}
        </div>
      )}

      <span className="text-xs text-gray-500 px-1">{time}</span>
    </div>
  );
};

export default MessageBubble;
