<template>
    <main class="main" id="top">
        <NavbarAccessedArtistComponent />
        <section id="artist-analytics" class="artist-analytics-section">
            <div class="container">
                <div class="row justify-content-center">
                    <div class="col-lg-10">
                        <h2 class="text-center mb-4 mt-6 animate-slide-up">Bem-vindo, {{ artist.name }}!</h2>
                        <p class="text-center mb-4 animate-fade-in">Explore suas métricas de músicas, visualizações, ganhos e muito mais.</p>
                        <div class="artist-card mb-4 animate-scale-in">
                            <div class="text-center mb-4">
                                <img :src="artist.photo || '/dist/logo-black.png'" alt="Foto do Artista" class="artist-photo" />
                            </div>
                            <div class="artist-details">
                                <p><strong>Nome:</strong> {{ artist.name }}</p>
                                <p><strong>Telefone:</strong> {{ artist.phone }}</p>
                                <p><strong>Email:</strong> {{ artist.email || 'Não informado' }}</p>
                                <p><strong>Estilo Musical:</strong> {{ artist.style }}</p>
                                <!-- <p><strong>Data de Parceria:</strong> </p> -->
                                <p><strong>Percentual:</strong> {{ artist.percentage }}%</p>
                                <p><strong>Descrição:</strong> {{ artist.about || 'Não informada' }}</p>
                            </div>
                        </div>
                        <div class="stats-card mb-4 animate-stagger">
                            <div class="row g-3 text-center">
                                <div class="col-md-3">
                                    <span class="stat-label">Total de Músicas</span>
                                    <span class="stat-value">{{ songHistory.length }}</span>
                                </div>
                                <div class="col-md-3">
                                    <span class="stat-label">Total Visualizações</span>
                                    <span class="stat-value animate-counter" ref="viewsCounter">{{ stats.totalViews.toLocaleString() }}</span>
                                </div>
                                <div class="col-md-3">
                                    <span class="stat-label">Lucro Bruto (AOA)</span>
                                    <span class="stat-value animate-counter" ref="grossProfitCounter">{{ formatCurrency(stats.totalGrossProfit, 'AOA') }}</span>
                                </div>
                                <div class="col-md-3">
                                    <span class="stat-label">Lucro Líquido (AOA)</span>
                                    <span class="stat-value animate-counter" ref="netProfitCounter">{{ formatCurrency(stats.totalNetProfit, 'AOA') }}</span>
                                </div>
                            </div>
                        </div>
                        <div class="charts-card mb-4 animate-stagger">
                            <div class="row g-3">
                                <div class="col-md-6">
                                    <h3 class="chart-title">Histórico de Pagamentos</h3>
                                    <canvas id="paymentsChart"></canvas>
                                </div>
                                <div class="col-md-6">
                                    <h3 class="chart-title">Visualizações por Música</h3>
                                    <canvas id="viewsChart"></canvas>
                                </div>
                                <div class="col-md-6">
                                    <h3 class="chart-title">Distribuição por Plataforma</h3>
                                    <canvas id="platformChart"></canvas>
                                </div>
                                <div class="col-md-6">
                                    <h3 class="chart-title">Tendência de Visualizações Mensais</h3>
                                    <canvas id="monthlyViewsChart"></canvas>
                                </div>
                                <div class="col-12">
                                    <h3 class="chart-title">Ganhos Mensais</h3>
                                    <canvas id="earningsChart"></canvas>
                                </div>
                            </div>
                        </div>
                        <div class="songs-card animate-stagger">
                            <h3 class="mb-3">Suas Músicas</h3>
                            <div class="table-responsive">
                                <table class="table table-dark table-hover">
                                    <thead>
                                        <tr>
                                            <th scope="col">Título</th>
                                            <th scope="col">Visualizações</th>
                                            <th scope="col">Plataformas</th>
                                            <th scope="col">Data de Publicação</th>
                                            <th scope="col">Ganhos (AOA)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="song in paginatedSongs" :key="song.id" class="animate-row">
                                            <td>{{ song.title }}</td>
                                            <td>{{ song.views.toLocaleString() }}</td>
                                            <td>{{ song.platforms.join(', ') }}</td>
                                            <td>{{ formatDate(song.publicationDate) }}</td>
                                            <td>{{ formatCurrency(song.earnings, 'AOA') }}</td>
                                        </tr>
                                        <tr v-if="paginatedSongs.length === 0">
                                            <td colspan="5" class="text-center">Nenhuma música encontrada.</td>
                                        </tr>
                                    </tbody>
                                </table>
                                <div v-if="hasMoreSongs" class="text-center my-3">
                                    <button class="btn btn-hero" @click="loadMoreSongs">Carregar Mais</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <FooterComponent />
    </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { toast } from 'vue3-toastify';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Chart from 'chart.js/auto';
import { useRoute, useRouter } from 'vue-router';
import NavbarAccessedArtistComponent from '@/components/NavbarAccessedUserComponent.vue';
import FooterComponent from '@/components/FooterComponent.vue';
import 'vue3-toastify/dist/index.css';


const router = useRouter();
const route = useRoute();


gsap.registerPlugin(ScrollTrigger);

interface Artist {
    id: number | string;
    name: string;
    phone: string;
    email?: string;
    style: string;
    partnershipDate: string;
    percentage?: number;
    about?: string;
    photo?: string;
    createdAt: string;
}

interface Song {
    id: number;
    title: string;
    views: number;
    platforms: string[];
    publicationDate: string;
    earnings: number;
}

interface Payment {
    id: number;
    date: string;
    amount: number;
    status: 'completed' | 'pending' | 'failed';
}

interface Stats {
    totalViews: number;
    totalGrossProfit: number;
    totalNetProfit: number;
}



let artist: Artist;
if (typeof route.params.user === 'string') {
  artist = { id: route.params.user, name: '', phone: '', email: '', style: '',  percentage: 0, about: '', createdAt: '', partnershipDate: '', photo: '' };
} else if (Array.isArray(route.params.user)) {
  artist = { id: route.params.user[0], name: '', phone: '', email: '', style: '',  percentage: 0, about: '', createdAt: '', partnershipDate: '', photo: '' };
} else {
  artist = route.params.user || { id: '', name: '', phone: '', email: '', style: '',  percentage: 0, about: '', createdAt: '', partnershipDate: '', photo: '' };
}

// const artist = ref<Artist>({
//     id: 1,
//     name: 'João Silva',
//     phone: '+244912345678',
//     email: 'joao.silva@email.com',
//     style: 'Semba',
//     partnershipDate: '2024-01-15',
//     percentage: 20,
//     about: 'Artista apaixonado por Semba, trazendo ritmos tradicionais de Angola.',
//     photo: '/images/joao-silva.jpg'
// });

const songHistory = ref<Song[]>([
    { id: 1, title: 'Dança do Sol', views: 100000, platforms: ['Spotify', 'Apple Music'], publicationDate: '2024-12-01', earnings: 50000 },
    { id: 2, title: 'Lua Cheia', views: 80000, platforms: ['YouTube', 'Spotify'], publicationDate: '2025-01-15', earnings: 40000 },
    { id: 3, title: 'Rua Viva', views: 50000, platforms: ['Deezer', 'Tidal'], publicationDate: '2025-02-10', earnings: 25000 },
    { id: 4, title: 'Céu Aberto', views: 120000, platforms: ['Spotify', 'YouTube'], publicationDate: '2025-03-01', earnings: 60000 },
    { id: 5, title: 'Vento Norte', views: 95000, platforms: ['Apple Music', 'Tidal'], publicationDate: '2025-04-20', earnings: 47500 }
]);

const paymentHistory = ref<Payment[]>([
    { id: 1, date: '2025-01-01', amount: 50000, status: 'completed' },
    { id: 2, date: '2025-02-01', amount: 75000, status: 'completed' },
    { id: 3, date: '2025-03-01', amount: 30000, status: 'pending' },
    { id: 4, date: '2025-04-01', amount: 45000, status: 'completed' },
    { id: 5, date: '2025-05-01', amount: 60000, status: 'completed' },
    { id: 6, date: '2025-06-01', amount: 20000, status: 'failed' },
    { id: 7, date: '2025-07-01', amount: 80000, status: 'completed' }
]);

const stats = ref<Stats>({ totalViews: 0, totalGrossProfit: 0, totalNetProfit: 0 });
const pageSize = ref(5);
const currentPageSongs = ref(1);
const viewsCounter = ref<HTMLElement | null>(null);
const grossProfitCounter = ref<HTMLElement | null>(null);
const netProfitCounter = ref<HTMLElement | null>(null);
let paymentChart: Chart | null = null;
let viewsChart: Chart | null = null;
let earningsChart: Chart | null = null;
let platformChart: Chart | null = null;
let monthlyViewsChart: Chart | null = null;

const paginatedSongs = computed(() => {
    const start = 0;
    const end = currentPageSongs.value * pageSize.value;
    return songHistory.value.slice(start, end);
});

const hasMoreSongs = computed(() => paginatedSongs.value.length < songHistory.value.length);

const updateStats = () => {
    stats.value = {
        totalViews: songHistory.value.reduce((sum, song) => sum + song.views, 0),
        totalGrossProfit: paymentHistory.value.reduce((sum, payment) => sum + payment.amount, 0),
        totalNetProfit: paymentHistory.value.reduce((sum, payment) => sum + payment.amount, 0),
        // totalNetProfit: paymentHistory.value.reduce((sum, payment) => sum + (payment.status === 'completed' ? payment.amount * (artist.value.percentage / 100) : 0), 0)
    };
};

const initCharts = () => {
    if (paymentChart) paymentChart.destroy();
    if (viewsChart) viewsChart.destroy();
    if (earningsChart) earningsChart.destroy();
    if (platformChart) platformChart.destroy();
    if (monthlyViewsChart) monthlyViewsChart.destroy();

    const paymentThreshold = 35000;
    const paymentLabels = paymentHistory.value.map(payment => formatDate(payment.date));
    const paymentData = paymentHistory.value.map(payment => payment.amount);
    const paymentColors = paymentHistory.value.map(payment => payment.status === 'failed' ? '#ff6b6b' : payment.status === 'pending' ? '#ffb300' : '#ffeb3b');

    paymentChart = new Chart(document.getElementById('paymentsChart') as HTMLCanvasElement, {
        type: 'line',
        data: {
            labels: paymentLabels,
            datasets: [{
                label: 'Pagamentos (AOA)',
                data: paymentData,
                borderColor: '#ffeb3b',
                backgroundColor: 'rgba(255, 235, 59, 0.3)',
                fill: true,
                tension: 0.4,
                pointBackgroundColor: paymentColors,
                pointRadius: 6,
                pointHoverRadius: 8
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: true, title: { display: true, text: 'Valor (AOA)', color: '#e0e0e0' }, ticks: { color: '#e0e0e0' } },
                x: { title: { display: true, text: 'Mês', color: '#e0e0e0' }, ticks: { color: '#e0e0e0', maxRotation: 45 } }
            },
            plugins: { legend: { labels: { color: '#e0e0e0' } }, tooltip: { backgroundColor: '#2a2a2a', titleColor: '#ffeb3b', bodyColor: '#e0e0e0' } },
            animation: { duration: 1500, easing: 'easeOutQuart' }
        }
    });

    const viewsLabels = songHistory.value.map(song => song.title);
    const viewsData = songHistory.value.map(song => song.views);

    viewsChart = new Chart(document.getElementById('viewsChart') as HTMLCanvasElement, {
        type: 'bar',
        data: {
            labels: viewsLabels,
            datasets: [{
                label: 'Visualizações',
                data: viewsData,
                backgroundColor: ['#ffeb3b', '#fbc02d', '#ffca28', '#ffb300', '#ffa000'],
                borderColor: '#1e1e1e',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: true, title: { display: true, text: 'Visualizações', color: '#e0e0e0' }, ticks: { color: '#e0e0e0' } },
                x: { title: { display: true, text: 'Música', color: '#e0e0e0' }, ticks: { color: '#e0e0e0', maxRotation: 45 } }
            },
            plugins: { legend: { labels: { color: '#e0e0e0' } }, tooltip: { backgroundColor: '#2a2a2a', titleColor: '#ffeb3b', bodyColor: '#e0e0e0' } },
            animation: { duration: 1500, easing: 'easeOutQuart' }
        }
    });

    const platformCounts = songHistory.value.reduce((acc, song) => {
        song.platforms.forEach(platform => { acc[platform] = (acc[platform] || 0) + 1; });
        return acc;
    }, {} as Record<string, number>);

    platformChart = new Chart(document.getElementById('platformChart') as HTMLCanvasElement, {
        type: 'pie',
        data: {
            labels: Object.keys(platformCounts),
            datasets: [{
                label: 'Distribuição por Plataforma',
                data: Object.values(platformCounts),
                backgroundColor: ['#ffeb3b', '#fbc02d', '#ffca28', '#ffb300', '#ffa000'],
                borderColor: '#1e1e1e',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'bottom', labels: { color: '#e0e0e0' } },
                tooltip: { backgroundColor: '#2a2a2a', titleColor: '#ffeb3b', bodyColor: '#e0e0e0' }
            },
            animation: { duration: 1500, easing: 'easeOutQuart' }
        }
    });

    const monthlyViews = songHistory.value.reduce((acc, song) => {
        const month = song.publicationDate.slice(0, 7);
        acc[month] = (acc[month] || 0) + song.views;
        return acc;
    }, {} as Record<string, number>);

    monthlyViewsChart = new Chart(document.getElementById('monthlyViewsChart') as HTMLCanvasElement, {
        type: 'line',
        data: {
            labels: Object.keys(monthlyViews).sort(),
            datasets: [{
                label: 'Visualizações Mensais',
                data: Object.values(monthlyViews),
                borderColor: '#ffca28',
                backgroundColor: 'rgba(255, 202, 40, 0.3)',
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#ffca28',
                pointRadius: 6,
                pointHoverRadius: 8
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: true, title: { display: true, text: 'Visualizações', color: '#e0e0e0' }, ticks: { color: '#e0e0e0' } },
                x: { title: { display: true, text: 'Mês', color: '#e0e0e0' }, ticks: { color: '#e0e0e0', maxRotation: 45 } }
            },
            plugins: { legend: { labels: { color: '#e0e0e0' } }, tooltip: { backgroundColor: '#2a2a2a', titleColor: '#ffeb3b', bodyColor: '#e0e0e0' } },
            animation: { duration: 1500, easing: 'easeOutQuart' }
        }
    });

    const earningsData = paymentHistory.value.map(payment => payment.status === 'completed' ? payment.amount * (200 / 100) : 0);

    earningsChart = new Chart(document.getElementById('earningsChart') as HTMLCanvasElement, {
        type: 'doughnut',
        data: {
            labels: paymentLabels,
            datasets: [{
                label: 'Lucro Líquido (AOA)',
                data: earningsData,
                backgroundColor: paymentColors,
                borderColor: '#1e1e1e',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'bottom', labels: { color: '#e0e0e0' } },
                tooltip: { backgroundColor: '#2a2a2a', titleColor: '#ffeb3b', bodyColor: '#e0e0e0' }
            },
            animation: { duration: 1500, easing: 'easeOutQuart' }
        }
    });
};

const formatCurrency = (value: number, currency: string) => {
    return new Intl.NumberFormat('pt-AO', {
        style: 'currency',
        currency: currency || 'AOA',
        minimumFractionDigits: 2
    }).format(value);
};

const formatDate = (date: string) => {
    return new Intl.DateTimeFormat('pt-AO', { dateStyle: 'medium' }).format(new Date(date));
};

const loadMoreSongs = () => {
    if (hasMoreSongs.value) {
        currentPageSongs.value++;
        gsap.from('.animate-row', { opacity: 0, y: 20, duration: 0.5, stagger: 0.1 });
    }
};

const animateStats = () => {
    if (viewsCounter.value) {
        const target = stats.value.totalViews;
        gsap.to(viewsCounter.value, {
            duration: 2,
            innerHTML: target,
            roundProps: 'innerHTML',
            onUpdate: () => {
                if (viewsCounter.value) {
                    viewsCounter.value.innerHTML = Math.round(Number(viewsCounter.value.innerHTML)).toLocaleString();
                }
            },
            ease: 'power2.out'
        });
    }
    if (grossProfitCounter.value) {
        const target = stats.value.totalGrossProfit;
        gsap.to(grossProfitCounter.value, {
            duration: 2,
            innerHTML: target,
            roundProps: 'innerHTML',
            onUpdate: () => {
                if (grossProfitCounter.value) {
                    grossProfitCounter.value.innerHTML = formatCurrency(Math.round(Number(grossProfitCounter.value.innerHTML)), 'AOA');
                }
            },
            ease: 'power2.out'
        });
    }
    if (netProfitCounter.value) {
        const target = stats.value.totalNetProfit;
        gsap.to(netProfitCounter.value, {
            duration: 2,
            innerHTML: target,
            roundProps: 'innerHTML',
            onUpdate: () => {
                if (netProfitCounter.value) {
                    netProfitCounter.value.innerHTML = formatCurrency(Math.round(Number(netProfitCounter.value.innerHTML)), 'AOA');
                }
            },
            ease: 'power2.out'
        });
    }
};

onMounted(() => {
    updateStats();
    initCharts();
    animateStats();
    gsap.from('.animate-slide-up', { opacity: 0, y: 50, duration: 1, ease: 'power3.out' });
    gsap.from('.animate-fade-in', { opacity: 0, duration: 1, delay: 0.2, ease: 'power3.out' });
    gsap.from('.animate-scale-in', { opacity: 0, scale: 0.95, duration: 1, delay: 0.4, ease: 'back.out(1.7)' });
    gsap.from('.animate-stagger', {
        opacity: 0,
        y: 20,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.stats-card', start: 'top 80%' }
    });
    gsap.from('.charts-card canvas', {
        opacity: 0,
        scale: 0.9,
        duration: 1,
        stagger: 0.3,
        ease: 'elastic.out(1, 0.5)',
        scrollTrigger: { trigger: '.charts-card', start: 'top 80%' }
    });
});

onUnmounted(() => {
    if (paymentChart) paymentChart.destroy();
    if (viewsChart) viewsChart.destroy();
    if (earningsChart) earningsChart.destroy();
    if (platformChart) platformChart.destroy();
    if (monthlyViewsChart) monthlyViewsChart.destroy();
});
</script>

<style scoped>
.main {
    font-family: 'Inter', sans-serif;
    background: linear-gradient(135deg, #1a1a1a, #000);
    min-height: 100vh;
    color: #fff;
}

.artist-analytics-section {
    padding: 80px 0;
    background: linear-gradient(135deg, #1a1a1a, #000);
}

.artist-analytics-section h2 {
    color: #ffeb3b;
    font-size: 2.8rem;
    font-weight: 800;
    letter-spacing: -0.02em;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.artist-analytics-section p {
    font-size: 1.2rem;
    color: #ccc;
}

.artist-card,
.stats-card,
.charts-card,
.songs-card {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 235, 59, 0.2);
    border-radius: 20px;
    padding: 24px;
    backdrop-filter: blur(12px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.artist-card:hover,
.stats-card:hover,
.charts-card:hover,
.songs-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(255, 235, 59, 0.2);
}

.artist-photo {
    width: 200px;
    height: 200px;
    object-fit: cover;
    border-radius: 50%;
    border: 4px solid #ffeb3b;
    margin-bottom: 24px;
    transition: transform 0.4s ease, box-shadow 0.4s ease;
}

.artist-photo:hover {
    transform: scale(1.08);
    box-shadow: 0 0 20px rgba(255, 235, 59, 0.4);
}

.artist-details p {
    color: #e0e0e0;
    font-size: 1.1rem;
    margin-bottom: 12px;
    padding: 10px 0;
    border-left: 3px solid #ffeb3b;
    padding-left: 12px;
    transition: background 0.3s ease;
}

.artist-details p:hover {
    background: rgba(255, 235, 59, 0.1);
}

.stat-label {
    display: block;
    color: #ffeb3b;
    font-weight: 600;
    font-size: 1rem;
    margin-bottom: 8px;
}

.stat-value {
    color: #fff;
    font-size: 1.6rem;
    font-weight: 700;
}

.chart-title {
    color: #ffeb3b;
    font-size: 1.3rem;
    font-weight: 600;
    margin-bottom: 20px;
    text-align: center;
    text-transform: uppercase;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.btn-hero {
    background: #ffeb3b;
    color: #000;
    font-weight: 600;
    padding: 12px 28px;
    border-radius: 14px;
    border: none;
    font-size: 1rem;
    transition: all 0.3s ease;
}

.btn-hero:hover {
    background: #fbc02d;
    transform: translateY(-3px);
    box-shadow: 0 6px 15px rgba(255, 235, 59, 0.4);
}

.table-responsive {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
}

.table-dark {
    background: transparent;
    color: #ddd;
    min-width: 700px;
}

.table-dark th {
    color: #ffeb3b;
    font-weight: 600;
    font-size: 0.9rem;
    border-bottom: 2px solid rgba(255, 235, 59, 0.3);
    padding: 12px 8px;
}

.table-dark td {
    border-bottom: 1px solid rgba(255, 255, 255, 0.15);
    font-size: 0.85rem;
    padding: 12px 8px;
}

.table-dark tr:hover {
    background: rgba(255, 235, 59, 0.1);
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(15px); }
    to { opacity: 1; transform: translateY(0); }
}

@keyframes scaleIn {
    from { opacity: 0; scale: 0.95; }
    to { opacity: 1; scale: 1; }
}

@media (max-width: 768px) {
    .artist-analytics-section h2 {
        font-size: 2.2rem;
    }
    .artist-analytics-section p {
        font-size: 1.1rem;
    }
    .artist-photo {
        width: 160px;
        height: 160px;
    }
    .artist-details p {
        font-size: 1rem;
    }
    .stat-value {
        font-size: 1.4rem;
    }
    .btn-hero {
        padding: 10px 20px;
        font-size: 0.95rem;
    }
    .table-dark th,
    .table-dark td {
        font-size: 0.8rem;
        padding: 10px 6px;
    }
}

@media (max-width: 576px) {
    .artist-photo {
        width: 140px;
        height: 140px;
    }
    .btn-hero {
        padding: 8px 16px;
        font-size: 0.9rem;
    }
    .table-dark th,
    .table-dark td {
        font-size: 0.75rem;
        padding: 8px 4px;
    }
}
</style>