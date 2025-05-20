<template>
	<div id="app" class="font-lexend" data-theme="pavedway-light">
		<Navbar />
		<main>
			<router-view />
		</main>
	</div>
</template>

<script setup>
import Navbar from './components/Navbar.vue';
</script>

<style>
body {
	margin: 0;
}

main {
	padding: 2rem;
}
</style>