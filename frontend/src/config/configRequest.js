//import RestModulos from 'config/fetchData/data.js';
import axios from "axios";
const RestModulos = 'http://localhost:3000'


export const ConfigRequest = (req, rota, id, data) => {
    try {
        switch (req) {
            case 'GET':
                return axios.get(`${RestModulos}/${rota}${id ? '/'+ id : ''}`);
            case 'POST':
                return axios.post(`${RestModulos}/${rota}`, data);
            case 'PUT':
                return axios.put(`${RestModulos}/${rota}/${id}`, data);
            case 'DELETE':
                return axios.delete(`${RestModulos}/${rota}/${id}`);
            default:
                break;
        }
    } catch (error) {
        console.log(error)
        return error;
    }
};