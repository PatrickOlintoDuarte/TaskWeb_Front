import React from 'react';
import { HashRouter as Router, Route } from 'react-router-dom';
import Login from './Componentes/auth/Login';
import TelaAtividade from '../TelaAtividade';
import TelaGit from '../Telas/UploadGit/TelaGit';
import ConsultarMetricas from '../Telas/ConsultarMetricas/ConsultarMetricas';
import GerenciarAnalista from '../Telas/GerenciarAnalista/GerenciarAnalista';
import TelaAdmin from '../TelaAdmin/TelaAdmin';
import Teste from './Teste'; // Import da tela Teste
import TelaInicial from './TelaInicial'; // Import da tela TelaInicial

const Routes = () => {
    return (
        <Router>
            <Route path='/teste' component={Teste}/> {/* Mantendo a tela Teste */}
            <Route path='/login' component={Login}/>
            <Route path='/telainicial' component={TelaInicial}/>
            <Route path='/telaatividade' component={TelaAtividade}/>
            <Route path='/telagit' component={TelaGit}/>
            <Route path='/consultarmetricas' component={ConsultarMetricas}/>
            <Route path='/gerenciaranalista' component={GerenciarAnalista}/>
            <Route path='/telaAdmin' component={TelaAdmin}/>
        </Router>
    );
};

export default Routes;
