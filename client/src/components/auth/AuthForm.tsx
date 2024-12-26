import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginUser, registerUser } from "@/features/authSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxTransportHoot";

interface AuthFormProps extends React.ComponentPropsWithoutRef<"div"> {
	type: "login" | "register"; // Determine the type of form
}

export function AuthForm({ type, className, ...props }: AuthFormProps) {
	const dispatch = useAppDispatch();
	const { loading, error } = useAppSelector((state) => state.auth);
	const navigate = useNavigate();

	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [emailError, setEmailError] = useState<string>("");
	const [passwordError, setPasswordError] = useState<string>("");
	const [confirmPassword, setConfirmPassword] = useState<string>("");
	const [confirmPasswordError, setConfirmPasswordError] = useState<string>("");

	// Email Validation Regex
	const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

	// Password Validation Regex (at least 8 characters, 1 lowercase, 1 uppercase, 1 number, 1 special character)
	const passwordRegex =
		/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		let valid = true;

		// Email Validation
		if (!emailRegex.test(email)) {
			setEmailError("Please enter a valid email address.");
			valid = false;
		} else {
			setEmailError("");
		}

		// Password Validation
		if (!passwordRegex.test(password)) {
			setPasswordError(
				"Password must be at least 8 characters long and include an uppercase letter, a number, and a special character."
			);
			valid = false;
		} else {
			setPasswordError("");
		}

		// Confirm Password Validation (only for registration)
		if (type === "register" && password !== confirmPassword) {
			setConfirmPasswordError("Passwords do not match.");
			valid = false;
		} else {
			setConfirmPasswordError("");
		}

		if (valid) {
			if (type === "login") {
				dispatch(loginUser({ email, password, navigate })); // Dispatch login action
			} else if (type === "register") {
				dispatch(registerUser({ email, password, name: "Guest", navigate })); // Dispatch register action
			}
		}
	};

	const handleGoogleLogin = () => {
		const googleClientId = import.meta.env.VITE_PUBLIC_GOOGLE_CLIENT_ID;
		const redirectUri = import.meta.env.VITE_PUBLIC_GOOGLE_REDIRECT_URI;

		const googleLoginUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${googleClientId}&redirect_uri=${redirectUri}&scope=openid%20profile%20email`;

		console.log("Google's login", redirectUri, googleLoginUrl);

		window.location.href = googleLoginUrl; // Redirect the user to Google's login page
	};

	return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>
			<Card>
				<CardHeader className="text-center">
					<CardTitle className="text-xl">
						{type === "login" ? "Welcome back" : "Create an account"}
					</CardTitle>
					<CardDescription>
						{type === "login"
							? "Login with your Google account"
							: "Sign up with your Google account"}
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid gap-2 mb-4">
						<div className="flex flex-col gap-4 mb-1">
							<Button
								variant="outline"
								className="w-full"
								onClick={handleGoogleLogin}
							>
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
									<path
										d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
										fill="currentColor"
									/>
								</svg>
								Login with Google
							</Button>
						</div>
						<div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
							<span className="relative z-10 bg-background px-2 text-muted-foreground">
								Or continue with
							</span>
						</div>
					</div>
					<form onSubmit={handleSubmit}>
						<div className="grid gap-6">
							<div className="grid gap-2">
								<Label htmlFor="email">Email</Label>
								<Input
									id="email"
									type="email"
									placeholder="m@example.com"
									required
									value={email}
									onChange={(e) => {
										setEmail(e.target.value);
										setEmailError("");
										setPasswordError("");
										setConfirmPasswordError("");
									}}
									autoComplete="email"
								/>
								{emailError && (
									<p className="text-red-500 text-sm mt-1">{emailError}</p>
								)}
							</div>
							<div className="grid gap-2">
								<Label htmlFor="password">Password</Label>
								<Input
									id="password"
									type="password"
									required
									value={password}
									onChange={(e) => {
										setPassword(e.target.value);
										setEmailError("");
										setPasswordError("");
										setConfirmPasswordError("");
									}}
									autoComplete="current-password"
								/>
								{passwordError && (
									<p className="text-red-500 text-sm mt-1">{passwordError}</p>
								)}
							</div>
							{type === "register" && (
								<div className="grid gap-2">
									<Label htmlFor="confirmPassword">Confirm Password</Label>
									<Input
										id="confirmPassword"
										type="password"
										required
										value={confirmPassword}
										onChange={(e) => {
											setConfirmPassword(e.target.value);
											setEmailError("");
											setPasswordError("");
											setConfirmPasswordError("");
										}}
										autoComplete="new-password"
									/>
									{confirmPasswordError && (
										<p className="text-red-500 text-sm mt-1">
											{confirmPasswordError}
										</p>
									)}
								</div>
							)}
							<Button type="submit" className="w-full" disabled={loading}>
								{loading
									? type === "login"
										? "Logging in..."
										: "Signing up..."
									: type === "login"
									? "Login"
									: "Sign Up"}
							</Button>

							{/* Display API Error Message */}
							{error && (
								<p className="text-red-500 text-sm mt-2 font-semibold text-center">
									{typeof error === "string"
										? error
										: "An unexpected error occurred."}
								</p>
							)}
							<div className="text-center text-sm">
								{type === "login" ? (
									<>
										Don't have an account?{" "}
										<Link
											to="/signup"
											className="underline underline-offset-4"
											onClick={() => {
												setEmailError("");
												setPasswordError("");
												setConfirmPasswordError("");
											}}
										>
											Sign up
										</Link>
									</>
								) : (
									<>
										Already have an account?{" "}
										<Link
											to="/login"
											className="underline underline-offset-4"
											onClick={() => {
												setEmailError("");
												setPasswordError("");
												setConfirmPasswordError("");
											}}
										>
											Login
										</Link>
									</>
								)}
							</div>
						</div>
					</form>
				</CardContent>
			</Card>
			<div className="text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary">
				By clicking continue, you agree to our{" "}
				<Link to="/">Terms of Service</Link> and{" "}
				<Link to="/">Privacy Policy</Link>.
			</div>
		</div>
	);
}
