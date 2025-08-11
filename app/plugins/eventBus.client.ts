import mitt from "mitt";
import { defineNuxtPlugin } from "nuxt/app";

export default defineNuxtPlugin(() => {
	const eventBus = mitt();

	return {
		provide: {
			eventBus,
		},
	};
});
