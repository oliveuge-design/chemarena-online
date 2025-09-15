/**
 * SISTEMA LIMITE QUIZ CON SOGLIE DI SICUREZZA
 * Previene instabilità del sistema con troppi quiz contemporanei
 */

// CONFIGURAZIONE LIMITE
const LIMITS_CONFIG = {
  // Limite massimo assoluto di room attive
  MAX_ACTIVE_ROOMS: 50,

  // Limite di room per singolo insegnante
  MAX_ROOMS_PER_TEACHER: 5,

  // Limite di studenti per room
  MAX_STUDENTS_PER_ROOM: 100,

  // Soglia di warning (80% del limite)
  WARNING_THRESHOLD: 0.8,

  // Tempo di vita massimo di una room inattiva (30 minuti)
  ROOM_TIMEOUT_MS: 30 * 60 * 1000,

  // Intervallo di pulizia room inattive (5 minuti)
  CLEANUP_INTERVAL_MS: 5 * 60 * 1000,

  // Limite di memoria stimato per room (MB)
  MEMORY_PER_ROOM_MB: 2,

  // Limite totale di memoria per quiz (MB)
  MAX_MEMORY_MB: 200
};

class RoomLimiter {
  constructor() {
    this.activeRooms = new Map(); // roomId -> roomData
    this.teacherRoomCount = new Map(); // teacherId -> count
    this.lastCleanup = Date.now();

    // Avvia cleanup automatico
    this.startCleanupInterval();

    console.log('🛡️ RoomLimiter inizializzato:', LIMITS_CONFIG);
  }

  /**
   * Controlla se è possibile creare una nuova room
   */
  canCreateRoom(teacherId) {
    const checks = this.performSecurityChecks(teacherId);

    if (!checks.allowed) {
      console.log(`❌ Room creation blocked: ${checks.reason}`);
      return {
        allowed: false,
        reason: checks.reason,
        suggestions: checks.suggestions,
        currentStats: this.getCurrentStats()
      };
    }

    return {
      allowed: true,
      currentStats: this.getCurrentStats()
    };
  }

  /**
   * Registra una nuova room attiva
   */
  registerRoom(roomId, teacherId, roomData = {}) {
    try {
      const roomInfo = {
        id: roomId,
        teacherId,
        createdAt: Date.now(),
        lastActivity: Date.now(),
        studentsCount: 0,
        status: 'waiting', // waiting, active, finished
        quizData: roomData.quizData || null,
        ...roomData
      };

      this.activeRooms.set(roomId, roomInfo);

      // Aggiorna contatore insegnante
      const currentCount = this.teacherRoomCount.get(teacherId) || 0;
      this.teacherRoomCount.set(teacherId, currentCount + 1);

      console.log(`✅ Room ${roomId} registrata per teacher ${teacherId}. Totale room: ${this.activeRooms.size}`);

      // Controlla se siamo vicini ai limiti
      this.checkThresholds();

      return true;
    } catch (error) {
      console.error('❌ Errore registrazione room:', error);
      return false;
    }
  }

  /**
   * Rimuove una room dal sistema
   */
  unregisterRoom(roomId) {
    try {
      const roomInfo = this.activeRooms.get(roomId);
      if (!roomInfo) {
        return false;
      }

      // Aggiorna contatore insegnante
      const currentCount = this.teacherRoomCount.get(roomInfo.teacherId) || 0;
      if (currentCount > 0) {
        this.teacherRoomCount.set(roomInfo.teacherId, currentCount - 1);
      }

      this.activeRooms.delete(roomId);
      console.log(`🗑️ Room ${roomId} rimossa. Totale room: ${this.activeRooms.size}`);

      return true;
    } catch (error) {
      console.error('❌ Errore rimozione room:', error);
      return false;
    }
  }

  /**
   * Aggiorna l'attività di una room
   */
  updateRoomActivity(roomId, data = {}) {
    const roomInfo = this.activeRooms.get(roomId);
    if (!roomInfo) {
      return false;
    }

    roomInfo.lastActivity = Date.now();

    if (data.studentsCount !== undefined) {
      roomInfo.studentsCount = data.studentsCount;
    }

    if (data.status) {
      roomInfo.status = data.status;
    }

    this.activeRooms.set(roomId, roomInfo);
    return true;
  }

  /**
   * Esegue controlli di sicurezza per la creazione room
   */
  performSecurityChecks(teacherId) {
    // 1. Controllo limite globale room
    if (this.activeRooms.size >= LIMITS_CONFIG.MAX_ACTIVE_ROOMS) {
      return {
        allowed: false,
        reason: `Limite massimo di ${LIMITS_CONFIG.MAX_ACTIVE_ROOMS} quiz raggiunto`,
        suggestions: [
          'Attendi che altri quiz terminino',
          'Riprova tra 10-15 minuti',
          'Contatta l\'amministratore per aumentare la capacità'
        ]
      };
    }

    // 2. Controllo limite per insegnante
    const teacherRoomCount = this.teacherRoomCount.get(teacherId) || 0;
    if (teacherRoomCount >= LIMITS_CONFIG.MAX_ROOMS_PER_TEACHER) {
      return {
        allowed: false,
        reason: `Limite di ${LIMITS_CONFIG.MAX_ROOMS_PER_TEACHER} quiz per insegnante raggiunto`,
        suggestions: [
          'Termina alcuni quiz attivi',
          'Attendi il completamento di quiz in corso',
          'Usa un altro account insegnante se disponibile'
        ]
      };
    }

    // 3. Controllo memoria stimata
    const estimatedMemoryMB = this.activeRooms.size * LIMITS_CONFIG.MEMORY_PER_ROOM_MB;
    if (estimatedMemoryMB >= LIMITS_CONFIG.MAX_MEMORY_MB) {
      return {
        allowed: false,
        reason: 'Limite di memoria del server raggiunto',
        suggestions: [
          'Il sistema sta processando troppi quiz',
          'Attendi 5-10 minuti per la liberazione di risorse',
          'Riprova più tardi'
        ]
      };
    }

    // 4. Controllo soglia di warning
    const usagePercent = this.activeRooms.size / LIMITS_CONFIG.MAX_ACTIVE_ROOMS;
    if (usagePercent >= LIMITS_CONFIG.WARNING_THRESHOLD) {
      console.log(`⚠️ WARNING: Sistema al ${Math.round(usagePercent * 100)}% di capacità`);
    }

    return { allowed: true };
  }

  /**
   * Controlla le soglie e emette warning
   */
  checkThresholds() {
    const stats = this.getCurrentStats();

    // Warning per utilizzo globale
    if (stats.usagePercent >= LIMITS_CONFIG.WARNING_THRESHOLD) {
      console.log(`🚨 ALERT: Sistema al ${Math.round(stats.usagePercent * 100)}% di capacità!`);
      console.log(`📊 Room attive: ${stats.activeRooms}/${LIMITS_CONFIG.MAX_ACTIVE_ROOMS}`);

      // Avvia pulizia preventiva
      this.cleanupInactiveRooms();
    }
  }

  /**
   * Pulizia automatica room inattive
   */
  cleanupInactiveRooms() {
    const now = Date.now();
    let cleanedCount = 0;

    for (const [roomId, roomInfo] of this.activeRooms.entries()) {
      const inactiveDuration = now - roomInfo.lastActivity;

      // Rimuovi room inattive oltre il timeout
      if (inactiveDuration > LIMITS_CONFIG.ROOM_TIMEOUT_MS) {
        console.log(`🧹 Pulizia room inattiva: ${roomId} (inattiva da ${Math.round(inactiveDuration / 60000)}min)`);
        this.unregisterRoom(roomId);
        cleanedCount++;
      }
    }

    if (cleanedCount > 0) {
      console.log(`✨ Cleanup completato: ${cleanedCount} room rimosse`);
    }

    this.lastCleanup = now;
  }

  /**
   * Avvia il cleanup automatico periodico
   */
  startCleanupInterval() {
    setInterval(() => {
      this.cleanupInactiveRooms();
    }, LIMITS_CONFIG.CLEANUP_INTERVAL_MS);

    console.log(`🔄 Cleanup automatico avviato (ogni ${LIMITS_CONFIG.CLEANUP_INTERVAL_MS / 60000}min)`);
  }

  /**
   * Ottieni statistiche correnti del sistema
   */
  getCurrentStats() {
    const activeRooms = this.activeRooms.size;
    const usagePercent = activeRooms / LIMITS_CONFIG.MAX_ACTIVE_ROOMS;
    const estimatedMemoryMB = activeRooms * LIMITS_CONFIG.MEMORY_PER_ROOM_MB;

    // Statistiche per insegnante
    const teacherStats = {};
    for (const [teacherId, count] of this.teacherRoomCount.entries()) {
      if (count > 0) {
        teacherStats[teacherId] = {
          activeRooms: count,
          canCreateMore: count < LIMITS_CONFIG.MAX_ROOMS_PER_TEACHER
        };
      }
    }

    // Conteggio studenti totali
    let totalStudents = 0;
    for (const roomInfo of this.activeRooms.values()) {
      totalStudents += roomInfo.studentsCount || 0;
    }

    return {
      activeRooms,
      maxRooms: LIMITS_CONFIG.MAX_ACTIVE_ROOMS,
      usagePercent,
      estimatedMemoryMB,
      maxMemoryMB: LIMITS_CONFIG.MAX_MEMORY_MB,
      totalStudents,
      teacherStats,
      warningThreshold: LIMITS_CONFIG.WARNING_THRESHOLD,
      isNearLimit: usagePercent >= LIMITS_CONFIG.WARNING_THRESHOLD
    };
  }

  /**
   * Ottieni informazioni dettagliate su una room
   */
  getRoomInfo(roomId) {
    return this.activeRooms.get(roomId) || null;
  }

  /**
   * Ottieni tutte le room di un insegnante
   */
  getTeacherRooms(teacherId) {
    const rooms = [];
    for (const roomInfo of this.activeRooms.values()) {
      if (roomInfo.teacherId === teacherId) {
        rooms.push(roomInfo);
      }
    }
    return rooms;
  }

  /**
   * Forza la pulizia di tutte le room di un insegnante
   */
  cleanupTeacherRooms(teacherId) {
    let cleanedCount = 0;
    for (const [roomId, roomInfo] of this.activeRooms.entries()) {
      if (roomInfo.teacherId === teacherId) {
        this.unregisterRoom(roomId);
        cleanedCount++;
      }
    }

    console.log(`🧹 Cleanup forzato per teacher ${teacherId}: ${cleanedCount} room rimosse`);
    return cleanedCount;
  }
}

// Export singleton instance
const roomLimiter = new RoomLimiter();

export default roomLimiter;
export { LIMITS_CONFIG };