export async function onRequest(context) {
  const targetUrl = "http://114.130.57.233:8080/T-Sports/tracks-v1a1/mono.m3u8?token=SkQuhAXZxgBan1";
  const baseUrl = "http://114.130.57.233:8080/T-Sports/tracks-v1a1/";

  try {
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/x-mpegURL, video/MP2T',
        'User-Agent': context.request.headers.get('User-Agent') || 'Mozilla/5.0'
      }
    });

    if (!response.ok) return new Response("Source error", { status: response.status });

    let manifestText = await response.text();
    const lines = manifestText.split('\n');
    const updatedLines = lines.map(line => {
      line = line.trim();
      if (line.length > 0 && !line.startsWith('#') && !line.startsWith('http')) {
        return `${baseUrl}${line}?token=SkQuhAXZxgBan1`; 
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
    return new Response("Error processing stream", { status: 500 });
  }
}
