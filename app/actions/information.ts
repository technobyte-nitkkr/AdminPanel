import axios from "axios";
import { 
    Event,
    
    EventsResponse,TimelineEvent,
    TimelineResponse 
} from "../dtos/event.dto";


import { 
    CategoriesResponse,
     Category 
} from "../dtos/category.dto";


import { 
    ContactSection,
    ContactsResponse 
} from "../dtos/contact.dto";


import {
     Lecture ,
     LecturesResponse
} from "../dtos/lecture.dto";


import { 
    FoodSponsor,
    FoodSponsorsResponse,
    SponsorSection,
    SponsorsResponse
} from "../dtos/sponsor.dto";

import { 
    AboutAppDevsResponse,
    AboutResponse,
    Developer
} from "../dtos/dev.dto";




import { 
    FactsResponse,
    FAQ,
    FAQResponse,
    NotificationResponse,
    Video,
    VideosResponse
 } from "../dtos/facts_vids_faq_notifc.dto";



export async function getCategoriesName(): Promise<Category[]> {
    try {
        const url = `${process.env.SERVER_URL}/events/categories`;
        const response = await axios.get<CategoriesResponse>(url);
        return response.data.data.categories;
    }
    catch (error: any) {
        console.error("Error getting categories name:", error?.response?.data || error.message || error);
        throw new Error(error?.response?.data?.message || "Failed to get the categories name");
    }
}

export async function getEventsNames(eventCategory?: string, token?: string): Promise<Event[]> {
    try {
        let url = `${process.env.SERVER_URL}/events`;
        if (eventCategory && eventCategory.trim() !== "") {
            url += `?eventCategory=${encodeURIComponent(eventCategory)}`;
        }
        const headers = token ? { Authorization: token } : undefined;
        const response = await axios.get<EventsResponse>(url, { headers });
        return response.data.data.events;
    }
    catch (error: any) {
        console.error("Error getting the events names:", error?.response?.data || error.message || error);
        throw new Error(error?.response?.data?.message || "Failed to get the events names");
    }
}

export async function getEventsDescriptionByCategory(eventCategory: string, eventName?: string, token?: string): Promise<Event[]> {
    if (!eventCategory) {
        throw new Error("Event category is required");
    }
    try {
        let url = `${process.env.SERVER_URL}/events/description?eventCategory=${encodeURIComponent(eventCategory)}`;
        if (eventName && eventName.trim() !== "") {
            url += `&eventName=${encodeURIComponent(eventName)}`;
        }
        const headers = token ? { Authorization: token } : undefined;
        const response = await axios.get<EventsResponse>(url, { headers });
        return response.data.data.events;
    }
    catch (error: any) {
        console.error("Error getting the event description", error?.response?.data || error.message || error);
        throw new Error(error?.response?.data?.message || "Failed to get the Description by category");
    }

}



export async function getTimelineEvents(token?: string): Promise<TimelineEvent[]> {
  try {
    const url = `${process.env.SERVER_URL}/events/timeline`;
    const headers = token ? { Authorization: token } : undefined;
    const response = await axios.get<TimelineResponse>(url, { headers });
    return response.data.data.events;
  } catch (error: any) {
    console.error("Error getting timeline events:", error?.response?.data || error.message || error);
    throw new Error(error?.response?.data?.message || "Failed to get timeline events");
  }
}


export async function getAllContacts(): Promise<ContactSection[]> {
  try {
    const url = `${process.env.SERVER_URL}/contacts`;

    const response = await axios.get<ContactsResponse>(url);

    return response.data.data.contacts;
  } catch (error: any) {
    console.error("Error getting contact sections:", error?.response?.data || error.message || error);
    throw new Error(error?.response?.data?.message || "Failed to get contacts");
  }
}



export async function getGuestLectures(): Promise<Lecture[]> {
  try {
    const url = `${process.env.SERVER_URL}/lectures`;

    const response = await axios.get<LecturesResponse>(url);

    return response.data.data.lectures;
  } catch (error: any) {
    console.error("Error getting guest lectures:", error?.response?.data || error.message || error);
    throw new Error(error?.response?.data?.message || "Failed to get guest lectures");
  }
}


export async function getSponsors(): Promise<SponsorSection[]> {
  try {
    const url = `${process.env.SERVER_URL}/sponsors`;

    const response = await axios.get<SponsorsResponse>(url);

    return response.data.data.paisa;
  } catch (error: any) {
    console.error("Error getting sponsors:", error?.response?.data || error.message || error);
    throw new Error(error?.response?.data?.message || "Failed to get sponsors");
  }
}


export async function getFoodSponsors(): Promise<FoodSponsor[]> {
  try {
    const url = `${process.env.SERVER_URL}/foodsponsors`;

    const response = await axios.get<FoodSponsorsResponse>(url);

    return response.data.data.foodSponsors;
  } catch (error: any) {
    console.error("Error getting food sponsors:", error?.response?.data || error.message || error);
    throw new Error(error?.response?.data?.message || "Failed to get food sponsors");
  }
}

export async function getDevelopers(): Promise<Developer[]> {
  try {
    const url = `${process.env.SERVER_URL}/about`;

    const response = await axios.get<AboutResponse>(url);

    return response.data.data.devs;
  } catch (error: any) {
    console.error("Error getting developers info:", error?.response?.data || error.message || error);
    throw new Error(error?.response?.data?.message || "Failed to get developers info");
  }
}


export async function getAppDevelopers(): Promise<Developer[]> {
  try {
    const url = `${process.env.SERVER_URL}/aboutAppDevs`;

    const response = await axios.get<AboutAppDevsResponse>(url);

    return response.data.data.information;
  } catch (error: any) {
    console.error("Error getting app developers info:", error?.response?.data || error.message || error);
    throw new Error(error?.response?.data?.message || "Failed to get app developers info");
  }
}

export async function getRandomFact(): Promise<string> {
  try {
    const url = `${process.env.SERVER_URL}/facts`;

    const response = await axios.get<FactsResponse>(url);

    return response.data.data.message;
  } catch (error: any) {
    console.error("Error getting random fact:", error?.response?.data || error.message || error);
    throw new Error(error?.response?.data?.message || "Failed to get random fact");
  }
}

export async function getVideos(): Promise<Video[]> {
  try {
    const url = `${process.env.SERVER_URL}/videos`;

    const response = await axios.get<VideosResponse>(url);

    return response.data.data;
  } catch (error: any) {
    console.error("Error getting videos:", error?.response?.data || error.message || error);
    throw new Error(error?.response?.data?.message || "Failed to get videos");
  }
}

export async function getFAQs(): Promise<FAQ[]> {
  try {
    const url = `${process.env.SERVER_URL}/faq`;

    const response = await axios.get<FAQResponse>(url);

    return response.data.data;
  } catch (error: any) {
    console.error("Error fetching FAQs:", error?.response?.data || error.message || error);
    throw new Error(error?.response?.data?.message || "Failed to fetch FAQs");
  }
}


export async function getUpcomingEvents(timestamp?: number, token?: string): Promise<Event[]> {
  try {
    const url = `${process.env.SERVER_URL}/timestamp/events`;
    const headers = token ? { Authorization: token } : undefined;
    const response = await axios.get<EventsResponse>(url, {
      params: { timestamp },
      headers
    });
    return response.data.data.events;
  } catch (error: any) {
    console.error("Error fetching upcoming events:", error?.response?.data || error.message || error);
    throw new Error(error?.response?.data?.message || "Failed to fetch upcoming events");
  }
}

export async function getNotifications(): Promise<NotificationResponse> {
  try {
    const response = await axios.get<NotificationResponse>(`${process.env.SERVER_URL}/notification`);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching notifications:", error?.response?.data || error.message);
    throw new Error(error?.response?.data?.message || "Failed to fetch notifications");
  }
}