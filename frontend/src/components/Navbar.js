import React from 'react';

const Navbar = ({ activeTab, setActiveTab }) => {
  return (
    <div className="container mt-4">
      {/* cabeçalho */}
      <div className="d-flex align-items-center mb-4">
        <div className="bg-dark text-white rounded p-2 me-3 d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px' }}>
          <i className="bi bi-calendar3 fs-4"></i>
        </div>
        <div>
          <h3 className="mb-0 fw-bold" style={{ color: '#0f172a' }}>Aulas Particulares</h3>
          <small className="text-secondary">Sistema de agendamento de aulas</small>
        </div>
      </div>

      {/* navegação */}
      <ul className="nav nav-pills mb-4 border-bottom pb-3 gap-2">
        <li className="nav-item">
          <button 
            onClick={() => setActiveTab('agendamentos')}
            className={`nav-link fw-semibold rounded-3 d-flex align-items-center px-4 ${activeTab === 'agendamentos' ? 'active bg-dark text-white' : 'text-secondary bg-transparent border-0'}`}
          >
            <i className="bi bi-calendar-event me-2"></i> Agendamentos
          </button>
        </li>
        <li className="nav-item">
          <button 
            onClick={() => setActiveTab('tipos-aula')}
            className={`nav-link fw-semibold rounded-3 d-flex align-items-center px-4 ${activeTab === 'tipos-aula' ? 'active bg-dark text-white' : 'text-secondary bg-transparent border-0'}`}
          >
            <i className="bi bi-book me-2"></i> Tipos de Aula
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Navbar;