const Navbar = ({ activeTab, setActiveTab, searchTerm, setSearchTerm }) => {
    return (
        <div className="container mt-4">
            {/* cabeçalho */}
            <div className="d-flex align-items-center mb-4">
                <div
                    className="bg-dark text-white rounded p-2 me-3 d-flex align-items-center justify-content-center"
                    style={{ width: '48px', height: '48px' }}>
                    <i style={{ fontSize: '25px' }} class="bi bi-journals"></i>
                </div>
                <div>
                    <h3 className="mb-0 fw-bold" style={{ color: '#0f172a' }}>
                        Aulas Particulares
                    </h3>
                    <small className="text-secondary">Sistema de agendamento de aulas</small>
                </div>
            </div>
            {/* Container das Abas e Barra de Busca */}
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center border-bottom pb-3 mb-4 gap-3">
                {/* Abas */}
                <ul className="nav nav-pills gap-2 mb-0">
                    <li className="nav-item">
                        <button
                            onClick={() => setActiveTab('agendamentos')}
                            className={`nav-link fw-semibold rounded-3 d-flex align-items-center px-4 ${activeTab === 'agendamentos' ? 'active bg-dark text-white' : 'text-secondary bg-transparent border-0'}`}>
                            <i className="bi bi-calendar-event me-2"></i> Agendamentos
                        </button>
                    </li>
                    <li className="nav-item">
                        <button
                            onClick={() => setActiveTab('tipos-aula')}
                            className={`nav-link fw-semibold rounded-3 d-flex align-items-center px-4 ${activeTab === 'tipos-aula' ? 'active bg-dark text-white' : 'text-secondary bg-transparent border-0'}`}>
                            <i className="bi bi-book me-2"></i> Tipos de Aula
                        </button>
                    </li>
                </ul>

                {/* Input de Busca */}
                <div className="position-relative" style={{ maxWidth: '350px', width: '100%' }}>
                    <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-secondary"></i>
                    <input
                        type="text"
                        className="form-control bg-light border-0 py-2 ps-5 pe-3 rounded-pill"
                        placeholder={`Buscar em ${activeTab === 'agendamentos' ? 'agendamentos' : 'tipos de aula'}...`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)} // Atualiza o estado lá no App.js
                    />
                </div>
            </div>
        </div>
    );
};

export default Navbar;
