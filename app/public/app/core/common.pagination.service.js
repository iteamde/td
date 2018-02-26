(function () {
    'use strict';

    angular
        .module('app.core')
        .service('PaginationService', ['$http', function ($http) {
            return {
                /**
                 *
                 */
                config: {
                    peerPage: 10,
                    urlPrefix: ''
                },

                /**
                 * @param obj1
                 * @param obj2
                 */
                merge: function (obj1, obj2) {
                    var obj3 = {};

                    for (var attrname in obj1) {
                        obj3[attrname] = obj1[attrname];
                    }

                    for (var attrname in obj2) {
                        obj3[attrname] = obj2[attrname];
                    }

                    return obj3;
                },

                /**
                 * @param config
                 */
                configure: function (config) {
                    this.config = this.merge(this.config, config);
                },

                /**
                 * @param url
                 * @param config
                 * @returns {{data: Array, totalCount: number, currentPage: number, lastPage: number, sort: string, pageNumbers: number[], isLoadingData: boolean, dataResolver: PaginationService.dataResolver, goToPage: PaginationService.goToPage, goToNext: PaginationService.goToNext, goToPrev: PaginationService.goToPrev, setSort: PaginationService.setSort, setPeerPage: PaginationService.setPeerPage, changeSort: PaginationService.changeSort, getSortIcon: PaginationService.getSortIcon, getPageNumbers: PaginationService.getPageNumbers}}
                 */
                make: function (url, config) {
                    var config = this.merge(this.config, config || {});

                    return {
                        /**
                         *
                         */
                        data: [],

                        /**
                         *
                         */
                        totalCount: 0,

                        /**
                         *
                         */
                        currentPage: 0,

                        /**
                         *
                         */
                        lastPage: 0,

                        /**
                         *
                         */
                        sort: '',

                        /**
                         *
                         */
                        pageNumbers: [0],

                        /**
                         *
                         */
                        isLoadingData: false,

                        /**
                         * @returns {PaginationService}
                         */
                        dataResolver: function () {
                            var self = this;
                            self.isLoadingData = true;

                            $http
                                .get(config.urlPrefix + url + '?offset=' + (self.currentPage * config.peerPage) + '&limit=' + config.peerPage + '&sort=' + self.sort)
                                .then(function (res) {
                                    self.data = res.data.data;

                                    if (typeof self.data !== 'object') {
                                        self.data = [];
                                    }

                                    self.totalCount = parseInt(res.data.total);

                                    if (isNaN(self.totalCount)) {
                                        self.totalCount = 0;
                                    }

                                    self.lastPage = self.totalCount > 0 ? (self.totalCount % config.peerPage ? parseInt(self.totalCount / config.peerPage) : ((self.totalCount / config.peerPage) - 1)) : 0;

                                    if (isNaN(self.lastPage)) {
                                        self.lastPage = 0;
                                    }

                                    self.pageNumbers = self.getPageNumbers();
                                    self.isLoadingData = false;
                                })
                                .catch(function () {
                                    self.isLoadingData = false;
                                });

                            return this;
                        },

                        /**
                         * @param pageNumber
                         */
                        goToPage: function (pageNumber) {
                            pageNumber = parseInt(pageNumber);

                            if (this.currentPage != pageNumber) {
                                this.currentPage = pageNumber;
                                this.dataResolver();
                            }

                            return this;
                        },

                        /**
                         *
                         */
                        goToNext: function () {
                            if (this.currentPage < this.lastPage) {
                                this.currentPage++;
                                this.dataResolver();
                            }

                            return this;
                        },

                        /**
                         *
                         */
                        goToPrev: function () {
                            if (this.currentPage > 0) {
                                this.currentPage--;
                                this.dataResolver();
                            }

                            return this;
                        },

                        /**
                         * @param sort
                         */
                        setSort: function (sort) {
                            this.sort = sort;
                            this.dataResolver();
                            return this;
                        },

                        /**
                         * @param peerPage
                         */
                        setPeerPage: function (peerPage) {
                            config.peerPage = parseInt(peerPage);
                            this.dataResolver();
                            return this;
                        },

                        /**
                         * @param column
                         */
                        changeSort: function (column) {
                            if ('' == this.sort) {
                                this.setSort(column);
                            } else if (this.sort == column) {
                                this.setSort('-' + column);
                            } else if (this.sort == '-' + column) {
                                this.setSort('');
                            } else {
                                this.setSort(column);
                            }

                            return this;
                        },

                        /**
                         * @param column
                         * @param options
                         * @returns {String}
                         */
                        getSortIcon: function (column, options) {
                            if (this.sort == column) {
                                return options.asc;
                            } else if (this.sort == '-' + column) {
                                return options.desc;
                            }

                            return options.no;
                        },

                        /**
                         * @returns {Array}
                         */
                        getPageNumbers: function () {
                            if (this.lastPage < 14) {
                                var min = 0;
                                var max = this.lastPage;
                            } else if (this.currentPage >= 7 && this.lastPage - this.currentPage >= 7) {
                                var min = this.currentPage - 7;
                                var max = this.currentPage + 7;
                            } else if (this.currentPage < 7) {
                                var min = 0;
                                var max = this.currentPage + 7;
                            } else {
                                var min = this.currentPage - 7;
                                var max = this.lastPage;
                            }

                            var result = [];

                            for (var i = min; i <= max; i++) {
                                result.push(i);
                            }

                            return result;
                        }
                    };
                }
            };
        }]);
})();
