angular.module('YTP',['appRouting','Video','Player'])
.controller('appCtrl', ['$scope', function($scope){
	$scope.vidArr = [];
	$scope.active = {};
	$scope.active.page = 'video';
	$scope.active.firstTime = true;
	$scope.baseURL = "https://www.youtube.com/embed/";
}])
.filter('trustAsResourceUrl', ['$sce', function($sce) {
    return function(val) {
        return $sce.trustAsResourceUrl(val);
    };
}]);
angular.module('appRouting',['ngRoute'])
.config(['$routeProvider', function($routeProvider){
	$routeProvider
		.when('/player',{
			'templateUrl':'player.html',
			'controller':'PlayerCtrl'
		})
		.when('/addVideo',{
			'templateUrl':'addVideo.html',
			'controller':'VideoCtrl'
		})
		.otherwise({
			redirectTo : '/addVideo'
		});
		// $locationProvider.html5Mode(true);
}]);
angular.module('Video',[])
.controller('VideoCtrl',['$scope', function($scope){
	$scope.active.page = 'video';
	$scope.video = {
		id:'',
		title:'',
		wrongURL: false
	};
	var tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      var firstScriptTag = document.getElementsByTagName('script')[0];
      var secondScriptTag = document.getElementsByTagName('script')[1];
      if(secondScriptTag.src === tag.src){
      	var parent = document.getElementsByTagName('head')[0];
      	parent.removeChild(firstScriptTag);
      	parent.removeChild(secondScriptTag);
      }
      else if(firstScriptTag.src === tag.src){
      	var parent = document.getElementsByTagName('head')[0];
      	parent.removeChild(firstScriptTag);
      }
	$scope.addVideo = function(){
		if($scope.video.id){
			var vidId = '';
			var video = $scope.video;
			if($scope.video.id.includes('youtube.com')){
				vidId = $scope.video.id.split('=')[1];
			}
			else{
				vidId = $scope.video.id;
			}
			$scope.vidArr.push(
				{
					"id": vidId,
					"title": video.title ? video.title : '',
					"start": video.start,
					"end": video.end
				}
			);
			video.id="";
			video.title="";
			video.start="";
			video.end="";
		}
		else{
			return false;
		}
	}
}])
;
angular.module('Player',[])
.controller('PlayerCtrl',['$scope', function($scope){
	$scope.active.page = 'player';
	var index = 0;
    var started = false;
    var first = true;
    $scope.player;
    if($scope.active.firstTime){
    	var tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      var firstScriptTag = document.getElementsByTagName('script')[0];
      $scope.active.firstTime = false;
      if(firstScriptTag.src !== tag.src)
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }
    else{
    	window.onYouTubeIframeAPIReady();
    }
      window.onYouTubeIframeAPIReady = function() {
      	if(YT){
      		$scope.player = new YT.Player('player', {
	          height: '390',
	          width: '640',
	          videoId: '',
	          events: {
	            'onReady': $scope.nextVideo,
	            'onStateChange': $scope.onPlayerStateChange
	          }
	        });
      	}
      }

      //    The API calls this function when the player's state changes.
      //    The function indicates that when playing a video (state=1),
      $scope.onPlayerStateChange = function(event) {
        if (event.data == YT.PlayerState.PLAYING) {
        	started = true;
        }
        else if(event.data === YT.PlayerState.ENDED && (started || first)){
        	$scope.nextVideo();
        	started = false;
        	first = false;
        }
      }
      // $scope.stopVideo = function() {
      //   player.stopVideo();
      // }
      $scope.nextVideo = function(){
      	if($scope.vidArr[index]){
      		vid = $scope.vidArr[index];
      		$scope.player.loadVideoById(
	      		{
	      			videoId:vid.id,
	                startSeconds:vid.start,
		            endSeconds:vid.end
		        }
	        );
	      	index += 1;
      	}
      	else{
      		alert("You've watched all the videos in the library");
      		index = 0;
      	}
      }
}]);