import { Event } from "./event.dto";

export interface UserEventsResponse {
  success: boolean;
  message: string;
  data: {
    events: Event[];
  };
}

export interface UserEventUpdateRequest {
  eventName: string;
  eventCategory: string;
}

export interface UserUpdateBody {
  userEmail: string;
  role: string;
}

export interface SimpleResponse {
  success: boolean;
  message: string;
}

export interface AddQueryRequest {
  text: string;
}


export interface LoginRequest {
  idToken: string;
}

export interface User {
  email: string;
  name: string;
  picture: string;
  onBoard: boolean;
  college: string;
  year: string;
  admin: boolean;
  role: string;
}

export interface UpdateUserRequest {
  year:string;
  college:string;
  phone:string;
}

export interface LoginUserResponse {
  success: boolean;
  onBoard: boolean;
  data: {
    user: User;
    token: string;
  };
}
