# Pixi-SWF

The plugin for pixi.js is derivative of [Mozilla Shumway](https://github.com/mozilla/shumway), licensed under the [Apache 2.0 License](LICENSE).

Goals:
1. Help developers migrate their old ActionScript projects to PixiJS and TypeScript
2. Integration with tools that export SWF format: vector graphics and UI for PixiJS applications

# Thank You, Mozilla and Macromedia!

Both the original SWF player and Shumway project were written by genius, hard-working people. We really appreciate your work and we believe that the SWF format will have bright future in open-source.

# State of the project

Work is in progress. There are heavy changes in architecture.

1. AVM is removed. Old AS2-based animations are not supported at all.
2. Classes structure and reflection is under heavy refactoring.
3. IFrames were removed.
4. Vector graphics do not have transparent seams anymore.
5. Filters/cacheAsBitmap are truly cached, creating a significant performance boost.

Milestones:

1. Move renderer to PixiJS, and use both `2d` and `webgl` contexts.
2. Make adapters between SWF display tree and PixiJS tree.
3. Add online fiddle collection.
4. Add tests.

# Build

## Setup

```bash
npm install
```

## Compile

```bash
npm run build
```

## Test/Run

1. Checkout [gh-pages](https://github.com/pixijs/pixi-swf/tree/gh-pages) branch in separate folder
2. Make symlinks or just copy files in `dist` folder.
3. Start a web-server, open the browser at `localhost:8080`

```bash
npm install -g http-server
http-server -c-1
```

# Contributing

While we're in development, please be prepared for serious changes in the project. We recommend you discuss heavy modifications with authors prior to coding.

Please use tabs, not spaces.

# Additional resources

We have a channel in PixiJS slack, PM [@Ivan](http://www.html5gamedevs.com/profile/533-ivanpopelyshev/) to get an invite.

# Authors

* Ivan Popelyshev: [github](https://github.com/ivanpopelyshev/), [twitter](twitter.com/ivanpopelyshev)
* Mike Busyrev: [github](https://github.com/Busyrev/)

# Thanks

* Everyone who worked on SWF before us.
* PixiJS [core team](https://github.com/orgs/pixijs/people) members
* [CrazyPanda](http://cpdecision.com/), a game development company
