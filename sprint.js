var sprintApp = angular.module('sprintApp',['dndLists']);

sprintApp.controller('SprintController', ['$scope', function($scope) {
	// SPRINT MODEL
	$scope.title='Test Sprint';
	$scope.users = {'1':{'id':'1','name':'Steve'}};
	$scope.groups = {'1':{'id':'1','name':'garden','description':'outside stuff'},'2':{'id':'2','name':'house','description':'inside stuff'}};
	$scope.tasks = {
		'1':{'id':'1','name':'sweep paths','group':'1','storyPoints':'d'},
		'2':{'id':'2','name':'weed and feed chestnuts/citrus','group':'1','storyPoints':'2'},
		'3':{'id':'3','name':'poo collect','group':'1','storyPoints':'1'},
		'4':{'id':'4','name':'shed gutter','group':'1','storyPoints':'3'},
		'5':{'id':'5','name':'terrarium','group':'2','storyPoints':'14'},
		'6':{'id':'6','name':'book collection','group':'2','storyPoints':'4'},
		'7':{'id':'7','name':'office','group':'2','storyPoints':'1'}
	};
	$scope.listTypes={'productbacklog':{'name':'Product Backlog','hidden':false},'sprintbacklog':{'name':'Sprint Backlog','hidden':false},'todo':{'name':'Todo','hidden':false},'doing':{'name':'Doing','hidden':true},'done':{'name':'Done','hidden':true}}
	$scope.lists={'productbacklog':{'1':[1,2],'2':[6,7]},'sprintbacklog':{'1':[3,4],'2':[5]},'todo':{},'doing':{},'done':{}};
	
	$scope.droppedItem=[];
	
	$scope.dragStart = function(event) {
		console.log(['dragstart',event]);
	}
	$scope.taskMoved = function(groupedTasks,index,listKey,groupId) {
		console.log(['taskMoved',groupedTasks,index,listKey,groupId]);
		groupedTasks.splice(index, 1); 
		// remove group if empty
		if ($scope.lists[listKey][groupId].length==0) {
			delete $scope.lists[listKey][groupId];
		} 
		console.log('lists after task move');
		console.log($scope.lists);
		return true;
	}
	$scope.taskCopied = function(text) {
		console.log(['taskCopied',text]);
		console.log($scope.lists);
		return true;
	}
	$scope.droppedToItem = function(item,listKey,groupId,droppedItem,event,index,type) {
		console.log(['droppedToItem',listKey,groupId,item,droppedItem,event,index,type]);
		if (type=="storypoint")  {
			$scope.tasks[droppedItem[0]].storyPoints=item;
		}
		$scope.droppedItem=[];
		return true;
	}
	
	$scope.activeSprintGroups = function() {
		var out=[];
		for (var group in $scope.groups) {
			out.push(group.id);
		}
		return out;
	}
	
	$scope.taskDroppedToGroup = function(item,listKey,groupId,droppedItem,event,index,type) {
		console.log(['taskDroppedOnGroup',listKey,groupId,item,droppedItem,event,index,type]);
		//return false;
		if (item!=null && $scope.tasks[item] != null && $scope.tasks[item].group>0) {
			//console.log('dropped item');
			if ($scope.lists[listKey][$scope.tasks[item].group] && Array.isArray($scope.lists[listKey][$scope.tasks[item].group])) {
				$scope.lists[listKey][$scope.tasks[item].group].splice(index-1,0,$scope.tasks[item].id);
			}
		}
		$scope.droppedItem=[];
		return item;
	}
	
	$scope.taskDroppedToList = function(item,listKey,droppedItem,event,index,type) {
		console.log(['taskDropOnList',item,listKey,droppedItem,event,index,type]);
		//return false;
		if (type!=null && type.indexOf('sprintgroup_')!==-1 && item!=null && $scope.tasks[item] != null && $scope.tasks[item].group>0) {
			console.log('dropped item');
			if (!$scope.lists[listKey][$scope.tasks[item].group] || !Array.isArray($scope.lists[listKey][$scope.tasks[item].group])) {
				// create array
				//console.log('create new group in '+listKey)
				$scope.lists[listKey][$scope.tasks[item].group]=[];
			}
			$scope.lists[listKey][$scope.tasks[item].group].unshift($scope.tasks[item].id);
		}
		//console.log('lists after taskdrop to list');
		//console.log($scope.lists);
		$scope.droppedItem=[];
		return item;
	}
	$scope.planMode = function() {
		for (var list in $scope.listTypes) {
			$scope.listTypes[list].hidden=true;
		}	
		$scope.listTypes.productbacklog.hidden=false;
		$scope.listTypes.sprintbacklog.hidden=false;
		$scope.listTypes.todo.hidden=false;
	}
	$scope.actMode = function() {
		for  (var list in $scope.listTypes) {
			$scope.listTypes[list].hidden=true;
		}
		$scope.listTypes.todo.hidden=false;
		$scope.listTypes.doing.hidden=false;
		$scope.listTypes.done.hidden=false;
	}
	$scope.allMode = function() {
		for  (var list in $scope.listTypes) {
			$scope.listTypes[list].hidden=false;
		}	
	}
	console.log('init');
}]);

sprintApp.directive("contenteditable", function() {
  return {
    restrict: "A",
    require: "ngModel",
    link: function(scope, element, attrs, ngModel) {

      function read() {
        ngModel.$setViewValue(element.html());
      }

      ngModel.$render = function() {
        element.html(ngModel.$viewValue || "");
      };

      element.bind("blur keyup change", function() {
        scope.$apply(read);
      });
    }
  };
});
