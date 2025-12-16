export interface HttpClientPort {
    get<T>(url: string): Promise<T>;
}
