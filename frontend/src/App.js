import { useState } from 'react';
import Alert from './components/Alert';
import Navbar from './components/Navbar';
import AgendamentoList from './pages/agendamento/AgendamentoList';
import TipoAulaList from './pages/tipo-aula/TipoAulaList';

function App() {
    //estado inicial será a tela de agendamentos
    const [activeTab, setActiveTab] = useState('agendamentos');
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <Alert>
            <div className="App" style={{ backgroundColor: '#ffffff', minHeight: '100vh' }}>
                {/* passa o estado e a função de atualizar o estado para o navbar */}
                <Navbar activeTab={activeTab} setActiveTab={setActiveTab} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

                {/* condicional baseada na aba ativa */}
                {activeTab === 'agendamentos' ? <AgendamentoList searchTerm={searchTerm} /> : <TipoAulaList searchTerm={searchTerm} />}
            </div>
        </Alert>
    );
}

export default App;
