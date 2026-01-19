import './Navbar.scss'
import logoImg from '../../assets/focus_logo.svg'
import {React, useState} from 'react';


const Navbar = ({login, signup}) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="header_div">
            <img src={logoImg}/>
            
            <span>
                {
                    login && signup ? (
                        <>
                            <a href="">Login</a>
                            <button>Cadastre-se</button>
                        </>
                    ) : (
                        <button>{login ? "Faça Login" : "Cadastre-se"}</button>
                    )
                }
            </span>            
        </div>
    )
}

export default Navbar