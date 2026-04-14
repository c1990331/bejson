/**
 * BeJSON - Main JavaScript
 * JSON processing utilities for the browser
 */

// Global state
const state = {
    jsonInput: '',
    indent: 2
};

// Initialize on load
document.addEventListener('DOMContentLoaded', function() {
    console.log('BeJSON loaded');
    
    // Auto-save to localStorage
    const inputEl = document.getElementById('json-input');
    if (inputEl) {
        const saved = localStorage.getItem('bejson_input');
        if (saved) {
            inputEl.value = saved;
        }
        
        inputEl.addEventListener('input', function() {
            localStorage.setItem('bejson_input', this.value);
        });
    }
});

/**
 * Format JSON with syntax highlighting
 */
function formatJson() {
    const input = document.getElementById('json-input').value;
    const output = document.getElementById('json-output');
    const status = document.getElementById('status-message');
    
    if (!input.trim()) {
        showStatus('请输入 JSON 数据', 'error');
        return;
    }
    
    try {
        const parsed = JSON.parse(input);
        const formatted = JSON.stringify(parsed, null, state.indent);
        
        output.style.display = 'block';
        output.innerHTML = syntaxHighlight(formatted);
        output.className = 'output-area success';
        showStatus('JSON 格式化成功 ✓', 'success');
        
        // Copy to clipboard
        copyToClipboard(formatted);
    } catch (e) {
        output.style.display = 'block';
        output.textContent = e.message;
        output.className = 'output-area error';
        showStatus('JSON 格式错误: ' + e.message, 'error');
    }
}

/**
 * Compress JSON (remove whitespace)
 */
function compressJson() {
    const input = document.getElementById('json-input').value;
    const output = document.getElementById('json-output');
    const status = document.getElementById('status-message');
    
    if (!input.trim()) {
        showStatus('请输入 JSON 数据', 'error');
        return;
    }
    
    try {
        const parsed = JSON.parse(input);
        const compressed = JSON.stringify(parsed);
        
        output.style.display = 'block';
        output.textContent = compressed;
        output.className = 'output-area success';
        showStatus('JSON 压缩成功 ✓', 'success');
        
        copyToClipboard(compressed);
    } catch (e) {
        output.style.display = 'block';
        output.textContent = e.message;
        output.className = 'output-area error';
        showStatus('JSON 格式错误: ' + e.message, 'error');
    }
}

/**
 * Validate JSON
 */
function validateJson() {
    const input = document.getElementById('json-input').value;
    const output = document.getElementById('json-output');
    const status = document.getElementById('status-message');
    
    if (!input.trim()) {
        showStatus('请输入 JSON 数据', 'error');
        return;
    }
    
    try {
        const parsed = JSON.parse(input);
        
        output.style.display = 'block';
        output.innerHTML = syntaxHighlight(JSON.stringify(parsed, null, 2));
        output.className = 'output-area success';
        
        const type = getJsonType(parsed);
        showStatus(`JSON 校验通过 ✓ (类型: ${type}, 键数: ${Object.keys(parsed).length})`, 'success');
    } catch (e) {
        output.style.display = 'block';
        output.textContent = e.message;
        output.className = 'output-area error';
        showStatus('JSON 校验失败: ' + e.message, 'error');
    }
}

/**
 * Show status message
 */
function showStatus(message, type) {
    const status = document.getElementById('status-message');
    if (status) {
        status.textContent = message;
        status.className = 'status ' + type;
        status.style.display = 'block';
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            status.style.display = 'none';
        }, 5000);
    }
}

/**
 * Syntax highlighting for JSON
 */
function syntaxHighlight(json) {
    if (typeof json !== 'string') {
        json = JSON.stringify(json, null, 2);
    }
    
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        let cls = 'json-number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'json-key';
            } else {
                cls = 'json-string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'json-boolean';
        } else if (/null/.test(match)) {
            cls = 'json-null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}

/**
 * Get JSON type
 */
function getJsonType(obj) {
    if (Array.isArray(obj)) return 'Array';
    if (obj === null) return 'null';
    return typeof obj;
}

/**
 * Copy to clipboard
 */
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast('已复制到剪贴板', 'success');
    }).catch(() => {
        // Fallback
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast('已复制到剪贴板', 'success');
    });
}

/**
 * Show toast notification
 */
function showToast(message, type = 'success') {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();
    
    const toast = document.createElement('div');
    toast.className = 'toast ' + type;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => toast.remove(), 3000);
}

/**
 * Convert JSON to TypeScript
 */
function jsonToTypeScript(json, rootName = 'Root') {
    const parsed = typeof json === 'string' ? JSON.parse(json) : json;
    
    function getType(value, key) {
        const name = key.charAt(0).toUpperCase() + key.slice(1);
        
        if (value === null) return 'any';
        if (typeof value === 'string') return 'string';
        if (typeof value === 'number') return Number.isInteger(value) ? 'number' : 'number';
        if (typeof value === 'boolean') return 'boolean';
        if (Array.isArray(value)) {
            if (value.length === 0) return 'any[]';
            const itemType = getType(value[0], 'Item');
            return `${itemType}[]`;
        }
        if (typeof value === 'object') {
            return generateInterface(value, name);
        }
        return 'any';
    }
    
    function generateInterface(obj, name) {
        const lines = [`export interface ${name} {`];
        
        for (const [key, value] of Object.entries(obj)) {
            const type = getType(value, key);
            const optional = Array.isArray(obj) ? '' : '?';
            lines.push(`  ${key}${optional}: ${type};`);
        }
        
        lines.push('}');
        return lines.join('\n');
    }
    
    if (Array.isArray(parsed)) {
        if (parsed.length === 0) return 'export type Root = any[];';
        return generateInterface(parsed[0], rootName);
    }
    
    return generateInterface(parsed, rootName);
}

/**
 * Convert JSON to Java
 */
function jsonToJava(json, className = 'Root') {
    const parsed = typeof json === 'string' ? JSON.parse(json) : json;
    
    function getJavaType(value) {
        if (value === null) return 'Object';
        if (typeof value === 'string') return 'String';
        if (typeof value === 'number') return Number.isInteger(value) ? 'Integer' : 'Double';
        if (typeof value === 'boolean') return 'Boolean';
        if (Array.isArray(value)) {
            if (value.length === 0) return 'List<Object>';
            return `List<${getJavaType(value[0])}>`;
        }
        if (typeof value === 'object') {
            return className; // Will be generated
        }
        return 'Object';
    }
    
    function generateClass(obj, name, indent = 0) {
        const spaces = '  '.repeat(indent);
        const lines = [];
        
        // Class declaration
        lines.push(`${spaces}public class ${name} {`);
        
        // Fields
        for (const [key, value] of Object.entries(obj)) {
            const type = getJavaType(value);
            const fieldName = key.charAt(0).toUpperCase() + key.slice(1);
            lines.push(`${spaces}  private ${type} ${key};`);
        }
        
        lines.push('');
        
        // Getters and Setters
        for (const [key, value] of Object.entries(obj)) {
            const type = getJavaType(value);
            const fieldName = key.charAt(0).toUpperCase() + key.slice(1);
            
            // Getter
            lines.push(`${spaces}  public ${type} get${fieldName}() {`);
            lines.push(`${spaces}    return ${key};`);
            lines.push(`${spaces}  }`);
            lines.push('');
            
            // Setter
            lines.push(`${spaces}  public void set${fieldName}(${type} ${key}) {`);
            lines.push(`${spaces}    this.${key} = ${key};`);
            lines.push(`${spaces}  }`);
            lines.push('');
        }
        
        lines.push(`${spaces}}`);
        
        return lines.join('\n');
    }
    
    if (Array.isArray(parsed)) {
        if (parsed.length === 0) return '// Empty array';
        return generateClass(parsed[0], className);
    }
    
    return generateClass(parsed, className);
}

/**
 * Convert JSON to Go
 */
function jsonToGo(json, structName = 'Root') {
    const parsed = typeof json === 'string' ? JSON.parse(json) : json;
    
    function getGoType(value, key) {
        if (value === null) return 'interface{}';
        if (typeof value === 'string') return 'string';
        if (typeof value === 'number') return Number.isInteger(value) ? 'int' : 'float64';
        if (typeof value === 'boolean') return 'bool';
        if (Array.isArray(value)) {
            if (value.length === 0) return '[]interface{}';
            const itemType = getGoType(value[0], 'Item');
            return `[]${itemType}`;
        }
        if (typeof value === 'object') {
            const name = key.charAt(0).toUpperCase() + key.slice(1);
            return generateStruct(value, name);
        }
        return 'interface{}';
    }
    
    function generateStruct(obj, name) {
        const lines = [];
        lines.push(`type ${name} struct {`);
        
        for (const [key, value] of Object.entries(obj)) {
            const fieldName = key.charAt(0).toUpperCase() + key.slice(1);
            const jsonKey = key;
            const goType = getGoType(value, key);
            
            lines.push(`\t${fieldName} ${goType} \`json:"${jsonKey}"\``);
        }
        
        lines.push('}');
        return lines.join('\n');
    }
    
    if (Array.isArray(parsed)) {
        if (parsed.length === 0) return '// Empty array';
        return generateStruct(parsed[0], structName);
    }
    
    return generateStruct(parsed, structName);
}

/**
 * Convert JSON to Python
 */
function jsonToPython(json, className = 'Root') {
    const parsed = typeof json === 'string' ? JSON.parse(json) : json;
    
    function generateClass(obj, name, indent = 0) {
        const spaces = ' '.repeat(indent);
        const lines = [];
        
        lines.push(`${spaces}class ${name}:`);
        lines.push(`${spaces}    def __init__(self):`);
        
        if (Object.keys(obj).length === 0) {
            lines.push(`${spaces}        pass`);
        }
        
        for (const [key, value] of Object.entries(obj)) {
            const type = getPythonType(value);
            lines.push(`${spaces}        self.${key}: ${type} = None`);
        }
        
        lines.push('');
        
        // to_dict method
        lines.push(`${spaces}    def to_dict(self):`);
        lines.push(`${spaces}        return {`);
        for (const [key] of Object.entries(obj)) {
            lines.push(`${spaces}            '${key}': self.${key},`);
        }
        lines.push(`${spaces}        }`);
        
        return lines.join('\n');
    }
    
    function getPythonType(value) {
        if (value === null) return 'Any';
        if (typeof value === 'string') return 'str';
        if (typeof value === 'number') return 'float';
        if (typeof value === 'boolean') return 'bool';
        if (Array.isArray(value)) {
            if (value.length === 0) return 'list';
            return 'list';
        }
        if (typeof value === 'object') return 'dict';
        return 'Any';
    }
    
    if (Array.isArray(parsed)) {
        if (parsed.length === 0) return '# Empty array';
        return generateClass(parsed[0], className);
    }
    
    return generateClass(parsed, className);
}

/**
 * Convert JSON to C#
 */
function jsonToCSharp(json, className = 'Root') {
    const parsed = typeof json === 'string' ? JSON.parse(json) : json;
    
    function getCSharpType(value) {
        if (value === null) return 'object';
        if (typeof value === 'string') return 'string';
        if (typeof value === 'number') return Number.isInteger(value) ? 'int' : 'double';
        if (typeof value === 'boolean') return 'bool';
        if (Array.isArray(value)) {
            if (value.length === 0) return 'object[]';
            return `${getCSharpType(value[0])}[]`;
        }
        if (typeof value === 'object') return className;
        return 'object';
    }
    
    function generateClass(obj, name, indent = 0) {
        const spaces = ' '.repeat(indent);
        const lines = [];
        
        lines.push(`${spaces}public class ${name}`);
        lines.push(`${spaces}{`);
        
        for (const [key, value] of Object.entries(obj)) {
            const type = getCSharpType(value);
            const propName = key.charAt(0).toUpperCase() + key.slice(1);
            lines.push(`${spaces}    public ${type} ${propName} { get; set; }`);
        }
        
        lines.push(`${spaces}}`);
        
        return lines.join('\n');
    }
    
    if (Array.isArray(parsed)) {
        if (parsed.length === 0) return '// Empty array';
        return generateClass(parsed[0], className);
    }
    
    return generateClass(parsed, className);
}

/**
 * Convert JSON to XML
 */
function jsonToXml(json, rootName = 'root') {
    const parsed = typeof json === 'string' ? JSON.parse(json) : json;
    
    function toXml(obj, tagName) {
        let xml = '';
        
        if (Array.isArray(obj)) {
            for (const item of obj) {
                xml += toXml(item, tagName);
            }
        } else if (typeof obj === 'object' && obj !== null) {
            xml += `<${tagName}>`;
            for (const [key, value] of Object.entries(obj)) {
                // Make tag name safe
                const safeTag = key.replace(/[^a-zA-Z0-9_-]/g, '_');
                xml += toXml(value, safeTag);
            }
            xml += `</${tagName}>`;
        } else if (obj === null) {
            xml += `<${tagName}/>`;
        } else {
            xml += `<${tagName}>${escapeXml(obj)}</${tagName}>`;
        }
        
        return xml;
    }
    
    function escapeXml(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&apos;');
    }
    
    return '<?xml version="1.0" encoding="UTF-8"?>\n' + toXml(parsed, rootName);
}

/**
 * Convert JSON to YAML
 */
function jsonToYaml(json, indent = 0) {
    const parsed = typeof json === 'string' ? JSON.parse(json) : json;
    
    function toYaml(obj, indentLevel = 0) {
        const spaces = '  '.repeat(indentLevel);
        let yaml = '';
        
        if (obj === null) {
            yaml += 'null\n';
        } else if (typeof obj === 'boolean') {
            yaml += (obj ? 'true' : 'false') + '\n';
        } else if (typeof obj === 'number') {
            yaml += obj + '\n';
        } else if (typeof obj === 'string') {
            if (obj.includes('\n') || obj.includes(':') || obj.includes('#')) {
                yaml += '|" \n' + obj.split('\n').map(line => '  '.repeat(indentLevel + 1) + line).join('\n') + '\n';
            } else {
                yaml += '"' + obj + '"\n';
            }
        } else if (Array.isArray(obj)) {
            for (const item of obj) {
                yaml += `${spaces}- `;
                if (typeof item === 'object' && item !== null) {
                    yaml += '\n' + toYaml(item, indentLevel + 1);
                } else {
                    yaml += toYaml(item, indentLevel + 1);
                }
            }
        } else if (typeof obj === 'object') {
            for (const [key, value] of Object.entries(obj)) {
                yaml += `${spaces}${key}: `;
                if (typeof value === 'object' && value !== null) {
                    yaml += '\n' + toYaml(value, indentLevel + 1);
                } else {
                    yaml += toYaml(value, indentLevel + 1);
                }
            }
        }
        
        return yaml;
    }
    
    return toYaml(parsed);
}

/**
 * Convert JSON to SQL
 */
function jsonToSql(json, tableName = 'my_table') {
    const parsed = typeof json === 'string' ? JSON.parse(json) : json;
    
    function getSqlType(value) {
        if (value === null) return 'TEXT';
        if (typeof value === 'string') return 'TEXT';
        if (typeof value === 'number') return Number.isInteger(value) ? 'INTEGER' : 'REAL';
        if (typeof value === 'boolean') return 'INTEGER';
        return 'TEXT';
    }
    
    function generateSql(data, name) {
        let sql = '';
        
        // Handle array
        if (Array.isArray(data)) {
            if (data.length === 0) return '-- Empty array';
            
            const item = data[0];
            if (typeof item !== 'object') {
                // Simple array
                return '-- Simple array, use JSON type\nSELECT json_each(\'[' + data.map(v => typeof v === 'string' ? '"' + v + '"' : v).join(',') + ']\');';
            }
            
            // Array of objects
            for (const obj of data) {
                sql += generateSql(obj, name) + '\n';
            }
            return sql;
        }
        
        // Handle object
        if (typeof data === 'object' && data !== null) {
            const columns = [];
            const values = [];
            
            for (const [key, value] of Object.entries(data)) {
                columns.push(key);
                if (value === null) {
                    values.push('NULL');
                } else if (typeof value === 'string') {
                    values.push("'" + value.replace(/'/g, "''") + "'");
                } else if (typeof value === 'boolean') {
                    values.push(value ? '1' : '0');
                } else {
                    values.push(String(value));
                }
            }
            
            sql += `INSERT INTO ${name} (${columns.join(', ')}) VALUES (${values.join(', ')});`;
        }
        
        return sql;
    }
    
    return generateSql(parsed, tableName);
}

/**
 * Convert JSON to CSV
 */
function jsonToCsv(json) {
    const parsed = typeof json === 'string' ? JSON.parse(json) : json;
    
    if (!Array.isArray(parsed) || parsed.length === 0) {
        return '// JSON must be a non-empty array of objects';
    }
    
    // Get all unique keys
    const headers = new Set();
    for (const item of parsed) {
        if (typeof item === 'object' && item !== null) {
            Object.keys(item).forEach(k => headers.add(k));
        }
    }
    
    const headerArray = Array.from(headers);
    const csvLines = [headerArray.join(',')];
    
    for (const item of parsed) {
        if (typeof item === 'object' && item !== null) {
            const row = headerArray.map(h => {
                const value = item[h];
                if (value === null || value === undefined) return '';
                if (typeof value === 'string') {
                    return '"' + value.replace(/"/g, '""') + '"';
                }
                return String(value);
            });
            csvLines.push(row.join(','));
        }
    }
    
    return csvLines.join('\n');
}

/**
 * Tree View for JSON
 */
function jsonToTree(json) {
    const parsed = typeof json === 'string' ? JSON.parse(json) : json;
    
    function buildTree(obj, indent = 0) {
        const spaces = '  '.repeat(indent);
        let html = '';
        
        if (obj === null) {
            html += `<span class="tree-null">null</span>`;
        } else if (typeof obj === 'boolean') {
            html += `<span class="tree-boolean">${obj}</span>`;
        } else if (typeof obj === 'number') {
            html += `<span class="tree-number">${obj}</span>`;
        } else if (typeof obj === 'string') {
            html += `<span class="tree-string">"${obj}"</span>`;
        } else if (Array.isArray(obj)) {
            if (obj.length === 0) {
                html += '<span class="tree-bracket">[]</span>';
            } else {
                html += '<span class="tree-bracket">[</span>\n';
                obj.forEach((item, index) => {
                    html += spaces + '  <div class="tree-node">' + (index + 1) + ': ' + buildTree(item, indent + 1) + '</div>\n';
                });
                html += spaces + '<span class="tree-bracket">]</span>';
            }
        } else if (typeof obj === 'object') {
            const keys = Object.keys(obj);
            if (keys.length === 0) {
                html += '<span class="tree-bracket">{}</span>';
            } else {
                html += '<span class="tree-bracket">{</span>\n';
                keys.forEach((key, index) => {
                    const isLast = index === keys.length - 1;
                    html += spaces + '  <div class="tree-node">';
                    html += `<span class="tree-key">"${key}"</span>: `;
                    html += buildTree(obj[key], indent + 1);
                    if (!isLast) html += ',';
                    html += '</div>\n';
                });
                html += spaces + '<span class="tree-bracket">}</span>';
            }
        }
        
        return html;
    }
    
    return '<div class="tree-view">' + buildTree(parsed) + '</div>';
}

// Export functions globally
window.formatJson = formatJson;
window.compressJson = compressJson;
window.validateJson = validateJson;
window.copyToClipboard = copyToClipboard;
window.jsonToTypeScript = jsonToTypeScript;
window.jsonToJava = jsonToJava;
window.jsonToGo = jsonToGo;
window.jsonToPython = jsonToPython;
window.jsonToCSharp = jsonToCSharp;
window.jsonToXml = jsonToXml;
window.jsonToYaml = jsonToYaml;
window.jsonToSql = jsonToSql;
window.jsonToCsv = jsonToCsv;
window.jsonToTree = jsonToTree;
