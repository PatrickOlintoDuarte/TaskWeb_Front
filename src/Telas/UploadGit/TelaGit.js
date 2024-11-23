import React, { useState } from 'react';
import axios from 'axios';
import './TelaGit.css';
import Header from '../../Header/Header.js';
 
function TelaGit() {
  const [projeto, setProjeto] = useState('');
  const [branch, setBranch] = useState('');
  const [file, setFile] = useState(null);
 
  const handleSubmit = async (e) => {
    e.preventDefault();
 
    const formData = new FormData();
    formData.append('projeto', projeto); // URL do repositório enviada pelo usuário
    formData.append('branch', branch);
    formData.append('file', file);
 
    try {
      await axios.post('http://localhost:3001/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        timeout: 60000 // Timeout de 60 segundos para evitar erro de timeout
      });
      alert('Arquivo enviado com sucesso!');
    } catch (error) {
      console.error('Erro ao enviar arquivo:', error);
      alert('Erro ao enviar arquivo. Por favor, tente novamente.');
    }
  };
 
  return (
    <div>
      <Header />
      <div className='telagit'>
        <body className='bodyy'>
          <form onSubmit={handleSubmit}>
            <h2>Insira as Informações</h2>
            <div className="input-container">
              <label htmlFor="projeto">Projeto (URL do repositório Git):</label>
              <input
                type="text"
                id="projeto"
                value={projeto}
                onChange={(e) => setProjeto(e.target.value)}
                placeholder="Digite a URL do repositório"
              />
            </div>
            <div className="input-container">
              <label htmlFor="branch">Branch:</label>
              <input
                type="text"
                id="branch"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                placeholder="Digite o nome da branch"
              />
            </div>
            <div className="input-container">
              <label htmlFor="arquivo">Anexar:</label>
              <input
                type="file"
                id="arquivo"
                onChange={(e) => setFile(e.target.files[0])}
                name="file"
              />
            </div>
            <button type="submit">Enviar</button>
          </form>
        </body>
      </div>
    </div>
  );
}
 
export default TelaGit;