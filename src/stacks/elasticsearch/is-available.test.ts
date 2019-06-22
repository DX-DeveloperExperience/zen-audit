import Globals from '../../utils/globals/index';
import Elasticsearch from './index';
test('Should return false if rootPath does not start with "http"', () => {
  Globals.rootPath = 'not-http';

  const elasticSearch = new Elasticsearch();

  return elasticSearch.isAvailable().then(result => {
    expect(result).toBeFalsy();
  });
});
