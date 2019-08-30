import { Register } from './../../../../register/index';
import { FetchDataError } from '../../../../errors/fetch-data-errors';
import { YesNo } from '../../../../choice/index';
import Elasticsearch from '../../../../stacks/elasticsearch';
import Axios from 'axios';
import Globals from '../../../../utils/globals';

@Register.ruleForStacks([Elasticsearch])
export class ElasticsearchTemplate {
  async shouldBeApplied(): Promise<boolean> {
    const url = `${Globals.rootPath}_template`;
    return Axios.get(url)
      .then(({ data: templates }) => {
        return (
          Object.keys(templates).filter(
            templateName => !templateName.startsWith('.'),
          ).length === 0
        );
      })
      .catch(err => {
        throw new FetchDataError(err, url, this.constructor.name);
      });
  }

  getName() {
    return 'Elasticsearch Template';
  }

  getShortDescription() {
    return 'You should use templates for configuring your indices';
  }

  getLongDescription() {
    return 'Laborum exercitation incididunt nulla veniam labore esse. Pariatur adipisicing sint aliqua adipisicing culpa consequat reprehenderit excepteur eiusmod. Est irure voluptate fugiat enim minim laborum. Magna anim eiusmod consectetur voluptate. Proident ad ex laborum in adipisicing sit minim aliquip duis. Do non voluptate mollit officia consequat proident ex mollit dolore qui esse sit reprehenderit.';
  }

  getPromptType() {
    return 'list';
  }

  getChoices() {
    return YesNo;
  }
}
