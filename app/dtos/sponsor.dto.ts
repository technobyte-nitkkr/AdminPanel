export interface addSponsordto{
  name: string;
  imageUrl: string;
  targetUrl: string;
  sponsorSection: string;
}


export interface Sponsor {
  imageUrl: string;
  targetUrl: string;
}

export interface SponsorSection {
  sponsors: Sponsor[];
  sponsorSection: string;
}

export interface SponsorsResponse {
  success: boolean;
  message: string;
  data: {
    paisa: SponsorSection[];
  };
}


export interface FoodSponsor {
  imageUrl: string;
  link: string;
  name: string;
}

export interface FoodSponsorsResponse {
  success: boolean;
  message: string;
  data: {
    foodSponsors: FoodSponsor[];
  };
}

