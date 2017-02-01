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

var juju = {components: {}}; // eslint-disable-line no-unused-vars

chai.config.includeStack = true;
chai.config.truncateThreshold = 0;

describe('SearchResultsItem', function() {

  const changeState = sinon.stub();

  beforeAll(function(done) {
    // By loading this file it adds the component to the juju components.
    YUI().use('search-results-item', function() { done(); });
  });

  it('can render an item', function() {
    const item = {
      name: 'mysql',
      displayName: 'mysql',
      special: true,
      url: 'http://example.com/mysql',
      downloads: 1000,
      owner: 'test-owner',
      promulgated: true,
      id: 'mysql',
      storeId: '~test-owner/mysql',
      type: 'charm',
      tags: ['tag1', 'tag2'],
      series: [{name: 'vivid'}, {name: 'wily'}]
    };
    const output = jsTestUtils.shallowRender(
        <juju.components.SearchResultsItem
          changeState={changeState}
          key={item.storeId}
          item={item}
          colspan='two-col' />);

    const itemClick = output.props.onClick;
    const ownerClick = output.props.children[1].props.children[1].props.children[1].props.onClick;

    const expected = (
      <li className="search-results__list-item charm two-col"
          tabIndex="0" role="button"
          key="mysql"
          onClick={itemClick}>
        <div className="search-results__image two-col">
          <img src="static/gui/build/app/assets/images/non-sprites/charm_160.svg"
               className="list-icons__image charm__logo"
               alt="mysql icon" />
        </div>
        <div className="search-results__details seven-col">
          <h3 className="search-results__name">
            mysql
          </h3>
          <p className="search-results__owner">
            By&nbsp;<span className="link" role="button" tabIndex="0" onClick={ownerClick}>test-owner</span>
          </p>
          <p>Works on: {'vivid'}{' +1'}
          </p>
        </div>
        <div className="search-results__action three-col last-col">
          <a href="" className="button--inline-neutral">
            Add to canvas
          </a>
        </div>
      </li>
    );

    assert.deepEqual(output, expected);
  });

  it('can render an item with defaults for missing props', function() {
    const item = {
      name: 'mysql',
      displayName: 'mysql',
      special: true,
      url: 'http://example.com/mysql',
      downloads: 1000,
      owner: 'test-owner',
      promulgated: true,
      id: 'mysql',
      storeId: '~test-owner/mysql',
      type: 'charm',
      series: []
    };
    const output = jsTestUtils.shallowRender(
        <juju.components.SearchResultsItem
          changeState={changeState}
          key={item.storeId}
          item={item}
          colspan='two-col' />);

    const itemClick = output.props.onClick;
    const ownerClick = output.props.children[1].props.children[1].props.children[1].props.onClick;

    const expected = (
      <li className="search-results__list-item charm two-col"
          tabIndex="0" role="button"
          key="mysql"
          onClick={itemClick}>
        <div className="search-results__image two-col">
          <img src="static/gui/build/app/assets/images/non-sprites/charm_160.svg"
               className="list-icons__image charm__logo"
               alt="mysql icon" />
        </div>
        <div className="search-results__details seven-col">
          <h3 className="search-results__name">
            mysql
          </h3>
          <p className="search-results__owner">
            By&nbsp;<span className="link" role="button" tabIndex="0" onClick={ownerClick}>test-owner</span>
          </p>
          {''}
        </div>
        <div className="search-results__action three-col last-col">
          <a href="" className="button--inline-neutral">
            Add to canvas
          </a>
        </div>
      </li>
    );

    assert.deepEqual(output, expected);
  });

  it('can render icons for a bundle', function() {
    const item = {
      name: 'mysql',
      displayName: 'mysql',
      special: true,
      url: 'http://example.com/mysql',
      downloads: 1000,
      owner: 'test-owner',
      promulgated: true,
      id: 'mysql',
      storeId: '~test-owner/mysql',
      type: 'bundle',
      series: [],
      applications: [{
        displayName: 'wordpress',
        id: 'cs:wordpress',
        iconPath: 'wordpress.svg'
      }, {
        displayName: 'apache2',
        id: 'cs:apache2',
        iconPath: 'apache2.svg'
      }]
    };
    const output = jsTestUtils.shallowRender(
      <juju.components.SearchResultsItem
        changeState={changeState}
        key={item.storeId}
        item={item}
        colspan='two-col' />);

    const itemClick = output.props.onClick;
    const ownerClick = output.props.children[1].props.children[1].props.children[1].props.onClick;

    const expected = (
      <li className="search-results__list-item bundle two-col"
          tabIndex="0" role="button"
          key="mysql"
          onClick={itemClick}>
        <div className="search-results__image two-col">
          <ul className="icon-list">
            <li key="cs:wordpress"
                className="icon-list__item">
              <img src="wordpress.svg" className="list-icons__image charm__logo" alt="wordpress icon" />
            </li>
            <li key="cs:apache2"
                className="icon-list__item">
              <img src="apache2.svg" className="list-icons__image charm__logo" alt="apache2 icon" />
            </li>
          </ul>
        </div>
        <div className="search-results__details seven-col">
          <h3 className="search-results__name">
            mysql
          </h3>
          <p className="search-results__owner">
            By&nbsp;<span className="link" role="button" tabIndex="0" onClick={ownerClick}>test-owner</span>
          </p>
          {''}
        </div>
        <div className="search-results__action three-col last-col">
          <a href="" className="button--inline-neutral">
            Add to canvas
          </a>
        </div>
      </li>
    );

    assert.deepEqual(output, expected);
  });

  it('can handle clicking on an item', function() {
    const changeState = sinon.stub();
    const stopPropagation = sinon.stub();
    const item = {
      name: 'mysql',
      displayName: 'mysql',
      special: true,
      url: 'http://example.com/mysql',
      downloads: 1000,
      owner: 'test-owner',
      promulgated: true,
      id: 'mysql',
      storeId: '~test-owner/mysql',
      type: 'charm',
      tags: ['tag1', 'tag2'],
      series: [{name: 'vivid'}, {name: 'wily'}]
    };
    const output = jsTestUtils.shallowRender(
        <juju.components.SearchResultsItem
          changeState={changeState}
          key={item.storeId}
          item={item}
          colspan="two-col" />);
    output.props.onClick({stopPropagation: stopPropagation});
    assert.equal(changeState.callCount, 1);
    assert.equal(stopPropagation.callCount, 1);
    assert.deepEqual(changeState.args[0][0], {
      search: null,
      store: 'mysql'
    });
  });

  it('can handle clicking on an owner', function() {
    const changeState = sinon.stub();
    const stopPropagation = sinon.stub();
    const item = {
      name: 'mysql',
      displayName: 'mysql',
      special: true,
      url: 'http://example.com/mysql',
      downloads: 1000,
      owner: 'test-owner',
      promulgated: true,
      id: 'mysql',
      storeId: '~test-owner/mysql',
      type: 'charm',
      tags: ['tag1', 'tag2'],
      series: [{name: 'vivid'}, {name: 'wily'}]
    };
    const output = jsTestUtils.shallowRender(
        <juju.components.SearchResultsItem
          changeState={changeState}
          key={item.storeId}
          item={item}
          colspan="two-col" />);
    output.props.children[1].props.children[1].props.children[1]
        .props.onClick({stopPropagation: stopPropagation});
    assert.equal(changeState.callCount, 1);
    assert.equal(stopPropagation.callCount, 1);
    assert.deepEqual(changeState.args[0][0], {
      search: {
        owner: 'test-owner',
        provides: null,
        requires: null,
        series: null,
        tags: null,
        text: '',
        type: null
      }
    });
  });

  it('gives the correct class names for charm list item', function() {
    const item = {
      name: 'mysql',
      displayName: 'mysql',
      special: true,
      url: 'http://example.com/mysql',
      downloads: 1000,
      owner: 'test-owner',
      promulgated: true,
      id: 'mysql',
      storeId: '~test-owner/mysql',
      type: 'charm',
      tags: ['tag1', 'tag2'],
      series: [{name: 'vivid'}, {name: 'wily'}]
    };
    const output = jsTestUtils.shallowRender(
        <juju.components.SearchResultsItem
          changeState={sinon.stub()}
          item={item}
          colspan="two-col" />);

    assert.equal(output.props.className, 'search-results__list-item charm two-col');
  });

  it('gives the correct class names for bundle list item', function() {
    const item = {
      name: 'mysql',
      displayName: 'mysql',
      special: true,
      url: 'http://example.com/mysql',
      downloads: 1000,
      owner: 'test-owner',
      promulgated: true,
      id: 'mysql',
      storeId: '~test-owner/mysql',
      type: 'bundle',
      series: [],
      services: [{
        displayName: 'wordpress',
        id: 'cs:wordpress',
        iconPath: 'wordpress.svg'
      }, {
        displayName: 'apache2',
        id: 'cs:apache2',
        iconPath: 'apache2.svg'
      }]
    };
    const output = jsTestUtils.shallowRender(
        <juju.components.SearchResultsItem
          changeState={sinon.stub()}
          item={item}
          colspan="two-col" />);

    assert.equal(output.props.className, 'search-results__list-item bundle two-col');
  });
});
