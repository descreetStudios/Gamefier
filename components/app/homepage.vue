<template>
	<div class="homepage">
		<!-- Blurred background under navbar -->
		<div
			class="homepage__background"
			:style="{
				transform: `translateY(${bgOffset - 100}px) translateX(${mouseX * 10}px) translateY(${mouseY * 10}px)`,
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
			<p>How does it work?</p>
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
				src="/images/features.png"
				alt="Features"
			>
			<div class="text-block">
				<h2>What's Gamefier?</h2>
				<p class="paragraphs">
					Gamefier is an online platform where teachers can enhance their lessons by integrating interactive
					games
					to engage their students, helping them learn and retain more information, with less effort.
				</p>
			</div>
		</section>

		<!-- Section 2 -->
		<section
			id="games"
			class="homepage__section_reversed"
		>
			<img
				src="/images/games.png"
				alt="Games"
			>
			<div class="text-block">
				<h2>How can i create a game?</h2>
				<div class="paragraphs">
					<NuxtLink to="/signup">
						<p>1. Make an account</p>
					</NuxtLink>
					<p>2. Start creating using templates!</p>
				</div>
			</div>
		</section>

		<!-- Section 3 -->
		<section
			id="community"
			class="homepage__section"
		>
			<img
				src="/images/community.png"
				alt="Community"
			>
			<div class="text-block">
				<h2>Community</h2>
				<p class="paragraphs">
					Join a community of learners and educators collaborating together, discover games created by others
					and share your own.
				</p>
			</div>
		</section>

		<!-- Section 4 -->
		<section
			id="get-started"
			class="homepage__section_reversed"
		>
			<img
				src="/images/getStarted.png"
				alt="Get Started"
			>
			<div class="text-block">
				<h2>Get Started</h2>
				<div class="paragraphs">
					<NuxtLink to="/signup">
						<p>Create your free account</p>
					</NuxtLink>
					<p>and start play-learning today!</p>
				</div>
			</div>
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
