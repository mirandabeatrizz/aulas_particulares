import React, { useState } from 'react';
import { ConfigRequest } from '../config/configRequest';
import { useAlert } from './Alert';

const ModalConfirm = ({ id, rota, isOpen, onSuccess,
    closeModal,
    title = "Excluir registro?",
    message = "Esta ação não poderá ser desfeita. Tem certeza que deseja remover este item?" }) => {

    const { showAlert } = useAlert();
    const [isDeleting, setIsDeleting] = useState(false);

    if (!isOpen) return null;

    const handleClose = () => {
        closeModal();
    };

    const handleConfirm = () => {
        if (!id) return;

        setIsDeleting(true);

        ConfigRequest('DELETE', rota, id, null)
            .then((response) => {
                if (response.status == 200) {

                    showAlert('success', 'Registro excluído com sucesso!');
                    onSuccess(id);
                    closeModal();
                    setIsDeleting(false);
                }
            })
            .catch((error) => {
                showAlert('danger', 'Ocorreu um erro ao excluir o registro.');
                setIsDeleting(false);
            });
    };

    return (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 1050 }}>
            <div className="modal-dialog modal-dialog-centered modal-sm">
                <div className="modal-content border-0 shadow-lg rounded-4">
                    <div className="modal-body p-4 text-center">
                        <div className="text-danger mb-3">
                            <i className="bi bi-exclamation-circle" style={{ fontSize: '3rem' }}></i>
                        </div>
                        <h5 className="fw-bold text-dark mb-2">{title}</h5>
                        <p className="text-secondary small mb-4">{message}</p>
                        <div className="d-flex justify-content-center gap-2">
                            <button
                                className="btn btn-light border fw-medium px-4"
                                onClick={handleClose}
                            >
                                Cancelar
                            </button>
                            <button
                                className="btn btn-danger fw-medium px-4"
                                onClick={handleConfirm}
                            >
                                Sim, excluir
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ModalConfirm;