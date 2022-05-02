/*
|--------------------------------------------------------------------------
| Validating Environment Variables
|--------------------------------------------------------------------------
|
| In this file we define the rules for validating environment variables.
| By performing validation we ensure that your application is running in
| a stable environment with correct configuration values.
|
| This file is read automatically by the framework during the boot lifecycle
| and hence do not rename or move this file to a different location.
|
*/

import Env from "@ioc:Adonis/Core/Env";

export default Env.rules({
	HOST: Env.schema.string({ format: "host" }),
	PORT: Env.schema.number(),
	APP_KEY: Env.schema.string(),
	APP_NAME: Env.schema.string(),
	DRIVE_DISK: Env.schema.enum(["local"] as const),
	NODE_ENV: Env.schema.enum(["development", "production", "test"] as const),

	AUTH_EXPIRES_IN: Env.schema.string(),

	SESSION_DRIVER: Env.schema.string(),

	DB_CONNECTION: Env.schema.string(),

	MYSQL_HOST: Env.schema.string({ format: "host" }),
	MYSQL_PORT: Env.schema.number(),
	MYSQL_USER: Env.schema.string(),
	MYSQL_PASSWORD: Env.schema.string.optional(),
	MYSQL_DB_NAME: Env.schema.string(),

	PG_HOST: Env.schema.string({ format: "host" }),
	PG_PORT: Env.schema.number(),
	PG_USER: Env.schema.string(),
	PG_PASSWORD: Env.schema.string.optional(),
	PG_DB_NAME: Env.schema.string(),

	MSSQL_SERVER: Env.schema.string({ format: "host" }),
	MSSQL_PORT: Env.schema.number(),
	MSSQL_USER: Env.schema.string(),
	MSSQL_PASSWORD: Env.schema.string.optional(),
	MSSQL_DB_NAME: Env.schema.string(),

	ORACLE_HOST: Env.schema.string({ format: "host" }),
	ORACLE_PORT: Env.schema.number(),
	ORACLE_USER: Env.schema.string(),
	ORACLE_PASSWORD: Env.schema.string.optional(),
	ORACLE_DB_NAME: Env.schema.string(),

	DISCORD_CLIENT_ID: Env.schema.string(),
	DISCORD_CLIENT_SECRET: Env.schema.string(),

	GOOGLE_CLIENT_ID: Env.schema.string(),
	GOOGLE_CLIENT_SECRET: Env.schema.string(),

	TWITTER_CLIENT_ID: Env.schema.string(),
	TWITTER_CLIENT_SECRET: Env.schema.string(),

	GITHUB_CLIENT_ID: Env.schema.string(),
	GITHUB_CLIENT_SECRET: Env.schema.string(),

	FACEBOOK_CLIENT_ID: Env.schema.string(),
	FACEBOOK_CLIENT_SECRET: Env.schema.string(),

	SPOTIFY_CLIENT_ID: Env.schema.string(),
	SPOTIFY_CLIENT_SECRET: Env.schema.string(),

	SMTP_HOST: Env.schema.string({ format: "host" }),
	SMTP_PORT: Env.schema.number(),
	SMTP_USERNAME: Env.schema.string(),
	SMTP_PASSWORD: Env.schema.string(),

	SES_ACCESS_KEY: Env.schema.string(),
	SES_ACCESS_SECRET: Env.schema.string(),
	SES_REGION: Env.schema.string(),

	MAILGUN_API_KEY: Env.schema.string(),
	MAILGUN_DOMAIN: Env.schema.string(),

	SPARKPOST_API_KEY: Env.schema.string(),

	REDIS_CONNECTION: Env.schema.enum(["local"] as const),
	REDIS_HOST: Env.schema.string({ format: "host" }),
	REDIS_PORT: Env.schema.number(),
	REDIS_PASSWORD: Env.schema.string.optional(),

	STRIPE_SECRET_KEY: Env.schema.string(),
	STRIPE_PUBLIC_KEY: Env.schema.string(),
	STRIPE_WEBHOOK_SECRET: Env.schema.string(),
	STRIPE_API_VERSION: Env.schema.string(),
	STRIPE_TYPESCRIPT: Env.schema.string(),

	S3_KEY: Env.schema.string(),
	S3_SECRET: Env.schema.string(),
	S3_BUCKET: Env.schema.string(),
	S3_REGION: Env.schema.string(),
	S3_ENDPOINT: Env.schema.string.optional(),

	GCS_KEY_FILENAME: Env.schema.string(),
	GCS_BUCKET: Env.schema.string(),

	VONAGE_KEY: Env.schema.string(),
	VONAGE_SECRET: Env.schema.string(),
});
