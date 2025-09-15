import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

const NavigationControls = () => {
  const router = useRouter();
  const [currentPath, setCurrentPath] = useState('');

  useEffect(() => {
    setCurrentPath(router.pathname || '');
  }, [router.pathname]);

  // Gestione sicura del player context
  let player = null;
  let dispatch = null;
  if (typeof window !== 'undefined') {
    try {
      const { usePlayerContext } = require('@/context/player');
      const context = usePlayerContext();
      player = context?.player;
      dispatch = context?.dispatch;
    } catch (error) {
      // Context non disponibile o errore, usa valori di default
    }
  }

  // Determina il contesto della pagina
  const getPageContext = () => {
    if (currentPath === '/') return 'homepage';
    if (currentPath === '/game') return 'student-game';
    if (currentPath === '/login') return 'auth';
    if (currentPath === '/register') return 'auth';
    if (currentPath === '/teacher-dashboard') return 'teacher';
    if (currentPath === '/dashboard') return 'admin';
    if (currentPath === '/manager') return 'manager';
    if (currentPath === '/privacy-policy') return 'static';
    return 'unknown';
  };

  // Logica per il pulsante "Indietro"
  const handleBack = () => {
    const context = getPageContext();

    switch (context) {
      case 'homepage':
        // Homepage è entry point, non può andare indietro
        break;

      case 'student-game':
        // Studenti: torna alla homepage e pulisce il contesto
        if (player && dispatch) {
          dispatch({ type: 'LOGOUT' });
        }
        // Pulizia storage studente
        if (typeof window !== 'undefined') {
          localStorage.removeItem('player-session');
          sessionStorage.clear();
        }
        router.push('/');
        break;

      case 'auth':
        // Da login/register torna alla homepage
        router.push('/');
        break;

      case 'teacher':
        // Da teacher-dashboard torna a login
        router.push('/login');
        break;

      case 'admin':
        // Da dashboard torna a login
        router.push('/login');
        break;

      case 'manager':
        // Da manager torna al dashboard appropriato
        if (typeof window !== 'undefined') {
          const authData = localStorage.getItem('teacher-auth');
          if (authData) {
            try {
              const teacher = JSON.parse(authData);
              router.push(teacher.role === 'admin' ? '/dashboard' : '/teacher-dashboard');
            } catch (error) {
              router.push('/login');
            }
          } else {
            router.push('/login');
          }
        } else {
          router.push('/login');
        }
        break;

      case 'static':
        // Da pagine statiche torna alla homepage
        router.push('/');
        break;

      default:
        // Fallback: browser back
        if (typeof window !== 'undefined') {
          window.history.back();
        }
    }
  };

  // Logica per il pulsante "Avanti"
  const handleForward = () => {
    const context = getPageContext();

    switch (context) {
      case 'homepage':
        // Da homepage va al login per teachers
        router.push('/login');
        break;

      case 'auth':
        // Da auth non può andare avanti senza autenticazione
        break;

      case 'teacher':
        // Da teacher-dashboard può andare al manager
        router.push('/manager');
        break;

      case 'admin':
        // Da admin dashboard può andare al manager
        router.push('/manager');
        break;

      case 'login':
        // Da login può andare a register
        router.push('/register');
        break;

      default:
        // Per altri casi usa forward del browser
        if (typeof window !== 'undefined') {
          window.history.forward();
        }
        break;
    }
  };

  // Pulsante "Esci dal Quiz" per studenti
  const handleExitQuiz = () => {
    // Pulizia completa del dispositivo studente
    if (player && dispatch) {
      dispatch({ type: 'LOGOUT' });
    }

    if (typeof window !== 'undefined') {
      // Pulizia localStorage e sessionStorage
      localStorage.removeItem('player-session');
      localStorage.removeItem('game-state');
      localStorage.removeItem('quiz-progress');
      sessionStorage.clear();

      // Disconnetti socket se necessario
      if (window.socket) {
        window.socket.disconnect();
      }
    }

    // Torna alla homepage con reload per pulizia completa
    router.push('/').then(() => {
      if (typeof window !== 'undefined') {
        window.location.reload();
      }
    });
  };

  // Determina quale set di controlli mostrare
  const renderControls = () => {
    const context = getPageContext();

    if (context === 'student-game') {
      // Controlli per studenti nel gioco
      return (
        <>
          <button
            onClick={handleBack}
            className="nav-btn nav-btn-back"
            title="Torna alla homepage"
          >
            <span className="nav-icon">◀</span>
            <span className="nav-text">Indietro</span>
          </button>

          <button
            onClick={handleExitQuiz}
            className="nav-btn nav-btn-exit"
            title="Esci dal quiz e pulisci dispositivo"
          >
            <span className="nav-icon">✖</span>
            <span className="nav-text">Esci Quiz</span>
          </button>
        </>
      );
    }

    // Controlli standard per altre pagine
    const canGoBack = context !== 'homepage';
    const canGoForward = ['homepage', 'teacher', 'admin', 'login'].includes(context);

    return (
      <>
        {canGoBack && (
          <button
            onClick={handleBack}
            className="nav-btn nav-btn-back"
            title="Pagina precedente"
          >
            <span className="nav-icon">◀</span>
            <span className="nav-text">Indietro</span>
          </button>
        )}

        {canGoForward && (
          <button
            onClick={handleForward}
            className="nav-btn nav-btn-forward"
            title="Pagina successiva"
          >
            <span className="nav-text">Avanti</span>
            <span className="nav-icon">▶</span>
          </button>
        )}
      </>
    );
  };

  const context = getPageContext();

  // Non mostrare controlli su pagine che non ne hanno bisogno
  if (['unknown'].includes(context)) {
    return null;
  }

  return (
    <div className="navigation-controls">
      {renderControls()}
    </div>
  );
};

export default NavigationControls;