// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	modules: ["@nuxt/eslint", "@nuxtjs/google-fonts", "nuxt-vuefire"],

	devtools: { enabled: true },
	css: ["@picocss/pico/css/pico.min.css", "@/assets/css/theme.css"],

	runtimeConfig: {
		firebase: {
			FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
			FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
			FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
			FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
			FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID,
			FIREBASE_APP_ID: process.env.FIREBASE_APP_ID,
			FIREBASE_MEASUREMENT_ID: process.env.FIREBASE_MEASUREMENT_ID,
		},
	},

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

	vuefire: {
		config: {
			apiKey: process.env.FIREBASE_API_KEY,
			authDomain: process.env.FIREBASE_AUTH_DOMAIN,
			projectId: process.env.FIREBASE_PROJECT_ID,
			storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
			messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
			appId: process.env.FIREBASE_APP_ID,
			measurementId: process.env.FIREBASE_MEASUREMENT_ID,
		},
	},

});
