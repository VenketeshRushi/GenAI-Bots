import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { CookieStorage } from "@/utils/storage";
import { useAppSelector } from "@/hooks/reduxTransportHoot";

// Define props for the Private and PrivateAdmin components
interface PrivateRouteProps {
	children: ReactNode;
}

/**
 * Private Route Component
 * Restricts access to authenticated users only.
 */
export const Private: React.FC<PrivateRouteProps> = ({ children }) => {
	// Get token from Redux state or cookies
	const token =
		useAppSelector((state) => state?.auth?.token) ||
		CookieStorage.getItem<string>("token") ||
		"";

	// Render the children if token exists; otherwise, redirect to login
	return token ? <>{children}</> : <Navigate to="/login" />;
};

/**
 * Private Admin Route Component
 * Restricts access to authenticated admin users only.
 */
export const PrivateAdmin: React.FC<PrivateRouteProps> = ({ children }) => {
	// Get token and admin status from Redux state or cookies
	const token =
		useAppSelector((state) => state?.auth?.token) ||
		CookieStorage.getItem<string>("token");
	const isAdmin = useAppSelector((state) => state?.auth?.isAdmin) || false;

	// Render the children if token exists and user is an admin; otherwise, redirect to login
	return token && token.length > 0 && !!isAdmin ? (
		<>{children}</>
	) : (
		<Navigate to="/login" />
	);
};
