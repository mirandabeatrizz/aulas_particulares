// Regras de negócio referentes ao aula
import { where } from 'sequelize';
import TipoAula from '../models/TipoAula.js';

const tipo_aula = {
    async criar(req, res) {
        try {
            const nome = req.body.nome;
            console.log("@!nome", nome)
            if (!nome) return res.status(500).json({error:'parametros invalidos'})
            
            const tipo = await TipoAula.findOne({where:{nome:nome}})
            if(tipo) return res.status(500).json({error:'tipo já existente'});

            const novo_tipo = await TipoAula.create({ nome: nome });

            return res.status(200).json({ data: novo_tipo });

        } catch (error) {
            console.log(error)
            return res.status(500).json(error);
        }
    },

    async editar(req, res) {
        try {
            const nome = req.body.nome;
            const id_tipo = req.params.id
            if (!nome && !id_tipo) return res.status(500).json({error:'parametros invalidos'})
            
            const tipo = await TipoAula.findByPk(id_tipo)
            if(!tipo) return res.status(500).json({error:'tipo não encontrado'});

            await tipo.update({ nome: nome });

            return res.status(200).json({ data: tipo });

        } catch (error) {
            console.log(error)
            return res.status(500).json(error);
        }
    },

    async list(req,res){
        try {
            const tipos_aula = await TipoAula.findAll();

            return res.status(200).json({data: tipos_aula})
            
        } catch (error) {
            console.log(error)
            return res.status(500).json(error);
        }
    },

    async excluir(req, res) {
        try {
            const id_tipo = req.params.id
            if (!id_tipo) return res.status(500).json({error:'parametros invalidos'})
            
            const tipo = await TipoAula.findByPk(id_tipo)
            if(!tipo) return res.status(500).json({error:'tipo não encontrado'});

            await tipo.destroy();

            return res.status(200).json({ msg: 'tipo excluido com sucesso' });

        } catch (error) {
            console.log(error)
            return res.status(500).json(error);
        }
    },

}
export default tipo_aula
