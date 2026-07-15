<script setup>
const menuItems = [
  { name: 'Home', path: '/' },
  { name: 'Board', path: '/board' },
  { name: 'Map', path: '/map' },
  { name: 'Chat', path: '/chat' }
]
</script>

<template>
  <aside class="sidebar">
    <nav>
      <ul>
        <li v-for="item in menuItems" :key="item.path">
          <RouterLink :to="item.path">
            {{ item.name }}
          </RouterLink>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 200px;
  background: var(--main);
  border-right: 1px solid var(--border);
  padding: 20px;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

li {
  margin-bottom: 10px;
}

a {
  display: block;
  padding: 10px;
  text-decoration: none;
  color: var(--sub);
  border-radius: 8px;
  transition: background 0.3s, color 0.3s;
}

a:hover {
  background: rgba(255, 202, 40, 0.22);
}

a.router-link-active {
  background: var(--sub);
  color: white;
}
</style>