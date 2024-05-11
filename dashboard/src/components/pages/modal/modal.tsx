import zIndex from '@mui/material/styles/zIndex'
import React from 'react'
import "./modal.scss";
import { MdClose } from "react-icons/md";

export default function Modal({isOpen, setModalOpen, children}) {
  if(isOpen){
    return (
      <div className="background-modal">
        <div className="modal">
            <button onClick={setModalOpen} className='botao-fechar'>
              <MdClose />
            </button>
            <div className='espaco'>
            </div>
            <div className='modal-conteudo'>
              {children}
            </div>
        </div>
      </div>
    )
  }
  return null
}
