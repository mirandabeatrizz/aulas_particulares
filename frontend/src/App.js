import React, { useState } from 'react';
import Navbar from './components/Navbar';
import AgendamentoList from './pages/agendamento/AgendamentoList';
import TipoAulaList from './pages/tipo-aula/TipoAulaList';
import Alert from './components/Alert';

function App() {
  //estado inicial será a tela de agendamentos
  const [activeTab, setActiveTab] = useState('agendamentos');

  return (
    <Alert>
      <div className="App" style={{ backgroundColor: '#ffffff', minHeight: '100vh' }}>
        {/* passa o estado e a função de atualizar o estado para o navbar */}
        <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* condicional baseada na aba ativa */}
        {activeTab === 'agendamentos' ? <AgendamentoList /> : <TipoAulaList />}
      </div>
    </Alert>
  );
}

export default App;