<script setup>
import { AppDashboardAdmin, AppDashboardGames, AppDashboardProfile, AppDashboardSettings, AppDashboardTemplates, AppDashboardUser, AppDashboardBanAppeals } from "#components";
import { useNuxtApp } from "nuxt/app";

const activeView = ref("dashboard");
const route = useRoute();
const targetPath = route.query.activeViewComponent;
const router = useRouter();
const { $userStore } = useNuxtApp();
const isAdmin = computed(() => $userStore.role === "admin");

function navigate(view) {
	activeView.value = view;

	router.replace({
		path: "/dashboard",
		query: { activeViewComponent: view },
	});
}

if (targetPath && typeof targetPath === "string") {
	if (!isAdmin.value && (targetPath === "admin" || targetPath === "banAppeals")) {
		activeView.value = "dashboard";
		router.replace({
			path: "/dashboard",
			query: { activeViewComponent: "dashboard" },
		});
	}
	else {
		activeView.value = targetPath;
	}
}
else {
	router.replace({
		path: "/dashboard",
		query: { activeViewComponent: "dashboard" },
	});
}

const activeViewComponent = computed(() => {
	switch (activeView.value) {
		case "games":
			return AppDashboardGames;
		case "templates":
			return AppDashboardTemplates;
		case "admin":
			return AppDashboardAdmin;
		case "banAppeals":
			return AppDashboardBanAppeals;
		case "profile":
			return AppDashboardProfile;
		case "settings":
			return AppDashboardSettings;
		default:
			return AppDashboardUser;
	}
});
</script>

<template>
	<div class="dashboard-layout">
		<app-dashboard-sidebar
			:active="activeView"
			@navigate="navigate"
		/>
		<app-dashboard-content>
			<component :is="activeViewComponent" />
		</app-dashboard-content>
	</div>
</template>

<style lang="scss" scoped>
.dashboard-layout {
	display: flex;
	min-height: 100vh;
}
</style>
