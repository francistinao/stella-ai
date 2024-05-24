/* eslint-disable prettier/prettier */
export const moment = (dateString: string): string => {
  const parsedDate = new Date(dateString.replace(' at', ''))
  const now = new Date()

  const secondsAgo = Math.floor((now.getTime() - parsedDate.getTime()) / 1000)

  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'week', seconds: 604800 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
    { label: 'second', seconds: 1 }
  ]

  for (const interval of intervals) {
    const intervalCount = Math.floor(secondsAgo / interval.seconds)
    if (intervalCount >= 1) {
      return intervalCount === 1
        ? `1 ${interval.label} ago`
        : `${intervalCount} ${interval.label}s ago`
    }
  }

  return 'just now'
}
