<template>
  <main class="main" id="top">
    <!-- Navbar Component -->
    <NavbarComponent />

    <!-- Auth Section -->
    <section class="auth-section">
      <div class="container mt-3">
        <div class="auth-card">
          <div class="toggle-buttons">
            <button class="toggle-btn" :class="{ active: authMode === 'login' }" @click="authMode = 'login'">
              Login
            </button>
            <button class="toggle-btn" :class="{ active: authMode === 'signup' }" @click="authMode = 'signup'">
              Cadastro
            </button>
          </div>

          <!-- Auth Form -->
          <div class="form-container">
            <!-- Login Form -->
            <form v-if="authMode === 'login'" @submit.prevent="handleLogin" class="auth-form">
              <p class="section-subtitle text-center mb-4">Acesse sua conta para continuar.</p>


              <div class="input-group">
                <input id="login-email" type="email" v-model="loginForm.email" placeholder="Email" class="form-control"
                  required @input="clearError" style="width: 100%;  " />
                <span v-if="errors.email" class="error-text">{{ errors.email }}</span>
              </div>




              <div class="input-group">
                <label for="login-password" class="sr-only">Senha</label>
                <div class="password-wrapper">

                  <input id="login-password" :type="showPassword ? 'text' : 'password'" v-model="loginForm.password"
                    placeholder="Senha" class="form-control" required aria-required="true" @input="clearError" />

                  <button type="button" class="toggle-password" @click="showPassword = !showPassword"
                    aria-label="Alternar visibilidade da senha">
                    <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                  </button>
                </div>
                <span v-if="errors.password" class="error-text">{{ errors.password }}</span>
              </div>

              <div class="form-options">
                <label class="remember-me">
                  <input type="checkbox" v-model="loginForm.remember" />
                  Lembrar-me
                </label>
                <RouterLink to="/forgot-password" class="forgot-password">Esqueceu a senha?</RouterLink>
              </div>

              <button type="submit" class="btn filter-btn" :disabled="isSubmitting" :aria-busy="isSubmitting">
                <i v-show="isSubmitting" class="fas fa-spinner fa-spin me-2"></i>
                {{ isSubmitting ? 'Entrando...' : 'Entrar' }}
              </button>
            </form>
















            <form v-else @submit.prevent="handleSignup" class="auth-form">
              <p class="section-subtitle text-center">Junte-se à Cirimoveis hoje!</p>

              <div class="input-group">

                <input id="signup-name" type="text" v-model="signupForm.name" placeholder="Nome *" class="form-control"
                  required @input="clearError" style="width: 100%;  " />

                <span v-if="errors.name" class="error-text">{{ errors.name }}</span>
              </div>

              
              <div class="input-group">
                <input id="signup-phone" type="text" v-model="signupForm.phone" placeholder="Telefone *"
                  class="form-control" required @input="clearError" style="width: 100%;" />
                <span v-if="errors.phone" class="error-text">{{ errors.phone }}</span>
              </div>


              <div class="input-group">
                <input id="signup-email" type="email" v-model="signupForm.email" placeholder="Email *"
                  class="form-control" required @input="clearError" style="width: 100%;  " />

                <span v-if="errors.email" class="error-text">{{ errors.email }}</span>
              </div>


              <div class="input-group">
                <label for="signup-password" class="sr-only">Senha</label>
                <div class="password-wrapper">
                  <input id="signup-password" :type="showPassword ? 'text' : 'password'" v-model="signupForm.password"
                    placeholder="Senha" class="form-control" required aria-required="true" @input="clearError" />
                  <button type="button" class="toggle-password" @click="showPassword = !showPassword"
                    aria-label="Alternar visibilidade da senha">
                    <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                  </button>
                </div>
                <span v-if="errors.password" class="error-text">{{ errors.password }}</span>
              </div>

              <div class="input-group">
                <label for="signup-confirm-password" class="sr-only">Confirmar Senha</label>
                <div class="password-wrapper">
                  <input id="signup-confirm-password" :type="showPassword ? 'text' : 'password'"
                    v-model="signupForm.confirmPassword" placeholder="Confirmar Senha" class="form-control" required
                    aria-required="true" @input="clearError" />
                  <button type="button" class="toggle-password" @click="showPassword = !showPassword"
                    aria-label="Alternar visibilidade da senha">
                    <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                  </button>
                </div>
                <span v-if="errors.confirmPassword" class="error-text">{{ errors.confirmPassword }}</span>
              </div>

              <button type="submit" class="btn filter-btn" :disabled="isSubmitting" :aria-busy="isSubmitting">
                <i v-show="isSubmitting" class="fas fa-spinner fa-spin me-2"></i>
                {{ isSubmitting ? 'Cadastrando...' : 'Cadastrar' }}
              </button>
            </form>

            <!-- Social Login -->
            <div class="social-login">
              <p class="social-login-text">Ou acesse com</p>
              <div class="social-buttons">
                <a href="#" class="btn social-btn google-btn" aria-label="Login com Google"
                  @click.prevent="socialLogin('google')">
                  <i class="fab fa-google me-2"></i> Google
                </a>
                <!-- <a href="#" class="btn social-btn facebook-btn" aria-label="Login com Facebook"
                  @click.prevent="socialLogin('facebook')">
                  <i class="fab fa-facebook-f me-2"></i> Facebook
                </a> -->
              </div>
            </div>
          </div>
        </div>

        <!-- Notification -->
        <div v-if="notification.message" class="alert" :class="notification.type">
          <i :class="notification.type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle'"></i>
          {{ notification.message }}
        </div>
      </div>
    </section>


    <FooterComponent />
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import NavbarComponent from '@/components/NavbarComponent.vue'

import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import Cookies from 'js-cookie'
import FooterComponent from '@/components/FooterComponent.vue';

const router = useRouter();
const route = useRoute();

const API_URL = (import.meta.env.VITE_API_BASE_URL as string) || 'https://api.cirimoveis.com/api/v1';

// Reactive States
const authMode = ref<'login' | 'signup'>('login')
const isSubmitting = ref(false)
const showPassword = ref(false)




interface LoginForm {
  email: string;
  password: string;
  remember: boolean;
}


interface signupForm {
  phone?: string;
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}


const loginForm = ref<LoginForm>({
  email: '',
  password: '',
  remember: false,
})


const signupForm = ref<signupForm>({
  phone: '',
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
})
const errors = ref({
  phone: '',
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
})
const notification = ref({
  message: '',
  type: 'success' as 'success' | 'error',
})

// Methods
const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
// ao passar o numero a ideia e aceitar varios tipos de ddd
const validatePhoneNumber = (phone: string) => /^\+?\d{9,15}$/.test(phone);

const clearError = () => {
  errors.value = { name: '', phone: '', email: '', password: '', confirmPassword: '' }
}

const showNotification = (message: string, type: 'success' | 'error') => {
  notification.value = { message, type }
  setTimeout(() => {
    notification.value = { message: '', type: 'success' }
  }, 3000)
}

const handleLogin = async () => {
  clearError()
  if (!validateEmail(loginForm.value.email)) {
    errors.value.email = 'Por favor, insira um email válido'
    return
  }
  if (loginForm.value.password.length < 6) {
    errors.value.password = 'A senha deve ter pelo menos 6 caracteres'
    return
  }

  try {

    isSubmitting.value = true

    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: loginForm.value.email,
        password: loginForm.value.password
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Erro ao autenticar. Tente novamente.');
    }

    isSubmitting.value = false;

    // console.log(data.user.name);
    Cookies.set('token', data.access_token, { expires: loginForm.value.remember ? 7 : undefined, secure: true, sameSite: 'Strict' });
    Cookies.set('user', JSON.stringify(data.user.id), { expires: loginForm.value.remember ? 7 : undefined, secure: true, sameSite: 'Strict' });
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.access_token}`;

    if (data.user.type == '0' || data.user.type == '1') {
      router.push({ name: 'app.dash.homepage' }).catch(() => { });
    } else if (data.user.type == '3') {
      router.push({ name: 'app.user.property.create' }).catch(() => { });
    }

    showNotification('Autenticado com sucesso!', 'success');

    // Redireciona para a página principal / dashboard
    // router.push({ name: 'app.user.homepage' }).catch(() => { });

  } catch (error: unknown) {
    isSubmitting.value = false;
    const errorMessage = error instanceof Error ? error.message : 'Erro ao autenticar. Tente novamente.';
    showNotification(errorMessage, 'error');
  }
}









const handleSignup = async () => {
  clearError()
  if (!signupForm.value.name.trim()) {
    errors.value.name = 'O nome é obrigatório'
    return
  }
  if (!validatePhoneNumber(signupForm.value.phone || '')) {
    errors.value.phone = 'Por favor, insira um número de telefone válido'
    return
  }
  if (!validateEmail(signupForm.value.email)) {
    errors.value.email = 'Por favor, insira um email válido'
    return
  }
  if (signupForm.value.password.length < 6) {
    errors.value.password = 'A senha deve ter pelo menos 6 caracteres'
    return
  }
  if (signupForm.value.password !== signupForm.value.confirmPassword) {
    errors.value.confirmPassword = 'As senhas não coincidem'
    return
  }


  try {

    isSubmitting.value = true


    const response = await fetch(`${API_URL}/auth/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: signupForm.value.name,
        phone: signupForm.value.phone,
        email: signupForm.value.email,
        password: signupForm.value.password,
        password_confirmation: signupForm.value.confirmPassword,
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Erro ao cadastrar. Tente novamente.');
    }

    isSubmitting.value = false;

    showNotification('Conta criada com sucesso!', 'success');

    signupForm.value = { name: '', phone: '', email: '', password: '', confirmPassword: '' };



    // console.log(data.user.name);
    Cookies.set('token', data.access_token, { expires: loginForm.value.remember ? 7 : undefined, secure: true, sameSite: 'Strict' });
    Cookies.set('user', JSON.stringify(data.user.id), { expires: loginForm.value.remember ? 7 : undefined, secure: true, sameSite: 'Strict' });
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.access_token}`;

      router.push({ name: 'app.user.property.create' }).catch(() => { });
  



    // authMode.value = 'login';

  } catch (error: unknown) {
    isSubmitting.value = false;
    const errorMessage = error instanceof Error ? error.message : 'Erro ao cadastrar. Tente novamente.';
    showNotification(errorMessage, 'error');
  }
}


const socialLogin = (provider: 'google' | 'facebook') => {
  // Redireciona para o backend que invoca Socialite e redireciona pro provedor OAuth
  // Backend deve estar preparado para: GET /api/auth/redirect/{provider}
  window.location.href = `${API_URL}/auth/redirect/${provider}`;
};

const handleSocialLoginCallback = async (token: string) => {
  try {
    // Guarda token localmente e configura axios
    localStorage.setItem('auth_token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    // Opcional: buscar info do usuário (se tiver endpoint /api/me)
    // const { data } = await axios.get(`${API_URL}/me`);
    showNotification('Autenticado com sucesso!', 'success');

    // Redireciona para a página principal / dashboard
    // Mantive o redirecionamento simples; altera conforme tua rota real
    router.push({ name: 'app.user.property.create' }).catch(() => { });
  } catch (err) {
    console.error('Erro ao processar callback social:', err);
    showNotification('Erro ao autenticar via rede social.', 'error');
  }
};



onMounted(() => {
  const tokenFromQuery = route.query.token as string | undefined
  const idFromQuery = route.query.id as string | undefined

  const token = tokenFromQuery
  const id = idFromQuery || null

  if (token && id) {
    // remove token e id da URL sem recarregar a página
    const url = new URL(window.location.href)
    url.searchParams.delete('token')
    url.searchParams.delete('user')
    window.history.replaceState({}, document.title, url.pathname + url.hash)

    // salva token e user em cookies (expiram em 7 dias)
    Cookies.set('token', token, { expires: 7, secure: true, sameSite: 'Strict' })
    Cookies.set('user', id, { expires: 7, secure: true, sameSite: 'Strict' })

    // configura axios automaticamente
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

    // mostra mensagem de sucesso e redireciona
    showNotification('Autenticado com sucesso!', 'success')
    router.push({ name: 'app.user.property.create' }).catch(() => { })
  }
})

</script>

<style scoped>
.btn-announce {
  background: linear-gradient(135deg, var(--primary-red), #e53935);
  color: #fff !important;
  border: none;
  padding: 10px 22px;
  border-radius: 50px;
  font-weight: 700;
  font-size: 0.95rem;
  transition: all 0.3s var(--animation-ease);
  box-shadow: 0 3px 12px rgba(211, 47, 47, 0.2);
}

.btn-announce:hover {
  background: linear-gradient(135deg, #b71c1c, #d32f2f);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(211, 47, 47, 0.3);
}


.auth-section {
  padding: 100px 0 80px;
  background: linear-gradient(135deg, var(--soft-red) 0%, var(--light-bg) 100%);
  position: relative;
  min-height: 100vh;
  display: flex;
  z-index: 1;
  align-items: center;
}



.auth-section::before {
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

.auth-card {
  background: var(--card-bg);
  backdrop-filter: blur(15px);
  border-radius: 16px;
  box-shadow: 0 6px 20px var(--shadow-medium);
  padding: 2rem;
  width: 100%;
  max-width: 650px;
  margin: 0 auto;
  z-index: 10;
  animation: fadeInUp 0.6s var(--animation-ease);
  border: 1px solid var(--soft-red);
}

.toggle-buttons {
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.toggle-btn {
  flex: 1;
  padding: 0.75rem;
  text-align: center;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--medium-gray);
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  transition: all 0.3s var(--animation-ease);
}

.toggle-btn.active {
  color: var(--primary-red);
  border-bottom: 2px solid var(--primary-red);
}

.toggle-btn:hover {
  color: var(--primary-red);
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: var(--dark-charcoal);
  text-align: center;
  margin-bottom: 20px;
  position: relative;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 50px;
  height: 2px;
  background: var(--primary-red);
  border-radius: 1px;
}

.section-subtitle {
  font-size: 1.2rem;
  font-weight: 500;
  color: var(--medium-gray);
  max-width: 800px;
  margin: 0 auto 20px;
}

.input-group {
  display: flex;
  flex-direction: column;
}

.form-control {
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 12px 16px;
  transition: all 0.3s var(--animation-ease);
  color: var(--dark-charcoal);
  background-color: var(--card-bg);
  font-size: 1rem;
}

.form-control:focus {
  border-color: var(--primary-red);
  box-shadow: 0 0 0 0.15rem rgba(211, 47, 47, 0.1);
  outline: none;
}

.password-wrapper {
  position: relative;
}

.toggle-password {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--medium-gray);
  font-size: 1rem;
  cursor: pointer;
  transition: color 0.3s var(--animation-ease);
}

.toggle-password:hover {
  color: var(--primary-red);
}

.error-text {
  color: var(--primary-red);
  font-size: 0.85rem;
  margin-top: 0.25rem;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
  color: var(--medium-gray);
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.forgot-password {
  color: var(--primary-red);
  text-decoration: none;
  transition: all 0.3s var(--animation-ease);
}

.forgot-password:hover {
  text-decoration: underline;
}

.filter-btn {
  background: linear-gradient(135deg, var(--primary-red), #e53935);
  border: none;
  border-radius: 12px;
  padding: 12px 28px;
  color: #fff;
  font-weight: 600;
  transition: all 0.3s var(--animation-ease);
  box-shadow: 0 3px 10px rgba(211, 47, 47, 0.2);
}

.filter-btn:hover {
  background: linear-gradient(135deg, #b71c1c, #d32f2f);
  transform: translateY(-2px);
}

.filter-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.social-login {
  margin-top: 1.5rem;
  text-align: center;
}

.social-login-text {
  font-size: 0.95rem;
  color: var(--medium-gray);
  margin-bottom: 1rem;
}

.social-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.social-btn {
  flex: 1;
  padding: 0.75rem;
  color: #fff;
  font-weight: 600;
  text-decoration: none;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s var(--animation-ease);
}

.google-btn {
  background: linear-gradient(135deg, #4285f4, #3578e5);
  box-shadow: 0 3px 10px rgba(66, 133, 244, 0.2);
}

.google-btn:hover {
  background: linear-gradient(135deg, #3578e5, #2a69d6);
  transform: translateY(-2px);
}

.facebook-btn {
  background: linear-gradient(135deg, #3b5998, #2e4373);
  box-shadow: 0 3px 10px rgba(59, 89, 152, 0.2);
}

.facebook-btn:hover {
  background: linear-gradient(135deg, #2e4373, #21325a);
  transform: translateY(-2px);
}

.alert {
  position: fixed;
  top: 80px;
  right: 15px;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  color: #fff;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 3px 10px var(--shadow-medium);
  z-index: 9999;
  animation: fadeIn 0.3s var(--animation-ease);
}

.alert.success {
  background: #4caf50;
}

.alert.error {
  background: var(--primary-red);
}

/* Responsive Design */
@media (min-width: 1400px) {
  .container {
    max-width: 1280px;
  }
}

@media (max-width: 992px) {
  .navbar-nav {
    text-align: center;
  }

  .nav-link {
    margin: 8px 0;
    padding: 8px;
  }

  .auth-section {
    padding: 80px 0 60px;
  }
}

@media (max-width: 768px) {
  .auth-card {
    padding: 1.5rem;
    max-width: 90%;
  }

  .section-title {
    font-size: 2rem;
  }

  .section-subtitle {
    font-size: 1.1rem;
  }

  .form-control {
    padding: 10px 12px;
  }

  .filter-btn {
    padding: 10px 20px;
    font-size: 0.9rem;
  }

  .social-btn {
    padding: 10px;
    font-size: 0.9rem;
  }
}

@media (max-width: 576px) {
  .auth-card {
    padding: 1rem;
    max-width: 95%;
  }

  .section-title {
    font-size: 1.8rem;
  }

  .section-subtitle {
    font-size: 1rem;
  }

  .toggle-btn {
    font-size: 0.9rem;
    padding: 0.5rem;
  }

  .form-control {
    padding: 8px 10px;
    font-size: 0.9rem;
  }

  .social-buttons {
    flex-direction: column;
    gap: 0.5rem;
  }

  .social-btn {
    padding: 8px;
    font-size: 0.85rem;
  }

  .alert {
    top: 60px;
    right: 10px;
    padding: 0.5rem 1rem;
    font-size: 0.85rem;
  }
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
