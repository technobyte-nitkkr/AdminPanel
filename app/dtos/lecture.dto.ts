export interface Lecture {
  date: string;
  desc: string;
  imageUrl: string;
  time: string;
  name: string;
  insta: string;
  linkedin: string;
  facebook: string;
}

export interface LecturesResponse {
  success: boolean;
  message: string;
  data: {
    lectures: Lecture[];
  };
}
