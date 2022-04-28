import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

// own
import UnauthorizedException from "App/Exceptions/UnauthorizedException";

export default class Role {
	protected async checkRole(
		auth: HttpContextContract["auth"],
		role: string[]
	) {
		const user = auth.user;

		if (await user?.hasRole(role)) {
			return true;
		}

		throw new UnauthorizedException(
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
