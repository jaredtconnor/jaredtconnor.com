<script lang="ts">
  import SearchForm from "$lib/components/SearchForm.svelte";
  // props
  export let data;
  // $: console.log(`data: [${JSON.stringify(data, undefined, 2)}]`);

  const title = "Search Moke Data";
</script>

<svelte:head>
  <title>{title}</title>
</svelte:head>

<div class="p-8">
  <h1 class="text-2rem">{title}</h1>

  <SearchForm />

  {#if data.errors}
    <ul>
      {#each data.errors as error}
        <li>field '{error.field}': {error.message}</li>
      {/each}
    </ul>
  {/if}

  <ul>
    {#each data.products as product}
      <li>{product.title}</li>
    {/each}
  </ul>
</div>