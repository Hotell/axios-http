import { h, render } from 'preact'
import { App } from './app'

const mountTo = document.querySelector('main') as HTMLMainElement

render(h<{}>(App, null), mountTo)
