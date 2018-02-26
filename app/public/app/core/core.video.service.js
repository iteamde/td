(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('videoService', videoService);

    videoService.$inject = ['BASE_URL', '$http', '$location'];

    function videoService(BASE_URL, $http, $location) {
        var defaultElement = '#video';
        var video;
        return {
            playVideo: function(url, element) {
                element = element || defaultElement;
                angular.element(element).find('source').attr('src', url);

                if (video)
                    video.destroy();

                video = new YoutubeVideo({
                    el: angular.element(element)[0]
                });

                video.load().then(function() {
                    angular.element('#video-modal').modal();
                    video.play();
                });

                angular.element('#video-modal').on('hide.bs.modal', function() {
                    video.pause();
                });
            },
            getVideo: function() {
                var apiUrl = BASE_URL + 'video';
                return $http.post(apiUrl, {
                    url: $location.url()
                });
            }
        }
    }
})();
