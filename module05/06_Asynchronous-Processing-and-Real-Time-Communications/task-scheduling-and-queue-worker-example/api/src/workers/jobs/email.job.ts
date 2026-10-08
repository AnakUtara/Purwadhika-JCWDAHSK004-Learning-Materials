import renderTemplate from "../../libs/handlebars.ts";
import EmailService from "../../modules/email/email.service.ts";

export const signUpEmailNotificationJob = async (data: {
	email: string;
	clientUrl: string;
	year: number;
}) => {
	EmailService.sendEmail(
		data.email,
		"Welcome to JCWD Blog App",
		renderTemplate("welcome.email.hbs", data),
	);
};
