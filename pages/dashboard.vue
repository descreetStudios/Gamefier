<script setup>
import { AppDashboardAdmin, AppDashboardGames, AppDashboardProfile, AppDashboardSettings, AppDashboardTemplates, AppDashboardUser } from "#components";

const activeView = ref("dashboard");
const route = useRoute();
const targetPath = route.query.activeViewComponent;
const router = useRouter();

function navigate(view) {
	activeView.value = view;

	router.replace({
		path: "/dashboard",
		query: { activeViewComponent: view },
	});
}

if (targetPath && typeof targetPath === "string") {
	activeView.value = targetPath;
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
