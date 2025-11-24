import i18n from '@/locale'
import dayjs from 'dayjs'

/**
 * 格式化时间戳
 */
export function formateTimestamp(
  datetime: number | undefined | null,
  is_year: boolean = false,
  float: boolean = true,
  only_time: boolean = false
) {
  if (!datetime) return ''
  if (float) datetime = datetime * 1000

  const date = new Date(datetime)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hours = date.getHours()
  const minutes = date.getMinutes()

  if (only_time) {
    return (hours >= 10 ? `${hours}` : `0${hours}`) + ':' + (minutes >= 10 ? `${minutes}` : `0${minutes}`)
  }

  let formattedString = `${month}月${day}号 ` + (hours >= 10 ? `${hours}` : `0${hours}`) + ':' + (minutes >= 10 ? `${minutes}` : `0${minutes}`)
  if (is_year) formattedString = `${year}年` + formattedString
  return formattedString
}

/**
 * 格式化时间对象
 */
export function formatDate({
  dtStr,
  date,
  withYear = false,
}: {
  dtStr?: string
  date?: Date
  withYear?: boolean
} = {}): string {
  const d = date || (dtStr ? dayjs(dtStr).toDate() : new Date())
  const dayjsDate = dayjs(d)
  let formattedString = `${dayjsDate.month() + 1}月${dayjsDate.date()}号 ` +
    dayjsDate.format('HH:mm')
  if (withYear) formattedString = `${dayjsDate.year()}年` + formattedString
  return formattedString
}

/** 移除时间的秒数 HH:MM:SS -> HH:MM */
export function removeTimeSeconds(time: string): string {
  return time.split(':').slice(0, 2).join(':')
}

/**
 * 获取时间差（距离现在多远）
 */
export function getTimeLossFromNow(datetime: number): string {
  const now = new Date()
  const past = new Date(datetime * 1000)
  const diff = now.getTime() - past.getTime()

  const seconds = Math.floor(diff / 1000)
  if (seconds < 60) return i18n.global.t('feed.metadata.time_loss.just_now')

  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}${i18n.global.t('feed.metadata.time_loss.minute')}`

  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}${i18n.global.t('feed.metadata.time_loss.hour')}`

  const days = Math.floor(hours / 24)
  return `${days}${i18n.global.t('feed.metadata.time_loss.day')}`
}
