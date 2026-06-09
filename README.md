# Sistema de Aulas Particulares

O **Sistema de Aulas Particulares** é uma aplicação Full Stack desenvolvida para facilitar e organizar o gerenciamento de aulas. O sistema permite o cadastro de diferentes tipos de aula (como Matemática, Inglês, Programação, etc.), definindo seus respectivos valores por hora. Além disso, a plataforma gerencia a entidade principal de agendamentos, registrando de forma detalhada o aluno, o professor responsável, a data e os horários de início e término de cada aula.

---

## Tecnologias Utilizadas

A aplicação foi dividida em duas frentes: uma API RESTful no backend e uma interface interativa no frontend.

### Backend

- **Node.js:** Ambiente de execução JavaScript server-side.
- **Express:** Framework para construção da API e roteamento.
- **Sequelize:** ORM (Object-Relational Mapper) para manipulação do banco de dados relacionais.
- **PostgreSQL:** Banco de dados relacional escolhido para persistência segura das informações.
- **CORS:** Middleware para permitir a comunicação segura entre o frontend e o backend.

### Frontend

- **React.js:** Biblioteca JavaScript para a construção de interfaces de usuário componentizadas.
- **Bootstrap:** Framework CSS utilizado para a estilização ágil e responsiva (classes utilitárias, modais e botões).

---

## Estrutura do Projeto

O repositório contém tanto o código do servidor quanto o da interface de usuário.

```text
AULAS_PARTICULARES/
├── backend/                 # API RESTful
│   ├── config/              # Arquivos de configuração (ex: conexão com database.js)
│   ├── controllers/         # Regras de negócio e controle de requisições
│   │   ├── AgendamentoController.js
│   │   └── TipoAulaController.js
│   ├── models/              # Modelos e schemas do banco de dados (Sequelize)
│   │   ├── Agendamento.js
│   │   └── TipoAula.js
│   ├── .env                 # Variáveis de ambiente (credenciais, portas)
│   └── index.js             # Arquivo principal e inicialização do servidor
│
└── frontend/                # Interface do Usuário (React)
    ├── public/              # Arquivos estáticos
    └── src/
        ├── components/      # Componentes globais e reutilizáveis (Alert, ModalConfirm, Navbar)
        ├── config/          # Configurações globais (ex: configRequest.js para chamadas API)
        ├── pages/           # Páginas principais da aplicação
        │   ├── agendamento/ # Listagem e formulário de agendamentos
        │   └── tipo-aula/   # Listagem e formulário de tipos de aula
        ├── App.js           # Estrutura principal e gerenciamento de estado global
        └── index.js         # Ponto de entrada do React
```
