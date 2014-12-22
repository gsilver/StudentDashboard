##### Demonstrate approach to testing methods in a module by constructing a tiny class
##### to contain the module.  Two different methods are shown here.
#require 'rubygems'
require 'minitest'
require 'minitest/autorun'
require 'minitest/unit'
# require 'webmock/minitest'
require_relative '../stopwatch'
require_relative '../Logging'


#######################################
## Create the test class
#######################################
class TestModule < Minitest::Test

  # Called before every test method runs. Can be used
  # to set up fixture information.
  def setup
    @s = Stopwatch.new
  end

  # Called after every test method runs. Can be used to tear
  # down fixture information.

  def teardown
    # Do nothing
  end

  def test_1_second
    ### create inline class and include the module under test.

    @s.start
    sleep 1
    e = @s.stop
    puts "e: "+e.inspect
    assert_in_delta(1,e,0.05,"one second wait")

  end

  def test_0_2_second
    ### create inline class and include the module under test.

    @s.start
    sleep 0.2
    e = @s.stop
    #puts "e: "+e.inspect
    assert_in_delta(0.2,e,0.05,"0.2 second wait")

  end

  def test_events
    ### create inline class and include the module under test.

    @s.newEvent
    summary = @s.summary
    puts "summary:" +summary.inspect
    assert_equal(1,summary[1])
    @s.newEvent
    summary = @s.summary
    assert_equal(2,summary[1])


  end

end
