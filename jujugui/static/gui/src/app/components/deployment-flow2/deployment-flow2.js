/* Copyright (C) 2017 Canonical Ltd. */

'use strict';

class DeploymentFlow2 extends React.Component {
  constructor() {
    super();

    this.state = {
      estimatedCost: 0,
      sectionsComplete: 1,
      sectionsTotal: 7,
      openSection: 'modelName',
      completeSections: [],
      visitedSections: ['modelName']
    };

    this.sectionOrder = [
      'modelName',
      'cloud',
      'supportLevel',
      'jaasHosting',
      'total',
      'payment',
      'deploy'
    ];
  }

  _handleClose() {
    console.log('close');
  }

  _generateProgressBar() {
    const width = Math.ceil((this.state.sectionsComplete /
      this.state.sectionsTotal)
       * 100);
    return (<div className="deployment-flow2__progress">
      <div className="deployment-flow2__progress-bar"
        style={{width: `${width}%`}}></div>
    </div>);
  }

  _generateHeader() {
    return (<div className="deployment-panel__header">
      <div className="deployment-panel__header-logo">
        <juju.components.SvgIcon
          className="svg-icon"
          height="35"
          name="juju-logo"
          width="90" />
      </div>
      <div className="inner-wrapper">
        <div className="deployment-panel__header-name">
          Deploy your model
        </div>
        <div className="deployment-panel__header-cost">
          Estimated monthly cost:
          <span className="deployment-panel__header-cost-value">
            ${this.state.estimatedCost.toFixed(2)}
          </span>
        </div>
        {this._generateProgressBar()}
      </div>
    </div>);
  }

  _goToSection(sectionName) {
    this.setState({
      openSection: sectionName
    });
    let visitedSections = this.state.visitedSections;
    if (!visitedSections.includes(sectionName)) {
      visitedSections.push(sectionName);
      this.setState({
        visistedSections: visitedSections
      });
    }
  }

  _goToVisitedSection(sectionName) {
    if (this.state.visitedSections.includes(sectionName)) {
      this._goToSection(sectionName);
    }
  }

  _completeSection() {
    const currentSectionIndex = this.sectionOrder
      .indexOf(this.state.openSection);
    const nextSection = currentSectionIndex + 1;

    let completeSections = this.state.completeSections;
    if (!completeSections
      .includes(this.sectionOrder[currentSectionIndex])) {
      completeSections.push(this.sectionOrder[currentSectionIndex]);
      this.setState({
        completeSections: completeSections
      })
    }

    this._goToSection(this.sectionOrder[nextSection]);
  }

  render() {
    const openSection = this.state.openSection;
    return (
    <juju.components.Panel
      instanceName="deployment-flow2-panel"
      visible={true}>
      <div className="deployment-panel">
        {this._generateHeader()}
        <div className="deployment-panel__content">
          <juju.components.ModelName
            isComplete={this.state.completeSections.includes('modelName')}
            isOpen={openSection === 'modelName'}
            isVisited={this.state.visitedSections.includes('modelName')}
            goToVisitedSection={this._goToVisitedSection.bind(this)}
            completeSection={this._completeSection.bind(this)} />
          <juju.components.Cloud
            isComplete={this.state.completeSections.includes('cloud')}
            isOpen={openSection === 'cloud'}
            isVisited={this.state.visitedSections.includes('cloud')}
            goToVisitedSection={this._goToVisitedSection.bind(this)}
            completeSection={this._completeSection.bind(this)} />
          <juju.components.SupportLevel
            isComplete={this.state.completeSections.includes('supportLevel')}
            isOpen={openSection === 'supportLevel'}
            isVisited={this.state.visitedSections.includes('supportLevel')}
            goToVisitedSection={this._goToVisitedSection.bind(this)}
            completeSection={this._completeSection.bind(this)} />
          <juju.components.JaasHosting
            isComplete={this.state.completeSections.includes('jaasHosting')}
            isOpen={openSection === 'jaasHosting'}
            isVisited={this.state.visitedSections.includes('jaasHosting')}
            goToVisitedSection={this._goToVisitedSection.bind(this)}
            completeSection={this._completeSection.bind(this)} />
          <juju.components.Total
            isComplete={this.state.completeSections.includes('total')}
            isOpen={openSection === 'total'}
            isVisited={this.state.visitedSections.includes('total')}
            goToVisitedSection={this._goToVisitedSection.bind(this)}
            completeSection={this._completeSection.bind(this)} />
          <juju.components.Payment
            isComplete={this.state.completeSections.includes('payment')}
            isOpen={openSection === 'payment'}
            isVisited={this.state.visitedSections.includes('payment')}
            goToVisitedSection={this._goToVisitedSection.bind(this)}
            completeSection={this._completeSection.bind(this)} />
          <juju.components.Deploy
            isComplete={this.state.completeSections.includes('deploy')}
            isOpen={openSection === 'deploy'}
            isVisited={this.state.visitedSections.includes('deploy')}
            goToVisitedSection={this._goToVisitedSection.bind(this)}
            completeSection={this._completeSection.bind(this)} />
        </div>
      </div>
    </juju.components.Panel>);
  }
}

DeploymentFlow2.propTypes = {};

YUI.add('deployment-flow2', function() {
  juju.components.DeploymentFlow2 = DeploymentFlow2;
}, '0.1.0', {
  requires: [
    'deployment-flow2-model-name',
    'deployment-flow2-cloud',
    'deployment-flow2-support-level',
    'deployment-flow2-jaas-hosting',
    'deployment-flow2-total',
    'deployment-flow2-payment',
    'deployment-flow2-deploy',
    'panel'
  ]
});
