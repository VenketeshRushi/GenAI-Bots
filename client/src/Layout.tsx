import { ReactNode } from "react";
import Footer from "./components/shared/Footer";
import Navbar from "./components/shared/Navbar";

interface LayoutProps {
	children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
	return (
		<div className="flex flex-col min-h-screen overflow-hidden">
			<Navbar />
			<main className="flex-grow overflow-y-auto">{children}</main>
			<Footer />
		</div>
	);
}
