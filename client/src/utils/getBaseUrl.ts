const getBaseUrl = () =>
	process.env.NODE_ENV === "development"
		? "http://localhost:5173"
		: process.env.DOMAIN;

export default getBaseUrl;
