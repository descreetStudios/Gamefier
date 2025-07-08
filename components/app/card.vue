<template>
	<article
		class="card"
		@click="$emit('card-click')"
	>
		<img :src="imgSrc">
		<article class="subcard">
			<slot>Quiz</slot>
		</article>
	</article>
</template>

<script setup>
defineProps({
	imgSrc: {
		type: String,
		default: "/images/DefaultQuizImage.png",
	},
});
defineEmits(["card-click"]);
</script>

<style lang="scss">
.card {
	width: 300px;
	height: 200px;
	background-color: var(--surface);
	border: 1px solid var(--secondary-surface);
	border-radius: 12px;
	padding: 16px;
	box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
	display: flex;
	justify-content: center;
	align-items: center;
	position: relative;
	font-size: 1.2rem;
	transition: transform 0.2s ease, box-shadow 0.2s ease;
	cursor: pointer;
}

.card:hover {
	transform: scale(1.03);
	box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.card img {
	object-fit: cover;
	object-position: center;
	image-rendering: auto;
	position: absolute;
	margin-bottom: 0px;
	top: 0;
	left: 0;
	width: 100%;
	height: 78%;
	object-fit: cover;
	border-radius: 12px;
	z-index: 0;

	-webkit-user-drag: none;
	-khtml-user-drag: none;
	-moz-user-drag: none;
	-o-user-drag: none;
}

.subcard {
	width: 101%;
	height: 60px;
	background-color: rgb(var(--surface-rgb));
	border: 1px solid var(--secondary-surface);
	border-radius: 8px;
	position: absolute;
	bottom: 0px;
	margin-bottom: 0px;
	transform: translateY(1px);
	z-index: 2;
	display: flex;
	justify-content: left;
	align-items: center;
	box-shadow: 0 2px 6px var(--shadow);

}

p {
	margin-bottom: 0px;
	bottom: 0px;
}
</style>
