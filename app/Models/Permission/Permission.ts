import { DateTime } from "luxon";
import { compose } from "@ioc:Adonis/Core/Helpers";
import {
	BaseModel,
	column,
	ManyToMany,
	manyToMany,
} from "@ioc:Adonis/Lucid/Orm";

// own
import Role from "App/Models/Permission/Role";
import User from "App/Models/User";

export default class Permission extends compose(BaseModel) {
	@column({ isPrimary: true })
	public id: number;

	@column()
	public name: string;

	@column()
	public description: string;

	@column.dateTime({ autoCreate: true })
	public createdAt: DateTime;

	@column.dateTime({ autoCreate: true, autoUpdate: true })
	public updatedAt: DateTime;

	@manyToMany(() => Role, {
		pivotTable: "permission_role",
		pivotTimestamps: true,
	})
	public roles: ManyToMany<typeof Role>;

	@manyToMany(() => User, {
		pivotTable: "permission_user",
		pivotTimestamps: true,
	})
	public users: ManyToMany<typeof User>;
}
