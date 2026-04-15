const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf-8');

const newCSS = `
    :root {
      --bg: #05060A; /* Deep Midnight Black */
      --surface: rgba(255, 255, 255, 0.03);
      --surface2: rgba(255, 255, 255, 0.05);
      --border: rgba(255, 255, 255, 0.08);
      --accent: #5e6ad2;
      --accent2: #0edcf5;
      --accent3: #bf5ef5;
      --text: #ffffff;
      --text-muted: #8b98b0;
      
      --cyan-glow: rgba(14, 220, 245, 0.6);
      --purple-glow: rgba(191, 94, 245, 0.6);
    }
    
    .light-theme {
      --bg: #f5f6f8;
      --surface: #ffffff;
      --surface2: rgba(0, 0, 0, 0.03);
      --border: rgba(0, 0, 0, 0.1);
      --text: #1a1c22;
      --text-muted: #6e7687;
      --cyan-glow: rgba(14, 220, 245, 0.2);
      --purple-glow: rgba(191, 94, 245, 0.2);
    }

    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      background: var(--bg);
      color: var(--text);
      font-family: 'DM Mono', 'Inter', -apple-system, sans-serif;
      overflow: hidden;
      transition: background 0.4s ease, color 0.4s ease;
    }

    /* Dynamic Neon Background Streaks */
    .bg-grid {
      position: fixed; inset: 0; z-index: 0; pointer-events: none;
      background: radial-gradient(circle at 10% 20%, rgba(14,220,245,0.06) 0%, transparent 40%),
                  radial-gradient(circle at 90% 80%, rgba(191,94,245,0.06) 0%, transparent 40%),
                  radial-gradient(circle at 60% 0%, rgba(94,106,210,0.06) 0%, transparent 30%);
    }

    .orb { position: fixed; filter: blur(120px); z-index: 0; border-radius: 50%; opacity: 0.5; }
    .orb-1 { width: 30vw; height: 30vw; background: var(--accent2); top: -10vw; left: -10vw; animation: float1 25s ease-in-out infinite alternate; }
    .orb-2 { width: 40vw; height: 40vw; background: var(--accent3); bottom: -20vw; right: -10vw; animation: float2 30s ease-in-out infinite alternate; }
    
    @keyframes float1 { 100% { transform: translate(15vw, 15vw) scale(1.2); opacity: 0.8; } }
    @keyframes float2 { 100% { transform: translate(-10vw, -10vw) scale(1.1); opacity: 0.8; } }

    .app-container {
      position: relative; z-index: 1; display: flex; width: 100vw; height: 100vh;
      background: rgba(5,6,10,0.4);
      backdrop-filter: blur(80px);
      -webkit-backdrop-filter: blur(80px);
    }

    /* Floating Glass Sidebar */
    .sidebar {
      width: 280px;
      margin: 16px 0 16px 16px;
      border-radius: 24px;
      background: linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%);
      border: 1px solid rgba(255,255,255,0.05);
      border-right: 1px solid rgba(14,220,245,0.15); /* Soft cyan edge */
      box-shadow: 0 10px 40px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1);
      display: flex; flex-direction: column; overflow: hidden;
      transform: translateX(0); transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
      z-index: 100;
    }

    .sidebar-header { padding: 20px; display: flex; flex-direction: column; gap: 20px; border-bottom: 1px solid var(--border); }
    
    .logo-container { display: flex; align-items: center; gap: 12px; }
    .logo-icon {
      width: 36px; height: 36px; border-radius: 12px;
      background: linear-gradient(135deg, var(--accent2), var(--accent3));
      display: flex; align-items: center; justify-content: center;
      font-family: 'Syne', sans-serif; font-weight: 800; font-size: 16px; color: white;
      box-shadow: 0 0 20px rgba(14,220,245,0.4);
    }
    .logo-name { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 20px; letter-spacing: -0.5px; }
    
    .new-chat-btn {
      width: 100%; padding: 12px; border-radius: 14px;
      background: linear-gradient(90deg, rgba(14,220,245,0.1), rgba(191,94,245,0.1));
      border: 1px solid rgba(255,255,255,0.1);
      color: var(--text); font-family: inherit; font-size: 14px; cursor: pointer;
      display: flex; align-items: center; justify-content: center; gap: 8px; font-weight: 600;
      transition: all 0.3s;
    }
    .new-chat-btn:hover {
      background: linear-gradient(90deg, rgba(14,220,245,0.2), rgba(191,94,245,0.2));
      transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    }
    
    .chat-list { flex: 1; overflow-y: auto; padding: 12px; display: flex; flex-direction: column; gap: 4px; }
    .chat-item {
      padding: 12px 14px; border-radius: 12px;
      background: transparent; color: var(--text-muted); font-size: 13px;
      cursor: pointer; border: 1px solid transparent;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
      transition: all 0.2s;
    }
    .chat-item:hover { color: var(--text); background: var(--surface); }
    .chat-item.active {
      color: #fff; background: rgba(14,220,245,0.1);
      border-color: rgba(14,220,245,0.3);
      box-shadow: 0 0 16px rgba(14,220,245,0.1);
    }

    /* Main Chat Stream Container */
    .shell {
      flex: 1; height: 100vh; padding: 20px 40px;
      display: flex; flex-direction: column; position: relative; max-width: 1000px; margin: 0 auto;
    }

    header { display: flex; justify-content: space-between; align-items: center; padding-bottom: 20px; }
    
    .menu-btn {
      display: none; width: 44px; height: 44px; border-radius: 12px;
      background: var(--surface); border: 1px solid var(--border); color: var(--text);
      cursor: pointer; align-items: center; justify-content: center; font-size: 20px;
    }

    .hdr-right { display: flex; align-items: center; gap: 12px; }
    
    .think-toggle {
      padding: 8px 16px; border-radius: 20px;
      background: var(--surface); border: 1px solid var(--border);
      color: var(--text-muted); font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.2s;
    }
    .think-toggle.on {
      background: rgba(191,94,245,0.1); border-color: rgba(191,94,245,0.4); color: #e1a6ff;
      box-shadow: 0 0 12px rgba(191,94,245,0.2);
    }

    .status-pill {
      padding: 8px 16px; border-radius: 20px;
      background: rgba(14,220,245,0.05); border: 1px solid rgba(14,220,245,0.2);
      display: flex; align-items: center; gap: 8px;
    }
    .status-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--accent2); animation: pulse 2s infinite; box-shadow: 0 0 8px var(--accent2); }
    @keyframes pulse { 50% { opacity: 0.5; transform: scale(0.8); } }
    
    .model-select {
      background: transparent; border: none; color: var(--accent2); font-weight: 600; font-family: inherit; font-size: 12px;
      outline: none; cursor: pointer; appearance: none; padding-right: 14px;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%230edcf5'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E");
      background-repeat: no-repeat; background-position: right -4px center; background-size: 16px auto;
    }
    .model-select option { background: #0b0c10; color: #fff; }

    .hero { margin: 40px 0 20px; animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) both; }
    .htitle { font-family: 'Syne', sans-serif; font-weight: 800; font-size: clamp(32px, 5vw, 48px); line-height: 1.1; letter-spacing: -1px; }
    .htitle span { background: linear-gradient(90deg, var(--accent2), var(--accent3)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .hsub { color: var(--text-muted); font-size: 14px; max-width: 500px; margin-top: 12px; line-height: 1.6; }

    .chat-wrap { flex: 1; min-height: 0; display: flex; flex-direction: column; }
    .messages { flex: 1; min-height: 0; overflow-y: auto; padding: 20px 0; display: flex; flex-direction: column; gap: 24px; scrollbar-width: none; }
    .messages::-webkit-scrollbar { display: none; }
    
    .msg { display: flex; flex-direction: column; animation: slideUp 0.4s ease both; max-width: 85%; }
    .msg.user { align-self: flex-end; align-items: flex-end; }
    .msg.ai { align-self: flex-start; align-items: flex-start; }

    .bubble {
      padding: 16px 20px;
      font-size: 14px; line-height: 1.7; word-wrap: break-word; min-width: 0;
      position: relative; z-index: 1;
    }

    /* Glowing Border Radius Effects */
    .msg.user .bubble {
      background: rgba(14,220,245,0.06);
      border: 1px solid rgba(14,220,245,0.4);
      border-radius: 24px 6px 24px 24px;
      color: #fff;
      box-shadow: 0 8px 32px rgba(14,220,245,0.08), inset 0 2px 20px rgba(14,220,245,0.05);
      backdrop-filter: blur(20px);
    }

    .msg.ai .bubble {
      background: rgba(191,94,245,0.06);
      border: 1px solid rgba(191,94,245,0.3);
      border-radius: 6px 24px 24px 24px;
      color: #fff;
      box-shadow: 0 8px 32px rgba(191,94,245,0.08), inset 0 2px 20px rgba(191,94,245,0.05);
      backdrop-filter: blur(20px);
    }

    .bmeta { font-size: 11px; color: var(--text-muted); margin-top: 6px; padding: 0 12px; }
    
    /* Input Area - Floating Pill */
    .input-area { padding: 20px 0 40px; }
    .input-box {
      display: flex; align-items: flex-end; gap: 12px;
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 32px; padding: 12px 12px 12px 24px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.3), inset 0 0 20px rgba(14,220,245,0.05);
      backdrop-filter: blur(30px);
      transition: all 0.3s;
    }
    .input-box:focus-within {
      border-color: rgba(14,220,245,0.5);
      box-shadow: 0 10px 40px rgba(14,220,245,0.15), 0 0 0 4px rgba(14,220,245,0.1);
    }

    #inp {
      flex: 1; background: transparent; border: none; outline: none; color: var(--text);
      font-family: inherit; font-size: 15px; line-height: 1.6; resize: none;
      max-height: 200px; min-height: 24px; margin-bottom: 8px;
    }
    #inp::placeholder { color: rgba(255,255,255,0.3); }

    .btn-send {
      width: 44px; height: 44px; border-radius: 22px; flex-shrink: 0;
      background: linear-gradient(135deg, var(--accent2), var(--accent3));
      border: none; cursor: pointer; color: white;
      display: flex; align-items: center; justify-content: center;
      transition: all 0.2s; box-shadow: 0 6px 20px rgba(14,220,245,0.4);
    }
    .btn-send:hover { transform: scale(1.05); box-shadow: 0 8px 30px rgba(14,220,245,0.6); }
    .btn-send:active { transform: scale(0.95); }
    .btn-send:disabled { opacity: 0.5; filter: grayscale(1); cursor: not-allowed; transform: none; }
    .btn-send svg { width: 18px; height: 18px; stroke-width: 2.5; }

    .think-box {
      background: rgba(0,0,0,0.4); border: 1px solid rgba(191,94,245,0.2);
      border-radius: 12px; padding: 12px 16px; margin-bottom: 12px;
      font-size: 12px; color: #d8b4fe; line-height: 1.6;
    }
    .think-hdr { font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px; cursor: pointer; display: flex; justify-content: space-between; opacity: 0.8; }
    .think-txt { opacity: 0.7; max-height: 150px; overflow-y: auto; scrollbar-width: thin; scrollbar-color: var(--border) transparent;}
    .think-txt.col { max-height: 0; overflow: hidden; margin: 0; }

    .cblink { display: inline-block; width: 3px; height: 16px; background: var(--accent2); margin-left: 4px; animation: blink 1s step-end infinite; }
    @keyframes blink { 50% { opacity: 0; } }
    @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

    /* Code Block Styling Enhancement */
    .bubble pre {
      background: #090a0f; border: 1px solid rgba(255,255,255,0.1); border-radius: 14px;
      padding: 16px; overflow-x: auto; margin: 12px 0; font-family: 'DM Mono', monospace; font-size: 13px; color: #a5f3fc; max-width: 100%;
    }
    .bubble code { background: rgba(255,255,255,0.08); padding: 3px 6px; border-radius: 6px; color: var(--accent2); font-family: 'DM Mono', monospace; }
    .bubble pre code { background: transparent; padding: 0; color: inherit; }

    .empty { height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 20px; opacity: 0.6; }
    .empty-ico { font-size: 48px; filter: drop-shadow(0 0 20px var(--accent2)); }

    @media (max-width: 800px) {
      .sidebar { position: absolute; height: calc(100vh - 32px); transform: translateX(-120%); z-index: 999; box-shadow: 10px 0 40px rgba(0,0,0,0.5); }
      .sidebar.open { transform: translateX(0); }
      .shell { padding: 16px; min-width: 100%; }
      .menu-btn { display: flex; }
      .msg { max-width: 95%; }
      .hero { display: none; }
      .app-container::after { content:''; position: absolute; inset:0; background:rgba(0,0,0,0.5); z-index:900; opacity:0; pointer-events:none; transition:0.3s; }
      .app-container.overlay-active::after { opacity:1; pointer-events:all; }
    }
`;

const styleRegex = /<style>[\s\S]*?<\/style>/;
html = html.replace(styleRegex, \`<style>\n\${newCSS}\n  </style>\`);

// We also need to strip out the logo element in the header and replace it with the new layout
const logoRegex = /<div class="logo-icon">N<\/div>\s*<div>\s*<div class="logo-name">NEXUS<\/div>\s*<div class="logo-tag">Personal Intelligence<\/div>\s*<\/div>/;
html = html.replace(logoRegex, \`<div class="logo-container">
            <div class="logo-icon">N</div>
            <div class="logo-name">NEXUS</div>
          </div>\`);

// Change menu button click to toggle the overlay
html = html.replace(\`onclick="document.getElementById('sidebar').classList.toggle('open')"\`, \`onclick="toggleSidebar()"\`);

// Change the avatar in addUserMsg
html = html.replace(/<div class="avatar user">🧑<\/div>/g, '');
html = html.replace(/<div class="avatar ai">N<\/div>/g, '');
// Since we removed avatar, we need to strip it from the msg HTML entirely
html = html.replace(/<div class="msg-body">/g, '');
html = html.replace(/<\/div>\s*<div class="bmeta">/g, '</div>\n      <div class="bmeta">');
html = html.replace(/<div class="bmeta">\${now\(\)}<\/div>\s*<\/div>/g, '<div class="bmeta">\${now()}</div>');

// Add toggleSidebar func
const jsMods = \`
    function toggleSidebar() {
      const sb = document.getElementById('sidebar');
      const ac = document.querySelector('.app-container');
      sb.classList.toggle('open');
      ac.classList.toggle('overlay-active');
    }
    
    // Close sidebar if clicked outside in mobile
    document.querySelector('.app-container').addEventListener('click', (e) => {
      if (e.target.classList.contains('app-container') && e.target.classList.contains('overlay-active')) {
        toggleSidebar();
      }
    });
\`;
html = html.replace('let isDark = true;', jsMods + '\\n    let isDark = true;');


fs.writeFileSync('index.html', html);
console.log("Stunning Redesign Applied!");
