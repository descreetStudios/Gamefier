<script setup>
import { AppDashboardAdmin, AppDashboardGames, AppDashboardProfile, AppDashboardSettings, AppDashboardTemplates, AppDashboardUser } from "#components";

const activeView = ref("dashboard");

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
			@navigate="activeView = $event"
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
