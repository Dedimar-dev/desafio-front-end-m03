import { useState, useEffect } from 'react';
import './modal.css';
import close from './assets/+.svg';
import InputMask from 'react-input-mask';

 function Modal({ formataTexto, diasDaSemana, carregar, setCarregar, informacoes, idEditar, setCondicaoModal1, setCondicaoModal2 }){

    const [ativo, setAtivo] = useState(true);
    const [value, setValue] = useState();
    const [category, setCategory] = useState('');
    const [date, setDate] = useState('');
    const [description, setDescription] = useState('');
   
    useEffect(() => {
        editarDados();
        return
    },[idEditar]);

    const editarDados = () => {

        if (idEditar) {
            let informacoesEditar = informacoes.filter(x => x.id === idEditar);

            informacoesEditar.map(x => {
                if(x.type === 'debit'){
                    setAtivo(true);
                } else {
                    setAtivo(false);
                }

                const dias = x.date.slice(8, 10);
                const mes = x.date.slice(5,7);
                const ano = x.date.slice(0,4);
                let novaData = `${dias}/${mes}/${ano}`;

                setValue(x.value);
                setCategory(x.category);
                setDate(novaData);
                setDescription( x.description);
            })
        }
    }
   
    const handleCredit = () => {
        setAtivo(false);
    }

    const handleDebit = () => {
        setAtivo(true);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        return
    }

    const limpaInput = () => {
        setCarregar(!carregar);
        setValue('');
        setCategory('');
        setDate('');
        setDescription('');
    }

    const verificaCamposInput = () => {
        if (!date || !value || !category || !description) return
    }

    const dados = () => {

        verificaCamposInput();

        const ano = date.slice(6, 10);
        const mes = date.slice(3,5);
        const dias = date.slice(0,2);
    
        let novaData = new Date(`${ano} ${mes} ${dias}`);
        let diaDasemana = diasDaSemana[novaData.getDay()]
        novaData = novaData.toISOString();

        const categoria = formataTexto(category);
        const descricao = formataTexto(description);

        const data = {
            date:novaData,
            week_day: diaDasemana,
            description: descricao ,
            value: value,
            category: categoria,
            type: ativo? 'debit':'credit'
        }

        return data;
    }

    const cadastrarInfo = async () => {

        try {
           const dadosFinal = dados();

           await fetch('http://localhost:3333/transactions',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dadosFinal),
            });

            limpaInput();
            
        } catch (error) {
            console.log(error);
        }
        
    }

    const editarInfo = async () => {
        
        try {
           let dadosFinal = dados();

           await fetch(`http://localhost:3333/transactions/${idEditar}`,{
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dadosFinal ),
            });

            limpaInput();

        } catch (error) {
            console.log(error);
        }

    }

    return (
        <div className="backdrop">
           
            <form onSubmit={ handleSubmit } className="modal-container">

                 <h1>{ idEditar?'Editar Registro':'Adicionar Registro' }</h1>

                <img onClick={ () => {
                        setCondicaoModal2(false) 
                        setCondicaoModal1(false)
                        } 
                    } 
                    className="close-icon" 
                    src={ close } 
                    alt="Close" 
                />
                <nav>

                    <button onClick={ handleCredit } 
                        id="credit-button"
                        className={ `entrada-button ${ ativo? 'color-silver':'' }` }>
                        Entrada
                    </button>

                    <button onClick={ handleDebit } 
                        id="debit-button"
                        className={ `saida-button ${ ativo? '':'color-silver' }` }>
                        Saída
                    </button>

                </nav>
                <div className="div-inputs">

                    <label htmlFor="valor">Valor</label>
                    <input
                        onChange={ (e) => setValue(Number(e.target.value)) } 
                        id="valor" 
                        type="number" 
                        name={ value } 
                        value={ value }
                        required
                    />
                </div>

                <div className="div-inputs">
                    <label htmlFor="categ">Categoria</label>
                    <input
                        onChange={ (e) => setCategory(e.target.value) } 
                        id="categ" 
                        type="text" 
                        name={ category } 
                        value={ category }
                        required
                    />
                </div>

                <div className="div-inputs">
                    <label htmlFor="data">Data</label>
                    <InputMask
                        mask="99/99/9999" 
                        onChange={ (e) => setDate(e.target.value) } 
                        id="data" 
                        type="text" 
                        name={ date } 
                        value={ date }
                        required
                    />
                </div>
                
                <div className="div-inputs">
                    <label htmlFor="descri">Descrição</label>
                    <input
                        onChange={ (e) => setDescription(e.target.value) }  
                        id="descri" 
                        type="text" 
                        name={ description } 
                        value={ description }
                    />
                </div>

                <div className="confirmar-div">
                    <button 
                        onClick={ idEditar? editarInfo : cadastrarInfo } 
                        className="btn-insert">Confirmar</button>
                </div>
            </form>
        </div>
    )
}

export default Modal;