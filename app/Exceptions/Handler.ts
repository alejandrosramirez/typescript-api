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

import Logger from "@ioc:Adonis/Core/Logger";
import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import HttpExceptionHandler from "@ioc:Adonis/Core/HttpExceptionHandler";

export default class ExceptionHandler extends HttpExceptionHandler {
	constructor() {
		super(Logger);
	}

	public async handle(error: any, ctx: HttpContextContract) {
		console.log(error.code);
		if (
			error.code === "E_INVALID_AUTH_UID" ||
			error.code === "E_INVALID_AUTH_PASSWORD"
		) {
			return super.handle(error, ctx);
		}

		if (error.code === "E_DEFAULT") {
			return ctx.response
				.status(400)
				.send(
					this.customErrorResponse(0, "default_error", error.message)
				);
		}

		if (error.code === "E_UNAUTHORIZED_ACCESS") {
			return ctx.response
				.status(401)
				.json(
					this.customErrorResponse(
						0,
						"authentication_error",
						"Unauthenticated."
					)
				);
		}

		if (error.code === "E_ROW_NOT_FOUND") {
			return ctx.response
				.status(404)
				.send(
					this.customErrorResponse(
						0,
						"model_not_found_error",
						"Model not found"
					)
				);
		}

		if (error.code === "E_ROUTE_NOT_FOUND") {
			return ctx.response
				.status(404)
				.send(
					this.customErrorResponse(
						0,
						"not_found_http_error",
						"Url doesn't exist."
					)
				);
		}

		if (error.code === "E_REQUEST_ENTITY_TOO_LARGE") {
			return ctx.response
				.status(413)
				.send(
					this.customErrorResponse(
						0,
						"post_too_large_error",
						"Request body is too large"
					)
				);
		}

		if (error.code === "E_VALIDATION_FAILURE") {
			let errorMessagesBag = {};

			for (const value of error.messages.errors) {
				errorMessagesBag[value.field] = [value.message];
			}

			return ctx.response
				.status(422)
				.send(
					this.customErrorResponse(
						0,
						"validation_error",
						errorMessagesBag
					)
				);
		}

		return ctx.response
			.status(500)
			.send(
				this.customErrorResponse(
					0,
					"internal_server_error",
					"A server error has ocurred."
				)
			);
	}

	public customErrorResponse(
		code: string | number,
		type: string,
		body: string | object | Array<any>
	) {
		return {
			error: {
				code,
				type,
				body,
			},
		};
	}
}
