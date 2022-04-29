import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { RequestContract } from "@ioc:Adonis/Core/Request";
import { rules, schema } from "@ioc:Adonis/Core/Validator";

// own
import User from "App/Models/User";

export default class RegistersController {
	public async store({ request, response }: HttpContextContract) {
		const { firstname, lastname, email, password, phone } =
			await this.handleRequest(request);

		const user = await User.create({
			email,
			password,
			phone,
		});

		await user.related("profile").create({
			firstname,
			lastname,
		});

		return response.json({
			user,
		});
	}

	private async handleRequest(request: RequestContract) {
		const validateSchema = schema.create({
			firstname: schema.string([rules.required(), rules.maxLength(255)]),
			lastname: schema.string([rules.required(), rules.maxLength(255)]),
			email: schema.string([rules.required(), rules.email()]),
			password: schema.string([rules.required(), rules.minLength(8)]),
			phone: schema.string([rules.required(), rules.maxLength(30)]),
		});

		const validated = await request.validate({ schema: validateSchema });

		return validated;
	}
}
