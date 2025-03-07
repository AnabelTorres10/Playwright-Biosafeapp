import { Page, Locator, expect } from "@playwright/test"

export default class paginaSignup {
    readonly page: Page;
    readonly nombreInput: Locator;
    readonly emailInput: Locator;
    readonly contrasenaInput: Locator;
    readonly confirmarContrasenaInput: Locator;
    readonly botonDeRegistrarse: Locator;
    readonly registroexitosoAlert: Locator;

    constructor(page: Page) {
        this.page = page;
        this.nombreInput = page.getByTestId('nameInput');
        this.emailInput = page.getByTestId('emailInput');
        this.contrasenaInput = page.getByTestId('passwordInput');
        this.confirmarContrasenaInput = page.getByTestId('confirmPasswordInput');
        this.botonDeRegistrarse = page.getByTestId('botonRegistro');
        this.registroexitosoAlert = page.getByText('¡Registro exitoso!');
    }

    async completarRegistroExitoso(user: any) {
        
        const mailDeUsuarioUnico = user.email.replace('@', "+" + Date.now() + "@");
        console.log(mailDeUsuarioUnico);
        await this.nombreInput.fill(user.nombre);
        await this.emailInput.fill(mailDeUsuarioUnico);
        await this.contrasenaInput.fill(user.contrasena);
        await this.confirmarContrasenaInput.fill(user.contrasena);
        await this.botonDeRegistrarse.click();
        await expect(this.registroexitosoAlert).toBeVisible();
        return mailDeUsuarioUnico;
    }



}