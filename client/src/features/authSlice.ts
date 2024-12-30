import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { CookieStorage } from "@/utils/storage";
import { useNavigate } from "react-router-dom";

interface Membership {
	activeMembership: boolean;
	membershipType: string;
	membershipPrice: number;
	membershipExpiration: string;
}

// Define the structure for files grouped by type
interface File {
	id: string;
	name: string;
	downloadUrl: string;
	size: number;
}

interface UserFiles {
	pdf: File[];
	csv: File[];
	audio: File[];
	video: File[];
	[other: string]: File[]; // Optional to allow additional file types dynamically
}

// Define the structure for the user
interface User {
	id: string;
	name: string;
	email: string;
	isAdmin: boolean;
	files: UserFiles;
	membership: Membership;
}

// Define the AuthState interface
interface AuthState {
	user: User | null;
	token: string;
	isAdmin: boolean;
	loading: boolean;
	error: string | null;
}

// Initial state for the auth slice
const initialState: AuthState = {
	user: CookieStorage.getItem("user") ? CookieStorage.getItem("user")! : null,
	token: CookieStorage.getItem("token") || "",
	isAdmin: false,
	loading: false,
	error: null,
};

// Async thunk for login
export const loginUser = createAsyncThunk(
	"auth/login",
	async (
		{
			email,
			password,
			navigate,
		}: {
			email: string;
			password: string;
			navigate: ReturnType<typeof useNavigate>;
		},
		{ rejectWithValue }
	) => {
		try {
			const response = await axios.post(
				"http://localhost:8000/api/auth/login",
				{ email, password }
			);

			const { user, token } = response.data;
			// Save user and token in cookies for persistence
			CookieStorage.setItem("user", JSON.stringify(user));
			CookieStorage.setItem("token", token);
			navigate("/dashboard");
			return { user, token };
		} catch (error) {
			if (axios.isAxiosError(error)) {
				return rejectWithValue(
					error.response?.data?.message || "Login failed. Please try again."
				);
			}
			return rejectWithValue("An unexpected error occurred.");
		}
	}
);

// Async thunk for register
export const registerUser = createAsyncThunk(
	"auth/register",
	async (
		{
			name,
			email,
			password,
			navigate,
		}: {
			name: string;
			email: string;
			password: string;
			navigate: ReturnType<typeof useNavigate>;
		},
		{ rejectWithValue }
	) => {
		try {
			const response = await axios.post(
				"http://localhost:8000/api/auth/register",
				{
					name,
					email,
					password,
				}
			);

			const { user, token } = response.data;
			// Save user and token in cookies for persistence
			CookieStorage.setItem("user", JSON.stringify(user));
			CookieStorage.setItem("token", token);
			navigate("/dashboard");
			return { user, token };
		} catch (error) {
			if (axios.isAxiosError(error)) {
				return rejectWithValue(
					error.response?.data?.message ||
						"Registration failed. Please try again."
				);
			}
			return rejectWithValue("An unexpected error occurred.");
		}
	}
);

// Auth slice
const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		removeUser: (state) => {
			state.user = null;
			state.token = "";
			state.isAdmin = false;
			CookieStorage.removeItem("user");
			CookieStorage.removeItem("token");
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(loginUser.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(loginUser.fulfilled, (state, action) => {
				state.loading = false;
				state.user = action.payload.user;
				state.token = action.payload.token;
				state.isAdmin = action.payload.user.isAdmin || false;
				state.error = null;
			})
			.addCase(loginUser.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload as string;
			})
			.addCase(registerUser.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(registerUser.fulfilled, (state, action) => {
				state.loading = false;
				state.user = action.payload.user;
				state.token = action.payload.token;
				state.isAdmin = action.payload.user.isAdmin || false;
				state.error = null;
			})
			.addCase(registerUser.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload as string;
			});
	},
});

// Export actions
export const { removeUser } = authSlice.actions;

// Export reducer
export default authSlice.reducer;
