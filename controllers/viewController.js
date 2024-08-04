exports.getWellcome = (req, res) => {
    console.log(req.session);
    const usrid = req.session ? req.session.usrid : null;
    console.log('User ID:', usrid);
    res.status(200).render('welcome', {
        title: 'Well-Come',
        usrid 
    });
}

exports.getLoginForm = (req, res) => {
    res.status(200).render('login', {
        title: 'Login'
    });
}

exports.getSignForm = (req, res) => {
    res.status(200).render('signup', {
        title: 'Sign Up'
    });
}