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
			<i class="fa-solid fa-user-shield" />
			<span>Privacy Policy</span>
		</h2>

		<p class="document__intro">
			This Privacy Policy explains how we collect, use, and protect your personal information when you use our services.
		</p>

		<section class="document__section">
			<h3 class="document__section-title">
				<i class="fa-solid fa-info-circle" />
				<span>Key Points</span>
			</h3>
			<ul class="document__list">
				<li>We collect personal data to provide better services.</li>
				<li>Your data is never sold or shared without consent.</li>
				<li>We implement security measures to protect your information.</li>
			</ul>
		</section>

		<section class="document__section">
			<h3 class="document__section-title">
				<i class="fa-solid fa-file-contract" />
				<span>Full Privacy Policy Text</span>
			</h3>
			<div class="document__content">
				<pre class="document__text">{{ privacyText }}</pre>
			</div>
		</section>

		<footer class="document__footer">
			<p>
				For more information about how we handle your data, please contact us at
				<NuxtLink to="mailto:GamefierEmail">[Gamefier Email]</NuxtLink>.
			</p>
		</footer>
	</div>
</template>

<script setup>
import { NuxtImg } from "#components";
import { ref } from "vue";

const privacyText = ref(`Privacy
`);
</script>

<style lang="scss" scoped>
@use "@/assets/scss/docs.scss"
</style>
