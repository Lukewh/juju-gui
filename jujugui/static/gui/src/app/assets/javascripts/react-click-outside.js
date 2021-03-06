// Copied from: https://github.com/kentor/react-click-outside/blob/master/dist/index.js
// Changes noted below.

'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

// XXX huwshimi 14 Jan 2016 - Remove require calls as the libs are already loaded.
// var React = require('react');
// var ReactDOM = require('react-dom');

// XXX huwshimi 14 Jan 2016 Don't assign function to module.exports.
function enhanceWithClickOutside(WrappedComponent) {
  var componentName = WrappedComponent.displayName || WrappedComponent.name;

  return React.createClass({
    displayName: 'Wrapped' + componentName,
    // XXX huwshimi 15 Jan 2016 Expose the wrapped component for testing.
    wrappedComponent: WrappedComponent,

    componentDidMount: function componentDidMount() {
      this.__wrappedComponent = this.refs.wrappedComponent;
      document.addEventListener('click', this.handleClickOutside, true);
      // XXX ant 9 Feb 2016 Add Esc keybind to also close the current component
      document.addEventListener('keydown', this.handleKeyDown);
    },

    componentWillUnmount: function componentWillUnmount() {
      document.removeEventListener('click', this.handleClickOutside, true);
      document.removeEventListener('keydown', this.handleKeyDown);
    },

    /**
      XXX ant 9 Feb 2016
      Call the handleClickOutside method of the component with keyCodes match

      @method handleKeyDown
      @param {Object} e The keydown event
    */
    handleKeyDown: function handleKeyDown(e) {
      e = e || window.event;
      // keyCode === <Esc> 
      if (e.keyCode === 27) {
        var domNode = ReactDOM.findDOMNode(this);
        if (domNode && typeof this.refs.wrappedComponent.handleClickOutside === 'function') {
          this.refs.wrappedComponent.handleClickOutside(e);
        }
      }
    },

    handleClickOutside: function handleClickOutside(e) {
      var domNode = ReactDOM.findDOMNode(this);
      if ((!domNode || !domNode.contains(e.target)) && typeof this.refs.wrappedComponent.handleClickOutside === 'function') {
        this.refs.wrappedComponent.handleClickOutside(e);
      }
    },

    render: function render() {
      return React.createElement(WrappedComponent, _extends({}, this.props, { ref: 'wrappedComponent' }));
    }
  });
};
