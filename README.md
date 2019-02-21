# Vue Howler Bus

An audio engine plugin for Vue, based on Howler JS and an application-wide event bus. Originally made for an HTML5 game engine, could also be used for other HTML5 multimedia experiences.

## Set up

First, `npm install --save vue-howler-bus`.

Then, set up the [Vue plugin](https://vuejs.org/v2/guide/plugins.html):

```javascript
import tracks from '@/data/tracks'
import {bus} from './bus'

import {AudioPlugin} from 'vue-howler-bus'
const plugin = AudioPlugin(tracks, bus)

Vue.use(plugin)
```

### How it works

The 'bus' is just a Vue instance used as an emitter.
It can also be any EventEmitter implementation that has $emit, $on, $once as methods.

It is also optional -- if you choose not to provide your own implementation to the plugin, it will call new Vue() to create one for you.

The 'tracks' are an array of objects used to define the tracks you wish to use. Example:

```javascript
export default [
  {
    type: 'ambient',
    name: 'tubestatic',
    rate: 0.75,
    volume: 0.35
  },
  {
    type: 'ambient',
    name: 'spire_ambience',
    rate: 1,
    volume: 0.4
  },

  {
    type: 'music',
    name: 'VESSELACCESS',
    rate: 0.5
  },

  {
    type: 'sfx'
    name: 'vessel_death',
    volume: 0.75
  }
]
```

Each track has some required properties, `name` and `type`, as well as some optional ones that are used to set the Howler properties of the audio track.

`type` tells the engine which internal Howler instance to use. `ambience` and `music`, by default, will loop until you explicitly tell the engine to stop the track or start a new track. `sfx` will play the sound a single time and can play multiple tracks at once.

Each track *must* have a valid audio file located in your app's assets directory.

## Example usage

Once your application is initialized, you will want to call `init` in one of the main component hooks of your application.

```javascript
this.$audio.init()
```

Since you are using an app-wide event bus (right?) you will want to send audio events through that bus, which should also be a plugin and available on every Vue component.

If this is the case, you can emit an event such as:
```javascript
this.$bus.$emit('audio:play', 'sfx', 'ping');
```

## Events

The engine listens to the following events:

- `audio:play` : expects the track type and name.
- `audio:change` : can be used to change the engine's internal settings or play a new audio cue. expects an object with the param of either `settings` or `cue` and `options`.
- `settings:init` : this will tell the audio engine to emit its settings using the event `audio:init`, good for making sure that any kind of preferences menu matches the actual audio engine settings.

The engine emits the following events:

- `audio:init` - will emit its own settings object. Does so on initialization as well as any time `settings:init` is called.

## Methods

The following methods are public and available via `this.$audio.methodName` in any Vue component after setting up the plugin:

- `init` : Imports HowlerJS, then sets up the tracks and default settings. Begins playing any initial tracks (make sure to follow autoplay guidelines).
- `stopAll` : Stops all audio.
- `playAll` : Begins replaying the ambient and music tracks that were last played.
- `eachPlayer(cb)` : Executes the function `cb` on the ambient, music, and sfx players. The `cb` is passed two arguments, the first one being the Howler instance used for that type, the second being a string describing the type (which can be 'sfx', 'music', or 'ambience').
- `emitSettings` : Another way to get the player to emit its settings via the event bus.
