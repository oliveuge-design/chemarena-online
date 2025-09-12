import { useState, useEffect } from 'react'
import Button from '@/components/Button'
import toast from 'react-hot-toast'

export default function TeachersList() {
  const [teachers, setTeachers] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // all, active, inactive

  useEffect(() => {
    loadTeachers()
  }, [])

  const loadTeachers = async () => {
    try {
      const response = await fetch('/api/teachers-list')
      const data = await response.json()
      
      if (data.success) {
        setTeachers(data.teachers)
      } else {
        throw new Error(data.error || 'Errore nel caricamento')
      }
    } catch (error) {
      console.error('Errore caricamento insegnanti:', error)
      toast.error('Errore nel caricamento della lista insegnanti')
    } finally {
      setLoading(false)
    }
  }

  const handleToggleStatus = async (teacherId) => {
    try {
      const response = await fetch('/api/teachers-toggle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ teacherId })
      })
      
      const data = await response.json()
      
      if (data.success) {
        loadTeachers() // Ricarica la lista
        toast.success(
          data.teacher.active 
            ? `${data.teacher.name} è stato riattivato` 
            : `${data.teacher.name} è stato disattivato`
        )
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      console.error('Errore cambio stato:', error)
      toast.error('Errore nel cambio di stato')
    }
  }

  const handleDelete = async (teacherId, teacherName) => {
    const confirmDelete = confirm(
      `⚠️ ATTENZIONE!\n\nSei sicuro di voler eliminare definitivamente l'insegnante:\n"${teacherName}"?\n\nQuesta azione NON può essere annullata.`
    )

    if (confirmDelete) {
      try {
        const response = await fetch('/api/teachers-delete', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ teacherId })
        })
        
        const data = await response.json()
        
        if (data.success) {
          loadTeachers() // Ricarica la lista
          toast.success(`Insegnante "${teacherName}" eliminato definitivamente`)
        } else {
          throw new Error(data.error)
        }
      } catch (error) {
        console.error('Errore eliminazione:', error)
        toast.error('Errore nell\'eliminazione dell\'insegnante')
      }
    }
  }

  const filteredTeachers = teachers.filter(teacher => {
    if (filter === 'active') return teacher.active
    if (filter === 'inactive') return !teacher.active
    return true
  })

  const formatDate = (dateString) => {
    if (!dateString) return 'Mai'
    return new Date(dateString).toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getRoleIcon = (role) => {
    return role === 'admin' ? '👑' : '👨‍🏫'
  }

  const getStatusBadge = (active) => {
    return active 
      ? <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">✅ Attivo</span>
      : <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">❌ Disattivato</span>
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Caricamento insegnanti...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header con filtri */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            👥 Gestione Insegnanti Registrati
          </h2>
          <p className="text-gray-600">
            Totale: {teachers.length} insegnanti • Attivi: {teachers.filter(t => t.active).length}
          </p>
        </div>
        
        <div className="flex space-x-2">
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">🔍 Tutti gli insegnanti</option>
            <option value="active">✅ Solo attivi</option>
            <option value="inactive">❌ Solo disattivati</option>
          </select>
          
          <Button
            onClick={loadTeachers}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2"
          >
            🔄 Ricarica
          </Button>
        </div>
      </div>

      {/* Lista insegnanti */}
      {filteredTeachers.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-lg">
            {filter === 'all' 
              ? '📝 Nessun insegnante registrato'
              : `🔍 Nessun insegnante ${filter === 'active' ? 'attivo' : 'disattivato'} trovato`
            }
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Insegnante
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contatto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Info Account
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ultimo Accesso
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Azioni
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTeachers.map((teacher) => (
                  <tr key={teacher.id} className={!teacher.active ? 'bg-red-50' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-2xl mr-3">
                          {getRoleIcon(teacher.role)}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {teacher.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {teacher.subject}
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {teacher.email}
                      </div>
                      <div className="text-xs text-gray-500">
                        ID: {teacher.id}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        {getStatusBadge(teacher.active)}
                        <div className="text-xs text-gray-500">
                          Registrato: {formatDate(teacher.createdAt)}
                        </div>
                        {teacher.role === 'admin' && (
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                            👑 Amministratore
                          </span>
                        )}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(teacher.lastLogin)}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-y-2">
                      {teacher.role !== 'admin' && (
                        <>
                          <div>
                            <Button
                              onClick={() => handleToggleStatus(teacher.id)}
                              className={`w-full text-xs px-3 py-1 ${
                                teacher.active 
                                  ? 'bg-orange-500 hover:bg-orange-600' 
                                  : 'bg-green-500 hover:bg-green-600'
                              } text-white`}
                            >
                              {teacher.active ? '⏸️ Disattiva' : '▶️ Riattiva'}
                            </Button>
                          </div>
                          <div>
                            <Button
                              onClick={() => handleDelete(teacher.id, teacher.name)}
                              className="w-full bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1"
                            >
                              🗑️ Elimina
                            </Button>
                          </div>
                        </>
                      )}
                      {teacher.role === 'admin' && (
                        <div className="text-xs text-gray-500 text-center">
                          🔒 Protetto
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Info footer */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-800 mb-2">ℹ️ Informazioni</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Gli insegnanti si registrano autonomamente tramite la pagina /register</li>
          <li>• Puoi disattivare temporaneamente un account senza eliminarlo</li>
          <li>• Gli account amministratore (👑) non possono essere modificati o eliminati</li>
          <li>• L'eliminazione di un insegnante è permanente e non reversibile</li>
        </ul>
      </div>
    </div>
  )
}