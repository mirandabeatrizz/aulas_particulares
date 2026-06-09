import React, { useEffect, useState } from 'react';
import { useAlert } from '../../components/Alert';
import { ConfigRequest } from '../../config/configRequest';

const AgendamentoForm = ({ id, onClose, onSuccess }) => {

  const { showAlert } = useAlert();
  const [values, setValues] = useState({ id: '', aluno: '', professor: '', tipo_aula_id: '', horario_fim: '', horario_inicio: '', data: '' })
  const [tiposList, setTiposList] = useState([])

  useEffect(() => {
    if (tiposList.length === 0) getTipoAulas()

  }, [])

  useEffect(() => {
    if (id) RequestAgendamento('GET', null, id)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (id) {
      await RequestAgendamento('PUT', values, id)
    } else {
      await RequestAgendamento('POST', values, null)
    }
  };


  async function RequestAgendamento(tipo_req, values, id) {
    console.log("------------- requests agendamento", id)
    return await ConfigRequest(tipo_req, 'agendamento', id, values)
      .then((response) => {
        if (response.data) {
          console.log(response.data)
          setValues(response.data)
          if (tipo_req !== 'GET') {
            if (onSuccess) onSuccess(response.data, tipo_req);
            showAlert('success', 'Registro salvo com sucesso!');
            onClose();
          }
        }
      })
      .catch((error) => {
        showAlert('error', 'Verifique e tente novamente!');
      });
  }
  async function getTipoAulas() {

    await ConfigRequest('GET', 'tipo_aula', null, null)
      .then((response) => {
        console.log(response)
        setTiposList(response.data)
      })
      .catch((error) => {
        console.log(error)
        showAlert('error', 'Ocorreu um erro ao buscar lista de agendamentos!');
      });

  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* infos de Aluno e Professor */}
      <div className="row g-3 mb-3">
        <div className="col-12 col-md-6">
          <label className="form-label text-secondary small mb-1 d-flex align-items-center">
            <i className="bi bi-person me-2"></i> Nome do Aluno
          </label>
          <input
            name='aluno'
            label='aluno'
            value={values.aluno}
            onChange={handleChange}
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
            name='professor'
            label='professor'
            value={values.professor}
            onChange={handleChange}
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
          <select
            name="tipo_aula_id"
            value={values.tipo_aula_id}
            onChange={handleChange}
            className="form-select bg-light border-0 py-2 text-secondary"
          >
            <option disabled value="">Selecionar...</option>
            {
              tiposList.map((tipo_aula) => (
                <option key={tipo_aula.id} value={tipo_aula.id}>
                  {tipo_aula.nome}
                </option>
              ))
            }
          </select>
        </div>
        <div className="col-12 col-md-6">
          <label className="form-label text-secondary small mb-1">Data</label>
          <input
            name='data'
            label='data'
            value={values.data}
            onChange={handleChange}
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
            name='horario_inicio'
            label='horario_inicio'
            value={values.horario_inicio}
            onChange={handleChange}
            type="time"
            className="form-control bg-light border-0 py-2 text-secondary"
          />
        </div>
        <div className="col-12 col-md-6">
          <label className="form-label text-secondary small mb-1">Horário de Término</label>
          <input
            name='horario_fim'
            label='horario_fim'
            value={values.horario_fim}
            onChange={handleChange}
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
          type="submit"
          className="btn btn-dark px-4 fw-medium"
        >
          Agendar
        </button>
      </div>
    </form>
  );
};

export default AgendamentoForm;