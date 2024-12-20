const getBaseUrl = () =>
	process.env.NODE_ENV === "development"
		? "http://localhost:5174"
		: process.env.DOMAIN;

export default getBaseUrl;
