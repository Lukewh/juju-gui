/*
This file is part of the Juju GUI, which lets users view and manage Juju
environments within a graphical interface (https://launchpad.net/juju-gui).
Copyright (C) 2012-2013 Canonical Ltd.

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

YUI.add('search-results-item', function() {

  juju.components.SearchResultsItem = React.createClass({

    propTypes: {
      changeState: React.PropTypes.func.isRequired,
      item: React.PropTypes.object.isRequired,
      colspan: React.PropTypes.string.isRequired
    },

    /**
      Generate single element for an icon

      @method _generateIcon
      @param application {Object} an application object.
      @returns {String} The generated element.
     */
    _generateIcon: function(application) {
      const staticIconPath ='static/gui/build/app/assets/images/non-sprites/charm_160.svg';
      return <img src={application.iconPath || staticIconPath}
                  className="list-icons__image charm__logo"
                  alt={application.displayName + ' icon'} />;
    },

    /**
      Generate the elements for the icon list.

      @method _generateIconList
      @returns {String} The generated elements.
    */
    _generateIconList: function() {
      let applications = this.props.item.applications;
      const application = this.props.item;
      const single = !applications && application;
      let images;

      if (single) {
        images = this._generateIcon(application);
      } else {
        const totalApplications = applications.length;
        const imageList = [];

        if (totalApplications > 4) {
          applications = applications.splice(0, 3);
        }

        applications.forEach(function(application) {
          imageList.push(
            <li className="icon-list__item" key={application.id}>
              {this._generateIcon(application)}
            </li>);
        }.bind(this));

        if (totalApplications > 4) {
          imageList.push(
            <li className="icon-list__item--count" key="more">
              +{totalApplications - 3}
            </li>);
        }

        images = <ul className="icon-list">
            {imageList}
          </ul>;
      }

      return <div className="search-results__image two-col">
        {images}
      </div>;
    },

    _generateOwner: function() {
      const item = this.props.item;
      let owner = 'No owner';

      if (this.props.item.owner) {
        owner = <span className="link"
            onClick={this._handleOwnerClick.bind(this, item.owner)}
            role="button"
            tabIndex="0">
             {item.owner}
          </span>;
      }
      return <p className="search-results__owner">By&nbsp;{owner}</p>;
    },

    /**
      Generate the elements for the series list.

      @method _generateSeriesList
      @returns {String} The generated elements.
    */
    _generateSeriesList: function() {
      const item = this.props.item;
      const series = item.series;
      let ele = '';
      let name = series[0];

      if (series[0]) {
        if (series[0].name) {
          name = series[0].name;
        }

        const multiSeries = series.length > 1 ? ` +${series.length - 1}` : ``;
        ele = <p>Works on: {name}{multiSeries}</p>;
      }

      return ele;
    },

    /**
      Generate the base classes from the props.

      @method _generateClasses
      @param {Boolean} selected Whether the filter is selected.
      @returns {String} The collection of class names.
    */
    _generateClasses: function(selected) {
      return classNames(
        {selected: selected}
      );
    },

    /**
      Show the entity details when clicked.

      @method _handleItemClick
      @param {String} id The entity id.
      @param {Object} e The click event.
    */
    _handleItemClick: function(id, e) {
      e.stopPropagation();
      this.props.changeState({
        search: null,
        store: id.replace('cs:', '')
      });
    },

    /**
      Show search results for the given tag.

      @method _handleTagClick
      @param {String} tag The tag name.
      @param {Object} e The click event.
    */
    _handleTagClick: function(tag, e) {
      e.stopPropagation();
      this.props.changeState({
        search: {
          owner: null,
          provides: null,
          requires: null,
          series: null,
          tags: tag,
          text: '',
          type: null
        }
      });
    },

    /**
      Show search results for the given owner.

      @method _handleOwnerClick
      @param {String} owner The owner's name.
      @param {Object} e The click event.
    */
    _handleOwnerClick: function(owner, e) {
      e.stopPropagation();
      this.props.changeState({
        search: {
          owner: owner,
          provides: null,
          requires: null,
          series: null,
          tags: null,
          text: '',
          type: null
        }
      });
    },

    render: function() {
      const item = this.props.item;
      const type = this.props.item.type;
      const colspan = this.props.colspan;

      return (
        <li className={`search-results__list-item ${type} ${colspan}`}
          tabIndex="0" role="button" key={item.id}
          onClick={this._handleItemClick.bind(this, item.id)}>
          {this._generateIconList()}
          <div className="search-results__details seven-col">
            <h3 className="search-results__name">
              {item.displayName}
            </h3>
            {this._generateOwner()}
            {this._generateSeriesList()}
          </div>
          <div className="search-results__action three-col last-col">
            <a href="" className="button--inline-neutral">Add to canvas</a>
          </div>
        </li>);
    }
  });

}, '0.1.0', {requires: []});
