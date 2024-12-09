import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import {ChakraProvider} from "@chakra-ui/react";

//const res = await customFetch("/initiatives")
// fetch('/api/v1/initiatives')
//     .then((res) => res.json())
//     .then((data) => console.log(data));

createRoot(document.getElementById('root')).render(
  <StrictMode>
        <App />
        <ToastContainer position='top-center' />
  </StrictMode>,
)
