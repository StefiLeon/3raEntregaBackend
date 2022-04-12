import supertest from "supertest";
import chai, {expect} from 'chai';

const request = supertest("http://localhost:8080");
describe('testeando la API', () => {
    describe('metodo GET', () => {
        it('un req a la lista de productos debe devolver status code 200', async() => {
            let res = await request.get('/api/productos');
            expect(res.status).to.equal(200);
        })
        it('un req a lista de carritos debe devolver status code 200', async() => {
            let res = await request.get('/api/carrito');
            expect(res.status).to.equal(200);
        })
        it('un req con id de producto debe devolver el mismo', async() => {
            let pid = "61ce7269d9b72f3f85509efe";
            let res = await request.get(`/api/productos/${pid}`);
            expect(res.body._id).to.eql(pid);
            expect(res.body).to.include.keys('_id', 'name', 'code');
        })
    })
    describe('metodo POST', () => {
        it('un req a productos debe registrar un producto', async() => {
            let product = {
                name: 'taza quichicientos',
                description: 'Taza de ceramica',
                code: 247,
                price: 145,
                stock: 15,
                thumbnail: 'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/avatar-2-1583234102.jpg'
            }
            let res = await request.post('/api/productos/').send(product);
            expect(res.status).to.equal(200);
            let resBody = res.body;
            console.log(resBody)
        })
    })
})