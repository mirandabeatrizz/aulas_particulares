import { useEffect, useState } from 'react';
import { useAlert } from '../../components/Alert';
import { ConfigRequest } from '../../config/configRequest';

const TipoAulaForm = ({ id, onClose, onSuccess }) => {
    const { showAlert } = useAlert();
    const [corSelecionada, setCorSelecionada] = useState('Azul');
    const [values, setValues] = useState({ id: '', nome: '', valor_hora: '', cor: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;

        // aplica a máscara apenas se o campo for o valor_hora
        if (name === 'valor_hora') {
            // remove tudo que não for número (letras, vírgulas, pontos)
            let apenasNumeros = value.replace(/\D/g, '');

            // se o campo ficar vazio, garante que volte para zero
            if (apenasNumeros === '') apenasNumeros = '0';

            // converte para número e divide por 100 para criar os decimais
            const valorNumerico = parseInt(apenasNumeros, 10) / 100;

            // formata para o padrão brasileiro (ex: 1.250,00)
            const valorFormatado = new Intl.NumberFormat('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }).format(valorNumerico);

            setValues({ ...values, [name]: valorFormatado });
        } else {
            // demais campos atualiza normalmente
            setValues({ ...values, [name]: value });
        }
    };

    useEffect(() => {
        if (id) {
            RequestTipoAula('GET', null, id);
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (id) {
            await RequestTipoAula('PUT', values, id);
        } else {
            await RequestTipoAula('POST', values, null);
        }
    };

    async function RequestTipoAula(tipo_req, values, id) {
        return await ConfigRequest(tipo_req, 'tipo_aula', id, values)
            .then((response) => {
                if (response.data) {
                    if (tipo_req === 'GET') {
                        const novos_dados = response.data;

                        //formatar valor do backend para não bugar se nao alterar o valor
                        if (novos_dados.valor_hora) {
                            novos_dados.valor_hora = new Intl.NumberFormat('pt-BR', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            }).format(parseFloat(novos_dados.valor_hora));
                        }

                        setValues(novos_dados);
                    } else {
                        setValues(response.data);
                        if (onSuccess) onSuccess(response.data, tipo_req);
                        showAlert('success', 'Registro salvo com sucesso!');
                        onClose();
                    }
                }
            })
            .catch((error) => {
                showAlert('error', 'Verifique e tente novamente!');
            });
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="row g-3 mb-4">
                <div className="col-12 col-md-7">
                    <label className="form-label text-secondary small mb-1">Nome</label>
                    <input
                        name="nome"
                        onChange={handleChange}
                        value={values.nome}
                        type="text"
                        className="form-control bg-light border-0 py-2"
                        placeholder="Ex: Matemática"
                    />
                </div>
                <div className="col-12 col-md-5">
                    <label className="form-label text-secondary small mb-1">Valor por hora (R$)</label>
                    <input
                        name="valor_hora"
                        onChange={handleChange}
                        value={values.valor_hora}
                        type="text"
                        className="form-control bg-light border-0 py-2"
                        placeholder="Ex: 80.00"
                    />
                </div>
            </div>

            {/* <div className="mb-4">
                <label className="form-label text-secondary small mb-2 d-block">Cor</label>
                <div className="d-flex flex-wrap gap-2">
                    {cores.map((cor) => (
                        <button
                            name='cor'
                            key={cor.nome}
                            type="button"
                            handleChange={handleChange}
                            className="btn rounded-pill px-3 py-1"
                            value={values.cor}
                            style={{
                                backgroundColor: cor.bg,
                                color: cor.text,
                                fontWeight: '500',
                                border: corSelecionada === cor.nome ? '2px solid #9ca3af' : '2px solid transparent'
                            }}
                        >
                            {cor.nome}
                        </button>
                    ))}
                </div>
            </div> */}

            <div className="d-flex justify-content-end gap-3 mt-2">
                <button type="button" className="btn btn-white border px-4 fw-medium" onClick={onClose}>
                    Cancelar
                </button>
                <button type="submit" className="btn btn-dark px-4 fw-medium">
                    Salvar
                </button>
            </div>
        </form>
    );
};

export default TipoAulaForm;
