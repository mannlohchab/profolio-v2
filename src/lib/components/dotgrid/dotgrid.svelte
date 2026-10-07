<script>
  const startDate = new Date("2024-01-01")
  const now = new Date()

  const weeks = Math.floor(
    (now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 7)
  )

  const grid = Array.from({ length: weeks })
</script>

<div class="week-grid">
  {#each grid as _, i}
    <div
      class="dot"
      class:recent={i > weeks - 8}
      class:current={i === weeks - 1}
    ></div>
  {/each}
</div>

<style>
.week-grid{
  display:grid;
  grid-template-columns:repeat(20,8px);
  gap:6px;
  justify-content:center;
}

.dot{
  width:8px;
  height:8px;
  border-radius:50%;
  background: var(--card-bg);
}

.recent{
  background:#7a7a7a;
}

.current{
  background:#fb923c;
}
</style>