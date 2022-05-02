import Env from "@ioc:Adonis/Core/Env";
import Vonage from "@vonage/server-sdk";

export default class HandleSms {
	public static sms(phone: string, message: string) {
		const client = new Vonage({
			apiKey: Env.get("VONAGE_KEY"),
			apiSecret: Env.get("VONAGE_SECRET"),
		});

		client.message.sendSms(
			Env.get("APP_NAME"),
			`52${phone}`,
			message,
			{},
			(err, response) => {
				if (err) {
					console.error(err);
				} else {
					if (response.messages[0]["status"] !== "0") {
						console.error(response.messages[0]["error-text"]);
					}
				}
			}
		);
	}
}
