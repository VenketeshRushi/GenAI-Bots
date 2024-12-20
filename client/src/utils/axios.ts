import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { CookieStorage } from "./storage";
import getBaseUrl from "./getBaseUrl";

const createAxiosInstance = (): AxiosInstance => {
	const baseURL = getBaseUrl();

	const config: AxiosRequestConfig = {
		baseURL,
		// timeout: 20000, // Enable timeout for better reliability
		withCredentials: true, // Allow cross-site Access-Control cookies
	};

	const instance = axios.create(config);

	// Add request interceptors
	instance.interceptors.request.use(
		(request) => {
			// Retrieve token from cookies
			const token = CookieStorage.getItem<string>("token");

			// If token exists, add it to the Authorization header
			if (token) {
				request.headers.Authorization = `Bearer ${token}`;
			}

			// Check if the request already has Content-Type header
			if (!request.headers["Content-Type"]) {
				request.headers["Content-Type"] = "application/json"; // Default Content-Type
			}

			console.log("Request:", request); // Debug log (optional)
			return request;
		},
		(error) => {
			console.error("Request Error:", error); // Log request errors
			return Promise.reject(error);
		}
	);

	// Add response interceptors
	instance.interceptors.response.use(
		(response) => {
			console.log("Response:", response); // Debug log (optional)
			return response;
		},
		(error) => {
			if (error.response) {
				console.error(
					`Error ${error.response.status}: ${
						error.response.data.message || error.message
					}`
				);
			} else {
				console.error("Network/Server Error:", error.message);
			}
			return Promise.reject(error);
		}
	);

	return instance;
};

export const AXIOS = createAxiosInstance();
