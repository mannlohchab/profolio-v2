<script>
  export let frontmatter;
</script>

<svelte:head>
  <title>{frontmatter.title} | Mann Lohchab</title>
  <meta name="description" content={frontmatter.description} />
</svelte:head>

<article class="blog-post">
  <h1>{frontmatter.title}</h1>
  <p class="date">{frontmatter.date}</p>

  <slot />
</article>

<style>
  .blog-post {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
    line-height: 1.7;
  }

  h1 { margin-bottom: 0.5rem; }
  .date { color: var(--text-muted); font-size: 0.9rem; margin-bottom: 2rem; }
</style>
