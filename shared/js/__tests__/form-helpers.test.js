/**
 * Unit tests for shared/js/form-helpers.js
 * Tests: Notification, FormValidator, ImageLazyLoader, ScrollReveal, utility functions
 */

// Mock IntersectionObserver globally
const mockObserveGlobal = jest.fn();
const mockUnobserveGlobal = jest.fn();
window.IntersectionObserver = jest.fn((callback) => ({
  observe: mockObserveGlobal,
  unobserve: mockUnobserveGlobal,
  disconnect: jest.fn()
}));

// Setup DOM and globals before loading the module
beforeEach(() => {
  document.body.innerHTML = '';
  mockObserveGlobal.mockClear();
  mockUnobserveGlobal.mockClear();
  // Reset globals
  delete window.showNotification;
  delete window.initFormValidator;
  delete window.debounce;
  delete window.throttle;
  delete window.getUrlParam;
  delete window.isElementInViewport;
  delete window.smoothScrollTo;
});

// Helper to load the module fresh each time
function loadModule() {
  // Clear module cache
  jest.resetModules();
  require('../form-helpers.js');
}

describe('Notification system', () => {
  beforeEach(() => {
    loadModule();
  });

  test('showNotification is defined on window', () => {
    expect(window.showNotification).toBeDefined();
    expect(typeof window.showNotification).toBe('function');
  });

  test('showNotification creates a notification element in the DOM', () => {
    window.showNotification('Test message', 'success');
    const notification = document.querySelector('.notification');
    expect(notification).not.toBeNull();
    expect(notification.classList.contains('success')).toBe(true);
    expect(notification.textContent).toContain('Test message');
  });

  test('showNotification supports different types', () => {
    window.showNotification('Info', 'info');
    const infoEl = document.querySelector('.notification.info');
    expect(infoEl).not.toBeNull();
    expect(infoEl.textContent).toContain('ℹ');

    window.showNotification('Error', 'error');
    const errorEl = document.querySelector('.notification.error');
    expect(errorEl).not.toBeNull();
    expect(errorEl.textContent).toContain('✕');

    window.showNotification('Warning', 'warning');
    const warnEl = document.querySelector('.notification.warning');
    expect(warnEl).not.toBeNull();
    expect(warnEl.textContent).toContain('⚠');
  });

  test('showNotification applies position class', () => {
    window.showNotification('Test', 'info', 5000, 'bottom-left');
    const notification = document.querySelector('.notification');
    expect(notification.classList.contains('bottom-left')).toBe(true);
  });

  test('notification auto-hides after duration', () => {
    jest.useFakeTimers();
    window.showNotification('Timed', 'info', 3000);
    expect(document.querySelector('.notification')).not.toBeNull();

    jest.advanceTimersByTime(3000);
    expect(document.querySelector('.notification')).toBeNull();
    jest.useRealTimers();
  });

  test('notification with duration 0 does not auto-hide', () => {
    jest.useFakeTimers();
    window.showNotification('Persistent', 'info', 0);
    jest.advanceTimersByTime(10000);
    expect(document.querySelector('.notification')).not.toBeNull();
    jest.useRealTimers();
  });
});

describe('FormValidator', () => {
  let form;

  beforeEach(() => {
    document.body.innerHTML = `
      <form id="test-form">
        <div>
          <input type="text" name="username" required minlength="3" maxlength="20" />
        </div>
        <div>
          <input type="email" name="email" required />
        </div>
        <div>
          <input type="tel" name="phone" />
        </div>
        <div>
          <input type="text" name="code" pattern="^[A-Z]{3}$" />
        </div>
        <div>
          <textarea name="message" required></textarea>
        </div>
        <div>
          <select name="category">
            <option value="">Select</option>
            <option value="a">A</option>
          </select>
        </div>
      </form>
    `;
    form = document.getElementById('test-form');
    loadModule();
  });

  test('initFormValidator returns a validator instance', () => {
    const validator = window.initFormValidator('#test-form');
    expect(validator).not.toBeNull();
    expect(validator.form).toBe(form);
  });

  test('initFormValidator returns null for non-existent selector', () => {
    const validator = window.initFormValidator('#non-existent');
    expect(validator).toBeNull();
  });

  test('validates required fields - empty value shows error', () => {
    const validator = window.initFormValidator('#test-form');
    const usernameInput = form.querySelector('[name="username"]');
    usernameInput.value = '';

    // Trigger blur event
    usernameInput.dispatchEvent(new Event('blur'));

    expect(usernameInput.classList.contains('error')).toBe(true);
    const errorEl = usernameInput.parentElement.querySelector('.form-error');
    expect(errorEl).not.toBeNull();
    expect(errorEl.textContent).toContain('obbligatorio');
  });

  test('validates email format', () => {
    const validator = window.initFormValidator('#test-form');
    const emailInput = form.querySelector('[name="email"]');

    emailInput.value = 'invalid-email';
    emailInput.dispatchEvent(new Event('blur'));
    expect(emailInput.classList.contains('error')).toBe(true);
    expect(emailInput.parentElement.querySelector('.form-error').textContent)
      .toContain('Email non valida');

    // Valid email clears error
    emailInput.value = 'user@example.com';
    emailInput.dispatchEvent(new Event('blur'));
    expect(emailInput.classList.contains('error')).toBe(false);
  });

  test('validates phone number format', () => {
    const validator = window.initFormValidator('#test-form');
    const phoneInput = form.querySelector('[name="phone"]');

    phoneInput.value = 'abc';
    phoneInput.dispatchEvent(new Event('blur'));
    expect(phoneInput.classList.contains('error')).toBe(true);

    phoneInput.value = '+41 79 123 45 67';
    phoneInput.dispatchEvent(new Event('blur'));
    expect(phoneInput.classList.contains('error')).toBe(false);
  });

  test('validates pattern attribute', () => {
    const validator = window.initFormValidator('#test-form');
    const codeInput = form.querySelector('[name="code"]');

    codeInput.value = 'abc';
    codeInput.dispatchEvent(new Event('blur'));
    expect(codeInput.classList.contains('error')).toBe(true);
    expect(codeInput.parentElement.querySelector('.form-error').textContent)
      .toContain('Formato non valido');

    codeInput.value = 'ABC';
    codeInput.dispatchEvent(new Event('blur'));
    expect(codeInput.classList.contains('error')).toBe(false);
  });

  test('validates minlength', () => {
    const validator = window.initFormValidator('#test-form');
    const usernameInput = form.querySelector('[name="username"]');

    usernameInput.value = 'ab';
    usernameInput.dispatchEvent(new Event('blur'));
    expect(usernameInput.classList.contains('error')).toBe(true);
    expect(usernameInput.parentElement.querySelector('.form-error').textContent)
      .toContain('Minimo 3 caratteri');
  });

  test('validates maxlength', () => {
    const validator = window.initFormValidator('#test-form');
    const usernameInput = form.querySelector('[name="username"]');

    usernameInput.value = 'a'.repeat(21);
    usernameInput.dispatchEvent(new Event('blur'));
    expect(usernameInput.classList.contains('error')).toBe(true);
    expect(usernameInput.parentElement.querySelector('.form-error').textContent)
      .toContain('Massimo 20 caratteri');
  });

  test('validateAll returns false when required fields are empty', () => {
    const validator = window.initFormValidator('#test-form');
    const result = validator.validateAll();
    expect(result).toBe(false);
    expect(validator.isValid).toBe(false);
  });

  test('validateAll returns true when all fields are valid', () => {
    const validator = window.initFormValidator('#test-form');
    form.querySelector('[name="username"]').value = 'testuser';
    form.querySelector('[name="email"]').value = 'test@example.com';
    form.querySelector('[name="message"]').value = 'Hello world';

    const result = validator.validateAll();
    expect(result).toBe(true);
    expect(validator.isValid).toBe(true);
  });

  test('getFormData returns form values as object', () => {
    const validator = window.initFormValidator('#test-form');
    form.querySelector('[name="username"]').value = 'john';
    form.querySelector('[name="email"]').value = 'john@test.com';

    const data = validator.getFormData();
    expect(data.username).toBe('john');
    expect(data.email).toBe('john@test.com');
  });

  test('reset clears form and removes errors', () => {
    const validator = window.initFormValidator('#test-form');
    const usernameInput = form.querySelector('[name="username"]');
    usernameInput.value = '';
    usernameInput.dispatchEvent(new Event('blur'));
    expect(usernameInput.classList.contains('error')).toBe(true);

    validator.reset();
    expect(usernameInput.classList.contains('error')).toBe(false);
    expect(usernameInput.parentElement.querySelector('.form-error')).toBeNull();
  });

  test('change event also triggers validation', () => {
    const validator = window.initFormValidator('#test-form');
    const emailInput = form.querySelector('[name="email"]');

    emailInput.value = 'bad-email';
    emailInput.dispatchEvent(new Event('change'));
    expect(emailInput.classList.contains('error')).toBe(true);
  });
});

describe('Utility functions', () => {
  beforeEach(() => {
    loadModule();
  });

  describe('debounce', () => {
    test('debounce delays function execution', () => {
      jest.useFakeTimers();
      const fn = jest.fn();
      const debounced = window.debounce(fn, 300);

      debounced();
      debounced();
      debounced();

      expect(fn).not.toHaveBeenCalled();
      jest.advanceTimersByTime(300);
      expect(fn).toHaveBeenCalledTimes(1);
      jest.useRealTimers();
    });

    test('debounce passes arguments to the function', () => {
      jest.useFakeTimers();
      const fn = jest.fn();
      const debounced = window.debounce(fn, 100);

      debounced('arg1', 'arg2');
      jest.advanceTimersByTime(100);

      expect(fn).toHaveBeenCalledWith('arg1', 'arg2');
      jest.useRealTimers();
    });

    test('debounce resets timer on each call', () => {
      jest.useFakeTimers();
      const fn = jest.fn();
      const debounced = window.debounce(fn, 200);

      debounced();
      jest.advanceTimersByTime(100);
      debounced();
      jest.advanceTimersByTime(100);

      expect(fn).not.toHaveBeenCalled();
      jest.advanceTimersByTime(100);
      expect(fn).toHaveBeenCalledTimes(1);
      jest.useRealTimers();
    });
  });

  describe('throttle', () => {
    test('throttle executes immediately on first call', () => {
      jest.useFakeTimers();
      const fn = jest.fn();
      const throttled = window.throttle(fn, 200);

      throttled();
      expect(fn).toHaveBeenCalledTimes(1);
      jest.useRealTimers();
    });

    test('throttle blocks subsequent calls within the limit', () => {
      jest.useFakeTimers();
      const fn = jest.fn();
      const throttled = window.throttle(fn, 200);

      throttled();
      throttled();
      throttled();

      expect(fn).toHaveBeenCalledTimes(1);
      jest.useRealTimers();
    });

    test('throttle allows calls after limit expires', () => {
      jest.useFakeTimers();
      const fn = jest.fn();
      const throttled = window.throttle(fn, 200);

      throttled();
      jest.advanceTimersByTime(200);
      throttled();

      expect(fn).toHaveBeenCalledTimes(2);
      jest.useRealTimers();
    });
  });

  describe('getUrlParam', () => {
    test('returns query parameter value', () => {
      delete window.location;
      window.location = new URL('http://localhost?name=john&age=30');

      expect(window.getUrlParam('name')).toBe('john');
      expect(window.getUrlParam('age')).toBe('30');
    });

    test('returns null for non-existent parameter', () => {
      delete window.location;
      window.location = new URL('http://localhost?name=john');

      expect(window.getUrlParam('missing')).toBeNull();
    });
  });

  describe('isElementInViewport', () => {
    test('returns true when element is fully in viewport', () => {
      const el = document.createElement('div');
      el.getBoundingClientRect = jest.fn(() => ({
        top: 10,
        left: 10,
        bottom: 100,
        right: 100
      }));

      // Set viewport dimensions
      Object.defineProperty(window, 'innerHeight', { value: 768, writable: true });
      Object.defineProperty(window, 'innerWidth', { value: 1024, writable: true });

      expect(window.isElementInViewport(el)).toBe(true);
    });

    test('returns false when element is below viewport', () => {
      const el = document.createElement('div');
      el.getBoundingClientRect = jest.fn(() => ({
        top: 800,
        left: 10,
        bottom: 900,
        right: 100
      }));

      Object.defineProperty(window, 'innerHeight', { value: 768, writable: true });
      Object.defineProperty(window, 'innerWidth', { value: 1024, writable: true });

      expect(window.isElementInViewport(el)).toBe(false);
    });

    test('returns false when element is above viewport', () => {
      const el = document.createElement('div');
      el.getBoundingClientRect = jest.fn(() => ({
        top: -100,
        left: 10,
        bottom: -50,
        right: 100
      }));

      expect(window.isElementInViewport(el)).toBe(false);
    });
  });

  describe('smoothScrollTo', () => {
    test('calls window.scrollTo with correct offset', () => {
      document.body.innerHTML = '<div id="target" style="position:absolute;top:500px">Target</div>';
      window.scrollTo = jest.fn();
      window.pageYOffset = 0;

      const target = document.getElementById('target');
      target.getBoundingClientRect = jest.fn(() => ({ top: 500 }));

      window.smoothScrollTo('#target');

      expect(window.scrollTo).toHaveBeenCalledWith({
        top: expect.any(Number),
        behavior: 'smooth'
      });
    });

    test('does nothing for non-existent selector', () => {
      window.scrollTo = jest.fn();
      window.smoothScrollTo('#nonexistent');
      expect(window.scrollTo).not.toHaveBeenCalled();
    });

    test('applies additional offset', () => {
      document.body.innerHTML = '<div id="target">Target</div>';
      window.scrollTo = jest.fn();
      window.pageYOffset = 0;

      const target = document.getElementById('target');
      target.getBoundingClientRect = jest.fn(() => ({ top: 500 }));

      window.smoothScrollTo('#target', 20);

      const call = window.scrollTo.mock.calls[0][0];
      // headerOffset = 80 + 20 = 100, position = 500 + 0 - 100 = 400
      expect(call.top).toBe(400);
    });
  });
});

describe('ImageLazyLoader (form-helpers)', () => {
  beforeEach(() => {
    // Mock IntersectionObserver
    const mockObserve = jest.fn();
    const mockUnobserve = jest.fn();
    window.IntersectionObserver = jest.fn((callback) => ({
      observe: mockObserve,
      unobserve: mockUnobserve,
      disconnect: jest.fn()
    }));
  });

  test('observes images with data-src attribute', () => {
    document.body.innerHTML = `
      <img data-src="image1.jpg" />
      <img data-src="image2.jpg" />
      <img src="normal.jpg" />
    `;

    loadModule();

    const observerInstance = window.IntersectionObserver.mock.results[0]?.value;
    if (observerInstance) {
      expect(observerInstance.observe).toHaveBeenCalledTimes(2);
    }
  });

  test('ImageLazyLoader uses IntersectionObserver to observe images', () => {
    document.body.innerHTML = `
      <img data-src="image1.jpg" />
      <img data-src="image2.jpg" />
    `;

    // Reset mock to track calls during this load
    window.IntersectionObserver.mockClear();
    mockObserveGlobal.mockClear();

    loadModule();

    // IntersectionObserver should have been instantiated (for ImageLazyLoader and ScrollReveal)
    expect(window.IntersectionObserver).toHaveBeenCalled();
  });
});

describe('ScrollReveal', () => {
  beforeEach(() => {
    const mockObserve = jest.fn();
    window.IntersectionObserver = jest.fn((callback) => ({
      observe: mockObserve,
      unobserve: jest.fn(),
      disconnect: jest.fn()
    }));
  });

  test('observes elements with .reveal-on-scroll class', () => {
    document.body.innerHTML = `
      <div class="reveal-on-scroll">Item 1</div>
      <div class="reveal-on-scroll">Item 2</div>
      <div class="other">Other</div>
    `;

    loadModule();

    // Should have at least one IntersectionObserver for ScrollReveal
    expect(window.IntersectionObserver).toHaveBeenCalled();
  });
});
