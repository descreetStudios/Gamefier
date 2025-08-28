// nuxt.config.ts
import svgLoader from "vite-svg-loader";

export default defineNuxtConfig({
	modules: [
		"@nuxt/eslint",
		"@nuxtjs/google-fonts",
		"@pinia/nuxt",
		"@nuxt/image",
		"@nuxt/icon",
	],
	plugins: ["~/plugins/store-injector.ts"],

	devtools: { enabled: true },
	css: ["@picocss/pico/css/pico.min.css", "@/assets/css/theme.css"],

	runtimeConfig: {
		public: {
			NUXT_PUBLIC_FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
			NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
			NUXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
			NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
			NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID,
			NUXT_PUBLIC_FIREBASE_APP_ID: process.env.FIREBASE_APP_ID,
			NUXT_PUBLIC_FIREBASE_MEASUREMENT_ID: process.env.FIREBASE_MEASUREMENT_ID,
		},
	},

	compatibilityDate: "2025-05-15",

	vite: {
		plugins: [svgLoader()],
	},

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

	icon: {
		server: {
			bundle: process.env.NODE_ENV === "production" ? "local" : "cdn",
		},
	},

	image: {
		provider: "ipx",
		format: ["webp"],
		presets: {
			default: {
				format: "webp",
			},
		},
	},
});
