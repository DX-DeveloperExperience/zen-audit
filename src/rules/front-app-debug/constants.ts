export const configs: object = {
  vuejs: {
    firefox: {
      type: 'firefox',
      request: 'launch',
      name: 'vuejs: firefox',
      url: 'http://localhost:8080',
      webRoot: '${workspaceFolder}/src',
      pathMappings: [{ url: 'webpack:///src/', path: '${webRoot}/' }],
    },
    chrome: {
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
  },
  angular: {
    firefox: {
      version: '0.2.0',
      configurations: [
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
      ],
    },
  },
  chrome: {
    version: '0.2.0',
    configurations: [
      {
        type: 'chrome',
        request: 'launch',
        name: 'Launch Chrome against localhost',
        url: 'http://localhost:8080',
        webRoot: '${workspaceFolder}',
      },
    ],
  },
};

export const vscodeConfig: object = {
  version: '0.2.0',
  configurations: [],
};
