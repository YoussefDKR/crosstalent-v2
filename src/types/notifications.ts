export type NotificationType = "message" | "application";

export type AppNotification = {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  href: string;
  createdAt: string;
  timeLabel: string;
};
