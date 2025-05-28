export default defineNuxtRouteMiddleware((to) => {
	const { user } = useAuth();
	const excludedPaths = ["/", "/signup", "/login"];

	if (excludedPaths.includes(to.path)) {
		return;
	}

	else if (!user.value) {
		return navigateTo("/login");
	}
});
