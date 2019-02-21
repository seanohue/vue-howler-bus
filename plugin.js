import {AudioEngine} from './engine';

export const AudioPlugin = (tracks, bus) => ({
  install (Vue) {
    const $bus = bus || new Vue(); 
    Vue.prototype.$audio = new AudioEngine($bus, tracks)
  }
});
