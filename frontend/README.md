# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# Saidata Form Builder Frontend

This is the frontend for the Saidara application, built using React and Vite. It features a drag-and-drop form builder and a form-taking interface for users.

---

## Getting Started

To run this project locally, follow these steps:

1.  **Install Dependencies:**
    ```bash
    npm install
    ```

2.  **Run the Development Server:**
    ```bash
    npm run dev
    ```

3.  **Build for Production:**
    ```bash
    npm run build
    ```

---

## API Documentation for Backend Developers

This section outlines the data structure for form submissions sent from the frontend. The backend should create an API endpoint capable of receiving and processing this JSON format.

### API Endpoint Suggestion

-   **URL:** `/api/forms/{formId}/submissions`
-   **Method:** `POST`
-   **Content-Type:** `application/json`

### Payload Format

The body of the `POST` request will be a JSON **array of objects**. Each object represents a single field from the form and contains the question's metadata and the user's submitted value.

#### Example Payload

```json
[
  {
    "id": "field_1760625161095_99t9a4idg",
    "name": "field_1",
    "label": "New Text Input",
    "type": "text",
    "value": "Gibe"
  },
  {
    "id": "field_1760625161589_0dr930fs5",
    "name": "field_2",
    "label": "New Text Area",
    "type": "textarea",
    "value": "Dadang Sujana Adalah Seorang Ahli Silat Yang Berasal Dari Perguruan PSHT"
  }
]

### Field Object Specification

| Key     | Type   | Description                                                                                                                              |
| :------ | :----- | :--------------------------------------------------------------------------------------------------------------------------------------- |
| `id`    | `string` | **Primary Identifier.** A permanent, globally unique ID for the question itself. Use this to link a response to a specific field in the form's structure. |
| `name`  | `string` | The HTML `name` attribute of the field.                                                                                                |
| `label` | `string` | The human-readable question that was shown to the user (e.g., "Your Name").                                                              |
| `type`  | `string` | The type of form field (e.g., `text`, `number`, `checkbox`). This determines the data type of the `value`.                                |
| `value` | `any`  | The user's submitted answer for this field. The data type will vary based on the field `type`.                                           |