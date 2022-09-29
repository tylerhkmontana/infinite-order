export default function secToTime(sec) {
    const time = new Date(sec)
    const amOrPm = time.getHours() > 11 ? 'PM' : 'AM'
    const hours = time.getHours() > 12 ? time.getHours() % 12 : time.getHours()
    const minutes = time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes()
    const seconds = time.getSeconds() < 10 ? '0' + time.getSeconds() : time.getSeconds()
    return `${hours}:${minutes}:${seconds} ${amOrPm}`
}