import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

// own
import ForbiddenException from "App/Exceptions/ForbiddenException";

export default class Permission {
	protected async checkPermission(
		auth: HttpContextContract["auth"],
		permission: string[]
	) {
		const user = auth.user;

		if (await user?.hasPermissionTo(permission)) {
			return true;
		}

		throw new ForbiddenException(
			"You are not authorized to perform this action"
		);
	}

	public async handle(
		{ auth }: HttpContextContract,
		next: () => Promise<void>,
		permission: string[]
	) {
		await this.checkPermission(auth, permission);
		await next();
	}
}
