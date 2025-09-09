import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BehaviorSubject } from 'rxjs';

import { ThemeToggleComponent } from './theme-toggle.component';
import { ThemeService, Theme } from '../../services/theme.service';

describe('ThemeToggleComponent', () => {
  let component: ThemeToggleComponent;
  let fixture: ComponentFixture<ThemeToggleComponent>;
  let mockThemeService: jasmine.SpyObj<ThemeService>;
  let themeSubject: BehaviorSubject<Theme>;

  beforeEach(async () => {
    themeSubject = new BehaviorSubject<Theme>('light');
    const spy = jasmine.createSpyObj('ThemeService', ['toggleTheme']);
    spy.currentTheme$ = themeSubject.asObservable();

    await TestBed.configureTestingModule({
      imports: [ThemeToggleComponent],
      providers: [
        { provide: ThemeService, useValue: spy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ThemeToggleComponent);
    component = fixture.componentInstance;
    mockThemeService = TestBed.inject(ThemeService) as jasmine.SpyObj<ThemeService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display light theme button initially', () => {
    const button = fixture.debugElement.query(By.css('button'));
    const icon = fixture.debugElement.query(By.css('.theme-icon'));
    const text = fixture.debugElement.query(By.css('.theme-text'));
    
    expect(icon.nativeElement.textContent.trim()).toBe('🌙');
    expect(text.nativeElement.textContent.trim()).toBe('Dark');
    expect(button.nativeElement.getAttribute('aria-label')).toBe('Switch to dark theme');
  });

  it('should display dark theme button when theme is dark', () => {
    themeSubject.next('dark');
    fixture.detectChanges();
    
    const button = fixture.debugElement.query(By.css('button'));
    const icon = fixture.debugElement.query(By.css('.theme-icon'));
    const text = fixture.debugElement.query(By.css('.theme-text'));
    
    expect(icon.nativeElement.textContent.trim()).toBe('☀️');
    expect(text.nativeElement.textContent.trim()).toBe('Light');
    expect(button.nativeElement.getAttribute('aria-label')).toBe('Switch to light theme');
  });

  it('should call toggleTheme when button is clicked', () => {
    const button = fixture.debugElement.query(By.css('button'));
    button.triggerEventHandler('click', null);
    
    expect(mockThemeService.toggleTheme).toHaveBeenCalled();
  });

  it('should have proper accessibility attributes', () => {
    const button = fixture.debugElement.query(By.css('button'));
    expect(button.nativeElement.hasAttribute('aria-label')).toBe(true);
    expect(button.nativeElement.hasAttribute('title')).toBe(true);
    expect(button.nativeElement.getAttribute('title')).toBe('Toggle theme');
  });

  it('should update visual elements when theme changes', () => {
    const icon = fixture.debugElement.query(By.css('.theme-icon'));
    const text = fixture.debugElement.query(By.css('.theme-text'));
    
    // Initially light theme
    expect(icon.nativeElement.textContent.trim()).toBe('🌙');
    expect(text.nativeElement.textContent.trim()).toBe('Dark');
    
    // Change to dark theme
    themeSubject.next('dark');
    fixture.detectChanges();
    expect(icon.nativeElement.textContent.trim()).toBe('☀️');
    expect(text.nativeElement.textContent.trim()).toBe('Light');
    
    // Change back to light theme
    themeSubject.next('light');
    fixture.detectChanges();
    expect(icon.nativeElement.textContent.trim()).toBe('🌙');
    expect(text.nativeElement.textContent.trim()).toBe('Dark');
  });

  it('should provide visual feedback on hover', () => {
    const button = fixture.debugElement.query(By.css('button'));
    expect(button.nativeElement.classList.contains('theme-toggle-btn')).toBe(true);
  });
});