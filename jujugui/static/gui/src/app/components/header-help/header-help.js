/*
This file is part of the Juju GUI, which lets users view and manage Juju
environments within a graphical interface (https://launchpad.net/juju-gui).
Copyright (C) 2015 Canonical Ltd.

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

YUI.add('header-help', function() {

  const HeaderHelp = React.createClass({

    propTypes: {
      appState: React.PropTypes.object.isRequired
    },

    getInitialState: function() {
      return {
        showHelpMenu: false
      };
    },

    /**
      When the menu is shown, clicking anywhere but the menu will close
      the menu.

      @method handleClickOutside
    */
    handleClickOutside: function(e) {
      this.setState({ showHelpMenu: false });
    },

    /**
      Clicking the help menu will toggle whether it's shown

      @method toggleHelpMenu
    */
    toggleHelpMenu: function() {
      this.setState({ showHelpMenu: !this.state.showHelpMenu });
    },

    /**
     Generate menu based on whether the button has been clicked.

      @method generateHelpMenu
    */
    generateHelpMenu: function() {
      if (this.state.showHelpMenu) {
        return (
          <juju.components.Panel
            instanceName="header-help-menu"
            visible={true}>
              <ul className="header-help-menu__list" role="menubar">
                <li className="header-help-menu__list-item
                  header-help-menu__list-item-with-link"
                  role="menuitem" tabIndex="0">
                  <a
                    href="https://jujucharms.com/docs/stable/getting-started"
                    target="_blank">
                    View Documentation</a>
                </li>
                <li className="header-help-menu__list-item
                  header-help-menu__list-item-info"
                  role="menuItem" tabIndex="1">
                  Keyboard shortcuts
                  <span className="header-help-menu__extra-info">
                    Shift + ?
                  </span>
                </li>
              </ul>
            </juju.components.Panel>);
      }
      return '';
    },

    /**
     Get class names based on whether the help menu is shown.
     If it is we want to hide the tooltip otherwise there's a black halo
     around the tooltip up arrow.

      @method _getClassNames
    */
    _getClassNames: function() {
      return classNames(
        'header-help__button', {
          'header-help__show-menu': this.state.showHelpMenu
        });
    },

    render: function() {
      return (
        <div className="header-help">
          <span className={this._getClassNames()}
            onClick={this.toggleHelpMenu}
            role="button"
            tabIndex="0"
            aria-haspopup="true"
            aria-owns="headerHelpMenu"
            aria-controls="headerHelpMenu"
            aria-expanded="false">
            <juju.components.SvgIcon name="help_16"
              className="header-help__icon"
              size="16" />
            <span className="tooltip__tooltip--below">
              <span className="tooltip__inner tooltip__inner--up">
                Help
              </span>
            </span>
          </span>
          {this.generateHelpMenu()}
        </div>);
    }
  });

  juju.components.HeaderHelp = enhanceWithClickOutside(HeaderHelp);

}, '0.1.0', { requires: [
  'panel-component',
  'svg-icon'
]});