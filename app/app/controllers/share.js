var fs = require('fs');
var path = require('path');
var mailer = require('../components/mailer');

module.exports.saveChartImage = function(req, res) {
    var base64Data = req.body.stream.replace(/^data:image\/png;base64,/, "");
    var file = '/share/chart-' + new Date().getTime() + '.png';
    fs.writeFile(path.resolve(__dirname + '/../../public' + file), base64Data, 'base64', err => {
        if (err)
            return res.status(502).send('Server issue: ' + err.message);

        res.status(200).json({
          filename: file
        });
    });
};

module.exports.sendEmail = function(req, res) {
  _.each(req.body.emails, email => {
        mailer({
            to: email.trim(),
            subject: 'TrenData - ' + req.body.subject,
            html: '<img src="' + req.body.image + '">'
        });
    });

  res.status(200).send('success');
};
