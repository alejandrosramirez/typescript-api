import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class Profiles extends BaseSchema {
	protected tableName = "profiles";

	public async up() {
		this.schema.createTable(this.tableName, (table) => {
			table.increments("id");
			table.uuid("uuid").index().unique().notNullable();
			table
				.integer("user_id")
				.unsigned()
				.references("id")
				.inTable("users");
			table.string("avatar").nullable();
			table.string("firstname").notNullable();
			table.string("lastname").notNullable();

			/**
			 * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
			 */
			table.timestamp("created_at", { useTz: true });
			table.timestamp("updated_at", { useTz: true });
			table.timestamp("deleted_at", { useTz: true });
		});
	}

	public async down() {
		this.schema.dropTable(this.tableName);
	}
}
