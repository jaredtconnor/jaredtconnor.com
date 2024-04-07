export function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-us', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

