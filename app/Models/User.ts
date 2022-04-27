import { DateTime } from "luxon";
import Hash from "@ioc:Adonis/Core/Hash";
import { column, beforeSave, BaseModel } from "@ioc:Adonis/Lucid/Orm";
import { v4 as uuidV4 } from "uuid";

export default class User extends BaseModel {
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
}
