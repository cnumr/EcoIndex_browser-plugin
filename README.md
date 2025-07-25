# Ecoindex browser plugin

This is the source code of the Ecoindex browser plugin.
This simple plugin allows you to check the Ecoindex of any website you visit.

This plugin is currently available for:

[![Firefox](https://img.shields.io/badge/Firefox-FF7139?style=for-the-badge&logo=Firefox-Browser&logoColor=white)](https://addons.mozilla.org/fr/firefox/addon/ecoindex-fr/)
[![Google Chrome](https://img.shields.io/badge/Google%20Chrome-4285F4?style=for-the-badge&logo=GoogleChrome&logoColor=white)](https://chrome.google.com/webstore/detail/ecoindexfr/apeadjelacokohnkfclnhjlihklpclmp)
[![Edge](https://img.shields.io/badge/Edge-0078D7?style=for-the-badge&logo=Microsoft-edge&logoColor=white)](https://microsoftedge.microsoft.com/addons/detail/ecoindexfr/fioadgdggjngcpbeilfgacmddamnhnah)

## Description

You can easily check the Ecoindex of any website you visit:

![simple-result](doc/images/simple-result.png)

When there is no result, you will see a message, and you will be proposed to run an analysis:

![no-result](doc/images/no-result.png)

When the analysis is running, you will see a message:

![run-analysis](doc/images/run-analysis.png)

You can also dislplay older results existing for this page, or other results for the same domain:

![other-results](doc/images/other-results.png)

## Development

Install dependencies and run firefox in development mode:

```bash
npm install
npm run start
```

Build the application:

```bash
npm run build:all
```

## [Code of conduct](CODE_OF_CONDUCT.md)

## [License](LICENSE.md)
