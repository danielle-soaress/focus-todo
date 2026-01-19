
import './HomePage.scss'
import Navbar from '../../components/Navbar/Navbar'
import homeImg from '../../assets/home_img.svg'

function HomePage() {
  return (
    <>
    <div className="mesh_gradient">
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>
    </div>
    <div className="body_div">
      <Navbar login="true" signup="true"/>

      <div className="home_content">
        <div className="text_container">
          <div className="text_gradient">
            <span>faça planos,</span>
            <span>anote,</span>
            <span>pratique.</span>
          </div>
          <p>Seu gerenciador de tarefas digital. <br/>Experimente agora.</p>
        </div>
        <img src={homeImg}></img>
      </div>
    </div>
    </>
  )
}

export default HomePage