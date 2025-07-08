<script setup>
function handleAddClick() {
	console.log("Create new clicked!");
}
</script>

<template>
	<h2 class="heading">
		Start creating by chosing a template!
		<div class="arrows">
			<span />
			<span />
			<span />
		</div>
	</h2>

	<div class="card-container">
		<AppCard
			img-src="/images/CardPlus.png"
			@card-click="handleAddClick"
		>
			<p>Create new game</p>
		</AppCard>
	</div>
</template>

<style lang="scss" scoped>
.card-container {
	display: flex;
	align-items: center;
	justify-content: center;
}

.heading {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	font-size: 2rem;
	font-weight: bold;
	color: var(--primary-text);
	margin-bottom: 11vh;
	margin-top: 7vh;

	.arrows {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-top: 7vh;

		span {
			display: block;
			width: 20px;
			height: 20px;
			border-bottom: 1px solid var(--primary-text);
			border-right: 1px solid var(--primary-text);
			transform: rotate(45deg);
			margin: -5px 0;
			animation: animate_arrows 2s infinite;

			&:nth-child(2) {
				animation-delay: -0.2s;
			}

			&:nth-child(3) {
				animation-delay: -0.4s;
			}
		}
	}
}

@keyframes animate_arrows {
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
