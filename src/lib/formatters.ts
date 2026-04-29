const SEK = new Intl.NumberFormat('sv-SE', { style: 'currency', currency: 'SEK', maximumFractionDigits: 0 })
const DATE = new Intl.DateTimeFormat('sv-SE', { dateStyle: 'short', timeStyle: 'short' })

export const formatSEK = (amount: number) => SEK.format(amount)
export const formatDate = (iso: string) => DATE.format(new Date(iso))
export const formatDateShort = (iso: string) =>
  new Intl.DateTimeFormat('sv-SE', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(iso))
