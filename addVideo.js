angular.module('Video',[])
.controller('VideoCtrl',['$scope', 'checkVideo', function($scope,checkVideo){
	$scope.video.wrongURL = false;
	$scope.video = {
		id:'',
		title:'',
		wrongURL: false
	};
	$scope.addVideo = function(){
		var vidId = '';
		var video = $scope.video;
		if($scope.video.id.includes('youtube.com')){
			vidId = $scope.video.id.split('=')[1];
		}
		else{
			vidId = $scope.video.id;
		}
		var requestObj = {
			id: vidId
		}
		checkVideo(requestObj, function(response){
			if(response.status === 200){
				console.log("Successful");
				$scope.vidArr.push(
					{
						"id": vidId,
						"title": video.title ? video.title : '',
						"start": video.start;
						"end": video.end;
					});
			}
			else{
				$scope.video.wrongURL = true;
				console.log("Error in finding video");
			}
		})
	}
}])
.factory('checkVideo', ['$http', function($http){
	return function(reqObj, callBack){
		reqObj.part = 'snippet';
		var url = 'https://www.googleapis.com/youtube/v3/videos';
		$http.get(url, reqObj)
		.then(function(response){
			callBack(response);
		},
		function(errorData){
			callBack(response);
			console.log("Error in checking requested video.");
		})
	}
}])