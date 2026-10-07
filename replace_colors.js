import fs from 'fs';
import path from 'path';

function walk(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
    });
}

walk('./src', function(filePath) {
    if (filePath.endsWith('.svelte')) {
        let content = fs.readFileSync(filePath, 'utf-8');
        
        let changed = false;
        const replacements = [
            { rx: /color:\s*(?:#1a1a1a|#cfcfcf|#e8e8e8|#adadad|#eaeaea|#e4e4e4|#d8d8d8|#e5e7eb|#ffffff|white|rgb\(217,\s*224,\s*224\))/gi, to: 'color: var(--text)' },
            { rx: /color:\s*(?:#9d9d9d|#707070|#8f8f8f|#b2b2b2|#949494|#d7d7d7|#7a7a7a|#a5a5a5|#8b8b8b|#6f6f6f|gray|#777)/gi, to: 'color: var(--text-muted)' },
            { rx: /background-color:\s*black/gi, to: 'background-color: var(--bg)' },
            { rx: /background:\s*(?:#1f1f1f|#111111)/gi, to: 'background: var(--card-bg)' }
        ];

        for (const { rx, to } of replacements) {
            if (rx.test(content)) {
                content = content.replace(rx, to);
                changed = true;
            }
        }

        // Special case: we don't want to break inline SVGs that need explicit white/black if they depend on theme,
        // but since we are moving to CSS vars, we can change fill="white" to fill="currentColor" or fill="var(--text)".
        if (content.includes('fill: #e5e7eb')) {
            content = content.replace(/fill: #e5e7eb/g, 'fill: var(--text)');
            changed = true;
        }

        if (changed) {
            fs.writeFileSync(filePath, content, 'utf-8');
            console.log(`Updated ${filePath}`);
        }
    }
});
