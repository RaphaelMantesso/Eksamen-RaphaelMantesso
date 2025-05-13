// Mock do localStorage
class LocalStorageMock {
  constructor() {
    this.store = {};
  }

  clear() {
    this.store = {};
  }

  getItem(key) {
    return this.store[key] || null;
  }

  setItem(key, value) {
    this.store[key] = String(value);
  }

  removeItem(key) {
    delete this.store[key];
  }
}

// Mock do fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
  })
);

// Mock do localStorage
Object.defineProperty(window, 'localStorage', {
  value: new LocalStorageMock(),
});

// Mock do alert
global.alert = jest.fn();

// Mock do location
delete window.location;
window.location = { href: '', pathname: '' };
