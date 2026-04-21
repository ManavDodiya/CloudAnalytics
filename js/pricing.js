export const platforms = [
  {
    id: "aws",
    name: "Amazon Web Services",
    shortName: "AWS",
    color: "#FF9900",
    pricing: {
      economy: { inputPer1M: 0.25, outputPer1M: 1.25 }, // e.g., Nova Micro
      standard: { inputPer1M: 3.00, outputPer1M: 15.00 }, // e.g., Claude 3.5 Sonnet
      premium: { inputPer1M: 15.00, outputPer1M: 75.00 }, // e.g., Claude 3 Opus
    },
    metrics: {
      uptimeSLA: 99.99,
      latencyP50: 250,
      regions: 33,
      supportTiers: 4,
    },
    historical: [1.2, 1.2, 1.1, 1.0, 1.0, 1.0]
  },
  {
    id: "azure",
    name: "Microsoft Azure",
    shortName: "Azure",
    color: "#0078D4",
    pricing: {
      economy: { inputPer1M: 0.15, outputPer1M: 0.60 }, // e.g., GPT-4o-mini
      standard: { inputPer1M: 2.50, outputPer1M: 10.00 }, // e.g., GPT-4o
      premium: { inputPer1M: 10.00, outputPer1M: 30.00 }, // e.g., GPT-4
    },
    metrics: {
      uptimeSLA: 99.9,
      latencyP50: 300,
      regions: 60,
      supportTiers: 4,
    },
    historical: [1.3, 1.2, 1.2, 1.1, 1.0, 1.0]
  },
  {
    id: "gcp",
    name: "Google Cloud",
    shortName: "Google Cloud",
    color: "#4285F4",
    pricing: {
      economy: { inputPer1M: 0.075, outputPer1M: 0.30 }, // e.g., Gemini 1.5 Flash
      standard: { inputPer1M: 1.25, outputPer1M: 5.00 }, // e.g., Gemini 1.5 Pro
      premium: { inputPer1M: 2.00, outputPer1M: 8.00 }, // e.g., Gemini 1.5 Pro (large context)
    },
    metrics: {
      uptimeSLA: 99.9,
      latencyP50: 220,
      regions: 40,
      supportTiers: 3,
    },
    historical: [1.4, 1.3, 1.1, 1.0, 0.8, 0.8]
  },
  {
    id: "alibaba",
    name: "Alibaba Cloud",
    shortName: "Alibaba",
    color: "#FF6A00",
    pricing: {
      economy: { inputPer1M: 0.10, outputPer1M: 0.30 }, // e.g., Qwen-Plus
      standard: { inputPer1M: 0.50, outputPer1M: 1.50 }, // e.g., Qwen-Turbo
      premium: { inputPer1M: 2.00, outputPer1M: 6.00 }, // e.g., Qwen-Max
    },
    metrics: {
      uptimeSLA: 99.95,
      latencyP50: 350,
      regions: 30,
      supportTiers: 3,
    },
    historical: [0.9, 0.8, 0.8, 0.7, 0.6, 0.5]
  },
  {
    id: "oracle",
    name: "Oracle Cloud",
    shortName: "Oracle",
    color: "#C74634",
    pricing: {
      economy: { inputPer1M: 0.30, outputPer1M: 0.60 }, // e.g., Cohere Command R
      standard: { inputPer1M: 0.80, outputPer1M: 2.40 }, // e.g., Llama 3
      premium: { inputPer1M: 3.00, outputPer1M: 9.00 }, // e.g., Cohere Command R+
    },
    metrics: {
      uptimeSLA: 99.95,
      latencyP50: 280,
      regions: 48,
      supportTiers: 3,
    },
    historical: [1.1, 1.1, 1.0, 0.9, 0.9, 0.8]
  }
];
