<template>
	<h2 class="heading">
		My Profile
	</h2>
	<div class="userProfile">
		<div class="userIconContainer">
			<img
				class="userIcon"
				:src="userIcon"
				alt="user icon"
				@dragstart.prevent
			>
			<div class="editOverlay" />
			<img
				class="editIconOverlay"
				:src="editIcon"
				alt="edit icon overlay"
				@dragstart.prevent
			>
		</div>
		<h4 class="displayname">
			{{ $userStore.displayName }}
		</h4>
	</div>
</template>

<script setup>
const userIcon = ref("/images/icons/user.png");
const editIcon = ref("/images/icons/edit.png");
</script>

<style lang="scss" scoped>
.heading {
	justify-content: left;
	font-size: 2rem;
	font-weight: bold;
	color: var(--primary-text);
	margin-bottom: 10vh;
}

.userProfile {
	display: flex;
	align-items: center;

	.userIconContainer {
		position: relative;
		width: 15rem;
		height: 15rem;

		.userIcon,
		.editOverlay,
		.editIconOverlay {
			position: absolute;
			width: 100%;
			height: 100%;
			border-radius: 50%;
			border: 1px solid var(--inv-bg);
		}

		.userIcon {
			background-color: red;
		}

		.editOverlay {
			transition: opacity 0.3s ease;
			background-color: black;
			opacity: 0;
			z-index: 1;
		}

		&:hover .editOverlay {
			opacity: 0.4;
			cursor: pointer;
		}

		.editIconOverlay {
			opacity: 0;
			padding: 6rem;
			transition: opacity 0.3s ease;
		}

		&:hover .editIconOverlay {
			opacity: 1;
		}
	}

	.displayname {
		font-size: 3rem;
		color: var(--primary-text);
		margin-left: 1.5rem;
	}
}
</style>
