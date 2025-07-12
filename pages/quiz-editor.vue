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
			<div class="contextual-props">
				<app-editor-property-card class="card">
					<template #title>
						<h4>Test</h4>
					</template>
					<template #content>
						<div class="content-content">
							<h5>Text Box:</h5>
							<input
								type="text"
								name="text"
								placeholder="Text"
								aria-label="Text"
							>
						</div>
						<div class="content-content">
							<h5>Number Box:</h5>
							<input
								type="number"
								name="number"
								placeholder="Number"
								aria-label="Number"
							>
						</div>
						<div class="content-content">
							<h5>Color Picker:</h5>
							<input
								type="color"
								name="color"
								placeholder="Color"
								aria-label="Color"
							>
						</div>
					</template>
				</app-editor-property-card>
				<app-editor-property-card class="card">
					<template #title>
						<h4>Test</h4>
					</template>
					<template #content>
						<div class="content-content">
							<h5>Text Box:</h5>
							<input
								type="text"
								name="text"
								placeholder="Text"
								aria-label="Text"
							>
						</div>
						<div class="content-content">
							<h5>Number Box:</h5>
							<input
								type="number"
								name="number"
								placeholder="Number"
								aria-label="Number"
							>
						</div>
						<div class="content-content">
							<h5>Color Picker:</h5>
							<input
								type="color"
								name="color"
								placeholder="Color"
								aria-label="Color"
							>
						</div>
					</template>
				</app-editor-property-card>
				<app-editor-property-card class="card">
					<template #title>
						<h4>Test</h4>
					</template>
					<template #content>
						<div class="content-content">
							<h5>Text Box:</h5>
							<input
								type="text"
								name="text"
								placeholder="Text"
								aria-label="Text"
							>
						</div>
						<div class="content-content">
							<h5>Number Box:</h5>
							<input
								type="number"
								name="number"
								placeholder="Number"
								aria-label="Number"
							>
						</div>
						<div class="content-content">
							<h5>Color Picker:</h5>
							<input
								type="color"
								name="color"
								placeholder="Color"
								aria-label="Color"
							>
						</div>
					</template>
				</app-editor-property-card>
				<app-editor-property-card class="card">
					<template #title>
						<h4>Test</h4>
					</template>
					<template #content>
						<div class="content-content">
							<h5>Text Box:</h5>
							<input
								type="text"
								name="text"
								placeholder="Text"
								aria-label="Text"
							>
						</div>
						<div class="content-content">
							<h5>Number Box:</h5>
							<input
								type="number"
								name="number"
								placeholder="Number"
								aria-label="Number"
							>
						</div>
						<div class="content-content">
							<h5>Color Picker:</h5>
							<input
								type="color"
								name="color"
								placeholder="Color"
								aria-label="Color"
							>
						</div>
					</template>
				</app-editor-property-card>
				<app-editor-property-card class="card">
					<template #title>
						<h4>Test</h4>
					</template>
					<template #content>
						<div class="content-content">
							<h5>Text Box:</h5>
							<input
								type="text"
								name="text"
								placeholder="Text"
								aria-label="Text"
							>
						</div>
						<div class="content-content">
							<h5>Number Box:</h5>
							<input
								type="number"
								name="number"
								placeholder="Number"
								aria-label="Number"
							>
						</div>
						<div class="content-content">
							<h5>Color Picker:</h5>
							<input
								type="color"
								name="color"
								placeholder="Color"
								aria-label="Color"
							>
						</div>
					</template>
				</app-editor-property-card>
				<app-editor-property-card class="card">
					<template #title>
						<h4>Test</h4>
					</template>
					<template #content>
						<div class="content-content">
							<h5>Text Box:</h5>
							<input
								type="text"
								name="text"
								placeholder="Text"
								aria-label="Text"
							>
						</div>
						<div class="content-content">
							<h5>Number Box:</h5>
							<input
								type="number"
								name="number"
								placeholder="Number"
								aria-label="Number"
							>
						</div>
						<div class="content-content">
							<h5>Color Picker:</h5>
							<input
								type="color"
								name="color"
								placeholder="Color"
								aria-label="Color"
							>
						</div>
					</template>
				</app-editor-property-card>
			</div>
			<div class="separator" />
			<div class="global-props">
				<app-editor-property-card class="card">
					<template #title>
						<h4>Test</h4>
					</template>
					<template #content>
						<div class="content-content">
							<h5>Text Box:</h5>
							<input
								type="text"
								name="text"
								placeholder="Text"
								aria-label="Text"
							>
						</div>
						<div class="content-content">
							<h5>Number Box:</h5>
							<input
								type="number"
								name="number"
								placeholder="Number"
								aria-label="Number"
							>
						</div>
						<div class="content-content">
							<h5>Color Picker:</h5>
							<input
								type="color"
								name="color"
								placeholder="Color"
								aria-label="Color"
							>
						</div>
					</template>
				</app-editor-property-card>
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
@use "/assets/scss/quiz-editor.scss";
</style>
