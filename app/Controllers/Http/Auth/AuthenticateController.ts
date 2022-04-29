import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { RequestContract } from "@ioc:Adonis/Core/Request";
import { rules, schema } from "@ioc:Adonis/Core/Validator";
import Env from "@ioc:Adonis/Core/Env";

export default class AuthenticateController {
	public async login({ auth, request, response }: HttpContextContract) {
		const { email, password } = await this.handleRequest(request);

		const { token } = await auth.use("api").attempt(email, password, {
			expiresIn: Env.get("AUTH_EXPIRES_IN", "7d"),
		});

		const user = auth.use("api").user;

		await user?.load("profile");

		return response.json({
			token,
			user,
		});
	}

	public async logout({ auth, response }: HttpContextContract) {
		return response.json({
			logout: await auth.use("api").revoke(),
		});
	}

	public async profile({ auth, response }: HttpContextContract) {
		const user = auth.user;

		await user?.load((loader) => {
			loader.load("profile").load("roles", (query) => {
				query.preload("permissions");
			});
		});

		return response.json({
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
