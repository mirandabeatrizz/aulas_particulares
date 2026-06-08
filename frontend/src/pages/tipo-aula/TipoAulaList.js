import React, { useEffect, useState } from 'react';
import TipoAulaForm from './TipoAulaForm';
import { ConfigRequest } from '../../config/configRequest';
import Alert from '../../components/Alert';
import ModalConfirm from '../../components/ModalConfirm';

const TipoAulaList = () => {
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [data, setData] = useState([])
  const [id, setId] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [alertConfig, setAlertConfig] = useState(null);

  useEffect(() => {
    if (data.length == 0) {
      getTipoAulas();
    }
  }, [])

  async function getTipoAulas() {

    await ConfigRequest('GET', 'tipo_aula', null, null)
      .then((response) => {
        setData(response.data)
      })
      .catch((error) => {
        console.log(error)
      });

  }

  const handleId = (id, context) => {
    setId(id);
    if (context == 'editar') {
      setShowModal(true);
    } else setShowDeleteModal(true)
  };

  const tiposAula = [
    { id: 1, nome: 'Matemática', valor: '80,00', tagBg: '#eff6ff', tagColor: '#3b82f6' },
    { id: 2, nome: 'Inglês', valor: '90,00', tagBg: '#dcfce7', tagColor: '#22c55e' },
    { id: 3, nome: 'Programação', valor: '120,00', tagBg: '#faf5ff', tagColor: '#a855f7' }
  ];

  const handleRemoveFromList = (deletedId) => {
    // filtrar o array, mantendo apenas os itens que tem o id diferente do excluído
    setData((prevList) => prevList.filter(tipo => tipo.id !== deletedId));
  };

  const handleFormSuccess = (savedItem, actionType) => {
    if (actionType === 'PUT') {
      // se for edição mapeia o array e substitui apenas o item que tem o mesmo id
      setData((prevData) =>
        prevData.map((item) => (item.id === savedItem.id ? savedItem : item))
      );
    } else if (actionType === 'POST') {
      // se for novo pega a lista anterior e adiciona o item no final
      setData((prevData) => [...prevData, savedItem]);
    }
  };

  return (
    <div className="container relative">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold d-flex align-items-center mb-0" style={{ color: '#0f172a' }}>
          <i className="bi bi-book me-2"></i> Tipos de Aula
        </h4>
        <button
          className="btn btn-dark fw-semibold rounded-3 px-4 py-2"
          onClick={() => setShowModal(true)}
        >
          + Novo Tipo
        </button>
      </div>

      <div className="row g-3">
        {
          data && data.map((tipo) => (
            <div key={tipo.id} className="col-12 col-md-4">
              <div className="card border rounded-4 shadow-sm h-100">
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <span
                      className="badge rounded-pill px-3 py-2"
                      style={{ backgroundColor: '#eff6ff', color: '#3b82f6', fontWeight: '500' }}
                    >
                      {tipo.nome}
                    </span>
                    <div className="text-secondary fs-6">
                      <button
                        onClick={() => handleId(tipo.id, 'editar')}
                        className="btn btn-link p-0 text-secondary border-0 text-decoration-none"
                        title="Editar"
                      >
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button
                        onClick={() => handleId(tipo.id, 'excluir')}
                        className="btn btn-link p-0 text-secondary border-0 text-decoration-none"
                        title="Excluir"
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </div>
                  <div>
                    <span className="fs-5 text-dark">R$ {tipo.valor_hora}</span>
                    <span className="text-secondary small"> / hora</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        }
      </div>

      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="modal-header border-0 pb-0 pt-4 px-4">
                <h5 className="modal-title fw-bold fs-4" style={{ color: '#0f172a' }}>
                  {id ? 'Editar Tipo de Aula' : 'Novo Tipo de Aula'}
                </h5>
                <button type="button" className="btn-close" onClick={() => { setShowModal(false); setId(null) }}></button>
              </div>
              <div className="modal-body p-4">
                <TipoAulaForm
                  id={id}
                  onSuccess={handleFormSuccess}
                  onClose={() => {
                    setShowModal(false);
                    setId(null)
                  }} />
              </div>
            </div>
          </div>
        </div>
      )}

      {alertConfig && (
        <Alert
          text={alertConfig.text}
          type={alertConfig.type}
        />
      )}

      {showDeleteModal && (
        <ModalConfirm
          id={id}
          rota={'tipo_aula'}
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

export default TipoAulaList;