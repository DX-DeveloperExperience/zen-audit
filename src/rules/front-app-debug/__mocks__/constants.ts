import { LaunchConf } from './constants';
export interface LaunchConfFile {
  version: string;
  configurations: LaunchConf[];
}

export interface LaunchConf {
  type: string;
  name?: string;
  request?: string;
  url?: string;
  webRoot?: string;
  pathMappings?: object[];
  breakOnLoad?: boolean;
  sourceMapPathOverrides?: object;
  reAttach?: boolean;
  file?: string;
  addonPath?: string;
}

export const configs: { [key: string]: LaunchConf[] } = {
  VueJS: [
    {
      type: 'firefox',
      request: 'launch',
      name: 'vuejs: firefox',
      url: 'http://localhost:8080',
      webRoot: '${workspaceFolder}/src',
      pathMappings: [{ url: 'webpack:///src/', path: '${webRoot}/' }],
    },
    {
      type: 'chrome',
      request: 'launch',
      name: 'vuejs: chrome',
      url: 'http://localhost:8080',
      webRoot: '${workspaceFolder}/src',
      breakOnLoad: true,
      sourceMapPathOverrides: {
        'webpack:///./src/*': '${webRoot}/*',
      },
    },
  ],
  Angular: [
    {
      name: 'Launch index.html',
      type: 'firefox',
      request: 'launch',
      reAttach: true,
      file: '${workspaceFolder}/index.html',
    },
    {
      name: 'Launch localhost',
      type: 'firefox',
      request: 'launch',
      reAttach: true,
      url: 'http://localhost/index.html',
      webRoot: '${workspaceFolder}',
    },
    {
      name: 'Attach',
      type: 'firefox',
      request: 'attach',
    },
    {
      name: 'Launch WebExtension',
      type: 'firefox',
      request: 'launch',
      reAttach: true,
      addonPath: '${workspaceFolder}',
    },
    {
      type: 'chrome',
      request: 'launch',
      name: 'Launch Chrome against localhost',
      url: 'http://localhost:8080',
      webRoot: '${workspaceFolder}',
    },
  ],
  React: [
    {
      name: 'Chrome',
      type: 'chrome',
      request: 'launch',
      url: 'http://localhost:3000',
      webRoot: '${workspaceFolder}/src',
      sourceMapPathOverrides: {
        'webpack:///src/*': '${webRoot}/*',
      },
    },
  ],
};

export const vscodeConfig: LaunchConfFile = {
  version: '0.2.0',
  configurations: [],
};
