<script lang="ts">
	import coin from '$lib/assets/quarter.png'
	import { sendEvent } from '$components/StateMachine.svelte'
</script>

<div class="absolute h-full w-full transition-all delay-500 duration-1000">
	<div
		class="pointer-events-none absolute left-0 top-0 flex h-full w-full flex-row items-center justify-center p-12"
	>
		<button
			onclick={() => {
				sendEvent('start')
			}}
			class="metal linear pointer-events-auto flex items-center justify-center gap-4 rounded-full bg-white p-10 px-6 py-3 text-2xl text-black"
		>
			Insert Coin
			<img
				src={coin}
				height="40"
				width="40"
				alt="a quarter"
				title="The lowly quarter: How long will it last?"
			/>
		</button>
	</div>
</div>
