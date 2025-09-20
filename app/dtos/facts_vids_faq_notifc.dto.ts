export interface FactsResponse {
  success: boolean;
  message: string;
  data: {
    message: string;
  };
}

export interface Video {
  title: string;
  url: string;
}

export interface VideosResponse {
  success: boolean;
  message: string;
  data: Video[];
}

export interface FAQ {
  ques: string;
  ans: string;
}

export interface FAQResponse {
  success: boolean;
  message: string;
  data: FAQ[];
}

export interface Notification {
  notif: string;
  time: string;
}

export interface NotificationResponse {
  success: boolean;
  message: string;
  data: {
    notifications: Notification[];
  };
}

