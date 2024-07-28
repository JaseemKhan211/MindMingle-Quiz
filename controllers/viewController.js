exports.getWellcome = (req, res) => {
    res.status(200).render('welcome', {
        title: 'Well-Come'
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