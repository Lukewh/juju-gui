/* Copyright (C) 2017 Canonical Ltd. */

'use strict';

YUI.add('deployment-flow2-payment', function() {
  class Payment extends juju.components.Section {
    constructor(props) {
      super(props, {differentBilling: false}, 'payment');
    }

    _generateHeaderContent() {
      if (this.props.cardName) {
        return (<span>Payment: <b>{this.props.cardName}</b></span>)
      }
      return (<span>Payment</span>)
    }

    _handleDifferentBilling() {
      this.setState({
        differentBilling: !this.state.differentBilling
      });
    }

    _addPayment() {
      if (this.cardName.value && this.cardName.value !== '') {
        this.props.setState({
          cardName: this.cardName.value
        });
      }
      this._completeSection();
    }

    render() {
      const notificationContent = (
        <span><b>Info:</b> We never charge you more, each month, than your maximum budget</span>
      );
      const billingClasses = classNames(
        {
          'disabled': !this.state.differentBilling
        }
      );
      return super.render(<div className="deployment-flow2__payment">
        <h2 className="deployment-flow2__section-title">Add your contact and payment details</h2>
        <juju.components.Notification
          type="information"
          content={notificationContent}
        />
        <div className="five-col">
          <div className="deployment-flow2__payment-account-type">
            <radiogroup>
              <label>
                <input name="type" type="radio" defaultChecked /> Personal use
              </label>
              <span> | </span>
              <label>
                <input name="type" type="radio" /> Business use
              </label>
            </radiogroup>
          </div>
          <h3>Your contact details</h3>
          <juju.components.DfInput
            label="Full name"
            required={true}
          />
          <juju.components.DfInput
            label="Address line 1"
            required={true}
          />
          <juju.components.DfInput
            label="Address line 2 (optional)"
            required={true}
          />
          <juju.components.DfInput
            label="Town/City"
            required={true}
          />
          <juju.components.DfInput
            label="Postcode"
            required={true}
          />
          <juju.components.DfInput
            label="Phone number"
            required={true}
          />
          <juju.components.DfInput
            label="Country"
            required={true}
          />
        </div>
        <div className="five-col last-col prepend-two">
          <h3>Payment information</h3>
          <juju.components.DfInput
            label="Name on card"
            required={true}
          />
          <juju.components.DfInput
            label="Card number"
            required={true}
          />
          <div className="six-col">
            <juju.components.DfInput
              label="Expiry MM/YY"
              required={true}
            />
          </div>
          <div className="six-col last-col">
            <juju.components.DfInput
              label="Security number (CVC)"
              required={true}
            />
          </div>
          <juju.components.DfInput
            label="Nickname for this card (optional)"
            hint="e.g. My personal card"
            parentRef={(ele) => {this.cardName = ele}}
            required={true}
          />
          <label className="deployment-flow2__payment-differentBilling">
            <input type="checkbox" checked={this.state.differentBilling} onClick={this._handleDifferentBilling.bind(this)} />My card and billing details are different
          </label>
          <div className={billingClasses}>
            <h3>Billing address</h3>
            <juju.components.DfInput
              label="Full name"
              required={true}
            />
            <juju.components.DfInput
              label="Address line 1"
              required={true}
            />
            <juju.components.DfInput
              label="Address line 2 (optional)"
              required={true}
            />
            <juju.components.DfInput
              label="Town/City"
              required={true}
            />
            <juju.components.DfInput
              label="Postcode"
              required={true}
            />
            <juju.components.DfInput
              label="Phone number"
              required={true}
            />
            <juju.components.DfInput
              label="Country"
              required={true}
            />
          </div>
        </div>
        <div>
          <div className="right">
            <p className="deployment-flow2__payment-budget">Your monthly budget maximum <b>${this.props.budget}</b></p>
            <button className="button--inline-positive"
              onClick={this._addPayment.bind(this)}>Add payment details</button>
          </div>
        </div>
      </div>);
    }
  }

  Payment.propTypes = {
    setState: PropTypes.func,
    budget: PropTypes.string,
    cardName: PropTypes.string
  };

  juju.components.Payment = Payment;
}, '0.1.0', {
  requires: [
    'deployment-flow2-section',
    'generic-input',
    'svg-icon'
  ]
});
