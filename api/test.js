module.exports = async (req, res) => {
  try {
    console.log('[TEST] Request received:', req.method, req.url);
    console.log('[TEST] Environment check:', {
      MONGO_URI: process.env.MONGO_URI ? 'SET' : 'NOT SET',
      JWT_SECRET: process.env.JWT_SECRET ? 'SET' : 'NOT SET',
      NODE_ENV: process.env.NODE_ENV || 'NOT SET'
    });
    
    res.status(200).json({
      message: 'Test endpoint working',
      method: req.method,
      url: req.url,
      env: {
        MONGO_URI: process.env.MONGO_URI ? 'SET' : 'NOT SET',
        JWT_SECRET: process.env.JWT_SECRET ? 'SET' : 'NOT SET',
        NODE_ENV: process.env.NODE_ENV || 'NOT SET'
      }
    });
  } catch (error) {
    console.error('[TEST] Error:', error.message);
    res.status(500).json({ message: 'Test error', error: error.message });
  }
};
