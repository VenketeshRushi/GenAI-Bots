const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
dotenv.config();

const transporter = nodemailer.createTransport({
	host: process.env.SMTP_HOST,
	port: process.env.SMTP_PORT,
	secure: true,
	auth: {
		user: process.env.SMTP_USERNAME,
		pass: process.env.SMTP_PASSWORD,
	},
});

async function sendEmail(email, subject, body) {
	console.log("Message send Commented");

	if (email && subject && body) {
		try {
			const info = await transporter.sendMail({
				from: process.env.SMTP_SERVICE,
				to: email,
				subject: subject,
				html: body,
			});

			console.log("Message sent: %s", info.messageId);
		} catch (err) {
			console.log("sendEmail err", err);
		}
	} else {
		console.log("Email/Body/Subject missing");
	}
}

function parseHTMLVariables(variables, htmlTemplate) {
	var newHTML = htmlTemplate;
	for (var i = 0; i < variables.length; i++) {
		let regExp = new RegExp(`%%{${variables[i].name}}%%`, "g");
		let count = (newHTML.match(regExp) || []).length;
		for (var j = 0; j < count; j++) {
			newHTML = newHTML.replace(
				`%%{${variables[i].name}}%%`,
				variables[i].value
			);
		}
	}
	return newHTML;
}

module.exports = {
	sendEmail,
	parseHTMLVariables,
};
