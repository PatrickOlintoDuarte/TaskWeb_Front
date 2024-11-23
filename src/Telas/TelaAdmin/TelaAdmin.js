import React, { useState, useEffect, useRef } from 'react';
import './TelaAdmin.css';
import Header from '../../Header/Header.js';
import Chart from 'chart.js/auto';
import { db } from '../../firebase.js';
import { collection, getDocs } from 'firebase/firestore';

const TelaAdmin = () => {
    const [opcaoSelecionada, setOpcaoSelecionada] = useState('VISÃO GERAL');
    const [chamadosData, setChamadosData] = useState({ labels: [], data: [] });
    const [analistas, setAnalistas] = useState([]);
    const [chamadosCount, setChamadosCount] = useState(0);
    const [statusCounts, setStatusCounts] = useState({
        aberto: 0,
        andamento: 0,
        pendente: 0,
        concluido: 0
    });
    const [motivoData, setMotivoData] = useState({ labels: [], data: [] });

    const chartInstance = useRef(null);
    const motivoChartInstance = useRef(null);
    const canvasRef = useRef(null);
    const motivoCanvasRef = useRef(null);

    useEffect(() => {
        const loadChamadosData = async () => {
            try {
                const chamadosCollection = collection(db, 'atividades');
                const chamadosSnapshot = await getDocs(chamadosCollection);
                const chamadosList = chamadosSnapshot.docs.map(doc => doc.data());

                // Mapear a quantidade de atividades por analista
                const analistaAtividades = {};
                chamadosList.forEach(item => {
                    const nomeAnalista = item.nomeAnalista;
                    if (analistaAtividades[nomeAnalista]) {
                        analistaAtividades[nomeAnalista]++;
                    } else {
                        analistaAtividades[nomeAnalista] = 1;
                    }
                });

                // Atualizar labels e data para o gráfico
                const labels = Object.keys(analistaAtividades);
                const data = Object.values(analistaAtividades);

                setChamadosData({ labels, data });
                setChamadosCount(chamadosList.length);

                const statusCounts = {
                    aberto: chamadosList.filter(item => item.status === 'Aberto').length,
                    andamento: chamadosList.filter(item => item.status === 'Em andamento').length,
                    pendente: chamadosList.filter(item => item.status === 'Pendente').length,
                    concluido: chamadosList.filter(item => item.status === 'Concluído').length
                };

                setStatusCounts(statusCounts);
            } catch (error) {
                console.error('Erro ao buscar dados dos chamados:', error);
            }
        };

        const loadAnalistasData = async () => {
            try {
                const analistasCollection = collection(db, 'analistas');
                const analistasSnapshot = await getDocs(analistasCollection);
                const analistasList = analistasSnapshot.docs.map(doc => doc.data().nomeCompleto);

                setAnalistas(analistasList);
            } catch (error) {
                console.error('Erro ao buscar dados dos analistas:', error);
            }
        };

        const loadMotivoData = async () => {
            try {
                const chamadosCollection = collection(db, 'atividades');
                const chamadosSnapshot = await getDocs(chamadosCollection);
                const chamadosList = chamadosSnapshot.docs.map(doc => doc.data());

                // Mapear a quantidade de atividades por motivo
                const motivoAtividades = {};
                chamadosList.forEach(item => {
                    const motivo = item.motivo;
                    if (motivoAtividades[motivo]) {
                        motivoAtividades[motivo]++;
                    } else {
                        motivoAtividades[motivo] = 1;
                    }
                });

                // Atualizar labels e data para o gráfico de motivos
                const motivoLabels = Object.keys(motivoAtividades);
                const motivoData = Object.values(motivoAtividades);

                setMotivoData({ labels: motivoLabels, data: motivoData });
            } catch (error) {
                console.error('Erro ao buscar dados dos motivos:', error);
            }
        };

        if (opcaoSelecionada === 'VISÃO GERAL') {
            loadChamadosData();
            loadAnalistasData();
        } else if (opcaoSelecionada === 'PROJETO') {
            loadChamadosData();
        } else if (opcaoSelecionada === 'EQUIPES') {
            loadMotivoData();
        }
    }, [opcaoSelecionada]);

    useEffect(() => {
        if (chamadosData.labels.length && chamadosData.data.length) {
            renderChamadosChart();
        }
    }, [chamadosData]);

    useEffect(() => {
        if (motivoData.labels.length && motivoData.data.length) {
            renderMotivoChart();
        }
    }, [motivoData]);

    const renderChamadosChart = () => {
        if (chartInstance.current) {
            chartInstance.current.destroy();
        }

        chartInstance.current = new Chart(canvasRef.current, {
            type: 'bar',
            data: {
                labels: chamadosData.labels,
                datasets: [{
                    label: 'Quantidade de Atividades por Analista',
                    data: chamadosData.data,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    };

    const renderMotivoChart = () => {
        if (motivoChartInstance.current) {
            motivoChartInstance.current.destroy();
        }

        motivoChartInstance.current = new Chart(motivoCanvasRef.current, {
            type: 'pie', // Changed chart type to 'pie'
            data: {
                labels: motivoData.labels,
                datasets: [{
                    label: 'Quantidade de Chamados por Motivo',
                    data: motivoData.data,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1,
                }]
            },
            options: {
                responsive: true
            }
        });
    };

    return (
        <div>
            <Header />
            <div className="tela-Admin">
                <div className="menu-topo">
                    <button onClick={() => setOpcaoSelecionada('VISÃO GERAL')}>VISÃO GERAL</button>
                    <button onClick={() => setOpcaoSelecionada('PROJETO')}>PROJETOS</button>
                    <button onClick={() => setOpcaoSelecionada('EQUIPES')}>EQUIPES</button>
                </div>
                
                <div className="conteudo-principal">
                    {opcaoSelecionada === 'VISÃO GERAL' && (
                        <div>
                            <h1>Visão Geral</h1>
                            <canvas ref={canvasRef} id="chamadosChart" width="400" height="200"></canvas>
                            <h2>Analistas:</h2>
                            <ul>
                                {analistas.map((nome, index) => (
                                    <li key={index}>{nome}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {opcaoSelecionada === 'PROJETO' && (
                        <div className="projeto-container">
                            <h1>Projetos</h1>
                            <div className="chamados-total">
                                <div className="chamados-quadrado">
                                    <h2>Total de Chamados</h2>
                                    <p>{chamadosCount}</p>
                                </div>
                            </div>
                            <div className="chamados-status">
                                <div className="status-quadrado">
                                    <h3>Abertos</h3>
                                    <p>{statusCounts.aberto}</p>
                                </div>
                                <div className="status-quadrado">
                                    <h3>Em Andamento</h3>
                                    <p>{statusCounts.andamento}</p>
                                </div>
                                <div className="status-quadrado">
                                    <h3>Pendentes</h3>
                                    <p>{statusCounts.pendente}</p>
                                </div>
                                <div className="status-quadrado">
                                    <h3>Concluídos</h3>
                                    <p>{statusCounts.concluido}</p>
                                </div>
                            </div>
                        </div>
                    )}
                    {opcaoSelecionada === 'EQUIPES' && (
                        <div>
                            <h1>Tarefas</h1>
                            <canvas ref={motivoCanvasRef} id="motivoChart" width="400" height="200"></canvas>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default TelaAdmin;
