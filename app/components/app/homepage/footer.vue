<template>
	<footer class="footer">
		<div class="footer__container">
			<!-- Left: Info -->
			<div class="footer__info">
				<p>&copy; {{ currentYear }} Gamefier. Independently developed. All rights reserved.</p>
				<p>
					This project is open-source and licensed under
					<NuxtLink
						to="/license"
						class="footer__link"
						@dragstart.prevent
					>AGPL-3.0 License</NuxtLink>.
				</p>
				<p>
					By using this site, you agree to the
					<NuxtLink
						to="/terms-and-conditions"
						class="footer__link"
						@dragstart.prevent
					>Terms and Conditions</NuxtLink>.
				</p>
				<p>
					Read our
					<NuxtLink
						to="/privacy-policy"
						class="footer__link"
						@dragstart.prevent
					>Privacy Policy</NuxtLink>.
				</p>
			</div>

			<!-- Right: Tech Stack -->
			<div class="footer__tech">
				<h4 class="footer__tech-title">
					Built with
				</h4>
				<div class="footer__tech-cards">
					<NuxtLink
						href="https://nuxt.com"
						target="_blank"
						rel="noopener noreferrer"
						class="footer__tech-card nuxt"
						@dragstart.prevent
					>
						<Icon
							name="logos:nuxt-icon"
							class="footer__tech-card-icon"
							@dragstart.prevent
						/>
						<span class="footer__tech-card-label">Nuxt 4</span>
					</NuxtLink>
					<NuxtLink
						href="https://vuejs.org/"
						target="_blank"
						rel="noopener noreferrer"
						class="footer__tech-card vue"
						@dragstart.prevent
					>
						<Icon
							name="logos:vue"
							class="footer__tech-card-icon"
							@dragstart.prevent
						/>
						<span class="footer__tech-card-label">Vue.js</span>
					</NuxtLink>
					<NuxtLink
						href="https://github.com/descreetStudios/Gamefier"
						target="_blank"
						rel="noopener noreferrer"
						class="footer__tech-card github"
						@dragstart.prevent
					>
						<Icon
							name="mdi:github"
							class="footer__tech-card-icon"
							@dragstart.prevent
						/>
						<span class="footer__tech-card-label">GitHub</span>
					</NuxtLink>
				</div>
			</div>
		</div>
	</footer>
</template>

<script setup>
const currentYear = new Date().getFullYear();
</script>

<style scoped lang="scss">
.footer {
    background-color: var(--surface);
    color: var(--secondary-text);
    border-top: 1px solid var(--border);
    padding: 2.5rem 1rem;
    font-family: 'Inter', sans-serif;

    &__container {
        max-width: 75rem;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 2rem;
    }

    &__info {
        flex: 1;
        min-width: 250px;

        p {
            margin: 0.5rem 0;
            font-size: 0.95rem;
            line-height: 1.5;
        }
    }

    &__link {
        color: var(--secondary);
        font-weight: 600;
        text-decoration: none;

        &:hover,
        &:focus {
            color: var(--secondary-hover);
            text-decoration: underline;
            outline: none;
        }
    }

    &__tech {
        flex: 1;
        min-width: 250px;
        text-align: center;

        &-title {
            font-size: 1rem;
            font-weight: 700;
            margin-bottom: 1rem;
            color: var(--primary-text);
        }

        &-cards {
            display: flex;
            justify-content: center;
            gap: 1rem;
            flex-wrap: wrap;
        }

        &-card {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            border-radius: 0.75rem;
            padding: 1rem;
            width: 6.5rem;
            height: 6.5rem;
            box-shadow: 0 0 6px var(--shadow);
            transition: transform 0.2s ease, box-shadow 0.2s ease;
            text-align: center;
            color: var(--secondary-text);

            &:hover,
            &:focus-within {
                transform: translateY(-0.25rem);
                box-shadow: 0 0 10px var(--glowing);
                outline: none;
            }

            &-icon {
                width: 2rem;
                height: 2rem;
                margin-bottom: 0.5rem;
                color: inherit;
                user-select: none;
                pointer-events: auto;
            }

            &-label {
                font-size: 0.85rem;
                font-weight: 600;
                color: inherit;
            }

            &.nuxt {
                background-color: rgba(0, 220, 130, 0.15);
            }

            &.vue {
                background-color: rgba(66, 184, 131, 0.15);
            }

            &.github {
                background-color: rgba(36, 41, 46, 0.12);
            }
        }
    }
}

a {
    text-decoration: none;
}
</style>
