import { createBackup, restoreFromBackup, listBackups } from '../../utils/quizValidator.js';

export default function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const { action } = req.query;

        if (action === 'list') {
          // Lista tutti i backup disponibili
          const result = listBackups();
          if (result.success) {
            return res.status(200).json({
              message: 'Lista backup recuperata',
              backups: result.backups
            });
          } else {
            return res.status(500).json({
              error: 'Errore nel recuperare la lista backup',
              details: result.error
            });
          }
        }

        // Default: crea nuovo backup
        const backup = createBackup();
        if (backup.success) {
          return res.status(200).json({
            message: 'Backup creato con successo',
            backupName: backup.backupName,
            backupPath: backup.backupPath
          });
        } else {
          return res.status(500).json({
            error: 'Errore nella creazione del backup',
            details: backup.error
          });
        }
      } catch (error) {
        console.error('❌ Errore API backup:', error);
        return res.status(500).json({ error: 'Errore del server' });
      }

    case 'POST':
      try {
        const { action } = req.body;

        if (action === 'restore') {
          // Ripristina da backup più recente
          const restore = restoreFromBackup();
          if (restore.success) {
            return res.status(200).json({
              message: 'Ripristino completato con successo',
              restoredFrom: restore.restoredFrom
            });
          } else {
            return res.status(500).json({
              error: 'Errore nel ripristino',
              details: restore.error,
              validationErrors: restore.validationErrors
            });
          }
        }

        if (action === 'create') {
          // Crea backup manuale
          const backup = createBackup();
          if (backup.success) {
            return res.status(201).json({
              message: 'Backup manuale creato',
              backupName: backup.backupName,
              backupPath: backup.backupPath
            });
          } else {
            return res.status(500).json({
              error: 'Errore nella creazione del backup',
              details: backup.error
            });
          }
        }

        return res.status(400).json({
          error: 'Azione non riconosciuta',
          supportedActions: ['restore', 'create']
        });
      } catch (error) {
        console.error('❌ Errore API backup POST:', error);
        return res.status(500).json({ error: 'Errore del server' });
      }

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).json({ error: `Metodo ${method} non supportato` });
  }
}