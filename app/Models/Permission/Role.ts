import { DateTime } from "luxon";
import { compose } from "@ioc:Adonis/Core/Helpers";
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

	@manyToMany(() => User, { pivotTable: "role_user", pivotTimestamps: true })
	public users: ManyToMany<typeof User>;
}
