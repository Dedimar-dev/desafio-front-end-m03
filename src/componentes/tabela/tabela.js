import { useState, useEffect } from "react";
import './tabela.css';
import editar from './assets/icons8-editar2.svg';
import excluir from './assets/icons8-lixo4.svg';
import setaModal from './assets/Polygon4.svg';
import setaCres from './assets/Polygon3.svg';
import setaDecres from './assets/Polygon5.svg';

function ModalConfirmar({ idModal, condicao, idDelete, deletarInfo, setCondicao }) {
    return (
        <div id={idModal} className={`container-confirm-delete ${idModal === idDelete && condicao ? '' : 'none'}`}>
            <img className="seta" src={setaModal} alt="seta" />
            <p>Apagar item?</p>
            <div className="div-buttons">
                <button
                    onClick={deletarInfo}
                    className="btn-actions-confirm-delete sim">
                    Sim
                </button>
                <button
                    onClick={() => setCondicao(false)}
                    className="btn-actions-confirm-delete nao">
                    Não
                </button>
            </div>
        </div>
    )
}

function Tabela({ formataTexto, diasDaSemana, formataValor, carregarInfo, informacoes, setCondicaoModal2, setIdEditar }) {

    const [condicao, setCondicao] = useState(false);
    const [id, setId] = useState(0);
    const [dados, setDados] = useState([]);
    const [dadosFormatados, setDadosFormatados] = useState([])
    const [ordenarValor, setOrdenarValor] = useState(false);
    const [ordenarData, setOrdenarData] = useState(true);
    const [ordenarDia, setOrdenarDia] = useState(false);
    const [controlaSetaValor, setControlaSetaValor] = useState(false);
    const [controlaSetaData, setControlaSetaData] = useState(true);
    const [controlaSetaDia, setControlaSetaDia] = useState(true);
    const [mostraSetaValor, setMostraSetaValor] = useState(false);
    const [mostraSetaData, setMostraSetaData] = useState(true);
    const [mostraSetaDia, setMostraSetaDia] = useState(false);

    useEffect(() => {
        setDados(informacoes);
    }, [informacoes]);

    useEffect(() => {
        trataDados();
    }, [dados, controlaSetaValor, controlaSetaData, mostraSetaDia]);

    const deletarInfo = async () => {

        try {
            await fetch(`http://localhost:3333/transactions/${id}`, {
                method: 'DELETE'
            });

            await carregarInfo();
            setCondicao(false);

        } catch (error) {
            console.log(error)
        }

    }

    const handleDelete = (e) => {
        const idDelete = Number(e.target.id)
        setId(idDelete);
        setCondicao(true);
    }

    const handleOrdenarValor = () => {

        setOrdenarValor(!ordenarValor);
        setOrdenarDia(false);
        setOrdenarData(false);

        setMostraSetaValor(true);
        setMostraSetaData(false);
        setMostraSetaDia(false);


        setControlaSetaValor(!controlaSetaValor);

        if (!ordenarValor) {
            const cres = informacoes.sort((a, b) => a.value - b.value);

            setDados(cres);
            setControlaSetaValor(true);

        } else {
            const decres = informacoes.sort((a, b) => b.value - a.value);

            setDados(decres);
            setControlaSetaValor(false);
        }
    }

    const trataDataParaOrden = () => {

        const novoDateTimestamp = informacoes.map(x => {
            const mes = x.date.slice(5, 7);
            const ano = x.date.slice(0, 4);
            const dia = x.date.slice(8, 10);
            const data = new Date(mes + ' ' + dia + ' ' + ano).getTime();
            const diaSemana = new Date(mes + ' ' + dia + ' ' + ano).getDay();
            const dateTimestamp = { ...x, date: data };
            const dateDiaSemana = { ...x, week_day: diaSemana }

            return {
                dateTimestamp: dateTimestamp,
                dateDiaSemana: dateDiaSemana
            };

        });

        return novoDateTimestamp;
    }

    const trataDataParaHendle = (ordem) => {
        const novaData = ordem.map(x => {

            let date = new Date(x.date).toISOString();;
            const data = { ...x, date: date }

            return data
        });

        return novaData;
    }

    const handleOrdenarDate = () => {

        setOrdenarData(!ordenarData);
        setOrdenarDia(false);
        setOrdenarValor(false);

        setMostraSetaValor(false);
        setMostraSetaData(true);
        setMostraSetaDia(false);

        setControlaSetaData(!controlaSetaData);

        const dateTimestamp = trataDataParaOrden();

        let info = [];
        dateTimestamp.map(x => {
            info.push(x.dateTimestamp);
        });

        if (!ordenarData) {

            const cres = info.sort((a, b) => a.date - b.date);
            const novoCres = trataDataParaHendle(cres);

            setDados(novoCres);
            setControlaSetaData(true);

        } else {

            const decres = info.sort((a, b) => b.date - a.date);
            const novoDescres = trataDataParaHendle(decres);

            setDados(novoDescres);
            setControlaSetaData(false);
        }

    }

    const handleOrdenarDia = () => {

        setOrdenarDia(!ordenarDia);
        setOrdenarData(false);
        setOrdenarValor(false);

        setMostraSetaValor(false);
        setMostraSetaData(false);
        setMostraSetaDia(true);

        const dateDiaSemana = trataDataParaOrden();

        let info = [];
        dateDiaSemana.map(x => {
            info.push(x.dateDiaSemana);
        });

        if (!ordenarDia) {

            const cres = info.sort((a, b) => a.week_day - b.week_day);
            let novoCres = trataDataParaHendle(cres);

            let novoInfo = []
            novoCres.map(x => {
                novoInfo.push({ ...x, week_day: diasDaSemana[x.week_day] });
            })

            setDados(novoInfo);
            setControlaSetaDia(true);

        } else {

            const decres = info.sort((a, b) => b.week_day - a.week_day);
            let novoDescres = trataDataParaHendle(decres);

            let novoInfo = []
            novoDescres.map(x => {
                novoInfo.push({ ...x, week_day: diasDaSemana[x.week_day] });
            })

            setDados(novoInfo);
            setControlaSetaDia(false);
        }
    }

    const trataDados = () => {
        const dadosTratados = dados.map(info => {
            const mes = info.date.slice(5, 7);
            const ano = info.date.slice(0, 4);
            const dia = info.date.slice(8, 10);

            return {
                id: info.id,
                date: dia + '/' + mes + '/' + ano,
                valor: formataValor(info.value),
                diaSemana: formataTexto(info.week_day),
                descricao: info.description,
                categoria: info.category,
                tipo: info.type
            }
        });

        setDadosFormatados(dadosTratados);
    }

    return (
        <div className="table">
            <div className="table-head">
                <div
                    style={{ cursor: "pointer" }}
                    onClick={handleOrdenarDate}
                    className="column-title"
                    id="date">
                    Data
                    {mostraSetaData &&
                        <img src={controlaSetaData ? setaCres : setaDecres} alt="seta" />
                    }
                </div>

                <div
                    style={{ cursor: "pointer" }}
                    onClick={handleOrdenarDia}
                    className="column-title"
                    id="week-day">
                    Dia da Semana
                    {mostraSetaDia &&
                        <img src={controlaSetaDia ? setaCres : setaDecres} alt="seta" />
                    }
                </div>

                <div className="column-title">
                    Descrição
                </div>

                <div className="column-title">
                    Categoria
                </div>

                <div
                    style={{ cursor: "pointer" }}
                    onClick={handleOrdenarValor}
                    className="column-title"
                    id="value">
                    Valor
                    {mostraSetaValor &&
                        <img src={controlaSetaValor ? setaCres : setaDecres} alt="seta" />
                    }
                </div>

            </div>

            <div className="table-body">

                {dadosFormatados.map(info => {
                    return (
                        <div key={info.id} className="table-line">
                            <div className="line-items">{info.date}</div>
                            <div className="line-items">{info.diaSemana}</div>
                            <div className="line-items">{info.descricao}</div>
                            <div className="line-items">{info.categoria}</div>
                            <div
                                className={`line-items ${info.tipo === 'debit' ? 'saida' : 'entrada'}`}>
                                {info.valor}
                            </div>
                            <div className="line-items">
                                <img id={info.id}
                                    onClick={(e) => {
                                        setIdEditar(Number(e.target.id))
                                        setCondicaoModal2(true);
                                    }}
                                    className="edit-icon"
                                    src={editar}
                                    alt="edit-icon"
                                />

                                <img id={info.id}
                                    onClick={handleDelete}
                                    className="delete-icon"
                                    src={excluir} alt="delete-icon"
                                />
                            </div>

                            <div className="div-confirm-delete">
                                <ModalConfirmar
                                    idModal={info.id}
                                    idDelete={id}
                                    setCondicao={setCondicao}
                                    deletarInfo={deletarInfo}
                                    condicao={condicao}
                                />
                            </div>
                        </div>
                    )
                })
                }
            </div>
        </div>

    )
}

export default Tabela;