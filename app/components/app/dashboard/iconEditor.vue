<template>
	<div
		v-if="props.showIconEditor"
		class="icon-editor"
	>
		<button
			class="icon-editor__close-btn"
			aria-label="Close editor"
			@click="$emit('close')"
		>
			&times;
		</button>

		<h3 class="icon-editor__title">
			Profile Picture Editor
		</h3>

		<div class="icon-editor__preview">
			<NuxtImg
				:src="previewUrl"
				alt="Profile preview"
				class="icon-editor__image"
				format="webp"
				@dragstart.prevent
			/>
		</div>

		<div class="icon-editor__actions">
			<label class="icon-editor__upload-btn">
				Upload New Photo
				<input
					type="file"
					accept="image/*"
					hidden
					@change="onFileSelected"
				>
			</label>

			<button
				class="icon-editor__save-btn"
				:disabled="!selectedFile || loading"
				@click="saveImage"
			>
				{{ loading ? 'Saving...' : 'Save' }}
			</button>
		</div>
	</div>
</template>

<script setup>
import { ref as onBeforeUnmount } from "vue";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, updateDoc } from "firebase/firestore";

const { $eventBus } = useNuxtApp();
const { $storage, $db, $auth } = useNuxtApp();

const props = defineProps({
	showIconEditor: Boolean,
});

const emit = defineEmits(["close"]);

const selectedFile = ref(null);
const previewUrl = ref("/images/icons/user.png");
const loading = ref(false);

const onFileSelected = (event) => {
	const file = event.target.files[0];
	if (!file) return;

	const validTypes = ["image/jpeg", "image/png", "image/webp"];
	const maxSizeMB = 2;

	if (!validTypes.includes(file.type)) {
		alert("Only JPG, PNG, and WEBP files are allowed.");
		return;
	}
	if (file.size > maxSizeMB * 1024 * 1024) {
		alert(`File must be smaller than ${maxSizeMB}MB.`);
		return;
	}

	if (previewUrl.value && previewUrl.value.startsWith("blob:")) {
		URL.revokeObjectURL(previewUrl.value);
	}

	selectedFile.value = file;
	previewUrl.value = URL.createObjectURL(file);
};

const saveImage = async () => {
	if (!selectedFile.value) return;
	const user = $auth.currentUser;
	if (!user) {
		$eventBus.emit("alert", {
			message: "You must be logged in.",
			type: "error",
			duration: 4000,
		});
		return;
	}

	loading.value = true;
	try {
		const filePath = `profile-icons/${user.uid}/${Date.now()}-${user.displayName}`;
		const fileRef = storageRef($storage, filePath);

		await uploadBytes(fileRef, selectedFile.value);
		const downloadURL = await getDownloadURL(fileRef);

		await updateDoc(doc($db, "users", user.uid), {
			profileIconUrl: downloadURL,
		});

		emit("close");
	}
	catch (err) {
		console.error("Upload error:", err);
		$eventBus.emit("alert", {
			message: "Failed to upload image.",
			type: "error",
			duration: 4000,
		});
	}
	finally {
		loading.value = false;
	}
};

onBeforeUnmount(() => {
	if (previewUrl.value && previewUrl.value.startsWith("blob:")) {
		URL.revokeObjectURL(previewUrl.value);
	}
});
</script>

<style lang="scss" scoped>
.icon-editor {
	position: fixed;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	background: #fff;
	border-radius: 12px;
	padding: 1.5rem;
	width: 320px;
	max-width: 90%;
	box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
	display: flex;
	flex-direction: column;
	align-items: center;
	animation: fadeIn 0.3s ease-in-out;

	&__close-btn {
		position: absolute;
		top: 0.5rem;
		right: 0.5rem;
		background: transparent;
		border: none;
		font-size: 1.5rem;
		color: #666;
		cursor: pointer;
		border-radius: 50%;
		width: 32px;
		height: 32px;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: background 0.2s ease, color 0.2s ease;

		&:hover {
			background: #f0f0f0;
			color: #000;
		}
	}

	&__title {
		font-size: 1.25rem;
		font-weight: 600;
		margin-bottom: 1rem;
		color: #333;
	}

	&__preview {
		width: 120px;
		height: 120px;
		border-radius: 50%;
		overflow: hidden;
		border: 3px solid #eee;
		margin-bottom: 1rem;
		display: flex;
		align-items: center;
		justify-content: center;
		background: #fafafa;
	}

	&__image {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	&__actions {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		width: 100%;
	}

	&__upload-btn {
		background-color: #f0f0f0;
		color: #333;
		padding: 0.6rem 1rem;
		border-radius: 8px;
		text-align: center;
		cursor: pointer;
		font-weight: 500;
		transition: background 0.2s ease;

		&:hover {
			background-color: #e0e0e0;
		}
	}

	&__save-btn {
		background-color: #4cafef;
		color: white;
		padding: 0.6rem 1rem;
		border-radius: 8px;
		border: none;
		font-weight: 500;
		cursor: pointer;
		transition: background 0.2s ease;

		&:hover {
			background-color: #3b9bd6;
		}

		&:disabled {
			background-color: #ccc;
			cursor: not-allowed;
		}
	}
}
</style>
