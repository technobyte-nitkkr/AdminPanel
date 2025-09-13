import axios from "axios";

import { Category,SimpleCategoriesResponse } from "../dtos/category.dto";
import { QueryBody } from "../dtos/query.dto";
import { SimpleResponse, UserUpdateBody } from "../dtos/user.dto";
import { MailBody } from "../dtos/mail.dto"; 
import { NotificationBody } from "../dtos/notification.dto";

export async function addCategory(category:Category, token?: string): Promise<SimpleCategoriesResponse>{
    if(!category) throw new Error("Category is required");
    try {
        const url=`${process.env.SERVER_URL}/events/categories`;
        const headers = token ? { Authorization: token } : undefined;
        
        const response = await axios.post(url,{
            category:category.categoryName,
            imgUrl:category.imgUrl,
            icon:category.icon
        }, { headers });
        return response.data;
    } catch (error:any) {
        console.error("Error adding category:", error?.response?.data || error.message || error);
        throw new Error(error?.response?.data?.message || "Failed to add category");
    }
}

export async function deleteQuery(query: QueryBody, token?: string): Promise<SimpleResponse>{
    if(!query) throw new Error("Query required");
    try {
        const url=`${process.env.SERVER_URL}/admin/query`;
        const headers = token ? { Authorization: token } : undefined;
        const response = await axios.put(url,query, { headers });
        return response.data;
    } catch (error:any) {
        console.error("Error deleting query:", error?.response?.data || error.message || error);
        throw new Error(error?.response?.data?.message || "Failed delete query");
    }
}

export async function sendMailToMultipleUsers(mail:MailBody, token?: string): Promise<SimpleResponse>{
    if(!mail) throw new Error("Mail data is required");
    try {
        const url = `${process.env.SERVER_URL}/admin/mail/list`;
        const headers = token ? { Authorization: token } : undefined;
        const response=await axios.post(url,mail, { headers });
        return response.data;
    } catch (error:any) {
        console.error("Error sending mail:", error?.response?.data || error.message || error);
        throw new Error(error?.response?.data?.message || "Failed sending mail");
    }
}

export async function sendNotification(notification:NotificationBody, token?: string): Promise<SimpleResponse>{
    if(!notification) throw new Error("Notification data is required");
    try{
        const url=`${process.env.SERVER_URL}/admin/mobilenoti`;
        const headers = token ? { Authorization: token } : undefined;
        const response = await axios.post(url,notification, { headers });
        return response.data;
    }catch(error:any){
        console.error("Error sending notification:", error?.response?.data || error.message || error);
        throw new Error(error?.response?.data?.message || "Failed sending notification");
    }
}

export async function updateUser(token?: string): Promise<SimpleResponse> {
    try {
        const url=`${process.env.SERVER_URL}/updateUsers`;
        const headers = token ? { Authorization: token } : undefined;
        const response = await axios.post(url, undefined, { headers });
        return response.data;
    } catch (error:any) {
        console.error("Error updating:", error?.response?.data || error.message || error);
        throw new Error(error?.response?.data?.message || "Failed updating");
    }
}

export async function updateUserByAdmin(user:UserUpdateBody, token?: string): Promise<SimpleResponse> {
    if(!user) throw new Error("User data is required");
    try {
        const url=`${process.env.SERVER_URL}/admin/user`;
        const headers = token ? { Authorization: token } : undefined;
        const response = await axios.put(url,user, { headers });
       
        return response.data;
    } catch (error:any) {
        console.error("Error updating user:", error?.response?.data || error.message || error);
        throw new Error(error?.response?.data?.message || "Failed updating user");
    }
}

