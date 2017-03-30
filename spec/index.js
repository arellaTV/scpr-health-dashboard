import chai from 'chai';
import chaiHttp from 'chai-http';
import React from 'react';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';
import server from './../server';
import App from './../client/src/App';
import SpreadsheetInput from './../client/src/App/SpreadsheetInput';
import Authentication from './../client/src/App/Authentication';

const should = chai.should();

chai.use(chaiHttp);

describe('Endpoints', () => {
  describe('/credentials:', () => {
    it('should GET an object with client_id and scope', (done) => {
      chai.request(server)
      .get('/credentials')
      .end((error, response) => {
        response.should.have.status(200);
        response.body.should.be.an('object');
        response.body.should.have.property('client_id');
        response.body.should.have.property('scope');
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
      const wrapper = shallow(<SpreadsheetInput ingestSpreadsheet={propStub} />);
      const inputElement = wrapper.find('input');
      const props = inputElement.node.props;
      inputElement.should.have.length(1);
      props.should.have.property('type');
      props.type.should.equal('url');
    });

    it('should render a single authentication button', () => {
      const wrapper = shallow(<Authentication updateAccessToken={propStub} />);
      wrapper.find('button').should.have.length(1);
    });
  });

  describe('No charts should be rendered for:', () => {
    it('non-url inputs', (done) => {
      const wrapper = mount(<App />);
      wrapper.find('form').simulate('submit', {
        target: [{ value: 'This string is not a valid url' }],
      });

      wrapper.state('columns').should.have.length(0);
      done();
    });

    it('domains other than docs.google.com', (done) => {
      const wrapper = mount(<App />);
      wrapper.find('form').simulate('submit', {
        target: [{ value: 'http://google.com' }],
      });

      wrapper.state('columns').should.have.length(0);
      done();
    });
  });

  describe('Submitting a sheet:', () => {
    it('should call google.visualization.query and query.send once', (done) => {
      google.visualization.Query = sinon.spy();
      google.visualization.Query.prototype.send = sinon.spy();

      const wrapper = mount(<App />);
      wrapper.find('form').simulate('submit', {
        target: [{ value: 'https://docs.google.com/spreadsheets/d/stubsheetID/' }],
      });

      google.visualization.Query.should.have.property('callCount', 1);
      google.visualization.Query.prototype.send.should.have.property('callCount', 1);
      done();
    });
  });

  describe('Sign-in:', () => {
    it('should render a sign in button', (done) => {
      const wrapper = shallow(<Authentication updateAccessToken={propStub} />);
      const button = wrapper.find('button');
      button.should.have.length(1);
      button.prop('children').should.equal('Sign in');
      wrapper.state('authenticationButton').should.equal('Sign in');
      done();
    });

    it('should render a sign out button after signing in', (done) => {
      const wrapper = shallow(<Authentication updateAccessToken={propStub} />);
      wrapper.instance().setState({ GoogleAuth });
      wrapper.instance().handleSignIn();

      const button = wrapper.find('button');
      button.should.have.length(1);
      button.prop('children').should.equal('Sign out');
      wrapper.state('authenticationButton').should.equal('Sign out');
      done();
    });

    it('should attach access_token to state', (done) => {
      const wrapper = shallow(<App />);
      wrapper.instance().updateAccessToken('access_token_stub');

      wrapper.state('accessToken').should.equal('access_token_stub');
      done();
    });
  });

  describe('Sign-out:', () => {
    it('should sign out on clicking Sign out', (done) => {
      const stub = sinon.spy();
      const wrapper = mount(<Authentication updateAccessToken={stub} />);
      wrapper.instance().setState({ GoogleAuth });
      wrapper.instance().setState({ authenticationButton: 'Sign out' });
      const button = wrapper.find('button');
      button.simulate('click');
      stub.should.have.property('callCount', 1);
      done();
    });

    it('should render a sign in button after successful sign out', (done) => {
      const wrapper = mount(<Authentication updateAccessToken={propStub} />);
      const button = wrapper.find('button');
      wrapper.instance().setState({ GoogleAuth });
      wrapper.instance().setState({ authenticationButton: 'Sign out' });
      wrapper.state('authenticationButton').should.equal('Sign out');
      button.prop('children').should.equal('Sign out');

      button.simulate('click');
      button.prop('children').should.equal('Sign in');
      wrapper.state('authenticationButton').should.equal('Sign in');
      done();
    });

    it('should destroy the access token', (done) => {
      const stub = sinon.spy();
      const wrapper = shallow(<Authentication updateAccessToken={stub} />);
      wrapper.instance().setState({ GoogleAuth });
      wrapper.instance().setState({ authenticationButton: 'Sign out' });
      wrapper.instance().handleSignOut();
      wrapper.state('authenticationButton').should.equal('Sign in');
      stub.calledWith(null).should.equal(true);
      done();
    });
  });
});
