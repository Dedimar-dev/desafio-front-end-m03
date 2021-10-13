import { useState, useRef, useEffect } from 'react';
import './filtro.css';
import Mais from './assets/+.svg';
import X from './assets/x.svg';

function BtnFiltrar({ clicadosCurrent, id, info, handleFiltrar}) {

    const colocaCor = () => {
        if(clicadosCurrent){
             return clicadosCurrent.includes(id);
        }  
    }

    const clicado = colocaCor();

    return(    
        <div>
            <button 
                style={{backgroundColor: clicado? '#7B61FF': ''}}
                id={id} 
                onClick={ handleFiltrar } 
                className={`container-chip `}>
                {info}
            </button>
            <img 
                onClick={ handleFiltrar }  
                id={id}
                className="icon-filter" 
                src={clicado? X : Mais} alt="icon"
            />
        </div>   
              
    )
}


function Filtro({ carregar, setCarregar,  abrirFiltro, informacoes, setInformacoes }) {

    let diasDaSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

    const [categorias, setCategorias] = useState([]);
    const [auxiliar, setAuxiliar] = useState(false);
    const [limpar, setLimpar] = useState(false);
    const clicados = useRef([]);
    const [diasDaSemanaFilter, setDiasDaSemanaFilter] = useState([]);
    const [valorMax, setValorMax] = useState('');
    const [valorMin, setValorMin] = useState('');   
    const [atualizaFiltro, setAtualizaFiltro ] = useState(false);

    useEffect(() => {
        setDiasDaSemanaFilter(diasDaSemana);
        auxiliarCategory();
    },[abrirFiltro, limpar, informacoes]);

    
    const auxiliarCategory = () => {
        const array = [];
        const arrayAuxiliar = [];
        informacoes.map(categoria => {   

            if(arrayAuxiliar.includes(categoria.category)){
                return
            }
            array.push(categoria.category);
            arrayAuxiliar.push(categoria.category);
        });  
        setCategorias(array);
    }

    const handleLimparFiltros = () => {
        clicados.current = [];
        setCarregar(!carregar);
        setLimpar(!limpar);
        setValorMin(0);
        setValorMax(0);
        setCarregar(true);
        setCarregar(!carregar);
       
    }
   
    const handleBuscarFiltros = () => {
        carregarFiltrados();
    }

    const handleFiltrar = (e) => {

        setAuxiliar(!auxiliar);
        
        const condicao = clicados.current.includes(e.target.id);

        clicados.current.push(e.target.id);

        if (condicao) {
            clicados.current = clicados.current.filter(y => y !== e.target.id );
        }

     }

    const auxiliaCarregarFiltro = () => {
        let filtrados = []

        clicados.current.map(x => {
            let nome =  x.toLowerCase();

            let selecionados = informacoes.filter(y => {
                return y.category === nome || y.category === x || y.week_day === nome;
            });

            filtrados.push(...selecionados);
        });

       

        return filtrados;
    } 


    const carregarFiltrados = () => {
       
        const filtrados = auxiliaCarregarFiltro();
    
        const novoFiltrados =  filtrados.filter((x,i) => {
            return filtrados.indexOf(x) === i;
        });
        
        if (!valorMax && !valorMin && clicados.current.length === 0 ) {
            setCarregar(!carregar);
            return 
        } 

        
        if (valorMax && valorMin) {

            let selecionados = [];

            if (novoFiltrados.length > 0) {
                novoFiltrados.map(x => {
                    if (x.value >= valorMin && x.value <= valorMax ) {
                        selecionados.push(x);
                    }                  
                });

                setInformacoes(selecionados); 
                return

            } else {

                informacoes.map(x => {
                    if (x.value >= valorMin && x.value <= valorMax ) {
                        selecionados.push(x);
                    }            
                });

                setInformacoes(selecionados); 
                return
            }          

        } 

        if (valorMax || valorMin) {
            
            let selecionados = [];

            if (novoFiltrados.length > 0) {

                novoFiltrados.map(x => {
                    if (valorMin && x.value >= valorMin) {
                        selecionados.push(x);
                    }  
                    if (valorMax && x.value <= valorMax  ) {
                        selecionados.push(x);
                    }                  
                });

                setInformacoes(selecionados); 
                return

            } else {

                informacoes.map(x => {
                    if (valorMin && x.value >= valorMin ) {
                        selecionados.push(x);
                    }       

                    if (valorMax && x.value <= valorMax ) {
                        selecionados.push(x);
                    }    
                });

                setInformacoes(selecionados); 
                return
            } 

        } else {
            
            setAuxiliar(!auxiliar);
            setInformacoes( novoFiltrados); 
        }   
    }


    return(
        <div>
            <div className="container-filters">
                <ul className="list-titulo">
                    <li>Dia da semana</li>
                    <li>Categoria</li>
                    <li>Valor</li>
                </ul>
                <div className="dia-semana">
                    { diasDaSemanaFilter.map(dia=> (
                    
                        <BtnFiltrar 
                            handleFiltrar={ handleFiltrar }
                            key={ dia } 
                            info={ dia }
                            id={ dia }
                            clicadosCurrent={ clicados.current }
                        /> 
                      )) 
                    }
                </div>

                <div className="categoria">
                    
                    { categorias.map((categoria, i) => (
                        <BtnFiltrar 
                            handleFiltrar={handleFiltrar}
                            key={ i } 
                            info={ categoria }
                            id={ categoria }
                            clicadosCurrent={ clicados.current }
                        /> 
                      ))
                    }
                </div>           
                    <div className="valor">
                        <div>
                            <label htmlFor="min-value">Min</label>
                            <input 
                                className="input"
                                onChange={ (e) => setValorMin(Number(e.target.value)) } 
                                type="number" 
                                name={ valorMin } 
                                value={ valorMin } 
                                id="min-value" 
                            />
                        </div>
                    
                        <div>
                            <label htmlFor="max-value">Max</label>
                            <input 
                                className="input"
                                onChange={ (e) => setValorMax((Number(e.target.value)))} 
                                type="number" 
                                name={ valorMax } 
                                value={ valorMax } 
                                id="max-value" 
                            />
                        </div>

                    </div>

                    <div className="div-btn-apply-clear">
                        
                        <button 
                            className="btn-clear-filters" 
                            onClick={ handleLimparFiltros }
                            >
                            Limpar Filtro
                        </button>
                        
                        <button 
                            className="btn-apply-filters" 
                            onClick={ handleBuscarFiltros }>
                            Filtrar
                        </button>

                    </div>
            </div>

        </div>
    )
}

export default Filtro;