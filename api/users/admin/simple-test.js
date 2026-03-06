module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  
  try {
    console.log('[SIMPLE_TEST] Request received');
    console.log('[SIMPLE_TEST] Method:', req.method);
    console.log('[SIMPLE_TEST] URL:', req.url);
    console.log('[SIMPLE_TEST] Headers:', req.headers);
    console.log('[SIMPLE_TEST] Body:', req.body);
    
    // Just return success without database operations
    res.status(200).json({
      message: 'Simple test successful',
      received: {
        method: req.method,
        url: req.url,
        body: req.body,
        headers: req.headers
      }
    });
    
  } catch (error) {
    console.error('[SIMPLE_TEST] Error:', error.message);
    console.error('[SIMPLE_TEST] Stack:', error.stack);
    res.status(500).json({ message: 'Simple test error', error: error.message });
  }
};
