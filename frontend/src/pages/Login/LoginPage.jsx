
import React, { useState } from 'react';
import './LoginPage.scss'
import Navbar from '../../components/Navbar/Navbar'
import homeImg from '../../assets/home_img.svg'
import spiralIcon from '../../assets/spiral.svg'

function LoginPage({introduce_text = "Bem-vindo!", initialLoginState = true}) {
    const [loginAttempts, setLoginAttempts] = useState(0); 
    const [isLoginView, setIsLoginView] = useState(initialLoginState);

    const handleLoginSubmit = (e) => {
        e.preventDefault();
        setLoginAttempts(prev => prev + 1); 
    };

    return (
    <div className="login_container">
        <Navbar login={!isLoginView} signup={isLoginView}/>

        <div className="login_content">
            <div className="left_content">
                <p>Transforme sua lista de tarefas,<br/>Realize pequenas vitórias diárias.</p>
            </div>
            <div className="right_content">
                <span class="introduction_text_span">
                    <img src={spiralIcon}/>
                    <p className="introduce_text">{introduce_text}</p>
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
                    <a className="link"  
                        onClick={() => setIsLoginView(!isLoginView)} 
                        style={{ cursor: 'pointer', color: 'blue' }}>
                        {isLoginView ? "Cadastre-se" : "Faça Login"}
                    </a>
                </span>
            </div>
        </div>
    </div>
    );
}

export default LoginPage