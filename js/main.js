import { platforms } from './pricing.js';

// Initialize Lucide Icons
lucide.createIcons();

// Elements
const badgesContainer = document.getElementById('badges-container');
const costCardsContainer = document.getElementById('costCards');

// Estimator Inputs
const tierSelect = document.getElementById('tierSelect');
const inputSlider = document.getElementById('inputSlider');
const outputSlider = document.getElementById('outputSlider');
const reqSlider = document.getElementById('reqSlider');

const inputVal = document.getElementById('inputVal');
const outputVal = document.getElementById('outputVal');
const reqVal = document.getElementById('reqVal');

// --- Initialization ---
function init() {
  renderBadges();
  renderCostCards();
  renderCompareTable();
  initCharts();
  initAnimations();
  
  // Event listeners
  tierSelect.addEventListener('change', updateEstimator);
  inputSlider.addEventListener('input', (e) => {
    inputVal.textContent = parseFloat(e.target.value).toFixed(1);
    updateEstimator();
  });
  outputSlider.addEventListener('input', (e) => {
    outputVal.textContent = parseFloat(e.target.value).toFixed(1);
    updateEstimator();
  });
  reqSlider.addEventListener('input', (e) => {
    reqVal.textContent = parseInt(e.target.value);
    updateEstimator();
  });

  // Calculate initial costs
  updateEstimator();
}

function renderBadges() {
  badgesContainer.innerHTML = '';
  platforms.forEach(p => {
    const badge = document.createElement('div');
    badge.className = 'badge';
    badge.innerHTML = `<span class="dot" style="background-color: ${p.color}"></span> ${p.shortName}`;
    badgesContainer.appendChild(badge);
  });
}

function renderCostCards() {
  costCardsContainer.innerHTML = '';
  platforms.forEach(p => {
    const card = document.createElement('div');
    card.className = 'cost-card';
    card.style.setProperty('--platform-color', p.color);
    card.innerHTML = `
      <div class="cost-header">
        <span class="cost-platform">${p.name}</span>
      </div>
      <div class="cost-value-area">
        <span class="cost-label">Est. Monthly Cost</span><br>
        <span class="cost-value" id="cost-${p.id}">$0.00</span>
      </div>
      <div class="cost-breakdown">
        <span>In: $<span id="in-cost-${p.id}">0.00</span></span>
        <span>Out: $<span id="out-cost-${p.id}">0.00</span></span>
      </div>
    `;
    costCardsContainer.appendChild(card);
  });
}

function renderCompareTable() {
  const tableBody = document.getElementById('compareTableBody');
  if (!tableBody) return;
  tableBody.innerHTML = '';
  
  platforms.forEach(p => {
    const tr = document.createElement('tr');
    tr.style.borderBottom = '1px solid var(--border-card)';
    // Highlight lowest cost dynamically if needed, keeping it simple here
    tr.innerHTML = `
      <td style="padding: 1rem; font-weight: 500; display: flex; align-items: center; gap: 0.5rem;">
        <span class="dot" style="width: 8px; height: 8px; border-radius: 50%; background-color: ${p.color}; display: inline-block;"></span>
        ${p.name}
      </td>
      <td style="padding: 1rem; font-family: var(--font-mono);">$${p.pricing.standard.inputPer1M.toFixed(2)}</td>
      <td style="padding: 1rem; font-family: var(--font-mono);">$${p.pricing.standard.outputPer1M.toFixed(2)}</td>
      <td style="padding: 1rem;">${p.metrics.uptimeSLA}%</td>
    `;
    tableBody.appendChild(tr);
  });
}

function updateEstimator() {
  const tier = tierSelect.value;
  // Convert millions to actual scale (sliders are in millions)
  const inputMillions = parseFloat(inputSlider.value);
  const outputMillions = parseFloat(outputSlider.value);
  const totalReqs = parseInt(reqSlider.value) * 1000; // slider is in thousands

  // Total tokens per month based on requests
  // Assuming slider defines tokens per request, but let's treat slider simply as "total millions per month" 
  // Wait, the plan was: input tokens, output tokens, requests/month. 
  // We'll treat sliders as "millions of tokens per request" * "requests per month".
  // Actually, to keep it simple and intuitive: the slider represents total tokens input/output per month.
  
  const totalInputMillions = inputMillions;
  const totalOutputMillions = outputMillions;

  platforms.forEach(p => {
    const pricing = p.pricing[tier];
    const inCost = totalInputMillions * pricing.inputPer1M;
    const outCost = totalOutputMillions * pricing.outputPer1M;
    const totalCost = inCost + outCost;

    // Animate the numbers
    animateValue(`cost-${p.id}`, totalCost);
    document.getElementById(`in-cost-${p.id}`).textContent = inCost.toFixed(2);
    document.getElementById(`out-cost-${p.id}`).textContent = outCost.toFixed(2);
  });
}

function animateValue(id, value) {
  const el = document.getElementById(id);
  const startObj = { val: parseFloat(el.textContent.replace('$', '').replace(',', '')) || 0 };
  gsap.to(startObj, {
    val: value,
    duration: 0.5,
    ease: "power2.out",
    onUpdate: () => {
      el.textContent = '$' + startObj.val.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    }
  });
}

function initCharts() {
  Chart.defaults.color = '#94A3B8';
  Chart.defaults.font.family = "'Inter', sans-serif";

  // Radar Chart
  const radarCtx = document.getElementById('radarChart').getContext('2d');
  new Chart(radarCtx, {
    type: 'radar',
    data: {
      labels: ['Cost Efficiency', 'Latency', 'Uptime', 'Coverage', 'Support'],
      datasets: platforms.map(p => ({
        label: p.shortName,
        data: [
          Math.random() * 40 + 60, // Mock normalized values
          Math.random() * 40 + 60,
          p.metrics.uptimeSLA,
          p.metrics.regions,
          Math.random() * 40 + 60
        ],
        backgroundColor: p.color + '33',
        borderColor: p.color,
        borderWidth: 2,
        pointBackgroundColor: p.color,
      }))
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        r: {
          angleLines: { color: 'rgba(255,255,255,0.1)' },
          grid: { color: 'rgba(255,255,255,0.1)' },
          pointLabels: { color: '#F1F5F9' },
          ticks: { display: false }
        }
      },
      plugins: {
        legend: { display: false }
      }
    }
  });

  // Bar Chart (Pricing Comparison - Standard Tier)
  const barCtx = document.getElementById('barChart').getContext('2d');
  window.compareChart = new Chart(barCtx, {
    type: 'bar',
    data: {
      labels: platforms.map(p => p.shortName),
      datasets: [
        {
          label: 'Input ($/1M)',
          data: platforms.map(p => p.pricing.standard.inputPer1M),
          backgroundColor: '#7C3AED',
          borderRadius: 4
        },
        {
          label: 'Output ($/1M)',
          data: platforms.map(p => p.pricing.standard.outputPer1M),
          backgroundColor: '#06B6D4',
          borderRadius: 4
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          grid: { color: 'rgba(255,255,255,0.05)' },
          beginAtZero: true
        },
        x: {
          grid: { display: false }
        }
      }
    }
  });
}

function initAnimations() {
  gsap.from(".fade-in", {
    y: 40,
    opacity: 0,
    duration: 0.8,
    stagger: 0.2,
    ease: "power3.out"
  });

  // Smooth scroll for nav links
  document.querySelectorAll('.nav-links a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      document.querySelector(this.getAttribute('href')).scrollIntoView({
        behavior: 'smooth'
      });
      document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
      this.classList.add('active');
    });
  });

  // Tabs for charts
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      // Button animation
      gsap.fromTo(this, {scale: 0.95}, {scale: 1, duration: 0.2, ease: "back.out(2)"});
      
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      
      const tab = this.getAttribute('data-tab');
      if(window.compareChart) {
        if(tab === 'pricing') {
          window.compareChart.data.datasets = [
            {
              label: 'Input ($/1M)',
              data: platforms.map(p => p.pricing.standard.inputPer1M),
              backgroundColor: '#7C3AED',
              borderRadius: 4
            },
            {
              label: 'Output ($/1M)',
              data: platforms.map(p => p.pricing.standard.outputPer1M),
              backgroundColor: '#06B6D4',
              borderRadius: 4
            }
          ];
        } else {
          window.compareChart.data.datasets = [
            {
              label: 'Latency (P50 ms)',
              data: platforms.map(p => p.metrics.latencyP50),
              backgroundColor: '#10B981',
              borderRadius: 4
            }
          ];
        }
        window.compareChart.update();
      }
    });
  });
}

window.addEventListener('DOMContentLoaded', init);
