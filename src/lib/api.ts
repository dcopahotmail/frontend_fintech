import axios, { type AxiosRequestConfig } from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://localhost:7221/api";

type RequestOptions = Omit<AxiosRequestConfig, "params"> & {
  query?: Record<string, string | number | boolean | undefined>;
};

if (typeof window === "undefined" && API_BASE_URL.startsWith("https://localhost:")) {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

const apiClient = axios.create({
  baseURL: API_BASE_URL.endsWith("/") ? API_BASE_URL : `${API_BASE_URL}/`,
  headers: { "Content-Type": "application/json" },
});

export async function apiFetch<T>(
  path: string,
  options: RequestOptions & { body?: string } = {},
): Promise<T> {
  const { query, body, ...config } = options;
  const normalizedPath = path.replace(/^\//, "");

  const response = await apiClient.request<T>({
    url: normalizedPath,
    params: query,
    data: body !== undefined ? JSON.parse(body) : undefined,
    ...config,
  });

  return response.data;
}