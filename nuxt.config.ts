// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	modules: ["@nuxt/eslint", "@nuxtjs/google-fonts"],
	devtools: { enabled: true },
	css: ["@picocss/pico/css/pico.min.css", "@/assets/css/theme.css"],
	compatibilityDate: "2025-05-15",

	eslint: {
		config: {
			stylistic: {
				semi: true,
				quotes: "double",
				commaDangle: "always-multiline",
				indent: "tab",
			},
		},
	},
	googleFonts: {
		families: {
			Figtree: {
				wght: "300..900",
				ital: "300..900",
			},
		},
		display: "swap",
	},
});
