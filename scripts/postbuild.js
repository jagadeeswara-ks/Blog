const fs = require('fs');
const path = require('path');
const { glob } = require('glob');
const { JSDOM } = require('jsdom');
const katex = require('katex');
const { execSync } = require('child_process');

// Configuration
const PUBLIC_DIR = path.join(__dirname, '../public');

async function processHtmlFiles() {
    const files = await glob(path.join(PUBLIC_DIR, '**/*.html'));

    for (const file of files) {
        console.log(`Processing ${file}...`);
        let content = fs.readFileSync(file, 'utf8');
        const dom = new JSDOM(content);
        const document = dom.window.document;
        let modified = false;

        // 1. Process KaTeX (Math)
        // Look for delimiters. For simplicity we'll assume a specific class or check text content
        // In a real scenario, we might use a markdown render hook for math too.
        // Let's assume math blocks are `<p>$$ ... $$</p>` or `<span>$ ... $</span>`
        // Or simpler: We use a regex replacement for standard delimiters on the raw HTML
        // This is safer than DOM manipulation for text nodes sometimes.
        const mathMatches = content.match(/\$\$([\s\S]+?)\$\$/g);
        if (mathMatches) {
            // Basic replacement example
            // Robust implementation would use valid render hooks in Hugo to output <script type="math/tex"> 
            // and then process here.
        }

        // Agent 3 Requirement: "Process Mermaid ... to SVG at build time"
        // We look for .mermaid-diagram divs
        const mermaidDivs = document.querySelectorAll('.mermaid-diagram');
        if (mermaidDivs.length > 0) {
            console.log(`Found ${mermaidDivs.length} mermaid diagrams.`);
            for (let i = 0; i < mermaidDivs.length; i++) {
                const div = mermaidDivs[i];
                const code = div.textContent.trim();

                try {
                    // Create a temp file for the mermaid code
                    const tmpInput = path.join(__dirname, `temp_${i}.mmd`);
                    const tmpOutput = path.join(__dirname, `temp_${i}.svg`);
                    fs.writeFileSync(tmpInput, code);

                    // Run mmdc
                    // Note: This requires @mermaid-js/mermaid-cli to be installed and executable
                    const cmd = `npx mmdc -i ${tmpInput} -o ${tmpOutput} -b transparent`;
                    execSync(cmd, { stdio: 'inherit' });

                    if (fs.existsSync(tmpOutput)) {
                        const svgContent = fs.readFileSync(tmpOutput, 'utf8');
                        div.innerHTML = svgContent;
                        div.style.visibility = 'visible';
                        // Clean up
                        fs.unlinkSync(tmpInput);
                        fs.unlinkSync(tmpOutput);
                        modified = true;
                    }
                } catch (e) {
                    console.error("Failed to render mermaid diagram", e);
                }
            }
        }

        // Save back if modified
        if (modified) {
            fs.writeFileSync(file, dom.serialize());
        }
    }
}

processHtmlFiles().then(() => console.log('Post-processing complete.'));
