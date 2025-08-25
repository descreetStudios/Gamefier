<template>
	<div class="homepage">
		<div
			class="homepage__background"
			:style="{
				transform: `translateY(${bgOffset - 100}px) translateX(${mouseX * 10}px) translateY(${mouseY * 10}px)`,
			}"
		>
			<img
				src="/images/BackgroundDark.png"
				alt="Background"
				class="homepage__background-img"
				@dragstart.prevent
			>
		</div>

		<section class="homepage__hero">
			<h1 class="homepage__hero-title">
				The place where education meets games!
			</h1>
			<p class="homepage__hero-subtitle">
				How does it work?
			</p>
			<div class="homepage__hero-arrows">
				<span class="homepage__hero-arrow" />
				<span class="homepage__hero-arrow" />
				<span class="homepage__hero-arrow" />
			</div>
		</section>

		<section
			v-for="section in sections"
			:id="section.id"
			:key="section.id"
			:class="['homepage__section', { 'homepage__section--reversed': section.reversed }]"
		>
			<img
				:src="section.image"
				:alt="section.title"
				class="homepage__section-img"
				@dragstart.prevent
			>
			<div class="homepage__text-block">
				<h2 class="homepage__section-title">
					{{ section.title }}
				</h2>
				<div class="homepage__section-paragraphs">
					<template v-if="section.links">
						<NuxtLink
							v-for="(text, i) in section.links"
							:key="i"
							:to="text.to"
							class="homepage__link"
						>
							<p>{{ text.label }}</p>
						</NuxtLink>
						<p>{{ section.description }}</p>
					</template>
					<template v-else>
						<p>{{ section.description }}</p>
					</template>
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

const sections = [
	{
		id: "features",
		title: "What's Gamefier?",
		image: "/images/features.png",
		description:
			"Gamefier is an online platform where teachers can enhance their lessons by integrating interactive games to engage their students, helping them learn and retain more information, with less effort.",
	},
	{
		id: "open-source",
		title: "Open Source, Open Future",
		image: "/images/openSource.png",
		description:
			"Our code is public, transparent, and built to grow with a passionate community. Whether you're a developer, educator, or curious learner — you're welcome to contribute.",
		reversed: true,
	},
	{
		id: "games",
		title: "How can I create a game?",
		image: "/images/games.png",
		description: "2. Start creating using templates!",
		links: [{ to: "/signup", label: "1. Make an account" }],
	},
	{
		id: "community",
		title: "Community",
		image: "/images/community.png",
		description:
			"Join a community of learners and educators, discover games created by others, and share your own.",
		reversed: true,
	},
	{
		id: "get-started",
		title: "Get Started",
		image: "/images/getStarted.png",
		description: "and start play-learning today!",
		links: [{ to: "/signup", label: "Create your free account" }],
	},
	{
		id: "security",
		title: "Security First",
		image: "/images/security.png",
		description:
			"Gamefier uses modern security protocols to keep your data safe. From encrypted connections to protected accounts, we make sure your learning is secure.",
		reversed: true,
	},
	{
		id: "privacy",
		title: "We respect your privacy",
		image: "/images/privacy.png",
		description:
			"Your personal data is never shared or sold. Gamefier follows strict privacy practices to ensure a safe and respectful environment.",
	},
];
</script>

<style lang="scss" scoped>
@use '@/assets/scss/homepage.scss';
</style>
