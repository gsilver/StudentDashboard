'use strict';
/* jshint  strict: true*/
/* global $, errorHandler, _, dashboardApp */

/**
 * Singleton that reads index of external messages and picks one
 */


dashboardApp.factory('DashMessage', function ($http) {
  return {
    getMessageIndex: function (url) {
      return $http.get(url, {cache: true}).then(
        function success(result) {
          return result.data;
        },
        function error(result) {
          return result.errors;
        }
      );
    },
    getMessage: function (url) {
      return $http.get(url, {cache: true}).then(
        function success(result) {
          return result.data;
        },
        function error(result) {
          return result.errors;
        }
      );
    }
  };
});

/**
 * Singleton that does the requests for the courses
 * Inner function uses the URL passed to it
 */

dashboardApp.factory('Courses', function ($http) {
  return {
    getCourses: function (url) {

      return $http.get(url, {cache: true}).then(
        function success(result) {
          if(result.data.Meta.httpStatus !==200){
            result.errors = errorHandler(url, result);
            result.errors.failure = true;
            return result.errors;
          }
          else {
            // the ESB might return a single object if only one course - turn it into an array
            if(result.data.Result.length === undefined) {
              result.data.Result =  [].concat(result.data.Result);
            }
            if (!result.data.Result.length) {
              result.data.Result.message = 'You seem to have no courses this term.';
            }
            $.each(result.data.Result, function (i, l) {
              l.Instructor = _.filter(l.Instructor, function (instructor) {
                return instructor.Role !== 'Dummy';
              });
              $.each(l.Instructor, function (i, l) {
                switch (l.Role) {
                case 'Primary Instructor':
                  l.RoleCode = 1;
                  break;
                case 'Secondary Instructor':
                  l.RoleCode = 2;
                  break;
                case 'Graduate Student Instructor':
                  l.RoleCode = 3;
                  break;
                case 'Faculty Grader':
                  l.RoleCode = 4;
                  break;
                default:
                  l.RoleCode = 4;
                }
              });
            });
            return result.data.Result;
          }
        },
        function error(result) {
          result.errors = errorHandler(url, result);
          result.errors.failure = true;
          return result.errors;
        }
      );
    }
  };
});

/**
 * Singleton that does the requests for the terms
 * Inner function uses the URL passed to it
 */

dashboardApp.factory('Terms', function ($http) {
  return {
    getTerms: function (url) {
      return $http.get(url, {cache: true}).then(
        function success(result) {
         if(result.data.Meta.httpStatus !==200){
            result.errors = errorHandler(url, result);
            result.errors.failure = true;
            return result.errors;
          }
          else {
            return result.data;
          }
        },
        function error(result) {
          result.errors = errorHandler(url, result);
          result.errors.failure = true;
          return result.errors;
        }
      );
    }
  };
});



/**
 * Sigleton fulfils promise requested by Schedule controller for data
 */

dashboardApp.factory('Schedule', function ($http) {
  return {
    getSchedule: function (url) {
      return $http.get(url, {cache: true}).then(
        function success(result) {
          $.each(result.data.getMyClsScheduleResponse.RegisteredClass, function (i, l) {
            var AggrMeeting ='';
            var AggrLocation =[];
            var parseableTime = '';
            if(l.Meeting.length){
              $.each(l.Meeting, function (i, l) {
                  AggrMeeting  = AggrMeeting  + l.Days;
                  AggrLocation.push(l.Location);
                  //console.log(AggrLocation)
                  if (l.Times.split('-')[0].indexOf('PM') !== -1) {
                    var tempTime = parseInt(l.Times.split('-')[0].replace('PM','').split(':')[0]) + 12;
                    parseableTime = tempTime + l.Times.split('-')[0].replace('PM','').split(':')[1];
                  }
                  else  {
                    parseableTime = l.Meeting.Times.split('-')[0].replace('AM','').replace(':','');
                  }

              });    
            } 
            else {
              AggrMeeting = l.Meeting.Days;
              AggrLocation.push(l.Meeting.Location);

              if (l.Meeting.Times.split('-')[0].indexOf('PM') !== -1) {
                var tempTime = parseInt(l.Meeting.Times.split('-')[0].replace('PM','').split(':')[0]) + 12;
                parseableTime = tempTime  + l.Meeting.Times.split('-')[0].replace('PM','').split(':')[1];
              }
              else  {
                parseableTime = l.Meeting.Times.split('-')[0].replace('AM','').replace(':','');
              }
            }
            //console.log(AggrLocation)
            l.Meeting.AggrLocation = AggrLocation;
            if(parseableTime ===''){
              parseableTime = '2500';
            }

            l.parseableTime = parseInt(parseableTime);

            if (AggrMeeting !=='') {
              l.AggrMeeting = AggrMeeting;
            }
            else {
              //might consider explicitly filtering this out
              l.AggrMeeting = 'NA';
            }
          });  
          return result.data.getMyClsScheduleResponse.RegisteredClass;
        },
        function error(result) {
          //do something
        }
      );
    }
  };
});

/**
 * Factory takes a building and returns that building's coordinates
 * All mock data for now. 
 *
 * Building code number is extracted from schedule > building is looked up
 * by building code. coordinates are returned
 *
 * In the ESB this would be a 3 step request process
 *
 * Schedule > Find building id in building list > Use the id the request the coors.
 *
 * We might want to store the building index internally.
 */

dashboardApp.factory('getMapCoords', function ($http) {
  return {
    getCoords: function (building) {
      var url = 'data/buildings/' + _.last(building.split(' ')).toLowerCase() + '.json';
      return $http.get(url, {cache: true}).then(
        function success(result) {
          var coords = {};
          coords.latitude = result.data.Buildings.Building.Latitude;
          coords.longitude = result.data.Buildings.Building.Longitude;
          return coords;
        },
        function error() {
          //do something in case of error
          //result.errors.failure = true;
          //return result.errors;
        }
      );
    }
  };
});

/**
 * Factory to handle paging in the Schedule panel
 */

dashboardApp.factory('pageDay', function () {
  return {
      getDay: function (wdayintnew) {
        //wdayintnew=4; // for testing
        var weekday=new Array(7);
        weekday[1]=['Mo', 'Monday'];
        weekday[2]=['Tu', 'Tuesday'];
        weekday[3]=['We', 'Wednesday'];
        weekday[4]=['Th', 'Thursday'];
        weekday[5]=['Fr', 'Friday'];
        weekday[6]=['Sa', 'Saturday'];
        weekday[7]=['Su', 'Sunday'];
        return  weekday[wdayintnew];
      }
  };
});

/**
 *  Factory to return  the Canvas todo data as promise
 */

dashboardApp.factory('ToDosCanvas', function ($http) {
  return {
    getToDos: function (url) {
      return $http.get(url, {cache: true}).then(
        function success(result) {
          return canvasToDoCleaner(result);
        },
        function error() {
          //console.log('errors');
        }
      );
    }
  };
});

/**
 *  Factory to return  the CTools todo data as promise
*/

dashboardApp.factory('ToDosCTools', function ($http) {
  return {
    getToDos: function (url) {
      return $http.get(url, {cache: true}).then(
        function success(result) {
            return ctoolsToDoCleaner(result);
        },
        function error() {
          //console.log('errors');
        }
      );
    }
  };
});


/**
 * Singleton that does the requests for the UM Events
 * Inner function uses the URL passed to it
 */

dashboardApp.factory('UMEvents', function($http) {
    return {
        getEvents: function(url) {
            return $http.get(url, {
                cache: true
            }).then(
                function success(result) {
                    if (result.status !== 200) {
                        result.errors = errorHandler(url, result);
                        result.errors.failure = true;
                        return result.errors;
                    } else {
                      var categories =[];
                      var tags = [];
                      $.each(result.data, function(i, l) {
                        categories.push(l.event_type);
                        $.each(l.tags, function(i, l) {
                            tags.push(l);
                        });
                      });
                      //use function in utils to count repetitions in array
                      //returns two arrays, 1) uniq sorted values 2) number of repetitions
                      var cr = countReps(categories);
                      //use zip to join the two arrays [a,b] and [1, 2] return [[a,1], [b, 2]]
                      categories = _.zip(cr[0],cr[1]);

                      tags = _.uniq(tags).sort();
                      result.data.categories = {'allCategories': categories};
                      result.data.tags =  {'allTags': tags};
                      return _.toArray(result.data);
                    }
                },
                function error(result) {
                    result.errors = errorHandler(url, result);
                    result.errors.failure = true;
                    return result.errors;
                }
            );
        }
    };
});