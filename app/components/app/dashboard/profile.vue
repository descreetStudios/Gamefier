<template>
	<section class="profile">
		<h2 class="profile__heading">
			My Profile
		</h2>
		<div class="profile__content">
			<div class="profile__iconContainer">
				<NuxtImg
					class="profile__iconContainer__icon"
					:src="userIcon"
					alt="User icon"
					format="webp"
					@dragstart.prevent
				/>
				<div class="profile__iconContainer__editOverlay" />
				<NuxtImg
					class="profile__iconContainer__editIcon"
					:src="editIcon"
					alt="Edit icon"
					format="webp"
					@dragstart.prevent
				/>
			</div>
			<h4 class="profile__displayName">
				{{ $userStore.displayName }}
			</h4>
		</div>
	</section>
</template>

<script setup>
import { ref } from "vue";

const userIcon = ref("/images/icons/user.png");
const editIcon = ref("/images/icons/edit.png");
</script>

<style scoped lang="scss">
.profile {
	&__heading {
		font-size: 2rem;
		font-weight: bold;
		color: var(--primary-text);
		margin-bottom: 10vh;
		text-align: left;
	}

	&__content {
		display: flex;
		align-items: center;
	}

	&__iconContainer {
		position: relative;
		width: 15rem;
		height: 15rem;
		border-radius: 50%;

		&__icon,
		&__editOverlay,
		&__editIcon {
			position: absolute;
			width: 100%;
			height: 100%;
			border-radius: 50%;
			border: 1px solid var(--inv-bg);
		}

		&__editOverlay {
			background-color: black;
			opacity: 0;
			transition: opacity 0.3s ease;
			z-index: 1;
		}

		&__editIcon {
			opacity: 0;
			padding: 6rem;
			transition: opacity 0.3s ease;
		}

		&:hover &__editOverlay {
			opacity: 0.4;
			cursor: pointer;
		}

		&:hover &__editIcon {
			opacity: 1;
		}
	}

	&__displayName {
		font-size: 3rem;
		color: var(--primary-text);
		margin-left: 1.5rem;
	}
}
</style>
