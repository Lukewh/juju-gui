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

YUI.add('accordion-item', function() {

  juju.components.AccordionItem = React.createClass({
    displayName: 'AccordionItem',

    propTypes: {
      title: React.PropTypes.string.isRequired,
      showTick: React.PropTypes.bool
    },

    getInitialState: function() {
      if (this.props.debug) {
        console.log('CONSTRUCTOR');
      }
      return {
        showContent: false,
      };
    },

    _toggleContent: function() {
      this.setState({showContent: !this.state.showContent});
    },

    _renderTick: function() {
      if (!this.showTick) {
        return null;
      }

      return (<juju.components.SvgIcon
        name="complete"
        size="24" />);
    },

    render: function() {
      let play = 0;

      if (this.state.showContent) {
        play = 1;
      }

      const content = (
        <juju.components.JujuAnimation
          property="height"
          duration="0.3s"
          timing="ease"
          delay="0s"
          startVal="0"
          endVal="auto"
          play={play}>
          <div className="accordion-item__content">
            {this.props.children}
          </div>
        </juju.components.JujuAnimation>
      );

      const classes = classNames(
        'accordion-item',
        {
          'accordion-item--open': this.state.showContent
        }
      );

      return (
        <div className={classes}>
          <div className="accordion-item__title" onClick={this._toggleContent}>
            {this._renderTick()}
            {this.props.title}
          </div>
          {content}
        </div>
      );
    }
  });
}, '', {
  requires: [
    'svg-icon',
    'juju-animation'
  ]
});
