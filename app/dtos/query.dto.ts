export interface QueryResponse {
    success: boolean;
    message: string;
    data: any;
}

export interface QueryBody {
    id: string;
    queryEmail: string;
}