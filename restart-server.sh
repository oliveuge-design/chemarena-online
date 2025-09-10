#!/bin/bash

echo ""
echo "==============================================="
echo "        RIAVVIO SERVER RAHOOT SOCKET"
echo "==============================================="
echo ""

echo "Terminando eventuali processi server esistenti..."
pkill -f "node.*socket/index.js" 2>/dev/null || true

echo "Attendo 2 secondi..."
sleep 2

echo ""
echo "Riavviando il server socket..."
echo "==============================================="

cd "$(dirname "$0")"

# Avvia il server in background
npm run socket &
SERVER_PID=$!

echo "Server avviato con PID: $SERVER_PID"
echo ""
echo "Per fermare il server, usa: kill $SERVER_PID"
echo "Oppure premi Ctrl+C se stai usando npm run rahoot"
echo ""
echo "Riavvio completato!"