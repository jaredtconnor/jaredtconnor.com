<script lang="ts">
  import { onMount } from "svelte";

  let darkMode = false;
  let body: HTMLBodyElement;

  onMount(() => {
    darkMode = document.documentElement.classList.contains("dark");
    body = document.querySelector("body") as HTMLBodyElement;
  });

  function handleClick() {
    console.log("Changing theme");
    body.style.transition = "color .1s, background-color .3s";

    if (darkMode) {
      document.documentElement.classList.remove("dark");
      document.documentElement.setAttribute("data-theme", "light");
      localStorage.theme = "light";
      darkMode = false;
    } else {
      document.documentElement.classList.add("dark");
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.theme = "dark";
      darkMode = true;
    }
  }
</script>

<button
  class="dark-mode-button"
  aria-label={`Switch to ${darkMode ? "light" : "dark"} mode`}
  on:click={handleClick}
>
</button>

<style>
  .dark-mode-button {
    height: 1.5rem;
    aspect-ratio: 1;
    background-image: url("../../assets/images/moon.svg");
  }

  :global(:root.dark) .dark-mode-button {
    background-image: url("../../assets/images/sun.svg");
  }
</style>
