<script lang="ts">
	import '../app.css'
	import favicon from '$lib/assets/invader.png'

	let { children } = $props()
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link rel="preload" href="/fonts/beefd.ttf" as="font" type="font/ttf" crossorigin="anonymous" />
</svelte:head>

{@render children?.()}
