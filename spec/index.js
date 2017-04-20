import chai from 'chai';
import chaiHttp from 'chai-http';
import React from 'react';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';
import 'isomorphic-fetch';
import fetchMock from 'fetch-mock';

import server from './../server';
import App from './../client/src/App';
import SpreadsheetInput from './../client/src/App/NavigationBar/SpreadsheetInput';
import Authentication from './../client/src/App/NavigationBar/Authentication';

const should = chai.should();

chai.use(chaiHttp);

describe('Endpoints', () => {
  describe('/credentials:', () => {
    it('should GET an object credentials', (done) => {
      chai.request(server)
      .get('/credentials')
      .end((error, response) => {
        response.should.have.status(200);
        response.body.should.be.an('object');
        response.body.should.have.property('credentials');
        response.body.credentials.should.have.property('client_id');
        done();
      });
    });
  });
});

describe('Component rendering', () => {
  // Define Google Authentication stubs
  const propStub = () => {};
  const GoogleAuth = () => {};
  const accessTokenStub = { access_token: 'access_token_stub' };
  const getAuthResponse = () => accessTokenStub;
  const isSignedIn = () => true;
  const currentUserStub = { getAuthResponse, isSignedIn };
  const thenWrapper = {
    then: (callback) => {
      callback();
    },
  };

  GoogleAuth.currentUser = {};
  GoogleAuth.currentUser.get = () => currentUserStub;
  GoogleAuth.signIn = () => thenWrapper;
  GoogleAuth.signOut = () => thenWrapper;

  before((done) => {
    // Load Google scripts and populate the global space
    const scripts = document.getElementsByTagName('script');
    scripts[0].onload = () => {
      scripts[1].onload = () => {
        global.gapi = window.gapi;
        global.google = window.google;
        // Stub out google chart api
        global.google.visualization = {};
        done();
      };
    };
  });

  describe('Essential components:', () => {
    it('should render a url input field', () => {
      const wrapper = shallow(<SpreadsheetInput ingestSpreadsheet={propStub} signedIn={true} />);
      const inputElement = wrapper.find('input');
      const props = inputElement.node.props;
      inputElement.should.have.length(1);
      props.should.have.property('type');
      props.type.should.equal('url');
    });
  });

  describe('No charts should be rendered for:', () => {
    it('non-url inputs', (done) => {
      const match = { params: { sheetId: '' } };
      const wrapper = mount(<App match={match} />);
      wrapper.instance().setState({ signedIn: true });
      wrapper.find('form').simulate('submit', {
        target: [{ value: 'This string is not a valid url' }],
      });

      wrapper.state('columns').should.have.length(0);
      done();
    });

    it('domains other than docs.google.com', (done) => {
      const match = { params: { sheetId: '' } };
      const wrapper = mount(<App match={match} />);
      wrapper.instance().setState({ signedIn: true });
      wrapper.find('form').simulate('submit', {
        target: [{ value: 'http://google.com' }],
      });

      wrapper.state('columns').should.have.length(0);
      done();
    });
  });

  describe('Submitting a sheet:', () => {
    it('should call google.visualization.query and query.send once', (done) => {
      const pushStub = {
        push: sinon.spy(),
      };

      const wrapper = mount(<SpreadsheetInput signedIn={true} history={pushStub} />);
      wrapper.find('form').simulate('submit', {
        target: [{ value: 'https://docs.google.com/spreadsheets/d/stubsheetID/' }],
      });

      pushStub.push.should.have.property('callCount', 1);
      done();
    });
  });

  describe('Sign-in:', () => {
    it('should attach access_token to state', (done) => {
      const match = { params: { sheetId: '' } };
      const wrapper = mount(<App match={match} />);
      wrapper.instance().updateAccessToken('access_token_stub');

      wrapper.state('accessToken').should.equal('access_token_stub');
      done();
    });
  });
});
