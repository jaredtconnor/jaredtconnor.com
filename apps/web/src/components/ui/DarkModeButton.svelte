<script lang="ts">
  import { onMount } from "svelte";

  let darkMode = false;
  let body: HTMLBodyElement;

  onMount(() => {
    // Retrieve the theme preference from localStorage
    const storedTheme = localStorage.getItem('theme');

    // Apply the stored theme preference if it exists
    if (storedTheme) {
      darkMode = storedTheme === 'dark';
    } else {
      // If no preference is stored, use the system preference
      darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    // Apply the theme to the document and body
    document.documentElement.classList.toggle("dark", darkMode);
    document.documentElement.setAttribute("data-theme", darkMode ? "dark" : "light");
    body = document.querySelector("body") as HTMLBodyElement;
  });

  function handleClick() {
    console.log("Changing theme");
    body.style.transition = "color .1s, background-color .3s";

    darkMode = !darkMode; // Toggle the darkMode state

    // Apply the theme change
    document.documentElement.classList.toggle("dark", darkMode);
    document.documentElement.setAttribute("data-theme", darkMode ? "dark" : "light");

    // Store the new theme preference in localStorage
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
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
