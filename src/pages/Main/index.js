import React, { Component } from 'react';
import { FaGithubAlt, FaPlus, FaSpinner } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import api from '../../services/api';

import { Form, SubmitButton, List, MsgError } from './styles';
import Container from '../../components/Container';

export default class  Main extends Component {
    state = {
        newRepo: '',
        repositories: [],
        loading: false,
        error: false
    }

    componentDidMount(){
        const repositories = localStorage.getItem('repositories');
        if(repositories){
            this.setState({ repositories: JSON.parse(repositories)})
        }
    }

    componentDidUpdate(_, prevState){
        const { repositories } = this.state;
        if(prevState.repositories !== this.state.repositories){
            localStorage.setItem('repositories', JSON.stringify(repositories));
        }
    }

    handleInputChange = e => {
        this.setState({ newRepo: e.target.value });
    }

    handleSubmit = async e => {
        this.setState({ loading: true});
        const { newRepo, repositories } = this.state;
        e.preventDefault();
        try{
            const response = await api.get(`/repos/${newRepo}`);
            const data = {
                name: response.data.full_name
            };

            this.setState({
                repositories: [...repositories, data],
                newRepo: '',
            });
        }catch(err){
            this.setState({
                error: true,
            });
            setTimeout(() => {
                this.setState({
                    error: false,
                });
            }, 5000);
        }finally{
            this.setState({
                loading: false,
            })
        }
    }

    render(){
        const { newRepo, loading, repositories, error } = this.state;

        return (
            <Container>
                <h1>
                    <FaGithubAlt />
                    Repositórios
                </h1>
                <Form onSubmit={this.handleSubmit}>
                    <input
                    value={newRepo}
                    onChange={this.handleInputChange}
                     type="text" placeholder="Adicionar repositórios" />
                    <SubmitButton loading={loading}>
                        { loading ?  (<FaSpinner color="#FFF" size={14} />) :
                            (<FaPlus color="#FFF" size={14} />)
                        }
                    </SubmitButton>
                </Form>

                {
                    error ?
                    <MsgError>
                        Repositório não encontrado
                    </MsgError> :
                    null
                }

                <List>
                    { repositories.map(repository => (
                        <li key={repository.name}>
                            <span>{repository.name}</span>
                            <Link to={`/repository/${encodeURIComponent(repository.name)}`}>Detalhes</Link>
                        </li>
                    ))}
                </List>
            </Container>
          );
    }
}
