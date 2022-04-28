import BaseSeeder from "@ioc:Adonis/Lucid/Seeder";

import Permission from "App/Models/Permission/Permission";
import Role from "App/Models/Permission/Role";

export default class RolesAndPermissionsSeeder extends BaseSeeder {
	public async run() {
		await Permission.create({
			name: "users_create",
			description: "Crear usuarios",
		});

		await Permission.create({
			name: "users_read",
			description: "Leer usuarios",
		});

		await Permission.create({
			name: "users_update",
			description: "Editar usuarios",
		});

		await Permission.create({
			name: "users_delete",
			description: "Eliminar usuarios",
		});

		const role = await Role.create({
			name: "administrator",
			description: "Administrador",
		});
		role.related("permissions").sync(
			(await Permission.all()).map((permission) => permission.id)
		);
	}
}
