import './Navbar.scss'
import logoImg from '../../assets/focus_logo.svg'
import {Link,useNavigate } from 'react-router-dom';


const Navbar = ({login, signup}) => {
    const navigate = useNavigate();

    return (
        <div className="header_div">
            <Link to="/">
                <img src={logoImg} alt=""/>
            </Link>
            <span>
                {
                    login && signup ? (
                        <>
                            <Link to="/login">Login</Link>
                            <button onClick={() => navigate("/signup")}>Cadastre-se</button>
                        </>
                    ) : (
                        login ?
                        <button onClick={() => navigate("/login")}>{"Faça Login"}</button> :
                        (signup ? <button onClick={() => navigate("/signup")}>{"Cadastre-se"}</button> : null)
                    )
                }
            </span>            
        </div>
    )
}

export default Navbar