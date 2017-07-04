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

YUI.add('juju-animation', function() {

  juju.components.JujuAnimation = React.createClass({
    displayName: 'JujuAnimation',

    propTypes: {
      property: React.PropTypes.string.isRequired,
      duration: React.PropTypes.string.isRequired,
      timing: React.PropTypes.string,
      delay: React.PropTypes.string,
      startVal: React.PropTypes.string,
      endVal: React.PropTypes.string,
      play: React.PropTypes.number
    },

    getInitialState: function() {
      return {
        property: this.props.property,
        duration: this.props.duration,
        timing: this.props.timing,
        delay: this.props.delay,
        startVal: this.props.startVal,
        endVal: this.props.endVal,
        playState: this.props.play > 1 ?
          'endVal' : this.props.play < 1 ?
            'startVal' : null
      };
    },

    render: function() {
      const styles = {
        'transition': `${this.state.property}\
 ${this.state.duration} ${this.state.timing} ${this.state.delay}`,
        [this.state.property]: this.state[this.state.playState]
      };
      return (<div style={styles}>{this.props.children}</div>);
    }
  });
}, '', {
  requires: [
    'svg-icon'
  ]
});
