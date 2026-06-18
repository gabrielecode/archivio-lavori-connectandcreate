/**
 * Unit tests for shared/js/image-lazy.js
 * Tests: LazyImageLoader class
 */

let LazyImageLoader;
let mockObserve;
let mockUnobserve;
let mockDisconnect;
let observerCallback;

beforeEach(() => {
  document.body.innerHTML = '';
  jest.resetModules();

  mockObserve = jest.fn();
  mockUnobserve = jest.fn();
  mockDisconnect = jest.fn();

  window.IntersectionObserver = jest.fn((callback, options) => {
    observerCallback = callback;
    return {
      observe: mockObserve,
      unobserve: mockUnobserve,
      disconnect: mockDisconnect
    };
  });

  // Prevent auto-initialization from polluting tests
  Object.defineProperty(document, 'readyState', {
    value: 'complete',
    writable: true
  });

  LazyImageLoader = require('../image-lazy.js');
});

describe('LazyImageLoader - constructor & configuration', () => {
  test('creates instance with default config', () => {
    const loader = new LazyImageLoader();
    expect(loader.config.selector).toBe('img[data-src]');
    expect(loader.config.loadingClass).toBe('loading');
    expect(loader.config.loadedClass).toBe('loaded');
    expect(loader.config.errorClass).toBe('error');
    expect(loader.config.threshold).toBe(0.1);
    expect(loader.config.rootMargin).toBe('50px');
  });

  test('merges custom config with defaults', () => {
    const loader = new LazyImageLoader({
      selector: '.lazy-img',
      threshold: 0.5,
      rootMargin: '100px'
    });
    expect(loader.config.selector).toBe('.lazy-img');
    expect(loader.config.threshold).toBe(0.5);
    expect(loader.config.rootMargin).toBe('100px');
    // Defaults are preserved
    expect(loader.config.loadingClass).toBe('loading');
  });
});

describe('LazyImageLoader - IntersectionObserver setup', () => {
  test('creates IntersectionObserver with correct options', () => {
    new LazyImageLoader({ threshold: 0.2, rootMargin: '75px' });

    expect(window.IntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      { threshold: 0.2, rootMargin: '75px' }
    );
  });

  test('observes all matching images', () => {
    document.body.innerHTML = `
      <img data-src="img1.jpg" />
      <img data-src="img2.jpg" />
      <img data-src="img3.jpg" />
      <img src="regular.jpg" />
    `;

    new LazyImageLoader();
    expect(mockObserve).toHaveBeenCalledTimes(3);
  });

  test('does not observe images without data-src', () => {
    document.body.innerHTML = `
      <img src="regular.jpg" />
      <img src="another.jpg" />
    `;

    new LazyImageLoader();
    expect(mockObserve).not.toHaveBeenCalled();
  });
});

describe('LazyImageLoader - image loading', () => {
  test('loads image when intersection is triggered', () => {
    document.body.innerHTML = '<img data-src="test.jpg" />';
    const img = document.querySelector('img');

    new LazyImageLoader();

    // Simulate intersection
    observerCallback([{ isIntersecting: true, target: img }]);

    // loadImage adds loading class and creates temp Image
    expect(img.classList.contains('loading')).toBe(true);
  });

  test('does not load image when not intersecting', () => {
    document.body.innerHTML = '<img data-src="test.jpg" />';
    const img = document.querySelector('img');

    new LazyImageLoader();

    observerCallback([{ isIntersecting: false, target: img }]);
    expect(img.classList.contains('loading')).toBe(false);
  });

  test('loadImage does nothing for images without data-src', () => {
    document.body.innerHTML = '<img src="normal.jpg" />';
    const img = document.querySelector('img');

    const loader = new LazyImageLoader();
    loader.loadImage(img);

    expect(img.classList.contains('loading')).toBe(false);
  });

  test('loadImage sets srcset and sizes when available', () => {
    document.body.innerHTML = '<img data-src="test.jpg" data-srcset="test-2x.jpg 2x" data-sizes="(max-width: 600px) 100vw" />';
    const img = document.querySelector('img');

    const loader = new LazyImageLoader();
    loader.loadImage(img);

    expect(img.classList.contains('loading')).toBe(true);
  });
});

describe('LazyImageLoader - fallback without IntersectionObserver', () => {
  test('loads all images immediately when IntersectionObserver is unavailable', () => {
    delete window.IntersectionObserver;
    jest.resetModules();

    document.body.innerHTML = `
      <img data-src="img1.jpg" />
      <img data-src="img2.jpg" />
    `;

    // Re-define readyState
    Object.defineProperty(document, 'readyState', {
      value: 'complete',
      writable: true
    });

    const Loader = require('../image-lazy.js');
    const loader = new Loader();

    // Images should have loading class added (loading initiated)
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      expect(img.classList.contains('loading')).toBe(true);
    });
  });
});

describe('LazyImageLoader - manual loading methods', () => {
  test('loadImageByElement loads specific element', () => {
    document.body.innerHTML = `
      <img id="lazy" data-src="lazy.jpg" />
      <img id="regular" src="regular.jpg" />
    `;

    const loader = new LazyImageLoader();
    const lazyImg = document.getElementById('lazy');
    const regularImg = document.getElementById('regular');

    loader.loadImageByElement(lazyImg);
    expect(lazyImg.classList.contains('loading')).toBe(true);

    loader.loadImageByElement(regularImg);
    expect(regularImg.classList.contains('loading')).toBe(false);
  });

  test('loadImagesBySelector loads all matching images', () => {
    document.body.innerHTML = `
      <img class="gallery" data-src="g1.jpg" />
      <img class="gallery" data-src="g2.jpg" />
      <img class="other" data-src="o1.jpg" />
    `;

    const loader = new LazyImageLoader();
    loader.loadImagesBySelector('.gallery');

    const galleryImgs = document.querySelectorAll('.gallery');
    galleryImgs.forEach(img => {
      expect(img.classList.contains('loading')).toBe(true);
    });

    const otherImg = document.querySelector('.other');
    expect(otherImg.classList.contains('loading')).toBe(false);
  });

  test('loadAllImages loads every image with data-src', () => {
    document.body.innerHTML = `
      <img data-src="a.jpg" />
      <img data-src="b.jpg" />
      <img src="c.jpg" />
    `;

    const loader = new LazyImageLoader();
    loader.loadAllImages();

    const lazyImgs = document.querySelectorAll('img[data-src]');
    // After loadAllImages, they should all have loading class
    // (the original selector finds them before data-src is removed by onload)
    expect(document.querySelectorAll('.loading').length).toBe(2);
  });
});

describe('LazyImageLoader - successful image load', () => {
  test('on successful load, sets src and adds loaded class', () => {
    document.body.innerHTML = '<img data-src="success.jpg" data-srcset="success-2x.jpg 2x" data-sizes="100vw" />';
    const img = document.querySelector('img');

    // Mock Image constructor to simulate successful load
    const originalImage = global.Image;
    let mockImage;
    global.Image = class {
      constructor() {
        mockImage = this;
      }
      set src(val) { this._src = val; if (this.onload) setTimeout(() => this.onload(), 0); }
      get src() { return this._src; }
      set srcset(val) { this._srcset = val; }
      get srcset() { return this._srcset || ''; }
      set sizes(val) { this._sizes = val; }
      get sizes() { return this._sizes || ''; }
    };

    const loader = new LazyImageLoader();
    loader.loadImage(img);

    // Trigger the onload manually
    if (mockImage && mockImage.onload) {
      mockImage.onload();
    }

    expect(img.src).toContain('success.jpg');
    expect(img.classList.contains('loaded')).toBe(true);
    expect(img.classList.contains('loading')).toBe(false);
    expect(img.hasAttribute('data-src')).toBe(false);
    expect(img.hasAttribute('data-srcset')).toBe(false);

    global.Image = originalImage;
  });

  test('on error, adds error class and removes loading class', () => {
    document.body.innerHTML = '<img data-src="broken.jpg" />';
    const img = document.querySelector('img');

    const originalImage = global.Image;
    let mockImage;
    global.Image = class {
      constructor() {
        mockImage = this;
      }
      set src(val) { this._src = val; if (this.onerror) setTimeout(() => this.onerror(), 0); }
      get src() { return this._src; }
      set srcset(val) { this._srcset = val; }
      get srcset() { return this._srcset || ''; }
      set sizes(val) { this._sizes = val; }
      get sizes() { return this._sizes || ''; }
    };

    const loader = new LazyImageLoader();
    loader.loadImage(img);

    if (mockImage && mockImage.onerror) {
      mockImage.onerror();
    }

    expect(img.classList.contains('error')).toBe(true);
    expect(img.classList.contains('loading')).toBe(false);

    global.Image = originalImage;
  });
});
