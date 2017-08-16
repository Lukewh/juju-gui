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

var juju = {components: {}}; // eslint-disable-line no-unused-vars

chai.config.includeStack = true;
chai.config.truncateThreshold = 0;

describe('HeaderHelp', function() {
  let appState;

  beforeAll(function(done) {
    // By loading this file it adds the component to the juju components.
    YUI().use('header-help', function() { done(); });
  });

  beforeEach(function() {
    appState = {
      current: {},
      changeState: sinon.stub()
    };
  });

  it('renders', function () {
    const renderer = jsTestUtils.shallowRender(
      <juju.components.HeaderHelp.wrappedComponent
        appState={appState}
        displayShortcutsModal={sinon.stub()}
        gisf={false} />, true);
    const output = renderer.getRenderOutput();
    const instance = renderer.getMountedInstance();

    const expected = <div className="header-menu">
      <span className={'header-menu__button'}
        onClick={instance._toggleHelpMenu}
        role="button"
        tabIndex="0"
        aria-haspopup="true"
        aria-owns="headerHelpMenu"
        aria-controls="headerHelpMenu"
        aria-expanded="false">
        <juju.components.SvgIcon name="help_16"
          className="header-menu__icon"
          size="16" />
        <span className="tooltip__tooltip--below">
          <span className="tooltip__inner tooltip__inner--up">
              Help
          </span>
        </span>
      </span>
      {''}
    </div>;

    expect(output).toEqualJSX(expected);
  });

  describe('menu', function () {
    const issueUrl = 'https://github.com/juju/juju-gui/issues';
    const loggedInIssueUrl = 'https://jujucharms.com/support';
    const docsUrl = 'https://jujucharms.com/docs/stable/getting-started-jaas';

    it('opens a menu when clicked', function () {
      const renderer = jsTestUtils.shallowRender(
        <juju.components.HeaderHelp.wrappedComponent
          appState={appState}
          displayShortcutsModal={sinon.stub()}
          gisf={false} />, true);
      const instance = renderer.getMountedInstance();
      instance._toggleHelpMenu();
      const output = renderer.getRenderOutput();

      assert.equal(output.props.children.length, 2);
      assert.deepEqual(output.props.children[0].props.className,
        'header-menu__button header-menu__show-menu');

      const expected = (<juju.components.Panel
        instanceName="header-menu__menu"
        visible={true}>
        <ul className="header-menu__menu-list" role="menubar">
          <li className="header-menu__menu-list-item
              header-menu__menu-list-item-with-link"
            role="menuitem" tabIndex="0">
            <a className="header-menu__menu-list-item-link"
              href={issueUrl} target="_blank">File Issue</a>
          </li>
          <li className="header-menu__menu-list-item
              header-menu__menu-list-item-with-link"
            role="menuItem" tabIndex="0"
            onClick={instance._handleShortcutsLink}>
            <span className="header-menu__menu-list-item-link">
                Keyboard shortcuts
              <span className="header-menu__menu-extra-info">
                  Shift + ?
              </span>
            </span>
          </li>
        </ul>
      </juju.components.Panel>);
      expect(output.props.children[1]).toEqualJSX(expected);
    });

    it('show the documentation link if in gisf', function() {
      const renderer = jsTestUtils.shallowRender(
        <juju.components.HeaderHelp.wrappedComponent
          appState={appState}
          displayShortcutsModal={sinon.stub()}
          gisf={true} />, true);
      const instance = renderer.getMountedInstance();
      instance._toggleHelpMenu();
      const output = renderer.getRenderOutput();

      assert.equal(output.props.children.length, 2);
      assert.deepEqual(output.props.children[0].props.className,
        'header-menu__button header-menu__show-menu');

      const expected = (<juju.components.Panel
        instanceName="header-menu__menu"
        visible={true}>
        <ul className="header-menu__menu-list" role="menubar">
          <li className="header-menu__menu-list-item
              header-menu__menu-list-item-with-link"
            role="menuitem" tabIndex="0">
            <a className="header-menu__menu-list-item-link"
              href={docsUrl}
              target="_blank">
                View Documentation</a>
          </li>
          <li className="header-menu__menu-list-item
              header-menu__menu-list-item-with-link"
            role="menuitem" tabIndex="0">
            <a className="header-menu__menu-list-item-link"
              href={issueUrl} target="_blank">File Issue</a>
          </li>
          <li className="header-menu__menu-list-item
              header-menu__menu-list-item-with-link"
            role="menuItem" tabIndex="0"
            onClick={instance._handleShortcutsLink}>
            <span className="header-menu__menu-list-item-link">
                Keyboard shortcuts
              <span className="header-menu__menu-extra-info">
                  Shift + ?
              </span>
            </span>
          </li>
        </ul>
      </juju.components.Panel>);
      expect(output.props.children[1]).toEqualJSX(expected);
    });

    it('shows the jujuchams issues page if in gisf and logged in',
      function () {
        const renderer = jsTestUtils.shallowRender(
          <juju.components.HeaderHelp.wrappedComponent
            appState={appState}
            displayShortcutsModal={sinon.stub()}
            gisf={true}
            user={{}} />, true);
        const instance = renderer.getMountedInstance();
        instance._toggleHelpMenu();
        const output = renderer.getRenderOutput();

        assert.equal(output.props.children.length, 2);
        assert.deepEqual(output.props.children[0].props.className,
          'header-menu__button header-menu__show-menu');

        const expected = (<juju.components.Panel
          instanceName="header-menu__menu"
          visible={true}>
          <ul className="header-menu__menu-list" role="menubar">
            <li className="header-menu__menu-list-item
                header-menu__menu-list-item-with-link"
              role="menuitem" tabIndex="0">
              <a className="header-menu__menu-list-item-link"
                href={docsUrl}
                target="_blank">
                  View Documentation</a>
            </li>
            <li className="header-menu__menu-list-item
                header-menu__menu-list-item-with-link"
              role="menuitem" tabIndex="0">
              <a className="header-menu__menu-list-item-link"
                href={loggedInIssueUrl} target="_blank">Get Support</a>
            </li>
            <li className="header-menu__menu-list-item
                header-menu__menu-list-item-with-link"
              role="menuItem" tabIndex="0"
              onClick={instance._handleShortcutsLink}>
              <span className="header-menu__menu-list-item-link">
                  Keyboard shortcuts
                <span className="header-menu__menu-extra-info">
                    Shift + ?
                </span>
              </span>
            </li>
          </ul>
        </juju.components.Panel>);
        expect(output.props.children[1]).toEqualJSX(expected);
      }
    );

    it('shows the jujuchams issues page if in gijoe and logged in', () => {
      const renderer = jsTestUtils.shallowRender(
        <juju.components.HeaderHelp.wrappedComponent
          appState={appState}
          displayShortcutsModal={sinon.stub()}
          gisf={false}
          user={{}} />, true);
      const instance = renderer.getMountedInstance();
      instance._toggleHelpMenu();
      const output = renderer.getRenderOutput();

      assert.equal(output.props.children.length, 2);
      assert.deepEqual(output.props.children[0].props.className,
        'header-menu__button header-menu__show-menu');

      const expected = (
        <li className="header-menu__menu-list-item
            header-menu__menu-list-item-with-link"
          role="menuitem" tabIndex="0">
          <a className="header-menu__menu-list-item-link"
            href="https://jujucharms.com/docs/stable/about-juju"
            target="_blank">
            Get Support
          </a>
        </li>);
      const menu = output.props.children[1];
      expect(menu.props.children.props.children[1]).toEqualJSX(expected);
    });

    it('keyboard shortcuts link calls app._displayShortcutsModal', () => {
      const showFunc = sinon.stub();
      const evt = {
        stopPropagation: sinon.stub()
      };
      const renderer = jsTestUtils.shallowRender(
        <juju.components.HeaderHelp.wrappedComponent
          appState={appState}
          displayShortcutsModal={showFunc}
          gisf={true}
          user={{}} />, true);
      const instance = renderer.getMountedInstance();
      instance.setState({
        showHelpMenu: true
      });
      instance._handleShortcutsLink(evt);

      assert.equal(showFunc.callCount, 1);
      assert.equal(instance.state.showHelpMenu, false);
    });
  });
});
