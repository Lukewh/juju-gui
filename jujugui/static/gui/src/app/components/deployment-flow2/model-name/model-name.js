/* Copyright (C) 2017 Canonical Ltd. */

'use strict';

YUI.add('deployment-flow2-model-name', function() {
  class ModelName extends juju.components.Section {
    constructor(props) {
      super(props, {}, 'modelName');
    }

    _generateHeaderContent() {
      return (<span>Model name</span>);
    }

    _generateLoggedOut() {
      return (
        <div>
          <h2><juju.components.SvgIcon name="complete"
            width="16" /> Login to Ubuntu SSO</h2>
          <p>JAAS requires an Ubuntu One identity (Ubuntu SSO). Learn more at
            &nbsp;<a href="https://login.ubuntu.com" target="_blank">
              https://login.ubuntu.com
            </a>
          </p>
          <p>Don't have an account? <a href="">Sign up</a></p>

          <button className="button--inline-positive right"
            onClick={this._completeSection.bind(this)}>Login</button>
        </div>);
    }

    _generateLoggedIn() {
      return (
        <div>
          <p>Signed in as <b>cassiocassio</b>. <a href="">
            Login as a different user
          </a></p>

          <button className="button--inline-positive right"
            onClick={this._completeSection.bind(this)}>Name model</button>
        </div>);
    }

    render() {
      return super.render(
        <div>
          <div className="six-col">
            <h2><juju.components.SvgIcon name="complete"
              width="16" /> Model name</h2>

            <div className="p-form-validation">
              <input className="p-form-validation__input"
                type="text" defaultValue="my-model" />
              <p className="p-form-validation__message">
                Lower case letters, numbers and hyphens (-) only
              </p>
            </div>
          </div>
          <div className="six-col last-col">
            {this._generateLoggedOut()}
            {this._generateLoggedIn()}
          </div>
        </div>
      );
    }
  }

  ModelName.propTypes = {};

  juju.components.ModelName = ModelName;
}, '0.1.0', {
  requires: [
    'deployment-flow2-section',
    'svg-icon'
  ]
});
