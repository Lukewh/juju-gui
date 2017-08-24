/* Copyright (C) 2017 Canonical Ltd. */

'use strict';

YUI.add('deployment-flow2-support-level', function() {
  class SupportLevel extends juju.components.Section {
    constructor(props) {
      super(props, {
        showPlanDetails: false,
        supportLeveL: 77,
        supportPlans: {
          charm1: {
            plan: "5",
            amount: "25"
          }
        }
      }, 'supportLevel');
    }

    componentWillMount() {
      this._estimateCost();
    }

    setSupport(cost) {
      console.log(cost);
      this.setState({
        supportLevel: parseInt(cost)
      });
      console.log(this.state.supportLevel);
      this.props.setEstimatedCost('supportLevel', cost);
    }

    _generateHeaderContent() {
      return (<span>
        <span className="deployment-flow2__section-header-left">
          Support level &bull; Application plans
        </span>
        <span className="deployment-flow2__section-header-right">
          ${this.props.getEstimatedCost()}
        </span>
      </span>);
    }

    _togglePlanDetails() {
      this.setState({
        showPlanDetails: !this.state.showPlanDetails
      });
    }

    _estimateCost() {
      if (this.state.supportLevel === 0) {
        this.props.setEstimatedCost('supportPlan', 0);

        return;
      }
      const supportPlans = this.state.supportPlans;
      let cost = 0;
      Object.keys(supportPlans).forEach(charm => {
        if (supportPlans[charm].plan && supportPlans[charm].amount) {
          cost += supportPlans[charm].plan * supportPlans[charm].amount;
        }
      });

      this.props.setEstimatedCost('supportPlan', cost);
    }

    _getPlanCost(charm) {
      return this.state.supportPlans[charm].plan;
    }
    _getTotalPlanCost(charm) {
      return (
        parseInt(this.state.supportPlans[charm].plan) *
        parseInt(this.state.supportPlans[charm].amount)
      ).toFixed(2);
    }

    _updateSupportPlan(charm, plan) {
      let supportPlans = this.state.supportPlans;
      if (!supportPlans[charm]) {
        supportPlans[charm] = {};
      }
      supportPlans[charm].plan = parseInt(plan);

      this.setState({
        supportPlans: supportPlans
      });
      this._estimateCost();
    }

    _updateSupportPlanAmount(charm, amount) {
      let supportPlans = this.state.supportPlans;
      if (!supportPlans[charm]) {
        supportPlans[charm] = {};
      }
      supportPlans[charm].amount = parseInt(amount);

      this.setState({
        supportPlans: supportPlans
      });
      this._estimateCost();
    }

    _generateApplicationPlans() {
      if (this.state.supportLevel === 0) {
        return null;
      }
      return (
        <div>
          <h2><juju.components.SvgIcon name="complete"
            width="16" /> Pick application plan</h2>
          <h3>Metered applications</h3>
          <div className="support-plan-row">
            <div className="support-plan-row__charm">
              <div className="support-plan-row__charm-name">Leostream</div>
              <div className="support-plan-row__charm-units">2 units</div>
            </div>
            <div className="support-plan-row__plan">
              <juju.components.InsetSelect
                disabled={false}
                label="Support plan"
                onChange={this._updateSupportPlan.bind(this, 'charm1')}
                options={
                  [
                    {label: "Standard plan", value: "5"},
                    {label: "Advanced plan", value: "10"}
                  ]
                }
                value="5"
              />
              <p>Metered by: number of users<br />
              For: hosted desktop management<br />
              ${parseInt(this._getPlanCost.call(this, 'charm1')).toFixed(2)} per user per month<br />default
              <a href="">Pricing</a><br />
              <a href="">Terms and conditions</a></p>
            </div>
            <div className="support-plan-row__amount">
              <juju.components.InsetSelect
                disabled={false}
                label="Amount"
                onChange={this._updateSupportPlanAmount.bind(this, 'charm1')}
                options={
                  [
                    {label: "25 seats", value: "25"},
                    {label: "50 seats", value: "50"}
                  ]
                }
                value="25"
              />
              <p><a href="">Usage history</a></p>
            </div>
            <div className="support-plan-row__total">
              ${this._getTotalPlanCost.call(this, 'charm1')}
            </div>
          </div>
          <h3>Unmetered applications</h3>
          <table>
            <tbody>
              <tr>
                <th>Charm name</th>
                <td>4 units</td>
              </tr>
            </tbody>
          </table>
        </div>
      );
    }

    render() {
      const infoNotificationContent = (
        <span>
          <b>Info:</b> Cost is determined by plan and usage. Pricing can also vary with support.
        </span>
      );
      const extraInfoclasses = classNames({
        'hidden': !this.state.showPlanDetails
      });
      const supportPlanClasses = classNames({
        'hidden': this.state.supportLevel === 0
      });
      return super.render(<div>
        <h2><juju.components.SvgIcon name="complete"
          width="16" /> Choose your level of support</h2>
        <p>Sets a price for Ubuntu Advantage support.</p>
        <p>Minimum: 1 month, charged per machine</p>
        <div className="three-col">
          <div className="card" onClick={this.setSupport.bind(this, 0)}>
            Free
            <ul>
              <li>Community support</li>
              <li>No credit card required</li>
            </ul>
            <div className={extraInfoclasses}>
              <p>Your trial of 1000 machine-hours of JAAS hosting is free.</p>
              <p>Payment will be requested after 1000 hours usage of the 7 machines in your model</p>
              <p>Cloud provider charges are incurred seperately.</p>
            </div>
            $0
          </div>
        </div>
        <div className="three-col">
          <div className="card" onClick={this.setSupport.bind(this, 8.75)}>
            Essential
            <ul>
              <li>8hx5d ticket</li>
              <li>Livepatch</li>
            </ul>
            <div className={extraInfoclasses}>
              <p>This plan suits users that are seeking to cap the cost of Juju development at scale.</p>
            </div>
            $8.75
          </div>
          <p>$1.25 per machine<br />Minimum 10 machines</p>
        </div>
        <div className="three-col">
          <div className="card" onClick={this.setSupport.bind(this, 77)}>
            Standard
            <ul>
              <li>10x5 phone support</li>
              <li>2h critical response</li>
              <li>Livepatch</li>
            </ul>
            <div className={extraInfoclasses}>
              Details
            </div>
            $77.00
          </div>
          <p>$11.00 per machine</p>
        </div>
        <div className="three-col last-col">
          <div className="card" onClick={this.setSupport.bind(this, 154)}>
            Advanced
            <ul>
              <li>24x7 phone support</li>
              <li>1h critical response</li>
              <li>Livepatch</li>
            </ul>
            <div className={extraInfoclasses}>
              Details
            </div>
            $154.00
          </div>
          <p>$22.00 per machine</p>
        </div>
        <button onClick={this._togglePlanDetails.bind(this)}>View plan details</button>

        {this._generateApplicationPlans()}

        <button className="button--positive"
          onClick={this._completeSection.bind(this)}>Choose Ubuntu Advantage with these plans</button>
      </div>);
    }
  }

  SupportLevel.propTypes = {
    setEstimatedCost: PropTypes.func,
    getEstimatedCost: PropTypes.func
  };

  juju.components.SupportLevel = SupportLevel;
}, '0.1.0', {
  requires: [
    'deployment-flow2-section',
    'svg-icon'
  ]
});
