import { Exception } from "@adonisjs/core/build/standalone";

/*
|--------------------------------------------------------------------------
| Exception
|--------------------------------------------------------------------------
|
| The Exception class imported from `@adonisjs/core` allows defining
| a status code and error code for every exception.
|
| @example
| new DefaultException('message', 500, 'E_RUNTIME_EXCEPTION')
|
*/
export default class DefaultException extends Exception {
	constructor(message: string, status = 400, code = "E_DEFAULT") {
		super(message, status, code);
	}
}