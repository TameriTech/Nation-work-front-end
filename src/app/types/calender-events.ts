export  interface calendarEventProps {
  id: string;
  title: string;
  start: Date;
  end: Date;
  price: number;
  status: "completed" | "published" | "assigned" | "upcoming";
  avatarUrl?: string;
}