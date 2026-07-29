'use client';

import { useState, useEffect } from 'react';
import { 
  CreditCard, 
  ArrowRightLeft, 
  Plus, 
  Wallet, 
  LayoutDashboard, 
  Settings, 
  Bell,
  Search,
  Moon,
  Sun,
  LogOut,
  Building2,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import styles from './page.module.css';

interface Cuenta {
  id: number;
  numeroCuenta: string;
  titular: string;
  saldo: number;
}

export default function Home() {
  const [cuentas, setCuentas] = useState<Cuenta[]>([]);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'crear' | 'deposito' | 'retiro'>('crear');
  const [selectedCuentaId, setSelectedCuentaId] = useState<number | null>(null);

  // Form states
  const [numeroCuenta, setNumeroCuenta] = useState('');
  const [titular, setTitular] = useState('');
  const [monto, setMonto] = useState('');
  
  const API_URL = 'http://localhost:5156/api/cuentas';

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const fetchCuentas = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setCuentas(data);
    } catch (error) {
      console.error('Error fetching cuentas:', error);
    }
  };

  useEffect(() => {
    fetchCuentas();
  }, []);

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  const handleCrear = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ numeroCuenta, titular })
    });
    setNumeroCuenta('');
    setTitular('');
    setShowModal(false);
    fetchCuentas();
  };

  const handleTransaccion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCuentaId) return;
    
    const url = `${API_URL}/${selectedCuentaId}/${modalType}`;
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Number(monto))
    });
    setMonto('');
    setShowModal(false);
    fetchCuentas();
  };

  const openModal = (type: 'crear' | 'deposito' | 'retiro', cuentaId?: number) => {
    setModalType(type);
    if (cuentaId) setSelectedCuentaId(cuentaId);
    setShowModal(true);
  };

  return (
    <div className={styles.layout}>
      {/* Sidebar Navigation */}
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <Building2 size={28} />
          <span>CoreBank</span>
        </div>
        
        <nav className={styles.nav}>
          <div className={`${styles.navItem} ${styles.active}`}>
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </div>
          <div className={styles.navItem}>
            <CreditCard size={20} />
            <span>Cuentas</span>
          </div>
          <div className={styles.navItem}>
            <ArrowRightLeft size={20} />
            <span>Transferencias</span>
          </div>
          <div className={styles.navItem}>
            <Settings size={20} />
            <span>Configuración</span>
          </div>
        </nav>

        <div className={styles.navItem} style={{ marginTop: 'auto' }}>
          <LogOut size={20} />
          <span>Cerrar Sesión</span>
        </div>
      </aside>

      {/* Main Content */}
      <main className={styles.main}>
        {/* Topbar */}
        <header className={styles.topbar}>
          <div className={styles.searchBar}>
            <Search size={18} color="var(--text-secondary)" />
            <input type="text" placeholder="Buscar cuentas, titulares..." />
          </div>

          <div className={styles.userActions}>
            <button className={styles.iconBtn} onClick={toggleTheme}>
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button className={styles.iconBtn}>
              <Bell size={20} />
            </button>
            <div className={styles.avatar}>AL</div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className={styles.content}>
          <div className={styles.header}>
            <div>
              <h1 className="animate-fade-in-up">Resumen de Cuentas</h1>
              <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }} className="animate-fade-in-up">
                Gestiona tus activos y realiza operaciones al instante.
              </p>
            </div>
            <button className="btn btn-primary animate-fade-in-up" onClick={() => openModal('crear')}>
              <Plus size={20} />
              Nueva Cuenta
            </button>
          </div>

          <div className={styles.grid}>
            {cuentas.map((cuenta, index) => (
              <div 
                key={cuenta.id} 
                className={`glass-panel ${styles.card} animate-fade-in-up`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={styles.cardDecoration}></div>
                
                <div className={styles.cardHeader}>
                  <div>
                    <div className={styles.cardTitle}>{cuenta.titular}</div>
                    <div className={styles.cardNumber}>{cuenta.numeroCuenta}</div>
                  </div>
                  <div className={styles.cardIcon}>
                    <Wallet size={24} />
                  </div>
                </div>

                <div className={styles.balanceLabel}>Saldo Disponible</div>
                <div className={styles.balance}>
                  ${cuenta.saldo.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                </div>

                <div className={styles.actions}>
                  <button className="btn btn-success" onClick={() => openModal('deposito', cuenta.id)}>
                    <TrendingUp size={16} /> Depositar
                  </button>
                  <button className="btn btn-danger" onClick={() => openModal('retiro', cuenta.id)}>
                    <TrendingDown size={16} /> Retirar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={`glass-panel ${styles.modalContent}`}>
            <div className={styles.modalHeader}>
              <h3>
                {modalType === 'crear' ? 'Abrir Nueva Cuenta' : modalType === 'deposito' ? 'Realizar Depósito' : 'Realizar Retiro'}
              </h3>
              <button className={styles.closeButton} onClick={() => setShowModal(false)}>
                ✕
              </button>
            </div>
            
            <form onSubmit={modalType === 'crear' ? handleCrear : handleTransaccion}>
              {modalType === 'crear' ? (
                <>
                  <input className="glass-input" placeholder="Número de Cuenta (ej. AR-123)" value={numeroCuenta} onChange={e => setNumeroCuenta(e.target.value)} required />
                  <input className="glass-input" placeholder="Nombre del Titular" value={titular} onChange={e => setTitular(e.target.value)} required />
                </>
              ) : (
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '16px', top: '14px', color: 'var(--text-secondary)' }}>$</span>
                  <input className="glass-input" style={{ paddingLeft: '32px' }} type="number" step="0.01" placeholder="Monto a operar" value={monto} onChange={e => setMonto(e.target.value)} required />
                </div>
              )}
              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '16px' }}>
                Confirmar Operación
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
