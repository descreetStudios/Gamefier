// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	modules: ["@nuxt/eslint", "@nuxtjs/google-fonts", "nuxt-vuefire"],

	devtools: { enabled: true },
	css: ["@picocss/pico/css/pico.min.css", "@/assets/css/theme.css"],

	runtimeConfig: {
		public: {
			NUXT_PUBLIC_FIREBASE_API_KEY: process.env.NUXT_PUBLIC_FIREBASE_API_KEY,
			NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
			NUXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NUXT_PUBLIC_FIREBASE_PROJECT_ID,
			NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
			NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
			NUXT_PUBLIC_FIREBASE_APP_ID: process.env.NUXT_PUBLIC_FIREBASE_APP_ID,
			NUXT_PUBLIC_FIREBASE_MEASUREMENT_ID: process.env.NUXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
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
			apiKey: process.env.NUXT_PUBLIC_FIREBASE_API_KEY,
			authDomain: process.env.NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
			projectId: process.env.NUXT_PUBLIC_FIREBASE_PROJECT_ID,
			storageBucket: process.env.NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
			messagingSenderId: process.env.NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
			appId: process.env.NUXT_PUBLIC_FIREBASE_APP_ID,
			measurementId: process.env.NUXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
		},
	},

});
