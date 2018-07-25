import 'papercss/dist/paper.css'

// tslint:disable-next-line:no-require-imports
require('preact/devtools') // turn this on if you want to enable React DevTools!

import { h, render } from 'preact'

import { App } from './app'

const mountTo = document.querySelector('main') as HTMLMainElement

let root: Element
function boot() {
  // let App = require('./components/app').default;
  root = render(h<{}>(App, null), mountTo, root!)
}

boot()
