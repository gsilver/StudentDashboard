$: << File.dirname(__FILE__)
require './courselist'

set :environment, :development

run CourseList.new
# server directory

