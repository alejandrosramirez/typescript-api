import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { RequestContract } from "@ioc:Adonis/Core/Request";
import { rules, schema } from "@ioc:Adonis/Core/Validator";

// own
import User from "App/Models/User";

export default class UsersController {
	public async index({ auth, request, response }: HttpContextContract) {
		const page = request.input("page") || 1;
		const size = request.input("size") || 20;
		const search = request.input("search") || "";

		const users = await User.query()
			.where("id", "!=", auth!.user!.id)
			.where((query) => {
				query
					.where("email", "like", `%${search}%`)
					.orWhereHas("roles", (query) => {
						query.where("description", "like", `%${search}%`);
					})
					.orWhereHas("profile", (query) => {
						query.where("firstname", "like", `%${search}%`);
					});
			})
			.paginate(page, size);

		return response.json(users);
	}

	public async store({ request, response }: HttpContextContract) {
		const { firstname, lastname, phone, email, password } =
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

		return response.json({ user });
	}

	public async show({ request, response }: HttpContextContract) {
		const uuid = request.param("uuid");

		const user = await User.findByOrFail("uuid", uuid);

		await user.load("profile");
		await user.load("roles");

		return response.json({ user });
	}

	public async update({ request, response }: HttpContextContract) {
		const uuid = request.param("uuid");

		const user = await User.findByOrFail("uuid", uuid);

		const { firstname, lastname, phone, email, password } =
			await this.handleRequest(request, uuid);

		user.email = email;
		if (password) {
			user.password = password;
		}
		user.phone = phone;
		await user.save();

		await user.related("profile").updateOrCreate(
			{ userId: user.id },
			{
				firstname,
				lastname,
			}
		);

		return response.json({ user });
	}

	public async destroy({ request, response }: HttpContextContract) {
		const uuid = request.param("uuid");

		const user = await User.findByOrFail("uuid", uuid);

		await user.delete();

		return response.json({ user });
	}

	private async handleRequest(request: RequestContract, uuid = "NULL") {
		const passwordValidation = uuid === "NULL" ? [rules.required()] : [];

		const uniqueEmailValidation =
			uuid === "NULL"
				? [rules.unique({ table: "users", column: "email" })]
				: [];

		const validateSchema = schema.create({
			firstname: schema.string([rules.maxLength(255)]),
			lastname: schema.string([rules.maxLength(255)]),
			phone: schema.string([rules.maxLength(30)]),
			email: schema.string([rules.email(), ...uniqueEmailValidation]),
			password: schema.string.optional([
				...passwordValidation,
				rules.minLength(8),
			]),
		});

		const validated = await request.validate({ schema: validateSchema });

		return validated;
	}
}
