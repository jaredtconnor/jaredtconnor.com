<script lang="ts">
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  const isBeta = $page.url.searchParams.has("beta");
  const required = false;
  // components
  let formElement: HTMLFormElement;
  let searchInput: HTMLInputElement;
  // input value
  let value: string = $page.url.searchParams.get("s")
    ? ($page.url.searchParams.get("s") as string)
    : "";
  // let submittedValue = null;
  // $: console.log(`form: [${JSON.stringify(form, undefined, 2)}]`);

  // TODO: add to notes
  // or use autofocus in input element
  onMount(() => {
    searchInput.focus();
  });

  // only occur if we prevent default
  function handleOnSubmit() {
    console.log("handleOnSubmit");
    // submittedValue = value;
    searchInput.focus();
    // searchInput.value = "banana";
    // formElement.submit();
  }
</script>

<!-- TODO:
use:enhance
forms.js?v=05155a57:101 Uncaught (in promise) Error: use:enhance can only be used on <form> fields with method="POST" 

svelte notes
bind:value={value}      > input value
bind:this={searchInput} > HTMLInputElement

removed on:submit|preventDefault now switch don't have the annoying phenomenons and its fast
don't have page reload :)
-->

<form method="get" action="?/search" bind:this={formElement}>
  <!-- svelte-ignore a11y-autofocus -->
  <input
    type="input"
    name="s"
    class="text-black px-2 py-1 rounded-md mb-2"
    placeholder="search"
    {required}
    bind:value
    bind:this={searchInput}
  />
  <button
    class="px-4 py-1 mx-1 rounded-md text-white transform bg-orange-500 hover:bg-orange-400 focus:outline-nonefocus:bg-orange-400"
    type="submit">Search</button
  >
</form>
