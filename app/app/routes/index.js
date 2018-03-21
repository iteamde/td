var express = require('express');
var router = express.Router();

var authMiddleware  = require('../components/auth-middleware');

var authentication  = require('../controllers/authentication');
var metric          = require('../controllers/metric');
var dashboard       = require('../controllers/dashboard');
var user            = require('../controllers/user');
var event           = require('../controllers/event');
var translation     = require('../controllers/translation');
var financialData   = require('../controllers/financial-data');
var common          = require('../controllers/common');
var upload          = require('../controllers/upload');
var subChart        = require('../controllers/sub-chart');
var tag             = require('../controllers/tag');
var connectorCsv    = require('../controllers/connector-csv');
var trackUserActivity = require('../controllers/track-user-activity');
var nlpSearch       = require('../controllers/nlp-search');
var video           = require('../controllers/video');
var share           = require('../controllers/share');
var mail            = require('nodemailer').mail;

var sendmail        = require('sendmail')({
    logger: {
        debug: console.log,
        info: console.info,
        warn: console.warn,
        error: console.error
    },
    silent: false
});

/**
 * @param req
 * @param res
 * @param next
 */
function disableCache(req, res, next) {
    res.set({
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Expires': '-1'
    });

    next();
}

// Authentications Routes
router.post('/login', authentication.login);
router.post('/login-third-party', authentication.thirdPartyAuthorization);
router.get('/logout', authMiddleware, authentication.logout);
router.post('/forgot-password', authentication.forgotPassword);
router.post('/reset-password/:token', authentication.resetPassword);
router.post('/change-password', authMiddleware, authentication.changePassword);

router.get('/dashboard/dashboardlist', authMiddleware, dashboard.getDashboardList); // +
router.get('/dashboard/dashboardcharts', authMiddleware, dashboard.getDashboardCharts); // +
router.post('/dashboard/attach-chart', authMiddleware, dashboard.attachChart); // +
router.post('/dashboard/remove-chart', authMiddleware, dashboard.removeChart); // +
router.post('/dashboard/set-charts-order/:id', authMiddleware, dashboard.setChartsOrder); // ***
router.post('/dashboard/set-chart-size/:id', authMiddleware, dashboard.setChartSize); // ***

router.get('/metrics/metriclist', authMiddleware, metric.getMetricList); // +
router.get('/metrics/metriccharts', authMiddleware, metric.getMetricCharts); // +
router.get('/metrics/similarcharts', authMiddleware, metric.getMetricSimilarCharts);
router.get('/metrics/chartdetails', authMiddleware, metric.getChartDetails); // + (*)
router.get('/metrics/trendline', authMiddleware, metric.getTrendLineChart); // + (*)
router.post('/metrics/set-charts-order/:id', authMiddleware, metric.setChartsOrder); // +

router.get('/sub-chart/:type(drilldown|analytics|predictive)/:id(\\d+)', authMiddleware, subChart.getSubChart);
router.post('/sub-chart/:type(drilldown|analytics|predictive)/:id(\\d+)', authMiddleware, subChart.getSubChart);

router.get('/events/eventlist', authMiddleware, event.getEventList);
router.delete('/events/remove-event/:id(\\d+)', authMiddleware, event.removeEvent);
router.post('/events/createevent', authMiddleware, event.createEvent);
router.post('/events/createeventcategory', authMiddleware, event.createEventCategory); // + (*)

router.get('/user/userlist', authMiddleware, user.getUserList); // +
router.get('/user/get-user/:id', authMiddleware, user.getUser); // +
router.post('/user/addnewuser', authMiddleware, user.addNewUser);
router.post('/user/edituser', authMiddleware, user.editUser);
router.post('/user/uploadImage', user.uploadImage);
router.post('/user/activateUser', authMiddleware, user.activateUser);
router.post('/user/suspendUser', authMiddleware, user.suspendUser); // +
router.post('/user/deleteUser', authMiddleware, user.deleteUser); // +
router.post('/user/user-grid-settings', authMiddleware, user.saveUsersGridSettings); // +

router.get('/tag/get-all-tags', authMiddleware, tag.getAllTags);

router.post('/nlp-search/by-tags', authMiddleware, nlpSearch.searchByTags);

router.get('/financial-data/load-by-year/:year(\\d+)', authMiddleware, financialData.loadByYear); // +
router.post('/financial-data/save-by-year/:year(\\d+)', authMiddleware, financialData.saveByYear); // +

router.get('/translation/:lngId', translation.getTranslations); // +
router.get('/common/load-common-data/:lngId', common.getCommonData);

router.post('/upload/users-tuff-csv', authMiddleware, upload.usersTuffCsv);
router.post('/upload/recruitment-tuff-csv', authMiddleware, upload.recruitmentTuffCsv);

router.get('/connector-csv/last-uploaded-file/:type/:file_type', authMiddleware, connectorCsv.getLastUploadedCsvFile);
router.post('/connector-csv/export-users', authMiddleware, connectorCsv.exportUsersToCsv);
router.post('/connector-csv/export-summary', authMiddleware, connectorCsv.exportSummaryToCsv);
router.get('/connector-csv/download-export/:downloadAs/:file', authMiddleware, connectorCsv.downloadExportedFile);
router.post('/share', disableCache, share.saveChartImage);
router.post('/share/send-email', disableCache, authMiddleware, share.sendEmail);

router.post('/connector-csv/save-settings', authMiddleware, connectorCsv.saveSettings);
router.get('/connector-csv/get-settings', authMiddleware, connectorCsv.getSettings);

router.post('/chart/set-chart-size');
router.post('/track-user-activity', disableCache, trackUserActivity);

router.post('/video', disableCache, authMiddleware, video.getVideo);

router.get('/test', disableCache, require('./test-route'));
router.get('/stat', disableCache, require('./stat'));
router.get('/test-time', disableCache, function (req, res) {
    Promise.delay(5000).then(function () {
        res.json('OK!');
    });
});

module.exports = router;
