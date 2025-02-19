import { test, expect } from '@playwright/test';
import PaginaLanding from '../pages/PaginaLanding';
import PaginaSignup from '../pages/paginaSignup';
import data from '../data/usuarios.json';

let paginaLanding: PaginaLanding;
let paginaSignup: PaginaSignup;

test('C-1 Registro Happy Path', async ({ page }) => {
  paginaLanding =new PaginaLanding(page);
  paginaSignup = new PaginaSignup(page);
  await page.goto('https://qa.biosafeapp.com');
  await paginaLanding.irARegistroDeCuenta();
  
  await paginaSignup.completarRegistroExitoso(data.usuarios.correcto);
  await page.waitForTimeout(5000);
});