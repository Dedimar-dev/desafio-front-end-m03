import './header.css';
import logo from './assets/Group5.svg';

function Header() {
    return (
        <header className="container-header">
            <div className="container-header-div">
                <img src={logo} alt="logo" />
                <h1>Dindin</h1>
            </div>
        </header>
    )
}

export default Header;