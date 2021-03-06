import expect  from 'expect.js';
import Promise from 'bluebird';
import sinon   from 'sinon';

import EasyAgent from '../EasyAgent';

describe('EasyAgent', () => {
  describe('Initialize', () => {
    it('should throw an error when window.fetch is not a function', () => {
      const ea = EasyAgent.get('url');
      const f = ea.fetch.bind(ea);

      expect(f).to.be.throwError(err => {
        expect(err).to.be.a(ReferenceError);
      });
    });
  });

  describe('EasyAgent.get()', () => {
    it('should return an instance that method is GET', () => {
      const ea = EasyAgent.get('url');

      expect(ea.method).to.be('GET');
    });
  });

  describe('EasyAgent.post()', () => {
    it('should return an instance that method is POST', () => {
      const ea = EasyAgent.post('url');

      expect(ea.method).to.be('POST');
    });
  });

  describe('EasyAgent.put()', () => {
    it('should return an instance that method is PUT', () => {
      const ea = EasyAgent.put('url');

      expect(ea.method).to.be('PUT');
    });
  });

  describe('EasyAgent.del()', () => {
    it('should return an instance that method is DELETE', () => {
      const ea = EasyAgent.del('url');

      expect(ea.method).to.be('DELETE');
    });
  });

  describe('EasyAgent.head()', () => {
    it('should return an instance that method is HEAD', () => {
      const ea = EasyAgent.head('url');

      expect(ea.method).to.be('HEAD');
    });
  });

  describe('EasyAgent.opt()', () => {
    it('should return an instance that method is OPTIONS', () => {
      const ea = EasyAgent.opt('url');

      expect(ea.method).to.be('OPTIONS');
    });
  });

  describe('EasyAgent#setUrl()', () => {
    it('should return an instance that url is changed', () => {
      expect(
        EasyAgent.get('http://first.url')
          .setUrl('http://second.url')
          .url
      ).to.be('http://second.url');

      expect(
        EasyAgent.get('http://first.url')
          .setUrl('http://second.url')
          .setUrl('http://third.url')
          .url
      ).to.be('http://third.url');
    });

    it('should return an instance that is another reference', () => {
      const ea      = EasyAgent.get('http://first.url');
      const another = ea.setUrl('http://second.url');

      expect(ea).to.not.be(another);
      expect(ea.url).to.be('http://first.url');
      expect(another.url).to.be('http://second.url');
    });
  });

  describe('EasyAgent#setMethod()', () => {
    it('should return an instance that method is changed', () => {
      expect(
        EasyAgent.get('http://first.url')
          .setMethod('POST')
          .method
      ).to.be('POST');

      expect(
        EasyAgent.get('http://first.url')
          .setMethod('POST')
          .setMethod('PUT')
          .method
      ).to.be('PUT');
    });

    it('should return an instance that is another reference', () => {
      const ea      = EasyAgent.get('http://first.url');
      const another = ea.setMethod('POST');

      expect(ea).to.not.be(another);
      expect(ea.method).to.be('GET');
      expect(another.method).to.be('POST');
    });
  });

  describe('EasyAgent#setHeaders()', () => {
    it('should return an instance that headers is appended', () => {
      expect(
        EasyAgent.get('http://first.url')
          .setHeaders({ 'Content-Type': 'application/json' })
          .headers
      ).to.eql({ 'Content-Type': 'application/json' });

      expect(
        EasyAgent.get('http://first.url')
          .setHeaders({ 'Content-Type': 'application/json' })
          .setHeaders({ 'Accept': 'application/json' })
          .headers
      ).to.eql({
        'Content-Type': 'application/json',
        'Accept':       'application/json',
      });

      expect(
        EasyAgent.get('http://first.url')
          .setHeaders({
            'Content-Type': 'application/json',
            'Accept':       'application/json',
          })
          .setHeaders({ 'X-Custom-Header': 'with EasyAgent' })
          .headers
      ).to.eql({
        'Content-Type':    'application/json',
        'Accept':          'application/json',
        'X-Custom-Header': 'with EasyAgent',
      });
    });

    it('should return an instance that is another reference', () => {
      const ea      = EasyAgent.get('http://first.url');
      const another = ea.setHeaders({ 'Content-Type': 'application/json' });

      expect(ea).to.not.be(another);
      expect(ea.headers).to.eql({});
      expect(another.headers).to.eql({ 'Content-Type': 'application/json' });
    });
  });

  describe('EasyAgent#setQueries()', () => {
    it('should return an instance that queries is appended', () => {
      expect(
        EasyAgent.get('http://first.url')
          .setQueries({ q: 'easyagent' })
          .queries
      ).to.eql({ q: 'easyagent' });

      expect(
        EasyAgent.get('http://first.url')
          .setQueries({ q: 'easyagent' })
          .setQueries({ page: 2 })
          .queries
      ).to.eql({
        q:    'easyagent',
        page: 2,
      });

      expect(
        EasyAgent.get('http://first.url')
          .setQueries({
            q:    'easyagent',
            page: 2,
          })
          .setQueries({ order: 'desc' })
          .queries
      ).to.eql({
        q:     'easyagent',
        page:  2,
        order: 'desc',
      });
    });

    it('should return an instance that is another reference', () => {
      const ea      = EasyAgent.get('http://first.url');
      const another = ea.setQueries({ q: 'easyagent' });

      expect(ea).to.not.be(another);
      expect(ea.queries).to.eql({});
      expect(another.queries).to.eql({ q: 'easyagent' });
    });
  });

  describe('EasyAgent#setBody()', () => {
    it('should return an instance that body is changed', () => {
      expect(
        EasyAgent.get('http://first.url')
          .setBody('body')
          .body
      ).to.be('body');

      expect(
        EasyAgent.get('http://first.url')
          .setQueries({ q: 'easyagent' })
          .setBody('body')
          .body
      ).to.be('body');

      expect(
        EasyAgent.get('http://first.url')
          .setJson({ q: 'easyagent' })
          .setBody('body')
          .body
      ).to.be('body');

      expect(
        EasyAgent.get('http://first.url')
          .setBody('body')
          .headers
      ).to.eql({});
    });

    it('should return an instance that is another reference', () => {
      const ea      = EasyAgent.get('http://first.url');
      const another = ea.setBody('body');

      expect(ea).to.not.be(another);
      expect(ea.body).to.eql(null);
      expect(another.body).to.eql('body');
    });
  });

  describe('EasyAgent#setJson()', () => {
    it('should return an instance that body is changed', () => {
      expect(
        EasyAgent.get('http://first.url')
          .setJson({ q: 'easyagent' })
          .body
      ).to.be('{"q":"easyagent"}');

      expect(
        EasyAgent.get('http://first.url')
          .setQueries({ order: 'desc' })
          .setJson({ page: 2 })
          .body
      ).to.be('{"page":2}');

      expect(
        EasyAgent.get('http://first.url')
          .setBody('body')
          .setJson({ fork: true })
          .body
      ).to.be('{"fork":true}');
    });

    it('should return an instance that headers is appended', () => {
      expect(
        EasyAgent.get('http://first.url')
          .setJson({ q: 'easyagent' })
          .headers
      ).to.eql({ 'Content-Type': 'application/json' });

      expect(
        EasyAgent.get('http://first.url')
          .setForm({})
          .setJson({ q: 'easyagent' })
          .headers
      ).to.eql({ 'Content-Type': 'application/json' });
    });

    it('should return an instance that is another reference', () => {
      const ea      = EasyAgent.get('http://first.url');
      const another = ea.setJson({ q: 'easyagent' });

      expect(ea).to.not.be(another);
      expect(ea.body).to.eql(null);
      expect(another.body).to.eql('{"q":"easyagent"}');
    });
  });

  describe('EasyAgent#setForm()', () => {
    it('should return an instance that body is changed', () => {
      expect(
        EasyAgent.get('http://first.url')
          .setForm({})
          .body
      ).to.eql({});

      expect(
        EasyAgent.get('http://first.url')
          .setQueries({ order: 'desc' })
          .setForm({})
          .body
      ).to.eql({});

      expect(
        EasyAgent.get('http://first.url')
          .setBody('body')
          .setForm({})
          .body
      ).to.eql({});
    });

    it('should return an instance that headers is appended', () => {
      expect(
        EasyAgent.get('http://first.url')
          .setForm({})
          .headers
      ).to.eql({ 'Content-Type': 'application/x-www-form-urlencoded' });

      expect(
        EasyAgent.get('http://first.url')
          .setJson({ q: 'easyagent' })
          .setForm({})
          .headers
      ).to.eql({ 'Content-Type': 'application/x-www-form-urlencoded' });
    });

    it('should return an instance that is another reference', () => {
      const ea      = EasyAgent.get('http://first.url');
      const another = ea.setForm({ q: 'easyagent' });

      expect(ea).to.not.be(another);
      expect(ea.body).to.eql(null);
      expect(another.body).to.eql({ q: 'easyagent' });
    });
  });

  describe('EasyAgent#fetch()', () => {
    afterEach(() => {
      EasyAgent.setFetchFunction(() => {
        throw new ReferenceError('fetch is not defined');
      });
    });

    it('should call fetch function with arguments', () => {
      const fetchStub = () => Promise.resolve(true);
      const fetchSpy  = sinon.spy(fetchStub);

      EasyAgent.setFetchFunction(fetchSpy);
      EasyAgent.get('http://first.url', {
        method: 'GET',
        queries: { q: 'easyagent', page: 5 },
        headers: { 'Accept': 'text/html' },
      })
        .fetch();

      expect(fetchSpy.calledOnce).to.be(true);
      expect(fetchSpy.firstCall.args[0]).to.be('http://first.url?q=easyagent&page=5');
      expect(fetchSpy.firstCall.args[1]).to.eql({
        method:  'GET',
        headers: { 'Accept': 'text/html' },
        body:    null,
      });
    });

    it('should call fetch function with arguments #2', () => {
      const fetchStub = () => Promise.resolve(true);
      const fetchSpy  = sinon.spy(fetchStub);

      EasyAgent.setFetchFunction(fetchSpy);
      EasyAgent.get('http://second.url/3', {
        method: 'PUT',
        queries: {
          force:   true,
          users:   ['axross', 'axr', 'oss'],
          profile: { name: 'Kohei Asai', role: 'Software Engineer' },
        },
        headers: { 'Accept': 'text/html' },
      })
        .setJson({
          name:    'easyagent',
          repoUrl: 'https://github.com/axross/easyagent'
        })
        .fetch();

      expect(fetchSpy.calledOnce).to.be(true);
      expect(fetchSpy.firstCall.args[0]).to.be(
        'http://second.url/3?force=true&users[]=axross&users[]=axr&users[]=oss&profile[name]=Kohei%20Asai&profile[role]=Software%20Engineer'
      );
      expect(fetchSpy.firstCall.args[1]).to.eql({
        method: 'PUT',
        headers: {
          'Accept':       'text/html',
          'Content-Type': 'application/json',
        },
        body: '{"name":"easyagent","repoUrl":"https://github.com/axross/easyagent"}',
      });
    });
  });

  describe('EasyAgent#fetchJson()', () => {
    afterEach(() => {
      EasyAgent.setFetchFunction(() => {
        throw new ReferenceError('fetch is not defined');
      });
    });

    it('should call response.json() from arguments of fetch.then()\'s callback', done => {
      const jsonSpy   = sinon.spy();
      const fetchStub = () => Promise.resolve({ json: jsonSpy });
      const fetchSpy  = sinon.spy(fetchStub);

      EasyAgent.setFetchFunction(fetchSpy);
      EasyAgent.post('http://first.url')
        .setJson({ q: 'easyagent' })
        .fetchJson()
        .then(() => {
          expect(jsonSpy.calledOnce).to.be(true);
          done();
        });

      expect(fetchSpy.calledOnce).to.be(true);
      expect(fetchSpy.firstCall.args[0]).to.be('http://first.url');
      expect(fetchSpy.firstCall.args[1]).to.eql({
        method: 'POST',
        headers: {
          'Accept':       'application/json',
          'Content-Type': 'application/json',
        },
        body: '{"q":"easyagent"}',
      });
    });
  });

  describe('EasyAgent#fetchText()', () => {
    afterEach(() => {
      EasyAgent.setFetchFunction(() => {
        throw new ReferenceError('fetch is not defined');
      });
    });

    it('should call response.text() from arguments of fetch.then()\'s callback', done => {
      const textSpy   = sinon.spy();
      const fetchStub = () => Promise.resolve({ text: textSpy });
      const fetchSpy  = sinon.spy(fetchStub);

      EasyAgent.setFetchFunction(fetchSpy);
      EasyAgent.post('http://first.url')
        .setJson({ q: 'easyagent' })
        .fetchText()
        .then(() => {
          expect(textSpy.calledOnce).to.be(true);
          done();
        });

      expect(fetchSpy.calledOnce).to.be(true);
      expect(fetchSpy.firstCall.args[0]).to.be('http://first.url');
      expect(fetchSpy.firstCall.args[1]).to.eql({
        method: 'POST',
        headers: {
          'Accept':       'text/plain',
          'Content-Type': 'application/json',
        },
        body: '{"q":"easyagent"}',
      });
    });
  });
});
