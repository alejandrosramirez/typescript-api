import { DateTime } from "luxon";
import { compose } from "@ioc:Adonis/Core/Helpers";
import {
	BaseModel,
	beforeSave,
	BelongsTo,
	belongsTo,
	column,
} from "@ioc:Adonis/Lucid/Orm";
import { v4 as uuidV4 } from "uuid";
import { SoftDeletes } from "@ioc:Adonis/Addons/LucidSoftDeletes";

// own
import User from "App/Models/User";

export default class Profile extends compose(BaseModel, SoftDeletes) {
	@column({ isPrimary: true })
	public id: number;

	@column()
	public uuid: string;

	@column()
	public userId: number;

	@column()
	public avatar: string;

	@column()
	public firstname: string;

	@column()
	public lastname: string;

	@column.dateTime({ autoCreate: true })
	public createdAt: DateTime;

	@column.dateTime({ autoCreate: true, autoUpdate: true })
	public updatedAt: DateTime;

	@beforeSave()
	public static async hasUuid(profile: Profile) {
		if (!profile.uuid) {
			profile.uuid = uuidV4();
		}
	}

	@belongsTo(() => User)
	public user: BelongsTo<typeof User>;
}
