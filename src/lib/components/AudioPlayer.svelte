<script module>
	let current

	export function pauseAll() {
		// If current exists, the pause() method is called on it.
		current?.pause()
	}
</script>

<script>
	let { src, title, playbackRate = 1 } = $props()

	let time = $state(0)
	let duration = $state(0)
	let paused = $state(true)
	// let playbackRate = $state(1)
</script>

<audio
	{src}
	bind:this={title}
	bind:currentTime={time}
	bind:duration
	bind:paused
	bind:playbackRate
	onended={() => {
		time = 0
	}}
></audio>
