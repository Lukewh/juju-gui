/* Copyright (C) 2017 Canonical Ltd. */

'use strict';

YUI.add('deployment-flow2-support-level', function() {
  class SupportLevel extends juju.components.Section {
    constructor(props) {
      super(props, {
        showPlanDetails: false,
        supportLevel: 0,
        applicationPlans: {
          charm1: {
            plan: "5",
            amount: "0"
          }
        },
        view: 'supportLevel',
        applicationScreenViewed: false
      }, 'supportLevel');

      this.supportLevelMap = {
        '0': 'Free',
        '8.75': 'Essential',
        '77': 'Standard',
        '154': 'Advanced'
      };
    }

    setSupport(cost) {
      const _cost = parseFloat(cost);
      this.setState({
        supportLevel: _cost
      });
      this.props.setEstimatedCost('supportLevel', _cost);
    }

    _generateHeaderContent() {
      if (this.state.applicationScreenViewed) {
        const charm1Cost = this._getApplicationCost('charm1');
        return (<span>
          <span className="deployment-flow2__section-header-left">
            Support level: <b>{this.supportLevelMap[this.state.supportLevel.toString()]}</b>
          </span>
          <span className="deployment-flow2__section-header-right">
            ${this._getTotalSupportCost().toFixed(2)}
          </span>
          <span className="deployment-flow2__section-header-applicationSupport">
            <span className="left">
              <img src="https://api.jujucharms.com/charmstore/v5/~containers/easyrsa-15/icon.svg"
                width="24"/> EasyRSA
            </span>
            <span className="deployment-flow2__section-header-right">
              ${charm1Cost ? charm1Cost.toFixed(2) : '0.00'}
            </span>
          </span>
        </span>);
      } else {
        return (<span>
          <span className="deployment-flow2__section-header-left">
            Support level &bull; Application plans
          </span>
          <span className="deployment-flow2__section-header-right">
            ${this._getTotalSupportCost().toFixed(2)}
          </span>
        </span>);
      }
    }

    _togglePlanDetails() {
      this.setState({
        showPlanDetails: !this.state.showPlanDetails
      });
    }

    _getAllApplicationCost() {
      const applicationPlans = this.state.applicationPlans;
      let cost = 0;
      Object.keys(applicationPlans).forEach(charm => {
        if (applicationPlans[charm].plan && applicationPlans[charm].amount) {
          cost += applicationPlans[charm].plan * applicationPlans[charm].amount;
        }
      });

      this.props.setEstimatedCost('supportPlan', cost);
    }

    _getApplicationRate(charm) {
      return this.state.applicationPlans[charm].plan;
    }
    _getApplicationCost(charm) {
      return (
        parseInt(this.state.applicationPlans[charm].plan) *
        parseInt(this.state.applicationPlans[charm].amount)
      );
    }

    _updateSupportPlan(charm, plan) {
      let applicationPlans = this.state.applicationPlans;
      if (!applicationPlans[charm]) {
        applicationPlans[charm] = {};
      }
      applicationPlans[charm].plan = parseInt(plan);
      this.setState({
        applicationPlans: applicationPlans
      });
      this._getAllApplicationCost();
    }

    _updateSupportPlanAmount(charm, amount) {
      let applicationPlans = this.state.applicationPlans;
      if (!applicationPlans[charm]) {
        applicationPlans[charm] = {};
      }
      applicationPlans[charm].amount = parseInt(amount);

      this.setState({
        applicationPlans: applicationPlans
      });
      this._getAllApplicationCost();
    }

    _getTotalSupportCost() {
      let cost =  parseFloat(this.state.supportLevel);
      // if (this.state.applicationScreenViewed) {
      //   Object.keys(this.state.applicationPlans).forEach(charm => {
      //     cost += this._getApplicationCost(charm);
      //   });
      // }

      return cost;
    }

    _switchView() {
      this.setState({
        view: this.state.view === 'supportLevel' ? 'applicationPlan' : 'supportLevel',
        applicationScreenViewed: this.state.view === 'supportLevel' &&
          this.state.applicationScreenViewed === false ? true : false
      });

      this._getAllApplicationCost();
    }

    _generateApplicationPlans() {
      const infoNotificationContent = (
        <span>
          <b>Info:</b> Cost is determined by plan and usage. Pricing can also vary with support.
        </span>
      );
      return (
        <div className="deployment-flow2__support-level">
          <div className="clearfix deployment-flow2__support-level-heading">
            <p className="left">Support level: <b>{this.supportLevelMap[this.state.supportLevel.toString()]}</b>
            &nbsp;<span role="button" className="link" onClick={this._switchView.bind(this)}>
              Change
            </span></p>
            <p className="right">
              <b>${this.state.supportLevel.toFixed(2)}</b>
            </p>
          </div>
          <h2 className="deployment-flow2__section-title">Pick application plans and estimate usage</h2>
          <juju.components.Notification
            type="information"
            content={infoNotificationContent}
            />
          <table className="df-table">
            <thead>
              <tr>
                <th className="equal-width">Metered applications</th>
                <th>Plan</th>
                <th>Estimated usage</th>
                <th className="align-right">Estimated cost</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <img src="https://api.jujucharms.com/charmstore/v5/~containers/easyrsa-15/icon.svg"
                    width="24"/>EasyRSA<br /><span>1 unit</span>
                </td>
                <td>
                  <juju.components.DfSelect
                    onChange={this._updateSupportPlan.bind(this, 'charm1')}
                    options={
                      [
                        {label: "Standard plan", value: "5"},
                        {label: "Advanced plan", value: "10"}
                      ]
                    }
                    value={this.state.applicationPlans.charm1.plan}
                  />
                  <p className="smaller">Metered by: number of available certificates<br />
                  For: issuing of certificates<br />
                  <b>${parseInt(this._getApplicationRate.call(this, 'charm1')).toFixed(2)} per certificate per month</b><br />
                  <a href="">Pricing</a><br />
                  <a href="">Terms and conditions</a></p>
                </td>
                <td>
                  <juju.components.DfSelect
                    onChange={this._updateSupportPlanAmount.bind(this, 'charm1')}
                    options={
                      [
                        {label: "0", value: "0"},
                        {label: "1", value: "1"},
                        {label: "5", value: "5"}
                      ]
                    }
                    value={this.state.applicationPlans.charm1.amount}
                  />
                  Certificates
                  <p className="smaller"><a href="">Usage history</a></p>
                </td>
                <td className="align-right">
                  <b>${this._getApplicationCost.call(this, 'charm1').toFixed(2)}</b>
                </td>
              </tr>
            </tbody>
          </table>

          <table className="df-table">
            <thead>
              <tr>
                <th className="equal-width">Unmetered applications</th>
                <th>Units</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><img src="https://api.jujucharms.com/charmstore/v5/~containers/etcd-48/icon.svg"
                  width="24"/>etcd</td>
                <td>3</td>
              </tr>
              <tr>
                <td><img src="https://api.jujucharms.com/charmstore/v5/~containers/kubeapi-load-balancer-25/icon.svg"
                  width="24"/>kubeapi-load-balancer</td>
                <td>1</td>
              </tr>
              <tr>
                <td><img src="https://api.jujucharms.com/charmstore/v5/~containers/kubernetes-master-47/icon.svg"
                  width="24"/>kubernetes-master</td>
                <td>1</td>
              </tr>
              <tr>
                <td><img src="https://api.jujucharms.com/charmstore/v5/~containers/kubernetes-worker-52/icon.svg"
                  width="24"/>kubernetes-worker</td>
                <td>3</td>
              </tr>
            </tbody>
          </table>
          <div>
            <button className="button--inline-positive right"
              onClick={this._completeSection.bind(this)}>Continue with these plans</button>
          </div>
        </div>
      );
    }

    _generateSupportLevel() {
      const extraInfoclasses = classNames(
        'deployment-flow2__card-info',
        {
          'hidden': !this.state.showPlanDetails
        }
      );
      const supportPlanClasses = classNames({
        'hidden': this.state.supportLevel === 0
      });
      return (
        <div>
          <h2 className="deployment-flow2__section-title">Choose your level of support</h2>
          <p>Sets a price for Ubuntu Advantage support. Minimum: 1 month, charged per machine</p>
          <div className="three-col">
            <div className={`deployment-flow2__card ${this.state.supportLevel === 0 ? 'is-selected' : ''}`} onClick={this.setSupport.bind(this, 0)}>
              <h2 className="deployment-flow2__section-title">Free</h2>
              <ul className="deployment-flow2__card-list">
                <li>Community support</li>
              </ul>
              <div className={extraInfoclasses}>
                <p>Your trial of 1000 machine-hours of JAAS hosting is free.</p>
                <p>Payment will be requested after 1000 hours usage of the 7 machines in your model</p>
                <p>Cloud provider charges are incurred seperately.</p>
              </div>
              <div className="deployment-flow2__card-footer">
                <b>$0</b> - no credit card required
              </div>
            </div>
          </div>
          <div className="three-col">
            <div className={`deployment-flow2__card ${this.state.supportLevel === 8.75 ? 'is-selected' : ''}`} onClick={this.setSupport.bind(this, 8.75)}>
              <h2 className="deployment-flow2__section-title">Essential</h2>
              <ul className="deployment-flow2__card-list">
                <li>8hx5d ticket</li>
                <li>Livepatch</li>
              </ul>
              <div className={extraInfoclasses}>
                <p>This plan suits users that are seeking to cap the cost of Juju development at scale.</p>
              </div>
              <div className="deployment-flow2__card-footer">
                <span className="dollars">$8</span>.75
              </div>
            </div>
            <p>$1.25 per machine/hour<br />Minimum 10 machines</p>
          </div>
          <div className="three-col">
            <div className={`deployment-flow2__card ${this.state.supportLevel === 77 ? 'is-selected' : ''}`} onClick={this.setSupport.bind(this, 77)}>
              <h2 className="deployment-flow2__section-title">Standard</h2>
              <ul className="deployment-flow2__card-list">
                <li>10x5 phone support</li>
                <li>2h critical response</li>
                <li>Livepatch</li>
              </ul>
              <div className={extraInfoclasses}>
                <p>Details</p>
              </div>
              <div className="deployment-flow2__card-footer">
                <span className="dollars">$77</span>.00
              </div>
            </div>
            <p>$11.00 per machine/hour</p>
          </div>
          <div className="three-col last-col">
            <div className={`deployment-flow2__card ${this.state.supportLevel === 154 ? 'is-selected' : ''}`} onClick={this.setSupport.bind(this, 154)}>
              <h2 className="deployment-flow2__section-title">Advanced</h2>
              <ul className="deployment-flow2__card-list">
                <li>24x7 phone support</li>
                <li>1h critical response</li>
                <li>Livepatch</li>
              </ul>
              <div className={extraInfoclasses}>
                <p>Details</p>
              </div>
              <div className="deployment-flow2__card-footer">
                <span className="dollars">$154</span>.00
              </div>
            </div>
            <p>$22.00 per machine/hour</p>
          </div>
          <div className="divide-button">
            <button className="button--inline-neutral" onClick={this._togglePlanDetails.bind(this)}>
              {this.state.showPlanDetails ? 'Hide' : 'View'} support details
            </button>
          </div>

          <button className="button--inline-positive right"
            onClick={this._switchView.bind(this)}>Confirm support level</button>
        </div>
      );
    }

    render() {
      const content = this.state.view === 'supportLevel' ? this._generateSupportLevel() :
        this._generateApplicationPlans();
      return super.render(content);
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
