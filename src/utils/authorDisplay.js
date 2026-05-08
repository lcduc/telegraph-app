const AUTHOR_NAMES = {
  'Telegraph Sports': 'Lê Lâm Tường',
};

const AUTHOR_TITLES = {
  'Sports Correspondent': 'Phóng viên thể thao',
};

export function getAuthorDisplayName(author) {
  return AUTHOR_NAMES[author] ?? author;
}

export function getAuthorTitleLabel(authorTitle) {
  return AUTHOR_TITLES[authorTitle] ?? authorTitle;
}