// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ThemeProvider } from "./components/ThemeProvider.tsx";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import { store } from "./features/store.ts";

createRoot(document.getElementById("root")!).render(
	// <StrictMode>
	<Provider store={store}>
		<ThemeProvider
			attribute="class"
			defaultTheme="dark"
			enableSystem
			disableTransitionOnChange
			// themes={[
			// 	"light",
			// 	"dark",
			// 	"light-green",
			// 	"dark-green",
			// 	"light-rose",
			// 	"dark-rose",
			// 	"light-yellow",
			// 	"dark-yellow",
			// 	"light-blue",
			// 	"dark-blue",
			// ]}
			storageKey="vite-ui-theme"
		>
			<Toaster position="top-center" />
			<App />
		</ThemeProvider>
	</Provider>
	// </StrictMode>
);
