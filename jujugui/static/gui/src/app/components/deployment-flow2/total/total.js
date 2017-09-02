/* Copyright (C) 2017 Canonical Ltd. */

'use strict';

YUI.add('deployment-flow2-total', function() {
  class Total extends juju.components.Section {
    constructor(props) {
      super(props, {}, 'total');
    }

    _generateHeaderContent() {
      const right = (<span className="deployment-flow2__section-header-right">
        <span className="total">${this.props.getEstimatedCost()}</span>
      </span>);

      let left = (
        <span className="deployment-flow2__section-header-left">
          Total &bull; Budget
        </span>);
      if (this.props.budget) {
        left = (
          <span className="deployment-flow2__section-header-left">
            Total &bull; Budget: <b>${this.props.budget}</b>
          </span>
        );
      }
      return (<span>
        {left}
        {right}
      </span>);
    }

    _setBudget() {
      this.props.setState({
        budget: this.budget.value
      });
      this._completeSection();
    }

    render() {
      const notificationContent = (
        <span><b>Info:</b> We will email you when you reach 80% of this limit. <span className="link">
          Edit notifications
        </span></span>
      );
      return super.render(<div>
        <h2 className="deployment-flow2__section-title">Set your maximum monthly budget</h2>
        <juju.components.Notification
          type="information"
          content={notificationContent}
        />
        <div className="deployment-flow2__total-row">Estimated monthly cost: <span className="total">${this.props.getEstimatedCost()}</span></div>
        <div className="deployment-flow2__budget-row">Never charge me more than: <div className="deployment-flow2__budget-row-input">
          $ <juju.components.DfInput
            value={this.props.budget} parentRef={(ele) => {this.budget = ele}}
          /></div>
        </div>

        <button className="button--inline-positive right"
          onClick={this._setBudget.bind(this)}>Continue</button>
      </div>);
    }
  }

  Total.propTypes = {
    budget: PropTypes.string,
    getEstimatedCost: PropTypes.func,
    setState: PropTypes.func
  };

  juju.components.Total = Total;
}, '0.1.0', {
  requires: [
    'deployment-flow2-section',
    'svg-icon'
  ]
});
