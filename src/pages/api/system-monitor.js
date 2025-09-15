/**
 * API SYSTEM MONITOR
 * Endpoint per monitorare il sistema multi-room
 */

export default function handler(req, res) {
  const { method, query } = req;

  // Per ora restituiamo mock data - sarà connesso al socket nel prossimo step
  // Questo permette di testare l'implementazione senza rompere il sistema esistente

  switch (method) {
    case 'GET':
      if (query.action === 'stats') {
        // Statistiche sistema
        return res.status(200).json({
          message: 'Sistema multi-room implementato',
          stats: {
            activeRooms: 0,
            maxRooms: 50,
            usagePercent: 0,
            totalStudents: 0,
            estimatedMemoryMB: 0,
            maxMemoryMB: 200,
            isNearLimit: false,
            warningThreshold: 0.8
          },
          features: [
            '✅ Limite 50 quiz contemporanei',
            '✅ Max 5 quiz per insegnante',
            '✅ Max 100 studenti per quiz',
            '✅ Cleanup automatico room inattive',
            '✅ Sistema di warning preventivi',
            '✅ Isolamento completo tra room'
          ]
        });
      }

      if (query.action === 'health') {
        // Health check sistema
        return res.status(200).json({
          healthy: true,
          activeRooms: 0,
          totalPlayers: 0,
          memoryUsage: '0/200 MB',
          warnings: [],
          limits: {
            maxRooms: 50,
            maxRoomsPerTeacher: 5,
            maxStudentsPerRoom: 100,
            roomTimeoutMinutes: 30
          }
        });
      }

      if (query.action === 'rooms') {
        // Lista room attive (demo)
        return res.status(200).json({
          rooms: [],
          message: 'Nessuna room attiva al momento'
        });
      }

      // Default: info generali
      return res.status(200).json({
        systemName: 'ChemArena Multi-Room System',
        version: '2.0.0',
        status: 'Active',
        features: {
          multiRoom: true,
          roomLimiter: true,
          autoCleanup: true,
          realTimeMonitoring: true
        },
        endpoints: {
          '/api/system-monitor?action=stats': 'Statistiche sistema',
          '/api/system-monitor?action=health': 'Health check',
          '/api/system-monitor?action=rooms': 'Lista room attive'
        }
      });

    case 'POST':
      // Azioni amministrative
      const { action, data } = req.body;

      if (action === 'cleanup') {
        // Trigger cleanup manuale
        return res.status(200).json({
          message: 'Cleanup manuale eseguito',
          roomsRemoved: 0,
          memoryFreed: '0 MB'
        });
      }

      if (action === 'resetLimits') {
        // Reset contatori (per emergenze)
        return res.status(200).json({
          message: 'Limiti resettati',
          newLimits: {
            activeRooms: 0,
            teacherCounts: {}
          }
        });
      }

      return res.status(400).json({
        error: 'Azione non riconosciuta',
        availableActions: ['cleanup', 'resetLimits']
      });

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).json({
        error: `Metodo ${method} non supportato`
      });
  }
}