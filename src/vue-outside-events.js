/* global window, jQuery */

const createOutsideEvent = (directiveName, eventName) => {
  const outsideEvent = {}

  outsideEvent.directiveName = directiveName
  outsideEvent.eventName = eventName

  outsideEvent.bind = function (el, binding, vNode) {
    const err = console.error !== undefined ? console.error : console.log
    if (typeof binding.value !== 'function') {
      let error = `[${directiveName}]: provided expression '${binding.expression}' must be a function.`
      if (vNode.context.name) {
        error += `\nFound in component '${vNode.context.name}'`
      }
      err(error)
    }

    const handler = (e) => {
      if (!el.contains(e.target) && el !== e.target) {
        binding.value(e, el)
      }
    }

    el.__vueEventOutside__ = handler
    document.addEventListener(eventName, handler)
  }

  outsideEvent.unbind = function (el, binding) {
    document.removeEventListener(eventName, el.__vueEventOutside__)
    el.__vueEventOutside__ = null
  }

  return outsideEvent
}

export const CustomEventOutside = {
  directiveName: 'event-outside',
  bind: function (el, binding, vNode) {
    const err = console.error !== undefined ? console.error : console.log
    if (
      // object is required
      typeof binding.value !== 'object' ||
      // object.name string required
      (binding.value.name === undefined || typeof binding.value.name !== 'string') ||
      // object.handler function required
      (binding.value.handler === undefined || typeof binding.value.handler !== 'function')) {
      let error = `[v-event-outside]: provided expression '${binding.expression}' must be an object containing a "name" string and a "handler" function.`
      if (vNode.context.name) {
        error += `\nFound in component '${vNode.context.name}'`
      }
      err(error)
      return
    }
    if ((binding.modifiers.jquery) && (window.$ === undefined && window.jQuery === undefined)) {
      let error = `[v-event-outside]: jQuery is not present in window.`
      if (vNode.context.name) {
        error += `\nFound in component '${vNode.context.name}'`
      }
      err(error)
      return
    }

    const handler = (e) => {
      if (!el.contains(e.target) && el !== e.target) {
        binding.value.handler(e, el)
      }
    }
    el.__vueEventOutside__ = handler
    if (binding.modifiers.jquery) {
      jQuery(document).on(binding.value.name, handler)
    } else {
      document.addEventListener(binding.value.name, handler)
    }
  },

  unbind: function (el, binding) {
    if (binding.modifiers.jquery) {
      jQuery(document).off(binding.value.name, el.__vueEventOutside__)
    } else {
      document.removeEventListener(binding.value.name, el.__vueEventOutside__)
    }

    el.__vueEventOutside__ = null
  }
}

export const ClickOutside = createOutsideEvent('click-outside', 'click')
export const DblClickOutside = createOutsideEvent('dblclick-outside', 'dblclick')
export const FocusOutside = createOutsideEvent('focus-outside', 'focusin')
export const BlurOutside = createOutsideEvent('blur-outside', 'focusout')
export const MouseMoveOutside = createOutsideEvent('mousemove-outside', 'mousemove')
export const MouseDownOutside = createOutsideEvent('mousedown-outside', 'mousedown')
export const MouseUpOutside = createOutsideEvent('mouseup-outside', 'mouseup')
export const MouseOverOutside = createOutsideEvent('mouseover-outside', 'mouseover')
export const MouseOutOutside = createOutsideEvent('mouseout-outside', 'mouseout')
export const ChangeOutside = createOutsideEvent('change-outside', 'change')
export const SelectOutside = createOutsideEvent('select-outside', 'select')
export const SubmitOutside = createOutsideEvent('submit-outside', 'submit')
export const KeyDownOutside = createOutsideEvent('keydown-outside', 'keydown')
export const KeyPressOutside = createOutsideEvent('keypress-outside', 'keypress')
export const KeyUpOutside = createOutsideEvent('keyup-outside', 'keyup')
