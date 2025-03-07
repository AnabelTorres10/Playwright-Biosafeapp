import { Page, Locator, expect } from "@playwright/test"
import { getVerificationCode } from '../utils/gmailUtils';
import PaginaVerificacionEmail from '../pages/PaginaVerificacionEmail';
import PaginaLogin from './PaginaLogin';
import data from '../data/usuarios.json'



export default class paginaSignup {
    readonly paginaVerificacionEmail: PaginaVerificacionEmail;
    readonly paginaLogin: PaginaLogin;
    readonly page: Page;
    readonly nombreInput: Locator;
    readonly emailInput: Locator;
    readonly contrasenaInput: Locator;
    readonly confirmarContrasenaInput: Locator;
    readonly botonDeRegistrarse: Locator;
    readonly registroexitosoAlert: Locator;

    constructor(page: Page) {
        this.page = page;
        this.paginaVerificacionEmail = new PaginaVerificacionEmail(page);
        this.paginaLogin = new PaginaLogin(page);
        this.nombreInput = page.getByTestId('nameInput');
        this.emailInput = page.getByTestId('emailInput');
        this.contrasenaInput = page.getByTestId('passwordInput');
        this.confirmarContrasenaInput = page.getByTestId('confirmPasswordInput');
        this.botonDeRegistrarse = page.getByTestId('botonRegistro');
        this.registroexitosoAlert = page.getByText('¡Registro exitoso!');
        
    }


    async userSignupAndLogin(user: any) {
        const mailDeUsuarioUnico = user.email.replace('@', "+" + Date.now() + "@");
        console.log(mailDeUsuarioUnico);
        await this.nombreInput.fill(user.nombre);
        await this.emailInput.fill(mailDeUsuarioUnico);
        await this.contrasenaInput.fill(user.contrasena);
        await this.confirmarContrasenaInput.fill(user.contrasena);
        await this.botonDeRegistrarse.click();
        await expect(this.registroexitosoAlert).toBeVisible();

        await expect(this.page).toHaveURL(process.env.BASE_URL! + '/verify-email')
        await this.page.waitForTimeout(2000)
        const verificationCode = await getVerificationCode()

        console.log("Código de verificación: ", verificationCode)
        if (verificationCode) {
        await this.paginaVerificacionEmail.codigoVerificacionInput.fill(verificationCode)
        await this.paginaVerificacionEmail.verificarButton.click()
        await expect(this.paginaVerificacionEmail.verificacionExitosaAlert).toBeVisible({ timeout: 10000 })
        await expect(this.page).toHaveURL(process.env.BASE_URL! + '/login')
        await this.paginaLogin.emailInput.fill(mailDeUsuarioUnico)
        await this.paginaLogin.passwordInput.fill(user.contrasena)
        await this.paginaLogin.loginButton.click();
        await expect(this.page).toHaveURL(process.env.BASE_URL! + '/dashboard')


    }

}
}