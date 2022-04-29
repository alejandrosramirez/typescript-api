import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { RequestContract } from "@ioc:Adonis/Core/Request";
import { rules, schema } from "@ioc:Adonis/Core/Validator";
import { string } from "@ioc:Adonis/Core/Helpers";

// own
import Role from "App/Models/Permission/Role";
import DefaultException from "App/Exceptions/DefaultException";

export default class RolesController {
	public async index({ request, response }: HttpContextContract) {
		const page = request.input("page") || 1;
		const size = request.input("size") || 20;
		const search = request.input("search") || "";

		const roles = await Role.query()
			.where((query) => {
				query
					.where("name", "like", `%${search}%`)
					.orWhere("description", "like", `%${search}%`);
			})
			.paginate(page, size);

		return response.json(roles);
	}

	public async store({ request, response }: HttpContextContract) {
		const { description, permissions } = await this.handleRequest(request);

		const role = await Role.create({
			name: string.snakeCase(description),
			description,
		});

		await role.assignPermission(permissions);

		return response.json({
			role,
		});
	}

	public async show({ request, response }: HttpContextContract) {
		const uuid = request.param("uuid");

		const role = await Role.findByOrFail("uuid", uuid);

		await role.load("users");

		return response.json({
			role,
		});
	}

	public async update({ request, response }: HttpContextContract) {
		const uuid = request.param("uuid");

		const role = await Role.findByOrFail("uuid", uuid);

		const { description, permissions } = await this.handleRequest(
			request,
			uuid
		);

		role.name = string.snakeCase(description);
		role.description = description;

		await role.save();

		await role.syncPermission(permissions);

		return response.json({
			role,
		});
	}

	public async destroy({ request, response }: HttpContextContract) {
		const uuid = request.param("uuid");

		const role = await Role.findByOrFail("uuid", uuid);

		await role.load("users");

		if (role.users.length > 0) {
			throw new DefaultException(
				"Can't delete record because is already in use"
			);
		}

		await role.delete();

		return response.json({
			role,
		});
	}

	private async handleRequest(request: RequestContract, uuid = "NULL") {
		const uniqueDescriptionValidation =
			uuid === "NULL"
				? [
						rules.unique({
							table: "roles",
							column: "name",
							where: { uuid },
						}),
				  ]
				: [];

		const validateSchema = schema.create({
			description: schema.string({ trim: true }, [
				rules.required(),
				rules.maxLength(255),
				...uniqueDescriptionValidation,
			]),
			permissions: schema
				.array([rules.required(), rules.minLength(1)])
				.members(schema.string()),
		});

		const validated = await request.validate({ schema: validateSchema });

		return validated;
	}
}
