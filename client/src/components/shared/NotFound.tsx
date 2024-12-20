import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CookieStorage } from "@/utils/storage";
import { useAppSelector } from "@/hooks/reduxTransportHoot";

const NotFound = () => {
	const [count, setCount] = useState(10);
	const [animate, setAnimate] = useState(false);
	const navigate = useNavigate();

	// Retrieve the token from Redux store or cookies
	const token =
		useAppSelector((state) => state?.auth?.token) ||
		CookieStorage.getItem("token") ||
		"";

	useEffect(() => {
		setAnimate(true);
		const intervalId = setInterval(() => {
			setCount((prevCount) => {
				if (prevCount > 1) {
					return prevCount - 1;
				} else {
					clearInterval(intervalId);

					// Redirect based on the presence of the token
					if (token) {
						navigate("/dashboard");
					} else {
						navigate("/");
					}
					return 0;
				}
			});
		}, 1000);

		return () => clearInterval(intervalId);
	}, [token, navigate]);

	return (
		<div
			className={`flex flex-col items-center justify-center h-screen bg-dark transition duration-500 ${
				animate ? "opacity-100" : "opacity-0"
			}`}
		>
			<div className="max-w-md text-center">
				<h1 className="text-9xl font-bold text-dark-500 animate-pulse">404</h1>
				<p className="text-3xl font-bold text-dark-500 mt-4">Page Not Found</p>
				<p className="text-lg text-dark-500 mt-4">
					The page you are looking for does not exist. You will be redirected to
					the homepage in {count} seconds.
				</p>
				<div className="mt-8"></div>
				<Link to="/">Go back to homepage</Link>
			</div>
			<div className="absolute bottom-0 left-0 right-0 p-4 text-center text-primary">
				<p>Redirecting in {count} seconds...</p>
			</div>
		</div>
	);
};

export default NotFound;
