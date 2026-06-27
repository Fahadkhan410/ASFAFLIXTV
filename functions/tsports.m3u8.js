export async function onRequest(context) {
  // 1. UPDATE YOUR NEW TOKEN HERE IF EXPIRED
  const targetUrl = "http://114.130.57.233:8080/T-Sports/tracks-v1a1/mono.m3u8?token=SkQuhAXZxgBan1";
  const baseUrl = "http://114.130.57.233:8080/T-Sports/tracks-v1a1/";

  try {
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'Accept': '*/*',
        'Accept-Language': 'en-US,en;q=0.9',
        // Injects standard headers to make Cloudflare look like an ordinary web browser
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Origin': 'http://114.130.57.233:8080',
        'Referer': 'http://114.130.57.233:8080/'
      }
    });

    // If it still fails, it will output the exact error code (e.g. 403 Forbidden / 404 Not Found)
    if (!response.ok) {
      return new Response(`Source Server Error: ${response.status} ${response.statusText}`, { 
        status: 200, // Returning 200 so you can read the error text directly in your browser
        headers: { 'Content-Type': 'text/plain' }
      });
    }

    let manifestText = await response.text();
    const lines = manifestText.split('\n');
    
    // Grabs the current token dynamically from your targetUrl string
    const urlObj = new URL(targetUrl);
    const currentToken = urlObj.searchParams.get('token') || '';

    const updatedLines = lines.map(line => {
      line = line.trim();
      if (line.length > 0 && !line.startsWith('#') && !line.startsWith('http')) {
        return `${baseUrl}${line}?token=${currentToken}`; 
      }
      return line;
    });
    
    return new Response(updatedLines.join('\n'), {
      status: 200,
      headers: {
        'Content-Type': 'application/x-mpegURL',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-cache'
      }
    });

  } catch (error) {
    return new Response(`Fetch Exception: ${error.message}`, { status: 500 });
  }
}
