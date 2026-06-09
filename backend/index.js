import cors from 'cors';
import Express from 'express';
import banco from './config/database.js';
import agendamento from './controllers/AgendamentoController.js';
import tipo_aula from './controllers/TipoAulaController.js';

const api = Express();
api.use(cors());
api.use(Express.json()); // Permite que a API entenda os JSONs do Insomnia

api.post('/tipo_aula', tipo_aula.criar);
api.put('/tipo_aula/:id', tipo_aula.editar);
api.delete('/tipo_aula/:id', tipo_aula.excluir);
api.get('/tipo_aula/:id', tipo_aula.buscar);
api.get('/tipo_aula', tipo_aula.list);

// ROTAS DE AGENDAMENTO
api.get('/agendamento', agendamento.listar);
api.get('/agendamento/:id', agendamento.buscar);
api.put('/agendamento/:id', agendamento.editar);
api.post('/agendamento', agendamento.criar);
api.delete('/agendamento/:id', agendamento.deletar);

// Liga o servidor
api.listen(3001, () => {
    console.log('Api rodando na porta 3001...');
});

try {
    await banco.authenticate();
    console.log('Banco conectado com sucesso.');
} catch (error) {
    console.error('Erro ao conectar com o banco de dados:', error);
}
