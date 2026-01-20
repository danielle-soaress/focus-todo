
import { useState } from 'react';
import './AuthPage.scss'
import Navbar from '../../components/Navbar/Navbar'
import spiralIcon from '../../assets/spiral.svg'
import {Link, useNavigate, useLocation } from 'react-router-dom';
import {signInApi, signUpApi} from '../../services/authService'

function AuthPage() {
    const navigate = useNavigate();
    const location = useLocation();

    const isLoginView = location.pathname === '/login';

    const [loginAttempts, setLoginAttempts] = useState(0);
    const [errorMessage, setErrorMessage] = useState('');

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');

        console.log("Tentando logar...");

        const formData = new FormData(e.target);
        const email = formData.get('email');
        const password = formData.get('password');

        const [result, error] = await signInApi({
            user: {
                email: email,
                password: password
            }
        });

        if (error) {
            errorHandler(error);
        } else {
            if (result.token) {
                localStorage.setItem('user_token', result.token);
            }

            navigate('/dashboard');
        }

        setLoginAttempts(prev => prev + 1);
    };

    const handleSignupSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');

        const formData = new FormData(e.target);
        const full_name = formData.get('name');
        const email = formData.get('email');
        const password = formData.get('password');
        const confirmPassword = formData.get('confirm_password');

        if (password !== confirmPassword) {
            setErrorMessage("As senhas não coincidem.");
            return;
        }

        console.log("Realizando cadastro...");

        const [result, error] = await signUpApi({
            user: {
                email: email,
                full_name: full_name,
                password: password
            }
        });

        if (error) {
            errorHandler(error);
        } else {
            navigate('/login');
        }

        setLoginAttempts(prev => prev + 1);
    };

    const errorHandler = (error) => {
        let msgAmigavel = ""
        switch (error.status) {
            case 401:
                msgAmigavel = "Dados inválidos. Verifique-os e Tente Novamente";
                break;
            case 404:
                msgAmigavel = "Não encontramos uma conta com este email.";
                break;
            case 422:
                msgAmigavel = "Este email já foi registrado.";
                break;
            case 500:
                msgAmigavel = "Erro interno no servidor. Tente novamente mais tarde.";
                break;
            case 0:
                msgAmigavel = "Parece que você está sem internet ou o servidor caiu.";
                break;
            default:
                msgAmigavel = error.message || "Ocorreu um erro inesperado.";
        }

        setErrorMessage(msgAmigavel);
    };

    return (
    <div className="login_container">
        <Navbar login={!isLoginView} signup={isLoginView} />

        <div className="login_content">
            <div className="left_content">

                {!isLoginView ? (<p>Transforme sua lista de tarefas,<br/>Realize pequenas vitórias diárias.</p>) : (<p>Dê vida aos seus projetos, <br/>Acompanhe seu progresso com clareza.</p>)}
        
            </div>
            <div className="right_content">
                <span className="introduction_text_span">
                    <img src={spiralIcon}/>
                    <p className="introduce_text">{isLoginView ? "Bem-vindo!" : "Faça o Seu Cadastro"}</p>
                </span>
                {
                    isLoginView ? (
                        <form onSubmit={handleLoginSubmit}>
                            <label>
                                Email
                                <input className="textInput" type="email" name="email" placeholder="usuario@exemplo.com" required />
                            </label>
                            <label>
                                Senha
                                <input className="textInput"  type="password" name="password" placeholder="••••••••" minLength={6} required/>
                            </label>

                            {loginAttempts >= 1 && (
                                <a href="#" className="link_forgot">Esqueci a senha</a>
                            )}

                            {/* <label className="remember-me">
                                <input type="checkbox" name="remember_me"/> Lembre-se de mim
                            </label> */}

                            <button type="submit">Faça login</button>
                        </form>
                    ) : (
                        <form onSubmit={handleSignupSubmit}>
                            <label>
                                Seu nome
                                <input className="textInput"  type="text" name="name" placeholder="Ana Silva"  required/>
                            </label>
                            <label>
                                Email
                                <input className="textInput"  type="email" name="email" placeholder="ana@exemplo.com" required/>
                            </label>
                            <label>
                                Senha
                                <input className="textInput"  type="password" name="password" placeholder="••••••••" minLength={6} required/>
                            </label>
                            <label>
                                Repita a senha
                                <input className="textInput"  type="password" name="confirm_password" placeholder="••••••••" minLength={6} required/>
                            </label>
                            <button type="submit">Cadastrar</button>
                        </form>
                )}

                <span className="login_signup_link_span">
                    {isLoginView ? "Não tem uma conta? " : "Já tem conta? "}
                    <Link to={isLoginView ? "/signup" : "/login"} className="link"
                        style={{ cursor: 'pointer', color: 'blue', textDecoration: 'none' }}>
                        {isLoginView ? "Cadastre-se" : "Faça Login"}
                    </Link>
                </span>

                {errorMessage && (<div className="error">{errorMessage}</div>)}
            </div>
        </div>
    </div>
    );
}

export default AuthPage