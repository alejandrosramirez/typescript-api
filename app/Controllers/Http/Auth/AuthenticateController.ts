import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { RequestContract } from "@ioc:Adonis/Core/Request";
import { rules, schema } from "@ioc:Adonis/Core/Validator";

export default class AuthenticateController {
	public async login({ auth, request, response }: HttpContextContract) {
		const { email, password } = await this.handleRequest(request);

		const { token } = await auth.use("api").attempt(email, password);

		const user = auth.use("api").user;

		await user?.load("profile");

		return response.json({
			token,
			user,
		});
	}

	private async handleRequest(request: RequestContract) {
		const validateSchema = schema.create({
			email: schema.string({ trim: true }, [rules.email()]),
			password: schema.string({ trim: true }, [rules.minLength(8)]),
		});

		const validated = await request.validate({ schema: validateSchema });

		return validated;
	}
}
