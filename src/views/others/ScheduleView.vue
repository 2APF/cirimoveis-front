<template>
  <main class="main" id="top">
    <NavbarComponent active="agende" />

    <section class="hero" :class="{ loaded: isHeroLoaded }">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-8 text-center hero-content">
            <h1>Agende Sua Visita</h1>
            <p class="lead">Preencha os dados abaixo e nossa equipe entrará em contato para confirmar a data ideal.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="form-section py-6">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-10 col-md-10">
            <div class="form-card">
              <form @submit.prevent="submitForm">
                <div class="row g-4">
                  <div class="col-12">
                    <input type="text" v-model="form.name" class="form-control" placeholder="Seu nome *" required />
                  </div>
                  <div class="col-md-6">
                    <!-- <label class="form-label">E-mail</label> -->
                    <input type="email" v-model="form.email" class="form-control" placeholder="E-mail (opcional)" required />
                  </div>
                  <div class="col-md-6">
                    <!-- <label class="form-label">Telefone (WhatsApp)</label> -->
                    <input type="tel" v-model="form.phone" class="form-control" placeholder="+244 9XX XXX XXX" required />
                  </div>
                  <div class="col-6">
                    <label class="form-label">Data Preferida *</label>
                    <input type="date" v-model="form.date" :min="today" class="form-control" required />
                  </div>
                  
                  <div class="col-6">
                    <label class="form-label">Assunto *</label>
                    <select v-model="form.subject" class="form-control" required>
                      <option value="" disabled selected>-- Selecione o assunto --</option>
                      <option>Compra e venda de propriedade</option>
                      <option>Legalização de propriedade</option>
                      <option>Intermediação</option>
                      <option>Outro</option>
                    </select>
                  </div>
                  <div class="col-12"> 
                    <textarea v-model="form.message" rows="4" class="form-control" placeholder="Mais detalhes (opcional)"></textarea>
                  </div>
                  <div class="col-12 text-center mt-5">
                    <button type="submit" class="btn-submit" :disabled="submitting">
                      {{ submitting ? 'Enviando...' : 'Enviar Pedido Agora' }}
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

    <div v-if="notification.show" class="alert success">
      {{ notification.message }}
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import NavbarComponent from '@/components/NavbarComponent.vue'
import FooterComponent from '@/components/FooterComponent.vue'

const isHeroLoaded = ref(false)
const submitting = ref(false)
const today = new Date().toISOString().split('T')[0]

const form = ref({
  subject: '',
  name: '',
  email: '',
  phone: '',
  date: '',
  message: ''
})

const notification = ref({
  show: false,
  message: ''
})

const showNotification = (msg: string) => {
  notification.value = { show: true, message: msg }
  setTimeout(() => notification.value.show = false, 5000)
}

const submitForm = async () => {
  submitting.value = true
  await new Promise(resolve => setTimeout(resolve, 1500))
  showNotification('Pedido enviado com sucesso! Entraremos em contato em breve.')
  form.value = { subject: '', name: '', email: '', phone: '', date: '', message: '' }
  submitting.value = false
}

onMounted(() => {
  setTimeout(() => isHeroLoaded.value = true, 200)
})
</script>

<style scoped>
.main {
  min-height: 100vh;
  background: var(--light-bg);
}

.hero {
  background: linear-gradient(135deg, var(--soft-red) 0%, var(--light-bg) 100%);
  padding: 160px 0 120px;
  min-height: 75vh;
  position: relative;
  overflow: hidden;
}

.hero::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: url('https://pic.le-cdn.com/thumbs/520x390/190/1/properties/Property-d8765125c11c127409aec090c78601dc-129391478.jpg') center/cover;
  opacity: 0.08;
  z-index: 0;
}

.hero-content {
  position: relative;
  z-index: 1;
  opacity: 0;
  transform: translateY(40px);
  transition: all 1s ease;
}

.hero.loaded .hero-content {
  opacity: 1;
  transform: translateY(0);
}

.hero h1 {
  font-size: 4rem;
  font-weight: 900;
  background: linear-gradient(90deg, var(--dark-charcoal), var(--primary-red));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 1.5rem;
}

.hero .lead {
  font-size: 1.35rem;
  color: var(--medium-gray);
  font-weight: 500;
  max-width: 800px;
  margin: 0 auto;
}

.form-card {
  background: white;
  border-radius: 20px;
  padding: 50px 40px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.06);
  border: 1px solid var(--soft-red);
}

.form-label {
  font-weight: 600;
  color: var(--dark-charcoal);
  margin-bottom: 8px;
  font-size: 1rem;
}

.form-control,
select.form-control {
  border-radius: 12px;
  padding: 14px 18px;
  border: 1px solid var(--soft-red);
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;
}

.form-control:focus,
select.form-control:focus {
  border-color: var(--primary-red);
  box-shadow: 0 0 0 4px rgba(211,47,47,0.12);
  outline: none;
}

.btn-submit {
  background: linear-gradient(135deg, var(--primary-red), #c62828);
  color: white;
  padding: 16px 50px;
  border-radius: 50px;
  font-size: 1.15rem;
  font-weight: 700;
  border: none;
  box-shadow: 0 8px 25px rgba(211,47,47,0.2);
  transition: all 0.4s ease;
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-4px);
  box-shadow: 0 15px 35px rgba(211,47,47,0.25);
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.alert {
  position: fixed;
  top: 100px;
  right: 30px;
  padding: 16px 30px;
  border-radius: 14px;
  background: #10b981;
  color: white;
  font-weight: 600;
  font-size: 1rem;
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
  z-index: 9999;
  animation: slideIn 0.4s ease;
}

@keyframes slideIn {
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

@media (max-width: 992px) {
  .hero h1 { font-size: 3.5rem; }
  .form-card { padding: 45px 35px; }
}

@media (max-width: 768px) {
  .hero { padding: 140px 0 100px; }
  .hero h1 { font-size: 3rem; }
  .hero .lead { font-size: 1.2rem; }
  .form-card { padding: 40px 25px; }
  .btn-submit { padding: 14px 40px; }
}
</style>