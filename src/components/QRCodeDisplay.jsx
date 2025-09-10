import { useEffect, useRef, useState } from 'react'
import QRCode from 'qrcode'

export default function QRCodeDisplay({ inviteCode, gameUrl }) {
  const canvasRef = useRef(null)
  const [qrUrl, setQrUrl] = useState('')
  
  useEffect(() => {
    if (inviteCode && canvasRef.current) {
      // Genera l'URL completo per il gioco con il PIN
      const fullUrl = `${gameUrl}?pin=${inviteCode}`
      setQrUrl(fullUrl)
      
      // Genera il QR code
      QRCode.toCanvas(canvasRef.current, fullUrl, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      }, (error) => {
        if (error) console.error('Errore generazione QR code:', error)
      })
    }
  }, [inviteCode, gameUrl])

  if (!inviteCode) return null

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 text-center">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        📱 Scansiona con lo Smartphone
      </h3>
      
      <div className="flex justify-center mb-4">
        <canvas 
          ref={canvasRef}
          className="border-2 border-gray-200 rounded-lg"
        />
      </div>
      
      <div className="space-y-2">
        <p className="text-sm text-gray-600">
          Scansiona il QR code per accedere al gioco
        </p>
        <div className="bg-gray-50 rounded-md p-3">
          <p className="text-xs text-gray-500 mb-1">PIN della stanza:</p>
          <p className="text-2xl font-bold text-blue-600">{inviteCode}</p>
        </div>
        <div className="bg-blue-50 rounded-md p-2">
          <p className="text-xs text-blue-600 break-all">{qrUrl}</p>
        </div>
      </div>
      
      <div className="mt-4 text-xs text-gray-500">
        <p>💡 Gli studenti possono anche inserire manualmente il PIN</p>
        <p>su <strong>{gameUrl}</strong></p>
      </div>
    </div>
  )
}