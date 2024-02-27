
<script>
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
  
	let darkMode = writable(false);
  
	function handleSwitchDarkMode() {
	  $darkMode = !$darkMode;
  
	  localStorage.setItem('theme', $darkMode ? 'dark' : 'light');
  
	  $darkMode
		? document.documentElement.classList.add('dark')
		: document.documentElement.classList.remove('dark');
	}
  
	onMount(() => {
	  if (
		localStorage.theme === 'dark' ||
		(!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
	  ) {
		document.documentElement.classList.add('dark'); 
		console.log("dark")
		$darkMode = true;
	  } else {
		document.documentElement.classList.remove('dark');
		console.log("light")
		$darkMode = false;
	  }
	});
  </script>
  
  <label class="switch">
	<input type="checkbox" bind:checked={$darkMode} on:click={handleSwitchDarkMode} />
	<span class="slider round"></span>
  </label>


<style>
  .switch {
    position: relative;
    display: inline-block;
    width: 60px;
    height: 34px;
  }

  .switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    transition: 0.4s;
  }

  .slider:before {
    position: absolute;
    content: "";
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: 0.4s;
  }

  input:checked + .slider {
    background-color: #2196f3;
  }

  input:checked + .slider:before {
    transform: translateX(26px);
  }

  .slider.round {
    border-radius: 34px;
  }

  .slider.round:before {
    border-radius: 50%;
  }
</style>
