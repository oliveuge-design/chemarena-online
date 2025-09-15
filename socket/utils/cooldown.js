// Multi-room cooldown system - evita race conditions tra room diverse
const roomCooldowns = new Map()

export const abortCooldown = (game, io, room) => {
  const roomId = room || game?.room
  if (!roomId) return

  const roomCooldown = roomCooldowns.get(roomId)
  if (roomCooldown) {
    clearInterval(roomCooldown.timeout)

    if (roomCooldown.resolve) {
      roomCooldown.resolve()
    }

    roomCooldowns.delete(roomId)
    console.log(`🔄 Cooldown aborted for room ${roomId}`)
  }
}

export const cooldown = (ms, io, room) => {
  let count = ms - 1

  return new Promise((resolve) => {
    // Pulisci eventuali cooldown precedenti per questa room
    const existingCooldown = roomCooldowns.get(room)
    if (existingCooldown) {
      clearInterval(existingCooldown.timeout)
    }

    // Crea nuovo cooldown per la room
    const timeout = setInterval(() => {
      if (!count) {
        clearInterval(timeout)
        roomCooldowns.delete(room)
        resolve()
        return
      }
      io.to(room).emit("game:cooldown", count)
      count -= 1
    }, 1000)

    // Salva il cooldown per questa room
    roomCooldowns.set(room, {
      timeout: timeout,
      resolve: resolve
    })
  })
}

export const sleep = (sec) => new Promise((r) => setTimeout(r, sec * 1000))
