<template>
	<div class="siteAdministration">
		<h2>Site Administration</h2>

		<fieldset class="siteAdministration__fieldset">
			<legend class="siteAdministration__legend">
				Maintenance mode:
				<span v-if="props.isMaintenanceModeEnabled">Enabled</span>
				<span v-else>Disabled</span>
			</legend>
			<form
				class="siteAdministration__form"
				@submit.prevent="toggleMode"
			>
				<input
					type="submit"
					:value="props.isMaintenanceModeEnabled ? 'Disable Maintenance Mode' : 'Enable Maintenance Mode'"
					class="siteAdministration__submit"
				>
			</form>
		</fieldset>
	</div>
</template>

<script setup>
const props = defineProps({
	isMaintenanceModeEnabled: { type: Boolean, default: false },
});

const emit = defineEmits(["toggle-maintenance"]);

const toggleMode = () => {
	const newMode = props.isMaintenanceModeEnabled ? "off" : "on";
	emit("toggle-maintenance", newMode);
};
</script>

<style lang="scss" scoped>
.siteAdministration {
  &__fieldset {
    padding: 1rem;
    border: 2px solid var(--inv-secondary-text);
    border-radius: var(--border-radius);
    margin-bottom: 2rem;
  }

  &__legend {
    font-weight: bold;
    padding: 0 1rem;
  }

  &__submit {
    background-color: var(--primary);
    color: white;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: var(--border-radius);
    cursor: pointer;
  }

  &__submit:hover {
    background-color: var(--primary-hover);
  }
}
</style>
