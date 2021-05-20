<script lang="ts">
    import About from "./About.svelte";

    let about = false;
    
    function setAbout() {
        about = !about;
    }

</script>

<header>
    <About about={about} setAbout={setAbout} />
    <h1 id="appTitle">Svelte Yt-Dl</h1>
    <ul class="menuList">
        <li class="menuItem">
            <button on:click={setAbout}>About</button>
        </li>
    </ul>
</header>

<style>

    ul {
        list-style: none;
    }
</style>