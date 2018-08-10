# KnowledgeWorker Embedded Asset API Example

An example implementation of knowledgeworker-embedded-asset-api.

This example code aims to ease the development of rich embedded assets for responsive [KnowledgeWorker](https://www.knowledgeworker.com/?utm_source=code&utm_campaign=embedded-asset-api-example) contents using the [knowledgeworker-embedded-asset-api](https://github.com/chemmedia/knowledgeworker-embedded-asset-api) javascript library.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to build a distribution folder.
Build your own KnowledgeWorker Embedded Asset by forking this repository.

### Prerequisites

What things you need to install the software and how to install them.

```
node, npm, yarn
```

### Installing

Install dependencies by typing:

```
yarn
```

### Development

This example is based on [webpack](https://webpack.js.org/), so you can start a development server by typing:

```
yarn start
```

After you see the `Compiled successfully.` you can open [http://localhost:8080](http://localhost:8080) in your browser.
Create your own asset by modifying `src/public/index.html` and `src/app/index.ts` and its imports.


## Deployment

Build a distribution folder by typing the following comand.

```
yarn build
```
Now you can pack the content of the `dist` folder as zip archive an upload to KnowledgeWorker as media asset.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags). 

## Authors

 - Martin Kutter - [chemmedia](https://www.chemmedia.de/)

## Licence

This project is licensed under MIT licence. Please see [LICENSE](./LICENSE) file for more information.
