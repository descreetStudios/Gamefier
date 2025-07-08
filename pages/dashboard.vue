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
		<AppDashboardSidebar
			:active="activeView"
			@navigate="activeView = $event"
		/>
		<AppDashboardContent>
			<component :is="activeViewComponent" />
		</AppDashboardContent>
	</div>
</template>

<style>
.dashboard-layout {
	display: flex;
	min-height: 100vh;
}

html {
	overflow-y: hidden;
}
</style>
