<script lang="ts">
	import Header from "./components/Header.svelte";

	let todoList = [{
		id: 1, title: "braaap"
	}]

	let titleInput = "";

	function handleInput(e) {
		titleInput = e.target.value;
	}

	function handleAddItem() {
		todoList.push({id: 5, title: titleInput});
		todoList = todoList;
	}

</script>

<Header />

<main>
	<h1>Todo list </h1>
	<ul>
		{#each todoList as item (item)}
			<li>
				<p>ID: {item.id}</p>
				<p>TITLE: {item.title}</p>
			</li>
		{/each}
	</ul>

	<button on:click={handleAddItem}>
		Add item
	</button>

	<input type="text" value={titleInput} on:input={handleInput}/>
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>