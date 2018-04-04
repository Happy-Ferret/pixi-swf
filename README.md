# Pixi-SWF

The plugin for pixi.js is derivative of [Mozilla Shumway](https://github.com/mozilla/shumway) under Apache 2.0 license. 

Goals:
1. Help developers to migrate their old ActionScript projects to PixiJS and TypeScript
2. Integration with tools that export SWF format: vector graphics and UI for PixiJS applications

# Thank You, Mozilla and Macromedia!

Both original SWF player and Shumway project were written by genius hard-working people. We really appreciate your work and we believe that SWF format will have bright future in open-source.

# State of the project

Work in progress, there are heavy changes in architecture.

1. AVM is removed. Old AS2-based animations are not supported at all.
2. Classes structure and reflection is under heavy refactoring.
3. Iframes were removed.
4. Vector graphics does not have transparent seams anymore.
5. Filters/cacheAsBitmap are really cached, signinificant performance boost

Milestones: 

1. Move renderer to PixiJS, use both `2d` and `webgl` contexts.
2. Make adapters between SWF display tree and PixiJS tree.
3. Add online fiddle collection
4. Add tests

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
2. make symlinks or just copies files in `dist` folder.
3. Start a web-server, open the browser at `localhost:8080` 

```bash
npm install -g http-server
http-server -c-1
```

# Contributing

Make sure you to be ready for serious changes in the project. Its better to discuss heavy modifications with authors, 
before you loss a night to unrequited coding session.

Please use tabulation, not spaces.

# Additional resources

We have a channel in PixiJS slack, PM [@Ivan](http://www.html5gamedevs.com/profile/533-ivanpopelyshev/) to get an invite.

# Authors

* Ivan Popelyshev: [github](https://github.com/ivanpopelyshev/), [twitter](twitter.com/ivanpopelyshev)
* Mike Busyrev: [github](https://github.com/Busyrev/)

# Thanks

* Everyone who worked on SWF before us.
* PixiJS [core team](https://github.com/orgs/pixijs/people) members 
* [CrazyPanda](http://cpdecision.com/) , game development company 

