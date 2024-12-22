import React, { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { CookieStorage } from "@/utils/storage";
import { useAppSelector } from "@/hooks/reduxTransportHoot";
import Cookies from "js-cookie";

// Define props for the Public, Private and PrivateAdmin components
interface RouteProps {
	children: ReactNode;
}

/**
 * Public Route Component
 * Restricts access to unauthenticated users only.
 * Redirects authenticated users to the page they came from.
 */
export const PublicRoute: React.FC<RouteProps> = ({ children }) => {
	// Get token from Redux state or cookies
	const token =
		CookieStorage.getItem<string>("token") || Cookies.get("token") || "";

	// Get the current location (i.e., the URL the user is trying to access)
	const location = useLocation();

	// If the user is authenticated, redirect them to the previous page or dashboard
	if (token && token.length > 0) {
		return <Navigate to={location.state?.from || "/dashboard"} />;
	}

	// If the user is not authenticated, render the public page
	return <>{children}</>;
};

/**
 * Private Route Component
 * Restricts access to authenticated users only.
 */
export const Private: React.FC<RouteProps> = ({ children }) => {
	// Get token from Redux state or cookies
	const token =
		CookieStorage.getItem<string>("token") || Cookies.get("token") || "";

	// console.log("token CookieStorage", token);

	// Render the children if token exists; otherwise, redirect to login
	return token && token.length > 0 ? <>{children}</> : <Navigate to="/login" />;
};

/**
 * Private Admin Route Component
 * Restricts access to authenticated admin users only.
 */
export const PrivateAdmin: React.FC<RouteProps> = ({ children }) => {
	// Get token and admin status from Redux state or cookies
	const token =
		CookieStorage.getItem<string>("token") || Cookies.get("token") || "";
	const isAdmin = useAppSelector((state) => state?.auth?.isAdmin) || false;

	// Render the children if token exists and user is an admin; otherwise, redirect to login
	return token && token.length > 0 && !!isAdmin ? (
		<>{children}</>
	) : (
		<Navigate to="/login" />
	);
};
