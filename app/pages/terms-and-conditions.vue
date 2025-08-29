<template>
	<div class="document">
		<header class="document__header">
			<NuxtLink
				to="/"
				class="document__brand-link"
				@dragstart.prevent
			>
				<NuxtImg
					src="/images/logo/LogoBank/gamefier-logo-light-128px.png"
					alt="Gamefier Logo"
					class="document__logo"
					format="webp"
					@dragstart.prevent
				/>
				<h1 class="document__title">Gamefier</h1>
			</NuxtLink>
		</header>

		<h2 class="document__main-title">
			<i class="fa-solid fa-file-pen" />
			<span>Terms and Conditions</span>
		</h2>

		<p class="document__intro">
			These Terms and Conditions govern your use of our services. Please read them carefully.
		</p>

		<section class="document__section">
			<h3 class="document__section-title">
				<i class="fa-solid fa-list-check" />
				<span>Key Points</span>
			</h3>
			<ul class="document__list">
				<li>You must agree to these terms to use our services.</li>
				<li>Use of our platform is at your own risk.</li>
				<li>We reserve the right to update these terms at any time.</li>
			</ul>
		</section>

		<section class="document__section">
			<h3 class="document__section-title">
				<i class="fa-solid fa-file-contract" />
				<span>Full Terms and Conditions Text</span>
			</h3>
			<div class="document__content">
				<pre class="document__text">{{ termsText }}</pre>
			</div>
		</section>

		<footer class="document__footer">
			<p>
				For any questions regarding these terms, please contact us at
				<NuxtLink to="mailto:GamefierEmail">[Gamefier Email]</NuxtLink>.
			</p>
		</footer>
	</div>
</template>

<script setup>
import { NuxtImg } from "#components";
import { ref } from "vue";

const termsText = ref(`Terms and Conditions
`);
</script>

<style lang="scss" scoped>
@use "@/assets/scss/docs.scss"
</style>
