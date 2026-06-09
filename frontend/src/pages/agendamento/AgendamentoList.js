import { useEffect, useState } from 'react';
import { useAlert } from '../../components/Alert';
import ModalConfirm from '../../components/ModalConfirm';
import { ConfigRequest } from '../../config/configRequest';
import AgendamentoForm from './AgendamentoForm';

const AgendamentoList = ({ searchTerm = '' }) => {
    const { showAlert } = useAlert();
    const [showModal, setShowModal] = useState(false);
    const [data, setData] = useState([]);
    const [busca, setBusca] = useState(false);
    const [id, setId] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    useEffect(() => {
        if (data.length == 0 && !busca) {
            getAgendamentos();
        }
    }, []);

    const handleId = (id, context) => {
        setId(id);
        if (context == 'editar') {
            setShowModal(true);
        } else setShowDeleteModal(true);
    };

    const handleRemoveFromList = (deletedId) => {
        // filtrar o array, mantendo apenas os itens que tem o id diferente do excluído
        setData((prevList) => prevList.filter((tipo) => tipo.id !== deletedId));
    };

    const handleFormSuccess = (savedItem, actionType) => {
        if (actionType === 'PUT') {
            // se for edição mapeia o array e substitui apenas o item que tem o mesmo id
            setData((prevData) => prevData.map((item) => (item.id === savedItem.id ? savedItem : item)));
        } else if (actionType === 'POST') {
            // se for novo pega a lista anterior e adiciona o item no final
            setData((prevData) => [...prevData, savedItem]);
        }
    };

    async function getAgendamentos() {
        await ConfigRequest('GET', 'agendamento', null, null)
            .then((response) => {
                setData(response.data);
                setBusca(true);
            })
            .catch((error) => {
                showAlert('error', 'Ocorreu um erro ao buscar lista de agendamentos!');
            });
    }

    const dadosFiltrados = data.filter((agendamento) => {
        if (!searchTerm) return true;

        const termo = searchTerm.toLowerCase();

        // busca pelo nome do aluno, professor ou tipo aula
        return (
            agendamento.aluno?.toLowerCase().includes(termo) ||
            agendamento.professor?.toLowerCase().includes(termo) ||
            agendamento.tipo_aula?.toLowerCase().includes(termo)
        );
    });

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
                {dadosFiltrados.length > 0 ? (
                    dadosFiltrados.map((agend) => (
                        <div key={agend.id} className="card border rounded-4 shadow-sm">
                            <div className="card-body p-4">
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <div className="d-flex align-items-center gap-3">
                                        <span
                                            className="badge rounded-pill px-3 py-2"
                                            style={{ backgroundColor: '#eff6ff', color: '#3b82f6', fontWeight: '500' }}>
                                            {agend.tipo_aula}
                                        </span>
                                        <span className="text-secondary small d-flex align-items-center">
                                            <i className="bi bi-calendar2-event me-2"></i> {agend.data}
                                        </span>
                                    </div>
                                    <div className="text-secondary fs-5">
                                        <button
                                            onClick={() => handleId(agend.id, 'editar')}
                                            className="btn btn-link p-0 text-secondary border-0 text-decoration-none"
                                            title="Editar">
                                            <i className="bi bi-pencil"></i>
                                        </button>
                                        <button
                                            onClick={() => handleId(agend.id, 'excluir')}
                                            className="btn btn-link p-0 text-secondary border-0 text-decoration-none"
                                            title="Excluir">
                                            <i className="bi bi-trash"></i>
                                        </button>
                                    </div>
                                </div>

                                <div className="row mb-3">
                                    <div className="col-12 col-md-6 d-flex align-items-center text-secondary mb-2 mb-md-0">
                                        <i className="bi bi-person me-2 fs-5"></i>
                                        <span>
                                            Aluno: <strong className="text-dark fw-medium">{agend.aluno}</strong>
                                        </span>
                                    </div>
                                    <div className="col-12 col-md-6 d-flex align-items-center text-secondary">
                                        <i className="bi bi-mortarboard me-2 fs-5"></i>
                                        <span>
                                            Professor: <strong className="text-dark fw-medium">{agend.professor}</strong>
                                        </span>
                                    </div>
                                </div>

                                <div className="d-flex align-items-center flex-wrap gap-4 text-secondary mt-1">
                                    <div className="d-flex align-items-center">
                                        <i className="bi bi-clock me-2"></i>
                                        <span>
                                            Horário: <strong className="text-dark"> {agend.horario_inicio + '-' + agend.horario_fim}</strong>
                                        </span>
                                    </div>
                                    <div>
                                        <i class="bi bi-hourglass"></i>
                                        <span>
                                            Duração: <strong className="text-dark">{agend.duracao}</strong>
                                        </span>
                                    </div>
                                    <div className="d-flex align-items-center">
                                        <i className="bi bi-currency-dollar me-1"></i>
                                        <span>
                                            Valor Final:{' '}
                                            <strong className="text-dark">
                                                {agend.valor_final.toLocaleString('pt-BR', {
                                                    style: 'currency',
                                                    currency: 'BRL',
                                                })}
                                            </strong>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center text-secondary py-5">Nenhum resultado encontrado para "{searchTerm}"</div>
                )}
            </div>
            {showModal && (
                <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content border-0 shadow-lg rounded-4">
                            <div className="modal-header border-0 pb-0 pt-4 px-4">
                                <h5 className="modal-title fw-bold fs-4" style={{ color: '#0f172a' }}>
                                    Novo Agendamento
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => {
                                        setShowModal(false);
                                        setId(null);
                                    }}></button>
                            </div>
                            <div className="modal-body p-4">
                                <AgendamentoForm
                                    id={id}
                                    onSuccess={handleFormSuccess}
                                    onClose={() => {
                                        setShowModal(false);
                                        setId(null);
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showDeleteModal && (
                <ModalConfirm
                    id={id}
                    rota={'agendamento'}
                    isOpen={showDeleteModal}
                    closeModal={() => {
                        setShowDeleteModal(false);
                        setId(null);
                    }}
                    onSuccess={handleRemoveFromList}
                    message="Esta ação não poderá ser desfeita. Tem certeza que deseja remover este tipo de aula?"
                />
            )}
        </div>
    );
};

export default AgendamentoList;
