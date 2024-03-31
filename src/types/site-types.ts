export type Thread = {
  url: string;
  forumSlug: string;
  title: string;
  thumbnail?: string;
  hasLive?: boolean;
  urlSinceLastVisit?: string | null;
  responsesSinceLastVisit?: number;
  userResponseAt?: string | null;
  lastActivityAt?: string;
  createdAt?: string;
  totalResponses?: string;
  userLastResponse?: {
    username: string;
    avatar: string;
  };
};
