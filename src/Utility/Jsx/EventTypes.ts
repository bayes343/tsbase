export enum EventTypes {
  Abort = 'abort',
  Afterprint = 'afterprint',
  Animationend = 'animationend',
  Animationiteration = 'animationiteration',
  Animationstart = 'animationstart',
  Beforeprint = 'beforeprint',
  Beforeunload = 'beforeunload',
  Blur = 'blur',
  Canplay = 'canplay',
  Canplaythrough = 'canplaythrough',
  Change = 'change',
  Click = 'click',
  Contextmenu = 'contextmenu',
  Copy = 'copy',
  Cut = 'cut',
  Dblclick = 'dblclick',
  Drag = 'drag',
  Dragend = 'dragend',
  Dragenter = 'dragenter',
  Dragleave = 'dragleave',
  Dragover = 'dragover',
  Dragstart = 'dragstart',
  Drop = 'drop',
  Durationchange = 'durationchange',
  Ended = 'ended',
  Error = 'error',
  Focus = 'focus',
  Focusin = 'focusin',
  Focusout = 'focusout',
  Fullscreenchange = 'fullscreenchange',
  Fullscreenerror = 'fullscreenerror',
  Hashchange = 'hashchange',
  Input = 'input',
  Invalid = 'invalid',
  Keydown = 'keydown',
  Keypress = 'keypress',
  Keyup = 'keyup',
  Load = 'load',
  Loadeddata = 'loadeddata',
  Loadedmetadata = 'loadedmetadata',
  Loadstart = 'loadstart',
  Message = 'message',
  Mousedown = 'mousedown',
  Mouseenter = 'mouseenter',
  Mouseleave = 'mouseleave',
  Mousemove = 'mousemove',
  Mouseover = 'mouseover',
  Mouseout = 'mouseout',
  Mouseup = 'mouseup',
  Mousewheel = 'mousewheel',
  Offline = 'offline',
  Online = 'online',
  Open = 'open',
  Pagehide = 'pagehide',
  Pageshow = 'pageshow',
  Paste = 'paste',
  Pause = 'pause',
  Play = 'play',
  Playing = 'playing',
  Popstate = 'popstate',
  Progress = 'progress',
  Ratechange = 'ratechange',
  Resize = 'resize',
  Reset = 'reset',
  Scroll = 'scroll',
  Search = 'search',
  Seeked = 'seeked',
  Seeking = 'seeking',
  Select = 'select',
  Show = 'show',
  Stalled = 'stalled',
  Storage = 'storage',
  Submit = 'submit',
  Suspend = 'suspend',
  Timeupdate = 'timeupdate',
  Toggle = 'toggle',
  Touchcancel = 'touchcancel',
  Touchend = 'touchend',
  Touchmove = 'touchmove',
  Touchstart = 'touchstart',
  Transitionend = 'transitionend',
  Unload = 'unload',
  Volumechange = 'volumechange',
  Waiting = 'waiting',
  Wheel = 'wheel'
}

export const DomEvents = Object.values(EventTypes).map((eventType) => {
  return `on${eventType}`;
});
