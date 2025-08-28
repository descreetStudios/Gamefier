<template>
	<div class="settings">
		<h2 class="settings__title">
			Account Settings
		</h2>

		<!-- EMAIL -->
		<fieldset class="settings__section">
			<legend class="settings__legend">
				Email
			</legend>

			<template v-if="isGoogleUser">
				<p class="settings__info">
					Your account is managed through Google. You cannot change your main email here.
				</p>
				<span class="settings__field-value">{{ user?.email }}</span>

				<div class="settings__field mt-3">
					<span class="settings__field-value">
						{{ secondaryEmail || 'No secondary email set' }}
					</span>
					<button
						type="button"
						class="settings__edit-btn"
						@click="editingSecondaryEmail = true"
					>
						{{ secondaryEmail ? 'Edit secondary email' : 'Add secondary email' }}
					</button>
				</div>

				<form
					v-if="editingSecondaryEmail"
					class="settings__form"
					@submit.prevent="onChangeSecondaryEmail"
				>
					<input
						v-model="newSecondaryEmail"
						type="email"
						class="settings__input"
						placeholder="Secondary email"
						required
					>
					<input
						v-model="secondaryEmailPassword"
						type="password"
						class="settings__input"
						placeholder="Password for secondary email"
						required
					>
					<div class="settings__button-group">
						<button
							type="submit"
							:disabled="!secondaryEmailFormValid"
							class="settings__submit-btn"
						>
							Save
						</button>
						<button
							type="button"
							class="settings__cancel-btn"
							@click="cancelEditSecondaryEmail"
						>
							Cancel
						</button>
					</div>
				</form>
			</template>

			<template v-else>
				<div
					v-if="!editingEmail"
					class="settings__field"
				>
					<span class="settings__field-value">{{ user?.email || 'No email set' }}</span>
					<button
						type="button"
						class="settings__edit-btn"
						@click="editingEmail = true"
					>
						Edit
					</button>
				</div>

				<form
					v-else
					class="settings__form"
					@submit.prevent="onChangeEmail"
				>
					<input
						v-model="newEmail"
						type="email"
						class="settings__input"
						placeholder="New email"
						required
					>
					<input
						v-model="confirmNewEmail"
						type="email"
						class="settings__input"
						placeholder="Confirm new email"
						required
					>
					<input
						v-model="currentPasswordEmail"
						type="password"
						class="settings__input"
						placeholder="Current password"
						required
					>
					<p
						v-if="emailError"
						class="settings__error"
					>
						{{ emailErrorMessage }}
					</p>
					<div class="settings__button-group">
						<button
							type="submit"
							:disabled="!emailFormValid"
							class="settings__submit-btn"
						>
							Save
						</button>
						<button
							type="button"
							class="settings__cancel-btn"
							@click="cancelEditEmail"
						>
							Cancel
						</button>
					</div>
				</form>
			</template>
		</fieldset>

		<!-- PASSWORD -->
		<fieldset class="settings__section">
			<legend class="settings__legend">
				Password
			</legend>

			<template v-if="isGoogleUser">
				<p class="settings__info">
					Your password is managed through Google. You cannot change your main password here.
				</p>

				<div class="settings__field mt-3">
					<span class="settings__field-value">
						{{ secondaryEmailPasswordValue ? 'Custom password set for secondary email' : 'No secondary email password set' }}
					</span>
					<button
						type="button"
						class="settings__edit-btn"
						@click="editingSecondaryPassword = true"
					>
						{{ secondaryEmailPasswordValue ? 'Edit secondary password' : 'Add secondary password' }}
					</button>
				</div>

				<form
					v-if="editingSecondaryPassword"
					class="settings__form"
					@submit.prevent="onChangeSecondaryPassword"
				>
					<input
						v-model="newSecondaryPassword"
						type="password"
						class="settings__input"
						placeholder="New password for secondary email"
						required
					>
					<input
						v-model="confirmSecondaryPassword"
						type="password"
						class="settings__input"
						placeholder="Confirm password"
						required
					>
					<div class="settings__button-group">
						<button
							type="submit"
							:disabled="!secondaryPasswordFormValid"
							class="settings__submit-btn"
						>
							Save
						</button>
						<button
							type="button"
							class="settings__cancel-btn"
							@click="cancelEditSecondaryPassword"
						>
							Cancel
						</button>
					</div>
				</form>
			</template>

			<template v-else>
				<div
					v-if="!editingPassword"
					class="settings__field"
				>
					<button
						type="button"
						class="settings__edit-btn"
						@click="editingPassword = true"
					>
						Change Password
					</button>
				</div>

				<form
					v-else
					class="settings__form"
					@submit.prevent="onChangePassword"
				>
					<input
						v-model="newPassword"
						type="password"
						class="settings__input"
						placeholder="New password"
						minlength="8"
						required
					>
					<input
						v-model="confirmNewPassword"
						type="password"
						class="settings__input"
						placeholder="Confirm new password"
						minlength="8"
						required
					>
					<input
						v-model="currentPasswordPassword"
						type="password"
						class="settings__input"
						placeholder="Current password"
						required
					>
					<p
						v-if="passwordError"
						class="settings__error"
					>
						{{ passwordErrorMessage }}
					</p>
					<div class="settings__button-group">
						<button
							type="submit"
							:disabled="!passwordFormValid"
							class="settings__submit-btn"
						>
							Save
						</button>
						<button
							type="button"
							class="settings__cancel-btn"
							@click="cancelEditPassword"
						>
							Cancel
						</button>
					</div>
				</form>
			</template>
		</fieldset>

		<!-- DISPLAY NAME -->
		<fieldset class="settings__section">
			<legend class="settings__legend">
				Display Name
			</legend>

			<div
				v-if="!editingDisplayName"
				class="settings__field"
			>
				<span class="settings__field-value">{{ user?.displayName || 'No display name' }}</span>
				<button
					type="button"
					class="settings__edit-btn"
					@click="editingDisplayName = true"
				>
					Edit
				</button>
			</div>

			<form
				v-else
				class="settings__form"
				@submit.prevent="onChangeDisplayName"
			>
				<input
					v-model="newDisplayName"
					type="text"
					class="settings__input"
					placeholder="New display name"
					required
				>
				<input
					v-model="currentPasswordDisplayName"
					type="password"
					class="settings__input"
					placeholder="Current password"
					required
				>
				<div class="settings__button-group">
					<button
						type="submit"
						:disabled="!displayNameFormValid"
						class="settings__submit-btn"
					>
						Save
					</button>
					<button
						type="button"
						class="settings__cancel-btn"
						@click="cancelEditDisplayName"
					>
						Cancel
					</button>
				</div>
			</form>
		</fieldset>
	</div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useAuth } from "@/composables/useAuth";

const { $auth, $eventBus } = useNuxtApp();
const { changeEmail, changePassword, changeDisplayName } = useAuth();

const user = computed(() => $auth.currentUser);

// --- Flags for login method ---
const isGoogleUser = computed(() =>
	user.value?.providerData?.some(p => p.providerId === "google.com"),
);

// --- Edit mode flags ---
const editingEmail = ref(false);
const editingPassword = ref(false);
const editingDisplayName = ref(false);
const editingSecondaryEmail = ref(false);
const editingSecondaryPassword = ref(false);

// --- Email inputs ---
const newEmail = ref("");
const confirmNewEmail = ref("");
const currentPasswordEmail = ref("");

// Secondary email (Google users)
const secondaryEmail = ref(""); // Existing secondary email
const newSecondaryEmail = ref("");
const secondaryEmailPassword = ref(""); // Password related to secondary email (for verification)

const secondaryEmailPasswordValue = ref(""); // Indicates if secondary password is set

// --- Password inputs ---
const newPassword = ref("");
const confirmNewPassword = ref("");
const currentPasswordPassword = ref("");

// Secondary password inputs (Google users)
const newSecondaryPassword = ref("");
const confirmSecondaryPassword = ref("");

// --- Display Name inputs ---
const newDisplayName = ref("");
const currentPasswordDisplayName = ref("");

// --- Validation ---

// Email validation
const emailFilled = computed(() =>
	newEmail.value.trim() !== "" && confirmNewEmail.value.trim() !== "",
);
const emailsMatch = computed(() =>
	newEmail.value.trim().toLowerCase() === confirmNewEmail.value.trim().toLowerCase(),
);
const emailDifferent = computed(() =>
	newEmail.value.trim().toLowerCase() !== (user.value?.email || "").toLowerCase(),
);
const currentPasswordEmailFilled = computed(() => currentPasswordEmail.value.trim() !== "");

const emailFormValid = computed(
	() =>
		emailFilled.value
		&& emailsMatch.value
		&& emailDifferent.value
		&& currentPasswordEmailFilled.value,
);

const emailError = computed(() => emailFilled.value && (!emailsMatch.value || !emailDifferent.value));
const emailErrorMessage = computed(() => {
	if (!emailsMatch.value) return "Emails do not match.";
	if (!emailDifferent.value) return "The new email must be different.";
	return "";
});

// Secondary email validation
const secondaryEmailFilled = computed(() => newSecondaryEmail.value.trim() !== "");
const secondaryEmailPasswordFilled = computed(() => secondaryEmailPassword.value.trim() !== "");
const secondaryEmailFormValid = computed(
	() => secondaryEmailFilled.value && secondaryEmailPasswordFilled.value,
);

// Password validation
const passwordFilled = computed(() =>
	newPassword.value.trim() !== "" && confirmNewPassword.value.trim() !== "",
);
const passwordsMatch = computed(() => newPassword.value === confirmNewPassword.value);
const currentPasswordPasswordFilled = computed(() => currentPasswordPassword.value.trim() !== "");

const passwordFormValid = computed(
	() =>
		passwordFilled.value
		&& passwordsMatch.value
		&& currentPasswordPasswordFilled.value,
);

const passwordError = computed(() => passwordFilled.value && !passwordsMatch.value);
const passwordErrorMessage = computed(() => "Passwords do not match.");

// Secondary password validation (Google users)
const secondaryPasswordFilled = computed(() =>
	newSecondaryPassword.value.trim() !== "" && confirmSecondaryPassword.value.trim() !== "",
);
const secondaryPasswordsMatch = computed(
	() => newSecondaryPassword.value === confirmSecondaryPassword.value,
);
const secondaryPasswordFormValid = computed(
	() => secondaryPasswordFilled.value && secondaryPasswordsMatch.value,
);

// Display Name validation
const displayNameFormValid = computed(
	() => newDisplayName.value.trim() !== "" && currentPasswordDisplayName.value.trim() !== "",
);

// --- Reset / Cancel functions ---
function resetEmail() {
	newEmail.value = "";
	confirmNewEmail.value = "";
	currentPasswordEmail.value = "";
}

function resetPassword() {
	newPassword.value = "";
	confirmNewPassword.value = "";
	currentPasswordPassword.value = "";
}

function resetDisplayName() {
	newDisplayName.value = "";
	currentPasswordDisplayName.value = "";
}

function resetSecondaryEmail() {
	newSecondaryEmail.value = "";
	secondaryEmailPassword.value = "";
}

function resetSecondaryPassword() {
	newSecondaryPassword.value = "";
	confirmSecondaryPassword.value = "";
}

function cancelEditEmail() {
	resetEmail();
	editingEmail.value = false;
}

function cancelEditPassword() {
	resetPassword();
	editingPassword.value = false;
}

function cancelEditDisplayName() {
	resetDisplayName();
	editingDisplayName.value = false;
}

function cancelEditSecondaryEmail() {
	resetSecondaryEmail();
	editingSecondaryEmail.value = false;
}

function cancelEditSecondaryPassword() {
	resetSecondaryPassword();
	editingSecondaryPassword.value = false;
}

// --- Error handler ---
function handleError(err) {
	const code = err?.code || "";
	let message = "Unexpected error. Please try again.";

	if (code === "auth/wrong-password") {
		message = "The current password is incorrect.";
	}
	else if (code === "auth/weak-password") {
		message = "The new password is too weak.";
	}
	else if (code === "auth/email-already-in-use") {
		message = "This email is already in use.";
	}

	$eventBus.emit("alert", { message, type: "error", duration: 3000 });
}

// --- Submit handlers ---

// Change main email (non-Google users)
async function onChangeEmail() {
	if (isGoogleUser.value) {
		$eventBus.emit("alert", {
			message: "Your email is managed through Google and cannot be changed here.",
			type: "error",
			duration: 3000,
		});
		return;
	}

	try {
		await changeEmail(user.value, currentPasswordEmail.value, newEmail.value.trim());
		$eventBus.emit("alert", { message: "Email updated.", type: "success", duration: 3000 });
		cancelEditEmail();
	}
	catch (err) {
		handleError(err);
	}
}

// Change main password (non-Google users)
async function onChangePassword() {
	if (isGoogleUser.value) {
		$eventBus.emit("alert", {
			message: "Your password is managed through Google and cannot be changed here.",
			type: "error",
			duration: 3000,
		});
		return;
	}

	try {
		await changePassword(user.value, currentPasswordPassword.value, newPassword.value);
		$eventBus.emit("alert", { message: "Password updated.", type: "success", duration: 3000 });
		cancelEditPassword();
	}
	catch (err) {
		handleError(err);
	}
}

// Change display name (all users)
async function onChangeDisplayName() {
	try {
		await changeDisplayName(user.value, currentPasswordDisplayName.value, newDisplayName.value.trim());
		$eventBus.emit("alert", { message: "Display name updated.", type: "success", duration: 3000 });
		cancelEditDisplayName();
	}
	catch (err) {
		handleError(err);
	}
}

// Change secondary email (Google users)
async function onChangeSecondaryEmail() {
	try {
		// TODO: Implement actual logic to change secondary email
		// For example, call your API or Firebase function to update secondary email

		// For now simulate success:
		secondaryEmail.value = newSecondaryEmail.value.trim();

		$eventBus.emit("alert", { message: "Secondary email updated.", type: "success", duration: 3000 });
		cancelEditSecondaryEmail();
	}
	catch (err) {
		handleError(err);
	}
}

// Change secondary password (Google users)
async function onChangeSecondaryPassword() {
	try {
		// TODO: Implement actual logic to change secondary email password

		// For now simulate success:
		secondaryEmailPasswordValue.value = newSecondaryPassword.value;

		$eventBus.emit("alert", { message: "Secondary password updated.", type: "success", duration: 3000 });
		cancelEditSecondaryPassword();
	}
	catch (err) {
		handleError(err);
	}
}
</script>

<style lang="scss" scoped>
.settings {
  max-width: 600px;
  padding: 2rem;
  /* rimuovo margin auto per allineare a sinistra */

  &__title {
    margin-bottom: 2rem;
    font-size: 2rem;
    font-weight: 700;
    text-align: left;
    color: var(--primary-text);
  }

  &__section {
    border: 2px solid var(--border);
    border-radius: 8px;
    margin-bottom: 2rem;
    padding: 1.5rem;

    legend {
      font-weight: 700;
      padding: 0 0.5rem;
      color: var(--tertiary-text);
      font-size: 1.1rem;
      margin-bottom: 1rem;
      width: auto;
    }
  }

  &__field {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.75rem;
  }

  &__field-value {
    font-size: 1rem;
    color: var(--primary-text);
    word-break: break-word;
    max-width: 80%;
  }

  &__form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-top: 1rem;
  }

  &__input {
    padding: 0.5rem 0.75rem;
    border: 1.5px solid var(--border);
    border-radius: 6px;
    font-size: 1rem;
    color: var(--primary-text);
    background-color: var(--surface);
    transition: border-color 0.2s ease-in-out;

    &:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 4px rgba(var(--primary-rgb), 0.4);
      background-color: var(--surface);
    }
  }

  &__button-group {
    display: flex;
    gap: 1rem;
  }

  &__submit-btn {
    background-color: var(--primary);
    color: var(--primary-text);
    padding: 0.6rem 1.2rem;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
    transition: background-color 0.2s ease-in-out;

    &:hover:not(:disabled) {
      background-color: var(--primary-hover);
    }

    &:disabled {
      background-color: rgb(203 213 225 / 0.7); /* colore più soft per disabled */
      cursor: not-allowed;
      color: var(--tertiary-text);
    }
  }

  &__cancel-btn {
    background-color: var(--border);
    color: var(--primary-text);
    padding: 0.6rem 1.2rem;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
    transition: background-color 0.2s ease-in-out;

    &:hover {
      background-color: rgb(var(--border-rgb) / 0.8);
    }
  }

  &__edit-btn {
    background-color: var(--primary);
    color: var(--primary-text);
    border: none;
    padding: 0.4rem 1rem;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
    transition: background-color 0.2s ease-in-out;

    &:hover {
      background-color: var(--primary-hover);
    }
  }

  &__error {
    color: var(--error);
    font-weight: 600;
    font-size: 0.9rem;
    margin-top: -0.5rem;
  }

  &__info {
    color: var(--tertiary-text);
    font-size: 0.95rem;
    margin-bottom: 1rem;
  }

  /* Spaziatura verticale aggiuntiva per il campo con margine top */
  .mt-3 {
    margin-top: 1.25rem;
  }
}

button {
  margin-bottom: 0;
}
</style>
