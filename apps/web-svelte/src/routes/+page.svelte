<script lang="ts">
  import { client } from "$lib/trpc";
  import { Icon } from "svelte-materialdesign-icons";

  let loading = false;
  let greeting: any;
  const loadData = async () => {
    loading = true;
    greeting = await client().greeting.query();
    loading = false;
  };
</script>

<svelte:head>
  <title>SvelteKitPayloadCMSWithTRPCAndTurboRepoStarter</title>
</svelte:head>

<div class="p-8">
  <h1 class="text-2rem">Home</h1>

  <div class="m-auto">
    <div class="my-2">
      This is a change.
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus at
      voluptatum itaque, natus distinctio, tempora expedita debitis praesentium
      minima deleniti nam eligendi recusandae sunt illo! Hic est quidem culpa
      optio? Lorem, ipsum dolor sit amet consectetur adipisicing elit. Fugiat
      error dolorem vel, commodi incidunt quia at aperiam provident obcaecati
      asperiores debitis molestiae ullam consectetur blanditiis optio delectus?
      Tempore, doloremque ipsum.
    </div>
    <button
      type="button"
      class="btn variant-filled"
      on:click|preventDefault={loadData}
    >
      tRPC Test
    </button>
    <a class="btn variant-filled" href="/search">/search</a>
    <a class="btn variant-filled" href="/searchcms">/searchcms</a>

    <!-- <button type="button" class="btn-icon variant-filled"><Icon name="skull" /></button> -->

    <p>tRPC result: {greeting}</p>
  </div>
</div>
