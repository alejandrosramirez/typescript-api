import Route from "@ioc:Adonis/Core/Route";

Route.group(() => {
	Route.group(() => {
		Route.group(() => {
			Route.post("/login", "Auth/AuthenticateController.login");
		}).prefix("/auth");
	});

	Route.group(() => {
		Route.group(() => {
			Route.get("/profile", "Auth/AuthenticateController.profile");
		}).prefix("/auth");

		Route.group(() => {
			Route.get("/", "Permission/PermissionsController.index");
		}).prefix("/permissions");

		Route.group(() => {
			Route.get("/", "Permission/RolesController.index");
			Route.post("/", "Permission/RolesController.store");
			Route.get("/:uuid", "Permission/RolesController.show");
			Route.put("/:uuid", "Permission/RolesController.update");
			Route.delete("/:uuid", "Permission/RolesController.destroy");
		}).prefix("/roles");

		Route.group(() => {
			Route.get("/", "User/UsersController.index");
			Route.post("/", "User/UsersController.store");
			Route.get("/:uuid", "User/UsersController.show");
			Route.put("/:uuid", "User/UsersController.update");
			Route.delete("/:uuid", "User/UsersController.destroy");
		}).prefix("/users");
	}).middleware("auth:api");
}).prefix("/api");
