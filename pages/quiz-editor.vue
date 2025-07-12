<template>
	<div class="editor">
		<div class="sidebar">
			<div class="title">
				<img
					src="/images/logo/gamefier-logo-64px.png"
					alt="GF"
				>
				<h2>Quiz Editor</h2>
			</div>
			<div class="separator" />
			<div class="contextual-props" />
			<div class="global-props">
				<div class="separator" />
			</div>
		</div>

		<div class="content">
			<div class="render" />
			<div class="slides" />
		</div>
	</div>
</template>

<style lang="scss">
@use "/assets/scss/controls.scss";

p {
	margin: 0.25rem 0.25rem 0.125rem;
	font-size: 0.875rem;
}
</style>
