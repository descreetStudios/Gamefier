<template>
	<div class="homepage">
		<!-- Blurred background under navbar -->
		<div
			class="homepage__background"
			:style="{
				transform: `translateY(${bgOffset}px) translateX(${mouseX * 10}px) translateY(${mouseY * 10}px)`,
			}"
		>
			<img
				src="/images/Background.png"
				alt="Background"
			>
		</div>

		<!-- Hero -->
		<div class="homepage__content">
			<h1>The place where education meets games!</h1>
			<p>Explore the features!</p>
			<div class="homepage__content__arrows">
				<span />
				<span />
				<span />
			</div>
		</div>

		<!-- Section 1 -->
		<section
			id="features"
			class="homepage__section"
		>
			<img
				src="/images/Shape1.png"
				alt="Shape 1"
				class="section-shape shape-features"
			>
			<h2>What's Gamefier?</h2>
			<p>We help teaching by integrating Games!</p>
		</section>

		<!-- Section 2 -->
		<section
			id="games"
			class="homepage__section first"
		>
			<img
				src="/images/Shape2.png"
				alt="Shape 2"
				class="section-shape shape-games"
			>
			<h2>How can i create a game?</h2>
			<p>1. Make an account</p>
			<p>2. Start to create using templates!</p>
		</section>

		<!-- Section 3 -->
		<section
			id="community"
			class="homepage__section"
		>
			<img
				src="/images/Shape3.png"
				alt="Shape 3"
				class="section-shape shape-community"
			>
			<h2>Community</h2>
			<p>Join a community of learners and educators collaborating together.</p>
		</section>

		<!-- Section 4 -->
		<section
			id="get-started"
			class="homepage__section alt"
		>
			<img
				src="/images/Shape4.png"
				alt="Shape 4"
				class="section-shape shape-start"
			>
			<h2>Get Started</h2>
			<p>Create your free account and start exploring today!</p>
		</section>
	</div>
</template>

<script setup>
const bgOffset = ref(0);
const mouseX = ref(0);
const mouseY = ref(0);

const handleScroll = () => {
	const scrollTop = window.scrollY;
	const scrollHeight = document.documentElement.scrollHeight;
	const viewportHeight = window.innerHeight;
	const maxScroll = scrollHeight - viewportHeight;

	const maxBgMove = 0.2 * viewportHeight;
	const scrollPercent = Math.min(scrollTop / maxScroll, 1);
	bgOffset.value = scrollPercent * maxBgMove;
};

const handleMouseMove = (event) => {
	mouseX.value = (event.clientX / window.innerWidth - 0.5) * 2;
	mouseY.value = (event.clientY / window.innerHeight - 0.5) * 2;
};

onMounted(() => {
	window.addEventListener("scroll", handleScroll);
	window.addEventListener("mousemove", handleMouseMove);
});

onUnmounted(() => {
	window.removeEventListener("scroll", handleScroll);
	window.removeEventListener("mousemove", handleMouseMove);
});
</script>

<style lang="scss" scoped>
@use "@/assets/scss/homepage.scss";
</style>
