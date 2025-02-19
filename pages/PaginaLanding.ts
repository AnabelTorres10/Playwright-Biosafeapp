import{Page, Locator, expect} from "@playwright/test" 

export default class PaginaLanding{
    readonly page:Page;
    readonly botonDeRegistrarse: Locator;

    constructor(page:Page){
        this.page = page;
        this.botonDeRegistrarse = page.getByRole('link', { name: 'Registrarse' }).first()
    }

    async irARegistroDeCuenta(){
        this.botonDeRegistrarse.click({ force: true});
        expect (this.page).toHaveURL('https://qa.biosafeapp.com/signup');
    }
}