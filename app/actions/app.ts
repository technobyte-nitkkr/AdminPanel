import axios from "axios";

import { UserAuthResponse, UserProfileUpdateSchema } from "../dtos/authentication.dto";

export async function loginUsingOAuth(idToken:string, token?: string): Promise<UserAuthResponse> {
    if(!idToken) throw new Error("Id Token required");
    try {
        const url=`${process.env.SERVER_URL}/loginApp`;
        const headers = token ? { Authorization: token } : undefined;
        const response = await axios.post(url,idToken, { headers });
        return response.data;
    } catch (error:any) {
        console.error("Error in login:", error?.response?.data || error.message || error);
        throw new Error(error?.response?.data?.message || "Failed to login");
    }
}

export async function updateUserProfile(updateSchema:UserProfileUpdateSchema, token?: string) : Promise<UserAuthResponse> {
    if(!updateSchema || !updateSchema.year || !updateSchema.college) {
        throw new Error("Year and college are required for profile update");
    }
    try {
        const url=`${process.env.SERVER_URL}/signUpApp`;
        const headers = token ? { Authorization: token } : undefined;
        const response = await axios.put(url,updateSchema, { headers });
        return response.data;
    } catch (error:any) {
        console.error("Error updating user profile:", error?.response?.data || error.message || error);
        throw new Error(error?.response?.data?.message || "Failed to update user profile");
    }
}