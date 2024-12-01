import nodemailer from 'nodemailer';
// dotenv para utilizar variables de entorno y que no estén expuestas nuestras variables de conexión por ejemplo en Git
import dotenv from "dotenv";
dotenv.config({path: '.env'});

// Vamos a tener dos emails, uno para confirmar la cuenta y otro para cuando al usuario se le olvide su password.

// Función asíncrona porque puede tardar un rato
const emailRegistro = async (datos) => {
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      // Enviar el email. Enviamos el token del usuario si se confirma la cuenta. En el from pondríams la cuenta de la empresa, de momento pongo la mía porque no tengo de empresa.
      await transport.sendMail({
        from: 'inmoclick.valladolid@gmail.com',
        to: datos.email,
        subject: 'Confirma el alta de tu cuenta en InmoClick',
        text: 'Confirma el alta de tu cuenta en InmoClick',
        html: `
            <div style="background-color: blue; padding:1rem; width:100%; box-sizing:border-box; margin-left:auto; margin-right:auto">
              <h1 style="font-size:1.5rem; line-height:2rem; color:white; font-weight:800; text-align:left">Inmo<span style="font-weight:400">Click</span></h1>
            </div>
            <div style="background-color: #f7fbfb; padding:1rem; width:100%; box-sizing:border-box; margin-left:auto; margin-right:auto">
              <p style="margin-top:20px;">Hola ${datos.nombre},</p>

              <p>Tu cuenta ya está lista, solo tienes que confirmarla en el siguiente enlace:
              <a href="${process.env.BACKEND_URL}/auth/confirmar/${datos.token}" style="font-weight:bold">Confirmar cuenta</a>
              </p>

              <p>Si tu no creaste esta cuenta, puedes ignorar el mensaje</p>

              <p>Atentamente,<br>InmoClick.</p>
            </div>
        `
      });
}

const emailOlvidePassword = async (datos) => {
  const transport = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Enviar el email.
    await transport.sendMail({
      from: 'inmoclick.valladolid@gmail.com',
      to: datos.email,
      subject: 'Restablece tu Password en InmoClick',
      text: 'Restablece tu Password en InmoClick',
      html: `
          <div style="background-color: blue; padding:1rem; width:100%; box-sizing:border-box; margin-left:auto; margin-right:auto">
              <h1 style="font-size:1.5rem; line-height:2rem; color:white; font-weight:800; text-align:left">Inmo<span style="font-weight:400">Click</span></h1>
          </div>
            <div style="background-color: #f7fbfb; padding:1rem; width:100%; box-sizing:border-box; margin-left:auto; margin-right:auto">
            <p style="margin-top:20px;">Hola ${datos.nombre}, has solicitado reestablecer tu password en InmoClick</p>

            <p>Sigue el siguiente enlace para generar un password nuevo:
            <a href="${process.env.BACKEND_URL}/auth/olvide-password/${datos.token}" style="font-weight:bold">Restablecer Password</a>
            </p>

            <p>Si tu no solicitaste el cambio de password, puedes ignorar el mensaje.</p>

            <p>Atentamente,<br>InmoClick.</p>
          </div>
      `
    });
}

const emailContacto = async (datos) => {
  const transport = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Enviar el email.
    await transport.sendMail({
      from: 'inmoclick.valladolid@gmail.com',
      to: datos.email,
      subject: 'Has recibido un mensaje en InmoClick',
      text: 'Has recibido un mensaje en InmoClick',
      html: `
          <div style="background-color: blue; padding:1rem; width:100%; box-sizing:border-box; margin-left:auto; margin-right:auto">
              <h1 style="font-size:1.5rem; line-height:2rem; color:white; font-weight:800; text-align:left">Inmo<span style="font-weight:400">Click</span></h1>
          </div>
            <div style="background-color: #f7fbfb; padding:1rem; width:100%; box-sizing:border-box; margin-left:auto; margin-right:auto">
            <p style="margin-top:20px;">Hola ${datos.nombre},</p>

            <p>Acabas de recibir un mensaje en InmoClick para la propiedad <b>${datos.titulo}</b>.<br><br>Para poder ver el mensaje accede a la plataforma:
            <a href="${process.env.BACKEND_URL}/auth/login" style="font-weight:bold">Log in</a>.
            </p>

            <p>Atentamente,<br>InmoClick.</p>
          </div>
      `
    });
}

export {
    emailRegistro,
    emailOlvidePassword,
    emailContacto
}