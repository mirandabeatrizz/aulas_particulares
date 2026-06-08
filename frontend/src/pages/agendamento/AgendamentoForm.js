import React from 'react';

const AgendamentoForm = ({ onClose }) => {
  return (
    <form>
      {/* infos de Aluno e Professor */}
      <div className="row g-3 mb-3">
        <div className="col-12 col-md-6">
          <label className="form-label text-secondary small mb-1 d-flex align-items-center">
            <i className="bi bi-person me-2"></i> Nome do Aluno
          </label>
          <input 
            type="text" 
            className="form-control bg-light border-0 py-2" 
            placeholder="Ex: Ana Souza" 
          />
        </div>
        <div className="col-12 col-md-6">
          <label className="form-label text-secondary small mb-1 d-flex align-items-center">
            <i className="bi bi-mortarboard me-2"></i> Nome do Professor
          </label>
          <input 
            type="text" 
            className="form-control bg-light border-0 py-2" 
            placeholder="Ex: Carlos Lima" 
          />
        </div>
      </div>

      {/* tipo de aula e data */}
      <div className="row g-3 mb-3">
        <div className="col-12 col-md-6">
          <label className="form-label text-secondary small mb-1">Tipo de Aula</label>
          <select className="form-select bg-light border-0 py-2 text-secondary">
            <option value="">Selecionar...</option>
            <option value="matematica">Matemática</option>
            <option value="programacao">Programação</option>
          </select>
        </div>
        <div className="col-12 col-md-6">
          <label className="form-label text-secondary small mb-1">Data</label>
          <input 
            type="date" 
            className="form-control bg-light border-0 py-2 text-secondary" 
          />
        </div>
      </div>

      {/* horário de início e término */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-md-6">
          <label className="form-label text-secondary small mb-1">Horário de Início</label>
          <input 
            type="time" 
            className="form-control bg-light border-0 py-2 text-secondary" 
          />
        </div>
        <div className="col-12 col-md-6">
          <label className="form-label text-secondary small mb-1">Horário de Término</label>
          <input 
            type="time" 
            className="form-control bg-light border-0 py-2 text-secondary" 
          />
        </div>
      </div>

      {/* botões */}
      <div className="d-flex justify-content-end gap-3 mt-2">
        <button 
          type="button" 
          className="btn btn-white border px-4 fw-medium" 
          onClick={onClose}
        >
          Cancelar
        </button>
        <button 
          type="button" 
          className="btn btn-dark px-4 fw-medium"
        >
          Agendar
        </button>
      </div>
    </form>
  );
};

export default AgendamentoForm;