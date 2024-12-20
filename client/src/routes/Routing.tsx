import { Routes, Route, BrowserRouter } from "react-router-dom";
import { Suspense, lazy } from "react";
import MainLoader from "@/components/Loading/MainLoader";
import { Private, PrivateAdmin } from "./VerifyRoute";
import Dashboard from "@/pages/Dashboard";
// import ErrorBoundary from "./ErrorBoundary";

// Lazy load pages

const Home = lazy(() => import("../pages/Home"));
const Login = lazy(() => import("../pages/Login"));
const Signup = lazy(() => import("../pages/Signup"));
const User = lazy(() => import("../pages/User"));
const ChatBot = lazy(() => import("../pages/Bots/ChatBot"));
const ImageGenerationBot = lazy(
	() => import("../pages/Bots/ImageGenerationBot")
);
const VideoGenerationBot = lazy(
	() => import("../pages/Bots/VideoGenerationBot")
);
const VoiceBot = lazy(() => import("../pages/Bots/VoiceBot"));
const NotFound = lazy(() => import("../components/shared/NotFound"));

export const Routing = () => {
	// Define route configuration
	const routeConfig = [
		{ path: "/", element: <Home />, isPublic: true },
		{ path: "/login", element: <Login />, isPublic: true },
		{ path: "/signup", element: <Signup />, isPublic: true },
		{ path: "/user", element: <User />, isPublic: false },
		{
			path: "/dashboard",
			element: <Dashboard />,
			isPublic: false,
			isAdmin: false, // Set to true to restrict access to admin users only
		},
		{ path: "/voicebot", element: <VoiceBot />, isPublic: false },
		{ path: "/chatbot", element: <ChatBot />, isPublic: false },
		{ path: "/imagebot", element: <ImageGenerationBot />, isPublic: false },
		{ path: "/videobot", element: <VideoGenerationBot />, isPublic: false },
		// Catch-all route for 404
		{ path: "*", element: <NotFound />, isPublic: true },
	];

	return (
		<Suspense fallback={<MainLoader />}>
			{/* <ErrorBoundary> */}
			<BrowserRouter>
				<Routes>
					{routeConfig.map((route, index) => (
						<Route
							key={index}
							path={route.path}
							element={
								route.isPublic ? (
									route.element
								) : route.isAdmin ? (
									<PrivateAdmin>{route.element}</PrivateAdmin>
								) : (
									<Private>{route.element}</Private>
								)
							}
						/>
					))}
				</Routes>
			</BrowserRouter>
			{/* </ErrorBoundary> */}
		</Suspense>
	);
};
