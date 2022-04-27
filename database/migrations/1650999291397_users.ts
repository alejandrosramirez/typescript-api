import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class UsersSchema extends BaseSchema {
	protected tableName = "users";

	public async up() {
		this.schema.createTable(this.tableName, (table) => {
			table.increments("id").primary();
			table.uuid("uuid").index().unique().notNullable();
			table.string("email", 255).unique().notNullable();
			table.timestamp("email_verified_at").nullable();
			table.string("password").notNullable();
			table.string("phone").notNullable();
			table.string("remember_me_token").nullable();

			/**
			 * Uses timestampz for PostgreSQL and DATETIME2 for MSSQL
			 */
			table.timestamp("created_at", { useTz: true }).notNullable();
			table.timestamp("updated_at", { useTz: true }).notNullable();

			table.timestamp("deleted_at").nullable();
		});
	}

	public async down() {
		this.schema.dropTable(this.tableName);
	}
}
