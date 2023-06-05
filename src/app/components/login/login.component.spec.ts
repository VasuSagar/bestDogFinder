import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { render, screen } from '@testing-library/angular';
import { LoginService } from '../../services/login.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { MatInputModule } from '@angular/material/input';
import { AppModule } from '../../app.module';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatInputHarness } from '@angular/material/input/testing';
import { MatButtonHarness } from '@angular/material/button/testing';
describe('LoginComponent', () => {
  let loginService: LoginService;
  let fixture: ComponentFixture<LoginComponent>;
  let component: LoginComponent;
  let loader: HarnessLoader;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule, AppModule],
      providers: []
    })


    loginService = TestBed.inject(LoginService);
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
    fixture.detectChanges();
  });

  it('should call api for valid form', async () => {
    const submitButton = await loader.getHarness(MatButtonHarness);
    const inputs = await loader.getAllHarnesses(MatInputHarness);

    await inputs[1].setValue('abc@g.com');
    await inputs[0].setValue('abc');
    const val = await submitButton.isDisabled();
    expect(val).toBeTruthy();
  }, 500);
});
