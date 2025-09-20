export interface ContactPerson {
  imageUrl: string;
  name: string;
}

export interface ContactSection {
  section: string;
  logo: string;
  people: ContactPerson[];
}

export interface ContactsResponse {
  success: boolean;
  message: string;
  data: {
    contacts: ContactSection[];
  };
}
