(function () {

    'use strict';

    angular
        .module('app.connector')
        .controller('ConnectorDetailedController', ConnectorDetailedController);

    ConnectorDetailedController.$inject = [
        '$scope',
        '$uibModal',
        'mockDataService',
        'commonService',
        '$stateParams',
        '$http',
        'BASE_URL',
        'videoService'
    ];

    function ConnectorDetailedController($scope, $uibModal, mockDataService, commonService, $stateParams, $http, BASE_URL, videoService) {

        var vm = this;
        $scope.BASE_URL = BASE_URL;
        $scope.videoUrl;

        videoService.getVideo()
            .success(function(video) {
                if (video)
                    $scope.videoUrl = video.trendata_video_video;
            });

        var init = function() {
            vm.dictionary = defaultDictionary;

            $http.get(BASE_URL + 'connector-csv/get-settings')
                .then(function(response) {
                    if (response.data)
                        vm.dictionary = JSON.parse(response.data);
                });
        }

        vm.uploadData = function() {
            var modalInstance = $uibModal.open({
                animation: false,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                size: 'sm',
                templateUrl: 'app/connector/detailed/connector-detailed.modal.upload.view.html',
                controller: 'ModalUploadController',
                controllerAs: 'vm',
                scope: $scope
            });
        }

        vm.moveCursorToEnd = function(e){
            var copyInputValue = e.target.value;
            e.target.value = '';
            e.target.value = copyInputValue;
        }
        vm.stopDrag = function(e){
            e.target.parentElement.parentElement.removeAttribute("draggable");
        }
        vm.addDrag = function(e){
            e.target.parentElement.parentElement.setAttribute("draggable",true);
        }

        vm.dragEnd = function(item) {
            item.dragging = false;
            vm.saveSettings();
        }

        vm.playVideo = function() {
            videoService.playVideo($scope.videoUrl);
        }

        vm.changeEditing = function(item) {
            if (! item.title) {
                commonService.notification($scope.getTranslation('fields_name_cant_be_empty'), 'warning');
                return;
            }

            if (item.title.toLowerCase().indexOf('custom') === 0) {
                commonService.notification($scope.getTranslation('fields_name_cant_starts_with_custom'), 'warning');
                return;
            }

            var uniqDictionary = _.uniqBy(vm.dictionary, function(item) {
                return item.title.toLowerCase();
            });

            if (uniqDictionary.length !== vm.dictionary.length) {
                commonService.notification($scope.getTranslation('fields_name_must_be_unique'), 'warning');
                return;
            }

            item.editing = ! item.editing;

            if (item.editing) {
                setTimeout(function() {
                    angular.element('.dictionary-item-input:visible').focus();
                });
            } else {
                vm.saveSettings();
            }
        }

        vm.saveSettings = function() {
            _.each(vm.dictionary, function(field) {
                if (field.required)
                    field.use = true;
            });

            $http.post(BASE_URL + 'connector-csv/save-settings', vm.dictionary);
        }

        var defaultDictionary = [
            {
                name: 'First Name',
                title: 'First Name',
                description: 'first_name_data_dictionary_field_description',
                required: true,
                use: true
            },
            {
                name: 'Middle Name',
                title: 'Middle Name',
                description: 'middle_name_data_dictionary_field_description',
                use: true
            },
            {
                name: 'Last Name',
                title: 'Last Name',
                description: 'last_name_data_dictionary_field_description',
                required: true,
                use: true
            },
            {
                name: 'Employee ID',
                title: 'Employee ID',
                description: 'employee_id_data_dictionary_field_description',
                use: true
            },
            {
                name: 'Email',
                title: 'Email',
                description: 'email_data_dictionary_field_description',
                use: true
            },
            {
                name: 'DOB',
                title: 'DOB',
                description: 'dob_data_dictionary_field_description',
                required: true,
                use: true
            },
            {
                name: 'Address (Business)',
                title: 'Address (Business)',
                description: 'address_business_data_dictionary_field_description',
                use: true
            },
            {
                name: 'City (Business)',
                title: 'City (Business)',
                description: 'city_business_data_dictionary_field_description',
                required: true,
                use: true
            },
            {
                name: 'State (Business)',
                title: 'State (Business)',
                description: 'state_business_data_dictionary_field_description',
                required: true,
                use: true
            },
            {
                name: 'Country (Business)',
                title: 'Country (Business)',
                description: 'country_business_data_dictionary_field_description',
                required: true,
                use: true
            },
            {
                name: 'Zip Code (Business)',
                title: 'Zip Code (Business)',
                description: 'zip_code_business_data_dictionary_field_description',
                use: true
            },
            {
                name: 'Address (Personal)',
                title: 'Address (Personal)',
                description: 'address_personal_data_dictionary_field_description',
                use: true
            },
            {
                name: 'City (Personal)',
                title: 'City (Personal)',
                description: 'city_personal_data_dictionary_field_description',
                use: true
            },
            {
                name: 'State (Personal)',
                title: 'State (Personal)',
                description: 'state_personal_data_dictionary_field_description',
                use: true
            },
            {
                name: 'Country (Personal)',
                title: 'Country (Personal)',
                description: 'country_personal_data_dictionary_field_description',
                use: true
            },
            {
                name: 'Zip Code (Personal)',
                title: 'Zip Code (Personal)',
                description: 'zip_code_personal_data_dictionary_field_description',
                use: true
            },
            {
                name: 'Education Level',
                title: 'Education Level',
                description: 'education_level_data_dictionary_field_description',
                use: true
            },
            {
                name: 'Hire Date',
                title: 'Hire Date',
                description: 'hire_date_data_dictionary_field_description',
                required: true,
                use: true
            },
            {
                name: 'Termination Date',
                title: 'Termination Date',
                description: 'termination_date_data_dictionary_field_description',
                use: true
            },
            {
                name: 'Job Level',
                title: 'Job Level',
                description: 'job_level_data_dictionary_field_description',
                required: true,
                use: true
            },
            {
                name: 'Current Job Code',
                title: 'Current Job Code',
                description: 'current_job_code_data_dictionary_field_description',
                required: true,
                use: true
            },
            {
                name: 'Manager Employee ID',
                title: 'Manager Employee ID',
                description: 'manager_employee_id_data_dictionary_field_description',
                use: true
            },
            {
                name: 'Employee Type',
                title: 'Employee Type',
                description: 'employee_type_data_dictionary_field_description',
                required: true,
                use: true
            },
            {
                name: 'Gender',
                title: 'Gender',
                description: 'gender_data_dictionary_field_description',
                required: true,
                use: true
            },
            {
                name: 'Ethnicity',
                title: 'Ethnicity',
                description: 'ethnicity_data_dictionary_field_description',
                use: true
            },
            {
                name: 'Department',
                title: 'Department',
                description: 'department_data_dictionary_field_description',
                required: true,
                use: true
            },
            {
                name: 'Division',
                title: 'Division',
                description: 'division_data_dictionary_field_description',
                use: true
            },
            {
                name: 'Cost Center',
                title: 'Cost Center',
                description: 'cost_center_data_dictionary_field_description',
                use: true
            },
            {
                name: 'Rehire Date',
                title: 'Rehire Date',
                description: 'rehire_date_data_dictionary_field_description',
                use: true
            },
            {
                name: 'Cost per Hire',
                title: 'Cost per Hire',
                description: 'cost_per_hire_data_dictionary_field_description',
                use: true
            },
            {
                name: 'Position Start Date',
                title: 'Position Start Date',
                description: 'position_start_date_data_dictionary_field_description',
                use: true
            },
            {
                name: 'Previous Position Start Date',
                title: 'Previous Position Start Date',
                description: 'previous_position_start_date_data_dictionary_field_description',
                use: true
            },
            {
                name: 'Nationality Country',
                title: 'Nationality Country',
                description: 'nationality_country_data_dictionary_field_description',
                required: true,
                use: true
            },
            {
                name: 'Hire Source',
                title: 'Hire Source',
                description: 'hire_source_data_dictionary_field_description',
                use: true
            },
            {
                name: 'Industry Salary',
                title: 'Industry Salary',
                description: 'industry_salary_data_dictionary_field_description',
                use: true
            },
            {
                name: 'Employee Salary',
                title: 'Employee Salary',
                description: 'employee_salary_data_dictionary_field_description',
                required: true,
                use: true
            },
            {
                name: 'Employee Salary (1 year ago)',
                title: 'Employee Salary (1 year ago)',
                description: 'employee_salary_1_year_ago_data_dictionary_field_description',
                use: true
            },
            {
                name: 'Employee Salary (2 years ago)',
                title: 'Employee Salary (2 years ago)',
                description: 'employee_salary_2_years_ago_data_dictionary_field_description',
                use: true
            },
            {
                name: 'Employee Salary (3 years ago)',
                title: 'Employee Salary (3 years ago)',
                description: 'employee_salary_3_years_ago_data_dictionary_field_description',
                use: true
            },
            {
                name: 'Employee Salary (4 years ago)',
                title: 'Employee Salary (4 years ago)',
                description: 'employee_salary_4_years_ago_data_dictionary_field_description',
                use: true
            },
            {
                name: 'Performance Rating (this year)',
                title: 'Performance Rating (this year)',
                description: 'performance_rating_this_year_data_dictionary_field_description',
                use: true
            },
            {
                name: 'Performance Rating (1 year ago)',
                title: 'Performance Rating (1 year ago)',
                description: 'performance_rating_1_year_ago_data_dictionary_field_description',
                use: true
            },
            {
                name: 'Performance Rating (2 years ago)',
                title: 'Performance Rating (2 years ago)',
                description: 'performance_rating_2_years_ago_data_dictionary_field_description',
                use: true
            },
            {
                name: 'Performance Rating (3 years ago)',
                title: 'Performance Rating (3 years ago)',
                description: 'performance_rating_3_years_ago_data_dictionary_field_description',
                use: true
            },
            {
                name: 'Performance Rating (4 years ago)',
                title: 'Performance Rating (4 years ago)',
                description: 'performance_rating_4_years_ago_data_dictionary_field_description',
                use: true
            },
            {
                name: 'Remote Employee',
                title: 'Remote Employee',
                description: 'remote_employee_data_dictionary_field_description',
                use: true
            },
            {
                name: 'Separation Type',
                title: 'Separation Type',
                description: 'voluntary_termination_data_dictionary_field_description',
                use: true
            },
            {
                name: 'Prof. Development',
                title: 'Prof. Development',
                description: 'prof_development_data_dictionary_field_description',
                use: true
            },
            {
                name: 'Posting Date',
                title: 'Posting Date',
                description: 'posting_date_data_dictionary_field_description',
                use: true
            },
            {
                name: 'Absences',
                title: 'Absences',
                description: 'absences_data_dictionary_field_description',
                use: true
            },
            {
                name: 'Successor Employee ID',
                title: 'Successor Employee ID',
                description: 'successor_employee_id_data_dictionary_field_description',
                use: true
            },
            {
                name: 'Employee Benefit Costs',
                title: 'Employee Benefit Costs',
                description: 'employee_benefit_costs_data_dictionary_field_description',
                use: true
            },
            {
                name: 'Employee Benefit Cost (1 year ago)',
                title: 'Employee Benefit Cost (1 year ago)',
                description: 'employee_benefit_cost_1_year_ago_data_dictionary_field_description',
                use: true
            },
            {
                name: 'Employee Benefit Cost (2 years ago)',
                title: 'Employee Benefit Cost (2 years ago)',
                description: 'employee_benefit_cost_2_years_ago_data_dictionary_field_description',
                use: true
            },
            {
                name: 'Employee Benefit Cost (3 years ago)',
                title: 'Employee Benefit Cost (3 years ago)',
                description: 'employee_benefit_cost_3_years_ago_data_dictionary_field_description',
                use: true
            },
            {
                name: 'Employee Benefit Cost (4 years ago)',
                title: 'Employee Benefit Cost (4 years ago)',
                description: 'employee_benefit_cost_4_years_ago_data_dictionary_field_description',
                use: true
            }
        ];

        init();
    }
})();