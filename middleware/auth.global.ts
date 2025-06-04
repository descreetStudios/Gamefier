export default defineNuxtRouteMiddleware(async (to) => {
  if (process.server) return;

  const { user, userData, authLoading } = useAuth();
  const excludedPaths = ["/", "/signup", "/login"];
  
  if (authLoading.value) {
    await new Promise((resolve) => {
      const unwatch = watch(authLoading, (loading) => {
        if (!loading) {
          unwatch();
          resolve(undefined);
        }
      });
    });
  }

  console.log("🔍 Stato utente:", user.value);
  console.log("🔍 Dati Firestore:", userData.value);
  console.log("Role: ", userData.value?.role);

  if (excludedPaths.includes(to.path)) {
      return;
  }

  if (user.value && ["/login", "/signup"].includes(to.path)) {
    return navigateTo("/");
  }

  if (userData.value?.role!=="admin" && ["/admin"].includes(to.path)) {
    return navigateTo("/");
  }

  if (!user.value) {
		return navigateTo("/login");
	}
});
