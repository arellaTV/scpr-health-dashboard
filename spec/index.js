const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const should = chai.should();

chai.use(chaiHttp);

describe('Endpoints:', () => {
  describe('/charts', () => {
    it('should GET a collection of charts', (done) => {
      chai.request(server)
      .get('/charts')
      .end((error, response) => {
        response.should.have.status(200);
        response.body.should.be.a('array');
        done();
      });
    });
  });
});

