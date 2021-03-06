'use strict';

angular.module('confusionApp')

        .value('duScrollDuration', 500)
        .value('duScrollOffset', 30)
        .controller('myCtrl', function($scope, $document) {
            var target = angular.element(document.getElementById('some-id'));
            if ($document.isElementInDocument(target)) {
                $document.scrollToElementAnimated(target);
            }
        })

        .controller('MenuController', ['$scope', 'menuFactory', function($scope, menuFactory) {

            $scope.tab = 1;
            $scope.filtText = '';
            $scope.showDetails = false;
            $scope.showMenu = false;
            $scope.message = "Loading ...";

            $scope.dishes = menuFactory.getDishes().query(
                function(response) {
                    $scope.dishes = response;
                    $scope.showMenu = true;
                },
                function(response) {
                    $scope.message = "Error: "+response.status + " " + response.statusText;
            });

            $scope.select = function(setTab) {
                $scope.tab = setTab;

                if (setTab === 2) {
                    $scope.filtText = "appetizer";
                }
                else if (setTab === 3) {
                    $scope.filtText = "mains";
                }
                else if (setTab === 4) {
                    $scope.filtText = "dessert";
                }
                else {
                    $scope.filtText = "";
                }
            };

            $scope.isSelected = function (checkTab) {
                return ($scope.tab === checkTab);
            };

            $scope.toggleDetails = function() {
                $scope.showDetails = !$scope.showDetails;
            };
        }])

        .controller('ContactController', ['$scope', function($scope) {

            $scope.feedback = {mychannel:"", firstName:"", lastName:"", agree:false, email:"" };

            var channels = [{value:"tel", label:"Tel."}, {value:"Email",label:"Email"}];

            $scope.channels = channels;
            $scope.invalidChannelSelection = false;
        }])


        .controller('FeedbackController', ['$scope', 'feedbackFactory', function($scope, feedbackFactory) {

            $scope.sendFeedback = function() {
                console.log($scope.feedback);

                if ($scope.feedback.agree && ($scope.feedback.mychannel === "")) {
                    $scope.invalidChannelSelection = true;
                    console.log('incorrect');
                }
                else {
                    $scope.invalidChannelSelection = false;
                    feedbackFactory.getFeedback().save($scope.feedback);
                    $scope.feedback = {mychannel:"", firstName:"", lastName:"", agree:false, email:"" };
                    $scope.feedbackForm.$setPristine();
                    console.log($scope.feedback);
                }
            };
        }])

        .controller('DishDetailController', ['$scope', '$stateParams', 'menuFactory', function($scope, $stateParams, menuFactory) {
            $scope.showDish = false;
            $scope.message = "Loading ...";
            $scope.dish = menuFactory.getDishes().get({id: parseInt($stateParams.id, 10)})
                .$promise.then(
                    function(response) {
                        $scope.dish = response;
                        $scope.showDish = true;
                    },
                    function(response) {
                        $scope.message = "Error: "+response.status + " " + response.statusText;
                    }
            );
        }])

        .controller('DishCommentController', ['$scope', 'menuFactory', function($scope, menuFactory) {
            $scope.mycomment = {rating:5, comment:"", author:"", date:""};
            $scope.ratings = [1, 2, 3, 4, 5];

            $scope.submitComment = function () {
                $scope.mycomment.date = new Date().toISOString();
                console.log($scope.mycomment);
                $scope.dish.comments.push($scope.mycomment);

                menuFactory.getDishes().update({id:$scope.dish.id}, $scope.dish);

                $scope.commentForm.$setPristine();
                $scope.mycomment = {rating:5, comment:"", author:"", date:""};
            };
        }])

        .controller('IndexController', ['$scope', 'menuFactory', 'corporateFactory', function($scope, menuFactory, corporateFactory) {
            $scope.showDish = false;
            $scope.message="Loading ...";
            $scope.dish = menuFactory.getDishes().get({id:0})
                .$promise.then(
                    function(response) {
                        $scope.dish = response;
                        $scope.showDish = true;
                    },
                    function(response) {
                        $scope.message = "Error: " + response.status + " " + response.statusText;
                    }
                );

            $scope.showPromotion = false;
            $scope.promotionMessage = "Loading...";
            $scope.promotion = menuFactory.getPromotion(0).get()
                .$promise.then(
                    function(response) {
                        $scope.promotion = response;
                        $scope.showPromotion = true;
                    },
                    function(response) {
                        $scope.promotionMessage = "Error: " + response.status + " " + response.statusText;
                    }
                );

            $scope.showLeader = false;
            $scope.leaderStatus = "Loading...";
            $scope.leader = corporateFactory.getLeader(1).get()
                .$promise.then(
                    function(response) {
                        $scope.leader = response;
                        $scope.showLeader = true;
                    },
                    function(response) {
                      $scope.leaderStatus = "Error: " + response.status + " " + response.statusText;
                    }
                );

        }])

        .controller('AboutController', ['$scope', 'corporateFactory', function($scope, corporateFactory) {

            $scope.showLeaders = false;
            $scope.leadersStatus = "Loading...";
            $scope.leaders = corporateFactory.getLeaders().query(
                function(response) {
                    $scope.leaders = response;
                    $scope.showLeaders = true;
                },
                function(response) {
                    $scope.leadersStatus = "Error: " + response.status + " " + response.statusText;
            });
        }])
;