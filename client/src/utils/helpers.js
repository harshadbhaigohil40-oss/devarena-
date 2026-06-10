// XP required for a given level
export const xpForLevel = (level) => Math.floor(100 * Math.pow(level, 1.5));

// Calculate level from total XP
export const levelFromXP = (totalXP) => {
  let level = 1;
  let xpNeeded = 0;
  while (level < 100) {
    xpNeeded += xpForLevel(level);
    if (totalXP < xpNeeded) break;
    level++;
  }
  return level;
};

// Progress percentage to next level
export const progressToNextLevel = (totalXP) => {
  const currentLevel = levelFromXP(totalXP);
  let xpAtCurrentLevel = 0;
  for (let i = 1; i < currentLevel; i++) {
    xpAtCurrentLevel += xpForLevel(i);
  }
  const xpIntoLevel = totalXP - xpAtCurrentLevel;
  const xpNeededForNext = xpForLevel(currentLevel);
  return Math.min((xpIntoLevel / xpNeededForNext) * 100, 100);
};

// Format large numbers
export const formatNumber = (num) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num?.toString() || '0';
};

// Time ago
export const timeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return Math.floor(seconds / 60) + 'm ago';
  if (seconds < 86400) return Math.floor(seconds / 3600) + 'h ago';
  if (seconds < 604800) return Math.floor(seconds / 86400) + 'd ago';
  return new Date(date).toLocaleDateString();
};

// Difficulty color class
export const difficultyClass = (difficulty) => `difficulty-${difficulty}`;
export const difficultyBadgeClass = (difficulty) => `badge difficulty-badge-${difficulty}`;

// Rarity color class
export const rarityBadgeClass = (rarity) => `badge badge-rarity-${rarity}`;
