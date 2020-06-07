import express from 'express';
import cors from 'cors';
import path from 'path';
import routes from './routes';
import { errors } from 'celebrate';

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);

app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')))

app.use(errors());

app.listen(3333);

/*
// Request Params: Parâmentros que vem na própria rota que identificam um recurso
// Query Params: Parâmetros que vem na própria rota geralmente opcionais para filtro, paginação
// Request Body: Parâmetros para criação/atualização de informações


app.get('/users',(request, response) => {
    const search = String(request.query.search);
    
    const filteredUsers = search ? users.filter(user => user.includes(search)) : users;

    response.json(filteredUsers);
});

app.get('/users/:id', (request, response) => {
    const id = Number(request.params.id);

    const user = users[id];

    return response.json(user);
});

app.post('/users',(request, response) => {
    
    const data = request.body;

    const user = {
        name: data.name,
        email: data.email
    };

    return response.json(user);
});
*/

