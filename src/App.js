import { useState, useEffect, useRef } from 'react';
import ModalCadasEeditar from './componentes/modal/modal';
import Header from './componentes/header/header';
import Tabela from './componentes/tabela/tabela';
import Resumo from './componentes/resumo/resumo';
import Filtro from './componentes/filtro/filtro';
import iconFilter from './assets/icons8-filtro-481.svg';



function ButtonFiltro({ abrirFiltro, setAbrirFiltro }) {

  return (
      <button 
          className="open-filters-button "
          onClick={() =>{
               setAbrirFiltro(!abrirFiltro);    
               }}> 
          <img src={iconFilter} alt="iconFilter" />
              {'Filtrar'}
          </button> 
      )
}



function App() {

  const [condicaoModal1, setCondicaoModal1] = useState(false);
  const [condicaoModal2, setCondicaoModal2] = useState(false);
  const [idEditar, setIdEditar] = useState(false);
  const [informacoes, setInformacoes] = useState([]);
  const [carregar, setCarregar] = useState(false);
  const [abrirFiltro, setAbrirFiltro] = useState(false);
  const [atualizaInfo, setAtualizaInfo] = useState(false);

  const diasDaSemana = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta' ,'sábado'];
  
  useEffect(() => {
    carregarInfo() 
  },[carregar]);

  const formataValor = (valor) => {
    return  valor.toLocaleString('pt-bR', { style: 'currency', currency: 'BRL' })
  }

  const formataTexto = (texto) => {
    return  texto[0].toUpperCase() + texto.slice(1).toLowerCase();
  }

  const carregarInfo = async () => {
      try {
          const resposta = await fetch('http://localhost:3333/transactions', {
            method: 'GET'
          });

          const data = await resposta.json();
          setInformacoes(data);
          return data
      } catch (error) {
          console.log(error);
      }
  }


  return (
    <div className="App">
     
      <Header />
      <div className="container">

        <ButtonFiltro
            setAbrirFiltro={ setAbrirFiltro }
            abrirFiltro={ abrirFiltro }
        />

       { abrirFiltro && < Filtro
          informacoes={ informacoes }
          setInformacoes={ setInformacoes }
          abrirFiltro={ abrirFiltro }
          setAtualizaInfo={ setAtualizaInfo }
          setCarregar={ setCarregar }
          carregar={ carregar }
        /> }

        <Tabela 
          setCondicaoModal2={ setCondicaoModal2 }
          setIdEditar={ setIdEditar }
          carregarInfo={ carregarInfo }
          informacoes={ informacoes }
          formataValor={ formataValor }
          abrirFiltro={ abrirFiltro }
          diasDaSemana={ diasDaSemana }
          atualizaInfo={ atualizaInfo }
          formataTexto={ formataTexto }
        />

        <Resumo 
          informacoes={ informacoes }
          formataValor={ formataValor }
          abrirFiltro={ abrirFiltro }
        />
       
      <button 
        className={ `btn-add ${abrirFiltro && 'top-btn-add' }` } 
        onClick={ () => setCondicaoModal1(true) }
        >
        Adicionar Registro
      </button>

      </div>
      { condicaoModal1 && <ModalCadasEeditar
          setCondicaoModal1={setCondicaoModal1 }
          condicaoModal1={ condicaoModal1 }
          setCondicaoModal2={ setCondicaoModal2 }
          condicaoModal2={ condicaoModal2 }
          setCarregar={ setCarregar }
          carregar={ carregar }
          diasDaSemana={ diasDaSemana }
          formataTexto={ formataTexto }
       /> }
       { condicaoModal2 && <ModalCadasEeditar
          idEditar={ idEditar }
          setCondicaoModal2={ setCondicaoModal2 }
          condicaoModal2={ condicaoModal2 }
          setCondicaoModal1={ setCondicaoModal1 }
          condicaoModal1={ condicaoModal1 }
          informacoes={ informacoes }
          setCarregar={ setCarregar }
          carregar={ carregar }
          diasDaSemana={ diasDaSemana }
          formataTexto={ formataTexto }
       /> }
    </div>
  );
}

export default App;
