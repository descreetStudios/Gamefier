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

Lorem ipsum dolor sit amet, consectetur adipiscing elit.  
Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium,  
totam rem aperiam. Eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.  
Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.

Sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.  
Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.  
Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam,  
nisi ut aliquid ex ea commodi consequatur?

Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur.  
Vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?  
At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti  
atque corrupti quos dolores.

Et quas molestias excepturi sint occaecati cupiditate non provident,  
similique sunt in culpa qui officia deserunt mollitia animi.  
Id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio.  
Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus.

Quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.  
Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet  
ut et voluptates repudiandae sint et molestiae non recusandae.

Itaque earum rerum hic tenetur a sapiente delectus,  
ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.  
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero.  
Sed cursus ante dapibus diam.

Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris.  
Fusce nec tellus sed augue semper porta. Mauris massa. Vestibulum lacinia arcu eget nulla.

Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.  
Curabitur sodales ligula in libero. Sed dignissim lacinia nunc. Curabitur tortor.  
Pellentesque nibh. Aenean quam. In scelerisque sem at dolor.

Maecenas mattis. Sed convallis tristique sem. Proin ut ligula vel nunc egestas porttitor.  
Morbi lectus risus, iaculis vel, suscipit quis, luctus non, massa.  
Fusce ac turpis quis ligula lacinia aliquet. Mauris ipsum.

Nulla metus metus, ullamcorper vel, tincidunt sed, euismod in, nibh.  
Quisque volutpat condimentum velit. Class aptent taciti sociosqu ad litora torquent per conubia nostra.  
Nam nec ante. Sed lacinia, urna non tincidunt mattis, tortor neque adipiscing diam.
`);
</script>

<style lang="scss" scoped>
@use "@/assets/scss/docs.scss"
</style>
