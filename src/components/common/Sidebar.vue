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
  background: #f5f5f5;
  border-right: 1px solid #ddd;
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
  color: #333;
  border-radius: 4px;
  transition: background 0.3s;
}

a:hover {
  background: #e0e0e0;
}

a.router-link-active {
  background: #007bff;
  color: white;
}
</style>