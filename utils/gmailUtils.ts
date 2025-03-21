import { google, Auth} from 'googleapis';
import path from 'path';
import fs from 'fs';

const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];

const CREDENTIALS_PATH = path.join(__dirname, '../data/credentials.json');
const TOKEN_PATH = path.join(__dirname, '../data/token.json');

export async function authenticate(): Promise<Auth.OAuth2Client> {
    if (!fs.existsSync(CREDENTIALS_PATH)){
        throw new Error("No se encontro credentials.json en ./data. Descarga Las credentials de Google Cloud.");
    }

    const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf-8')).web;
    const {client_id, client_secret} = credentials;
    const redirect_uris = ['http://localhost'];

    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

    if (!fs.existsSync(TOKEN_PATH)) {
        throw new Error("No se encontro token.json en ./data. Genera el token antes de continuar.");
    }

    console.log("Cargando token desde token.json...");
    const token = JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf-8'));
    oAuth2Client.setCredentials(token);
    console.log("Token cargado correctamente.");

    return oAuth2Client;
}

export async function getVerificationCode(): Promise<string | null>{
  try {
    // Autenticamos al usuario utilizando el token generado
    const auth = await authenticate();
    const gmail = google.gmail({version: 'v1', auth});

    console.log("Buscando el codigo de verificacion en los correos...");

    const response = await gmail.users.messages.list({
        userId: 'me',
        q: 'from:soporte@biosafeapp.com subject: "Código de Verificación de BioSafeApp"',
        maxResults: 1,
    });

    if (!response.data.messages || response.data.messages.length === 0){
        console.error("No se encontro ningun correo con el codigo de verificacion.");
        return null;
    }

    const messageId = response.data.messages[0].id!;
    const message = await gmail.users.messages.get({userId: 'me', id: messageId});

    const body = message.data.snippet || '';
    console.log("Cuerpo del correo:", body);

    //buscamos un numero de 6 digitos en el cuerpo del correo
    const codeMatch = body.match(/\d{6}\b/);
    if (!codeMatch){
        console.error("No se encontro un codigo de verificaion de 6 digitos en el correo.");
        return null;
    } else {
        return codeMatch[0];
    }
} catch (error){
    console.error("Error obteniendo el codigo de verificacion:", error);
    return null;
}
}