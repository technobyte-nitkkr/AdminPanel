export interface mailResponse {
    success: boolean;
    message: string;
}

export interface MailBody {
    users: string[];
    heading?: string;
    buttontext?: string;
    buttonlink?: string;
    subject?: string;
    thankyou?: string;
    detail?: string;
}