import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { CookieStorage } from "@/utils/storage";
import axios from "axios";

// Define the AuthState interface
interface AuthState {
	user: { _id: string; name: string; email: string } | null;
	token: string | "";
	isAdmin: boolean;
	loading: boolean;
	error: string | null;
}

// Initial state for the auth slice
const initialState: AuthState = {
	user: CookieStorage.getItem("user")
		? JSON.parse(CookieStorage.getItem("user")!)
		: null,
	token: CookieStorage.getItem("token") || "",
	isAdmin: false,
	loading: false,
	error: null,
};

// Async thunk for login
export const loginUser = createAsyncThunk(
	"auth/login",
	async (
		{ email, password }: { email: string; password: string },
		{ rejectWithValue }
	) => {
		try {
			const response = await axios.post("/api/auth/login", { email, password });
			const { user, token } = response.data;
			// Save user and token in cookies for persistence
			CookieStorage.setItem("user", JSON.stringify(user));
			CookieStorage.setItem("token", token);
			return { user, token };
		} catch (error) {
			// Ensure the error is of type AxiosError
			if (axios.isAxiosError(error)) {
				const errorMessage =
					error.response?.data?.message || "Login failed. Please try again.";
				return rejectWithValue(errorMessage);
			} else {
				return rejectWithValue("An unexpected error occurred.");
			}
		}
	}
);

// Async thunk for register
export const registerUser = createAsyncThunk(
	"auth/register",
	async (
		{
			username,
			email,
			password,
		}: { username: string; email: string; password: string },
		{ rejectWithValue }
	) => {
		try {
			const response = await axios.post("/api/auth/register", {
				username,
				email,
				password,
			});
			const { user, token } = response.data;
			// Save user and token in cookies for persistence
			CookieStorage.setItem("user", JSON.stringify(user));
			CookieStorage.setItem("token", token);
			return { user, token };
		} catch (error: unknown) {
			// Narrow down the error type to AxiosError
			if (axios.isAxiosError(error)) {
				return rejectWithValue(
					error.response?.data?.message ||
						"Registration failed. Please try again."
				);
			} else {
				return rejectWithValue("An unexpected error occurred.");
			}
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
