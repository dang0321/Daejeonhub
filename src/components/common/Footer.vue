<script setup>
import { ref } from 'vue'

const currentYear = ref(new Date().getFullYear())
const contactInfo = [
  { label: '주소', value: '대전광역시' },
  { label: '전화', value: '070-1234-5678' },
  { label: '이메일', value: 'info@DaejeonHub.kr' }
]

const links = [
  { name: '서비스 약관', href: '#' },
  { name: '개인정보처리방침', href: '#' },
  { name: '문의하기', href: '#' }
]
</script>

<template>
  <footer class="footer">
    <div class="footer-content">
      <div class="footer-container">
        <!-- 좌측: 회사 정보 -->
        <div class="footer-section">
          <h3>DaejeonHub</h3>
          <p>대전의 모든 정보를 한 곳에서</p>
        </div>

        <!-- 중앙: 연락처 -->
        <div class="footer-section">
          <h4>연락처</h4>
          <ul class="contact-list">
            <li v-for="info in contactInfo" :key="info.label">
              <strong>{{ info.label }}:</strong> {{ info.value }}
            </li>
          </ul>
        </div>

        <!-- 우측: 빠른 링크 -->
        <div class="footer-section">
          <h4>링크</h4>
          <ul class="links-list">
            <li v-for="link in links" :key="link.name">
              <a :href="link.href">{{ link.name }}</a>
            </li>
          </ul>
        </div>
      </div>

      <!-- 저작권 -->
      <div class="footer-bottom">
        <p>&copy; {{ currentYear }} DaejeonHub. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background: linear-gradient(135deg, var(--sub) 0%, #3b642f 100%);
  color: white;
  margin-top: auto;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.footer-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  padding: 50px 0 30px;
}

.footer-section h3 {
  font-size: 24px;
  margin-bottom: 10px;
  color: var(--point);
}

.footer-section h4 {
  font-size: 16px;
  margin-bottom: 15px;
  color: var(--point);
}

.footer-section p {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.78);
  line-height: 1.6;
}

.contact-list,
.links-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.contact-list li {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.78);
  margin-bottom: 10px;
}

.links-list li {
  margin-bottom: 8px;
}

.links-list a {
  color: rgba(255, 255, 255, 0.78);
  text-decoration: none;
  transition: color 0.3s ease;
  font-size: 14px;
}

.links-list a:hover {
  color: var(--point);
}

.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.14);
  padding: 20px 0;
  text-align: center;
}

.footer-bottom p {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.62);
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .footer-container {
    grid-template-columns: 1fr;
    gap: 20px;
    padding: 30px 0 20px;
  }

  .footer-section h3 {
    font-size: 20px;
  }
}

@media (max-width: 480px) {
  .footer-container {
    gap: 15px;
  }

  .footer-section h3 {
    font-size: 18px;
  }

  .footer-section h4 {
    font-size: 14px;
  }

  .contact-list li,
  .links-list a {
    font-size: 12px;
  }
}
</style>