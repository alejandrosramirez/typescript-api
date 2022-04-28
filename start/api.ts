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
	}).middleware("auth:api");
}).prefix("/api");
