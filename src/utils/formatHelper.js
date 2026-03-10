export const partnerTierConfig = {
  basic: {
    label: "Cơ bản",
    color: "#6b7280",
  },
  standard: {
    label: "Nâng cao",
    color: "rgb(245, 158, 11)",
  },
  premium: {
    label: "Chiến lược",
    color: "#A5190E",
  },
};

export const getTierColor = (tier) => {
  const key = tier?.toLowerCase();
  return partnerTierConfig[key]?.color || "#6b7280";
};

export const getTierLabel = (tier) => {
  const key = tier?.toLowerCase();
  return partnerTierConfig[key]?.label || "Cơ bản";
};
