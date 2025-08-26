<template>
	<div class="userModeration">
		<h2>User Moderation</h2>
		<fieldset class="userModeration__search">
			<legend>Search users by name</legend>
			<form
				class="userModeration__searchForm"
				@submit.prevent="onSearch"
			>
				<input
					v-model="userSearchName"
					class="userModeration__searchForm_name"
					type="text"
					maxlength="30"
				>
				<input
					class="userModeration__searchForm_button"
					type="submit"
					value="Search"
				>
			</form>
		</fieldset>

		<fieldset
			v-for="user in props.users"
			:key="user.id"
			class="userModeration__userCard"
		>
			<legend>{{ user.displayName }} - #{{ user.id }}</legend>

			<div class="userPreview">
				<div class="userPreview__avatar">
					<NuxtImg
						class="userPreview__avatar__img"
						:src="userIcon"
						alt="user icon"
						loading="lazy"
						format="webp"
						@dragstart.prevent
					/>
					<div class="userPreview__avatar__overlay" />
					<NuxtImg
						class="userPreview__avatar__edit"
						:src="editIcon"
						alt="edit icon overlay"
						loading="lazy"
						format="webp"
						@dragstart.prevent
					/>
				</div>
			</div>

			<form
				class="userForm"
				@submit.prevent="onUpdateProfile(user)"
			>
				<input
					v-model="user.displayName"
					type="text"
				>
				<input
					v-model="user.email"
					type="email"
				>

				<select
					v-model="user.role"
					name="role"
				>
					<option value="user">
						User
					</option>
					<option value="banned">
						Banned
					</option>
					<option value="admin">
						Administrator
					</option>
				</select>

				<input
					v-if="user.role === 'banned'"
					v-model="user.banReason"
					type="text"
					placeholder="Ban reason"
					required
				>

				<select
					v-if="user.role === 'banned'"
					v-model="user.banType"
					name="banType"
					required
				>
					<option
						value=""
						disabled
						hidden
					>
						Select an option
					</option>

					<option value="temporary">
						Temporary
					</option>
					<option value="permanent">
						Permanent
					</option>
				</select>

				<input
					v-if="user.role === 'banned' && user.banType === 'temporary'"
					v-model="user.banExpiresAt"
					type="date"
					required
				>

				<input
					v-model="user.password"
					type="password"
					placeholder="New password"
					minlength="8"
				>

				<input
					type="submit"
					value="Update Profile"
				>
			</form>
		</fieldset>
		<app-infinite-scroll
			:has-more="hasMoreUsers"
			@load="onLoadMore"
		>
			<div
				v-if="isLoadingMore"
				class="loader"
			>
				Caricamento...
			</div>
		</app-infinite-scroll>
	</div>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";

const props = defineProps({
	users: Array,
	hasMoreUsers: Boolean,
	isLoadingMore: Boolean,
});

const userSearchName = ref("");
const userSearchNameBackup = ref("");

const emits = defineEmits(["search", "update-profile"]);

const userIcon = ref("/images/icons/user.png");
const editIcon = ref("/images/icons/edit.png");

const onSearch = () => {
	emits("search", true, userSearchName.value);
	userSearchNameBackup.value = userSearchName.value;
	userSearchName.value = "";
};

const onLoadMore = () => {
	emits("search", false, userSearchNameBackup.value);
};

const onUpdateProfile = (user) => {
	emits("update-profile", user);
};
</script>

<style lang="scss" scoped>
.userModeration{
    &__search {
        margin-bottom: 2rem;
		padding: 1rem;
		border: 2px solid var(--inv-secondary-text);
		border-radius: var(--border-radius);

		legend {
            padding: 0 1rem;
			font-weight: bold;
		}

		&Form {
            position: relative;
			display: flex;
			gap: 1rem;

			&_button {
                background-color: var(--primary);
				position: absolute;
				right: 0;
				width: 15%;

				&:hover {
                    background-color: var(--primary-hover);
				}
			}

			&_name {
                flex: 1;
			}
		}
	}

	&__userCard {
        display: flex;
		flex-wrap: wrap;
		gap: 2rem;
		padding: 1.5rem;
		margin-bottom: 2rem;
		border: 2px solid var(--inv-secondary-text);
		border-radius: var(--border-radius);

		legend {
            padding: 0 1rem;
			font-weight: bold;
		}
	}
}

.userPreview {
    display: flex;
	align-items: center;

	&__avatar {
		position: relative;
		width: 15rem;
		height: 15rem;
		border-radius: 50%;

		&__img,
		&__overlay,
		&__edit {
            position: absolute;
			width: 100%;
			height: 100%;
			border-radius: 50%;
			border: 1px solid var(--inv-bg);
		}

		&__overlay {
            background-color: black;
			opacity: 0;
			transition: opacity 0.3s ease;
			z-index: 1;
			border-radius: 50%;

			&:hover {
                opacity: 0.4;
				cursor: pointer;
			}
		}

		&__edit {
            opacity: 0;
			padding: 6rem;
			transition: opacity 0.3s ease;
		}

		&:hover &__edit {
            opacity: 1;
		}
	}
}

.userForm {
    flex: 1;
	display: flex;
	flex-direction: column;
	gap: 1rem;

	input,
	select {
        padding: 0.5rem;
		font-size: 1rem;
		border-radius: var(--border-radius);
		border: 1px solid var(--inv-secondary-text);
		margin-bottom: 0;
	}
}
</style>
