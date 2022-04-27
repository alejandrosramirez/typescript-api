import { DateTime } from "luxon";
import Hash from "@ioc:Adonis/Core/Hash";
import { compose } from "@ioc:Adonis/Core/Helpers";
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
}
