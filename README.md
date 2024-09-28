This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


# FrontEnd

# Documentación del Proyecto

## Descripción General

Este proyecto es una aplicación web desarrollada en Next.js, que incluye un sistema de autenticación y gestión de usuarios. A continuación, se describe la estructura del código, el middleware utilizado, la gestión de autenticación y otros aspectos importantes del funcionamiento del proyecto.

## Estructura del Proyecto

El proyecto sigue una estructura modular y organizada. Las principales secciones incluyen:

- Middleware: Encargado de la protección de rutas.
- Contexto de Autenticación: Proporciona una manera centralizada de gestionar el estado de autenticación del usuario.
- Componentes de la Interfaz: Incluyen formularios de inicio de sesión, un layout general de la aplicación y un sidebar para la navegación.

## Rutas Correspondientes

### Middleware:

Archivo: frontMiddleware.js
Ruta: /src/middlewares

### Contexto de Autenticación:

Archivo: authContext.js
Ruta: /hooks/authContext

### Layout:

Archivo: Layout.js
Ruta: components/Layout

### Login:

Archivo: Login.js
Ruta: components/Login

## Middleware

El middleware se encarga de proteger rutas específicas de la aplicación. A continuación, se detallan sus funcionalidades:

- Protección de Rutas: Comprueba si un token de autenticación está presente en las cookies. Si el token no existe y el usuario intenta acceder a rutas protegidas (como "/home", "/pacientes", "/cirugias" y "/usuarios"), se le redirige a la página de inicio de sesión.

- Configuración: Las rutas protegidas son configuradas mediante un matcher que especifica cuáles URLs deben ser interceptadas por el middleware.

## Contexto de Autenticación

El contexto de autenticación es un componente fundamental que gestiona el estado del usuario en la aplicación. Sus principales funciones son:

- Estado del Usuario: Almacena el estado actual del usuario, incluyendo su información y un indicador de carga.
- Gestión del Token: Verifica la presencia y validez del token de autenticación almacenado en las cookies del navegador.
- Carga de Datos del Usuario: Al decodificar el token, se extrae el ID del usuario para obtener su información desde el backend, asegurando que solo los usuarios autenticados y autorizados tengan acceso a sus datos.

## Manejo de Autenticación

El proceso de autenticación se lleva a cabo a través de un formulario de inicio de sesión que permite a los usuarios ingresar sus credenciales. Los pasos principales son:

- Ingreso de Credenciales: El usuario introduce su número de teléfono y contraseña.
- Envío de Solicitud: Las credenciales se envían al servidor para su verificación.
- Recepción del Token: Si la autenticación es exitosa, se recibe un token que se almacena en las cookies del navegador.
- Decodificación del Token: Se utiliza una biblioteca para decodificar el token y extraer el - ID del usuario, que luego se utiliza para cargar la información del usuario desde la API.
- Manejo de Errores: Si hay algún problema durante el proceso (credenciales incorrectas, token no válido, etc.), se muestra un mensaje de error al usuario.

## Layout

El componente Layout es responsable de la estructura principal de la aplicación y juega un papel crucial en la gestión de la autenticación. Sus características principales son:

- Carga de Usuario: Verifica si los datos del usuario están siendo cargados. Mientras esto ocurre, se muestra un spinner de carga de Ant Design para indicar al usuario que la aplicación está procesando la información.
- Acceso Condicionado: Si el usuario no está autenticado, se muestra un mensaje indicando que debe iniciar sesión. Esto bloquea el acceso a las secciones protegidas de la aplicación.
- Renderizado de Contenido: Si el usuario está autenticado, el layout renderiza el sidebar de navegación y el contenido principal de la aplicación.

## Interfaz de Usuario

La interfaz de usuario está compuesta por varios componentes que permiten una navegación fluida y una experiencia de usuario amigable. Las características incluyen:

- Sidebar: Un menú de navegación que permite al usuario moverse entre diferentes secciones de la aplicación.
- Spinner de Carga: Un indicador visual que muestra que los datos se están cargando cuando el usuario accede a una ruta protegida.
