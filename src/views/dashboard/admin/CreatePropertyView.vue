<template>
  <div class="min-vh-100 bg-light-custom">
    <NavbarDashComponent title="Nova Propriedade" class="mb-7" />

    <main class="main-content p-4 mt-5">
      <section class="card shadow-sm mt-5">
        <div class="card-body p-5">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h3 class="card-title h5 mb-0 text-dark fw-bold">
              <i class="fas fa-home me-2 text-danger"></i>
              Nova Propriedade
            </h3>
            <div class="bg-light rounded-pill px-3 py-1 small text-muted">
              <i class="fas fa-star me-1"></i>
              {{ form.photos.length }}/5 Imagens
            </div>
          </div>
          
          <form @submit.prevent="submitProperty" ref="propertyForm">
            <div class="row g-4">
              <div class="col-12 col-md-6">
                <label for="name" class="form-label small fw-medium">Nome *</label>
                <input
                  id="name"
                  v-model="form.name"
                  type="text"
                  class="form-control"
                  placeholder="Ex: Moradia T3 Moderna"
                  required
                />
              </div>
              <div class="col-12 col-md-6">
                <label for="address" class="form-label small fw-medium">Endereço *</label>
                <input
                  id="address"
                  v-model="form.address"
                  type="text"
                  class="form-control"
                  placeholder="Ex: Rua Principal, 123"
                  required
                />
              </div>
              
              <div class="col-12 col-md-4">
                <label for="price" class="form-label small fw-medium">Preço (AOA) *</label>
                <div class="input-group">
                  <span class="input-group-text bg-white border-end-0">AOA</span>
                  <input
                    id="price"
                    v-model.number="form.price"
                    type="number"
                    class="form-control border-start-0"
                    placeholder="0"
                    min="0"
                    required
                  />
                </div>
              </div>
              <div class="col-12 col-md-4">
                <label for="bedrooms" class="form-label small fw-medium">Quartos *</label>
                <select id="bedrooms" v-model.number="form.bedrooms" class="form-select" required>
                  <option value="" disabled>Selecione</option>
                  <option v-for="n in 10" :key="n" :value="n">{{ n }}</option>
                </select>
              </div>
              <div class="col-12 col-md-4">
                <label for="bathrooms" class="form-label small fw-medium">Banheiros *</label>
                <select id="bathrooms" v-model.number="form.bathrooms" class="form-select" required>
                  <option value="" disabled>Selecione</option>
                  <option v-for="n in 10" :key="n" :value="n">{{ n }}</option>
                </select>
              </div>
              
              <div class="col-12 col-md-4">
                <label for="area" class="form-label small fw-medium">Área (m²) *</label>
                <div class="input-group">
                  <input
                    id="area"
                    v-model.number="form.area"
                    type="number"
                    class="form-control"
                    placeholder="0"
                    min="0"
                    required
                  />
                  <span class="input-group-text bg-white">m²</span>
                </div>
              </div>
              <div class="col-12 col-md-4">
                <label for="type" class="form-label small fw-medium">Tipo *</label>
                <select id="type" v-model="form.type" class="form-select" required>
                  <option value="" disabled>Selecione</option>
                  <option value="0">🏠 Casa</option>
                  <option value="1">🏢 Apartamento</option>
                  <option value="2">🏪 Comercial</option>
                </select>
              </div>
              <div class="col-12 col-md-4">
                <label for="category_id" class="form-label small fw-medium">Categoria *</label>
                <select id="category_id" v-model="form.category_id" class="form-select" required>
                  <option value="" disabled>Selecione</option>
                  <option value="1">👨‍👩‍👧‍👦 Residencial</option>
                  <option value="2">💼 Comercial</option>
                  <option value="3">🌾 Terrenos</option>
                </select>
              </div>
              
              <div class="col-12 col-md-4">
                <label for="year_built" class="form-label small fw-medium">Ano Construção</label>
                <input
                  id="year_built"
                  v-model.number="form.year_built"
                  type="number"
                  class="form-control"
                  placeholder="2023"
                  min="1900"
                  max="2025"
                />
              </div>
              <div class="col-12 col-md-4">
                <label for="condition" class="form-label small fw-medium">Condição</label>
                <select id="condition" v-model="form.condition" class="form-select">
                  <option value="">Selecione</option>
                  <option value="0">✨ Novo</option>
                  <option value="1">✅ Usado</option>
                  <option value="2">🔧 Reformado</option>
                </select>
              </div>
              <div class="col-12 col-md-4">
                <label for="availability" class="form-label small fw-medium">Disponibilidade</label>
                <select id="availability" v-model="form.availability" class="form-select">
                  <option value="" disabled>Selecione</option>
                  <option value="0">⚡ Imediata</option>
                  <option value="1">⏳ 15 dias</option>
                  <option value="2">📅 30 dias</option>
                </select>
              </div>

              <div class="col-12">
                <h4 class="h6 mt-4 mb-4 text-dark fw-bold border-bottom pb-2">
                  <i class="fas fa-list me-2 text-danger"></i>
                  Características
                </h4>
                <div class="row g-3">
                  <div class="col-6 col-md-3">
                    <div class="form-check feature-card p-3 rounded-3 border">
                      <input id="garages" v-model="form.garages" type="checkbox" class="form-check-input" />
                      <label for="garages" class="form-check-label d-flex align-items-center">
                        <i class="fas fa-car me-2 text-danger"></i>
                        Garagem
                      </label>
                    </div>
                  </div>
                  <div class="col-6 col-md-3">
                    <div class="form-check feature-card p-3 rounded-3 border">
                      <input id="swimming_pool" v-model="form.swimming_pool" type="checkbox" class="form-check-input" />
                      <label for="swimming_pool" class="form-check-label d-flex align-items-center">
                        <i class="fas fa-swimming-pool me-2 text-danger"></i>
                        Piscina
                      </label>
                    </div>
                  </div>
                  <div class="col-6 col-md-3">
                    <div class="form-check feature-card p-3 rounded-3 border">
                      <input id="garden" v-model="form.garden" type="checkbox" class="form-check-input" />
                      <label for="garden" class="form-check-label d-flex align-items-center">
                        <i class="fas fa-seedling me-2 text-danger"></i>
                        Jardim
                      </label>
                    </div>
                  </div>
                  <div class="col-6 col-md-3">
                    <div class="form-check feature-card p-3 rounded-3 border">
                      <input id="air_conditioning" v-model="form.air_conditioning" type="checkbox" class="form-check-input" />
                      <label for="air_conditioning" class="form-check-label d-flex align-items-center">
                        <i class="fas fa-fan me-2 text-danger"></i>
                        Ar Condicionado
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div class="col-12">
                <label for="description" class="form-label small fw-medium">Descrição *</label>
                <textarea
                  id="description"
                  v-model="form.description"
                  class="form-control"
                  rows="5"
                  placeholder="Descreva a propriedade em detalhes..."
                  required
                ></textarea>
              </div>

              <div class="col-12">
                <h4 class="h6 mt-4 mb-4 text-dark fw-bold border-bottom pb-2">
                  <i class="fas fa-images me-2 text-danger"></i>
                  Imagens (máx. 5)
                </h4>
                <div class="dropzone border-dashed rounded-3 p-4 text-center mb-3" 
                     @dragover.prevent @drop="handleImageUploadDrop" 
                     @dragenter="onDragEnter" @dragleave="onDragLeave">
                  <i class="fas fa-cloud-upload-alt fa-3x text-muted mb-3"></i>
                  <br><input
                    id="photos"
                    type="file"
                    class="form-control d-none"
                    multiple
                    accept="image/*"
                    @change="handleImageUpload"
                    ref="fileInput" 
                  />
                  <label for="photos" class="btn btn-outline-primary mb-2">
                    <i class="fas fa-plus me-2"></i>Selecionar Imagens
                  </label>
                  <p class="text-muted small">JPG, PNG • Máx: 5MB por imagem</p>
                  <p v-if="fileInput?.files?.length" class="text-success fw-bold">
                    {{ fileInput?.files?.length }} selecionada(s)
                  </p>
                </div>
                
                <div v-if="form.photos.length" class="row g-2">
                  <div v-for="(img, index) in form.photos" :key="index" class="col-6 col-md-3">
                    <div class="position-relative">
                      <img :src="img.url" class="img-fluid rounded img-framed h-100" style="height: 120px;" alt="Pré-visualização" />
                      <button
                        type="button"
                        class="btn btn-danger btn-sm position-absolute top-0 end-0 rounded-circle"
                        style="width: 24px; height: 24px;"
                        @click="removeImage(index)"
                      >
                        <i class="fas fa-times fa-xs"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div class="col-12 mt-5 pt-4 border-top">
                <div class="d-flex gap-3 justify-content-end">
                  <button
                    type="button"
                    class="btn btn-outline-secondary px-4"
                    @click="previewProperty"
                  >
                    <i class="fas fa-eye me-2"></i>
                    Pré-visualizar
                  </button>
                  <button
                    type="submit"
                    class="btn btn-danger px-4"
                    :disabled="isSubmitting"
                  >
                    <i v-show="isSubmitting" class="fas fa-spinner fa-spin me-2"></i>
                    <i v-show="!isSubmitting" class="fas fa-rocket me-2"></i>
                    {{ isSubmitting ? 'Publicando...' : 'Publicar Propriedade' }}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>

      <div v-if="showPreview" class="modal fade show d-block" tabindex="-1" style="background: rgba(0,0,0,0.5);">
        <div class="modal-dialog modal-xl">
          <div class="modal-content rounded-4">

            <div class="modal-header bg-danger text-white rounded-top-4">
              <h5 class="modal-title mb-0">
                <i class="fas fa-eye me-2"></i>
                Pré-visualização
              </h5>
              <button type="button" class="btn-close btn-close-white" @click="showPreview = false"></button>
            </div>
            <div class="modal-body p-4">
              <div class="row g-4">
                <div class="col-12 col-md-6">
                  <h2 class="h4 fw-bold text-dark mb-2">{{ form.name || 'Sem título' }}</h2>
                  <p class="text-muted mb-3">
                    <i class="fas fa-map-marker-alt me-2 text-danger"></i>
                    {{ form.address || 'Não especificado' }}
                  </p>
                  <h3 class="h3 fw-bold text-danger mb-3">{{ formatPrice(form.price) }}</h3>
                  
                  <div class="row g-2 mb-3">
                    <div class="col-6"><span class="badge bg-danger">🏠 {{ getTypeLabel(form.type) }}</span></div>
                    <div class="col-6"><span class="badge bg-success">{{ form.bedrooms || 0 }}Q / {{ form.bathrooms || 0 }}B</span></div>
                  </div>
                </div>
                
                <div class="col-12 col-md-6">
                  <div v-if="form.photos.length" class="carousel slide shadow-sm rounded-3 overflow-hidden" id="propertyCarousel" data-bs-ride="carousel">
                    <div class="carousel-inner">
                      <div v-for="(img, index) in form.photos" :key="index" class="carousel-item" :class="{ 'active': index === 0 }">
                        <img :src="img.url" class="d-block w-100" style="height: 300px; object-fit: cover;" alt="Propriedade" />
                      </div>
                    </div>
                    <button class="carousel-control-prev" type="button" data-bs-target="#propertyCarousel" data-bs-slide="prev">
                      <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    </button>
                    <button class="carousel-control-next" type="button" data-bs-target="#propertyCarousel" data-bs-slide="next">
                      <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    </button>
                  </div>
                  <div v-else class="bg-light rounded-3 text-center py-5">
                    <i class="fas fa-image fa-3x text-muted mb-2"></i>
                    <p class="text-muted">Nenhuma imagem carregada</p>
                  </div>
                </div>
                
                <div class="col-12">
                  <h4 class="h5 mt-4 mb-3 text-dark">
                    <i class="fas fa-info-circle me-2 text-danger"></i>
                    Detalhes
                  </h4>
                  <div class="row g-3">
                    <div class="col-md-3"><i class="fas fa-bed me-2 text-danger"></i>{{ form.bedrooms || 0 }} Quartos</div>
                    <div class="col-md-3"><i class="fas fa-bath me-2 text-danger"></i>{{ form.bathrooms || 0 }} Banheiros</div>
                    <div class="col-md-3"><i class="fas fa-ruler-combined me-2 text-danger"></i>{{ form.area || 0 }} m²</div>
                    <div class="col-md-3"><i class="fas fa-calendar me-2 text-danger"></i>{{ form.year_built || 'N/D' }}</div>
                    <div class="col-md-3"><i class="fas fa-car me-2 text-danger"></i>{{ form.garages ? 'Garagem' : '—' }}</div>
                    <div class="col-md-3"><i class="fas fa-swimming-pool me-2 text-danger"></i>{{ form.swimming_pool ? 'Piscina' : '—' }}</div>
                    <div class="col-md-3"><i class="fas fa-seedling me-2 text-danger"></i>{{ form.garden ? 'Jardim' : '—' }}</div>
                    <div class="col-md-3"><i class="fas fa-fan me-2 text-danger"></i>{{ form.air_conditioning ? 'Ar' : '—' }}</div>
                  </div>
                </div>
                
                <div class="col-12">
                  <h4 class="h5 mt-4 mb-3 text-dark">
                    <i class="fas fa-align-left me-2 text-danger"></i>
                    Descrição
                  </h4>
                  <div class="bg-light p-4 rounded-3">
                    <p class="mb-0">{{ form.description || 'Nenhuma descrição fornecida' }}</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer border-0 bg-light rounded-bottom-4">
              <button type="button" class="btn btn-outline-secondary" @click="showPreview = false">
                <i class="fas fa-times me-2"></i>Fechar
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="notification.message" class="position-fixed top-0 end-0 m-3 alert alert-sm z-1050 shadow-lg" :class="notification.type === 'success' ? 'alert-success border-success' : 'alert-danger border-danger'">
        <i :class="`fas fa-${notification.type === 'success' ? 'check-circle' : 'exclamation-circle'} me-2`"></i>
        {{ notification.message }}
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import NavbarDashComponent from '@/components/NavbarDashComponent.vue';
import Cookies from 'js-cookie';


const route = useRoute();

const router = useRouter();

const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1';

interface User {
    id?: any;
    name: string;
    email: string;
    phone: string;
    about: string;
    createdAt?: string;
    photo?: string;
}


let userNow: User;
if (typeof route.params.user === 'string') {
  userNow = { id: route.params.user, name: '', phone: '', email: '', about: '', createdAt: '', photo: '' };
} else if (Array.isArray(route.params.user)) {
  userNow = { id: route.params.user[0], name: '', phone: '', email: '', about: '', createdAt: '', photo: '' };
} else {
  userNow = route.params.user || { id: '', name: '', phone: '', email: '', about: '', createdAt: '', photo: '' };
}



interface PropertyForm {
  name: string;
  description: string;
  photos: { file: File; url: string }[];
  price: number | null;
  address: string;
  type: string;
  bedrooms: number | string;
  bathrooms: number | string;
  garages: boolean;
  area: number | string;
  year_built: number | string;
  latitude?: number | string | null;
  longitude?: number | null;
  category_id: string;
  user_id: string;
  agent_id?: string;
  featured: boolean | string;
  condition: string;
  availability: string;
  swimming_pool: boolean | string;
  garden: boolean | string;
  air_conditioning: boolean | string;
}

interface Notification {
  message: string;
  type: 'success' | 'danger';
}

const form = ref<PropertyForm>({
  name: '',
  description: '',
  photos: [],
  price: null,
  address: '',
  type: '',
  bedrooms: '',
  bathrooms: '',
  garages: false,
  area: '',
  year_built: '',
  latitude: null,
  longitude: null,
  category_id: '',
  user_id: '',
  agent_id: '',
  featured: '',
  condition: '',
  availability: '',
  swimming_pool: '',
  garden: '',
  air_conditioning: '',
});

const notification = ref<Notification>({ message: '', type: 'success' });
const isSubmitting = ref(false);
const showPreview = ref(false);
const propertyForm = ref<HTMLFormElement | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);
const dragActive = ref(false);

const API_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.cirimoveis.com/api/v1';

const formatPrice = (price: number | null) => {
  if (!price) return 'AOA 0';
  return new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA', maximumFractionDigits: 0 }).format(price);
};

const getTypeLabel = (type: string) => {
  return type === '0' ? 'Casa' : type === '1' ? 'Apartamento' : 'Comercial';
};

const handleImageUpload = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && form.value.photos.length + input.files.length <= 5) {
    Array.from(input.files).forEach(file => {
      if (file.size <= 5 * 1024 * 1024) {
        const url = URL.createObjectURL(file);
        form.value.photos.push({ file, url });
      }
    });
  } else {
    showNotification('Limite de 5 imagens ou tamanho máximo excedido', 'danger');
  }
  input.value = '';
};

const handleImageUploadDrop = (event: DragEvent) => {
  event.preventDefault();
  dragActive.value = false;
  const files = event.dataTransfer?.files;
  if (files && form.value.photos.length + files.length <= 5) {
    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024) {
        const url = URL.createObjectURL(file);
        form.value.photos.push({ file, url });
      }
    });
  }
};

const onDragEnter = (event: DragEvent) => {
  event.preventDefault();
  dragActive.value = true;
};

const onDragLeave = (event: DragEvent) => {
  event.preventDefault();
  dragActive.value = false;
};

const removeImage = (index: number) => {
  if (form.value.photos[index]) {
    URL.revokeObjectURL(form.value.photos[index].url);
    form.value.photos.splice(index, 1);
  }
};

const submitProperty = async () => {
  if (!propertyForm.value?.checkValidity()) {
    propertyForm.value?.reportValidity();
    return;
  }

  if (form.value.photos.length === 0) {
    showNotification('Adicione pelo menos uma foto', 'danger');
    return;
  }

  isSubmitting.value = true;

  const formData = new FormData();
  formData.append('name', form.value.name);
  formData.append('description', form.value.description);
  formData.append('price', form.value.price!.toString());
  formData.append('address', form.value.address);
  formData.append('type', form.value.type);
  formData.append('bedrooms', form.value.bedrooms!.toString());
  formData.append('bathrooms', form.value.bathrooms!.toString());
  formData.append('area', form.value.area!.toString());
  formData.append('category_id', form.value.category_id);
  formData.append('agent_id', userNow.id);
  formData.append('status', '1');

  if (form.value.year_built) formData.append('year_built', form.value.year_built.toString());
  if (form.value.condition) formData.append('condition', form.value.condition);
  if (form.value.availability) formData.append('availability', form.value.availability);
  if (form.value.garages) formData.append('garages', form.value.garages ? '1' : '0');
  if (form.value.swimming_pool) formData.append('swimming_pool', form.value.swimming_pool ? '1' : '0');
  if (form.value.garden) formData.append('garden', form.value.garden ? '1' : '0');
  if (form.value.air_conditioning) formData.append('air_conditioning', form.value.air_conditioning ? '1' : '0');
  if (form.value.featured) formData.append('featured', form.value.featured ? '1' : '0');

  form.value.photos.forEach((img, index) => {
    formData.append(`photos[${index}]`, img.file);
  });

  try {
    const token = Cookies.get('token');
    const userCookie = Cookies.get('user');
    if (!token || !userCookie) throw new Error('Autenticação inválida');

    const user = JSON.parse(userCookie);
    form.value.user_id = user.id;

    const response = await fetch(`${API_URL}/product/create`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    const data = await response.json();

    // console.log(data);
    if (data.product) { 
      showNotification('Propriedade cadastrada com sucesso!', 'success');
      resetForm();
      router.push({ name: 'app.dash.properties' });
    } else {
      throw new Error(data.message || 'Erro ao cadastrar propriedade');
    }


    if (!response.ok) throw new Error(data.message || 'Erro ao cadastrar');

  } catch (error: any) {
    showNotification(error.message || 'Erro ao cadastrar propriedade', 'danger');
  } finally {
    isSubmitting.value = false;
  }
};   

const previewProperty = () => {
  if (!propertyForm.value?.checkValidity()) {
    propertyForm.value?.reportValidity();
    return;
  }
  showPreview.value = true;
};

const resetForm = () => {
  form.value = {
    name: '',
    description: '',
    photos: [],
    price: null,
    address: '',
    type: '',
    bedrooms: '',
    bathrooms: '',
    garages: false,
    area: '',
    year_built: '',
    latitude: null,
    longitude: null,
    category_id: '',
    user_id: '',
    agent_id: '',
    featured: false,
    condition: '',
    availability: '',
    swimming_pool: false,
    garden: false,
    air_conditioning: false,
  };
  if (propertyForm.value) propertyForm.value.reset();
  showPreview.value = false;
};

const showNotification = (message: string, type: 'success' | 'danger') => {
  notification.value = { message, type };
  setTimeout(() => {
    notification.value = { message: '', type: 'success' };
  }, 4000);
};

watch(() => form.value.photos, (newPhotos) => {
  newPhotos.forEach(img => {
    if (!img.url.startsWith('blob:')) {
      img.url = URL.createObjectURL(img.file);
    }
  });
}, { deep: true });

onMounted(() => {
  const token = Cookies.get('token');
  const userCookie = Cookies.get('user');
  if (!token || !userCookie) {
    router.push({ name: 'auth.login' });
    return;
  }
  
  const user = JSON.parse(userCookie);
  form.value.user_id = user.id;
});
</script>

<style scoped>
:root {
  --primary-red: #e63946;
  --soft-red: rgba(230, 57, 70, 0.1);
  --secondary-red: #c92c39;
  --light-bg: #f8fafc;
  --text-dark: #1a1a1a;
  --text-muted: #6b7280;
}

.bg-light-custom { background-color: var(--light-bg); }
.main-content { margin-left: 250px; transition: margin-left 0.3s ease; }

.card { 
  background: #ffffff; 
  border: none; 
  border-radius: 16px; 
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08); 
  transition: all 0.3s ease; 
  overflow: hidden;
}
.card:hover { transform: translateY(-2px); box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12); }

.form-label { 
  color: var(--primary-red); 
  font-size: 0.85rem; 
  font-weight: 600; 
  margin-bottom: 0.5rem;
}
.form-control, .form-select { 
  border: 2px solid var(--soft-red); 
  border-radius: 10px; 
  font-size: 0.95rem; 
  padding: 0.75rem 1rem; 
  transition: all 0.3s ease; 
  background: #fafbfc;
}
.form-control:focus, .form-select:focus { 
  border-color: var(--primary-red); 
  box-shadow: 0 0 0 4px rgba(230, 57, 70, 0.15); 
  background: #fff;
  transform: translateY(-1px);
}

.form-check-input:checked { 
  background-color: var(--primary-red); 
  border-color: var(--primary-red); 
}
.form-check-label { font-size: 0.95rem; font-weight: 500; }

.feature-card { 
  background: #fafbfc; 
  border: 2px solid var(--soft-red) !important; 
  transition: all 0.3s ease; 
  cursor: pointer;
}
.feature-card:hover { border-color: var(--primary-red) !important; background: #fff; }
.feature-card input:checked + label { color: var(--primary-red); font-weight: 600; }

.dropzone {
  border: 3px dashed var(--soft-red);
  background: linear-gradient(135deg, #fafbfc 0%, #f0f4f8 100%);
  transition: all 0.3s ease;
}
.dropzone.drag-active { 
  border-color: var(--primary-red); 
  background: linear-gradient(135deg, rgba(230,57,70,0.05) 0%, rgba(230,57,70,0.02) 100%);
  transform: scale(1.02);
}

.btn-primary { 
  background: linear-gradient(135deg, var(--primary-red), var(--secondary-red)); 
  border: none; 
  font-size: 0.95rem; 
  padding: 0.75rem 2rem; 
  border-radius: 10px; 
  font-weight: 600; 
  box-shadow: 0 4px 15px rgba(230, 57, 70, 0.3);
  transition: all 0.3s ease;
}
.btn-primary:hover { 
  transform: translateY(-2px); 
  box-shadow: 0 6px 20px rgba(230, 57, 70, 0.4);
}
.btn-outline-primary { 
  border: 2px solid var(--primary-red); 
  color: var(--primary-red); 
  padding: 0.75rem 1.5rem; 
  border-radius: 10px; 
  font-weight: 500;
}
.btn-outline-primary:hover { 
  background: var(--primary-red); 
  transform: translateY(-1px);
}

.img-framed { 
  border-radius: 10px; 
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); 
  transition: transform 0.3s ease;
}
.img-framed:hover { transform: scale(1.02); }

.alert { 
  z-index: 1050; 
  font-size: 0.9rem; 
  padding: 1rem 1.5rem; 
  border-radius: 10px; 
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15); 
  animation: slideInRight 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  border: none;
}

.modal-content { 
  border-radius: 16px; 
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2); 
  border: none;
}
.carousel-control-prev-icon, .carousel-control-next-icon {
  background: rgba(230, 57, 70, 0.8);
  border-radius: 50%;
  width: 40px;
  height: 40px;
}

.border-bottom { border-color: var(--soft-red) !important; }
.border-dashed { border-style: dashed !important; }
.border-success { border-left: 4px solid #198754 !important; }
.border-danger { border-left: 4px solid #dc3545 !important; }

@media (max-width: 768px) {
  .main-content { margin-left: 0; padding: 1rem; }
  .card-body { padding: 1.5rem !important; }
  .row.g-4 > * { flex: 0 0 100%; max-width: 100%; }
  .btn-primary, .btn-outline-primary { width: 100%; margin-bottom: 0.5rem; }
  .dropzone { padding: 2rem !important; }
  .modal-dialog { margin: 0.5rem; max-width: 98%; }
}

@media (max-width: 576px) {
  .d-flex.justify-content-between { flex-direction: column; gap: 1rem; align-items: stretch; }
  .feature-card { margin-bottom: 0.5rem; }
  h4.h6 { font-size: 1rem; }
}

@keyframes slideInRight {
  from { opacity: 0; transform: translateX(100%); }
  to { opacity: 1; transform: translateX(0); }
}
</style>