
<!DOCTYPE html>
<html lang="bn">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EAMiN TV - Premium</title>
    <script src="https://cdn.jsdelivr.net/npm/clappr@latest/dist/clappr.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/level-selector@latest/dist/level-selector.min.js"></script>
    <style>
        body { background: #050505; color: white; margin: 0; font-family: 'Segoe UI', sans-serif; }
        #player-wrapper { width: 100%; aspect-ratio: 16/9; background: #000; border-bottom: 3px solid #ff0000; }
        
        /* ট্যাব ডিজাইন */
        .tab-container { display: flex; gap: 10px; padding: 20px; overflow-x: auto; background: #000; }
        .tab { padding: 8px 20px; background: #111; color: #fff; border: 1px solid #333; border-radius: 8px; cursor: pointer; transition: 0.3s; font-size: 14px; }
        .tab.active { background: #ff0000; border-color: #ff0000; }

        /* গ্রিড এবং কার্ড */
        .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; padding: 20px; }
        
        .channel { 
            background: #ffffff; 
            border-radius: 12px; 
            padding: 15px; 
            aspect-ratio: 1/1; /* বর্গাকার কার্ড */
            display: flex; 
            flex-direction: column; 
            justify-content: center; 
            align-items: center; 
            cursor: pointer; 
            border: 2px solid #ddd;
            transition: 0.3s;
        }

        .channel:hover { border-color: #ff0000; transform: translateY(-5px); box-shadow: 0 5px 15px rgba(255,0,0,0.3); }
        .channel.active-card { border-color: #00ff84; box-shadow: 0 0 15px #00ff84; }

        .channel img { width: 80%; height: 70%; object-fit: contain; pointer-events: none; }
        .ch-name { font-size: 10px; color: #000; margin-top: 10px; font-weight: bold; text-transform: uppercase; }
        
        footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
    </style>
</head>
<body>

    <div id="player-wrapper"></div>
    <div class="tab-container" id="tabs"></div>
    <div class="grid" id="grid"></div>

    <footer>© 2026 EAMiN TV</footer>

<script>
    let player;
    let channelData = {};

    async function loadAll() {
        channelData["Premium"] = [];
        const urls = [
            'https://raw.githubusercontent.com/srhady/tapmad-bd/refs/heads/main/tapmad_bd.m3u',
            'https://raw.githubusercontent.com/srhady/Fancode-bd/refs/heads/main/main_playlist.m3u'
        ];
        for(let url of urls) {
            try {
                const res = await fetch(url);
                const data = await res.text();
                channelData["Premium"].push(...parseM3U(data));
            } catch(e) {}
        }
        const resAyna = await fetch('https://raw.githubusercontent.com/srhady/AynaOTT/refs/heads/main/aynaott.m3u');
        const dataAyna = await resAyna.text();
        parseAyna(dataAyna);
        renderTabs();
    }

    function parseM3U(data) {
        let list = [];
        data.split('\n').forEach((line, i, arr) => {
            if(line.startsWith('#EXTINF')) {
                list.push({ name: line.split(',')[1], logo: line.match(/tvg-logo="(.*?)"/)?.[1] || "", url: arr[i+1] });
            }
        });
        return list;
    }

    function parseAyna(data) {
        let currentGroup = "General";
        data.split('\n').forEach((line, i, arr) => {
            if(line.includes('group-title')) currentGroup = line.match(/group-title="(.*?)"/)?.[1];
            if(line.startsWith('#EXTINF')) {
                if(!channelData[currentGroup]) channelData[currentGroup] = [];
                channelData[currentGroup].push({ name: line.split(',')[1], logo: line.match(/tvg-logo="(.*?)"/)?.[1] || "", url: arr[i+1] });
            }
        });
    }

    function renderTabs() {
        const tabContainer = document.getElementById('tabs');
        Object.keys(channelData).forEach((group, i) => {
            let div = document.createElement('div');
            div.className = 'tab' + (i === 0 ? ' active' : '');
            div.innerText = group;
            div.onclick = () => {
                document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
                div.classList.add('active');
                renderGrid(group);
            };
            tabContainer.appendChild(div);
        });
        renderGrid(Object.keys(channelData)[0]);
    }

    function renderGrid(group) {
        const grid = document.getElementById('grid');
        grid.innerHTML = '';
        channelData[group].forEach(ch => {
            let div = document.createElement('div');
            div.className = 'channel';
            div.onclick = function() {
                document.querySelectorAll('.channel').forEach(c => c.classList.remove('active-card'));
                this.classList.add('active-card');
                play(ch.url);
            };
            div.innerHTML = `<img src="${ch.logo}" onerror="this.src='https://via.placeholder.com/100'"><div class="ch-name">${ch.name.substring(0,12)}</div>`;
            grid.appendChild(div);
        });
    }

    function play(url) {
        if(player) player.destroy();
        player = new Clappr.Player({ source: url, parentId: "#player-wrapper", width: "100%", height: "100%", autoPlay: true });
    }

    loadAll();
</script>
</body>
</html>
