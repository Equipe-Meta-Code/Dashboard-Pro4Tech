
import "./modalVendas.scss";
import { MdClose } from "react-icons/md";

export default function Modal({isOpen, setModalOpen, children}) {
  if(isOpen){
    return (
      <div className="background-modalVendas">
        <div className="modalVendas">
            <button onClick={setModalOpen} className='botao-fechar'>
              <MdClose />
            </button>
            <div className='espaco'>
            </div>
            <div className='modalVendas-conteudo'>
              {children}
            </div>
        </div>
      </div>
    )
  }
  return null
}
