/*
This file is part of the Juju GUI, which lets users view and manage Juju
environments within a graphical interface (https://launchpad.net/juju-gui).
Copyright (C) 2017 Canonical Ltd.

This program is free software: you can redistribute it and/or modify it under
the terms of the GNU Affero General Public License version 3, as published by
the Free Software Foundation.

This program is distributed in the hope that it will be useful, but WITHOUT
ANY WARRANTY; without even the implied warranties of MERCHANTABILITY,
SATISFACTORY QUALITY, or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero
General Public License for more details.

You should have received a copy of the GNU Affero General Public License along
with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

'use strict';

class USSOLoginLink extends React.Component {
  /**
    Handle the login form the user click.
  */
  handleLogin(e) {
    if (e && e.preventDefault) {
      // Depending on the login link type there may or may not be a
      // preventDefault method.
      e.preventDefault();
    }
    this.props.loginToController(err => {
      if (err) {
        const message = 'cannot log into the controller';
        this.props.addNotification({
          title: message,
          message: `${message}: ${err}`,
          level: 'error'
        });
        console.error(message, err);
      }

      const callback = this.props.callback;
      if (callback) {
        callback(err);
      }
    });
  }

  /**
    If the component has child elements, they are used as the content for the
    link; otherwise the provided default string will be used.

    @param {String} defaultContent The default content to use for the button
                                   or link.
  */
  _generateContent(defaultContent) {
    if (this.props.children) {
      return this.props.children;
    } else {
      return defaultContent;
    }
  }

  /**
    Returns the text login link.
  */
  _renderTextLink() {
    return (
      <a className="usso-login__action"
        onClick={this.handleLogin.bind(this)}
        target="_blank">
        {this._generateContent('Login')}
      </a>);
  }

  /**
    Returns the button login link.
  */
  _renderButtonLink() {
    return (
      <juju.components.GenericButton
        action={this.handleLogin.bind(this)}
        extraClasses="usso-login__action"
        type="positive">
        {this._generateContent('Sign up/Log in with USSO')}
      </juju.components.GenericButton>
    );
  }

  render() {
    const notification = `If requested,
      in the address bar above, please allow popups
      from ${window.location.origin}.`;
    let ele;
    if (this.props.displayType === 'button') {
      ele = this._renderButtonLink();
    } else {
      ele = this._renderTextLink();
    }
    let _notification;
    if (this.props.suppressHover !== true) {
      _notification = (
        <div className="usso-login__notification">
          {notification}
        </div>
      );
    }
    return(
      <div className="usso-login">
        {ele}
        {_notification}
      </div>);
  }
};

USSOLoginLink.propTypes = {
  addNotification: PropTypes.func.isRequired,
  callback: PropTypes.func,
  children: PropTypes.node,
  displayType: PropTypes.string.isRequired,
  gisf: PropTypes.bool,
  loginToController: PropTypes.func.isRequired,
  suppressHover: PropTypes.bool
};

YUI.add('usso-login-link', function() {
  juju.components.USSOLoginLink = USSOLoginLink;
}, '0.1.0', {
  requires: ['generic-button']
});
