# CnvTrainingPlatform

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.1.1.

## ⚠️ Configuração Inicial Obrigatória

**ANTES DE EXECUTAR O PROJETO**, você deve configurar as chaves de API no Firestore:

### Opção 1: Script Automático (Recomendado)
1. **Edite o arquivo `setup-config.js`** com suas chaves reais
2. **Execute o script:**
   ```bash
   npm install firebase
   node setup-config.js
   ```
3. **Delete o arquivo `setup-config.js`** após a configuração

### Opção 2: Interface Administrativa
1. **Configure temporariamente** uma chave Firebase no `app.config.ts`
2. **Acesse** `/config-admin` como administrador
3. **Configure** todas as chaves através da interface

### Chaves Necessárias:
- **Firebase:** projectId, apiKey, authDomain, etc.
- **Google Gemini:** geminiApiKey

📖 **Todas as configurações são salvas no Firestore em `config/app-settings`**

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
