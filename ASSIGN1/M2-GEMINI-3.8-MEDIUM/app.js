/**
 * VORTEX FDE - Interactive Application Logic
 * Terminal simulator, Pod configurator, Topology explorer, Canvas ambient background, Modals & UI Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  initAmbientCanvas();
  initTerminalSimulator();
  initMetricsObserver();
  initNavScrollSpy();
  updateCalculator();
});

/* ==========================================================================
   1. AMBIENT BACKGROUND CANVAS (CYBERNETIC CONSTELLATION)
   ========================================================================== */
function initAmbientCanvas() {
  const canvas = document.getElementById('ambient-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const particles = [];
  const particleCount = Math.min(Math.floor((width * height) / 22000), 55);

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.45;
      this.vy = (Math.random() - 0.5) * 0.45;
      this.radius = Math.random() * 1.6 + 0.8;
      this.alpha = Math.random() * 0.4 + 0.2;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0) this.x = width;
      if (this.x > width) this.x = 0;
      if (this.y < 0) this.y = height;
      if (this.y > height) this.y = 0;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 242, 254, ${this.alpha})`;
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#00F2FE';
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  let mouse = { x: -1000, y: -1000 };
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  function render() {
    ctx.clearRect(0, 0, width, height);

    // Draw connecting lines between particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 140) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          const lineAlpha = (1 - dist / 140) * 0.15;
          ctx.strokeStyle = `rgba(99, 102, 241, ${lineAlpha})`;
          ctx.lineWidth = 0.9;
          ctx.stroke();
        }
      }
    }

    // Connect particles near mouse
    for (let p of particles) {
      const dx = p.x - mouse.x;
      const dy = p.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 180) {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.strokeStyle = `rgba(0, 242, 254, ${(1 - dist / 180) * 0.25})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      p.update();
      p.draw();
    }

    requestAnimationFrame(render);
  }

  render();

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });
}

/* ==========================================================================
   2. INTERACTIVE TERMINAL SIMULATOR
   ========================================================================== */
const terminalScenarios = {
  ai: [
    { text: '[INIT] Pod Alpha-4 connected to client GitLab (bastion-us-east-1)', type: 'dim' },
    { text: '→ Identified bottleneck: Naive dense vector search causing 1,480ms P99 latency spike', type: 'yellow' },
    { text: '→ Compiling vLLM tensor-parallel engine with FlashAttention-3 kernels...', type: 'cyan' },
    { text: '✔ CUDA graphs cached | TensorRT-LLM weights loaded across 8x H100 SXM5', type: 'success' },
    { text: '✔ Benchmarking P99 latency: 1,480ms → 42ms (-97.1% latency reduction)', type: 'success' },
    { text: '→ Submitting Pull Request #412: "feat(inference): high-throughput vLLM orchestrator"', type: 'purple' },
    { text: '✔ CI Pipeline passed (100% test coverage). Awaiting CTO sign-off.', type: 'success' }
  ],
  data: [
    { text: '[INIT] Pod Bravo-2 inspecting Kafka consumer group lag (partition: 128)', type: 'dim' },
    { text: '→ Detected 4.2M unhandled financial tick events during market volatility spike', type: 'yellow' },
    { text: '→ Deploying Apache Flink stateful stream processing cluster (Rust serde bridge)...', type: 'cyan' },
    { text: '✔ Checkpointing interval synchronized to Apache Iceberg metadata catalog', type: 'success' },
    { text: '✔ Peak sustained throughput verified: 124,000 TPS @ 6.2ms stream latency', type: 'success' },
    { text: '→ Merged PR #89: "fix(stream): zero-data-loss Flink deduplication engine"', type: 'purple' }
  ],
  airgap: [
    { text: '[INIT] Pod Charlie-Enclave connecting via hardware FIDO2 key (DoD IL5)', type: 'dim' },
    { text: '→ Verifying zero outbound network egress policies & AWS Nitro enclaves...', type: 'cyan' },
    { text: '✔ Egress route tables: 100% isolated. No external DNS resolution detected', type: 'success' },
    { text: '→ Bootstrapping offline Llama-3-70B model with INT4 AWQ quantization...', type: 'yellow' },
    { text: '✔ Sovereign model inference active in secure memory enclave', type: 'success' },
    { text: '✔ Security audit token generated: VTX-GOV-IL5-9921 [VALIDATED]', type: 'purple' }
  ]
};

let currentScenario = 'ai';
let terminalInterval = null;

function initTerminalSimulator() {
  const terminalTabs = document.querySelectorAll('.terminal-tab');
  terminalTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      terminalTabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      currentScenario = tab.getAttribute('data-scenario');
      playTerminalScenario(currentScenario);
    });
  });

  playTerminalScenario('ai');

  const btnTerminal = document.getElementById('btn-quick-terminal');
  if (btnTerminal) {
    btnTerminal.addEventListener('click', () => {
      const termEl = document.getElementById('interactive-terminal');
      if (termEl) {
        termEl.scrollIntoView({ behavior: 'smooth' });
        runScenarioCommand('benchmark');
      }
    });
  }
}

function playTerminalScenario(scenarioKey) {
  const contentEl = document.getElementById('terminal-content');
  const currentCmdEl = document.getElementById('terminal-current-cmd');
  if (!contentEl) return;

  if (terminalInterval) clearInterval(terminalInterval);
  contentEl.innerHTML = '';
  
  const lines = terminalScenarios[scenarioKey] || terminalScenarios.ai;
  let lineIdx = 0;

  if (currentCmdEl) {
    currentCmdEl.textContent = `vortex-cli deploy --scenario=${scenarioKey} --env=prod`;
  }

  terminalInterval = setInterval(() => {
    if (lineIdx < lines.length) {
      appendTerminalLine(lines[lineIdx].text, lines[lineIdx].type);
      lineIdx++;
    } else {
      clearInterval(terminalInterval);
    }
  }, 500);
}

function appendTerminalLine(text, type = 'dim') {
  const contentEl = document.getElementById('terminal-content');
  if (!contentEl) return;

  const div = document.createElement('div');
  div.className = `terminal-line terminal-log-${type}`;
  div.textContent = text;
  contentEl.appendChild(div);

  const termBody = document.getElementById('terminal-body');
  if (termBody) {
    termBody.scrollTop = termBody.scrollHeight;
  }
}

function runScenarioCommand(cmdType) {
  if (cmdType === 'benchmark') {
    appendTerminalLine('▶ $ vortex-cli benchmark --concurrency=2000 --duration=10s', 'cyan');
    setTimeout(() => appendTerminalLine('⚡ Running warm-up queries on GPU cluster...', 'dim'), 200);
    setTimeout(() => appendTerminalLine('⚡ Benchmarking 50,000 HTTP requests: P50=12ms | P95=28ms | P99=41.8ms', 'success'), 700);
    setTimeout(() => appendTerminalLine('✔ Zero failed transactions recorded under peak load.', 'success'), 1100);
  } else if (cmdType === 'verify_airgap') {
    appendTerminalLine('▶ $ vortex-cli enclave verify-mtls --strict', 'cyan');
    setTimeout(() => appendTerminalLine('🛡️ Checking mutual TLS certificate chains across all pods...', 'dim'), 250);
    setTimeout(() => appendTerminalLine('🛡️ Enclave egress firewall: 0/0 packets allowed outbound.', 'dim'), 600);
    setTimeout(() => appendTerminalLine('✔ Air-gap isolation integrity: 100% COMPLIANT (DoD IL5 verified)', 'success'), 950);
  } else if (cmdType === 'scale_pod') {
    appendTerminalLine('▶ $ vortex-cli scale --cluster=prod-vllm --replicas=8', 'cyan');
    setTimeout(() => appendTerminalLine('🚀 Auto-provisioning 8x NVIDIA H100 nodes in customer VPC...', 'yellow'), 250);
    setTimeout(() => appendTerminalLine('🚀 Distributed Ray actors connected. High-availability cluster online.', 'success'), 750);
  }
}

function clearTerminalLogs() {
  const contentEl = document.getElementById('terminal-content');
  if (contentEl) {
    contentEl.innerHTML = '<div class="terminal-log-dim">Terminal logs cleared. Ready for input.</div>';
  }
}

/* ==========================================================================
   3. ANIMATED METRICS COUNTER (INTERSECTION OBSERVER)
   ========================================================================== */
function initMetricsObserver() {
  const cards = document.querySelectorAll('.metric-number');
  if (!cards.length) return;

  let hasAnimated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        animateAllCounters();
      }
    });
  }, { threshold: 0.2 });

  const banner = document.getElementById('impact-metrics');
  if (banner) observer.observe(banner);
}

function animateAllCounters() {
  const numbers = document.querySelectorAll('.metric-number');
  numbers.forEach(el => {
    const target = parseFloat(el.getAttribute('data-target'));
    const isDecimal = target % 1 !== 0;
    const duration = 1600;
    const startTime = performance.now();

    function updateCount(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const current = progress * target;

      if (isDecimal) {
        el.textContent = current.toFixed(2);
      } else {
        el.textContent = Math.floor(current);
      }

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        el.textContent = isDecimal ? target.toFixed(2) : target;
      }
    }

    requestAnimationFrame(updateCount);
  });
}

/* ==========================================================================
   4. TOPOLOGY EXPLORER INTERACTION
   ========================================================================== */
const topoNodesData = {
  perimeter: {
    badge: 'SECURITY & PERIMETER',
    title: 'Client VPC & Dedicated Bastion Ingress',
    desc: 'Our Forward Deployed Engineers do not require permanent credentials or external telemetry exfiltration. We operate exclusively through mutual TLS, customer-managed IAM roles, hardware-backed keys, and ephemeral jump hosts inside your dedicated sovereign environment.',
    m1Label: 'Data Transit Protocol',
    m1Val: 'mTLS 1.3 + WireGuard',
    m2Label: 'Compliance Clearance',
    m2Val: 'SOC2 Type II / DoD IL-5',
    m3Label: 'Audit Logging',
    m3Val: '100% Immutable CloudTrail'
  },
  'fde-pod': {
    badge: 'EMBEDDED STRIKE TEAM',
    title: 'VORTEX FDE Pod (Staff & Principal Engineers)',
    desc: 'Embedded directly into your GitHub / GitLab organizations. FDEs work in your daily standups, review your code, implement automated test harnesses, and write modular production features in your native tech stack (Rust, Go, Python, C++, TypeScript).',
    m1Label: 'Onboarding Time',
    m1Val: '48 – 72 Hours',
    m2Label: 'Weekly Commit Cadence',
    m2Val: '20+ Reviewed PRs / Pod',
    m3Label: 'Code Ownership',
    m3Val: '100% Client Owned (Zero Lock-In)'
  },
  'data-plane': {
    badge: 'DISTRIBUTED DATA INFRASTRUCTURE',
    title: 'Real-Time Streaming & Lakehouse Core',
    desc: 'High-throughput event ingestion pipelines handling petabytes with zero message loss. We re-architect bottlenecked Spark jobs into real-time Apache Flink stateful stream processing, Apache Iceberg lakehouses, and sub-50ms ClickHouse query engines.',
    m1Label: 'Sustained Throughput',
    m1Val: '100,000+ Events/sec',
    m2Label: 'Query Response P99',
    m2Val: '< 45ms Analytical Latency',
    m3Label: 'Storage Efficiency',
    m3Val: '65% Cloud Spend Reduction'
  },
  'ai-cluster': {
    badge: 'HIGH-PERFORMANCE INFERENCE',
    title: 'Distributed AI Inference & TensorRT Engine',
    desc: 'Custom model serving architectures that maximize GPU utilization. We deploy vLLM clusters with CUDA graph execution, FlashAttention-3, dynamic batching, and hybrid GraphRAG retrieval engines designed for enterprise scale.',
    m1Label: 'Inference Latency',
    m1Val: '42ms P99 TTFT',
    m2Label: 'Concurrency Capacity',
    m2Val: '4,000+ Concurrent Tokens/s',
    m3Label: 'Deployment Scope',
    m3Val: 'Air-Gapped or Sovereign Cloud'
  }
};

function selectTopoNode(nodeKey) {
  const allNodes = document.querySelectorAll('.topo-node');
  allNodes.forEach(n => {
    if (n.getAttribute('data-node') === nodeKey) {
      n.classList.add('active');
    } else {
      n.classList.remove('active');
    }
  });

  const data = topoNodesData[nodeKey];
  if (!data) return;

  const badgeEl = document.getElementById('topo-node-badge');
  const titleEl = document.getElementById('topo-node-title');
  const descEl = document.getElementById('topo-node-desc');
  const m1Label = document.querySelector('#topo-details-panel .topo-metric:nth-child(1) .tm-label');
  const m1Val = document.getElementById('topo-metric-1');
  const m2Label = document.querySelector('#topo-details-panel .topo-metric:nth-child(2) .tm-label');
  const m2Val = document.getElementById('topo-metric-2');
  const m3Label = document.querySelector('#topo-details-panel .topo-metric:nth-child(3) .tm-label');
  const m3Val = document.getElementById('topo-metric-3');

  if (badgeEl) badgeEl.textContent = data.badge;
  if (titleEl) titleEl.textContent = data.title;
  if (descEl) descEl.textContent = data.desc;
  if (m1Label) m1Label.textContent = data.m1Label;
  if (m1Val) m1Val.textContent = data.m1Val;
  if (m2Label) m2Label.textContent = data.m2Label;
  if (m2Val) m2Val.textContent = data.m2Val;
  if (m3Label) m3Label.textContent = data.m3Label;
  if (m3Val) m3Val.textContent = data.m3Val;
}

/* ==========================================================================
   5. POD CONFIGURATOR & VELOCITY CALCULATOR
   ========================================================================== */
let selectedDomain = 'genai';
let selectedPod = 'tactical';

const domainButtons = document.querySelectorAll('.pill-option');
domainButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    domainButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    selectedDomain = btn.getAttribute('data-value');
    updateCalculator();
  });
});

function selectPodTier(podTier) {
  const podOptions = document.querySelectorAll('.pod-option');
  podOptions.forEach(p => {
    if (p.getAttribute('data-pod') === podTier) {
      p.classList.add('active');
    } else {
      p.classList.remove('active');
    }
  });
  selectedPod = podTier;
  updateCalculator();
}

function updateCalculator() {
  const slider = document.getElementById('duration-slider');
  const weeks = slider ? parseInt(slider.value, 10) : 12;

  const displayEl = document.getElementById('slider-duration-display');
  if (displayEl) {
    let suffix = 'Weeks (Production Launch)';
    if (weeks <= 6) suffix = 'Weeks (Rapid Sprint)';
    else if (weeks >= 18) suffix = 'Weeks (Enterprise Transformation)';
    displayEl.textContent = `${weeks} ${suffix}`;
  }

  // Velocity Calculation Multipliers
  let baseVelocity = 8.5;
  let weeksSavedMultiplier = 1.4;
  let commitsPerWeek = 10;
  let throughputSpec = '< 50ms P99 (10k+ TPS)';
  let podNameText = '';

  if (selectedPod === 'scout') {
    baseVelocity = 6.8;
    weeksSavedMultiplier = 0.9;
    commitsPerWeek = 6;
    podNameText = `Scout Specialist (1 Principal FDE) for ${weeks}-week targeted engagement.`;
  } else if (selectedPod === 'tactical') {
    baseVelocity = 18.4;
    weeksSavedMultiplier = 1.6;
    commitsPerWeek = 14;
    podNameText = `Tactical Pod (2 Staff FDEs + 1 Infra Architect) for ${weeks}-week embedded sprint.`;
  } else if (selectedPod === 'strike') {
    baseVelocity = 28.2;
    weeksSavedMultiplier = 2.4;
    commitsPerWeek = 28;
    podNameText = `Strike Force (4 Principal FDEs + 1 AI Lead + 1 DevOps Lead) for ${weeks}-week platform overhaul.`;
  }

  if (selectedDomain === 'genai') {
    throughputSpec = 'Sub-45ms TTFT | 4,000 Tok/s';
  } else if (selectedDomain === 'streaming') {
    throughputSpec = '120,000+ Events/sec (<10ms Lag)';
  } else if (selectedDomain === 'airgap') {
    throughputSpec = '100% Offline Enclave (DoD IL5)';
  } else if (selectedDomain === 'modern') {
    throughputSpec = 'Zero Downtime Strangler Cutover';
  }

  const weeksSavedLow = Math.round(weeks * weeksSavedMultiplier);
  const weeksSavedHigh = Math.round(weeksSavedLow * 1.3);
  const totalCommits = Math.round(weeks * commitsPerWeek);

  const resVelocity = document.getElementById('res-velocity-score');
  const resWeeks = document.getElementById('res-weeks-saved');
  const resCommits = document.getElementById('res-commits');
  const resThroughput = document.getElementById('res-throughput');
  const resPodText = document.getElementById('res-pod-text');

  if (resVelocity) resVelocity.textContent = `${baseVelocity.toFixed(1)}x`;
  if (resWeeks) resWeeks.textContent = `${weeksSavedLow} – ${weeksSavedHigh} Weeks`;
  if (resCommits) resCommits.textContent = `${totalCommits}+ Merged PRs`;
  if (resThroughput) resThroughput.textContent = throughputSpec;
  if (resPodText) resPodText.textContent = podNameText;
}

function scrollToConfigurator() {
  const el = document.getElementById('calculator');
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

/* ==========================================================================
   6. CASE STUDIES FILTERING
   ========================================================================== */
function filterCases(category) {
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(b => {
    if (b.getAttribute('data-filter') === category) {
      b.classList.add('active');
    } else {
      b.classList.remove('active');
    }
  });

  const cards = document.querySelectorAll('.case-card');
  cards.forEach(card => {
    const cardCat = card.getAttribute('data-category');
    if (category === 'all' || cardCat === category) {
      card.style.display = 'flex';
      card.style.opacity = '1';
    } else {
      card.style.display = 'none';
      card.style.opacity = '0';
    }
  });
}

/* ==========================================================================
   7. CAPABILITY BLUEPRINT DEEP DIVE MODAL
   ========================================================================== */
const capabilityBlueprints = {
  genai: {
    badge: 'CAPABILITY BLUEPRINT #01',
    title: 'Enterprise GenAI & Multi-Agent Orchestration',
    html: `
      <p>Moving from a LangChain prototype to a fault-tolerant enterprise production engine requires deep systems engineering. Our FDEs build deterministic state machines, hybrid retrieval, and custom caching.</p>
      <div class="cap-modal-diagram">
+------------------------------------------------------------------------+
|                      ENTERPRISE CLIENT APPLICATION                     |
+-----------------------------------+------------------------------------+
                                    | gRPC / REST (mTLS)
                                    v
+------------------------------------------------------------------------+
|                     VORTEX ORCHESTRATION GATEWAY                       |
|   [Semantic Caching (Redis)] <---> [Prompt Compiler & Guardrails]     |
+-----------------------------------+------------------------------------+
                                    |
            +-----------------------+-----------------------+
            |                                               |
            v                                               v
+---------------------------+               +---------------------------+
|  HYBRID RETRIEVAL (RAG)   |               |  INFERENCE SERVING PODS   |
| • Dense: pgvector / Qdrant|               | • vLLM Tensor Parallelism |
| • Sparse: BM25 / GraphRAG |               | • Triton Inference Server |
| • Reranker: Cohere / BGE  |               | • FlashAttention-3 Kernel |
+---------------------------+               +---------------------------+
      </div>
      <h4 style="color:#FFF; margin: 16px 0 8px;">Key Deliverables in 48-Hour Deployment:</h4>
      <ul style="padding-left: 20px; line-height: 1.8;">
        <li>Deterministic state loops using LangGraph & custom Rust dispatchers</li>
        <li>Sub-50ms time-to-first-token (TTFT) via KV-cache chunking</li>
        <li>Automated evaluation test harness measuring hallucination rates under 0.1%</li>
      </ul>
    `
  },
  streaming: {
    badge: 'CAPABILITY BLUEPRINT #02',
    title: 'Petabyte Distributed Data & Stream Engines',
    html: `
      <p>For organizations handling high-velocity transactions, telemetry, or sensor telemetry. We eliminate backpressure and data loss by embedding stateful streaming architectures.</p>
      <div class="cap-modal-diagram">
[HIGH-TPS INGESTION] ----> [APACHE KAFKA / REDPANDA]
                                   |
                                   v
             [APACHE FLINK EXACTLY-ONCE STATE ENGINE]
              • RocksDB state backend with S3 incremental savepoints
              • Rust/C++ custom deserialization kernels
                                   |
             +---------------------+---------------------+
             |                                           |
             v                                           v
[APACHE ICEBERG LAKEHOUSE]                  [CLICKHOUSE ANALYTICAL OLAP]
(Petabyte Historical Storage)               (Sub-30ms Real-Time Queries)
      </div>
      <h4 style="color:#FFF; margin: 16px 0 8px;">Production SLAs Delivered:</h4>
      <ul style="padding-left: 20px; line-height: 1.8;">
        <li>120,000+ sustained Events per second per node</li>
        <li>Exactly-once processing semantics with zero duplicate records</li>
        <li>65% reduction in cloud storage and compute egress expenses</li>
      </ul>
    `
  },
  airgap: {
    badge: 'CAPABILITY BLUEPRINT #03',
    title: 'Air-Gapped Sovereign Cloud & Defense Deployments',
    html: `
      <p>Designed for national defense, intelligence, and heavily regulated critical infrastructure. We deploy completely self-contained AI platforms into zero-egress environments.</p>
      <div class="cap-modal-diagram">
+------------------------------------------------------------------------+
|                 ZERO-TRUST AIR-GAPPED PERIMETER (DoD IL-5)             |
|                                                                        |
|   +---------------------+        mTLS        +---------------------+   |
|   |  LOCAL AIR-GAP REG  | ----------------> |  OFFLINE K8s CLUSTER |   |
|   | (Signed Helm/Oci)   |                   | (Hardened RKE2 / TALOS)|  |
|   +---------------------+                   +----------+----------+   |
|                                                        |               |
|                                                        v               |
|   +----------------------------------------------------+----------+    |
|   |            ENCLAVE-ISOLATED MODEL RUNTIME (INT4 / INT8)        |    |
|   |     • Zero internet phone-home • Ephemeral RAM encrypted      |    |
|   +---------------------------------------------------------------+    |
+------------------------------------------------------------------------+
      </div>
      <h4 style="color:#FFF; margin: 16px 0 8px;">Compliance & Security Guarantees:</h4>
      <ul style="padding-left: 20px; line-height: 1.8;">
        <li>US-citizen Staff Engineers with active DoD Secret clearances</li>
        <li>Zero outbound packets audited via hardware firewall probes</li>
        <li>Full Infrastructure-as-Code Terraform / Ansible runbooks</li>
      </ul>
    `
  },
  latency: {
    badge: 'CAPABILITY BLUEPRINT #04',
    title: 'Kernel Optimization & Latency Hardening',
    html: `
      <p>When off-the-shelf Python libraries are too slow and expensive. Our systems architects rewrite critical bottlenecks in low-level Rust and custom CUDA kernels.</p>
      <div class="cap-modal-diagram">
BEFORE: Python/NumPy Baseline ===> [Latency: 1,480ms] [Memory: 48GB]
-----------------------------------------------------------------------
AFTER: VORTEX Optimized Core  ===> [Latency: 42ms]    [Memory: 8.2GB]
• Custom FlashAttention-3 matrix multiplication
• PagedAttention CUDA kernel memory reuse
• Zero-copy Rust FFI serialization
      </div>
      <h4 style="color:#FFF; margin: 16px 0 8px;">Surgical Speedups:</h4>
      <ul style="padding-left: 20px; line-height: 1.8;">
        <li>Up to 28x latency speedups on high-concurrency microservices</li>
        <li>80% reduction in GPU memory fragmentation and VRAM OOM crashes</li>
      </ul>
    `
  },
  modernization: {
    badge: 'CAPABILITY BLUEPRINT #05',
    title: 'Surgical Monolith Modernization (Strangler Fig)',
    html: `
      <p>Avoid multi-year rewrites that fail. We use Change Data Capture (Debezium) and intelligent proxy gateways to carve out high-risk services with zero downtime.</p>
      <div class="cap-modal-diagram">
[CLIENT TRAFFIC] ---> [TRAFFIC SHADOWING & CANARY GATEWAY]
                                    |
                    +---------------+---------------+
                    | (90% Traffic)                 | (10% Canary)
                    v                               v
         [LEGACY MONOLITH CORE]            [MODERNIZED MICROSERVICES]
                    |                               ^
                    +---> [DEBEZIUM CDC] -----------+
                         (Real-Time State Mirror)
      </div>
      <h4 style="color:#FFF; margin: 16px 0 8px;">De-Risking Legacy Replacements:</h4>
      <ul style="padding-left: 20px; line-height: 1.8;">
        <li>Live traffic shadowing verifies 100% bug parity before cutover</li>
        <li>Zero downtime guarantee for 24/7 mission-critical operations</li>
      </ul>
    `
  },
  edge: {
    badge: 'CAPABILITY BLUEPRINT #06',
    title: 'Tactical Edge & Embedded Robotics Intelligence',
    html: `
      <p>Deploying AI models onto NVIDIA Jetson Orin modules, autonomous drones, and field robotics with strict power, thermal, and weight constraints.</p>
      <div class="cap-modal-diagram">
[CAMERA & SENSOR FEEDS] ---> [ROS2 HARDWARE BRIDGE]
                                      |
                                      v
           [TENSORRT EDGE ENGINE: INT8 QUANTIZED OBJECT MODEL]
           • 30 FPS inference on NVIDIA Jetson AGX (15W power mode)
           • Hardware watchdog with automatic sub-second recovery
      </div>
      <h4 style="color:#FFF; margin: 16px 0 8px;">Field Capabilities:</h4>
      <ul style="padding-left: 20px; line-height: 1.8;">
        <li>Autonomous operation with zero network dependencies</li>
        <li>Ultra-fast thermal and battery-efficient quantization</li>
      </ul>
    `
  }
};

function openCapabilityModal(capKey) {
  const modal = document.getElementById('capability-modal');
  const badgeEl = document.getElementById('cap-modal-badge');
  const titleEl = document.getElementById('cap-modal-title');
  const bodyEl = document.getElementById('cap-modal-body');

  const data = capabilityBlueprints[capKey];
  if (!data) return;

  if (badgeEl) badgeEl.textContent = data.badge;
  if (titleEl) titleEl.textContent = data.title;
  if (bodyEl) bodyEl.innerHTML = data.html;

  if (modal) {
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
}

function closeCapabilityModal() {
  const modal = document.getElementById('capability-modal');
  if (modal) {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
}

/* ==========================================================================
   8. FAQ ACCORDION INTERACTION
   ========================================================================== */
function toggleFaq(buttonEl) {
  const item = buttonEl.closest('.faq-item');
  if (!item) return;

  const isActive = item.classList.contains('active');

  // Close all items
  document.querySelectorAll('.faq-item').forEach(i => {
    i.classList.remove('active');
    const btn = i.querySelector('.faq-trigger');
    if (btn) btn.setAttribute('aria-expanded', 'false');
  });

  // If was not active, open it
  if (!isActive) {
    item.classList.add('active');
    buttonEl.setAttribute('aria-expanded', 'true');
  }
}

/* ==========================================================================
   9. POD DISPATCH MODAL & FORM HANDLER
   ========================================================================== */
function openDispatchModal(prefillTopic) {
  const modal = document.getElementById('dispatch-modal');
  const form = document.getElementById('dispatch-form');
  const successScreen = document.getElementById('modal-success-screen');

  if (form) form.style.display = 'block';
  if (successScreen) successScreen.style.display = 'none';

  if (prefillTopic === 'security') {
    const detailsInp = document.getElementById('inp-details');
    if (detailsInp) detailsInp.value = 'Requesting comprehensive Enterprise Security Packet (SOC2 Type II, SIG Lite, Pen Test Summary, ITAR compliance).';
  }

  if (modal) {
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
}

function openDispatchModalWithPreload() {
  openDispatchModal();
  const missionSelect = document.getElementById('inp-mission');
  const podSelect = document.getElementById('inp-pod-size');

  if (missionSelect) missionSelect.value = selectedDomain;
  if (podSelect) podSelect.value = selectedPod;
}

function closeDispatchModal() {
  const modal = document.getElementById('dispatch-modal');
  if (modal) {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
}

function handleDispatchSubmit(e) {
  e.preventDefault();

  const submitBtn = document.getElementById('btn-submit-dispatch');
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>Verifying & Encrypting...</span>';
  }

  setTimeout(() => {
    const form = document.getElementById('dispatch-form');
    const successScreen = document.getElementById('modal-success-screen');
    const ticketIdEl = document.getElementById('receipt-ticket-id');

    // Generate random realistic ticket
    const randomTicketNum = Math.floor(1000 + Math.random() * 9000);
    if (ticketIdEl) ticketIdEl.textContent = `VTX-FDE-${randomTicketNum}`;

    if (form) form.style.display = 'none';
    if (successScreen) successScreen.style.display = 'block';

    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<span>Transmit Pod Dispatch Request</span>';
    }
  }, 900);
}

// Close modals on Escape key or background click
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeDispatchModal();
    closeCapabilityModal();
    closeMobileMenu();
  }
});

document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) {
      closeDispatchModal();
      closeCapabilityModal();
    }
  });
});

/* ==========================================================================
   10. MOBILE MENU & NAVIGATION SCROLL SPY
   ========================================================================== */
const mobileToggle = document.getElementById('mobile-toggle');
const mobileDrawer = document.getElementById('mobile-drawer');

if (mobileToggle && mobileDrawer) {
  mobileToggle.addEventListener('click', () => {
    mobileDrawer.classList.toggle('active');
  });
}

function closeMobileMenu() {
  if (mobileDrawer) mobileDrawer.classList.remove('active');
}

function initNavScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.desktop-nav .nav-link');

  window.addEventListener('scroll', () => {
    let currentId = '';
    const scrollPos = window.scrollY + 120;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  });
}
