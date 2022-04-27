import BaseSeeder from "@ioc:Adonis/Lucid/Seeder";
import { DateTime } from "luxon";

import User from "App/Models/User";

export default class UsersSeederSeeder extends BaseSeeder {
	public async run() {
		await User.create({
			email: "alejandrosram@outlook.com",
			emailVerifiedAt: DateTime.now(),
			password: "1234567890",
			phone: "3330204397",
		});
	}
}
