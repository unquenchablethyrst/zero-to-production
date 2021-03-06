import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { AuthFacade } from '@ztp/common/auth/data-access';
import { ReactiveFormsModule } from '@angular/forms';
import { DynamicFormFacade } from '@ztp/common/dynamic-form';
import { of } from 'rxjs';

// TODO  -> TESTS

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let debugEl: DebugElement;
  let nativeEl: HTMLElement;
  let authFacade: AuthFacade;
  let formFacade: DynamicFormFacade;
  const authFacadeSpy = { login: jest.fn() };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: AuthFacade,
          useValue: {},
        },
        {
          provide: DynamicFormFacade,
          useValue: {
            createFormIfNotExist: jest.fn(),
            formSubmits$: () => of(jest.fn()),
          },
        },
      ],
      declarations: [LoginComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    authFacade = TestBed.inject<AuthFacade>(AuthFacade);
    formFacade = TestBed.inject<DynamicFormFacade>(DynamicFormFacade);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    debugEl = fixture.debugElement;
    nativeEl = fixture.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
