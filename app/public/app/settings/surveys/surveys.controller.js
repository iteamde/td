(function () {

    'use strict';

    angular
        .module('app.surveys')
        .controller('SurveysController', SurveysController);

    SurveysController.$inject = ['$scope'];

    function SurveysController($scope) {

        var vm = this;

        vm.getScoreSum = function(){
            var sum = 0;
            var countItems = 0;
            vm.questions.forEach(function(item){
                item.question.forEach( function(question){
                    countItems++;
                    sum += question.score;
                });
            })
            return  (sum / countItems).toFixed(2);
        }

        vm.columns = ['Question', 'Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree', 'Don’t Know'];

        vm.questions = [
            {
                title: 'My Job',
                question: [
                    {
                        title: 'I have the tools and resources I need to do my job well.',
                        score: 5
                    },
                    {
                        title: 'Most days, I see positive results because of my work.',
                        score: 4
                    },
                    {
                        title: 'My work is valued by this organization.',
                        score: 4
                    },
                    {
                        title: 'I have received the training I need to do my job well.',
                        score: 4
                    },
                    {
                        title: 'The amount of work I am expected to do is reasonable',
                        score: 4
                    }
                ]
            },
            {
                title: 'My Team',
                question: [
                    {
                        title: 'The people I work with take accountability and ownership for results.',
                        score: 3
                    },
                    {
                        title: 'The people I work with treat me with respect.',
                        score: 4
                    },
                    {
                        title: 'My coworkers and I openly talk about what needs to be done to be more effective.',
                        score: 4
                    }
                ]
            },
            {
                title: 'My Supervisor',
                question: [
                    {
                        title: 'My supervisor helps me understand how my work is important to the organization.',
                        score: 3
                    },
                    {
                        title: 'My supervisor is approachable and easy to talk to.',
                        score: 3
                    },
                    {
                        title: 'My supervisor creates a motivating and energizing workplace.',
                        score: 4
                    },
                    {
                        title: 'My supervisor sets high expectations for our team\'s performance.',
                        score: 5
                    }
                ]
            },
            {
                title: 'My Organization',
                question: [
                    {
                        title: 'The vision and goals of this organization are important to me personally.',
                        score: 4
                    },
                    {
                        title: 'This organization provides attractive opportunities for training and development.',
                        score: 4
                    },
                    {
                        title: 'There are opportunities for my own advancement in this organization.',
                        score: 3
                    },
                    {
                        title: 'My opinions are sought on issues that affect me and my job.',
                        score: 3
                    },
                    {
                        title: 'This organization cares about employees.',
                        score: 4
                    },
                    {
                        title: 'I would recommend this organization as a great place to work.',
                        score: 4
                    }

                ]
            },

        ];





    }


})();