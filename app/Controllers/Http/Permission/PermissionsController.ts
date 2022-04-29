import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

// own
import Permission from "App/Models/Permission/Permission";

export default class PermissionsController {
	public async index({ request, response }: HttpContextContract) {
		const page = request.input("page") || 1;
		const size = request.input("size") || 20;
		const search = request.input("search") || "";

		const permissions = await Permission.query()
			.where((query) => {
				query
					.where("name", "like", `%${search}%`)
					.orWhere("description", "like", `%${search}%`);
			})
			.paginate(page, size);

		return response.json(permissions);
	}

	public async create({}: HttpContextContract) {}

	public async store({}: HttpContextContract) {}

	public async show({}: HttpContextContract) {}

	public async edit({}: HttpContextContract) {}

	public async update({}: HttpContextContract) {}

	public async destroy({}: HttpContextContract) {}
}
