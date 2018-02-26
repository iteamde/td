/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var async = require('async');
require('../config/global');
var apiCallTrack = require('../components/api-call-track');
var HttpResponse = require('../components/http-response');
var EventModel = require('../models/orm-models').Event;
var TranslationModel = require('../models/orm-models').Translation;
var EventCategoryModel = require('../models/orm-models').EventCategory;
module.exports = {
    getEventList: getEventList,
    removeEvent: removeEvent,
    createEvent: createEvent,
    createEventCategory: createEventCategory
};

/**
 * @param {type} req
 * @param {type} res
 * @returns {undefined}
 */
function getEventList(req, res) {
    apiCallTrack(function (trackApi) {
        var userId = req.parentUser ? req.parentUser.trendata_user_id : 1;

        EventCategoryModel.findAll({
            include: [
                {
                    model: EventModel,
                    required: false,
                    where: {
                        $or: [
                            {
                                trendata_event_is_public: 1
                            },
                            {
                                trendata_event_is_public: 0,
                                trendata_event_created_by: userId
                            }
                        ]
                    },
                    attributes: [
                        'trendata_event_id',
                        'trendata_event_start_on',
                        'trendata_event_end_on',
                        'trendata_event_is_public',
                        'trendata_event_title_token',
                        'trendata_event_description_token',
                        'trendata_event_created_by'
                    ]
                }
            ],
            attributes: [
                'trendata_event_category_id',
                'trendata_event_category_title_token'
            ],
            order: [
                ['trendata_event_category_id', 'DESC']
            ]
        }).map(function (category) {
            return Promise.props({
                id:     category.trendata_event_category_id,
                title:  TranslationModel.getTranslation(category.trendata_event_category_title_token),
                events: Promise.map(JSON.parse(JSON.stringify(category.Events)), function (event) {
                    return Promise.props({
                        id:          event.trendata_event_id,
                        start_on:    event.trendata_event_start_on ? event.trendata_event_start_on.substr(0, 10) : null,
                        end_on:      event.trendata_event_end_on ? event.trendata_event_end_on.substr(0, 10) : null,
                        is_public:   event.trendata_event_is_public ? 1 : 0,
                        title:       TranslationModel.getTranslation(event.trendata_event_title_token),
                        description: TranslationModel.getTranslation(event.trendata_event_description_token),
                        created_by:  event.trendata_event_created_by
                    });
                })
            });
        }).then(function (rows) {
            trackApi(req);
            res.json(rows);
        }).catch(function (err) {
            trackApi(req, err);
            res.status(500).json(err.stack);
        });
    });
}

/**
 * @param req
 * @param res
 */
function createEvent(req, res) {
    apiCallTrack(function (trackApi) {
        var titleToken          = global.getUUID();
        var descriptionToken    = global.getUUID();
        var title               = req.body.title || '';
        var description         = req.body.description || '';
        var startDate           = req.body.start_date;
        var endDate             = req.body.end_date;
        var categoryId          = req.body.category_id;
        var isPublic            = req.body.is_public;
        var userId              = req.parentUser ? req.parentUser.trendata_user_id : 1;

        if (! startDate || ! endDate || ! categoryId || ! isPublic.toString()) {
            return res.status(400).json({
                success: false,
                errors: [
                    'Not all fields are filled out'
                ]
            });
        }

        EventCategoryModel.findById(categoryId).then(function (eventCategory) {
            if (! eventCategory) {
                throw new HttpResponse({
                    success: false,
                    errors: [
                        'Event Category not found'
                    ]
                }, 404);
            }
            return eventCategory;
        }).then(function (eventCategory) {
            return Promise.props({
                category: eventCategory,
                event: EventModel.create({
                    trendata_event_created_by: userId,
                    trendata_event_modified_by: userId,
                    trendata_event_title_token: titleToken,
                    trendata_event_description_token: descriptionToken,
                    trendata_event_start_on: startDate.substr(0, 10),
                    trendata_event_end_on: endDate.substr(0, 10),
                    trendata_event_is_public: !!isPublic
                })
            });
        }).then(function (data) {
            return Promise.props({
                addToCategory: data.category.addEvent(data.event),
                category: data.category,
                event: data.event
            });
        }).then(function (data) {
            trackApi(req);
            res.json({
                id: data.event.trendata_event_id,
                title: title,
                description: description,
                start_on: startDate,
                end_on: endDate,
                is_public: isPublic,
                created_by: userId
            });

            TranslationModel.create({
                trendata_translation_text: title,
                trendata_translation_token: titleToken,
                trendata_language_id: 1
            });
            TranslationModel.create({
                trendata_translation_text: description,
                trendata_translation_token: descriptionToken,
                trendata_language_id: 1
            });
        }).catch(HttpResponse, function (err) {
            trackApi(req);
            err.json(res);
        }).catch(function (err) {
            trackApi(req, err);
            res.status(500).json(err.stack);
        });
    });
}

/**
 * @param req
 * @param res
 */
function removeEvent(req, res) {
    apiCallTrack(function (trackApi) {
        var userId = req.parentUser ? req.parentUser.trendata_user_id : 1;
        var eventId = req.params.id;

        EventModel.findByPrimary(eventId).then(function (event) {
            if (! event) {
                throw new HttpResponse({
                    status: 'error',
                    message: 'Event not found'
                }, 404);
            }
            if (event.trendata_event_created_by != userId) {
                throw new HttpResponse({
                    status: 'error',
                    message: 'Forbidden'
                }, 403);
            }
            return event;
        }).then(function (event) {
            return event.destroy();
        }).then(function () {
            res.json({
                status: 'success'
            });
        }).catch(HttpResponse, function (err) {
            err.send(res);
        }).catch(function (err) {
            trackApi(req, err);
            res.status(500).send(err.stack);
        });
    });
}

/**
 * @param req
 * @param res
 */
function createEventCategory(req, res) {
    apiCallTrack(function (trackApi) {
        var userId              = req.parentUser ? req.parentUser.trendata_user_id : 1;
        var titleToken          = global.getUUID();
        var descriptionToken    = global.getUUID();
        var title               = req.body.title;
        var description         = req.body.description;

        if (! title) {
            trackApi(req, new Error('Required parameter missing'));
            return res.status(400).json('Required parameter missing');
        }

        var eventCategoryDetails = {
            trendata_event_category_title_token:        titleToken,
            trendata_event_category_description_token:  descriptionToken,
            trendata_event_category_created_on:         global.getGMTDateTime(),
            trendata_event_category_created_by:         userId
        };

        Promise.all([
            TranslationModel.create({
                trendata_language_id: global.default_language_id,
                trendata_translation_text: title,
                trendata_translation_token: titleToken
            }),
            TranslationModel.create({
                trendata_language_id: global.default_language_id,
                trendata_translation_text: description,
                trendata_translation_token: descriptionToken
            })
        ]).then(function () {
            return EventCategoryModel.create({
                trendata_event_category_title_token:        titleToken,
                trendata_event_category_description_token:  descriptionToken,
                trendata_event_category_created_on:         global.getGMTDateTime(),
                trendata_event_category_created_by:         userId
            });
        }).then(function (row) {
            trackApi(req);
            res.json({
                id: row.trendata_event_category_id,
                title: title,
                description: description
            });
        }).catch(function (err) {
            trackApi(req, err);
            res.status(500).send(err.stack);
        });
    });
}
