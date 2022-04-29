import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { RequestContract } from "@ioc:Adonis/Core/Request";
import { rules, schema } from "@ioc:Adonis/Core/Validator";

// own
import User from "App/Models/User";

export default class UsersController {
	public async index({ request, response }: HttpContextContract) {
		const page = request.input("page") || 1;
		const size = request.input("size") || 20;
		const search = request.input("search") || "";

		const users = await User.query()
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

	public async store({}: HttpContextContract) {}

	public async show({}: HttpContextContract) {}

	public async update({}: HttpContextContract) {}

	public async destroy({}: HttpContextContract) {}

	private async handleRequest(request: RequestContract, uuid = "NULL") {
		const passwordValidation = uuid === "NULL" ? [rules.required()] : [];

		const uniqueEmailValidation =
			uuid === "NULL"
				? [rules.unique({ table: "users", column: "email" })]
				: [];

		const validateSchema = schema.create({
			firstname: schema.string({ trim: true }, [
				rules.required(),
				rules.maxLength(255),
			]),
			lastname: schema.string({ trim: true }, [
				rules.required(),
				rules.maxLength(255),
			]),
			phone: schema.string({ trim: true }, [
				rules.required(),
				rules.maxLength(30),
			]),
			email: schema.string({ trim: true }, [
				rules.required(),
				rules.email(),
				...uniqueEmailValidation,
			]),
			password: schema.string({ trim: true }, [
				...passwordValidation,
				rules.minLength(8),
			]),
		});

		const validated = await request.validate({ schema: validateSchema });

		return validated;
	}
}
