
import { useState } from 'react';
import './AuthPage.scss'
import Navbar from '../../components/Navbar/Navbar'
import spiralIcon from '../../assets/spiral.svg'
import {Link, useNavigate, useLocation } from 'react-router-dom';

function AuthPage() {
    const navigate = useNavigate();
    const location = useLocation();

    const isLoginView = location.pathname === '/login';

    const [loginAttempts, setLoginAttempts] = useState(0); 

    // to-do
    const handleLoginSubmit = (e) => {
        e.preventDefault();
        console.log("Tentando logar...");
        setLoginAttempts(prev => prev + 1);
        // Se der certo:
        // navigate('/dashboard');
    };

    // to-do
    const handleSignupSubmit = (e) => {
        e.preventDefault();
        console.log("Tentando cadastrar...");

        // Se der certo:
        // navigate('/dashboard'); 
    };

    return (
    <div className="login_container">
        <Navbar login={!isLoginView} signup={isLoginView} />

        <div className="login_content">
            <div className="left_content">
                <p>Transforme sua lista de tarefas,<br/>Realize pequenas vitórias diárias.</p>
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
                                <input className="textInput"  type="password" name="password" placeholder="••••••••" required />
                            </label>

                            {loginAttempts >= 2 && (
                                <a href="#" className="link_forgot">Esqueci a senha</a>
                            )}

                            <label className="remember-me">
                                <input type="checkbox" name="remember_me"/> Lembre-se de mim
                            </label>


                            <button type="submit">Faça login</button>

                            
                        </form>
                    ) : (
                        <form>
                            <label>
                                Seu nome
                                <input className="textInput"  type="text" name="name" placeholder="Ana Silva" />
                            </label>
                            <label>
                                Email
                                <input className="textInput"  type="email" name="email" placeholder="ana@exemplo.com" />
                            </label>
                            <label>
                                Senha
                                <input className="textInput"  type="password" name="password" placeholder="••••••••" />
                            </label>
                            <label>
                                Repita a senha
                                <input className="textInput"  type="password" name="password" placeholder="••••••••" />
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
            </div>
        </div>
    </div>
    );
}

export default AuthPage