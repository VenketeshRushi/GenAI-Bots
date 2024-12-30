import { Routes, Route, BrowserRouter } from "react-router-dom";
import { Suspense, lazy } from "react";
import MainLoader from "@/components/Loading/MainLoader";
import { Private, PrivateAdmin, PublicRoute } from "./VerifyRoute";
import SEO from "@/components/SEO";
import Layout from "@/Layout";
import FileUploader from "@/components/shared/FileUploader";

// Lazy load pages
const Home = lazy(() => import("../pages/Home"));
const Login = lazy(() => import("../pages/Login"));
const Signup = lazy(() => import("../pages/Signup"));
const Dashboard = lazy(() => import("../pages/Dashboard"));
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
const CreatePost = lazy(() => import("@/components/ImgGenration/CreatePost"));
const MyDocuments = lazy(() => import("@/pages/Bots/MyPDFDocuments"));

export const Routing = () => {
	// Route configuration with SEO data
	const routeConfig = [
		{
			path: "/",
			element: <Home />,
			isPublic: true,
			seo: {
				title: "Home",
				description: "Welcome to our website and explore amazing features.",
				keywords: "Home, Features, Explore",
			},
		},
		{
			path: "/login",
			element: <Login />,
			isPublic: true,
			seo: {
				title: "Login",
				description: "Sign in to your account to access exclusive features.",
				keywords: "Login, Authentication, Secure",
			},
		},
		{
			path: "/signup",
			element: <Signup />,
			isPublic: true,
			seo: {
				title: "Sign Up",
				description: "Create your account and join our community.",
				keywords: "Sign Up, Register, Join Community",
			},
		},
		{
			path: "/user",
			element: <User />,
			isPublic: false,
			seo: {
				title: "User Profile",
				description: "Manage your profile and account settings.",
				keywords: "User Profile, Account, Settings",
			},
		},
		{
			path: "/dashboard",
			element: <Dashboard />,
			isPublic: false,
			isAdmin: false,
			seo: {
				title: "Dashboard",
				description: "Access your personalized dashboard to manage activities.",
				keywords: "Dashboard, User Dashboard, Activities",
			},
		},
		{
			path: "/dashboard/upload",
			element: <FileUploader />,
			isPublic: false,
			isAdmin: false,
			seo: {
				title: "Upload",
				description: "Upload and manage your files efficiently.",
				keywords: "Upload, File Management, Dashboard Upload",
			},
		},
		{
			path: "/voicebot",
			element: <VoiceBot />,
			isPublic: false,
			seo: {
				title: "Voice Bot",
				description: "Experience our interactive voice bot features.",
				keywords: "Voice Bot, AI, Interactive",
			},
		},
		{
			path: "/chatbot",
			element: <ChatBot />,
			isPublic: false,
			seo: {
				title: "Chat Bot",
				description: "Communicate seamlessly with our AI-powered chatbot.",
				keywords: "Chat Bot, AI, Communication",
			},
		},
		{
			path: "/chatbot/:type",
			element: <MyDocuments />,
			isPublic: false,
			seo: {
				title: "Chat Bot - Type",
				description: "Engage with the AI chatbot on specific topics.",
				keywords: "Chat Bot, Topic, AI, Communication",
			},
		},
		{
			path: "/imagebot",
			element: <ImageGenerationBot />,
			isPublic: false,
			seo: {
				title: "Image Bot",
				description: "Generate stunning images using our AI-powered image bot.",
				keywords: "Image Bot, AI, Image Generation",
			},
		},
		{
			path: "/imagebot/:method",
			element: <CreatePost />,
			isPublic: false,
			seo: {
				title: "Image Bot - Category",
				description: "Explore images in a specific category powered by AI.",
				keywords: "Image Bot, Category, AI, Image Generation",
			},
		},
		{
			path: "/videobot",
			element: <VideoGenerationBot />,
			isPublic: false,
			seo: {
				title: "Video Bot",
				description:
					"Create AI-driven videos with our advanced video generation bot.",
				keywords: "Video Bot, AI, Video Creation",
			},
		},
		{
			path: "*",
			element: <NotFound />,
			isPublic: true,
			seo: {
				title: "404 Not Found",
				description: "The page you are looking for does not exist.",
				keywords: "404, Not Found, Error",
			},
		},
	];

	return (
		<Suspense fallback={<MainLoader />}>
			<BrowserRouter>
				<Routes>
					{routeConfig.map((route, index) => (
						<Route
							key={index}
							path={route.path}
							element={
								<Layout>
									{/* Inject SEO metadata */}
									{route.seo && (
										<SEO
											title={route.seo.title}
											description={route.seo.description}
											keywords={route.seo.keywords}
										/>
									)}

									{/* Route element */}
									{route.isPublic ? (
										<PublicRoute>{route.element}</PublicRoute>
									) : route?.isAdmin ? (
										<PrivateAdmin>{route.element}</PrivateAdmin>
									) : (
										<Private>{route.element}</Private>
									)}
								</Layout>
							}
						/>
					))}
				</Routes>
			</BrowserRouter>
		</Suspense>
	);
};
