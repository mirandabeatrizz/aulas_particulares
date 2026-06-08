import React, { createContext, useContext, useState } from 'react';

// cria o contexto
const AlertContext = createContext();

// hook personalizado para facilitar o uso em outros componentes
export const useAlert = () => {
  return useContext(AlertContext);
};

const Alert = ({ children }) => {
    const [alertConfig, setAlertConfig] = useState(null);

    // função que será chamada de outros lugares
    const showAlert = (type, text) => {
        setAlertConfig({ type, text });
        // esconde o alerta automaticamente após 4 segundos
        setTimeout(() => setAlertConfig(null), 4000);
    };
    return (
        <AlertContext.Provider value={{ showAlert }}>
      {children}
      
      {/* componente visual do Alerta renderizado globalmente */}
      {alertConfig && (
        <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1055 }}>
            <div className={`alert alert-${alertConfig.type} shadow-sm d-flex align-items-center`} role="alert">
                <i className={`bi ${alertConfig.type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'} me-2`}></i>
                <div>{alertConfig.text}</div>
            </div>
        </div>)}
    </AlertContext.Provider>)
}

export default Alert;