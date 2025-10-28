import { describe, it, expect } from 'vitest';
import { RideHailingPRForm } from '@/business/partner_request/ride_hailing';
import { CommutePRForm } from '@/business/partner_request/commute';
import { PartnerRequestForm } from '@/business/partner_request/form';

describe('ValibotClass.extend - Method Inheritance', () => {
  it('RideHailingPRForm instance should have its own create and update methods', () => {
    const form = new RideHailingPRForm({});

    // Check that create method exists
    expect(form.create).toBeDefined();
    expect(typeof form.create).toBe('function');

    // Check that update method exists
    expect(form.update).toBeDefined();
    expect(typeof form.update).toBe('function');

    // Verify it's not the base class methods (which throw errors)
    // The methods should not throw "Use typed form" error
    expect(form.create.toString()).not.toContain('Use typed form');
    expect(form.update.toString()).not.toContain('Use typed form');

    // Verify the methods contain the specific API calls
    expect(form.create.toString()).toContain('PRV1CreateRideHailing');
    expect(form.update.toString()).toContain('PRV2EditRideHailing');
  });

  it('CommutePRForm instance should have its own create and update methods', () => {
    const form = new CommutePRForm({});

    // Check that create method exists
    expect(form.create).toBeDefined();
    expect(typeof form.create).toBe('function');

    // Check that update method exists
    expect(form.update).toBeDefined();
    expect(typeof form.update).toBe('function');

    // Verify the methods contain the specific API calls
    expect(form.create.toString()).toContain('PRV1CreateCommute');
    expect(form.update.toString()).toContain('PRV2EditCommute');
  });

  it('PartnerRequestForm instance should have base methods that throw errors', () => {
    const form = new PartnerRequestForm({});

    // Base class methods should throw
    expect(() => form.create()).toThrow('Use typed form');
    expect(() => form.update()).toThrow('Use typed form');
  });

  it('Extended classes should maintain proper prototype chain', () => {
    const rideHailingForm = new RideHailingPRForm({});
    const commuteForm = new CommutePRForm({});
    const baseForm = new PartnerRequestForm({});

    // Check instanceof relationships
    expect(rideHailingForm).toBeInstanceOf(RideHailingPRForm);
    expect(rideHailingForm).toBeInstanceOf(PartnerRequestForm);

    expect(commuteForm).toBeInstanceOf(CommutePRForm);
    expect(commuteForm).toBeInstanceOf(PartnerRequestForm);

    expect(baseForm).toBeInstanceOf(PartnerRequestForm);
  });

  it('Extended classes should have validate method from formClass', () => {
    const rideHailingForm = new RideHailingPRForm({});
    const commuteForm = new CommutePRForm({});

    // Check that validate method exists (from V.formClass)
    expect(rideHailingForm.validate).toBeDefined();
    expect(typeof rideHailingForm.validate).toBe('function');

    expect(commuteForm.validate).toBeDefined();
    expect(typeof commuteForm.validate).toBe('function');
  });
});
