angular.module('Player',[])
.controller('PlayerCtrl',['$scope', function($scope){
	var index = 0;
    var started = false;
    var first = true;
	var tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      var firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      var player;
      window.onYouTubeIframeAPIReady = function() {
        player = new YT.Player('player', {
          height: '390',
          width: '640',
          videoId: '',
          events: {
            'onReady': $scope.nextVideo,
            'onStateChange': $scope.onPlayerStateChange
          }
        });
      }

      // 4. The API will call this function when the video player is ready.
      // $scope.onPlayerReady = function(event) {
      //   event.target.playVideo();
      // }

      // 5. The API calls this function when the player's state changes.
      //    The function indicates that when playing a video (state=1),
      //    the player should play for six seconds and then stop.
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
      	if(vidArr[index]){
      		vid = vidArr[index];
	      	if(vid.id){
	      		player.loadVideoById({videoId:vid.id,
	                     startSeconds:vid.start,
	                     endSeconds:vid.end});
	      	}
	      	else if(vid.url){
	      		player.loadVideoByUrl({mediaContentUrl:vid.url,
	                     startSeconds:vid.start,
	                     endSeconds:vid.end});
	      	}
	      	index += 1;
      	}
      	else{
      		alert("You've watched all the videos in the library");
      		index = 0;
      	}
      }
}])