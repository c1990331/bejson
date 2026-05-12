/**
 * BeJSON Build Script
 * 
 * 功能：
 *   1. 将公共头部(templates/header.html)和尾部(templates/footer.html)注入所有页面（纯静态HTML，SEO友好）
 *   2. 在所有页面的 <head> 中注入 Google Analytics 代码
 * 
 * 使用方法：node build.js
 */

const fs = require('fs');
const path = require('path');

// ==================== 配置 ====================
const GA_ID = 'G-W77FHC00EK';
const ROOT_DIR = __dirname;

// Google Analytics 代码片段
const GA_SNIPPET = `<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=${GA_ID}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${GA_ID}');
</script>`;

// 读取模板
function loadTemplate(filename) {
    const filePath = path.join(ROOT_DIR, 'templates', filename);
    return fs.readFileSync(filePath, 'utf-8');
}

// 获取所有需要处理的HTML文件（排除templates目录）
function findAllHtmlFiles(dir) {
    let results = [];
    const items = fs.readdirSync(dir);

    for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);

        // 跳过 templates、node_modules、.git 目录
        if (stat.isDirectory() && ['templates', 'node_modules', '.git', '.codebuddy'].includes(item)) {
            continue;
        }

        if (stat.isDirectory()) {
            results = results.concat(findAllHtmlFiles(fullPath));
        } else if (item.endsWith('.html')) {
            results.push(fullPath);
        }
    }

    return results;
}

// 处理单个HTML文件
function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf-8');
    const relPath = path.relative(ROOT_DIR, filePath);
    let modified = false;

    // === 1. 注入/更新 Header ===
    const headerTemplate = loadTemplate('header.html').trim();

    // 模式A: 空占位符 <header id="site-header"></header> -> 替换为完整模板
    if (/<header\s+id="site-header"[^>]*><\/header>/s.test(content)) {
        content = content.replace(
            /<header\s+id="site-header"[^>]*><\/header>/s,
            headerTemplate
        );
        modified = true;
        console.log(`  [Header] 占位符 -> 静态模板: ${relPath}`);
    }
    // 模式B: 已有标准header但内容过时（缺少教程链接或结构不匹配）-> 更新
    else if (/<header[\s\S]*?<\/header>/s.test(content)) {
        const existingHeader = content.match(/<header[\s\S]*?<\/header>/s)[0];
        // 如果缺少"教程"导航项或nav-menu结构，则更新为最新模板
        if (!existingHeader.includes('/learn/') || !existingHeader.includes('nav-menu')) {
            content = content.replace(
                /<header[\s\S]*?<\/header>/s,
                headerTemplate
            );
            modified = true;
            console.log(`  [Header] 内容过时 -> 更新模板: ${relPath}`);
        }
    }

    // === 2. 注入/升级 Footer ===
    const footerTemplate = loadTemplate('footer.html').trim();

    // 模式A: 空占位符 <footer id="site-footer"></footer> -> 完整Footer
    if (/<footer\s+id="site-footer"[^>]*><\/footer>/s.test(content)) {
        content = content.replace(
            /<footer\s+id="site-footer"[^>]*><\/footer>/s,
            footerTemplate
        );
        modified = true;
        console.log(`  [Footer] 占位符 -> 完整Footer: ${relPath}`);
    }
    // 模式B: 简版Footer（只有一行copyright）-> 升级为完整多栏Footer
    else if (/<footer>\s*<div class="container">\s*<div class="footer-bottom">/s.test(content)) {
        content = content.replace(
            /<footer>\s*<div class="container">\s*<div class="footer-bottom">[\s\S]*?<\/footer>/s,
            footerTemplate
        );
        modified = true;
        console.log(`  [Footer] 简版 -> 完整Footer: ${relPath}`);
    }
    // 模式C: 已有完整Footer但可能需要同步更新
    else if (/<footer[\s\S]*?<\/footer>/s.test(content)) {
        const existingFooter = content.match(/<footer[\s\S]*?<\/footer>/s)[0];
        // 如果footer缺少完整的4栏布局则更新
        if (!existingFooter.includes('代码生成') || !existingFooter.includes('格式转换')) {
            content = content.replace(
                /<footer[\s\S]*?<\/footer>/s,
                footerTemplate
            );
            modified = true;
            console.log(`  [Footer] 布局不完整 -> 更新: ${relPath}`);
        }
    }

    // === 3. 注入/检查 Google Analytics ===
    
    // 检查是否已有GA代码（通过GA_ID判断）
    if (!content.includes(GA_ID)) {
        // 在 </head> 前插入GA代码
        if (content.includes('</head>')) {
            content = content.replace('</head>', GA_SNIPPET + '\n</head>');
            modified = true;
            console.log(`  [GA] 注入Google Analytics: ${relPath}`);
        }
    }

    // === 4. 移除旧的 common.js 引用（如果存在）===
    if (content.includes('js/common.js') || content.includes('../js/common.js')) {
        content = content.replace(/\s*<script src=["'](?:\.\.\/)?js\/common\.js["']><\/script>\s*/g, '\n');
        modified = true;
        console.log(`  [Clean] 移除旧 common.js 引用: ${relPath}`);
    }

    // 写回文件
    if (modified) {
        fs.writeFileSync(filePath, content, 'utf-8');
    }

    return modified;
}

// ==================== 主流程 ====================
function main() {
    console.log('========================================');
    console.log(' BeJSON Build Script');
    console.log(' 公共组件注入 + Google Analytics');
    console.log('========================================\n');

    // 确保templates目录存在
    const templatesDir = path.join(ROOT_DIR, 'templates');
    if (!fs.existsSync(templatesDir)) {
        fs.mkdirSync(templatesDir, { recursive: true });
    }

    // 获取所有HTML文件
    const htmlFiles = findAllHtmlFiles(ROOT_DIR);
    console.log(`找到 ${htmlFiles.length} 个HTML文件\n`);

    let updatedCount = 0;
    let skippedCount = 0;

    for (const file of htmlFiles) {
        if (processFile(file)) {
            updatedCount++;
        } else {
            skippedCount++;
        }
    }

    console.log('\n========================================');
    console.log(` 完成! 更新: ${updatedCount} 个, 跳过: ${skippedCount} 个`);
    console.log(' 提示: 修改 templates/header.html 或 footer.html 后重新运行此脚本即可全局同步');
    console.log('========================================');
}

main();
