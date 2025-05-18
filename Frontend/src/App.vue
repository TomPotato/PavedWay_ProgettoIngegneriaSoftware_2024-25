<template>
	<div id="app" class="font-lexend">
		<Navbar />
		<main>
			<router-view />
		</main>
	</div>
</template>

<script setup>
import Navbar from './layouts/Navbar.vue';
</script>

<style>
body {
	margin: 0;
}

main {
	padding: 2rem;
}
</style>