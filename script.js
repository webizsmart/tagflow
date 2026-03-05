// Initialize Lucide Icons
lucide.createIcons();

// Elements
const songsSlider = document.getElementById('monthly-songs');
const churnSlider = document.getElementById('churn-rate');
const priceSlider = document.getElementById('premium-price');

const songsVal = document.getElementById('songs-val');
const churnVal = document.getElementById('churn-val');
const priceVal = document.getElementById('price-val');

const resRevenue = document.getElementById('res-revenue');
const resCost = document.getElementById('res-cost');
const resMargin = document.getElementById('res-margin');
const resLtv = document.getElementById('res-ltv');

// Constants
const SERVER_COST_PER_SONG = 0.002;
const CAC = 1200; // Customer Acquisition Cost estimate

// Number Formatter
const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
});

const formatNumber = (num) => new Intl.NumberFormat('en-US').format(num);

// Calculation Logic
function calculateSimulator() {
    const songs = parseInt(songsSlider.value);
    const churn = parseFloat(churnSlider.value) / 100;
    const price = parseFloat(priceSlider.value);

    // Monthly Revenue and Cost
    const monthlyRevenue = songs * price;
    const monthlyCost = songs * SERVER_COST_PER_SONG;

    // Gross Margin
    const grossMargin = (monthlyRevenue - monthlyCost) / monthlyRevenue;

    // We assume an average customer brings in a certain subset of these songs.
    // For simplicity of LTV showing the 'business health', let's use the proposed model
    // Assuming the entire pool we simulate is one "average enterprise account equivalent" or scaled.
    // Let's use ARPU = standard enterprise MRR ($300) for LTV calculation just to match the pitch deck,
    // OR scale it dynamically. Let's make it more realistic to the sliders.
    // If we assume Average Revenue Per User (ARPU) is dynamically linked to the slider...

    // Let's stick closer to the pitch deck math for the LTV/CAC ratio:
    // LTV = (ARPU * Margin) / Churn
    // Let's assume an average customer processes 10,000 songs/month
    const avgSongsPerUser = 10000;
    const arpu = avgSongsPerUser * price;

    const ltv = (arpu * grossMargin) / churn;

    const ltvCacRatio = ltv / CAC;

    // Update DOM
    songsVal.textContent = formatNumber(songs);
    churnVal.textContent = churnSlider.value;
    priceVal.textContent = price.toFixed(3);

    resRevenue.textContent = formatter.format(monthlyRevenue);
    resCost.textContent = formatter.format(monthlyCost);
    resMargin.textContent = (grossMargin * 100).toFixed(1) + '%';

    // Color coding ratio
    resLtv.textContent = ltvCacRatio.toFixed(1) + 'x';

    resLtv.style.webkitTextFillColor = 'unset';
    resLtv.style.background = 'none';

    if (ltvCacRatio >= 5) {
        resLtv.style.color = '#34d399'; // Green
    } else if (ltvCacRatio >= 3) {
        resLtv.style.color = '#60a5fa'; // Blue
    } else if (ltvCacRatio >= 1) {
        resLtv.style.color = '#fbbf24'; // Yellow
    } else {
        resLtv.style.color = '#f87171'; // Red
    }
}

// Event Listeners
songsSlider.addEventListener('input', calculateSimulator);
churnSlider.addEventListener('input', calculateSimulator);
priceSlider.addEventListener('input', calculateSimulator);

// Initial Calculation
calculateSimulator();


// Intersection Observer for Scroll Animations
const observeElements = document.querySelectorAll('.reveal-on-scroll');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Optional: observer.unobserve(entry.target) if we only want it to happen once
        }
    });
}, {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
});

observeElements.forEach(el => observer.observe(el));

// Navbar Scrolled State
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(5, 5, 5, 0.9)';
        navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.5)';
    } else {
        navbar.style.background = 'rgba(5, 5, 5, 0.7)';
        navbar.style.boxShadow = 'none';
    }
});
