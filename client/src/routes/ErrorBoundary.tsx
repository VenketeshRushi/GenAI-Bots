import React, { lazy, Suspense, ErrorInfo } from "react";

// Lazy-loaded components for fallback UI
const Footer = lazy(() => import("../components/shared/Footer"));
const Navbar = lazy(() => import("../components/shared/Navbar"));
const NotFound = lazy(() => import("../components/shared/NotFound"));

// Type for the state
interface State {
	hasError: boolean;
	error: Error | null;
}

// Type for the props (children will always be ReactNode)
interface Props {
	children: React.ReactNode;
}

class ErrorBoundary extends React.Component<Props, State> {
	state: State = { hasError: false, error: null };

	static getDerivedStateFromError(error: Error): State {
		// Update state to indicate an error has been caught
		return { hasError: true, error };
	}

	componentDidCatch(error: Error, info: ErrorInfo): void {
		// Log error details to an external service, like Sentry or console
		console.error("Error Caught by Error Boundary:", error, info);
	}

	render() {
		// If there's an error, render fallback UI
		if (this.state.hasError) {
			return (
				<Suspense fallback={<div>Loading Error Page...</div>}>
					<Navbar />
					<NotFound />
					<Footer />
				</Suspense>
			);
		}

		// Normally, render children if there's no error
		return this.props.children;
	}
}

export default ErrorBoundary;
