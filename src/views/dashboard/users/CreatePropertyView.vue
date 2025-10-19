<template>
  <div class="min-vh-100 bg-light-custom">
      
      
    <NavbarUserComponent title="Nova Propriedade" class="mb-7" />


    <main class="main-content p-4 mt-5">
      <section class="card shadow-sm mt-5">
        <div class="card-body">
          <h3 class="card-title h6 mb-4 text-dark">Detalhes da Propriedade</h3>
          <form @submit.prevent="submitProperty" ref="propertyForm">
            <div class="row g-4"> 
              <div class="col-12 col-md-6">
                <label for="title" class="form-label small fw-medium">Título</label>
                <input
                  id="title"
                  v-model="form.title"
                  type="text"
                  class="form-control"
                  placeholder="Ex: Moradia T3 Moderna"
                  required
                />
              </div>
              <div class="col-12 col-md-6">
                <label for="location" class="form-label small fw-medium">Localização</label>
                <select id="location" v-model="form.location" class="form-select" required>
                  <option value="" disabled>Selecione a localização</option>
                  <option v-for="loc in locations" :key="loc" :value="loc">{{ loc }}</option>
                </select>
              </div>
              <div class="col-12 col-md-4">
                <label for="price" class="form-label small fw-medium">Preço (AOA)</label>
                <input
                  id="price"
                  v-model.number="form.price"
                  type="number"
                  class="form-control"
                  placeholder="0"
                  min="0"
                  required
                />
              </div>
              <div class="col-12 col-md-4">
                <label for="bedrooms" class="form-label small fw-medium">Quartos</label>
                <select id="bedrooms" v-model.number="form.bedrooms" class="form-select" required>
                  <option value="" disabled>Selecione</option>
                  <option v-for="n in 10" :key="n" :value="n">{{ n }}</option>
                </select>
              </div>
              <div class="col-12 col-md-4">
                <label for="bathrooms" class="form-label small fw-medium">Banheiros</label>
                <select id="bathrooms" v-model.number="form.bathrooms" class="form-select" required>
                  <option value="" disabled>Selecione</option>
                  <option v-for="n in 10" :key="n" :value="n">{{ n }}</option>
                </select>
              </div>
              <div class="col-12 col-md-4">
                <label for="area" class="form-label small fw-medium">Área (m²)</label>
                <input
                  id="area"
                  v-model.number="form.area"
                  type="number"
                  class="form-control"
                  placeholder="0"
                  min="0"
                  required
                />
              </div>
              <div class="col-12 col-md-4">
                <label for="type" class="form-label small fw-medium">Tipologia</label>
                <select id="type" v-model="form.type" class="form-select" required>
                  <option value="" disabled>Selecione</option>
                  <option value="T1">T1</option>
                  <option value="T2">T2</option>
                  <option value="T3">T3</option>
                  <option value="T4">T4</option>
                  <option value="T5">T5</option>
                  <option value="Villa">Villa</option>
                  <option value="Apartamento">Apartamento</option>
                </select>
              </div>
              <div class="col-12 col-md-4">
                <label for="status" class="form-label small fw-medium">Status</label>
                <select id="status" v-model="form.status" class="form-select" required>
                  <option value="" disabled>Selecione</option>
                  <option value="Ativa">Ativa</option>
                  <option value="Pendente">Pendente</option>
                  <option value="Inativa">Inativa</option>
                </select>
              </div>

              <!-- Características -->
              <div class="col-12">
                <h4 class="h6 mt-4 mb-3 text-dark">Características</h4>
                <div class="row g-3">
                  <div class="col-6 col-md-3">
                    <div class="form-check">
                      <input id="garage" v-model="form.garage" type="checkbox" class="form-check-input" />
                      <label for="garage" class="form-check-label">Garagem</label>
                    </div>
                  </div>
                  <div class="col-6 col-md-3">
                    <div class="form-check">
                      <input id="piscina" v-model="form.piscina" type="checkbox" class="form-check-input" />
                      <label for="piscina" class="form-check-label">Piscina</label>
                    </div>
                  </div>
                  <div class="col-6 col-md-3">
                    <div class="form-check">
                      <input id="jardim" v-model="form.jardim" type="checkbox" class="form-check-input" />
                      <label for="jardim" class="form-check-label">Jardim</label>
                    </div>
                  </div>
                  <div class="col-6 col-md-3">
                    <div class="form-check">
                      <input id="arcondicionado" v-model="form.arcondicionado" type="checkbox" class="form-check-input" />
                      <label for="arcondicionado" class="form-check-label">Ar Condicionado</label>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Descrição -->
              <div class="col-12">
                <label for="description" class="form-label small fw-medium">Descrição</label>
                <textarea
                  id="description"
                  v-model="form.description"
                  class="form-control"
                  rows="5"
                  placeholder="Descreva a propriedade em detalhes"
                  required
                ></textarea>
              </div>

              <!-- Imagens -->
              <div class="col-12">
                <h4 class="h6 mt-4 mb-3 text-dark">Imagens</h4>
                <div class="mb-3">
                  <label for="images" class="form-label small fw-medium">Carregar Imagens (máx. 5)</label>
                  <input
                    id="images"
                    type="file"
                    class="form-control"
                    multiple
                    accept="image/*"
                    @change="handleImageUpload"
                  />
                  <small class="text-muted">Formatos suportados: JPG, PNG. Tamanho máximo: 5MB por imagem.</small>
                </div>
                <div v-if="form.images.length" class="row g-2">
                  <div v-for="(img, index) in form.images" :key="index" class="col-6 col-md-3">
                    <div class="position-relative">
                      <img :src="img.url" class="img-fluid rounded img-framed" alt="Pré-visualização" />
                      <button
                        type="button"
                        class="btn btn-danger btn-sm position-absolute top-0 end-0"
                        @click="removeImage(index)"
                      >
                        <i class="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Ações -->
              <div class="col-12 mt-4 d-flex gap-2 flex-wrap">
                <button
                  type="submit"
                  class="btn btn-primary"
                  :disabled="isSubmitting"
                >
                  <i v-if="isSubmitting" class="fas fa-spinner fa-spin me-2"></i>
                  {{ isSubmitting ? 'Publicando...' : 'Publicar Propriedade' }}
                </button>
                <button type="button" class="btn btn-outline-primary" @click="previewProperty">Pré-visualizar</button>
              </div>
            </div>
          </form>
        </div>
      </section>

      <!-- Modal de Pré-visualização -->
      <div v-if="showPreview" class="modal fade show d-block" tabindex="-1" style="background: rgba(0,0,0,0.5);">
        <div class="modal-dialog modal-xl">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Pré-visualização da Propriedade</h5>
              <button type="button" class="btn-close" @click="showPreview = false"></button>
            </div>
            <div class="modal-body">
              <div class="row g-4">
                <div class="col-12 col-md-6">
                  <h3 class="h5">{{ form.title || 'Sem título' }}</h3>
                  <p class="text-muted"><i class="fas fa-map-marker-alt me-2"></i>{{ form.location || 'Não especificado' }}</p>
                  <p class="fw-bold">{{ formatPrice(form.price) }}</p>
                  <span class="badge" :class="{
                    'bg-success': form.status === 'Ativa',
                    'bg-warning text-dark': form.status === 'Pendente',
                    'bg-secondary': form.status === 'Inativa'
                  }">{{ form.status || 'Não especificado' }}</span>
                </div>
                <div class="col-12 col-md-6">
                  <div v-if="form.images.length" class="carousel slide" id="propertyCarousel" data-bs-ride="carousel">
                    <div class="carousel-inner">
                      <div v-for="(img, index) in form.images" :key="index" class="carousel-item" :class="{ 'active': index === 0 }">
                        <img :src="img.url" class="img-fluid rounded img-framed" alt="Pré-visualização" />
                      </div>
                    </div>
                    <button class="carousel-control-prev" type="button" data-bs-target="#propertyCarousel" data-bs-slide="prev">
                      <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                      <span class="visually-hidden">Previous</span>
                    </button>
                    <button class="carousel-control-next" type="button" data-bs-target="#propertyCarousel" data-bs-slide="next">
                      <span class="carousel-control-next-icon" aria-hidden="true"></span>
                      <span class="visually-hidden">Next</span>
                    </button>
                  </div>
                  <div v-else class="text-muted text-center py-4">Nenhuma imagem carregada</div>
                </div>
                <div class="col-12">
                  <h4 class="h6 mt-3">Detalhes</h4>
                  <div class="row g-2">
                    <div class="col-6 col-md-3"><i class="fas fa-bed me-2"></i>{{ form.bedrooms || 0 }} Quartos</div>
                    <div class="col-6 col-md-3"><i class="fas fa-bath me-2"></i>{{ form.bathrooms || 0 }} Banheiros</div>
                    <div class="col-6 col-md-3"><i class="fas fa-ruler-combined me-2"></i>{{ form.area || 0 }} m²</div>
                    <div class="col-6 col-md-3"><i class="fas fa-home me-2"></i>{{ form.type || 'Não especificado' }}</div>
                    <div class="col-6 col-md-3"><i class="fas fa-car me-2"></i>Garagem: {{ form.garage ? 'Sim' : 'Não' }}</div>
                    <div class="col-6 col-md-3"><i class="fas fa-swimming-pool me-2"></i>Piscina: {{ form.piscina ? 'Sim' : 'Não' }}</div>
                    <div class="col-6 col-md-3"><i class="fas fa-tree me-2"></i>Jardim: {{ form.jardim ? 'Sim' : 'Não' }}</div>
                    <div class="col-6 col-md-3"><i class="fas fa-snowflake me-2"></i>Ar Condicionado: {{ form.arcondicionado ? 'Sim' : 'Não' }}</div>
                  </div>
                </div>
                <div class="col-12">
                  <h4 class="h6 mt-3">Descrição</h4>
                  <p>{{ form.description || 'Nenhuma descrição fornecida' }}</p>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-outline-secondary" @click="showPreview = false">Fechar</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Notificação -->
      <div v-if="notification.message" class="position-fixed top-0 end-0 m-3 alert alert-sm" :class="notification.type === 'success' ? 'alert-success' : 'alert-danger'">
        <i :class="`fas fa-${notification.type === 'success' ? 'check-circle' : 'exclamation-circle'} me-2`"></i>
        {{ notification.message }}
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import NavbarUserComponent from '@/components/NavbarUserComponent.vue';

interface PropertyForm {
  title: string;
  location: string;
  price: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  area: number | null;
  type: string;
  status: string;
  garage: boolean;
  piscina: boolean;
  jardim: boolean;
  arcondicionado: boolean;
  description: string;
  images: { file: File; url: string }[];
}

interface Notification {
  message: string;
  type: 'success' | 'danger';
}

const form = ref<PropertyForm>({
  title: '',
  location: '',
  price: null,
  bedrooms: null,
  bathrooms: null,
  area: null,
  type: '',
  status: '',
  garage: false,
  piscina: false,
  jardim: false,
  arcondicionado: false,
  description: '',
  images: [],
});

const locations = ref(['Luanda, Talatona', 'Luanda, Ilha do Cabo', 'Luanda, Ingombota', 'Benguela, Costa', 'Huambo, Centro']);
const notification = ref<Notification>({ message: '', type: 'success' });
const isSubmitting = ref(false);
const showPreview = ref(false);
const propertyForm = ref<HTMLFormElement | null>(null);

const formatPrice = (price: number | null) => {
  if (!price) return 'N/A';
  return new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA', maximumFractionDigits: 0 }).format(price);
};

const handleImageUpload = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && form.value.images.length + input.files.length <= 5) {
    Array.from(input.files).forEach(file => {
      if (file.size <= 5 * 1024 * 1024) { // Max 5MB
        const url = URL.createObjectURL(file);
        form.value.images.push({ file, url });
      } else {
        showNotification('Imagem excede o tamanho máximo de 5MB', 'danger');
      }
    });
  } else {
    showNotification('Limite de 5 imagens atingido', 'danger');
  }
};

const removeImage = (index: number) => {
  URL.revokeObjectURL(form.value.images[index].url);
  form.value.images.splice(index, 1);
};

const submitProperty = () => {
  if (!propertyForm.value?.checkValidity()) {
    propertyForm.value?.reportValidity();
    return;
  }
  isSubmitting.value = true;
  setTimeout(() => {
    isSubmitting.value = false;
    showNotification('Propriedade publicada com sucesso!', 'success');
    resetForm();
  }, 1500);
};

const previewProperty = () => {
  if (!propertyForm.value?.checkValidity()) {
    propertyForm.value?.reportValidity();
    return;
  }
  showPreview.value = true;
};

const cancel = () => {
  resetForm();
  showNotification('Criação cancelada', 'danger');
};

const resetForm = () => {
  form.value = {
    title: '',
    location: '',
    price: null,
    bedrooms: null,
    bathrooms: null,
    area: null,
    type: '',
    status: '',
    garage: false,
    piscina: false,
    jardim: false,
    arcondicionado: false,
    description: '',
    images: [],
  };
};

const showNotification = (message: string, type: 'success' | 'danger') => {
  notification.value = { message, type };
  setTimeout(() => {
    notification.value = { message: '', type: 'success' };
  }, 3000);
};
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

.bg-light-custom {
  background-color: var(--light-bg);
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: var(--text-dark);
}

.main-content {
  margin-left: 250px;
  transition: margin-left 0.3s ease;
}

.card {
  background: #ffffff;
  border: none;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.form-label {
  color: var(--primary-red);
  font-size: 0.85rem;
  font-weight: 500;
}

.form-control, .form-select {
  border: 1px solid var(--soft-red);
  border-radius: 8px;
  font-size: 0.9rem;
  padding: 0.5rem 1rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.form-control:focus, .form-select:focus {
  border-color: var(--primary-red);
  box-shadow: 0 0 0 3px var(--soft-red);
  outline: none;
}

.form-control::placeholder {
  color: var(--text-muted);
  opacity: 0.7;
}

.form-check-input {
  border-color: var(--soft-red);
}

.form-check-input:checked {
  background-color: var(--primary-red);
  border-color: var(--primary-red);
}

.form-check-label {
  font-size: 0.9rem;
}

.btn-primary {
  background-color: var(--primary-red);
  border-color: var(--primary-red);
  font-size: 0.9rem;
  padding: 0.5rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  transition: background-color 0.2s ease, transform 0.2s ease;
}

.btn-primary:hover {
  background-color: var(--secondary-red);
  border-color: var(--secondary-red);
  transform: translateY(-2px);
}

.btn-outline-primary, .btn-outline-secondary {
  font-size: 0.85rem;
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  border: 2px solid;
}

.btn-outline-primary {
  border-color: var(--primary-red);
  color: var(--primary-red);
}

.btn-outline-primary:hover {
  background-color: var(--primary-red);
  color: #ffffff;
}

.btn-outline-secondary {
  border-color: var(--text-muted);
  color: var(--text-dark);
}

.btn-outline-secondary:hover {
  background-color: var(--text-muted);
  color: #ffffff;
}

.btn-danger {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
}

.alert {
  z-index: 10000;
  font-size: 0.9rem;
  padding: 0.75rem 1.25rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  animation: fadeIn 0.3s ease-in-out;
}

.modal-content {
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.modal-header {
  border-bottom: none;
  padding: 1rem 1.5rem;
}

.modal-body {
  padding: 1.5rem;
}

.modal-footer {
  border-top: none;
  padding: 1rem 1.5rem;
}

.img-framed {
  width: 100%;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.carousel img {
  width: 100%;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Responsividade */
@media (max-width: 768px) {
  .main-content {
    margin-left: 0;
    padding: 1rem;
  }

  .card {
    border-radius: 10px;
  }

  .form-label {
    font-size: 0.8rem;
  }

  .form-control, .form-select {
    font-size: 0.85rem;
    padding: 0.45rem 0.9rem;
  }

  .form-check-input {
    width: 1.1rem;
    height: 1.1rem;
  }

  .form-check-label {
    font-size: 0.85rem;
  }

  .btn-primary, .btn-outline-primary, .btn-outline-secondary {
    font-size: 0.85rem;
    padding: 0.45rem 1rem;
  }

  .btn-sm {
    font-size: 0.8rem;
  }

  .modal-dialog {
    margin: 1rem;
    max-width: 95%;
  }

  .modal-body {
    padding: 1rem;
  }

  .carousel img {
    max-height: 200px;
  }

  .img-framed {
    height: 80px;
  }
}

@media (max-width: 576px) {
  .card-title {
    font-size: 1rem;
  }

  .form-control, .form-select {
    font-size: 0.8rem;
    padding: 0.4rem 0.8rem;
  }

  .form-label {
    font-size: 0.75rem;
  }

  .form-check-input {
    width: 1rem;
    height: 1rem;
  }

  .form-check-label {
    font-size: 0.8rem;
  }

  .btn-primary, .btn-outline-primary, .btn-outline-secondary {
    font-size: 0.8rem;
    padding: 0.4rem 0.8rem;
    width: 100%;
  }

  .btn-sm {
    font-size: 0.75rem;
    padding: 0.2rem 0.5rem;
  }

  .row.g-4 > .col-12,
  .row.g-4 > .col-md-4,
  .row.g-4 > .col-md-6,
  .row.g-3 > .col-6,
  .row.g-3 > .col-md-3,
  .row.g-2 > .col-6,
  .row.g-2 > .col-md-3 {
    flex: 0 0 100%;
    max-width: 100%;
  }

  .modal-dialog {
    margin: 0.5rem;
  }

  .modal-content {
    border-radius: 8px;
  }

  .modal-body {
    padding: 0.75rem;
  }

  .carousel img {
    max-height: 150px;
  }

  .img-framed {
    height: 60px;
  }

  .modal-title {
    font-size: 1rem;
  }

  .modal-body h3.h5 {
    font-size: 1.1rem;
  }

  .modal-body h4.h6 {
    font-size: 0.9rem;
  }

  .modal-body p, .modal-body .row div {
    font-size: 0.85rem;
  }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>