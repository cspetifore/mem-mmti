'use strict';

angular.module('tasks')
	.controller('controllerTaskPublicCommentVetting', controllerTaskPublicCommentVetting);

// -----------------------------------------------------------------------------------
//
// CONTROLLER: Task for Simple Complete
//
// -----------------------------------------------------------------------------------
controllerTaskPublicCommentVetting.$inject = ['$scope', '$rootScope', '_', 'PublicCommentVetting'];
	//
function controllerTaskPublicCommentVetting($scope, $rootScope, _, PublicCommentVetting) {
	var taskPubComVet = this;

	taskPubComVet.data = {comments:[]};
	
	taskPubComVet.finalizeCommentStatus = function(com) {
		// all documents and comment must have a status of not pending.
		var pendingDocument = false;
		// status change in progress
		if (com.eaoStatus !== 'Unvetted') {
			// determine if any documents have yet to be vetted
			_.each(com.documents, function(doc) {
				if (doc.status === 'Unvetted' || !doc.status) {
					pendingDocument = true;
				}
			});
			if (!pendingDocument) {
				// proceed with status change
				switch (com.eaoStatus) {
					case 'Published':
						PublicCommentVetting.setCommentPublish(com._id).then( function(res) {
							com = angular.copy(res.data);
						});
						break;
					case 'Defer':
						PublicCommentVetting.setCommentDefer(com._id).then( function(res) {
							com = angular.copy(res.data);
						});
						break;
					case 'Reject':
						PublicCommentVetting.setCommentReject(com._id).then( function(res) {
							com = angular.copy(res.data);
						});
						break;
				};
				taskPubComVet.fetchNewComment();
				// todo: make sure the handoff is correct to classification

			} else {
				window.alert("Please review all documents before viewing the next comment.");
			}
		} else {
			window.alert("Please review the overall comment and all documents before viewing the next comment.");
		}
	};
	// -----------------------------------------------------------------------------------
	//
	// Get next comment
	//
	// -----------------------------------------------------------------------------------
	taskPubComVet.fetchNewComment = function() {
		taskPubComVet.filter = 'Unvetted';

		PublicCommentVetting.getNextComment(taskPubComVet.project._id).then( function(res) {
			taskPubComVet.data.comments.push(res.data);
			taskPubComVet.activeCommentId = res.data._id;
		});
	};


	// get the task identifier.  (ID + Task Type)
	$scope.$watch('project', function(newValue) {
		if (newValue) {
			taskPubComVet.project = newValue;

			// start the public commenting
			PublicCommentVetting.getStart(newValue._id).then( function(res) {
				taskPubComVet.data.comments = res.data;

				var foundUnvetted = false;
				// if there is an unvetted record, don't pull any more unvetted ones
				_.each( res.data, function(comment) {
					if (comment.eaoStatus === 'Unvetted') foundUnvetted = true;
				});

				if (!foundUnvetted) {
					taskPubComVet.fetchNewComment();
				}
			});

		}
	});

	// get the task identifier.  (ID + Task Type)
	$scope.$watch('anchor', function(newValue) {
		if (newValue) {
			taskPubComVet.anchor = newValue;
		}
	});

	// get the spec item
	$scope.$watch('task', function(newValue) {
		// get item for title
		console.log('task', newValue);
		if (newValue) {
			taskPubComVet.taskId = newValue._id;
			taskPubComVet.task = newValue;
		}
	});

	taskPubComVet.completeTask = function() {
		// validate
		// when ok, broadcast
		console.log('complete', taskPubComVet.item);
		taskPubComVet.item.value = 'Complete';
		$rootScope.$broadcast('resolveItem', {itemId: taskPubComVet.itemId});
	};

}