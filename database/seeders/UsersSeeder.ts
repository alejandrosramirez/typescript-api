import BaseSeeder from "@ioc:Adonis/Lucid/Seeder";
import { DateTime } from "luxon";

// own
import User from "App/Models/User";

export default class UsersSeeder extends BaseSeeder {
	public async run() {
		const user = await User.create({
			email: "alejandrosram@outlook.com",
			emailVerifiedAt: DateTime.now(),
			password: "1234567890",
			phone: "3330204397",
		});
		await user.related("profile").create({
			firstname: "Miguel Alejandro",
			lastname: "Salgado Ramírez",
		});
		await user.assignRole("administrator");
	}
}
