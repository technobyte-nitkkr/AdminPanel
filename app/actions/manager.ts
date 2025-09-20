import axios from "axios";

// ALL REQUESTS TO BE MADE BY ROLE MANAGER

import { Event ,addEventResponse , UsersResponse} from "../dtos/event.dto";
import { addSponsordto ,SponsorsResponse } from "../dtos/sponsor.dto";
import { QueryResponse } from "../dtos/query.dto";
import { mailResponse } from "../dtos/mail.dto";

export async function addEvent(eventData: Event, token?: string): Promise<addEventResponse> {
    try{
        const url= `${process.env.SERVER_URL}/events`;
        const headers = token ? { Authorization: token } : undefined;
        const response=await axios.post(url, eventData, { headers });
        console.log(response)
        return response.data;
    }
    catch (error: any) {
    console.error("Error adding event:", error?.response?.data || error.message || error);
    throw new Error(error?.response?.data?.message || "Failed to add event");
    }
}

export async function addSponsor(sponsor: addSponsordto, token?: string): Promise<SponsorsResponse> {
    try{
        const url= `${process.env.SERVER_URL}/sponsors`;
        const headers = token ? { Authorization: token } : undefined;
        
        const response=await axios.post(url, sponsor, { headers });
         
        return response.data;
    }
    catch (error: any) {
    console.error("Error adding sponsor:", error?.response?.data || error.message || error);
    throw new Error(error?.response?.data?.message || "Failed to add sponsor");
    }
}

export async function getDataOfEvent(eventCategory:string , eventName:string, token?: string): Promise<UsersResponse> {
    if (!eventCategory || !eventName) {
        throw new Error("Event category and name are required");
    }
    try {
        const url = `${process.env.SERVER_URL}/admin/event?eventCategory=${eventCategory}&eventName=${eventName}`;
        const headers = token ? { Authorization: token } : undefined;
        const response = await axios.get(url, { headers });
        return response.data;
    } catch (error: any) {
        console.error("Error fetching event data:", error?.response?.data || error.message || error);
        throw new Error(error?.response?.data?.message || "Failed to fetch event data");
    }
}

export async function getQuery(token?: string) : Promise<QueryResponse> {
    try {
        const url = `${process.env.SERVER_URL}/admin/query`;
        const headers = token ? { Authorization: token } : undefined;
        const response = await axios.get(url, { headers });
        return response.data;
    } catch (error: any) {
        console.error("Error fetching queries:", error?.response?.data || error.message || error);
        throw new Error(error?.response?.data?.message || "Failed to fetch queries");
    }
}

export async function mailCategory(eventName:string , eventCategory:string,heading:string,buttontext:string,buttonlink:string,subject:string,thankyou:string,detail:string, token?: string): Promise<mailResponse> {
    if (!eventCategory || !eventName) {
        throw new Error("Event category and name are required");
    }
    try {
        const url = `${process.env.SERVER_URL}/admin/mail/category`;
        const data = {
            eventName,
            eventCategory,
            heading,
            buttontext,
            buttonlink,
            subject,
            thankyou,
            detail
        };
        const headers = token ? { Authorization: token } : undefined;
        const response = await axios.post(url, data, { headers });
        return response.data;
    } catch (error: any) {
        console.error("Error sending mail:", error?.response?.data || error.message || error);
        throw new Error(error?.response?.data?.message || "Failed to send mail");
    }
}
