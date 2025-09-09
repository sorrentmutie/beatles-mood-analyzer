import { TestBed } from '@angular/core/testing';
import { ThemeService, Theme } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;
  let mockLocalStorage: { [key: string]: string };

  beforeEach(() => {
    mockLocalStorage = {};

    spyOn(Storage.prototype, 'getItem').and.callFake((key: string) => mockLocalStorage[key] || null);
    spyOn(Storage.prototype, 'setItem').and.callFake((key: string, value: string) => {
      mockLocalStorage[key] = value;
    });

    spyOn(document.documentElement, 'setAttribute');
    spyOnProperty(document, 'body', 'get').and.returnValue({ className: '' } as any);

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jasmine.createSpy('matchMedia').and.returnValue({
        matches: false,
        media: '',
        addListener: jasmine.createSpy(),
        removeListener: jasmine.createSpy(),
      }),
    });

    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with light theme by default', () => {
    expect(service.currentTheme).toBe('light');
  });

  it('should read saved theme from localStorage', () => {
    mockLocalStorage['beatles-mood-analyzer-theme'] = 'dark';
    service = new ThemeService();
    expect(service.currentTheme).toBe('dark');
  });

  it('should respect system dark theme preference when no saved theme', () => {
    (window.matchMedia as jasmine.Spy).and.returnValue({ matches: true });
    service = new ThemeService();
    expect(service.currentTheme).toBe('dark');
  });

  it('should toggle theme from light to dark', () => {
    service.toggleTheme();
    expect(service.currentTheme).toBe('dark');
  });

  it('should toggle theme from dark to light', () => {
    service.setTheme('dark');
    service.toggleTheme();
    expect(service.currentTheme).toBe('light');
  });

  it('should save theme to localStorage when set', () => {
    service.setTheme('dark');
    expect(localStorage.setItem).toHaveBeenCalledWith('beatles-mood-analyzer-theme', 'dark');
  });

  it('should apply theme to document', () => {
    service.setTheme('dark');
    expect(document.documentElement.setAttribute).toHaveBeenCalledWith('data-theme', 'dark');
    expect(document.body.className).toBe('dark-theme');
  });

  it('should emit theme changes', () => {
    let emittedTheme: Theme | undefined;
    service.currentTheme$.subscribe(theme => emittedTheme = theme);
    
    service.setTheme('dark');
    expect(emittedTheme).toBe('dark');
  });
});