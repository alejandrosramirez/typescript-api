/*
|--------------------------------------------------------------------------
| Http Exception Handler
|--------------------------------------------------------------------------
|
| AdonisJs will forward all exceptions occurred during an HTTP request to
| the following class. You can learn more about exception handling by
| reading docs.
|
| The exception handler extends a base `HttpExceptionHandler` which is not
| mandatory, however it can do lot of heavy lifting to handle the errors
| properly.
|
*/

import Env from "@ioc:Adonis/Core/Env";
import Logger from "@ioc:Adonis/Core/Logger";
import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import HttpExceptionHandler from "@ioc:Adonis/Core/HttpExceptionHandler";

export default class ExceptionHandler extends HttpExceptionHandler {
	constructor() {
		super(Logger);
	}

	public async handle(error: any, ctx: HttpContextContract) {
		console.log(error);

		if (!Env.get("APP_ENABLE_CUSTOM_HANDLER")) {
			return super.handle(error, ctx);
		}

		if (error.code === "E_UNAUTHORIZED_ACCESS") {
			return ctx.response.status(401).send({
				error: {
					message: "Unauthorized access",
					code: "E_UNAUTHORIZED_ACCESS",
				},
			});
		}

		if (error.code === "E_FORBIDDEN_ACCESS") {
			return ctx.response.status(403).send({
				error: {
					message: "Forbidden access",
					code: "E_FORBIDDEN_ACCESS",
				},
			});
		}

		if (error.code === "E_ROUTE_NOT_FOUND") {
			return ctx.response.status(404).send({
				error: {
					message: "Route not found",
					code: "E_ROUTE_NOT_FOUND",
				},
			});
		}

		if (
			error.code === "ER_NO_DEFAULT_FOR_FIELD" ||
			error.code === "ER_DUP_ENTRY"
		) {
			return ctx.response.status(409).send({
				error: {
					message: "Can't process query",
					code: "DATABASE_ERROR",
				},
			});
		}

		if (error.code === "E_REQUEST_ENTITY_TOO_LARGE") {
			return ctx.response.status(413).send({
				error: {
					message: "Request entity too large",
					code: "E_REQUEST_ENTITY_TOO_LARGE",
				},
			});
		}

		if (error.code === "E_VALIDATION_FAILURE") {
			return ctx.response.status(422).send({
				error: {
					message: "Validation failure",
					code: "E_VALIDATION_FAILURE",
				},
			});
		}

		return ctx.response.status(500).send({
			error: {
				message: "Internal server error",
				code: "E_INTERNAL_SERVER_ERROR",
			},
		});
	}
}
