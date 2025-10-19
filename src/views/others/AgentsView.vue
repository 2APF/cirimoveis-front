<template>
  <main class="main agents-page" id="top">
    
    
    <NavbarComponent active="agents" />

    <!-- Hero Section - MESMO DO SOBRE -->
    <section class="hero d-flex align-items-center">
      <div class="container">
        <div class="row">
          <div class="col-lg-8 mx-auto text-center hero-content">
            <h1>Nossos Agentes Verificados</h1>
            <p class="lead">Especialistas certificados da Cirimoveis prontos para encontrar o imóvel perfeito para você</p>
            <div class="hero-buttons mt-4">
              <button class="btn btn-hero me-3" @click="scrollToApply">
                <i class="fas fa-user-plus me-2"></i> Candidatar-se como Agente
              </button>
              <button class="btn btn-secondary" @click="scrollToAgents">
                <i class="fas fa-users me-2"></i> Ver Todos os Agentes
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Search Section -->
    <section class="search-section py-5">
      <div class="container">
        <div class="search-card">
          <h2 class="section-title mb-4">Encontre o Especialista Ideal</h2>
          <div class="row g-3">
            <div class="col-lg-4 col-md-6">
              <input 
                v-model="search.name" 
                type="text" 
                class="form-control" 
                placeholder="Nome do agente"
                @keyup="filterAgents"
              />
            </div>
            <div class="col-lg-4 col-md-6">
              <input 
                v-model="search.reference" 
                type="text" 
                class="form-control" 
                placeholder="Referência"
                @keyup="filterAgents"
              />
            </div>
            <div class="col-lg-4 col-md-12">
              <input 
                v-model="search.city" 
                type="text" 
                class="form-control" 
                placeholder="Cidade"
                @keyup="filterAgents"
              />
            </div>
          </div>
          <div class="text-center mt-4">
            <button @click="clearFilters" class="btn btn-outline-secondary">
              <i class="fas fa-times me-2"></i>Limpar Filtros
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Agents Grid -->
    <section class="agents-grid py-5" ref="agentsSection">
      <div class="container">
        <div class="section-header text-center mb-5">
          <h2 class="section-title">Nossos Agentes Verificados</h2>
          <p class="section-subtitle">{{ filteredAgents.length }} especialistas certificados</p>
        </div>
        <div v-if="isLoading" class="text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Carregando...</span>
          </div>
        </div>
        <div v-else-if="filteredAgents.length === 0" class="empty-state text-center py-5">
          <i class="fas fa-users-slash" style="font-size: 5rem; color: var(--soft-red);"></i>
          <h3>Nenhum agente encontrado</h3>
          <p>Tente ajustar os filtros de busca</p>
        </div>
        <div v-else class="row g-4">
          <div v-for="agent in filteredAgents" :key="agent.id" class="col-xl-3 col-lg-4 col-md-6">
            <div class="agent-card">
              <div class="agent-header">
                <img :src="agent.avatar" :alt="agent.name" class="agent-avatar" @error="handleImageError" />
                <div v-if="agent.verified" class="verified-badge">
                  <i class="fas fa-check-circle"></i>
                </div>
              </div>
              <div class="agent-body">
                <h4>{{ agent.name }}</h4>
                <p class="agent-reference">Ref: {{ agent.reference }}</p>
                <p class="agent-specialty">{{ agent.specialty }}</p>
                <p class="agent-location"><i class="fas fa-map-marker-alt me-1"></i>{{ agent.city }}</p>
                <div class="agent-stats">
                  <div class="stat"><i class="fas fa-home"></i>{{ agent.properties }}+</div>
                  <div class="stat"><i class="fas fa-star"></i>{{ agent.rating }}/5</div>
                </div>
              </div>
              <div class="agent-actions">
                <button @click="contactAgent(agent)" class="btn btn-whatsapp">
                  <i class="fab fa-whatsapp me-2"></i>Contato
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Apply Section -->
    <section class="apply-section py-5" ref="applySection">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-6">
            <h2 class="section-title mb-4">Torne-se um Agente Cirimoveis</h2>
            <p class="lead mb-4">Ganhe comissões de até 3% + benefícios exclusivos</p>
            <div class="benefits-grid">
              <div class="benefit"><i class="fas fa-check-circle me-2"></i>Comissão 3% por venda</div>
              <div class="benefit"><i class="fas fa-check-circle me-2"></i>Leads qualificados</div>
              <div class="benefit"><i class="fas fa-check-circle me-2"></i>Treinamento gratuito</div>
              <div class="benefit"><i class="fas fa-check-circle me-2"></i>Suporte 24/7</div>
            </div>
          </div>
          <div class="col-lg-6">
            <div class="apply-card">
              <h3 class="mb-3 text-danger">Candidatura Rápida</h3>
              <form @submit.prevent="submitApplication" class="apply-form">
                <div class="row g-3">
                  <div class="col-12">
                    <input v-model="application.name" type="text" class="form-control" placeholder="Nome Completo *" required />
                  </div>
                  <div class="col-12">
                    <input v-model="application.phone" type="tel" class="form-control" placeholder="WhatsApp *" required />
                  </div>
                  <div class="col-12">
                    <input v-model="application.email" type="email" class="form-control" placeholder="Email *" required />
                  </div>
                  <div class="col-12">
                    <select v-model="application.experience" class="form-control" required>
                      <option value="">Experiência em Imóveis</option>
                      <option value="0-1">0-1 ano</option>
                      <option value="1-3">1-3 anos</option>
                      <option value="3+">3+ anos</option>
                    </select>
                  </div>
                  <div class="col-12">
                    <button type="submit" class="btn btn-apply w-100" :disabled="isSubmitting">
                      <i v-show="isSubmitting" class="fas fa-spinner fa-spin me-2"></i>
                      {{ isSubmitting ? 'Enviando...' : 'Candidatar-se Agora' }}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>

    <FooterComponent />

    <!-- Notification -->
    <div v-if="notification.message" class="alert" :class="notification.type">
      <i :class="notification.type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle'"></i>
      {{ notification.message }}
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, reactive } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import NavbarComponent from '@/components/NavbarComponent.vue'
import FooterComponent from '@/components/FooterComponent.vue'
import axios from 'axios'
import Cookies from 'js-cookie'

const router = useRouter()
const API_URL = (import.meta.env.VITE_API_BASE_URL as string) || 'https://api.cirimoveis.com/api/v1'

interface Agent {
  id: number
  name: string
  reference: string
  avatar: string
  specialty: string
  city: string
  phone: any
  properties: number
  rating: number
  verified: boolean
}

interface Application {
  name: string
  phone: string
  email: string
  experience: string
}

const agents = ref<Agent[]>([])
const filteredAgents = ref<Agent[]>([])
const isLoading = ref(false)
const isSubmitting = ref(false)

const search = reactive({
  name: '',
  reference: '',
  city: ''
})

const application = reactive<Application>({
  name: '',
  phone: '',
  email: '',
  experience: ''
})

const notification = ref({
  message: '',
  type: 'success' as 'success' | 'error'
})

const agentsSection = ref<HTMLElement>()
const applySection = ref<HTMLElement>()

// FILTRO EM TEMPO REAL
const filteredAgentsComputed = computed(() => {
  return agents.value.filter(agent => {
    const nameMatch = agent.name.toLowerCase().includes(search.name.toLowerCase())
    const refMatch = agent.reference.toLowerCase().includes(search.reference.toLowerCase())
    const cityMatch = agent.city.toLowerCase().includes(search.city.toLowerCase())
    return nameMatch && refMatch && cityMatch
  })
})

onMounted(() => {
  loadAgents()
  scrollToAgents()
})

const loadAgents = async () => {
  try {
    isLoading.value = true
    const token = Cookies.get('token')
    const response = await axios.get(`${API_URL}/agents`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    
    agents.value = response.data
    filteredAgents.value = [...agents.value]
  } catch (error) {
    console.error('Erro ao carregar agentes:', error)
    showNotification('Erro ao carregar agentes', 'error')
  } finally {
    isLoading.value = false
  }
}

const filterAgents = () => {
  filteredAgents.value = filteredAgentsComputed.value
}

const clearFilters = () => {
  search.name = ''
  search.reference = ''
  search.city = ''
  filteredAgents.value = [...agents.value]
}

const contactAgent = (agent: Agent) => {
  const phone: number = agent.phone?.replace(/\D/g, '') || '912345678'
  window.open(`https://wa.me/244${phone}`, '_blank')
}

const submitApplication = async () => {
  if (isSubmitting.value) return
  
  isSubmitting.value = true
  try {
    const token = Cookies.get('token')
    await axios.post(`${API_URL}/agents/apply`, application, {
      headers: { Authorization: `Bearer ${token}` }
    })
    
    showNotification('Candidatura enviada com sucesso! Entraremos em contato em 24h.', 'success')
    Object.assign(application, { name: '', phone: '', email: '', experience: '' })
  } catch (error: any) {
    showNotification(error.response?.data?.message || 'Erro ao enviar candidatura', 'error')
  } finally {
    isSubmitting.value = false
  }
}

const scrollToApply = () => {
  applySection.value?.scrollIntoView({ behavior: 'smooth' })
}

const scrollToAgents = () => {
  agentsSection.value?.scrollIntoView({ behavior: 'smooth' })
}

const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement
  target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(target.alt)}&background=dc3545&color=fff&size=80`
}

const showNotification = (message: string, type: 'success' | 'error') => {
  notification.value = { message, type }
  setTimeout(() => notification.value.message = '', 3000)
}
</script>

<style scoped>
.agents-page { background: linear-gradient(135deg, var(--soft-red) 0%, #f8f9fa 100%); }

/* HERO EXATAMENTE IGUAL AO SOBRE */
.hero {
  background: linear-gradient(135deg, var(--soft-red) 0%, var(--light-bg) 100%);
  padding: 120px 0;
  min-height: 70vh;
  position: relative;
  overflow: hidden;
}

.hero::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80') no-repeat center/cover;
  opacity: 0.08;
  z-index: 0;
}

.hero-content {
  position: relative;
  z-index: 1;
}

.hero h1 {
  font-size: 3.5rem;
  font-weight: 800;
  color: var(--dark-charcoal);
  margin-bottom: 20px;
  line-height: 1.2;
}

.hero .lead {
  font-size: 1.3rem;
  color: var(--medium-gray);
  font-weight: 500;
}

.btn-hero {
  background: linear-gradient(135deg, var(--primary-red), #e53935);
  color: #fff;
  padding: 12px 28px;
  border-radius: 50px;
  font-weight: 700;
  border: none;
  transition: all 0.3s ease;
  box-shadow: 0 3px 10px rgba(211, 47, 47, 0.2);
}

.btn-hero:hover {
  background: linear-gradient(135deg, #b71c1c, #d32f2f);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(211, 47, 47, 0.3);
}

.btn-secondary {
  background: rgba(255,255,255,0.2);
  color: var(--dark-charcoal);
  border: 1px solid var(--dark-charcoal);
  padding: 12px 28px;
  border-radius: 50px;
  font-weight: 700;
}

.btn-secondary:hover {
  background: var(--dark-charcoal);
  color: white;
  transform: translateY(-2px);
}

.search-section { padding: 60px 0; }
.search-card {
  background: var(--card-bg);
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 10px 30px var(--shadow-medium);
}

.section-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: var(--dark-charcoal);
  text-align: center;
  position: relative;
  margin-bottom: 20px;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 50px;
  height: 3px;
  background: var(--primary-red);
}

.form-control {
  border: 2px solid #e9ecef;
  border-radius: 12px;
  padding: 12px 16px;
  transition: all 0.3s ease;
}

.form-control:focus { 
  border-color: var(--primary-red); 
  box-shadow: 0 0 0 0.2rem rgba(211,47,47,0.1); 
}

.agent-card {
  background: var(--card-bg);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
  height: 100%;
  border: 1px solid rgba(0,0,0,0.05);
}

.agent-card:hover { 
  transform: translateY(-10px); 
  box-shadow: 0 20px 40px rgba(0,0,0,0.15); 
}

.agent-header {
  position: relative;
  height: 200px;
  background: linear-gradient(135deg, var(--soft-red), var(--primary-red));
}

.agent-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  border: 4px solid white;
  object-fit: cover;
}

.verified-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  color: #28a745;
  font-size: 1.2rem;
}

.agent-body { padding: 60px 20px 20px; text-align: center; }

.agent-body h4 { 
  font-weight: 700; 
  color: var(--dark-charcoal); 
  margin-bottom: 8px; 
  font-size: 1.1rem;
}

.agent-reference {
  color: var(--primary-red);
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: 4px;
}

.agent-specialty { 
  color: var(--medium-gray); 
  font-weight: 500; 
  margin-bottom: 12px; 
  font-size: 0.95rem;
}

.agent-location { 
  color: var(--medium-gray); 
  margin-bottom: 16px; 
  font-size: 0.9rem;
}

.agent-stats {
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 0.85rem;
}

.stat i { color: var(--primary-red); font-size: 1rem; margin-bottom: 4px; }
.stat span { font-weight: 600; color: var(--dark-charcoal); }

.agent-actions {
  padding: 20px;
}

.btn-whatsapp {
  background: #25D366;
  color: white;
  border: none;
  width: 100%;
  padding: 12px;
  border-radius: 10px;
  font-weight: 600;
}

.btn-whatsapp:hover { background: #128C7E; }

.btn-outline-secondary {
  border: 2px solid var(--medium-gray);
  color: var(--medium-gray);
  padding: 8px 20px;
  border-radius: 25px;
}

.btn-outline-secondary:hover { 
  background: var(--medium-gray); 
  color: white; 
}

.empty-state i { opacity: 0.5; margin-bottom: 20px; }
.empty-state h3 { color: var(--dark-charcoal); margin-bottom: 10px; }

.apply-section {
  background: linear-gradient(135deg, var(--primary-red), #e53935);
  color: white;
  padding: 80px 0;
}

.apply-card {
  background: rgba(255,255,255,0.95);
  border-radius: 20px;
  padding: 30px;
  backdrop-filter: blur(10px);
}

.apply-form .form-control { background: white; border-radius: 10px; }

.btn-apply {
  background: var(--primary-red);
  color: white;
  border-radius: 50px;
  padding: 12px;
  font-weight: 700;
}

.btn-apply:hover { background: #b71c1c; transform: translateY(-2px); }

.benefits-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 20px;
}

.benefit { 
  display: flex; 
  align-items: center; 
  font-size: 0.95rem;
  color: rgba(255,255,255,0.9);
}

.benefits-grid i { color: #ffd700; }

.agents-grid { padding: 80px 0; }

.section-subtitle {
  font-size: 1.2rem;
  color: var(--medium-gray);
  text-align: center;
  margin-bottom: 0;
}

.alert {
  position: fixed;
  top: 100px;
  right: 20px;
  z-index: 9999;
  padding: 12px 20px;
  border-radius: 10px;
  animation: slideInRight 0.3s ease;
}

.alert.success { background: #28a745; color: white; }
.alert.error { background: #dc3545; color: white; }

@media (max-width: 992px) {
  .hero h1 { font-size: 3rem; }
  .benefits-grid { grid-template-columns: 1fr; }
}

@media (max-width: 768px) {
  .hero { padding: 80px 0; }
  .hero h1 { font-size: 2.5rem; }
  .search-card { padding: 20px; }
  .agent-body { padding: 50px 15px 15px; }
  .agent-stats { flex-direction: column; gap: 8px; }
}

@keyframes slideInRight {
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}
</style>