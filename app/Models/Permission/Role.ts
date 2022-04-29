import { DateTime } from "luxon";
import { compose, types } from "@ioc:Adonis/Core/Helpers";
import {
	BaseModel,
	beforeSave,
	column,
	ManyToMany,
	manyToMany,
} from "@ioc:Adonis/Lucid/Orm";
import { v4 as uuidV4 } from "uuid";
import { SoftDeletes } from "@ioc:Adonis/Addons/LucidSoftDeletes";

// own
import Permission from "App/Models/Permission/Permission";
import User from "App/Models/User";

export default class Role extends compose(BaseModel, SoftDeletes) {
	@column({ isPrimary: true })
	public id: number;

	@column()
	public uuid: string;

	@column()
	public name: string;

	@column()
	public description: string;

	@column.dateTime({ autoCreate: true })
	public createdAt: DateTime;

	@column.dateTime({ autoCreate: true, autoUpdate: true })
	public updatedAt: DateTime;

	@beforeSave()
	public static async hasUuid(role: Role) {
		if (!role.uuid) {
			role.uuid = uuidV4();
		}
	}

	@manyToMany(() => Permission, {
		pivotTable: "permission_role",
		pivotTimestamps: true,
	})
	public permissions: ManyToMany<typeof Permission>;

	@manyToMany(() => User, {
		pivotTable: "role_user",
		pivotTimestamps: true,
	})
	public users: ManyToMany<typeof User>;

	/**
	 * Assigns role permissions
	 */
	public async assignPermission(permissions: string[] | string | number) {
		const permissionsToAssign: number[] = [];

		if (types.isArray(permissions)) {
			for (const p of permissions) {
				const selectedPermission = await Permission.findByOrFail(
					"name",
					p
				);
				permissionsToAssign.push(selectedPermission.id);
			}
		} else if (types.isString(permissions)) {
			const selectedPermission = await Permission.findByOrFail(
				"name",
				permissions
			);
			permissionsToAssign.push(selectedPermission.id);
		} else {
			const selectedPermission = await Permission.findByOrFail(
				"id",
				permissions
			);
			permissionsToAssign.push(selectedPermission.id);
		}

		this.related("permissions" as any).sync(permissionsToAssign);
	}

	/**
	 * Refresh role permissions
	 */
	public async syncPermission(permissions: string[] | string | number) {
		this.related("permissions" as any).detach();

		await this.assignPermission(permissions);
	}

	/**
	 * Revoke role permission
	 */
	public async revokePermission(permission: string) {
		const selectedPermission = await Permission.findByOrFail(
			"name",
			permission
		);

		this.related("permissions" as any).detach([selectedPermission.id]);
	}
}
