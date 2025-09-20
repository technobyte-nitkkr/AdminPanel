export interface Developer {
  imageUrl: string;
  name: string;
  year: string;
  github: string;
  linkedin: string;
  insta: string;
}

export interface AboutResponse {
  success: boolean;
  message: string;
  data: {
    devs: Developer[];
  };
}

export interface AboutAppDevsResponse {
  success: boolean;
  message: string;
  data: {
    information: Developer[];
  };
}

