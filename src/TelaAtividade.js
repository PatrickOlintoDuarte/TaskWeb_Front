import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';
import { firebaseConfig } from './firebase';
import './TelaAtividade.css';
import Header from './Header/Header.js';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const TelaAtividade = () => {
    const [motivo, setMotivo] = useState('');
    const [dataTermino, setDataTermino] = useState('');
    const [nomeAnalista, setNomeAnalista] = useState('');
    const [descricao, setDescricao] = useState('');
    const [status, setStatus] = useState('');
    const [analistas, setAnalistas] = useState([]); // Estado para armazenar os analistas

    useEffect(() => {
        const fetchAnalistas = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'analistas'));
                const analistasData = querySnapshot.docs.map(doc => doc.data().nomeCompleto); // Presumindo que o campo com o nome do analista seja "nome"
                setAnalistas(analistasData);
            } catch (error) {
                console.error("Erro ao buscar analistas: ", error);
            }
        };

        fetchAnalistas(); // Chama a função para buscar os analistas
    }, []);

    const salvarDadosNoFirestore = async () => {
        if (!db) {
            console.error("Referência do Firestore não está definida!");
            return;
        }

        try {
            const docRef = await addDoc(collection(db, 'atividades'), {
                motivo: motivo,
                dataTermino: new Date(dataTermino),
                nomeAnalista: nomeAnalista,
                descricao: descricao,
                status: status
            });
            console.log("Documento criado com ID: ", docRef.id);
            limparCampos();
        } catch (error) {
            console.error("Erro ao salvar os dados: ", error);
        }
    };

    const limparCampos = () => {
        setMotivo('');
        setDataTermino('');
        setNomeAnalista('');
        setDescricao('');
        setStatus('');
    };

    return (
        <div>
            <Header />
            <div className="tela-atividade">
                <div className="form-container">
                    <h2>Nova Atividade</h2>
                    <div>
                        <label>Chamado:</label>
                        <input
                            type="text"
                            value={motivo}
                            onChange={(e) => setMotivo(e.target.value)}
                        />
                    </div>
                    <div>
                        <label>Data de Término:</label>
                        <input
                            type="date"
                            value={dataTermino}
                            onChange={(e) => setDataTermino(e.target.value)}
                        />
                    </div>
                    <div>
                        <label>Nome do Analista:</label>
                        <select
                            value={nomeAnalista}
                            onChange={(e) => setNomeAnalista(e.target.value)}
                        >
                            <option value="">Selecione o analista</option>
                            {analistas.map((analista, index) => (
                                <option key={index} value={analista}>{analista}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label>Descrição:</label>
                        <textarea
                            value={descricao}
                            onChange={(e) => setDescricao(e.target.value)}
                        />
                    </div>
                    <div>
                        <label>Status:</label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <option value="">Selecione o status</option>
                            <option value="Concluído">Concluído</option>
                            <option value="Em andamento">Em andamento</option>
                            <option value="Aberto">Aberto</option>
                            <option value="Pendente">Pendente</option>
                        </select>
                    </div>
                    <div>
                        <button onClick={limparCampos}>Limpar</button>
                        <button onClick={salvarDadosNoFirestore}>Salvar</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TelaAtividade;
