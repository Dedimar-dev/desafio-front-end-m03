import {useState, useEffect} from 'react';
import './resumo.css';

function Resumo({ abrirFiltro, informacoes, formataValor }) {
    const [entradas, setEntradas] = useState(0);
    const [saidas, setSaidas] = useState(0);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        trataResumo();
    },[informacoes]);

    let entrada = 0;
    let saida = 0;
    let valorTotal = 0;

   const trataResumo = () => {
        informacoes.map(x => {

            if (x.type === 'credit'){
                entrada += x.value 
            }
            if (x.type === 'debit'){
                saida += x.value 
            }
        });

        valorTotal = (entrada) - (saida);

        entrada = formataValor(entrada);
        saida  = formataValor(saida );
        valorTotal = formataValor( valorTotal);

        setEntradas(entrada);
        setSaidas(saida);
        setTotal(valorTotal);
    }
  
    return(
        <div className={ `container-resume ${ abrirFiltro && 'top-resumo' }` }>

            <h3 className="titulo-resumo">Resumo</h3>

            <div className="div">
                Entradas
                <span className="in"> { entradas }</span>
            </div>

            <div className="div">
                Saídas
                <span className="out"> { saidas }</span>
            </div>

            <span className="linha"></span>

            <div className="div">
                Saldo 
                <span className="balance">{ total }</span>
            </div>

        </div>
    )
}

export default Resumo;