import React from 'react'
import { AiOutlineCopyrightCircle } from "react-icons/ai";

const Footer = () => {
  return (
    <section className="footer h-[10vh] bg-gray-50">
        <footer className='flex justify-center md:text-base text-sm font-bold text-black w-full h-full items-center'>
        <AiOutlineCopyrightCircle size={23}/>2024,&nbsp; Built by &nbsp;<a href="https://erickngugi.netlify.app/" target='_blank' className='underline text-blue-600 hover:text-blue-700'> Erick Ngugi</a>. All rights Reserved
        </footer>
    </section>
  )
}

export default Footer