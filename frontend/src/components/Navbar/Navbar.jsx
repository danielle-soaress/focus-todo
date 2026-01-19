import './Navbar.scss'
import logoImg from '../../assets/focus_logo.svg'
import {Link,useNavigate } from 'react-router-dom';
import { signOutApi } from '../../services/authService';

const Navbar = ({login, signup, logged}) => {
    const navigate = useNavigate();

    const handleSignOutSubmit = async () => {
        await signOutApi();
        localStorage.removeItem('user_token');
        navigate('/login');
    };


    return (
        <div className="header_div">
            <Link to="/">
                <img src={logoImg} alt=""/>
            </Link>
            <span>
                {
                    logged ? 
                    (
                        <button onClick={() => handleSignOutSubmit()}>Sair <i className="bi bi-arrow-right"></i></button>
                    ) : (
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
                    )
                }
            </span>            
        </div>
    )
}

export default Navbar