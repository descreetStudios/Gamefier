<script setup>
import { AppDashboardGames, AppDashboardTemplates, AppDashboardUser } from "#components";

const activeView = ref("dashboard");

const activeViewComponent = computed(() => {
	switch (activeView.value) {
		case "games":
			return AppDashboardGames;
		case "templates":
			return AppDashboardTemplates;
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

<style scoped>
.dashboard-layout {
	display: flex;
	min-height: 100vh;
}
</style>
