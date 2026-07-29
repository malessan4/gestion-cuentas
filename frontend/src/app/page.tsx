'use client';

import { useState, useEffect } from 'react';
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
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>🏦 Core Bancario</h1>
        <div>
          <button className={styles.themeToggle} onClick={toggleTheme}>
            {theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
          <button className="btn-primary" style={{ marginLeft: '1rem' }} onClick={() => openModal('crear')}>
            + Nueva Cuenta
          </button>
        </div>
      </header>

      <main className={styles.grid}>
        {cuentas.map(cuenta => (
          <div key={cuenta.id} className="glass-panel card">
            <div>
              <div className={styles.cardTitle}>{cuenta.titular}</div>
              <div className={styles.cardNumber}>{cuenta.numeroCuenta}</div>
            </div>
            <div className={styles.balance}>
              ${cuenta.saldo.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
            </div>
            <div className={styles.actions}>
              <button className="btn-success" onClick={() => openModal('deposito', cuenta.id)}>
                Depositar
              </button>
              <button className="btn-danger" onClick={() => openModal('retiro', cuenta.id)}>
                Retirar
              </button>
            </div>
          </div>
        ))}
      </main>

      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={`glass-panel ${styles.modalContent}`}>
            <div className={styles.modalHeader}>
              <h3>
                {modalType === 'crear' ? 'Crear Cuenta' : modalType === 'deposito' ? 'Depositar' : 'Retirar'}
              </h3>
              <button className={styles.closeButton} onClick={() => setShowModal(false)}>&times;</button>
            </div>
            
            <form onSubmit={modalType === 'crear' ? handleCrear : handleTransaccion}>
              {modalType === 'crear' ? (
                <>
                  <input className="glass-input" placeholder="Número de Cuenta" value={numeroCuenta} onChange={e => setNumeroCuenta(e.target.value)} required />
                  <input className="glass-input" placeholder="Titular" value={titular} onChange={e => setTitular(e.target.value)} required />
                </>
              ) : (
                <input className="glass-input" type="number" step="0.01" placeholder="Monto" value={monto} onChange={e => setMonto(e.target.value)} required />
              )}
              <button type="submit" className="btn-primary" style={{ width: '100%' }}>Confirmar</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
