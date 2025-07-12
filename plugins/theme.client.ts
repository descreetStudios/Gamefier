export default defineNuxtPlugin(() => {
	if (import.meta.client) {
		document.documentElement.setAttribute("data-theme", "dark");
	}
});
