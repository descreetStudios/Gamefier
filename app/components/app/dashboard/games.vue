<template>
	<h2 class="create__heading">
		Start creating by choosing a template!
		<div class="create__arrows">
			<span class="create__arrow" />
			<span class="create__arrow" />
			<span class="create__arrow" />
		</div>
	</h2>

	<div class="create__card-container">
		<AppCard
			img-src="/images/CardPlus.png"
			@card-click="handleAddClick"
		>
			<p>Create new game</p>
		</AppCard>
	</div>
</template>

<script setup>
function handleAddClick() {
	console.log("Create new clicked!");
}
</script>

<style lang="scss" scoped>
.create {
	&__card-container {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	&__heading {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		font-size: 2rem;
		font-weight: bold;
		color: var(--primary-text);
		margin: 7vh 0 11vh;
	}

	&__arrows {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-top: 7vh;
	}

	&__arrow {
		display: block;
		width: 20px;
		height: 20px;
		border-bottom: 1px solid var(--primary-text);
		border-right: 1px solid var(--primary-text);
		transform: rotate(45deg);
		margin: -5px 0;
		animation: create-arrows 2s infinite;

		&:nth-child(2) {
			animation-delay: -0.2s;
		}

		&:nth-child(3) {
			animation-delay: -0.4s;
		}
	}
}

@keyframes create-arrows {
	0% {
		opacity: 0;
		transform: rotate(45deg) translate(-20px, -20px);
	}

	50% {
		opacity: 1;
	}

	100% {
		opacity: 0;
		transform: rotate(45deg) translate(20px, 20px);
	}
}
</style>
