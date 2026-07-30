<script setup lang="ts">
defineProps<{ issues: string[]; isValid: boolean }>();
</script>

<template>
  <section class="issues" :class="{ ok: isValid }">
    <h2>
      <span class="dot" />
      {{ isValid ? 'Valid structure' : `${issues.length} issue(s)` }}
    </h2>
    <p v-if="isValid" class="hint">
      The generator will accept this. Copy it into
      <code>libs/generator/src/lib/structures/library.ts</code>.
    </p>
    <ul v-else>
      <li v-for="issue in issues" :key="issue">{{ issue }}</li>
    </ul>
  </section>
</template>

<style scoped>
.issues {
  padding: 14px 16px;
  border: 1px solid #33445a;
  border-radius: 12px;
  background: #10151f;
}

h2 {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: #9fb0c3;
}

.dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #f4762c;
}

.ok .dot {
  background: #7ea653;
}

ul {
  margin: 12px 0 0;
  padding-left: 18px;
  color: #e8eef6;
  font-size: 14px;
  line-height: 1.6;
}

.hint {
  margin: 10px 0 0;
  color: #9fb0c3;
  font-size: 13px;
}

code {
  font-family: 'Cascadia Mono', Consolas, monospace;
  font-size: 12px;
  color: #64758a;
}
</style>
