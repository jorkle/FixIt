// IP Replacer for code blocks
(function() {
    const DEFAULT_IP = '10.10.x.x'; // Your default/example IP
    const STORAGE_KEY = 'user-ip-address';
    
    // Initialize when DOM is ready
    document.addEventListener('DOMContentLoaded', function() {
        // Only run on pages with code blocks
        const codeBlocks = document.querySelectorAll('pre code, .highlight code');
        if (codeBlocks.length === 0) return;
        
        // Create and insert the IP input box
        createIPInputBox();
        
        // Load saved IP if exists
        const savedIP = localStorage.getItem(STORAGE_KEY);
        if (savedIP) {
            document.getElementById('user-ip-input').value = savedIP;
            replaceIPInCode(DEFAULT_IP, savedIP);
        }
    });
    
    function createIPInputBox() {
        const container = document.createElement('div');
        container.className = 'ip-replacer-container';
        container.innerHTML = `
            <div class="ip-replacer-box">
                <label for="user-ip-input">
                    <strong>Your IP Address:</strong>
                    <span class="ip-help">Enter your IP to personalize code examples</span>
                </label>
                <div class="ip-input-group">
                    <input 
                        type="text" 
                        id="user-ip-input" 
                        placeholder="${DEFAULT_IP}"
                        pattern="^(?:[0-9]{1,3}\\.){3}[0-9]{1,3}$"
                    />
                    <button id="apply-ip-btn">Apply</button>
                    <button id="reset-ip-btn">Reset</button>
                </div>
            </div>
        `;
        
        // Insert after the first heading or at the start of content
        const content = document.querySelector('.content, article, main');
        if (content) {
            const firstHeading = content.querySelector('h1, h2');
            if (firstHeading && firstHeading.nextSibling) {
                firstHeading.parentNode.insertBefore(container, firstHeading.nextSibling);
            } else {
                content.insertBefore(container, content.firstChild);
            }
        }
        
        // Add event listeners
        document.getElementById('apply-ip-btn').addEventListener('click', applyIPReplacement);
        document.getElementById('reset-ip-btn').addEventListener('click', resetIPReplacement);
        document.getElementById('user-ip-input').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                applyIPReplacement();
            }
        });
    }
    
    function applyIPReplacement() {
        const input = document.getElementById('user-ip-input');
        const newIP = input.value.trim();
        
        // Basic IP validation
        const ipPattern = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
        if (!ipPattern.test(newIP)) {
            alert('Please enter a valid IP address (e.g., 192.168.1.1)');
            return;
        }
        
        // Get current IP (either saved one or default)
        const currentIP = localStorage.getItem(STORAGE_KEY) || DEFAULT_IP;
        
        // Replace in code blocks
        replaceIPInCode(currentIP, newIP);
        
        // Save to localStorage
        localStorage.setItem(STORAGE_KEY, newIP);
        
        // Visual feedback
        input.style.borderColor = '#10b981';
        setTimeout(() => {
            input.style.borderColor = '';
        }, 1000);
    }
    
    function resetIPReplacement() {
        const input = document.getElementById('user-ip-input');
        const currentIP = localStorage.getItem(STORAGE_KEY) || DEFAULT_IP;
        
        // Replace back to default
        replaceIPInCode(currentIP, DEFAULT_IP);
        
        // Clear storage and input
        localStorage.removeItem(STORAGE_KEY);
        input.value = '';
        
        // Visual feedback
        input.style.borderColor = '#ef4444';
        setTimeout(() => {
            input.style.borderColor = '';
        }, 1000);
    }
    
    function replaceIPInCode(oldIP, newIP) {
        const codeBlocks = document.querySelectorAll('pre code, .highlight code');
        
        codeBlocks.forEach(block => {
            // Store original content if not already stored
            if (!block.dataset.originalContent) {
                block.dataset.originalContent = block.innerHTML;
            }
            
            // Use original content for replacement to avoid nested replacements
            let content = block.dataset.originalContent;
            
            // Escape special regex characters in IP
            const escapedOldIP = oldIP.replace(/\./g, '\\.');
            const regex = new RegExp(escapedOldIP, 'g');
            
            content = content.replace(regex, newIP);
            block.innerHTML = content;
        });
    }
})();
