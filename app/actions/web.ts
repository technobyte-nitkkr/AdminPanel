import axios from "axios";
import { LoginRequest, LoginUserResponse, UpdateUserRequest } from "../dtos/user.dto";

export async function loginWebUsingGoogleWeb(Token:LoginRequest, token?: string): Promise<LoginUserResponse> {    
    if(!Token || !Token.idToken || Token.idToken.trim().length === 0) {
        throw new Error("Invalid token: Token is missing or empty");
    }
    
    try {
        const url=`${process.env.SERVER_URL}/login`;
        const headers: any = {
            "Content-Type": "application/json",
            Accept: "application/json"
        };
        if (token) headers.Authorization = token;
        const response= await axios.post<LoginUserResponse>(url,Token, { headers });

        return response.data;

        

    } catch (error:any) {
        console.error("Login failed:", error?.response?.data || error.message || error);
        throw new Error(error?.response?.data?.message || "Login request failed");
    }
}

export async function UpdateUserProfileForWeb(payload:UpdateUserRequest, token?: string): Promise<LoginUserResponse> {
    if(!payload) {
        throw new Error("Empty fields! fill fields to update the user");
    }
    if(!payload.year || !payload.college || !payload.phone) {
        throw new Error("Required fields missing: year, college, and phone are required");
    }

    try {
        
        const url=`${process.env.SERVER_URL}/user`
        const headers: any = {
            "Content-Type": "application/json",
            Accept: "application/json"
        };
        if (token) headers.Authorization = token;
        const response=await axios.put<LoginUserResponse>(url,payload,{ headers })

        return response.data

    } catch (error:any) {
        console.error("Failed to update user profile:", error?.response?.data || error.message || error);
        throw new Error(error?.response?.data?.message || "Profile update failed");
    }

}
