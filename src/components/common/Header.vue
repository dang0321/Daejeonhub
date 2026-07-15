<script setup>
const menuItems = [
  { name: '소개', path: '/' },
  { name: '게시판', path: '/board' },
  { name: '지도', path: '/map' },
  { name: '챗봇', path: '/chat' },
  { name: '대시보드', path: '/dashboard' }
]
</script>

<template>
  <header class="header">
    <div class="header-container">
      <h1 class="logo">DaejeonHub</h1>
      <nav class="nav">
        <ul class="menu">
          <li v-for="item in menuItems" :key="item.path">
            <RouterLink 
              :to="item.path"
              :class="{ active: $route.path === item.path }"
            >
              {{ item.name }}
            </RouterLink>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.header {
  background: linear-gradient(135deg, var(--sub) 0%, #3f6d34 100%);
  color: white;
  padding: 0;
  box-shadow: 0 4px 16px rgba(45, 90, 39, 0.2);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  margin: 0;
  font-size: 28px;
  font-weight: bold;
  letter-spacing: 1px;
  white-space: nowrap;
  color: white;
}

.nav {
  flex: 1;
}

.menu {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  gap: 30px;
  justify-content: flex-end;
}

.menu li {
  margin: 0;
}

.menu a {
  display: inline-block;
  padding: 8px 0;
  text-decoration: none;
  color: rgba(255, 255, 255, 0.85);
  font-size: 16px;
  font-weight: 500;
  transition: all 0.3s ease;
  border-bottom: 2px solid transparent;
  position: relative;
}

.menu a:hover {
  color: white;
  border-bottom-color: var(--point);
}

.menu a.active {
  color: white;
  border-bottom-color: var(--point);
  font-weight: 600;
}

@media (max-width: 768px) {
  .header-container {
    flex-direction: column;
    gap: 15px;
  }

  .menu {
    justify-content: center;
    gap: 15px;
  }

  .menu a {
    font-size: 14px;
  }

  .logo {
    font-size: 24px;
  }
}
</style>