import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

// own
import ForbiddenException from "App/Exceptions/ForbiddenException";

export default class Role {
	protected async checkRole(
		auth: HttpContextContract["auth"],
		role: string[]
	) {
		const user = auth.user;

		if (await user?.hasRole(role)) {
			return true;
		}

		throw new ForbiddenException(
			"You are not authorized to perform this action"
		);
	}

	public async handle(
		{ auth }: HttpContextContract,
		next: () => Promise<void>,
		role: string[]
	) {
		await this.checkRole(auth, role);
		await next();
	}
}
