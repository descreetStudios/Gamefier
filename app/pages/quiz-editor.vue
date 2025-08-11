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
			<div class="render">
				<h2 class="render__question">
					If a tomato is a fruit, does that make ketchup a smoothie?
				</h2>
				<div class="render__middle">
					<img
						class="render__middle__image"
						src="/images/Background.png"
						@dragstart.prevent
					>
					<div
						class="render__middle__options"
					>
						<div class="render__middle__options__option">
							<div class="render__middle__options__option__cardbg">
								<div class="render__middle__options__option__cardbg__card">
									<h4 class="render__middle__options__option__cardbg__card__text">
										Option1
									</h4>
								</div>
							</div>
						</div>
						<div class="render__middle__options__option">
							<div class="render__middle__options__option__cardbg">
								<div class="render__middle__options__option__cardbg__card">
									<h4 class="render__middle__options__option__cardbg__card__text">
										Option2
									</h4>
								</div>
							</div>
						</div>
						<div class="render__middle__options__option">
							<div class="render__middle__options__option__cardbg">
								<div class="render__middle__options__option__cardbg__card">
									<h4 class="render__middle__options__option__cardbg__card__text">
										Option3
									</h4>
								</div>
							</div>
						</div>
						<div class="render__middle__options__option">
							<div class="render__middle__options__option__cardbg">
								<div class="render__middle__options__option__cardbg__card">
									<h4 class="render__middle__options__option__cardbg__card__text">
										Option4
									</h4>
								</div>
							</div>
						</div>
						<div class="render__middle__options__option">
							<div class="render__middle__options__option__cardbg">
								<div class="render__middle__options__option__cardbg__card">
									<h4 class="render__middle__options__option__cardbg__card__text">
										Option5
									</h4>
								</div>
							</div>
						</div>
						<div class="render__middle__options__option">
							<div class="render__middle__options__option__cardbg">
								<div class="render__middle__options__option__cardbg__card">
									<h4 class="render__middle__options__option__cardbg__card__text">
										Option6
									</h4>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="separator" />
			<div class="slides">
				<app-editor-slide-card>
					<template #slide-title>
						<h4>Test</h4>
					</template>
					<template #slide-content>
						<img
							src="/images/Background.png"
							@dragstart.prevent
						>
					</template>
				</app-editor-slide-card>
				<app-editor-slide-card>
					<template #slide-title>
						<h4>Test</h4>
					</template>
					<template #slide-content>
						<img
							src="/images/Background.png"
							@dragstart.prevent
						>
					</template>
				</app-editor-slide-card>
				<app-editor-slide-card>
					<template #slide-title>
						<h4>Test</h4>
					</template>
					<template #slide-content>
						<img
							src="/images/Background.png"
							@dragstart.prevent
						>
					</template>
				</app-editor-slide-card>
				<app-editor-slide-card>
					<template #slide-title>
						<h4>Test</h4>
					</template>
					<template #slide-content>
						<img
							src="/images/Background.png"
							@dragstart.prevent
						>
					</template>
				</app-editor-slide-card>
				<app-editor-slide-card>
					<template #slide-title>
						<h4>Test</h4>
					</template>
					<template #slide-content>
						<img
							src="/images/Background.png"
							@dragstart.prevent
						>
					</template>
				</app-editor-slide-card>
				<app-editor-slide-card>
					<template #slide-title>
						<h4>Test</h4>
					</template>
					<template #slide-content>
						<img
							src="/images/Background.png"
							@dragstart.prevent
						>
					</template>
				</app-editor-slide-card>
				<app-editor-slide-card>
					<template #slide-title>
						<h4>Test</h4>
					</template>
					<template #slide-content>
						<img
							src="/images/Background.png"
							@dragstart.prevent
						>
					</template>
				</app-editor-slide-card>

				<app-editor-slide-card-plus />
			</div>
		</div>
	</div>
</template>

<style lang="scss">
@use "/assets/scss/controls.scss";
@use "/assets/scss/quiz-editor.scss";
</style>
