import { DateTime } from "luxon";
import Hash from "@ioc:Adonis/Core/Hash";
import { compose, types } from "@ioc:Adonis/Core/Helpers";
import {
	column,
	beforeSave,
	BaseModel,
	manyToMany,
	ManyToMany,
	hasOne,
	HasOne,
} from "@ioc:Adonis/Lucid/Orm";
import { v4 as uuidV4 } from "uuid";
import { SoftDeletes } from "@ioc:Adonis/Addons/LucidSoftDeletes";

// own
import Permission from "App/Models/Permission/Permission";
import Role from "App/Models/Permission/Role";
import Profile from "App/Models/Profile";

export default class User extends compose(BaseModel, SoftDeletes) {
	@column({ isPrimary: true })
	public id: number;

	@column()
	public uuid: string;

	@column()
	public email: string;

	@column.dateTime()
	public emailVerifiedAt?: DateTime;

	@column({ serializeAs: null })
	public password: string;

	@column()
	public phone: string;

	@column()
	public rememberMeToken?: string;

	@column.dateTime({ autoCreate: true })
	public createdAt: DateTime;

	@column.dateTime({ autoCreate: true, autoUpdate: true })
	public updatedAt: DateTime;

	@column.dateTime()
	public deletedAt: DateTime;

	@beforeSave()
	public static async hashPassword(user: User) {
		if (user.$dirty.password) {
			user.password = await Hash.make(user.password);
		}
	}

	@beforeSave()
	public static async hasUuid(user: User) {
		if (!user.uuid) {
			user.uuid = uuidV4();
		}
	}

	@manyToMany(() => Permission, {
		pivotTable: "permission_user",
		pivotTimestamps: true,
	})
	public permissions: ManyToMany<typeof Permission>;

	@manyToMany(() => Role, { pivotTable: "role_user", pivotTimestamps: true })
	public roles: ManyToMany<typeof Role>;

	@hasOne(() => Profile)
	public profile: HasOne<typeof Profile>;

	public async assignRole(roles: string[] | string | number) {
		const rolesToAssign: number[] = [];

		if (types.isArray(roles)) {
			for (const r of roles) {
				const selectedRole = await Role.findByOrFail("name", r);
				rolesToAssign.push(selectedRole.id);
			}
		} else if (types.isString(roles)) {
			const selectedRole = await Role.findByOrFail("name", roles);
			rolesToAssign.push(selectedRole.id);
		} else {
			const selectedRole = await Role.findByOrFail("id", roles);
			rolesToAssign.push(selectedRole.id);
		}

		this.related("roles" as any).sync(rolesToAssign);
	}

	public async syncRoles(roles: string[] | string | number) {
		this.related("roles" as any).detach();

		await this.assignRole(roles);
	}

	public async revokeRole(role: string) {
		const selectedRole = await Role.findByOrFail("name", role);

		this.related("roles" as any).detach([selectedRole.id]);
	}

	public async hasRole(roles: string[]) {
		await this.load("roles" as any);

		for (const role of roles) {
			if (this.roles.find((r) => r.name === role)) {
				return true;
			}
		}

		return false;
	}

	public async hasPermission(permissions: string[]) {
		await this.load("permissions" as any);

		for (const permission of permissions) {
			if (this.permissions.find((p) => p.name === permission)) {
				return true;
			}
		}

		return false;
	}

	public async hasPermissionThroughRole(permissions: string[]) {
		await this.load("roles" as any, (query) => {
			query.preload("permissions");
		});

		for (const permission of permissions) {
			for (const role of this.roles) {
				if (role.permissions.find((p) => p.name === permission)) {
					return true;
				}
			}
		}

		return false;
	}

	public async hasPermissionTo(permissions: string[]) {
		return (
			(await this.hasPermission(permissions)) ||
			(await this.hasPermissionThroughRole(permissions))
		);
	}
}
