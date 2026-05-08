const CATEGORY_LABELS = {
  FOOTBALL: 'Bóng đá',
  BASKETBALL: 'Bóng rổ',
  TENNIS: 'Tennis',
  F1: 'F1',
};

export function getCategoryLabel(category) {
  return CATEGORY_LABELS[category?.toUpperCase()] ?? category;
}