// lib/syntax-highlighter.ts
import { CodeLanguage } from "@/types/code-editor.types";

// Simple syntax highlighting for JSON
export const highlightJSON = (code: string): string => {
  if (!code) return "";

  try {
    // Try to parse and format JSON
    const parsed = JSON.parse(code);
    const formatted = JSON.stringify(parsed, null, 2);
    return highlightCode(formatted, "json");
  } catch {
    return highlightCode(code, "json");
  }
};

// Main highlight function
export const highlightCode = (code: string, language: CodeLanguage): string => {
  if (!code) return "";

  let highlighted = escapeHtml(code);

  switch (language) {
    case "json":
      highlighted = highlightJSONSyntax(highlighted);
      break;
    case "javascript":
    case "typescript":
      highlighted = highlightJavaScript(highlighted);
      break;
    case "html":
      highlighted = highlightHTML(highlighted);
      break;
    case "css":
      highlighted = highlightCSS(highlighted);
      break;
    case "sql":
      highlighted = highlightSQL(highlighted);
      break;
    case "yaml":
      highlighted = highlightYAML(highlighted);
      break;
    default:
      break;
  }

  return highlighted;
};

const escapeHtml = (str: string): string => {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
};

const highlightJSONSyntax = (code: string): string => {
  // Highlight keys
  code = code.replace(/"([^"\\]*(\\.[^"\\]*)*)"(\s*:)/g, (match, p1) => {
    return `<span style="color: #e06c75;">"${p1}"</span><span style="color: #abb2bf;">:</span>`;
  });

  // Highlight string values
  code = code.replace(/: "([^"\\]*(\\.[^"\\]*)*)"/g, (match, p1) => {
    return `: <span style="color: #98c379;">"${p1}"</span>`;
  });

  // Highlight numbers
  code = code.replace(/: (\d+)/g, (match, p1) => {
    return `: <span style="color: #d19a66;">${p1}</span>`;
  });

  // Highlight booleans and null
  code = code.replace(/\b(true|false|null)\b/g, (match) => {
    return `<span style="color: #c678dd;">${match}</span>`;
  });

  // Highlight brackets
  code = code.replace(/[{}[\]]/g, (match) => {
    return `<span style="color: #abb2bf;">${match}</span>`;
  });

  return code;
};

const highlightJavaScript = (code: string): string => {
  // Keywords
  const keywords = [
    "const",
    "let",
    "var",
    "function",
    "return",
    "if",
    "else",
    "for",
    "while",
    "switch",
    "case",
    "break",
    "continue",
    "try",
    "catch",
    "finally",
    "throw",
    "new",
    "this",
    "typeof",
    "instanceof",
    "class",
    "extends",
    "super",
    "import",
    "export",
    "default",
    "from",
    "async",
    "await",
  ];

  keywords.forEach((keyword) => {
    const regex = new RegExp(`\\b(${keyword})\\b`, "g");
    code = code.replace(
      regex,
      `<span style="color: #c678dd;">${keyword}</span>`
    );
  });

  // Strings
  code = code.replace(/(".*?"|'.*?'|`.*?`)/g, (match) => {
    return `<span style="color: #98c379;">${match}</span>`;
  });

  // Numbers
  code = code.replace(/\b(\d+)\b/g, (match) => {
    return `<span style="color: #d19a66;">${match}</span>`;
  });

  // Comments
  code = code.replace(/(\/\/.*?$|\/\*[\s\S]*?\*\/)/gm, (match) => {
    return `<span style="color: #7f848e;">${match}</span>`;
  });

  // Functions
  code = code.replace(/\b([a-zA-Z_$][a-zA-Z0-9_$]*)(?=\()/g, (match) => {
    return `<span style="color: #61afef;">${match}</span>`;
  });

  return code;
};

const highlightHTML = (code: string): string => {
  // Tags
  code = code.replace(/&lt;\/?([a-zA-Z]+)[^&gt;]*&gt;/g, (match, tag) => {
    return `<span style="color: #e06c75;">&lt;${tag}</span><span style="color: #abb2bf;">${match.slice(
      tag.length + 2,
      -4
    )}</span><span style="color: #e06c75;">&gt;</span>`;
  });

  // Attributes
  code = code.replace(/\b([a-zA-Z-]+)(?:=)/g, (match, attr) => {
    return `<span style="color: #d19a66;">${attr}</span>=`;
  });

  return code;
};

const highlightCSS = (code: string): string => {
  // Selectors
  code = code.replace(/([.#]?[a-zA-Z-]+)\s*{/g, (match, selector) => {
    return `<span style="color: #61afef;">${selector}</span> {`;
  });

  // Properties
  code = code.replace(/\b([a-zA-Z-]+):/g, (match, prop) => {
    return `<span style="color: #e06c75;">${prop}</span>:`;
  });

  // Values
  code = code.replace(/:\s*([^;]+);/g, (match, value) => {
    return `: <span style="color: #98c379;">${value}</span>;`;
  });

  return code;
};

const highlightSQL = (code: string): string => {
  const keywords = [
    "SELECT",
    "FROM",
    "WHERE",
    "INSERT",
    "UPDATE",
    "DELETE",
    "CREATE",
    "ALTER",
    "DROP",
    "TABLE",
    "INDEX",
    "VIEW",
    "JOIN",
    "INNER",
    "LEFT",
    "RIGHT",
    "OUTER",
    "ON",
    "AND",
    "OR",
    "NOT",
    "IN",
    "LIKE",
    "BETWEEN",
    "IS",
    "NULL",
    "ORDER",
    "BY",
    "GROUP",
    "HAVING",
    "LIMIT",
    "OFFSET",
  ];

  keywords.forEach((keyword) => {
    const regex = new RegExp(`\\b(${keyword})\\b`, "gi");
    code = code.replace(
      regex,
      `<span style="color: #c678dd;">${keyword}</span>`
    );
  });

  // Strings
  code = code.replace(/('.*?')/g, (match) => {
    return `<span style="color: #98c379;">${match}</span>`;
  });

  // Numbers
  code = code.replace(/\b(\d+)\b/g, (match) => {
    return `<span style="color: #d19a66;">${match}</span>`;
  });

  return code;
};

const highlightYAML = (code: string): string => {
  // Keys
  code = code.replace(/^([a-zA-Z_][a-zA-Z0-9_-]*):/gm, (match, key) => {
    return `<span style="color: #e06c75;">${key}</span>:`;
  });

  // Strings
  code = code.replace(/:\s*(.+)$/gm, (match, value) => {
    if (value.startsWith('"') || value.startsWith("'")) {
      return `: <span style="color: #98c379;">${value}</span>`;
    }
    return match;
  });

  // Numbers
  code = code.replace(/:\s*(\d+)$/gm, (match, num) => {
    return `: <span style="color: #d19a66;">${num}</span>`;
  });

  // Booleans
  code = code.replace(/\b(true|false)\b/g, (match) => {
    return `<span style="color: #c678dd;">${match}</span>`;
  });

  return code;
};

// Validate JSON
export const validateJSON = (
  code: string
): { valid: boolean; error?: string } => {
  if (!code.trim()) {
    return { valid: true };
  }

  try {
    JSON.parse(code);
    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : "Invalid JSON",
    };
  }
};

// Format JSON
export const formatJSON = (code: string): string => {
  try {
    const parsed = JSON.parse(code);
    return JSON.stringify(parsed, null, 2);
  } catch {
    return code;
  }
};

// Format JavaScript
export const formatJavaScript = (code: string): string => {
  // Simple formatting - add semicolons and proper indentation
  const formatted = code
    .replace(/\{/g, "{\n  ")
    .replace(/\}/g, "\n}")
    .replace(/;/g, ";\n")
    .replace(/\n\s*\n/g, "\n");

  return formatted;
};

// Language options
export const LANGUAGE_OPTIONS: Array<{ value: CodeLanguage; label: string }> = [
  { value: "json", label: "JSON" },
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "html", label: "HTML" },
  { value: "css", label: "CSS" },
  { value: "sql", label: "SQL" },
  { value: "yaml", label: "YAML" },
  { value: "markdown", label: "Markdown" },
  { value: "xml", label: "XML" },
  { value: "shell", label: "Shell Script" },
];
