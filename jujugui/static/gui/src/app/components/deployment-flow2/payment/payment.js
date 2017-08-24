/* Copyright (C) 2017 Canonical Ltd. */

'use strict';

YUI.add('deployment-flow2-payment', function() {
  class Payment extends juju.components.Section {
    constructor(props) {
      super(props, {}, 'payment');
    }

    _generateHeaderContent() {
      return (<span>Payment</span>)
    }

    render() {
      return super.render(<div>
        <h2><juju.components.SvgIcon name="complete"
          width="16" /> Add your contact and payment details</h2>
        <div className="six-col">
          <input type="radio" defaultChecked />Personal use | <input type="radio" /> Business use
          <h3>Your contact details</h3>
          <juju.components.GenericInput
            label="Full name"
            multiLine={false}
            required={true}
            type="text"
          />
          <juju.components.GenericInput
            label="Address line 1"
            multiLine={false}
            required={true}
            type="text"
          />
          <juju.components.GenericInput
            label="Address line 2 (optional)"
            multiLine={false}
            required={true}
            type="text"
          />
          <juju.components.GenericInput
            label="Town/City"
            multiLine={false}
            required={true}
            type="text"
          />
          <juju.components.GenericInput
            label="Postcode"
            multiLine={false}
            required={true}
            type="text"
          />
          <juju.components.GenericInput
            label="Country code"
            multiLine={false}
            required={true}
            type="text"
          />
          <juju.components.GenericInput
            label="Phone number"
            multiLine={false}
            required={true}
            type="text"
          />
          <juju.components.GenericInput
            label="Country"
            multiLine={false}
            required={true}
            type="text"
          />
        </div>
        <div className="six-col last-col">
          <h3>Payment details</h3>
          <juju.components.GenericInput
            label="Card number"
            multiLine={false}
            required={true}
            type="text"
          />
          <juju.components.GenericInput
            label="Expiry MM/YY"
            multiLine={false}
            required={true}
            type="text"
          />
          <juju.components.GenericInput
            label="Security number (CVC)"
            multiLine={false}
            required={true}
            type="text"
          />
          <input type="checkbox" />My card and billing details are different
          <h3>Billing address</h3>
          <juju.components.GenericInput
            label="Full name"
            multiLine={false}
            required={true}
            type="text"
          />
          <juju.components.GenericInput
            label="Address line 1"
            multiLine={false}
            required={true}
            type="text"
          />
          <juju.components.GenericInput
            label="Address line 2 (optional)"
            multiLine={false}
            required={true}
            type="text"
          />
          <juju.components.GenericInput
            label="Town/City"
            multiLine={false}
            required={true}
            type="text"
          />
          <juju.components.GenericInput
            label="Postcode"
            multiLine={false}
            required={true}
            type="text"
          />
          <juju.components.GenericInput
            label="Country code"
            multiLine={false}
            required={true}
            type="text"
          />
          <juju.components.GenericInput
            label="Phone number"
            multiLine={false}
            required={true}
            type="text"
          />
          <juju.components.GenericInput
            label="Country"
            multiLine={false}
            required={true}
            type="text"
          />
        </div>
        <p>Your monthly budget maximum $800.00</p>
        <button className="button--positive"
          onClick={this._completeSection.bind(this)}>Add payment details</button>
      </div>);
    }
  }

  Payment.propTypes = {};

  juju.components.Payment = Payment;
}, '0.1.0', {
  requires: [
    'deployment-flow2-section',
    'generic-input',
    'svg-icon'
  ]
});
