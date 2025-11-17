<script setup lang="ts">
import { ref, onMounted } from 'vue';
const query = ref('');
const suggestions = ref<Array<{ item: string; category: string; emoji: string }>>([]);
const showSuggestions = ref(false);
const particles = ref<Array<{ id: number; x: number; y: number; size: number; duration: number }>>([]);
const activeIndex = ref(0);
const showMobileMenu = ref(false);
const isVideoPaused = ref(false);

interface Category {
  name: string;
  items: string[];
  emoji: string;
}
const categories: Category[] = [
  { name: 'Supermercado', items: ['Leite', 'Pão', 'Ovos', 'Água', 'Frutas', 'Arroz'], emoji: 'shopping_cart' },
  { name: 'Farmácia', items: ['Aspirina', 'Vitaminas', 'Protetor solar', 'Termómetro'], emoji: 'pill' },
  { name: 'Bebidas', items: ['Cerveja', 'Vinho', 'Refrigerante', 'Sumo', 'Água'], emoji: 'wine' },
  { name: 'Tech', items: ['Cabo USB', 'Carregador', 'Powerbank', 'Fones', 'Pilhas'], emoji: 'bolt' },
  { name: 'Conveniência', items: ['Tabaco', 'Isqueiro', 'Preservativos', 'Papel'], emoji: 'fire' },
  { name: 'Outros', items: ['Gás', 'Flores', 'Documentos', 'Presente', 'Comida'], emoji: 'gift' }
];
const rotatingPhrases = [
  'Carregador iPhone',
  'Cerveja gelada',
  'Aspirina urgente',
  'Powerbank',
  'Preservativos',
  'Água fresca'
];
onMounted(() => {
  const interval = setInterval(() => {
    activeIndex.value = (activeIndex.value + 1) % rotatingPhrases.length;
  }, 3000);
  return () => clearInterval(interval);
});
onMounted(() => {
  const newParticles = Array.from({ length: 28 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2.5 + 1.5,
    duration: Math.random() * 6 + 5
  }));
  particles.value = newParticles;
});
const handleInputChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const value = target.value;
  query.value = value;
  if (value.length > 1) {
    const allItems = categories.flatMap(cat =>
      cat.items.map(item => ({ item, category: cat.name, emoji: cat.emoji }))
    );
    const filtered = allItems.filter(({ item }) =>
      item.toLowerCase().includes(value.toLowerCase())
    );
    suggestions.value = filtered.slice(0, 5);
    showSuggestions.value = true;
  } else {
    showSuggestions.value = false;
  }
};
const handleSuggestionClick = (item: string) => {
  query.value = item;
  showSuggestions.value = false;
};
const handleCategoryClick = (item: string) => {
  query.value = item;
  showSuggestions.value = false;
};
const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value;
};
const toggleVideoPause = () => {
  isVideoPaused.value = !isVideoPaused.value;
  const video = document.getElementById('fetch-video') as HTMLVideoElement;
  if (video) {
    if (isVideoPaused.value) video.pause();
    else video.play();
  }
};
</script>

<template>
  <div class="fetch-app">
    <div class="particles-layer">
      <div
        v-for="p in particles"
        :key="p.id"
        class="particle"
        :style="{
          left: p.x + '%',
          top: p.y + '%',
          width: p.size + 'px',
          height: p.size + 'px',
          animationDuration: p.duration + 's'
        }"
      />
    </div>

    <header class="app-header">
      <div class="container-fluid px-3 px-md-5">
        <div class="header-inner">
          <div class="brand">
            <i class="bi bi-lightning-charge-fill"></i>
            <span>FETCH</span>
          </div>
          <nav class="nav-menu d-none d-lg-flex">
            <button class="nav-btn active">Início</button>
            <button class="nav-btn">Pedido</button>
            <button class="nav-btn">Dados</button>
          </nav>
          <div class="header-actions">
            <div class="status-badge">
              <span class="status-dot"></span>
              <span>24/7 Online</span>
            </div>
            <button class="login-btn d-none d-md-inline-block">Entrar</button>
            <button class="mobile-menu-btn d-lg-none" @click="toggleMobileMenu">
              <i class="bi bi-list fs-3"></i>
            </button>
          </div>
        </div>
        <transition name="slide">
          <div v-if="showMobileMenu" class="mobile-menu d-lg-none">
            <button class="mobile-nav-btn active">Início</button>
            <button class="mobile-nav-btn">Pedido</button>
            <button class="mobile-nav-btn">Dados</button>
            <button class="mobile-login-btn">Entrar</button>
          </div>
        </transition>
      </div>
    </header>

    <main class="app-main">
      <div class="container-fluid px-3 px-md-5">
        <section class="hero-section text-center">
          <div class="hero-badge">
            <i class="bi bi-stars"></i>
            <span>Entrega em 30 minutos</span>
            <i class="bi bi-graph-up-arrow"></i>
          </div>
          <h1 class="hero-title">
            <span class="title-line">O QUE</span>
            <span class="title-line">PRECISAS</span>
            <span class="title-line">AGORA?</span>
          </h1>
          <div class="phrase-rotator">
            <div
              class="rotator-content"
              :style="{ transform: `translateY(-${activeIndex * 56}px)` }"
            >
              <div v-for="(phrase, i) in rotatingPhrases" :key="i" class="rotator-item">
                {{ phrase }}...
              </div>
            </div>
          </div>
        </section>

        <section class="search-section">
          <div class="search-container mx-auto">
            <div class="search-glow"></div>
            <div class="search-box">
              <i class="bi bi-search search-icon"></i>
              <input
                v-model="query"
                @input="handleInputChange"
                type="text"
                placeholder="Escreve aqui... qualquer coisa"
                class="search-input"
              />
            </div>
            <transition name="fade">
              <div v-if="showSuggestions && suggestions.length" class="suggestions-panel">
                <button
                  v-for="({ item, category, emoji }, i) in suggestions"
                  :key="i"
                  @click="handleSuggestionClick(item)"
                  class="suggestion-card"
                  :style="{ transitionDelay: i * 70 + 'ms' }"
                >
                  <span class="sugg-emoji">{{ emoji }}</span>
                  <span class="sugg-text">{{ item }}</span>
                  <span class="sugg-tag">{{ category }}</span>
                </button>
              </div>
            </transition>
          </div>
        </section>

        <section class="stats-section">
          <div class="row g-4 justify-content-center">
            <div class="col-6 col-md-4 col-lg-3" v-for="({ icon, value, label }, i) in [
              { icon: 'bi-clock-fill', value: '30min', label: 'Entrega' },
              { icon: 'bi-lightning-charge-fill', value: '24/7', label: 'Sempre ativo' },
              { icon: 'bi-geo-alt-fill', value: '5km', label: 'Raio máximo' }
            ]" :key="i">
              <div class="stat-item text-center p-4">
                <i :class="`bi ${icon} stat-icon`"></i>
                <div class="stat-value">{{ value }}</div>
                <div class="stat-label">{{ label }}</div>
              </div>
            </div>
          </div>
        </section>

        <section class="categories-section">
          <h3 class="section-title text-center">Categorias Populares</h3>
          <div class="row g-3 g-md-4">
            <div class="col-6 col-sm-4 col-md-3 col-lg-2" v-for="(cat, i) in categories" :key="i">
              <button
                @click="handleCategoryClick(cat.items[0])"
                class="category-card w-100 h-100 p-3 p-md-4 text-start"
              >
                <div class="cat-emoji">{{ cat.emoji }}</div>
                <div class="cat-title">{{ cat.name }}</div>
                <div class="cat-items">{{ cat.items.slice(0, 3).join(' · ') }}</div>
              </button>
            </div>
          </div>
        </section>

        <section class="cta-section text-center">
          <button class="cta-button">
            <span>PEDIR AGORA</span>
            <div class="btn-shine"></div>
          </button>
          <p class="cta-subtitle">
            Taxa desde 3€ · Pagamento seguro · Entrega ultra-rápida
          </p>
        </section>

        <!-- Video Banner Section -->
        <section class="video-banner-section mt-5">
          <div class="video-container">
            <video
              id="fetch-video"
              class="video-player"
              autoplay
              loop
              muted
              playsinline
              :paused="isVideoPaused"
            >
              <source src="https://cdn.jsdelivr.net/gh/xai-org/grok-video-assets/fetch-angola-promo.mp4" type="video/mp4">
              <source src="https://cdn.jsdelivr.net/gh/xai-org/grok-video-assets/fetch-angola-promo.webm" type="video/webm">
              Seu navegador não suporta vídeo.
            </video>
            <button class="video-pause-btn" @click="toggleVideoPause">
              <i :class="isVideoPaused ? 'bi bi-play-fill' : 'bi bi-pause-fill'"></i>
            </button>
            <div class="video-overlay">
              <div class="video-text">
                <h3>Entrega em 30 minutos em Luanda</h3>
                <p>Pedidos 24/7 · Qualquer coisa · Qualquer lugar</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>

    <footer class="app-footer">
      <div class="container-fluid px-3 px-md-5">
        <div class="footer-content">
          <p>© 2025 FETCH Angola. Todos os direitos reservados.</p>
          <div class="footer-links">
            <a href="#">Termos</a>
            <a href="#">Privacidade</a>
            <a href="#">Contato</a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.fetch-app {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%);
  color: #1e293b;
  font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
  position: relative;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
}
.particles-layer {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}
.particle {
  position: absolute;
  background: #fb923c;
  border-radius: 50%;
  opacity: 0.08;
  animation: float 10s ease-in-out infinite;
}
@keyframes float {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-30px) scale(1.2); }
}
.app-header {
  position: relative;
  z-index: 30;
  padding: 0.75rem 0;
  border-bottom: 1px solid rgba(251, 146, 60, 0.12);
  background: rgba(248, 250, 252, 0.92);
  backdrop-filter: blur(16px);
}
.header-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: nowrap;
  gap: 0.75rem;
}
.brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.75rem;
  font-weight: 900;
  white-space: nowrap;
}
.brand i {
  color: #fb923c;
  font-size: 1.6rem;
  animation: pulse 2.5s infinite;
}
.brand span {
  background: linear-gradient(90deg, #fb923c, #f97316);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  letter-spacing: -0.5px;
}
.nav-menu {
  display: flex;
  gap: 0.5rem;
}
.nav-btn {
  background: transparent;
  border: 1.5px solid rgba(251, 146, 60, 0.3);
  color: #475569;
  padding: 0.625rem 1.75rem;
  border-radius: 2rem;
  font-size: 0.95rem;
  font-weight: 600;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  min-width: 110px;
}
.nav-btn:hover {
  background: rgba(251, 146, 60, 0.12);
  border-color: #fb923c;
  color: #1e293b;
  transform: translateY(-1px);
}
.nav-btn.active {
  background: linear-gradient(135deg, #fb923c, #f97316);
  border-color: transparent;
  color: white;
  box-shadow: 0 6px 16px rgba(251, 146, 60, 0.25);
}
.header-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-shrink: 0;
}
.status-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #f59e0b;
  font-weight: 600;
}
.status-dot {
  width: 9px;
  height: 9px;
  background: #10b981;
  border-radius: 50%;
  animation: pulse 1.8s infinite;
}
.login-btn {
  background: linear-gradient(135deg, #fb923c, #f97316);
  color: white;
  border: none;
  padding: 0.625rem 2rem;
  border-radius: 2rem;
  font-weight: 700;
  font-size: 0.95rem;
  transition: all 0.35s ease;
  box-shadow: 0 5px 14px rgba(251, 146, 60, 0.22);
  white-space: nowrap;
}
.login-btn:hover {
  transform: translateY(-2px) scale(1.03);
  box-shadow: 0 10px 20px rgba(251, 146, 60, 0.3);
}
.mobile-menu-btn {
  background: rgba(251, 146, 60, 0.15);
  border: 1.5px solid rgba(251, 146, 60, 0.3);
  color: #fb923c;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}
.mobile-menu-btn:hover {
  background: #fb923c;
  color: white;
  transform: scale(1.05);
}
.mobile-menu {
  background: rgba(248, 250, 252, 0.98);
  border-top: 1px solid rgba(251, 146, 60, 0.15);
  padding: 1rem 0;
  margin-top: 0.75rem;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
}
.mobile-nav-btn {
  display: block;
  width: 100%;
  text-align: left;
  background: transparent;
  border: none;
  color: #475569;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  font-size: 1rem;
}
.mobile-nav-btn.active {
  background: #fef3c7;
  color: #d97706;
  font-weight: 700;
}
.mobile-login-btn {
  display: block;
  width: calc(100% - 3rem);
  margin: 0.5rem 1.5rem 0;
  background: linear-gradient(135deg, #fb923c, #f97316);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 2rem;
  font-weight: 700;
}
.app-main {
  flex: 1;
  position: relative;
  z-index: 10;
  padding: 2.5rem 0 4rem;
}
.hero-section {
  margin-bottom: 3rem;
}
.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  background: rgba(251, 146, 60, 0.1);
  border: 1.5px solid rgba(251, 146, 60, 0.25);
  border-radius: 3rem;
  padding: 0.5rem 1.5rem;
  font-weight: 700;
  color: #f97316;
  backdrop-filter: blur(8px);
  margin-bottom: 1.75rem;
  font-size: 0.95rem;
}
.hero-badge i:first-child {
  animation: spin 4s linear infinite;
}
.hero-title {
  font-size: 4.5rem;
  font-weight: 900;
  line-height: 1.05;
  margin-bottom: 1.25rem;
  letter-spacing: -1.5px;
}
.title-line {
  display: block;
  background: linear-gradient(90deg, #fb923c, #f97316, #f87171);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.title-line:nth-child(2) {
  background: linear-gradient(90deg, #fde68a, #fb923c);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.title-line:nth-child(3) {
  background: linear-gradient(90deg, #f87171, #fb923c);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.phrase-rotator {
  height: 56px;
  overflow: hidden;
  margin: 1rem 0;
}
.rotator-content {
  transition: transform 0.7s cubic-bezier(0.4, 0, 0.2, 1);
}
.rotator-item {
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.6rem;
  color: #f97316;
  font-weight: 600;
}
.search-section {
  margin-bottom: 3rem;
}
.search-container {
  position: relative;
  max-width: 800px;
}
.search-glow {
  position: absolute;
  inset: -10px;
  background: linear-gradient(45deg, #fb923c, #f97316);
  border-radius: 2rem;
  filter: blur(24px);
  opacity: 0.3;
  z-index: -1;
  animation: pulse 3.5s infinite;
}
.search-box {
  position: relative;
}
.search-icon {
  position: absolute;
  left: 1.5rem;
  top: 50%;
  transform: translateY(-50%);
  color: #fb923c;
  font-size: 1.6rem;
  z-index: 2;
  animation: bounce 2.2s infinite;
}
.search-input {
  width: 100%;
  padding: 1.25rem 1.25rem 1.25rem 4.5rem;
  font-size: 1.35rem;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.85);
  border: 2px solid #fb923c;
  border-radius: 2rem;
  color: #1e293b;
  backdrop-filter: blur(12px);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 8px 28px rgba(251, 146, 60, 0.15);
}
.search-input::placeholder {
  color: rgba(251, 146, 60, 0.5);
  font-weight: 500;
}
.search-input:focus {
  outline: none;
  border-color: #fdba74;
  box-shadow: 0 0 0 4px rgba(251, 146, 60, 0.22), 0 12px 36px rgba(251, 146, 60, 0.18);
  transform: scale(1.02);
}
.suggestions-panel {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 0.75rem;
  background: rgba(255, 255, 255, 0.95);
  border: 1.5px solid rgba(251, 146, 60, 0.25);
  border-radius: 1.5rem;
  overflow: hidden;
  backdrop-filter: blur(16px);
  box-shadow: 0 16px 36px rgba(0, 0, 0, 0.12);
}
.suggestion-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.75rem;
  background: transparent;
  border: none;
  width: 100%;
  text-align: left;
  color: #1e293b;
  transition: all 0.3s ease;
  opacity: 0;
  transform: translateY(8px);
}
.suggestion-card:hover {
  background: rgba(251, 146, 60, 0.1);
  padding-left: 2.25rem;
}
.sugg-emoji {
  font-size: 1.75rem;
  margin-right: 1rem;
}
.sugg-text {
  font-weight: 700;
  font-size: 1.05rem;
  flex: 1;
}
.sugg-tag {
  background: rgba(251, 146, 60, 0.18);
  color: #f97316;
  padding: 0.3rem 0.9rem;
  border-radius: 2rem;
  font-size: 0.85rem;
  font-weight: 700;
}
.fade-enter-active .suggestion-card {
  animation: slideIn 0.35s ease forwards;
}
@keyframes slideIn {
  to { opacity: 1; transform: translateY(0); }
}
.stats-section {
  margin-bottom: 3rem;
}
.stat-item {
  background: rgba(255, 255, 255, 0.8);
  border: 1.5px solid rgba(251, 146, 60, 0.2);
  border-radius: 1.5rem;
  backdrop-filter: blur(10px);
  transition: all 0.4s ease;
}
.stat-item:hover {
  transform: translateY(-6px) scale(1.04);
  box-shadow: 0 14px 28px rgba(251, 146, 60, 0.16);
}
.stat-icon {
  font-size: 2rem;
  color: #fb923c;
  margin-bottom: 0.75rem;
}
.stat-value {
  font-size: 2.25rem;
  font-weight: 900;
  background: linear-gradient(90deg, #fb923c, #f97316);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  margin-bottom: 0.25rem;
}
.stat-label {
  color: #f97316;
  font-weight: 700;
  font-size: 0.95rem;
}
.categories-section {
  margin-bottom: 4rem;
}
.section-title {
  font-size: 2rem;
  font-weight: 900;
  background: linear-gradient(90deg, #fb923c, #f97316);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  margin-bottom: 2rem;
  letter-spacing: -0.5px;
}
.category-card {
  background: rgba(255, 255, 255, 0.75);
  border: 1.5px solid rgba(251, 146, 60, 0.18);
  border-radius: 1.5rem;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(8px);
}
.category-card:hover {
  background: rgba(255, 255, 255, 0.95);
  border-color: #fb923c;
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(251, 146, 60, 0.14);
}
.cat-emoji {
  font-size: 2.25rem;
  margin-bottom: 0.75rem;
  transition: transform 0.35s;
}
.category-card:hover .cat-emoji {
  transform: scale(1.2) rotate(6deg);
}
.cat-title {
  font-weight: 800;
  color: #f97316;
  margin-bottom: 0.5rem;
  font-size: 1rem;
}
.cat-items {
  font-size: 0.85rem;
  color: #64748b;
  line-height: 1.4;
}
.cta-section {
  text-align: center;
  margin-bottom: 3rem;
}
.cta-button {
  position: relative;
  background: linear-gradient(45deg, #fb923c, #f97316);
  color: white;
  border: none;
  padding: 1.1rem 3.5rem;
  font-size: 1.75rem;
  font-weight: 900;
  border-radius: 4rem;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.45s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 10px 28px rgba(251, 146, 60, 0.3);
  letter-spacing: -0.5px;
}
.cta-button:hover {
  transform: translateY(-5px) scale(1.05);
  box-shadow: 0 18px 36px rgba(251, 146, 60, 0.4);
}
.btn-shine {
  position: absolute;
  inset: -50%;
  background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.22), transparent);
  transform: rotate(45deg) translateX(-100%);
  transition: transform 0.7s;
}
.cta-button:hover .btn-shine {
  transform: rotate(45deg) translateX(100%);
}
.cta-subtitle {
  margin-top: 1.75rem;
  color: #f97316;
  font-size: 1.15rem;
  font-weight: 600;
}

/* Video Banner */
.video-banner-section {
  margin-top: 3rem;
  border-radius: 1.5rem;
  overflow: hidden;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.12);
}
.video-container {
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: 56.25%; /* 16:9 */
  background: #000;
}
.video-player {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.video-pause-btn {
  position: absolute;
  bottom: 1.5rem;
  right: 1.5rem;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  border: none;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  backdrop-filter: blur(8px);
  transition: all 0.3s ease;
  z-index: 10;
}
.video-pause-btn:hover {
  background: rgba(251, 146, 60, 0.9);
  transform: scale(1.1);
}
.video-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 2rem;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  color: white;
}
.video-text h3 {
  font-size: 1.75rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
}
.video-text p {
  font-size: 1.1rem;
  opacity: 0.9;
}

.app-footer {
  margin-top: auto;
  padding: 2rem 0;
  border-top: 1px solid rgba(251, 146, 60, 0.12);
  background: rgba(248, 250, 252, 0.9);
  backdrop-filter: blur(12px);
}
.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  font-size: 0.9rem;
  color: #64748b;
}
.footer-links {
  display: flex;
  gap: 1.75rem;
}
.footer-links a {
  color: #64748b;
  text-decoration: none;
  transition: color 0.3s;
  font-weight: 500;
}
.footer-links a:hover {
  color: #fb923c;
}
@keyframes pulse {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.65; }
}
@keyframes bounce {
  0%, 100% { transform: translateY(-50%) translateY(0); }
  50% { transform: translateY(-50%) translateY(-8px); }
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
@media (max-width: 1200px) {
  .hero-title { font-size: 4rem; }
}
@media (max-width: 992px) {
  .hero-title { font-size: 3.5rem; }
  .search-input { font-size: 1.25rem; padding: 1.1rem 1.1rem 1.1rem 4rem; }
  .cta-button { font-size: 1.5rem; padding: 1rem 3rem; }
}
@media (max-width: 768px) {
  .app-header { padding: 0.5rem 0; }
  .header-inner { gap: 0.5rem; }
  .brand { font-size: 1.5rem; }
  .brand i { font-size: 1.4rem; }
  .hero-title { font-size: 2.8rem; }
  .hero-badge { font-size: 0.85rem; padding: 0.4rem 1.2rem; }
  .phrase-rotator { height: 48px; }
  .rotator-item { font-size: 1.3rem; height: 48px; }
  .search-container { max-width: 100%; }
  .search-input { font-size: 1.1rem; padding: 1rem 1rem 1rem 3.5rem; }
  .stat-value { font-size: 1.8rem; }
  .category-card { padding: 1rem; }
  .cat-emoji { font-size: 1.8rem; }
  .cat-title { font-size: 0.9rem; }
  .cta-button { font-size: 1.35rem; padding: 0.9rem 2.5rem; }
  .video-text h3 { font-size: 1.4rem; }
  .video-text p { font-size: 0.95rem; }
}
@media (max-width: 576px) {
  .hero-title { font-size: 2.4rem; }
  .hero-badge { font-size: 0.8rem; padding: 0.35rem 1rem; gap: 0.5rem; }
  .phrase-rotator { height: 44px; }
  .rotator-item { font-size: 1.1rem; height: 44px; }
  .search-input { font-size: 1rem; padding: 0.9rem 0.9rem 0.9rem 3rem; }
  .stat-value { font-size: 1.5rem; }
  .cta-button { font-size: 1.2rem; padding: 0.8rem 2rem; }
  .footer-content { flex-direction: column; text-align: center; }
  .video-pause-btn { width: 40px; height: 40px; font-size: 1.25rem; bottom: 1rem; right: 1rem; }
}
.slide-enter-active, .slide-leave-active { transition: all 0.4s ease; }
.slide-enter-from, .slide-leave-to { opacity: 0; transform: translateY(-20px); }
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>