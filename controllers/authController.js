const axios = require('axios');

exports.login = async (req, res) => {
    try {
        const { usrid, pw } = req.body;
        const response = await axios.get(
            'https://apex.oracle.com/pls/apex/jasorcel/userservices/login', 
        {
            params: { 
                usrid, 
                pw 
            }
        });

    const data = JSON.parse(response.data.split('\n')[1]);

    if (data.status === 'Success') {
      req.session.usrid = usrid; // Store user ID in session
      res.status(200).json({
        status: 'Success',
        message: 'Logged in successfully!',
      });
    } else {
      res.status(401).json({
        status: 'Error',
        message: 'Invalid USRID or Password!',
      });
    }
  } catch (err) {
    res.status(500).json({
      status: 'Error',
      message: 'An unexpected error occurred.',
    });
  }
};

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    res.redirect('/');
  });
};
