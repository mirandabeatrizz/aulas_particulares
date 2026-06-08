import React, { useEffect, useState } from 'react';
import AgendamentoForm from './AgendamentoForm';
import { ConfigRequest } from '../../config/configRequest';

const AgendamentoList = () => {

    // Estado para controlar a exibição do modal
    const [showModal, setShowModal] = useState(false);
    const [data, setData] = useState([])
    const [busca, setBusca] = useState(false)


    useEffect(() => {
        if (data.length == 0 && !busca) {
            getAgendamentos();
        }
    }, [])

    async function getAgendamentos() {

        await ConfigRequest('GET', 'agendamento', null, null)
            .then((response) => {
                setData(response.data)
                setBusca(true)
            })
            .catch((error) => {
                console.log(error)
            });

    }

    return (
        <div className="container">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="fw-bold d-flex align-items-center mb-0" style={{ color: '#0f172a' }}>
                    <i className="bi bi-calendar3 me-2"></i> Agendamentos
                </h4>
                <button className="btn btn-dark fw-semibold rounded-3 px-4 py-2" onClick={() => setShowModal(true)}>
                    + Novo Agendamento
                </button>
            </div>

            <div className="d-flex flex-column gap-3">
                {data.map((agend) => (
                    <div key={agend.id} className="card border rounded-4 shadow-sm">
                        <div className="card-body p-4">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <div className="d-flex align-items-center gap-3">
                                    <span
                                        className="badge rounded-pill px-3 py-2"
                                        style={{ backgroundColor: '#eff6ff', color: '#3b82f6', fontWeight: '500' }}
                                    >
                                        {agend.tipo_aula}
                                    </span>
                                    <span className="text-secondary small d-flex align-items-center">
                                        <i className="bi bi-calendar2-event me-2"></i> {agend.data}
                                    </span>
                                </div>
                                <div className="text-secondary fs-5">
                                    <i className="bi bi-pencil me-3" style={{ cursor: 'pointer' }}></i>
                                    <i className="bi bi-trash" style={{ cursor: 'pointer' }}></i>
                                </div>
                            </div>

                            <div className="row mb-3">
                                <div className="col-12 col-md-6 d-flex align-items-center text-secondary mb-2 mb-md-0">
                                    <i className="bi bi-person me-2 fs-5"></i>
                                    <span>Aluno: <strong className="text-dark fw-medium">{agend.aluno}</strong></span>
                                </div>
                                <div className="col-12 col-md-6 d-flex align-items-center text-secondary">
                                    <i className="bi bi-mortarboard me-2 fs-5"></i>
                                    <span>Professor: <strong className="text-dark fw-medium">{agend.professor}</strong></span>
                                </div>
                            </div>

                            <div className="d-flex align-items-center flex-wrap gap-4 text-secondary mt-1">
                                <div className="d-flex align-items-center">
                                    <i className="bi bi-clock me-2"></i> {agend.horario_inicio + "-" + agend.horario_fim}
                                </div>
                                <div>
                                    <strong className="text-dark">{agend.duracao}</strong>
                                </div>
                                <div className="d-flex align-items-center">
                                    <i className="bi bi-currency-dollar me-1"></i><span>Valor Final: <strong className="text-dark">{agend.valor_final.toLocaleString('pt-BR', {
                                        style: 'currency',
                                        currency: 'BRL'
                                    })}</strong></span>
                                </div>
                            </div>

                        </div>
                    </div>
                ))}
              
            </div>
            {showModal && (
                <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content border-0 shadow-lg rounded-4">
                            <div className="modal-header border-0 pb-0 pt-4 px-4">
                                <h5 className="modal-title fw-bold fs-4" style={{ color: '#0f172a' }}>Novo Agendamento</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowModal(false)}
                                ></button>
                            </div>
                            <div className="modal-body p-4">
                                <AgendamentoForm onClose={() => setShowModal(false)} />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AgendamentoList;